// Espírito de energia: uma linha de luz azul com "vida própria" que ronda os objetos em
// espiral durante todo o 3D, e é ela quem dispara cada passagem da história.
// Determinística: a cauda é a própria trajetória da cabeça no passado recente
// (head(t - s)), então cada quadro depende só de t.
//
// Coreografia (as janelas vêm de film.js, presas aos takes e às animações):
//   acorda no piso e sobe em espiral pela bateria → brinca com o polo e mergulha nele
//   (vira o fio de energia) → renasce na ponta do fio e gira pela transformação → ronda a
//   fonte → passa enrolado pelo painel e entra no borne (vira o traço que desenha a caixa)
//   → renasce na quina e sobe em espiral pela caixa → laça o anel enquanto o grave emerge
//   → faz um "8" pelos graves → pula de corneta em corneta (acendendo cada uma) → corre
//   enrolado pelas réguas de LED (acendendo-as) → ronda o sistema → se enrola cada vez mais
//   rápido (carga) e mergulha no centro na 1ª pancada → explode contra a câmera no choque.
import * as THREE from 'three';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const hash = (k) => {
  const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

const TRAIL = 0.6; // segundos de cauda
const N = 110; // amostras ao longo da cauda
const R = 10; // lados do tubo
const BLEND = 0.15; // meia-largura da transição entre comportamentos

export function createSpirit(scene, W, sparkTex) {
  // ---------- comportamentos (cada um é uma função contínua de t) ----------
  const helix = (cx, cz, r, a, y) => [cx + r * Math.sin(a), y, cz + r * Math.cos(a)];
  const P = W.pole;
  const S = [
    // 1. Acorda rente ao piso, na frente da bateria, e sobe em espiral.
    [-1, W.poleApproach, (t) => helix(0, 0, 1.25 + 0.1 * Math.sin(2.2 * t), 0.2 + 2.4 * t + 0.4 * Math.sin(1.3 * t), 0.06 + 1.05 * seg(t, 0, W.poleApproach) + 0.07 * Math.sin(3.3 * t))],
    // 2. Brinca em laços cada vez menores ao redor do polo e mergulha nele.
    [W.poleApproach, W.poleDive, (t) => {
      const u = clamp((t - W.poleApproach) / (W.poleDive - W.poleApproach));
      const r = 0.42 * Math.pow(1 - u, 1.2);
      const a = 0.75 + 10 * (t - W.poleApproach);
      return [P[0] + r * Math.sin(a), P[1] + 0.05 + 0.18 * (1 - u) * Math.sin(9 * t), P[2] + r * Math.cos(a)];
    }],
    [W.poleDive, W.emergeA, () => [P[0], P[1] + 0.03, P[2]]],
    // 3. Renasce na ponta do fio de energia e gira em espiral pela transformação.
    [W.emergeA, W.fonteOrbit, (t) => {
      const u = t - W.emergeA;
      return helix(0, 0, 0.85 + 0.65 * seg(u, 0, 0.6), 3.4 * u, 0.28 + 0.75 * (0.5 - 0.5 * Math.cos(2.6 * u)));
    }],
    // 4. Ronda a fonte pronta, sem pressa.
    [W.fonteOrbit, W.panel, (t) => {
      const u = t - W.fonteOrbit;
      const a = 3.4 * (W.fonteOrbit - W.emergeA) + 1.9 * u;
      return [1.75 * Math.sin(a), 0.45 + 0.12 * Math.sin(2.5 * u), 1.15 * Math.cos(a)];
    }],
    // 5. Se enrola em volta da frente da fonte (cruza o voltímetro rápido a cada volta),
    //    corre até a saída e entra no borne.
    [W.panel, W.borneDive, (t) => {
      const u = clamp((t - W.panel) / (W.borneDive - W.panel));
      const coil = 1 - seg(u, 0.72, 1);
      const w = 17 * (t - W.panel);
      return [lerp(-1.05, W.borne[0], Math.pow(u, 1.1)), lerp(0.3, W.borne[1], seg(u, 0.7, 1)) + 0.3 * coil * Math.cos(w), lerp(0.66, W.borne[2] + 0.01, seg(u, 0.7, 1)) + 0.27 * coil * Math.sin(w)];
    }],
    [W.borneDive, W.emergeB, () => [W.borne[0], W.borne[1], W.borne[2] + 0.01]],
    // 6. Renasce na quina onde o traço terminou e sobe em espiral pela caixa.
    [W.emergeB, W.ring[0], (t) => {
      const u = t - W.emergeB;
      return helix(0, 0, 1.69 + 0.5 * seg(u, 0, 0.8), 1.18 + 2.6 * u, 0.1 + 1.7 * seg(u, 0, W.ring[0] - W.emergeB) + 0.1 * Math.sin(4 * u));
    }],
    // 7. Laça o anel do grave esquerdo enquanto ele emerge (1,5 volta).
    [W.ring[0], W.ring[1], (t) => {
      const th = -0.9 + ((Math.PI * 3) / (W.ring[1] - W.ring[0])) * (t - W.ring[0]);
      return [W.wooferL[0] + 0.66 * Math.sin(th), W.wooferL[1] + 0.66 * Math.cos(th), 0.82];
    }],
    // 8. Desenha um "8" pelos dois graves.
    [W.ring[1], W.hop[0], (t) => {
      const th = 3.43 + 5.2 * (t - W.ring[1]);
      return [0.85 * Math.sin(th), 0.86 + 0.42 * Math.sin(2 * th), 0.95 + 0.12 * Math.cos(th)];
    }],
    // 9. Pula de corneta em corneta, encostando na boca de cada uma.
    [W.hop[0], W.hop[1], (t) => {
      const u = clamp((t - W.hop[0]) / (W.hop[1] - W.hop[0]));
      const x = lerp(-W.span, W.span, u);
      const ph = (x - W.hornX[0]) / (W.hornX[1] - W.hornX[0]);
      return [x, W.hornY + 0.35 * Math.abs(Math.sin(Math.PI * ph)), W.hornZ + 0.12 * (1 - Math.cos(2 * Math.PI * ph))];
    }],
    // 10. Corre enrolado pela régua de LED de cima, desce e volta pela de baixo.
    [W.ledTop[0], W.ledBot[1], (t) => {
      const c = 0.06;
      const w = 30 * t;
      let x;
      let y;
      if (t < W.ledTop[1]) {
        x = lerp(-W.span, W.span, clamp((t - W.ledTop[0]) / (W.ledTop[1] - W.ledTop[0])));
        y = W.ledY[0];
      } else if (t < W.ledBot[0]) {
        x = W.span;
        y = lerp(W.ledY[0], W.ledY[1], seg(t, W.ledTop[1], W.ledBot[0]));
      } else {
        x = lerp(W.span, -W.span, clamp((t - W.ledBot[0]) / (W.ledBot[1] - W.ledBot[0])));
        y = W.ledY[1];
      }
      return [x, y + c * Math.cos(w), W.ledZ + c * Math.sin(w)];
    }],
    // 11. Ronda o sistema completo, subindo e descendo devagar.
    [W.ledBot[1], W.windup[0], (t) => {
      const u = t - W.ledBot[1];
      return helix(0, 0, 1.8 + 0.5 * seg(u, 0, 1), -1.15 - 1.6 * u, 0.1 + 1.3 * seg(u, 0, 1.2) + 0.25 * Math.sin(2.2 * u));
    }],
    // 12. Carga: a espiral aperta e acelera até mergulhar no centro na 1ª pancada.
    [W.windup[0], W.windup[1], (t) => {
      const d = W.windup[1] - W.windup[0];
      const u = clamp((t - W.windup[0]) / d);
      const tt = t - W.windup[0];
      const a0 = -1.15 - 1.6 * (W.windup[0] - W.ledBot[1]);
      const r = 2.2 * (1 - ease(u));
      const p = helix(0, lerp(0, 0.7, ease(u)), r, a0 - 2.5 * tt - 7 * tt * tt, lerp(1.4, 0.86, ease(u)));
      return p;
    }],
    [W.windup[1], W.shock, () => [0, 0.86, 0.66]],
    // 13. Explode em saca-rolhas contra a câmera, junto com a onda de choque.
    [W.shock, W.end + 1, (t) => {
      const u = clamp((t - W.shock) / (W.end - W.shock));
      const k = u * u;
      const r = 0.3 * u;
      const w = 26 * (t - W.shock);
      return [r * Math.sin(w), lerp(0.86, 1.75, k) + r * Math.cos(w), lerp(0.75, 3.9, k)];
    }],
  ];

  // Mistura contínua: perto de cada fronteira, os dois comportamentos se cruzam.
  function head(t) {
    let x = 0;
    let y = 0;
    let z = 0;
    let wsum = 0;
    for (const [t0, t1, f] of S) {
      const w = seg(t, t0 - BLEND, t0 + BLEND) * (1 - seg(t, t1 - BLEND, t1 + BLEND));
      if (w <= 0) continue;
      const p = f(t);
      x += p[0] * w;
      y += p[1] * w;
      z += p[2] * w;
      wsum += w;
    }
    if (wsum < 1e-6) return [0, 0.86, 0.66];
    // Vida própria: um tremor orgânico que some perto dos mergulhos (onde a pontaria importa).
    const calm = Math.min(1, ...W.touches.map((k) => Math.abs(t - k) / 0.35));
    const wob = 0.045 * calm;
    return [
      x / wsum + wob * (Math.sin(6.3 * t + 0.4) + 0.5 * Math.sin(13.1 * t)),
      y / wsum + wob * (0.8 * Math.sin(5.1 * t + 1.2) + 0.4 * Math.sin(11.7 * t + 0.3)),
      z / wsum + wob * (Math.sin(7.3 * t + 2.1) + 0.4 * Math.sin(12.9 * t + 1)),
    ];
  }

  // Presença: 0 enquanto o espírito está "dentro" de um objeto (virou corrente).
  function presence(t) {
    let p = seg(t, 0.1, 0.6);
    for (const [h0, h1] of W.hidden) p *= 1 - seg(t, h0 - 0.18, h0) * (1 - seg(t, h1, h1 + 0.18));
    return p;
  }

  // ---------- tubo dinâmico (cabeça grossa, cauda fina) ----------
  const tubeMat = (core, glow, gain) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: { uCore: { value: new THREE.Color(core) }, uGlow: { value: new THREE.Color(glow) }, uGain: { value: gain } },
      vertexShader: `attribute float aU; varying float vU; varying vec3 vN; varying vec3 vV;
        void main(){ vU = aU; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uCore; uniform vec3 uGlow; uniform float uGain; varying float vU; varying vec3 vN; varying vec3 vV;
        void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 1.3); float tail = pow(1.0 - vU, 1.25);
          gl_FragColor = vec4(mix(uGlow, uCore, f * f) * uGain, tail * (0.25 + 0.75 * f)); }`,
    });
  function makeTube(mat) {
    const geo = new THREE.BufferGeometry();
    const pos = new THREE.BufferAttribute(new Float32Array(N * R * 3), 3).setUsage(THREE.DynamicDrawUsage);
    const nor = new THREE.BufferAttribute(new Float32Array(N * R * 3), 3).setUsage(THREE.DynamicDrawUsage);
    const au = new Float32Array(N * R);
    const idx = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < R; j++) {
        au[i * R + j] = i / (N - 1);
        if (i < N - 1) {
          const a = i * R + j;
          const b = i * R + ((j + 1) % R);
          const c = (i + 1) * R + j;
          const d = (i + 1) * R + ((j + 1) % R);
          idx.push(a, c, b, b, c, d);
        }
      }
    }
    geo.setIndex(idx);
    geo.setAttribute('position', pos);
    geo.setAttribute('normal', nor);
    geo.setAttribute('aU', new THREE.BufferAttribute(au, 1));
    const m = new THREE.Mesh(geo, mat);
    m.frustumCulled = false;
    m.renderOrder = 5;
    scene.add(m);
    return m;
  }
  const main = makeTube(tubeMat(0xb4d8ff, 0x2a74ff, 1.6)); // azul claro, como o traço da caixa
  const strand = makeTube(tubeMat(0xe2f1ff, 0x5aa0ff, 1.3)); // filamento que gira em volta (espiral)

  const pts = Array.from({ length: N }, () => new THREE.Vector3());
  const spts = Array.from({ length: N }, () => new THREE.Vector3());
  const Tn = Array.from({ length: N }, () => new THREE.Vector3());
  const Nn = Array.from({ length: N }, () => new THREE.Vector3());
  const Bn = Array.from({ length: N }, () => new THREE.Vector3());
  const radii = new Float32Array(N);
  const Y = new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const tmp = new THREE.Vector3();

  // Referencial que transporta a normal ao longo da curva (sem torções bruscas).
  function frames(p) {
    for (let i = 0; i < N; i++) {
      Tn[i].subVectors(p[Math.max(i - 1, 0)], p[Math.min(i + 1, N - 1)]);
      if (Tn[i].lengthSq() < 1e-12) Tn[i].copy(i ? Tn[i - 1] : X);
      Tn[i].normalize();
    }
    Nn[0].crossVectors(Tn[0], Math.abs(Tn[0].y) < 0.9 ? Y : X).normalize();
    for (let i = 1; i < N; i++) {
      Nn[i].copy(Nn[i - 1]).addScaledVector(Tn[i], -Nn[i - 1].dot(Tn[i]));
      if (Nn[i].lengthSq() < 1e-10) Nn[i].crossVectors(Tn[i], Math.abs(Tn[i].y) < 0.9 ? Y : X);
      Nn[i].normalize();
    }
    for (let i = 0; i < N; i++) Bn[i].crossVectors(Tn[i], Nn[i]);
  }
  function writeTube(tube, p, rad) {
    const P = tube.geometry.attributes.position.array;
    const Q = tube.geometry.attributes.normal.array;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < R; j++) {
        const phi = (j / R) * Math.PI * 2;
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        tmp.copy(Nn[i]).multiplyScalar(c).addScaledVector(Bn[i], s);
        const k = (i * R + j) * 3;
        Q[k] = tmp.x;
        Q[k + 1] = tmp.y;
        Q[k + 2] = tmp.z;
        P[k] = p[i].x + tmp.x * rad[i];
        P[k + 1] = p[i].y + tmp.y * rad[i];
        P[k + 2] = p[i].z + tmp.z * rad[i];
      }
    }
    tube.geometry.attributes.position.needsUpdate = true;
    tube.geometry.attributes.normal.needsUpdate = true;
  }

  // ---------- cabeça, faíscas e estrelas de "tchan" ----------
  const additive = { blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false };
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xbfdcff, ...additive }));
  glow.renderOrder = 6;
  scene.add(glow);

  const SPARKS = 48;
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3).setUsage(THREE.DynamicDrawUsage));
  sGeo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(SPARKS), 1).setUsage(THREE.DynamicDrawUsage));
  sGeo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(SPARKS), 1).setUsage(THREE.DynamicDrawUsage));
  const sMat = new THREE.ShaderMaterial({
    ...additive,
    uniforms: { uMap: { value: sparkTex }, uScale: { value: 1000 } },
    vertexShader: `attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale;
      void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / max(-mv.z, 0.05); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform sampler2D uMap; varying float vA;
      void main(){ vec4 c = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(vec3(0.75, 0.9, 1.0) * c.rgb * 1.8, c.a * vA); }`,
  });
  const sparks = new THREE.Points(sGeo, sMat);
  sparks.frustumCulled = false;
  sparks.renderOrder = 6;
  scene.add(sparks);

  // Estrela de quatro pontas: o brilho cartunesco de cada toque.
  const starTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const halo = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    halo.addColorStop(0, 'rgba(255,255,255,0.9)');
    halo.addColorStop(0.18, 'rgba(140,190,255,0.45)');
    halo.addColorStop(1, 'rgba(0,80,255,0)');
    g.fillStyle = halo;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#fff';
    for (const [w, h] of [[10, 126], [126, 10]]) {
      g.beginPath();
      g.moveTo(128, 128 - h);
      g.quadraticCurveTo(128 + w * 0.15, 128 - w * 0.15, 128 + w, 128);
      g.quadraticCurveTo(128 + w * 0.15, 128 + w * 0.15, 128, 128 + h);
      g.quadraticCurveTo(128 - w * 0.15, 128 + w * 0.15, 128 - w, 128);
      g.quadraticCurveTo(128 - w * 0.15, 128 - w * 0.15, 128, 128 - h);
      g.fill();
    }
    return new THREE.CanvasTexture(c);
  })();
  const stars = W.stars.map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, ...additive }));
    s.renderOrder = 7;
    s.visible = false;
    scene.add(s);
    return s;
  });

  // Espessura pela tela: ~10 px de raio na cabeça em qualquer lente/distância, com um
  // mínimo físico para não sumir nos closes nem virar uma faixa enorme.
  const pres = new Float32Array(N);
  const width = new Float32Array(N);
  function update(t, e, camera) {
    const dt = TRAIL / (N - 1);
    const pxr = W.halfH / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    for (let i = 0; i < N; i++) {
      const ti = t - i * dt;
      const h = head(ti);
      pts[i].set(h[0], h[1], h[2]);
      pres[i] = presence(ti);
      width[i] = Math.max(0.012, (10 * pts[i].distanceTo(camera.position)) / pxr);
      radii[i] = width[i] * Math.pow(1 - i / (N - 1), 0.7) * pres[i] + 0.0004;
    }
    frames(pts);
    writeTube(main, pts, radii);
    // Filamento: gira em espiral em volta da linha principal.
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const th = u * 26 - t * 14;
      const off = 2.2 * width[i] * Math.sqrt(1 - u) * pres[i];
      spts[i].copy(pts[i]).addScaledVector(Nn[i], Math.cos(th) * off).addScaledVector(Bn[i], Math.sin(th) * off);
      radii[i] = 0.3 * width[i] * Math.pow(1 - u, 0.6) * pres[i] + 0.0002;
    }
    frames(spts);
    writeTube(strand, spts, radii);
    main.material.uniforms.uGain.value = 1.7 + 1.2 * e;
    strand.material.uniforms.uGain.value = 1.4 + 1.0 * e;

    const p0 = presence(t);
    glow.position.copy(pts[0]);
    glow.scale.setScalar(width[0] * (11 + 1.5 * Math.sin(t * 19)) * p0 + 0.0001);
    glow.visible = p0 > 0.01;

    // Faíscas que se soltam da cauda (nascem numa grade fixa de tempo: determinístico).
    const P = sGeo.attributes.position.array;
    const Sz = sGeo.attributes.aSize.array;
    const A = sGeo.attributes.aAlpha.array;
    const STEP = 0.02;
    const LIFE = 0.75;
    let n = 0;
    for (let k = Math.floor((t - LIFE) / STEP) + 1; k <= Math.floor(t / STEP) && n < SPARKS; k++) {
      const b = k * STEP;
      const pb = presence(b);
      if (pb < 0.3 || hash(k * 3.1) > 0.75) continue;
      const age = t - b;
      const hb = head(b);
      const vx = (hash(k) - 0.5) * 0.9;
      const vy = hash(k + 7.7) * 0.5 + 0.1;
      const vz = (hash(k + 3.3) - 0.5) * 0.9;
      P[n * 3] = hb[0] + vx * age;
      P[n * 3 + 1] = hb[1] + vy * age - 0.6 * age * age;
      P[n * 3 + 2] = hb[2] + vz * age;
      Sz[n] = (0.02 + 0.03 * hash(k + 1.1)) * (1 - age / LIFE);
      A[n] = pb * (1 - age / LIFE);
      n++;
    }
    for (let i = n; i < SPARKS; i++) A[i] = 0;
    sGeo.attributes.position.needsUpdate = true;
    sGeo.attributes.aSize.needsUpdate = true;
    sGeo.attributes.aAlpha.needsUpdate = true;
    sMat.uniforms.uScale.value = W.halfH / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    // "Tchan": estrela que estoura, gira e some a cada toque.
    W.stars.forEach((ev, i) => {
      const age = t - ev.t;
      const on = age >= 0 && age < 0.5;
      stars[i].visible = on;
      if (!on) return;
      const pop = Math.sin(Math.PI * Math.min(1, age / 0.5)) * (1 - age / 0.5) * 1.6 + 0.0001;
      stars[i].position.set(...ev.p);
      stars[i].scale.setScalar(ev.s * pop);
      stars[i].material.rotation = age * 2.5 + i;
      stars[i].material.opacity = 1 - age / 0.5;
    });
  }

  return { update, head, presence };
}
