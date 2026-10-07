// JFA — "Energia que vira som"
// Filme 3D determinístico: cada quadro é função pura do tempo t (segundos).
// Bateria → Fonte → Caixa de som são as MESMAS peças mudando de pose:
// nada aparece por fade; tudo desliza, gira e se encaixa.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { TAKES, END_3D, END_CARD_START, TOTAL } from './timeline.js';

const W = 1920;
const H = 1080;
const BLUE = 0x0068ff;

// ---------- utilidades de tempo ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => x * x * x * (x * (x * 6 - 15) + 10); // smootherstep
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// pseudo-ruído determinístico para o tremor de câmera
const noise = (x) => Math.sin(x * 12.9898) * 0.5 + Math.sin(x * 4.1414 + 1.3) * 0.3 + Math.sin(x * 27.17) * 0.2;

// ---------- renderer / cena ----------
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020306);
scene.fog = new THREE.Fog(0x020306, 7, 16);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

const camera = new THREE.PerspectiveCamera(32, W / H, 0.05, 60);

// ---------- pós-produção ----------
const composer = new EffectComposer(renderer);
composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
// Profundidade de campo: só pesa nos closes (abertura definida por take).
const bokeh = new BokehPass(scene, camera, { focus: 3, aperture: 0.0001, maxblur: 0.008 });
composer.addPass(bokeh);
// Bloom: LEDs, voltímetro, energia e faíscas "vazam" luz.
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.4, 0.45, 0.92);
composer.addPass(bloom);
// Onda de choque do último grave + vinheta + grão de filme.
const finish = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, shock: { value: -1 }, time: { value: 0 }, aspect: { value: W / H } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float shock; uniform float time; uniform float aspect; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + time*37.0) * 43758.5453); }
    void main(){
      vec2 uv = vUv; vec2 c = vec2(0.5, 0.48);
      vec2 d = (uv - c) * vec2(aspect, 1.0);
      float r = length(d);
      float ring = 0.0;
      if (shock >= 0.0) {
        float R = shock * 1.4;
        float w = 0.06 + shock * 0.1;
        ring = exp(-pow((r - R) / w, 2.0));
        uv -= normalize(d + 1e-5) / vec2(aspect, 1.0) * ring * 0.035;
      }
      vec3 col = texture2D(tDiffuse, uv).rgb;
      col += vec3(0.55, 0.75, 1.0) * ring * 0.6 * (1.0 - shock) + vec3(1.0) * pow(max(shock - 0.65, 0.0) / 0.35, 2.0);
      col *= mix(1.0, smoothstep(1.15, 0.35, r), 0.55);
      col += (h(vUv) - 0.5) * 0.025;
      gl_FragColor = vec4(col, 1.0);
    }`,
});
composer.addPass(finish);
composer.addPass(new OutputPass());

// Iluminação de estúdio FIXA durante todo o 3D.
scene.add(new THREE.AmbientLight(0x8899bb, 0.08));
const key = new THREE.SpotLight(0xfff4e8, 140, 20, Math.PI / 7, 0.6, 2);
key.position.set(-3.2, 5.5, 3.6);
key.target.position.set(0, 0.6, 0);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0004;
scene.add(key, key.target);
const rimL = new THREE.SpotLight(0x5f9dff, 120, 20, Math.PI / 6, 0.5, 2);
rimL.position.set(-4, 2.6, -4.5);
rimL.target.position.set(0, 0.8, 0);
scene.add(rimL, rimL.target);
const rimR = new THREE.SpotLight(0xdbe7ff, 90, 20, Math.PI / 6, 0.5, 2);
rimR.position.set(4.2, 3.2, -3.8);
rimR.target.position.set(0, 0.8, 0);
scene.add(rimR, rimR.target);
const top = new THREE.SpotLight(0xffffff, 60, 14, Math.PI / 5, 0.9, 2);
top.position.set(0, 6.5, 0.6);
top.target.position.set(0, 0, 0);
scene.add(top, top.target);

// Piso de estúdio escuro, levemente reflexivo, com vinheta radial.
const floorTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  r.addColorStop(0, '#1a1d24');
  r.addColorStop(0.55, '#090b0f');
  r.addColorStop(1, '#020306');
  g.fillStyle = r;
  g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(14, 96),
  new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0.84 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0.001;
floor.receiveShadow = true;
scene.add(floor);
// Espelho sob o piso: reflexo nítido de estúdio de carro, atenuado pelo piso translúcido.
const mirror = new Reflector(new THREE.CircleGeometry(14, 96), {
  textureWidth: W / 2,
  textureHeight: H / 2,
  color: 0x6a7280,
});
mirror.rotation.x = -Math.PI / 2;
scene.add(mirror);

// Feixes de luz na névoa (a luz continua fixa; só fica visível no ar).
function beam(from, to, radius, opacity) {
  const len = from.distanceTo(to);
  const geo = new THREE.ConeGeometry(radius, len, 64, 1, true);
  geo.translate(0, -len / 2, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { op: { value: opacity }, len: { value: len } },
    vertexShader: 'varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = position.y; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform float op; uniform float len; varying float vY; varying vec3 vN; varying vec3 vV; void main(){ float along = clamp(-vY/len,0.,1.); float edge = pow(abs(dot(vN,vV)),1.5); gl_FragColor = vec4(vec3(0.75,0.85,1.0)*op*edge*(1.-along)*smoothstep(0.,.08,along),1.); }',
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(from);
  m.lookAt(to);
  m.rotateX(-Math.PI / 2);
  scene.add(m);
  return m;
}
beam(key.position, key.target.position, 2.1, 0.03);
beam(top.position, top.target.position, 2.6, 0.022);
beam(rimL.position, rimL.target.position, 1.6, 0.025);

// ---------- materiais ----------
const M = {
  case: new THREE.MeshPhysicalMaterial({ color: 0x15171c, roughness: 0.38, metalness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
  caseSide: new THREE.MeshPhysicalMaterial({ color: 0x0c0d10, roughness: 0.55, metalness: 0.2, clearcoat: 0.3 }),
  alu: new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.28, metalness: 1 }),
  aluDark: new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.35, metalness: 1 }),
  cell: new THREE.MeshStandardMaterial({ color: 0x1b3d7a, roughness: 0.3, metalness: 0.6, emissive: BLUE, emissiveIntensity: 0 }),
  red: new THREE.MeshStandardMaterial({ color: 0xb3121a, roughness: 0.35, metalness: 0.2 }),
  black: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: 0.5 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x0a0a0b, roughness: 0.85 }),
  cone: new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide }),
  cap: new THREE.MeshPhysicalMaterial({ color: 0x1a1c20, roughness: 0.25, metalness: 0.3, clearcoat: 1 }),
  horn: new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.22, metalness: 1, side: THREE.DoubleSide }),
  led: new THREE.MeshStandardMaterial({ color: 0x0a1426, emissive: BLUE, emissiveIntensity: 0, roughness: 0.4 }),
  wave: new THREE.MeshBasicMaterial({ color: 0x2f7dff, transparent: true, opacity: 0, depthWrite: false }),
};

// ---------- texturas com canvas (rótulo da bateria / painel da fonte) ----------
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.redraw = (...a) => {
    draw(c.getContext('2d'), w, h, ...a);
    tex.needsUpdate = true;
  };
  tex.redraw();
  return tex;
}

const batteryLabel = canvasTex(1200, 500, (g, w, h) => {
  g.fillStyle = '#101216';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#0068ff';
  g.fillRect(0, h - 26, w, 26);
  g.fillStyle = '#fff';
  g.font = '150px StretchPro';
  g.fillText('JFA', 70, 230);
  g.font = '300 64px system-ui, sans-serif';
  g.fillStyle = '#cfd8e6';
  g.fillText('E-LÍTIO', 74, 340);
  g.font = '500 44px system-ui, sans-serif';
  g.fillStyle = '#6fa8ff';
  g.fillText('12,8V  ·  100Ah', 74, 410);
});

// O voltímetro faz parte do painel da fonte: a tensão sobe enquanto a energia é entregue.
const psuPanel = canvasTex(1840, 320, (g, w, h, volts = 0, flow = 0) => {
  g.fillStyle = '#0d0f13';
  g.fillRect(0, 0, w, h);
  // display do voltímetro
  g.fillStyle = '#020407';
  g.fillRect(60, 60, 520, 200);
  g.strokeStyle = '#2a2f38';
  g.lineWidth = 6;
  g.strokeRect(60, 60, 520, 200);
  const on = volts > 0.05;
  g.shadowColor = '#2f7dff';
  g.shadowBlur = on ? 28 : 0;
  g.fillStyle = on ? '#7fb4ff' : '#0b1424';
  g.font = '700 150px "DejaVu Sans Mono", monospace';
  g.textAlign = 'right';
  g.fillText(volts.toFixed(1).padStart(4, ' '), 500, 215);
  g.font = '600 60px system-ui, sans-serif';
  g.fillText('V', 560, 215);
  g.shadowBlur = 0;
  g.textAlign = 'left';
  // marca
  g.fillStyle = '#fff';
  g.font = '120px StretchPro';
  g.fillText('JFA', 720, 205);
  // trilha de energia (sai do voltímetro e corre para a saída)
  g.fillStyle = '#121722';
  g.fillRect(1240, 150, 460, 20);
  const grd = g.createLinearGradient(1240, 0, 1700, 0);
  grd.addColorStop(0, '#0068ff');
  grd.addColorStop(1, '#9cc6ff');
  g.fillStyle = grd;
  g.shadowColor = '#2f7dff';
  g.shadowBlur = 24;
  g.fillRect(1240, 150, 460 * flow, 20);
  g.shadowBlur = 0;
  // borne de saída
  g.beginPath();
  g.arc(1760, 160, 36, 0, Math.PI * 2);
  g.fillStyle = flow > 0.98 ? '#4d95ff' : '#1a1f29';
  g.fill();
});

// ---------- peças que se transformam ----------
// Cada peça tem poses nomeadas e uma sequência de transições.
// pose = { p:[x,y,z], r:[x,y,z], s:[x,y,z] }
const parts = [];
function morphPart(obj, poses, steps, opts = {}) {
  obj.castShadow = obj.receiveShadow = true;
  obj.traverse((o) => {
    if (o.isMesh) o.castShadow = o.receiveShadow = true;
  });
  scene.add(obj);
  const part = { obj, poses, steps, spark: opts.spark ? makeSpark() : null, sparkAt: opts.sparkAt };
  parts.push(part);
  return obj;
}
const P = (p, r = [0, 0, 0], s = [1, 1, 1]) => ({ p, r, s });

// Curva "mecânica": destrava (recuo mínimo), pausa, dispara e assenta com leve overshoot.
function mech(x) {
  if (x < 0.14) return -0.035 * Math.sin((Math.PI * x) / 0.14);
  if (x < 0.24) return 0;
  const u = (x - 0.24) / 0.76 - 1;
  return 1 + 2.1 * u * u * u + 1.1 * u * u;
}

// Faísca de encaixe: um ponto de luz que acende na junta quando a peça assenta.
const sparkTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.25, 'rgba(120,180,255,0.8)');
  r.addColorStop(1, 'rgba(0,80,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();
function makeSpark() {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  s.visible = false;
  scene.add(s);
  return s;
}

function applyParts(t) {
  for (const part of parts) {
    const { obj, poses, steps } = part;
    let cur = poses[steps.length ? steps[0].from : 'A'];
    let landed = null;
    for (const st of steps) {
      if (t >= st.t1) {
        cur = poses[st.to];
        landed = st;
        continue;
      }
      if (t > st.t0) {
        const x = clamp((t - st.t0) / (st.t1 - st.t0));
        const k = st.soft ? ease(x) : mech(x);
        const a = poses[st.from];
        const b = poses[st.to];
        const arc = Math.sin(Math.PI * clamp(k));
        const p = lerp3(a.p, b.p, k);
        p[1] += arc * (st.lift || 0);
        if (st.push) p[2] += arc * st.push;
        const r = lerp3(a.r, b.r, k);
        if (st.spin) for (let i = 0; i < 3; i++) r[i] += arc * st.spin[i];
        cur = { p, r, s: lerp3(a.s, b.s, k).map((v) => Math.max(v, 0.001)) };
        landed = null;
      }
      break;
    }
    // Tranco de encaixe: 2–3 quadros de impacto logo depois de assentar.
    const p = [...cur.p];
    const age = landed ? t - landed.t1 : 9;
    if (age < 0.3 && !landed.soft) p[1] -= 0.012 * Math.exp(-age * 30) * Math.cos(age * 90);
    obj.position.set(...p);
    obj.rotation.set(...cur.r);
    obj.scale.set(...cur.s);
    if (part.spark) {
      const on = age < 0.35 && !landed.soft;
      part.spark.visible = on;
      if (on) {
        const k = Math.exp(-age * 9);
        part.spark.position.set(p[0] + (part.sparkAt?.[0] || 0), p[1] + cur.s[1] / 2, p[2] + cur.s[2] / 2);
        part.spark.scale.setScalar(0.35 * k + 0.05);
        part.spark.material.opacity = k;
      }
    }
  }
}

const rbox = (mat, r = 0.035) => new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 4, r), mat);

// Janelas das transformações (ver timeline.js)
const T4 = TAKES.find((k) => k.id === '04');
const T7 = TAKES.find((k) => k.id === '07');
const a0 = T4.start;
const b0 = T7.start;

// Cascas: metades da bateria → corpo da fonte → as duas câmaras da caixa.
for (const side of [-1, 1]) {
  morphPart(
    rbox([M.caseSide, M.caseSide, M.case, M.case, M.case, M.case]),
    {
      A: P([side * 0.4, 0.48, 0], [0, 0, 0], [0.8, 0.92, 0.9]),
      A1: P([side * 0.78, 0.48, 0], [0, side * 0.12, 0], [0.8, 0.92, 0.9]),
      B: P([side * 0.6, 0.27, 0], [0, 0, 0], [1.2, 0.46, 1.3]),
      C: P([side * 0.76, 0.86, 0], [0, 0, 0], [1.5, 1.52, 1.2]),
    },
    [
      { from: 'A', to: 'A1', t0: a0 + 0.1, t1: a0 + 0.8 },
      { from: 'A1', to: 'B', t0: a0 + 1.1, t1: a0 + 2.2, spin: [side * 0.5, 0, 0] },
      { from: 'B', to: 'C', t0: b0 + 0.35, t1: b0 + 1.6, lift: 0.25, spin: [0, side * 0.7, side * 0.25] },
    ],
    { spark: true, sparkAt: [-side * 0.5] },
  );
}

// Tampa: tampa da bateria → tampa da fonte → plataforma das cornetas.
morphPart(
  rbox(M.case, 0.02),
  {
    A: P([0, 0.96, 0], [0, 0, 0], [1.64, 0.08, 0.94]),
    A1: P([0, 2.15, 0], [0, 0, 0], [1.64, 0.08, 0.94]),
    B: P([0, 0.52, 0], [0, 0, 0], [2.44, 0.05, 1.34]),
    B1: P([0, 1.15, 0], [0, 0, 0], [2.44, 0.05, 1.34]),
    C: P([0, 1.65, 0], [0, 0, 0], [3.1, 0.06, 1.26]),
  },
  [
    { from: 'A', to: 'A1', t0: a0, t1: a0 + 0.7 },
    { from: 'A1', to: 'B', t0: a0 + 1.4, t1: a0 + 2.3 },
    { from: 'B', to: 'B1', t0: b0, t1: b0 + 0.6 },
    { from: 'B1', to: 'C', t0: b0 + 0.9, t1: b0 + 1.8 },
  ],
  { spark: true },
);

// Base: fundo da bateria → base da fonte → plinto da caixa.
morphPart(
  rbox(M.aluDark, 0.015),
  {
    A: P([0, 0.02, 0], [0, 0, 0], [1.64, 0.04, 0.94]),
    B: P([0, 0.02, 0], [0, 0, 0], [2.44, 0.04, 1.34]),
    C: P([0, 0.05, 0], [0, 0, 0], [3.1, 0.1, 1.26]),
  },
  [
    { from: 'A', to: 'B', t0: a0 + 1.0, t1: a0 + 2.1 },
    { from: 'B', to: 'C', t0: b0 + 0.3, t1: b0 + 1.5 },
  ],
);

// Células: as células de lítio sobem, giram e viram aletas do dissipador da fonte;
// depois se alinham e viram as réguas de LED da caixa.
const cells = [];
for (let i = 0; i < 8; i++) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const fx = -0.7 + i * 0.2;
  const ledTop = row === 0;
  const lx = -1.14 + col * 0.76;
  const m = rbox(M.cell, 0.02);
  m.material = M.cell.clone();
  cells.push(m);
  morphPart(
    m,
    {
      A: P([-0.6 + col * 0.4, 0.48, row ? 0.2 : -0.2], [0, 0, 0], [0.17, 0.8, 0.36]),
      A1: P([-0.6 + col * 0.4, 1.4, row ? 0.2 : -0.2], [0, 0, 0], [0.17, 0.8, 0.36]),
      B: P([fx, 0.66, 0], [0, 0, 0], [0.05, 0.22, 1.16]),
      C: P([lx, ledTop ? 1.6 : 0.1, 0.645], [0, 0, 0], [0.7, 0.03, 0.03]),
    },
    [
      { from: 'A', to: 'A1', t0: a0 + 0.55 + i * 0.04, t1: a0 + 1.25 + i * 0.04 },
      { from: 'A1', to: 'B', t0: a0 + 1.25 + i * 0.05, t1: a0 + 2.15 + i * 0.05, spin: [0, (i % 2 ? 1 : -1) * 0.8, Math.PI] },
      { from: 'B', to: 'C', t0: b0 + 0.1 + i * 0.07, t1: b0 + 1.3 + i * 0.07, lift: 0.5, push: 0.6, spin: [Math.PI, 0, 0] },
    ],
    { spark: i % 2 === 0 },
  );
}

// Rótulo frontal: desliza para a frente, gira 180° e revela o painel da fonte
// (o verso da mesma placa). Na caixa, recolhe para trás como placa de bornes.
const plateMats = [M.black, M.black, M.black, M.black,
  new THREE.MeshStandardMaterial({ map: batteryLabel, roughness: 0.45, metalness: 0.2 }),
  new THREE.MeshStandardMaterial({ map: psuPanel, roughness: 0.4, metalness: 0.2, emissiveMap: psuPanel, emissive: 0xffffff, emissiveIntensity: 0.0 }),
];
morphPart(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), plateMats), {
  A: P([0, 0.5, 0.457], [0, 0, 0], [1.2, 0.5, 0.012]),
  A1: P([0, 0.62, 1.0], [0, 0, 0], [1.2, 0.5, 0.012]),
  B: P([0, 0.27, 0.657], [0, Math.PI, 0], [2.3, 0.4, 0.012]),
  C: P([0, 0.86, -0.607], [0, 0, 0], [1.4, 0.24, 0.012]),
}, [
  { from: 'A', to: 'A1', t0: a0 + 0.2, t1: a0 + 0.9 },
  { from: 'A1', to: 'B', t0: a0 + 1.2, t1: a0 + 2.3, spin: [0.35, 0, 0] },
  { from: 'B', to: 'C', t0: b0 + 0.2, t1: b0 + 1.2, lift: 0.4, push: -0.9 },
], { spark: true });

// Polos: polos da bateria → bornes de saída da fonte → bornes traseiros da caixa.
for (const side of [-1, 1]) {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 24), M.alu);
  const capM = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 32), side < 0 ? M.black : M.red);
  capM.position.y = -0.03;
  g.add(post, capM);
  morphPart(g, {
    A: P([side * 0.55, 1.05, 0], [0, 0, 0], [1, 1, 1]),
    A1: P([side * 0.55, 2.24, 0], [0, 0, 0], [1, 1, 1]),
    B: P([side * 0.9, 0.3, -0.7], [-Math.PI / 2, 0, 0], [1, 1, 1]),
    C: P([side * 0.45, 0.86, -0.64], [-Math.PI / 2, 0, 0], [1, 1, 1]),
  }, [
    { from: 'A', to: 'A1', t0: a0, t1: a0 + 0.7 },
    { from: 'A1', to: 'B', t0: a0 + 1.3, t1: a0 + 2.3 },
    { from: 'B', to: 'C', t0: b0 + 0.2, t1: b0 + 1.2 },
  ]);
}

// Peças internas: parafusos que desrosqueiam antes da tampa subir e barramentos de
// cobre que ficam à mostra quando a bateria abre (e depois somem para dentro do corpo).
const copper = new THREE.MeshStandardMaterial({ color: 0xc8753d, roughness: 0.3, metalness: 1 });
for (const [cx, cz] of [[-0.74, -0.38], [0.74, -0.38], [-0.74, 0.38], [0.74, 0.38]]) {
  const bolt = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 6), M.alu);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12), M.alu);
  shaft.position.y = -0.07;
  bolt.add(head, shaft);
  morphPart(bolt, {
    A: P([cx, 1.01, cz]),
    A0: P([cx, 1.12, cz], [0, 7, 0]),
    A1: P([cx * 1.5, 2.4, cz * 1.5], [0.6, 7, 0.4]),
    B: P([cx * 1.4, 0.55, cz * 1.6], [0, 0, 0], [0.8, 0.8, 0.8]),
    C: P([cx * 1.95, 1.68, cz * 1.55], [0, 0, 0], [0.8, 0.8, 0.8]),
  }, [
    { from: 'A', to: 'A0', t0: a0 - 0.15, t1: a0 + 0.25, soft: true },
    { from: 'A0', to: 'A1', t0: a0 + 0.25, t1: a0 + 0.8, soft: true },
    { from: 'A1', to: 'B', t0: a0 + 1.5, t1: a0 + 2.3 },
    { from: 'B', to: 'C', t0: b0 + 1.0, t1: b0 + 1.85 },
  ]);
}
for (const z of [-0.2, 0.2]) {
  morphPart(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), copper), {
    A: P([0, 0.9, z], [0, 0, 0], [1.3, 0.02, 0.07]),
    A1: P([0, 1.86, z], [0, 0, 0], [1.3, 0.02, 0.07]),
    B: P([0, 0.3, z * 0.5], [0, Math.PI / 2, 0], [0.9, 0.02, 0.07]),
    C: P([0, 0.86, z * 0.5], [0, Math.PI / 2, 0], [0.9, 0.02, 0.07]),
  }, [
    { from: 'A', to: 'A1', t0: a0 + 0.5, t1: a0 + 1.2 },
    { from: 'A1', to: 'B', t0: a0 + 1.35, t1: a0 + 2.2, spin: [0, 0, z * 6] },
    { from: 'B', to: 'C', t0: b0 + 0.4, t1: b0 + 1.2, soft: true },
  ]);
}

// ---------- energia: o fio condutor do filme ----------
// Um traço de luz que nasce nos polos, guia as peças, sai do borne da fonte e
// desenha o projeto da caixa antes de as peças chegarem. No grave, volta pulsando.
function glowPath(curve, radius = 0.006, segs = 300) {
  const geo = new THREE.TubeGeometry(curve, segs, radius, 8, false);
  const mat = new THREE.MeshBasicMaterial({ color: 0x5aa0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const m = new THREE.Mesh(geo, mat);
  const perSeg = 8 * 6;
  m.reveal = (a, b, opacity = 1) => {
    const i0 = Math.floor(clamp(a) * segs) * perSeg;
    const i1 = Math.floor(clamp(b) * segs) * perSeg;
    m.visible = i1 > i0 && opacity > 0.001;
    geo.setDrawRange(i0, i1 - i0);
    mat.opacity = opacity;
  };
  m.reveal(0, 0);
  scene.add(m);
  return m;
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const poly = (pts) => {
  const c = new THREE.CurvePath();
  for (let i = 1; i < pts.length; i++) c.add(new THREE.LineCurve3(V(...pts[i - 1]), V(...pts[i])));
  return c;
};
const circle = (cx, cy, cz, r) =>
  new THREE.CatmullRomCurve3(Array.from({ length: 48 }, (_, i) => V(cx + r * Math.sin((i / 48) * Math.PI * 2), cy + r * Math.cos((i / 48) * Math.PI * 2), cz)), true);

// 1) Do polo positivo, contorna a bateria e termina onde nascerá a fonte.
const energyA = glowPath(
  new THREE.CatmullRomCurve3([V(0.55, 1.1, 0), V(0.95, 1.0, 0.55), V(0, 0.72, 0.72), V(-0.95, 0.5, 0.55), V(-0.95, 0.4, -0.6), V(0.95, 0.3, -0.65), V(1.35, 0.27, 0.1), V(0, 0.27, 0.85)]),
  0.007,
  400,
);
// 2) Sai do borne da fonte, corre pelo piso e desenha o contorno da caixa.
const energyB = glowPath(
  poly([[1.05, 0.27, 0.67], [1.05, 0.27, 0.9], [1.25, 0.012, 1.1], [1.7, 0.012, 0.9], [1.56, 0.1, 0.645], [1.56, 1.63, 0.645], [-1.56, 1.63, 0.645], [-1.56, 0.1, 0.645], [1.56, 0.1, 0.645]]),
  0.006,
  500,
);
const energyRings = [-1, 1].map((side) => glowPath(circle(side * 0.76, 0.86, 0.66, 0.62), 0.005, 160));
const energyHorns = [-1.14, -0.38, 0.38, 1.14].map((x) => glowPath(circle(x, 1.93, 0.6, 0.24), 0.004, 80));

// Cabeça do traço de energia que sai do borne (a câmera do take 07 a persegue).
const T6e = TAKES.find((k) => k.id === '06');
const energyHead = (t) => seg(t, T6e.end - 0.3, b0 + 1.0);
const energyHeadPoint = (t) => energyB.geometry.parameters.path.getPointAt(clamp(energyHead(t), 0.001, 1)).toArray();

function updateEnergy(t, e) {
  // Fase 1: da bateria para a fonte (cabeça corre, cauda segue).
  energyA.reveal(seg(t, 3.5, 5.1), seg(t, 4.7, 6.5), 1);
  // Fase 2: do borne até o projeto da caixa; depois esmaece quando as peças ocupam o lugar.
  const fade = 1 - seg(t, b0 + 2.4, b0 + 3.6);
  const pulse = 0.9 * Math.min(1, e);
  energyB.reveal(0, energyHead(t), Math.max(fade, pulse));
  energyRings.forEach((r, i) => r.reveal(0, seg(t, b0 + 0.15 + i * 0.15, b0 + 0.75 + i * 0.15), Math.max(fade, pulse)));
  energyHorns.forEach((r, i) => r.reveal(0, seg(t, b0 + 0.45 + i * 0.08, b0 + 0.85 + i * 0.08), Math.max(fade, pulse * 0.6)));
}

// ---------- componentes de som (sem marca) ----------
function makeWoofer() {
  const g = new THREE.Group();
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.045, 24, 96), M.alu);
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.03, 96, 1, true), M.aluDark);
  basket.rotation.x = Math.PI / 2;
  const surround = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 20, 96), M.rubber);
  const cone = new THREE.Group();
  const coneMesh = new THREE.Mesh(
    new THREE.LatheGeometry([new THREE.Vector2(0.12, -0.2), new THREE.Vector2(0.3, -0.1), new THREE.Vector2(0.48, -0.01)], 96),
    M.cone,
  );
  coneMesh.rotation.x = -Math.PI / 2;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3.2), M.cap);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = -0.27;
  cone.add(coneMesh, cap);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.645, 0.012, 12, 128), M.led.clone());
  g.add(trim, basket, surround, cone, ring);
  g.userData = { cone, ring, surround };
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = o.receiveShadow = true;
  });
  scene.add(g);
  return g;
}
function makeHorn() {
  const g = new THREE.Group();
  const bell = new THREE.Mesh(
    new THREE.LatheGeometry(
      Array.from({ length: 12 }, (_, i) => {
        const u = i / 11;
        return new THREE.Vector2(0.05 + 0.19 * u * u, u * 0.36);
      }),
      64,
    ),
    M.horn,
  );
  bell.rotation.x = Math.PI / 2; // abre para +z
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.012, 12, 64), M.horn);
  lip.position.z = 0.36;
  const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.22, 48), M.aluDark);
  driver.rotation.x = Math.PI / 2;
  driver.position.z = -0.1;
  const throat = new THREE.Mesh(new THREE.CircleGeometry(0.05, 32), M.led.clone());
  throat.position.z = 0.005;
  g.add(bell, lip, driver, throat);
  g.userData = { throat };
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = o.receiveShadow = true;
  });
  scene.add(g);
  return g;
}
const woofers = [-1, 1].map(() => makeWoofer());
const horns = [-1.14, -0.38, 0.38, 1.14].map(() => makeHorn());

// Ondas de choque no piso (graves)
const waves = Array.from({ length: 4 }, () => {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 128), M.wave.clone());
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.004;
  scene.add(m);
  return m;
});

// Poeira de estúdio: flutua no ar e salta do piso a cada grave.
const DUST = 900;
const dustGeo = new THREE.BufferGeometry();
const dustBase = new Float32Array(DUST * 4);
for (let i = 0; i < DUST; i++) {
  const r = 0.8 + Math.pow((i * 0.6180339) % 1, 0.7) * 4.5;
  const a = i * 2.39996;
  dustBase.set([Math.cos(a) * r, ((i * 0.7548776) % 1) * 2.6, Math.sin(a) * r - 0.5, (i * 0.5698403) % 1], i * 4);
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DUST * 3), 3));
const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({ color: 0x9fb6d6, size: 0.012, transparent: true, opacity: 0.55, depthWrite: false }),
);
scene.add(dust);

// ---------- câmera por take ----------
// Curvas de câmera com "peso": cada take escolhe como arranca e como chega.
const CURVES = {
  glide: ease, // grua: arranca devagar, desliza, assenta
  float: (x) => 1 - Math.pow(1 - x, 3), // arranca e flutua até parar
  in: (x) => x * x * x, // começa quase parada e acelera (revelação)
  stop: (x) => 1 - Math.pow(1 - x, 1.6) + 0.04 * Math.sin(Math.PI * x) * x, // chega com leve atraso e para seco
};
function cameraAt(t) {
  const take = TAKES.find((k) => t >= k.start && t < k.end) || TAKES[TAKES.length - 1];
  const c = take.cam;
  const x = clamp((t - take.start) / (take.end - take.start));
  const curve = CURVES[c.curve || 'glide'];
  const k = curve(x);
  // Inércia: a mira segue a posição com um pequeno atraso, como um operador real.
  const kt = curve(clamp((x - 0.07) / 0.93));
  let pos;
  if (c.orbit) {
    // Órbita contínua ao redor do objeto.
    const o = c.orbit;
    const a = lerp(o.angle[0], o.angle[1], k);
    const r = lerp(o.radius[0], o.radius[1], k);
    pos = [o.center[0] + r * Math.sin(a), lerp(o.height[0], o.height[1], k), o.center[2] + r * Math.cos(a)];
  } else {
    // "via": a câmera passa por um ponto intermediário (curva de Bézier quadrática).
    pos = c.via ? lerp3(lerp3(c.from, c.via, k), lerp3(c.via, c.to, k), k) : lerp3(c.from, c.to, k);
  }
  let tgt = lerp3(c.tgtFrom, c.tgtTo || c.tgtFrom, kt);
  if (c.follow) {
    // Persegue a cabeça do traço de energia e, aos poucos, abre para o plano geral.
    const head = energyHeadPoint(t);
    const w = seg(t, c.follow.release[0], c.follow.release[1]);
    tgt = lerp3(head, tgt, w);
    pos = lerp3([head[0] + c.follow.offset[0], head[1] + c.follow.offset[1], head[2] + c.follow.offset[2]], pos, w);
  }
  // Rack focus: o foco passa de um ponto a outro dentro do take.
  const focusPt = c.focusFrom ? lerp3(c.focusFrom, c.focusTo || c.focusFrom, seg(x, c.focusAt?.[0] ?? 0.3, c.focusAt?.[1] ?? 0.7)) : tgt;
  return { take, pos, tgt, focusPt, fov: lerp(c.fov[0], c.fov[1] ?? c.fov[0], k) };
}

// ---------- graves ----------
const T13 = TAKES.find((k) => k.id === '13');
// Um segundo de quietude antes da primeira pancada; a última abre a onda de choque
// que atravessa a tela e leva ao mundo real.
const KICKS = [1.0, 1.25, 1.42, 1.55].map((x) => T13.start + x);
const SHOCK = KICKS[KICKS.length - 1];
const KICK_AMP = [0.6, 0.8, 0.9, 1.4];
function bass(t) {
  let e = 0;
  for (const k of KICKS) if (t >= k) e += Math.exp(-(t - k) * 9) * clamp((t - k) / 0.03);
  return Math.min(e, 1.4);
}

// ---------- quadro ----------
let fontsReady = false;
export function renderAt(t) {
  const end = document.getElementById('end');
  if (t >= END_CARD_START) {
    // Encerramento: apenas "JFA — Energia que vira som."
    end.style.opacity = String(seg(t, END_CARD_START + 0.2, END_CARD_START + 1.2));
    end.querySelector('.tag').style.opacity = String(seg(t, END_CARD_START + 0.9, END_CARD_START + 1.8));
    return;
  }
  end.style.opacity = '0';

  applyParts(t);
  const e = bass(t);
  updateEnergy(t, e);

  // Energia: as células acendem ao se abrirem, e o painel liga no take 06.
  const T6 = TAKES.find((k) => k.id === '06');
  const cellGlow = 0.9 * seg(t, a0 + 0.5, a0 + 1.0) * (1 - seg(t, a0 + 1.8, a0 + 2.4));
  cells.forEach((m, i) => {
    const led = seg(t, 15.0 + i * 0.09, 15.25 + i * 0.09);
    const run = Math.max(0, Math.sin((t - T6.start) * 5 - i * 0.6)) * seg(t, T6.start + 0.3, T6.start + 0.8) * (1 - seg(t, T6.end, T6.end + 0.4));
    m.material.emissiveIntensity = cellGlow + 0.5 * run + led * (2.4 + 2.2 * e);
  });
  const volts = 14.4 * seg(t, T6.start + 0.1, T6.start + 0.85);
  const flow = seg(t, T6.start + 0.8, T6.end - 0.1);
  if (t > T6.start - 0.5 && t < b0 + 1.5) psuPanel.redraw(volts, flow);
  else if (t < T6.start) psuPanel.redraw(0, 0);
  plateMats[5].emissiveIntensity = 0.12 + 0.5 * seg(t, T6.start + 0.2, T6.start + 0.6);

  // Graves: emergem de dentro das câmaras girando até assentar na frente.
  woofers.forEach((w, i) => {
    const side = i ? 1 : -1;
    const t0 = 11.9 + i * 0.6;
    const k = seg(t, t0, t0 + 0.95);
    w.position.set(side * 0.76, 0.86, lerp(0.2, 0.63, k));
    w.rotation.set(0, 0, lerp(side * -2.4, 0, k));
    w.visible = t > t0;
    w.userData.cone.position.z = 0.09 * e * Math.cos((t - T13.start) * 26);
    w.userData.surround.scale.setScalar(1 + 0.02 * e);
    w.userData.ring.material.emissiveIntensity = seg(t, 15.55 + i * 0.12, 15.85 + i * 0.12) * (2.2 + 2.5 * e);
  });

  // Cornetas: sobem da plataforma uma a uma.
  horns.forEach((h, i) => {
    const t0 = 13.95 + i * 0.18;
    const k = seg(t, t0, t0 + 0.75);
    const x = [-1.14, -0.38, 0.38, 1.14][i];
    h.position.set(x, lerp(1.3, 1.93, k) + 0.006 * e * Math.sin(t * 90 + i), lerp(-0.05, 0.22, k));
    h.rotation.set(0, 0, lerp((i % 2 ? 1 : -1) * 1.2, 0, k));
    h.visible = t > t0;
    h.userData.throat.material.emissiveIntensity = seg(t, 15.4 + i * 0.06, 15.6 + i * 0.06) * (1.5 + 3 * e);
  });

  // Ondas no piso a cada pancada.
  waves.forEach((w, i) => {
    const kt = KICKS[i];
    const age = t - kt;
    const on = age > 0 && age < 0.9;
    w.visible = on;
    if (on) {
      const r = 1.9 + age * 5.5;
      w.scale.set(r, r, 1);
      w.material.opacity = 0.32 * (1 - age / 0.9);
    }
  });

  // Poeira
  const pos = dustGeo.attributes.position.array;
  for (let i = 0; i < DUST; i++) {
    const [x, y, z, rnd] = dustBase.subarray(i * 4, i * 4 + 4);
    const drift = t * 0.04 + rnd * 10;
    const onFloor = rnd < 0.45;
    let yy = onFloor ? 0.006 : (y + drift * 0.3) % 2.6;
    if (onFloor) yy += e * 0.12 * rnd * (1.2 - Math.min(1, Math.hypot(x, z) / 5));
    pos.set([x + Math.sin(drift) * 0.05, yy, z + Math.cos(drift * 0.8) * 0.05], i * 3);
  }
  dustGeo.attributes.position.needsUpdate = true;

  // Câmera + impacto físico do grave
  const cam = cameraAt(t);
  // Respiro antes do grave: a câmera recua devagar na quietude e é empurrada na pancada.
  if (cam.take.id === '13') {
    cam.pos[2] += 0.25 * seg(t, T13.start, KICKS[0]) - 0.45 * seg(t, KICKS[0], KICKS[0] + 0.25);
    // A última pancada empurra a câmera para a frente e para cima, na direção do drone.
    cam.pos[2] -= 0.7 * seg(t, SHOCK, END_3D);
    cam.pos[1] += 0.35 * seg(t, SHOCK, END_3D);
    cam.tgt[1] += 0.15 * seg(t, SHOCK, END_3D);
  }
  // Impacto físico: cada pancada dá um tranco vertical, um "zoom" de impacto e um
  // balanço amortecido, com intensidades diferentes (a última é a mais forte).
  let jolt = 0;
  let punch = 0;
  let roll = 0;
  KICKS.forEach((kt, i) => {
    const age = t - kt;
    if (age < 0 || age > 1.2) return;
    const amp = KICK_AMP[i];
    jolt += amp * 0.03 * Math.exp(-age * 16) * Math.cos(age * 34);
    punch += amp * 1.6 * Math.exp(-age * 11);
    roll += amp * 0.006 * Math.exp(-age * 7) * Math.sin(age * 22 + i);
  });
  camera.position.set(cam.pos[0] + 0.006 * e * noise(t * 7), cam.pos[1] - jolt, cam.pos[2]);
  camera.fov = cam.fov - punch;
  camera.updateProjectionMatrix();
  camera.lookAt(...cam.tgt);
  camera.rotateZ(roll);

  // Abertura do filme a partir do preto.
  renderer.toneMappingExposure = 0.05 + 0.95 * seg(t, 0, 1.1);
  const dist = Math.hypot(cam.pos[0] - cam.focusPt[0], cam.pos[1] - cam.focusPt[1], cam.pos[2] - cam.focusPt[2]);
  bokeh.uniforms.focus.value = dist;
  bokeh.uniforms.aperture.value = cam.take.cam.dof || 0.00008;
  bloom.strength = 0.38 + 0.3 * Math.min(e, 1);
  finish.uniforms.time.value = t;
  finish.uniforms.shock.value = t >= SHOCK && t < END_3D ? (t - SHOCK) / (END_3D - SHOCK) : -1;
  composer.render();
}

async function init() {
  await document.fonts.load('120px StretchPro').catch(() => {});
  batteryLabel.redraw();
  psuPanel.redraw();
  fontsReady = true;
  // Ajusta o palco à janela no modo de pré-visualização.
  const fit = () => {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = new URLSearchParams(location.search).has('render') ? '' : `scale(${s})`;
  };
  fit();
  addEventListener('resize', fit);
  window.__film = { renderAt, END_3D, END_CARD_START, TOTAL, ready: fontsReady };

  if (!new URLSearchParams(location.search).has('render')) {
    const ui = document.getElementById('ui');
    const q = new URLSearchParams(location.search);
    let t = Number(q.get('t') || 0);
    let last = performance.now();
    const loop = (now) => {
      t += (now - last) / 1000;
      last = now;
      if (t >= END_3D && t < END_CARD_START) t = END_CARD_START; // trecho real entra na montagem final
      if (t >= TOTAL) t = 0;
      renderAt(t);
      ui.textContent = `${t.toFixed(2)}s · TAKE ${cameraAt(Math.min(t, END_3D - 0.01)).take.id}`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
init();
