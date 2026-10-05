/**
 * Palco 3D do filme: carrega o modelo REAL da placa LB1004 (GLB), monta um estúdio
 * escuro com luzes nativas do three.js e faz a composição final num único shader
 * (profundidade de campo, bloom discreto, fundo radial, vinheta e fade).
 * Com `transparent`, o fundo fica transparente (a variante social põe tipografia
 * atrás e na frente da placa) e o shader aplica as distorções de tela da variante
 * (onda, separação de cor e desfoque direcional), sempre sobre a imagem: o modelo
 * em si nunca é deformado.
 *
 * A geometria e os materiais do modelo não são alterados: as malhas só são agrupadas
 * por material (mesmas posições, normais e UVs) para desenhar em poucas chamadas.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { surfaceDetail } from './surface-detail';
import { createGlassCard } from './glass-cards';
import { createTitle } from './titles';

const DEG = Math.PI / 180;
// 1 mm da placa = 0,01 unidade de cena (placa com 3,1 de comprimento).
const MODEL_SCALE = 10;
// Proporção de referência das marcações de câmera.
const REF_ASPECT = 16 / 9;

// Paleta (sRGB): preto do briefing e variações muito escuras do azul JFA (#0068ff).
const BG_BASE = new THREE.Vector3(5 / 255, 7 / 255, 10 / 255);
const BG_GLOW = new THREE.Vector3(0.0, 0.052, 0.155);
const ZERO3 = [0, 0, 0];
const NO_FX = { wave: 0, waveFreq: 0, wavePhase: 0, chroma: 0, blur: [0, 0] };

/**
 * Junta as malhas do glTF por material, já com a transformação de cada nó aplicada,
 * e deita a placa no plano XZ (componentes para +Y). Modelos que já vêm em pé (`upAxis`
 * 'y', como a bateria) só ganham a escala.
 */
function buildBoard(gltf, maxAnisotropy, upAxis = 'z') {
  const root = gltf.scene;
  root.updateMatrixWorld(true);
  const place = new THREE.Matrix4().makeScale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
  if (upAxis !== 'y') place.multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  // Camadas da vista explodida: nós "EXPLODE_<nome>" do modelo viram grupos que o estado
  // da timeline pode afastar na vertical (explode: { <nome>: deslocamento }).
  const layerOf = (o) => {
    for (let n = o; n; n = n.parent) {
      const m = /^EXPLODE_(\w+)/.exec(n.name || '');
      if (m) return m[1];
    }
    return '';
  };
  const groups = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const geo = o.geometry.clone();
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(place, o.matrixWorld));
    const attrs = Object.keys(geo.attributes).sort().join(',');
    const layer = layerOf(o);
    const key = `${layer}|${o.material.uuid}|${attrs}|${geo.index ? 'i' : 'n'}`;
    if (!groups.has(key)) groups.set(key, { layer, material: o.material, geos: [] });
    groups.get(key).geos.push(geo);
  });

  const board = new THREE.Group();
  board.name = 'Placa LB1004';
  board.userData.layers = new Map();
  groups.forEach(({ layer, material, geos }) => {
    const geo = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
    geos.forEach((g) => g !== geo && g.dispose());
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    let parent = board;
    if (layer) {
      if (!board.userData.layers.has(layer)) {
        const g = new THREE.Group();
        g.name = layer;
        board.add(g);
        board.userData.layers.set(layer, g);
      }
      parent = board.userData.layers.get(layer);
    }
    parent.add(mesh);
    ['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach((slot) => {
      if (material[slot]) material[slot].anisotropy = maxAnisotropy;
    });
  });
  return board;
}

/**
 * Estúdio procedural para os reflexos: sala quase preta, uma softbox vertical
 * estreita (a "passagem de luz"), uma softbox grande no alto e dois recortes laterais.
 * Vira um mapa de ambiente pré-filtrado (PMREM); nenhuma imagem é usada.
 */
function buildStudioEnvironment(renderer) {
  const env = new THREE.Scene();
  const emissive = (r, g, b) =>
    new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), side: THREE.DoubleSide });
  // Faixa da esfera: azimute no padrão da câmera (0 = +Z, 90 = +X), elevação em graus.
  const band = (az, width, elTop, elBottom, mat) => {
    const geo = new THREE.SphereGeometry(
      30,
      8,
      24,
      Math.PI / 2 + (az - width / 2) * DEG,
      width * DEG,
      (90 - elTop) * DEG,
      (elTop - elBottom) * DEG,
    );
    env.add(new THREE.Mesh(geo, mat));
  };

  env.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(40, 32, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0016, 0.0025, 0.0047), side: THREE.BackSide }),
    ),
  );
  // Leve presença azul JFA embaixo (reflexos de metal ganham um tom frio).
  band(0, 360, -4, -80, emissive(0.0, 0.008, 0.028));
  // Softbox vertical estreita atrás do produto: é ela que corre pela superfície.
  band(180, 12, 84, -2, emissive(24, 24.8, 26));
  // Softbox grande e suave no alto.
  band(0, 360, 90, 72, emissive(0.72, 0.74, 0.78));
  // Recortes laterais baixos (brilho nas bordas e nos terminais metálicos).
  band(96, 26, 16, 4, emissive(2.1, 2.2, 2.4));
  band(-104, 22, 14, 3, emissive(0.9, 1.05, 1.3));

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.012, 0.1, 100);
  pmrem.dispose();
  env.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
  return target;
}

/**
 * Estúdio escuro de fotografia (variante da bateria, `studio: 'cinema'`): sala quase preta e
 * chão grafite. É o que o black piano reflete, então é montado como um set de produto preto
 * brilhante: um difusor grande no teto, quatro rebatedores grandes em degradê nas diagonais
 * (cada face vertical reflete uma luz que cai aos poucos, nunca um cinza liso) com bandeiras
 * pretas entre eles, e a softbox da luz principal (frente, no alto). Cada fonte tem a queda de
 * luz de um tecido iluminado por trás (centro mais claro, borda definida); cor chapada e borda
 * dura no reflexo denunciam computação gráfica. Resolução alta (1024 por face) para os
 * reflexos espelhados ficarem nítidos. Nenhuma imagem é usada.
 */
function buildDarkStudioEnvironment(renderer) {
  const env = new THREE.Scene();
  const textures = [];
  const canvasTex = (draw) => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    draw(c.getContext('2d'), 512);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };
  env.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(16, 16, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.012, 0.012, 0.014), side: THREE.BackSide }),
    ),
  );
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.03, 0.03, 0.03), side: THREE.DoubleSide }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4.9;
  env.add(floor);
  // Paredes acima dos rebatedores: só a luz que vaza do teto, um degradê muito escuro (as
  // faces de cima vistas do alto refletem isso, nunca um preto chapado).
  const spill = canvasTex((ctx, n) => {
    const g = ctx.createLinearGradient(0, 0, 0, n);
    g.addColorStop(0, '#000000');
    g.addColorStop(0.45, '#ffffff');
    g.addColorStop(1, '#000000');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, n, n);
  });
  env.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 64, 16, 0, Math.PI * 2, 28 * DEG, 52 * DEG),
      new THREE.MeshBasicMaterial({
        map: spill,
        color: new THREE.Color(0.1, 0.1, 0.105),
        side: THREE.BackSide,
      }),
    ),
  );
  // Tecido iluminado por trás: centro claro (um pouco abaixo do meio nos rebatedores) e queda
  // larga até a borda; a borda é definida, mas não serrilhada.
  const fabric = (cy, edge, blur) =>
    canvasTex((ctx, n) => {
      const g = ctx.createRadialGradient(n / 2, n * cy, 0, n / 2, n / 2, n * 0.7);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.45, '#d4d4d4');
      g.addColorStop(1, edge);
      ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = g;
      ctx.fillRect(12, 12, n - 24, n - 24);
    });
  const softbox = fabric(0.46, '#bdbdbd', 2);
  const scrim = fabric(0.42, '#6e6e6e', 5);
  // Fonte na direção (az, el) em graus, a `d` unidades, com tamanho angular (largura, altura).
  const source = (tex, az, el, wDeg, hDeg, v, d = 5) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(2 * d * Math.tan((wDeg / 2) * DEG), 2 * d * Math.tan((hDeg / 2) * DEG)),
      new THREE.MeshBasicMaterial({
        map: tex,
        color: new THREE.Color(v, v, v),
        transparent: true,
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(
      d * Math.sin(az * DEG) * Math.cos(el * DEG),
      d * Math.sin(el * DEG),
      d * Math.cos(az * DEG) * Math.cos(el * DEG),
    );
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  // Difusor do teto (as faces de cima ganham um degradê largo), os rebatedores das diagonais
  // (bandeiras pretas nas direções das faces: de frente, a face fica escura no meio e o
  // degradê aparece pelos lados) e a softbox principal na direção e no tamanho da luz do set
  // (keyAz 10, keyEl 55; 4,5 × 3,2 a 8 unidades), na frente do difusor. Esse ambiente só vale
  // para o produto; o ciclorama usa quase nada dele (envMapIntensity baixo) e fica escuro.
  source(scrim, 180, 89, 96, 96, 0.5, 4.8);
  [45, 135, 225, 315].forEach((az, k) => source(scrim, az, 6, 56, 56, [0.7, 0.55, 0.6, 0.75][k]));
  source(softbox, 10, 55, 31, 22.5, 2.4, 4.4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.004, 0.1, 100, { size: 1024 });
  pmrem.dispose();
  env.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
  return target;
}

/**
 * Estúdio branco (variante da bateria): sala em meia-luz, chão claro que rebate luz, uma
 * softbox suave no alto, a janela da luz principal em 3/4 e um rebatedor fraco do outro
 * lado, tudo parado: os reflexos no black piano só andam porque a câmera anda. Nenhuma
 * imagem é usada.
 */
function buildWhiteStudioEnvironment(renderer) {
  const env = new THREE.Scene();
  const basic = (v) =>
    new THREE.MeshBasicMaterial({ color: new THREE.Color(v, v, v), side: THREE.DoubleSide });
  env.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x1c1e22, side: THREE.BackSide }),
    ),
  );
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), basic(0.2));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4.9;
  env.add(floor);
  const box = (w, h, v, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(v));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  // Paredes claras em volta, contínuas e sem recortes (luz de dia rebatida): o black piano
  // ganha forma em qualquer ângulo, com reflexo em degradê e sem faixas marcadas.
  const ring = (elBottom, elTop, v) => {
    const geo = new THREE.SphereGeometry(
      4.6,
      48,
      6,
      0,
      Math.PI * 2,
      (90 - elTop) * DEG,
      (elTop - elBottom) * DEG,
    );
    env.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: new THREE.Color(v, v, v), side: THREE.BackSide }),
      ),
    );
  };
  ring(4, 18, 0.16);
  ring(18, 34, 0.22);
  ring(34, 52, 0.26);
  ring(52, 70, 0.22);
  box(5, 3.2, 0.8, [0, 4.8, 0.4]);
  // A janela da luz principal (3/4 à esquerda, na mesma direção da luz do set).
  box(3.4, 2.6, 0.9, [-2.43, 2.45, 3.48]);
  box(1.6, 5, 0.3, [4.8, 0.8, -1.4]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.035, 0.1, 100);
  pmrem.dispose();
  env.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
  return target;
}

/** Sombra de contato: escurecimento suave em volta da pegada do produto no chão (shader). */
function buildContactShadow(halfX, halfZ) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpacity: { value: 0 }, uHalf: { value: new THREE.Vector2(halfX, halfZ) } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform vec2 uHalf;
      varying vec2 vP;
      void main() {
        vec2 q = abs(vP) - uHalf + 0.05;
        float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.05;
        // Núcleo junto da base (milímetros) e uma penumbra larga em volta (centímetros).
        float a = d < 0.0 ? 1.0 : exp(-d * 14.0) * 0.55 + exp(-d * 3.0) * 0.45;
        gl_FragColor = vec4(0.0, 0.0, 0.0, a * uOpacity);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry((halfX + 1.6) * 2, (halfZ + 1.6) * 2), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.002;
  mesh.renderOrder = -1;
  return mesh;
}

const COMPOSITE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const COMPOSITE_FRAG = /* glsl */ `
  #include <packing>
  uniform sampler2D tColor;
  uniform sampler2D tDepth;
  uniform vec2 uResolution;
  uniform float uNear;
  uniform float uFar;
  uniform float uFocus;
  uniform float uFocusScale;
  uniform float uMaxBlur;
  uniform float uRadScale;
  uniform float uBloom;
  uniform float uExposure;
  uniform float uGrain;
  uniform float uVignette;
  uniform float uFade;
  uniform float uGlow;
  uniform vec2 uGlowCenter;
  uniform float uGlowRadius;
  uniform vec3 uBgBase;
  uniform vec3 uBgGlow;
  uniform float uFrame;
  uniform float uTransparent;
  uniform float uWave;
  uniform float uWaveFreq;
  uniform float uWavePhase;
  uniform float uChroma;
  uniform vec2 uBlur;
  varying vec2 vUv;

  float viewDist(float d) { return -perspectiveDepthToViewZ(d, uNear, uFar); }
  float blurSize(float z) {
    return abs(clamp((1.0 / uFocus - 1.0 / z) * uFocusScale, -1.0, 1.0)) * uMaxBlur;
  }

  // Profundidade de campo em uma passada (espiral de ângulo áureo, "scatter as gather").
  vec4 depthOfField(vec2 uv) {
    vec4 center = textureLod(tColor, uv, 0.0);
    if (uFocusScale <= 0.0001) return center;
    float cz = viewDist(texture2D(tDepth, uv).x);
    float cs = blurSize(cz);
    vec2 px = 1.0 / uResolution;
    vec4 acc = center;
    float tot = 1.0;
    float radius = uRadScale;
    float ang = 0.0;
    for (int i = 0; i < 56; i++) {
      if (radius >= uMaxBlur) break;
      vec2 tc = uv + vec2(cos(ang), sin(ang)) * px * radius;
      vec4 sc = textureLod(tColor, tc, 0.0);
      float sz = viewDist(texture2D(tDepth, tc).x);
      float ss = blurSize(sz);
      if (sz > cz) ss = clamp(ss, 0.0, cs * 2.0);
      float m = smoothstep(radius - 0.5, radius + 0.5, ss);
      acc += mix(acc / tot, sc, m);
      tot += 1.0;
      ang += 2.39996323;
      radius += uRadScale / radius;
    }
    return acc / tot;
  }

  // Brilho difuso só ao redor das áreas mais claras (mipmaps da própria cena).
  vec3 glow(vec2 uv) {
    vec2 o = 1.5 / uResolution;
    vec3 b = vec3(0.0);
    b += textureLod(tColor, uv, 4.0).rgb * 0.45;
    b += textureLod(tColor, uv + vec2(o.x, o.y) * 16.0, 5.0).rgb * 0.1;
    b += textureLod(tColor, uv + vec2(-o.x, o.y) * 16.0, 5.0).rgb * 0.1;
    b += textureLod(tColor, uv + vec2(o.x, -o.y) * 16.0, 5.0).rgb * 0.1;
    b += textureLod(tColor, uv + vec2(-o.x, -o.y) * 16.0, 5.0).rgb * 0.1;
    b += textureLod(tColor, uv, 6.5).rgb * 0.15;
    return max(b - 0.04, 0.0);
  }

  // Separação de cor e desfoque direcional (só durante impactos e transições).
  vec4 motionFx(vec2 uv) {
    vec2 px = 1.0 / uResolution;
    int taps = length(uBlur) > 0.5 ? 9 : 1;
    vec4 acc = vec4(0.0);
    for (int i = 0; i < 9; i++) {
      if (i >= taps) break;
      float k = taps == 1 ? 0.0 : float(i) / 8.0 - 0.5;
      vec2 tc = uv + uBlur * px * k;
      vec4 c = textureLod(tColor, tc, 0.0);
      if (uChroma > 0.0) {
        vec4 r = textureLod(tColor, tc + vec2(uChroma, 0.0) * px, 0.0);
        vec4 b = textureLod(tColor, tc - vec2(uChroma, 0.0) * px, 0.0);
        c = vec4(r.r, c.g, b.b, max(c.a, max(r.a, b.a)));
      }
      acc += c;
    }
    return acc / float(taps);
  }

  // Khronos PBR Neutral: preserva a cor real do produto (feito para e-commerce).
  vec3 neutralToneMap(vec3 color) {
    const float startCompression = 0.8 - 0.04;
    const float desaturation = 0.15;
    float x = min(color.r, min(color.g, color.b));
    float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    color -= offset;
    float peak = max(color.r, max(color.g, color.b));
    if (peak < startCompression) return color;
    float d = 1.0 - startCompression;
    float newPeak = 1.0 - d * d / (peak + d - startCompression);
    color *= newPeak / peak;
    float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
    return mix(color, vec3(newPeak), g);
  }

  vec3 toSRGB(vec3 c) {
    c = max(c, 0.0);
    return mix(pow(c, vec3(1.0 / 2.4)) * 1.055 - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308))));
  }

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 uv = vUv;
    if (uWave != 0.0) uv.x += uWave * sin(uv.y * uWaveFreq + uWavePhase);
    bool fx = uChroma > 0.0 || length(uBlur) > 0.5;
    vec4 scene = fx ? motionFx(uv) : depthOfField(uv);

    if (uTransparent > 0.5) {
      // Saída pré-multiplicada: a placa sobre o que estiver atrás do canvas, e o
      // brilho em volta somado à luz do fundo.
      float a = scene.a;
      // Brilhos fortes ganham um halo leve, como numa lente de verdade.
      vec3 lit = scene.rgb / max(a, 0.0001) * uExposure + glow(uv) * uBloom * 0.6;
      vec3 body = a > 0.0001 ? toSRGB(neutralToneMap(lit)) * a : vec3(0.0);
      vec3 halo = toSRGB(glow(uv) * uBloom) * (1.0 - a);
      // Vinheta leve e granulação de sensor (mais nos meios-tons, muda a cada quadro).
      float aspectV = uResolution.x / uResolution.y;
      vec2 qv = (vUv - 0.5) * vec2(aspectV, 1.0) / max(aspectV, 1.0);
      body *= mix(1.0, smoothstep(1.0, 0.25, length(qv)), uVignette);
      float lum = dot(body, vec3(0.2126, 0.7152, 0.0722));
      float grain = (hash(gl_FragCoord.xy * 1.37 + uFrame * 31.0) + hash(gl_FragCoord.yx * 0.73 + uFrame * 17.0) - 1.0);
      body += grain * uGrain * (0.006 + 0.03 * sqrt(max(lum, 0.0)) * (1.0 - lum)) * a;
      vec3 c = (body + halo) * uFade + (hash(gl_FragCoord.xy + uFrame * 17.0) - 0.5) / 255.0 * a;
      gl_FragColor = vec4(max(c, 0.0), a * uFade);
      return;
    }

    vec3 lin = scene.rgb * uExposure + glow(uv) * uBloom;
    vec3 product = toSRGB(neutralToneMap(lin));

    float aspect = uResolution.x / uResolution.y;
    vec2 p = (vUv - uGlowCenter) * vec2(aspect, 1.0);
    float r = length(p) / uGlowRadius;
    vec3 bg = uBgBase + uBgGlow * exp(-r * r * 1.7) * uGlow;

    vec3 col = product + bg * (1.0 - scene.a);

    vec2 q = (vUv - 0.5) * vec2(aspect, 1.0) / max(aspect, 1.0);
    col *= mix(1.0, smoothstep(0.95, 0.2, length(q)), 0.42);
    col *= uFade;
    col += (hash(gl_FragCoord.xy + uFrame * 17.0) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * @param {object} opts
 *   `canvas`; `model` = conteúdo do GLB; `transparent` = fundo transparente (variante social);
 *   `upAxis` = 'y' para modelos que já vêm em pé (bateria), 'z' (padrão) para a placa;
 *   `studio` = 'white' para o estúdio branco em 3D (ciclorama iluminado, sombra de contato,
 *   luz de fundo) com luzes e reflexos presos ao mundo, como num set de verdade;
 *   `detail` = [[/nome do material/, { wear, scratch, peel }]] acabamento fino no shader;
 *   `mirrors` = [{ layer, material, dir }] faces planas espelhadas (reflexo do próprio produto).
 */
export async function createStage({
  canvas,
  model,
  transparent = false,
  upAxis = 'z',
  studio = 'dark',
  cyc: cycColor = null,
  detail = [],
  look = [],
  mirrors: mirrorSpecs = [],
}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: transparent,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const gltf = await new GLTFLoader().parseAsync(model, '');

  const scene = new THREE.Scene();
  // "white": estúdio branco; "cinema": estúdio escuro de fotografia. Os dois têm ciclorama
  // 3D, piso com reflexo, sombra de contato e a luz principal (softbox) presa ao mundo.
  const white = studio === 'white' || studio === 'cinema';
  const cinema = studio === 'cinema';
  const envTarget = cinema
    ? buildDarkStudioEnvironment(renderer)
    : studio === 'white'
      ? buildWhiteStudioEnvironment(renderer)
      : buildStudioEnvironment(renderer);
  scene.environment = envTarget.texture;

  const pivot = new THREE.Group();
  const board = buildBoard(gltf, renderer.capabilities.getMaxAnisotropy(), upAxis);
  pivot.add(board);
  scene.add(pivot);
  // Ajustes de material do filme por nome (`look`: [[regex, { color, roughness, ... }]]):
  // ex.: clarear o black piano para o corpo ganhar volume com a luz.
  if (look.length) {
    board.traverse((o) => {
      if (!o.isMesh) return;
      const rule = look.find(([re]) => re.test(o.material.name || ''));
      if (!rule) return;
      const { color, ...rest } = rule[1];
      if (color != null) o.material.color.set(color);
      Object.assign(o.material, rest);
      o.material.needsUpdate = true;
    });
  }
  // Acabamento fino (casca de laranja, riscos, desgaste) por nome de material; o ruído
  // usa milímetros (1 unidade de cena = 1000 / MODEL_SCALE mm).
  if (detail.length) {
    board.traverse((o) => {
      if (!o.isMesh) return;
      const rule = detail.find(([re]) => re.test(o.material.name || ''));
      if (rule) surfaceDetail(o.material, { ...rule[1], unit: 1000 / MODEL_SCALE });
    });
  }

  // Espelhos: cada face plana grande do black piano reflete o próprio produto (a tampa, os
  // bornes e o display; as laterais, os pegadores). Uma câmera espelhada no plano da face
  // renderiza o produto acima dele; o verniz usa essa imagem no lugar do ambiente.
  const mirrors = mirrorSpecs.flatMap((spec) => {
    const group = board.userData.layers.get(spec.layer) || board;
    const dir = new THREE.Vector3(...spec.dir).normalize();
    const areas = new Map();
    let material = null;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    group.traverse((o) => {
      if (!o.isMesh || !spec.material.test(o.material.name || '')) return;
      material = o.material;
      const { position: pos, normal } = o.geometry.attributes;
      const idx = o.geometry.index;
      const count = idx ? idx.count : pos.count;
      const at = (k) => (idx ? idx.getX(k) : k);
      for (let k = 0; k < count; k += 3) {
        nrm.fromBufferAttribute(normal, at(k));
        nrm.add(b.fromBufferAttribute(normal, at(k + 1))).add(c.fromBufferAttribute(normal, at(k + 2)));
        if (nrm.normalize().dot(dir) < 0.999) continue;
        a.fromBufferAttribute(pos, at(k));
        b.fromBufferAttribute(pos, at(k + 1)).sub(a);
        c.fromBufferAttribute(pos, at(k + 2)).sub(a);
        const key = Math.round(a.dot(dir) * 1000);
        const face = areas.get(key) || { area: 0, box: new THREE.Box3() };
        face.area += b.cross(c).length() / 2;
        face.box.expandByPoint(a).expandByPoint(b.add(a)).expandByPoint(c.add(a));
        areas.set(key, face);
      }
    });
    if (!material || !areas.size) return [];
    // A face externa: entre os planos grandes (≥ 30% do maior), o mais de fora.
    const big = Math.max(...[...areas.values()].map((f) => f.area));
    const key = Math.max(...[...areas].filter(([, f]) => f.area >= big * 0.3).map(([k]) => k));
    const offset = key / 1000;
    const faceBox = areas.get(key).box;
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 4,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: true,
    });
    const uniforms = {
      tex: { value: target.texture },
      mat: { value: new THREE.Matrix4() },
      n: { value: new THREE.Vector3() },
      d: { value: 0 },
      on: { value: 0 },
    };
    material.userData.mirrors = [...(material.userData.mirrors || []), uniforms];
    material.needsUpdate = true;
    return [
      {
        group,
        dir,
        offset,
        faceBox,
        target,
        uniforms,
        camera: new THREE.PerspectiveCamera(),
        plane: new THREE.Plane(),
      },
    ];
  });

  // Estúdio branco de verdade: chão e parede infinita (ciclorama com curva no rodapé) em
  // 3D, iluminados pelas mesmas luzes do produto, mais a sombra de contato. A luz desenha o
  // espaço (manchas no chão, queda nas paredes, sombra), em vez de clarear a imagem.
  let contact = null;
  let wash = null;
  let reflect = null;
  let nat = null;
  if (white) {
    const box = new THREE.Box3().setFromObject(board);
    const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(36, 0)];
    for (let k = 1; k <= 12; k++) {
      const a = -Math.PI / 2 + (k / 12) * (Math.PI / 2);
      profile.push(new THREE.Vector2(36 + Math.cos(a) * 9, 9 + Math.sin(a) * 9));
    }
    profile.push(new THREE.Vector2(45, 60));
    const cyc = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 96),
      new THREE.MeshStandardMaterial({
        color: cycColor ?? (cinema ? 0x121316 : 0xe6e7e9),
        roughness: cinema ? 0.85 : 0.92,
        side: THREE.DoubleSide,
      }),
    );
    cyc.position.y = box.min.y;
    cyc.receiveShadow = true;
    if (cinema) {
      // Estúdio escuro: o ciclorama quase não recebe o ambiente (que é claro para o produto).
      cyc.material.envMap = envTarget.texture;
      cyc.material.envMapIntensity = 0.06;
    }
    // Piso brilhante: reflexo planar da bateria (câmera espelhada, só o produto), desfocado e
    // sumindo conforme se afasta da base, como num piso de estúdio envernizado.
    reflect = {
      target: new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        generateMipmaps: true,
      }),
      camera: new THREE.PerspectiveCamera(),
      matrix: new THREE.Matrix4(),
      strength: { value: 0 },
      floorY: box.min.y,
    };
    const halfFoot = new THREE.Vector2(
      (box.max.x - box.min.x) / 2 - 0.15,
      (box.max.z - box.min.z) / 2 - 0.05,
    );
    cyc.material.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, {
        uRefl: { value: reflect.target.texture },
        uReflMatrix: { value: reflect.matrix },
        uReflK: reflect.strength,
        uHalf: { value: halfFoot },
        uFloorY: { value: reflect.floorY },
      });
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vCycW;')
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvCycW = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      sh.fragmentShader = sh.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform sampler2D uRefl;\nuniform mat4 uReflMatrix;\nuniform float uReflK, uFloorY;\nuniform vec2 uHalf;\nvarying vec3 vCycW;',
        )
        .replace(
          '#include <opaque_fragment>',
          `float flr = 1.0 - smoothstep(0.0, 0.3, vCycW.y - uFloorY);
          vec2 fq = abs(vCycW.xz) - uHalf;
          float fd = max(length(max(fq, 0.0)) + min(max(fq.x, fq.y), 0.0), 0.0);
          vec4 rp = uReflMatrix * vec4(vCycW, 1.0);
          vec4 rc = textureLod(uRefl, rp.xy / rp.w, clamp(1.0 + fd * 1.6, 0.0, 6.0));
          vec3 fv = normalize(cameraPosition - vCycW);
          float fres = 0.3 + 0.7 * pow(1.0 - max(fv.y, 0.0), 3.0);
          float rk = uReflK * flr * exp(-fd / 2.2) * fres;
          outgoingLight = outgoingLight * (1.0 - rc.a * rk) + rc.rgb * rk;
          #include <opaque_fragment>`,
        );
    };
    board.traverse((o) => {
      if (o.isMesh) o.layers.enable(1);
    });
    contact = buildContactShadow((box.max.x - box.min.x) / 2 - 0.15, (box.max.z - box.min.z) / 2 - 0.05);
    contact.position.y = box.min.y + 0.002;
    // Luz de fundo: mancha larga no chão e na parede atrás do produto (silhueta).
    wash = new THREE.SpotLight(0xffffff, 0, 0, 34 * DEG, 1, 0);
    wash.position.set(0, 16, 16);
    wash.target.position.set(1.5, 0, -14);
    scene.add(cyc, contact, wash, wash.target);
    // Luz principal do set, parada: uma softbox grande (luz suave que ilumina bem, com um
    // reflexo só) e um sol fraco na mesma direção só para a sombra macia.
    RectAreaLightUniformsLib.init();
    // No estúdio escuro a softbox fica mais perto e menor: a luz cai rápido depois do produto
    // e o chão e o fundo ficam escuros.
    const softbox = new THREE.RectAreaLight(0xfff8f0, 0, cinema ? 4.5 : 7, cinema ? 3.2 : 5);
    // Recortes: duas faixas altas e finas atrás do produto, uma de cada lado, que desenham as
    // arestas contra o fundo escuro (`edge`).
    const edges = [145, 215].map((az) => {
      const strip = new THREE.RectAreaLight(0xf2f5ff, 0, 0.45, 4.5);
      strip.position.set(Math.sin(az * DEG) * 6.5, 3.6, Math.cos(az * DEG) * 6.5);
      strip.lookAt(0, 1.2, 0);
      scene.add(strip);
      return strip;
    });
    const sun = new THREE.DirectionalLight(0xfff4e8, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0002;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 9;
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 45 });
    nat = { softbox, sun, edges };
    scene.add(softbox, sun, sun.target);
  }

  // Luz principal: spot suave com sombra (recorte de luz de estúdio).
  const key = new THREE.SpotLight(0xfff4ea, 0, 0, 10 * DEG, 1, 2);
  // No estúdio branco a luz principal é a janela em 3/4 (abaixo); este spot fica apagado.
  key.castShadow = !white;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.00004;
  key.shadow.normalBias = 0.0009;
  key.shadow.camera.near = 0.05;
  key.shadow.camera.far = 40;
  scene.add(key, key.target);

  // Contraluz frio, sempre do lado oposto à câmera.
  const rim = new THREE.DirectionalLight(0xd4e2ff, 0);
  scene.add(rim, rim.target);

  // Preenchimento quase nulo (azul profundo por cima, preto por baixo); no estúdio branco,
  // o rebatimento neutro das paredes e do chão.
  const fill = white
    ? new THREE.HemisphereLight(cinema ? 0xbfc6d4 : 0xffffff, cinema ? 0x0c0d0f : 0x9a9da3, 0)
    : new THREE.HemisphereLight(0x3a64c8, 0x05070a, 0);
  scene.add(fill);

  if (white) {
    // As luzes também valem no passe do reflexo (camada 1, só o produto).
    [key, rim, fill, wash, nat.softbox, nat.sun, ...nat.edges].forEach((l) => l.layers.enable(1));
    key.shadow.radius = 5;
    key.shadow.blurSamples = 16;
  }

  const camera = new THREE.PerspectiveCamera(30, REF_ASPECT, 0.01, 100);

  // Cena renderizada em HDR (com MSAA e profundidade) e composta num quad.
  const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: 4,
    depthTexture: new THREE.DepthTexture(1, 1),
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
  });

  // Motion blur de câmera de verdade: vários instantes dentro do tempo de obturador
  // somados aqui (a câmera anda entre eles; o produto, parado, fica nítido onde deve). Cada
  // instante é arrastado na tela até a metade do caminho para o instante vizinho (pela
  // profundidade de cada pixel e as câmeras dos dois instantes), então o rastro sai
  // contínuo, sem cópias fantasmas, mesmo com poucos instantes.
  const accumTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
  });
  const blendMat = new THREE.ShaderMaterial({
    vertexShader: COMPOSITE_VERT,
    fragmentShader: /* glsl */ `
      uniform sampler2D tSrc;
      uniform sampler2D tDepth;
      uniform mat4 uInvViewProj;
      uniform mat4 uPrevViewProj;
      uniform mat4 uNextViewProj;
      uniform float uHasPrev;
      uniform float uHasNext;
      uniform float uWeight;
      uniform float uSeed;
      uniform vec2 uResolution;
      varying vec2 vUv;
      // Onde o ponto do mundo cai na tela de outra câmera (deslocamento em uv; 0 se atrás).
      vec2 flowTo(mat4 vp, vec3 w) {
        vec4 c = vp * vec4(w, 1.0);
        if (c.w <= 1e-4) return vec2(0.0);
        vec2 d = (c.xy / c.w) * 0.5 + 0.5 - vUv;
        float l = length(d);
        return l > 0.25 ? d * (0.25 / l) : d;
      }
      void main() {
        float depth = texture2D(tDepth, vUv).x;
        vec4 w = uInvViewProj * vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
        w.xyz /= w.w;
        vec2 dn = flowTo(uNextViewProj, w.xyz);
        vec2 dp = flowTo(uPrevViewProj, w.xyz);
        if (uHasPrev < 0.5) dp = -dn;
        if (uHasNext < 0.5) dn = -dp;
        // Durante a sua fatia do obturador o pixel vê os pontos que estavam entre
        // vUv - dn/2 (fim da fatia) e vUv - dp/2 (começo).
        vec2 a = -0.5 * dn;
        vec2 b = -0.5 * dp;
        float len = length((b - a) * uResolution);
        int taps = int(clamp(ceil(len / 1.5), 1.0, 32.0));
        float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy + uSeed, vec2(0.06711056, 0.00583715))));
        vec4 acc = vec4(0.0);
        for (int i = 0; i < 32; i++) {
          if (i >= taps) break;
          float k = taps == 1 ? 0.5 : (float(i) + j) / float(taps);
          acc += textureLod(tSrc, vUv + mix(a, b, k), 0.0);
        }
        gl_FragColor = acc / float(taps) * uWeight;
      }`,
    uniforms: {
      tSrc: { value: sceneTarget.texture },
      tDepth: { value: sceneTarget.depthTexture },
      uInvViewProj: { value: new THREE.Matrix4() },
      uPrevViewProj: { value: new THREE.Matrix4() },
      uNextViewProj: { value: new THREE.Matrix4() },
      uHasPrev: { value: 0 },
      uHasNext: { value: 0 },
      uWeight: { value: 1 },
      uSeed: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    depthTest: false,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneFactor,
  });
  const blendScene = new THREE.Scene();
  blendScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blendMat));

  const composite = new THREE.ShaderMaterial({
    vertexShader: COMPOSITE_VERT,
    fragmentShader: COMPOSITE_FRAG,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tColor: { value: sceneTarget.texture },
      tDepth: { value: sceneTarget.depthTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uNear: { value: 0.01 },
      uFar: { value: 100 },
      uFocus: { value: 1 },
      uFocusScale: { value: 0 },
      uMaxBlur: { value: 8 },
      uRadScale: { value: 1 },
      uBloom: { value: 0 },
      uGrain: { value: 0 },
      uVignette: { value: 0 },
      uExposure: { value: 1 },
      uFade: { value: 0 },
      uGlow: { value: 0 },
      uGlowCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uGlowRadius: { value: 0.6 },
      uBgBase: { value: BG_BASE },
      uBgGlow: { value: BG_GLOW },
      uFrame: { value: 0 },
      uTransparent: { value: transparent ? 1 : 0 },
      uWave: { value: 0 },
      uWaveFreq: { value: 0 },
      uWavePhase: { value: 0 },
      uChroma: { value: 0 },
      uBlur: { value: new THREE.Vector2(0, 0) },
    },
  });
  const postScene = new THREE.Scene();
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite));
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const size = { width: 1, height: 1 };
  const tmp = new THREE.Vector3();
  const tmpTarget = new THREE.Vector3();
  const tmpUp = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpQ2 = new THREE.Quaternion();
  let frame = 0;

  function setSize(width, height, pixelRatio) {
    size.width = width;
    size.height = height;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const w = Math.max(1, Math.round(width * pixelRatio));
    const h = Math.max(1, Math.round(height * pixelRatio));
    sceneTarget.setSize(w, h);
    accumTarget.setSize(w, h);
    blendMat.uniforms.uResolution.value.set(w, h);
    if (reflect) reflect.target.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
    mirrors.forEach((m) => m.target.setSize(w, h));
    const u = composite.uniforms;
    u.uResolution.value.set(w, h);
    // Desfoque máximo proporcional ao quadro (sutil: <1% do menor lado).
    u.uMaxBlur.value = Math.min(w, h) * 0.0085;
    u.uRadScale.value = Math.max(0.5, (u.uMaxBlur.value * u.uMaxBlur.value) / 84);
  }

  /**
   * Abertura vertical (meia tangente) para a proporção atual, mantendo o enquadramento
   * pensado em 16:9. `fit` 0 preserva a altura (macro), 1 preserva a largura (produto
   * inteiro). `roll` (0-1) é o giro de 90° usado em telas verticais.
   */
  function screenHalfTan(fovDeg, aspect, fit, roll) {
    const tv = Math.tan((fovDeg * DEG) / 2);
    const unrolled = tv * Math.pow(Math.max(REF_ASPECT / aspect, 1), fit);
    if (roll <= 0) return unrolled;
    const boardAspect = 1 / aspect;
    const rolled = tv * Math.pow(Math.max(REF_ASPECT / boardAspect, 1), fit) * boardAspect;
    return unrolled + (rolled - unrolled) * roll;
  }

  /**
   * Atualiza câmera, luzes e composição para um estado da timeline e desenha.
   * @param {object} s Estado calculado pela variante (ver premium.js e social/kinetic.js).
   *   Campos opcionais: `hidden` (quadro sem a placa), `boardPos`, `shiftX`, `cam.roll` (graus),
   *   `orbit` ({ yaw, pitch } em graus, eixos da tela)
   *   e `fx` ({ wave, waveFreq, wavePhase, chroma, blur: [x, y] }, em pixels do quadro).
   */
  /**
   * Luz principal do set (estúdio branco ou escuro): softbox e o sol da sombra na direção
   * keyAz/keyEl (graus no mundo), parados, mirando o centro do produto; e os recortes das
   * arestas (`edge`).
   */
  const SET_CENTER = new THREE.Vector3(0, 1.2, 0);
  const BOX_DIST = cinema ? 8 : 13;
  function placeKeyLight(s) {
    const { softbox, sun, edges } = nat;
    const kaz = s.keyAz * DEG;
    const kel = s.keyEl * DEG;
    const kx = Math.sin(kaz) * Math.cos(kel);
    const ky = Math.sin(kel);
    const kz = Math.cos(kaz) * Math.cos(kel);
    softbox.position.set(kx * BOX_DIST, ky * BOX_DIST + SET_CENTER.y, kz * BOX_DIST);
    softbox.lookAt(SET_CENTER);
    softbox.intensity = s.keyLux * 3.5;
    sun.position.set(kx * 20, ky * 20 + SET_CENTER.y, kz * 20);
    sun.target.position.copy(SET_CENTER);
    sun.target.updateMatrixWorld();
    sun.intensity = s.keyLux * 0.3;
    edges.forEach((e) => (e.intensity = s.edge ?? 0));
  }

  /**
   * Cards Liquid Glass presos ao mundo (`s.glass`: `[{ id, spec, pos, opacity, scale }]`), de
   * frente para a câmera.
   * Criados na primeira vez que aparecem (o texto usa as fontes já carregadas).
   */
  const glassCards = new Map();
  function placeGlass(list) {
    const seen = new Set();
    (list || []).forEach((g) => {
      let card = glassCards.get(g.id);
      if (!card) {
        card = createGlassCard(g.spec);
        // Vidro escuro e discreto: quase não reflete o ambiente claro do produto.
        card.glass.material.envMap = envTarget.texture;
        card.glass.material.envMapIntensity = 0.12;
        glassCards.set(g.id, card);
        scene.add(card.group);
      }
      seen.add(g.id);
      card.group.position.fromArray(g.pos);
      // De frente para a câmera, paralelo à tela (interface limpa no espaço).
      card.group.quaternion.copy(camera.quaternion);
      card.group.scale.setScalar(g.scale);
      card.setOpacity(g.opacity);
    });
    glassCards.forEach((card, id) => {
      if (!seen.has(id)) card.setOpacity(0);
    });
  }

  /**
   * Títulos em 2D por cima da imagem (`s.titles`: `[{ id, spec, x, y, opacity, rise, blur }]`,
   * x/y em % do quadro, `rise` em fração da altura). Cena de sobreposição com câmera
   * ortográfica em alturas de quadro; criados na primeira vez que aparecem.
   */
  const overlayScene = new THREE.Scene();
  const overlayCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1, 1);
  const titles = new Map();
  function placeTitles(list) {
    const aspect = size.width / size.height;
    overlayCamera.left = -aspect / 2;
    overlayCamera.right = aspect / 2;
    overlayCamera.updateProjectionMatrix();
    const seen = new Set();
    (list || []).forEach((t) => {
      let title = titles.get(t.id);
      if (!title) {
        title = createTitle(t.spec);
        titles.set(t.id, title);
        overlayScene.add(title.mesh);
      }
      seen.add(t.id);
      const [w] = title.size;
      const cx = (t.x / 100 - 0.5) * aspect + (t.spec.align === 'left' ? w / 2 : 0);
      title.mesh.position.set(cx, 0.5 - t.y / 100 - t.rise, 0);
      title.set(t);
    });
    titles.forEach((title, id) => {
      if (!seen.has(id)) title.set({ opacity: 0, blur: 0 });
    });
    return seen.size > 0;
  }

  /**
   * Nomes das peças (`s.callouts`: `[{ id, spec, pos, line, label, opacity }]`): um ponto na
   * peça (projetada pela câmera), uma linha fina horizontal que se desenha até a coluna do
   * lado (`side`) e o nome depois dela. Na cena de sobreposição, por cima da imagem.
   */
  const callouts = new Map();
  const calloutPos = new THREE.Vector3();
  const CALLOUT = { colL: 0.2, colR: 0.8, minLen: 0.03, gap: 0.012, dot: 0.0032, line: 0.0012 };
  function placeCallouts(list) {
    const aspect = size.width / size.height;
    const seen = new Set();
    (list || []).forEach((c) => {
      let co = callouts.get(c.id);
      if (!co) {
        const white = () =>
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          });
        const dot = new THREE.Mesh(new THREE.CircleGeometry(1, 24), white());
        const line = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), white());
        const label = createTitle({
          parts: [{ text: c.spec.text, weight: 400, size: 0.0125, color: '#e9ebef', tracking: 0.02 }],
        });
        co = { dot, line, label };
        overlayScene.add(dot, line, label.mesh);
        callouts.set(c.id, co);
      }
      seen.add(c.id);
      // Ponto da peça na tela (coordenadas da sobreposição: altura do quadro = 1).
      calloutPos.fromArray(c.pos).project(camera);
      const X = (calloutPos.x * aspect) / 2;
      const Y = calloutPos.y / 2;
      const right = c.spec.side !== 'left';
      const col = ((right ? CALLOUT.colR : CALLOUT.colL) - 0.5) * aspect;
      const minLen = CALLOUT.minLen * aspect;
      const [w, h] = co.label.size;
      let end = right ? Math.max(col, X + minLen) : Math.min(col, X - minLen);
      // O nome nunca sai do quadro: a linha encurta se for preciso.
      const edge = aspect / 2 - 0.03 * aspect - w - CALLOUT.gap * aspect;
      end = right
        ? Math.min(end, Math.max(edge, X + 0.01 * aspect))
        : Math.max(end, Math.min(-edge, X - 0.01 * aspect));
      const len = (end - X) * c.line;
      co.dot.position.set(X, Y, 0);
      co.dot.scale.setScalar(CALLOUT.dot);
      co.dot.material.opacity = c.opacity;
      co.line.position.set(X + len / 2, Y, 0);
      co.line.scale.set(Math.max(Math.abs(len), 1e-5), CALLOUT.line, 1);
      co.line.material.opacity = c.opacity * 0.75;
      const lx = right ? end + CALLOUT.gap * aspect + w / 2 : end - CALLOUT.gap * aspect - w / 2;
      // A altura do x do texto fica na linha (o plano do título tem folga em cima e embaixo).
      co.label.mesh.position.set(lx, Y + h * 0.06, 0);
      co.label.set({ opacity: c.label, blur: (1 - c.label) * 1.5 });
      co.dot.visible = co.line.visible = c.opacity > 0.002;
    });
    callouts.forEach((co, id) => {
      if (seen.has(id)) return;
      co.dot.visible = co.line.visible = false;
      co.label.set({ opacity: 0, blur: 0 });
    });
    return seen.size > 0;
  }

  /** Posiciona produto, camadas, câmera e luzes para um estado; devolve a distância da câmera. */
  function place(s) {
    const aspect = size.width / size.height;

    // Camadas da vista explodida (só se afastam na vertical).
    board.userData.layers.forEach((g, name) => {
      g.position.y = s.explode?.[name] || 0;
    });

    // Produto: rotação e posição (a geometria nunca muda).
    pivot.rotation.set(s.boardPitch * DEG, s.boardYaw * DEG, s.boardRoll * DEG, 'YXZ');
    const bp = s.boardPos || ZERO3;
    pivot.position.set(bp[0], bp[1] + s.floatY, bp[2]);

    // Câmera em órbita do alvo.
    const az = s.cam.az * DEG;
    const el = s.cam.el * DEG;
    const dist = Math.exp(s.cam.logDist);
    tmpTarget.fromArray(s.cam.target);
    camera.position.set(
      tmpTarget.x + dist * Math.sin(az) * Math.cos(el),
      tmpTarget.y + dist * Math.sin(el),
      tmpTarget.z + dist * Math.cos(az) * Math.cos(el),
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(tmpTarget);
    const rollDeg = s.roll * 90 + (s.cam.roll || 0);
    if (rollDeg) camera.rotateZ(-rollDeg * DEG);
    // Câmera móvel da variante social: órbita em torno do alvo nos eixos da TELA
    // (mesma convenção do rotateY/rotateX do CSS nas camadas de texto), para placa
    // e tipografia se moverem com uma câmera só.
    if (s.orbit && (s.orbit.yaw || s.orbit.pitch)) {
      tmpUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      tmpRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      tmpQ.setFromAxisAngle(tmpUp, -s.orbit.yaw * DEG);
      tmpQ2.setFromAxisAngle(tmpRight, s.orbit.pitch * DEG);
      tmpQ.premultiply(tmpQ2);
      tmp.subVectors(camera.position, tmpTarget).applyQuaternion(tmpQ);
      camera.position.copy(tmpTarget).add(tmp);
      camera.quaternion.premultiply(tmpQ);
    }
    const halfTan = screenHalfTan(s.cam.fov, aspect, s.fit, s.roll) * s.zoomOut;
    camera.fov = (2 * Math.atan(halfTan)) / DEG;
    camera.aspect = aspect;
    camera.near = Math.max(0.004, dist * 0.015);
    // No estúdio branco a parede fica longe (até 45 unidades): o plano de fundo vai além.
    camera.far = white ? Math.max(dist * 4 + 12, 140) : dist * 4 + 12;
    camera.updateProjectionMatrix();
    // Deslocamento ótico (move a composição sem mudar a perspectiva).
    camera.projectionMatrix.elements[8] = -2 * (s.shiftX || 0);
    camera.projectionMatrix.elements[9] = -2 * s.shift;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    placeGlass(s.glass);

    const kaz = s.keyAz * DEG;
    const kel = s.keyEl * DEG;
    if (white) {
      // Set de verdade: luz principal, contraluz e reflexos presos ao mundo (a câmera anda,
      // a luz e as sombras ficam onde estão).
      key.intensity = 0;
      placeKeyLight(s);
      const raz = (s.rimAz ?? 200) * DEG;
      rim.position.set(Math.sin(raz) * 6, 4.5, Math.cos(raz) * 6);
      rim.target.position.set(0, 1, 0);
      rim.intensity = s.rimLux;
      fill.intensity = s.fill;
      scene.environmentIntensity = s.env;
      scene.environmentRotation.set(0, s.sweep * DEG, 0);
      wash.intensity = s.wash ?? 0;
      contact.material.uniforms.uOpacity.value = s.contact ?? 0;
    } else {
      // Luz principal: segue o alvo da câmera, um pouco à frente do caminho.
      key.target.position.set(tmpTarget.x + s.keyLead, 0, tmpTarget.z);
      key.position.set(
        key.target.position.x + s.keyDist * Math.sin(kaz) * Math.cos(kel),
        s.keyDist * Math.sin(kel),
        key.target.position.z + s.keyDist * Math.cos(kaz) * Math.cos(kel),
      );
      key.angle = s.keyAngle * DEG;
      key.intensity = s.keyLux * s.keyDist * s.keyDist;

      // Contraluz atrás do produto em relação à câmera.
      const raz = az + Math.PI + 24 * DEG;
      rim.position.set(Math.sin(raz) * 4, 2.6, Math.cos(raz) * 4);
      rim.target.position.set(0, 0, 0);
      rim.intensity = s.rimLux;
      fill.intensity = s.fill;

      // Reflexos: a softbox vertical corre em torno do reflexo especular da câmera.
      scene.environmentIntensity = s.env;
      scene.environmentRotation.set(0, (s.cam.az + s.sweep) * DEG, 0);
    }

    return dist;
  }

  /** Passe do reflexo do piso: a câmera espelhada no plano do chão vê só o produto. */
  const tmpFwd = new THREE.Vector3();
  const tmpUp2 = new THREE.Vector3();
  const tmpN = new THREE.Vector3();
  const tmpMat = new THREE.Matrix4();
  const mirrorPoint = (v, n, d) => v.sub(tmpN.copy(n).multiplyScalar(2 * (v.dot(n) - d)));
  const mirrorDir = (v, n) => v.sub(tmpN.copy(n).multiplyScalar(2 * v.dot(n)));
  /**
   * Passes dos espelhos (antes do piso e da imagem): câmera espelhada no plano de cada face
   * voltada para a câmera, só o produto, cortado no plano. O verniz não lê os espelhos
   * durante esses passes (nada de reflexo do reflexo, nem textura lida e escrita junto).
   */
  const frustum = new THREE.Frustum();
  const faceWorld = new THREE.Box3();
  function drawMirrors() {
    if (!mirrors.length) return;
    camera.updateMatrixWorld();
    frustum.setFromProjectionMatrix(
      tmpMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
    );
    mirrors.forEach((m) => {
      m.uniforms.on.value = 0;
      m.uniforms.tex.value = null;
    });
    mirrors.forEach((m) => {
      m.group.updateWorldMatrix(true, false);
      const n = m.uniforms.n.value.copy(m.dir).transformDirection(m.group.matrixWorld);
      const d = tmp.copy(m.dir).multiplyScalar(m.offset).applyMatrix4(m.group.matrixWorld).dot(n);
      m.uniforms.d.value = d;
      // Só a face voltada para a câmera e dentro do quadro.
      m.active =
        camera.position.dot(n) - d > 0.02 &&
        frustum.intersectsBox(faceWorld.copy(m.faceBox).applyMatrix4(m.group.matrixWorld));
      if (!m.active) return;
      const mc = m.camera;
      mirrorPoint(mc.position.copy(camera.position), n, d);
      mirrorDir(tmpFwd.set(0, 0, -1).applyQuaternion(camera.quaternion), n);
      mirrorDir(tmpUp2.set(0, 1, 0).applyQuaternion(camera.quaternion), n);
      mc.up.copy(tmpUp2);
      mc.lookAt(tmp.copy(mc.position).add(tmpFwd));
      // Quadro um pouco mais aberto que o da câmera (o deslocamento da lente fica dentro).
      mc.projectionMatrix.copy(camera.projectionMatrix);
      mc.projectionMatrix.elements[0] /= 1.35;
      mc.projectionMatrix.elements[5] /= 1.35;
      mc.projectionMatrixInverse.copy(mc.projectionMatrix).invert();
      mc.layers.set(1);
      mc.updateMatrixWorld();
      m.uniforms.mat.value
        .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
        .multiply(mc.projectionMatrix)
        .multiply(mc.matrixWorldInverse);
      renderer.clippingPlanes = [m.plane.set(n, -(d + 0.002))];
      renderer.setRenderTarget(m.target);
      renderer.clear();
      renderer.render(scene, mc);
    });
    renderer.clippingPlanes = [];
    mirrors.forEach((m) => {
      m.uniforms.tex.value = m.target.texture;
      m.uniforms.on.value = m.active ? 1 : 0;
    });
  }

  /** Passes auxiliares do instante: espelhos e reflexo do piso. */
  function drawReflections(s) {
    drawMirrors();
    if (reflect) {
      reflect.strength.value = s.floorReflect ?? 0;
      if (reflect.strength.value > 0) {
        camera.updateMatrixWorld();
        const mc = reflect.camera;
        mc.position.copy(camera.position);
        mc.position.y = 2 * reflect.floorY - camera.position.y;
        tmpFwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
        tmpFwd.y = -tmpFwd.y;
        tmpUp2.set(0, 1, 0).applyQuaternion(camera.quaternion);
        tmpUp2.y = -tmpUp2.y;
        mc.up.copy(tmpUp2);
        mc.lookAt(tmp.copy(mc.position).add(tmpFwd));
        mc.projectionMatrix.copy(camera.projectionMatrix);
        mc.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
        mc.layers.set(1);
        mc.updateMatrixWorld();
        reflect.matrix
          .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
          .multiply(mc.projectionMatrix)
          .multiply(mc.matrixWorldInverse);
        renderer.setRenderTarget(reflect.target);
        renderer.clear();
        renderer.render(scene, mc);
      }
    }
  }

  function drawScene() {
    renderer.setRenderTarget(sceneTarget);
    renderer.clear();
    renderer.render(scene, camera);
  }

  // Matrizes de projeção × vista de cada instante do obturador (reaproveitadas).
  const sampleViewProj = [];
  const viewProjOf = (ss, i) => {
    place(ss);
    camera.updateMatrixWorld();
    if (!sampleViewProj[i]) sampleViewProj[i] = new THREE.Matrix4();
    return sampleViewProj[i].multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  };

  /**
   * Desenha um estado da timeline. Com `s.samples` (estados em instantes dentro do tempo de
   * obturador), soma todos, cada um arrastado até os vizinhos: motion blur real da câmera.
   */
  function render(s) {
    if (s.hidden) {
      renderer.setRenderTarget(null);
      renderer.clear();
      return;
    }
    let dist;
    const samples = s.samples;
    // A sombra é desenhada uma vez por quadro (no primeiro passe), não em cada passe.
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    if (samples && samples.length > 1) {
      const autoClear = renderer.autoClear;
      renderer.autoClear = false;
      renderer.setRenderTarget(accumTarget);
      renderer.clear();
      const n = samples.length;
      samples.forEach((ss, i) => viewProjOf(ss, i));
      const bu = blendMat.uniforms;
      bu.uWeight.value = 1 / n;
      // O instante do meio por último: a profundidade que fica (foco) é a do quadro.
      const mid = Math.floor((n - 1) / 2);
      const order = [...Array(n).keys()].filter((i) => i !== mid).concat(mid);
      // Espelhos e reflexo do piso uma vez, no instante do meio: no rastro eles se arrastam
      // junto com o resto, e cada instante custaria mais três passes do produto.
      place(samples[mid]);
      drawReflections(samples[mid]);
      order.forEach((i) => {
        place(samples[i]);
        drawScene();
        bu.uInvViewProj.value.copy(sampleViewProj[i]).invert();
        bu.uPrevViewProj.value.copy(sampleViewProj[Math.max(i - 1, 0)]);
        bu.uNextViewProj.value.copy(sampleViewProj[Math.min(i + 1, n - 1)]);
        bu.uHasPrev.value = i > 0 ? 1 : 0;
        bu.uHasNext.value = i < n - 1 ? 1 : 0;
        bu.uSeed.value = i * 17;
        renderer.setRenderTarget(accumTarget);
        renderer.render(blendScene, postCamera);
      });
      renderer.autoClear = autoClear;
      dist = place(s);
      composite.uniforms.tColor.value = accumTarget.texture;
    } else {
      dist = place(s);
      drawReflections(s);
      drawScene();
      composite.uniforms.tColor.value = sceneTarget.texture;
    }

    // Centro do radial de fundo = centro da placa na tela.
    tmp.copy(pivot.position).project(camera);
    const u = composite.uniforms;
    u.uGlowCenter.value.set(tmp.x * 0.5 + 0.5, tmp.y * 0.5 + 0.5);
    u.uGlowRadius.value = 0.62;
    u.uNear.value = camera.near;
    u.uFar.value = camera.far;
    u.uFocus.value = dist;
    u.uFocusScale.value = s.aperture * dist * 0.55;
    u.uBloom.value = s.bloom;
    u.uGrain.value = s.grain ?? 0;
    u.uVignette.value = s.vignette ?? 0;
    u.uExposure.value = s.exposure;
    u.uFade.value = s.fade;
    u.uGlow.value = s.bgGlow;
    u.uFrame.value = frame++ % 64;
    const fx = s.fx || NO_FX;
    u.uWave.value = fx.wave;
    u.uWaveFreq.value = fx.waveFreq;
    u.uWavePhase.value = fx.wavePhase;
    // Valores do quadro em pixels de 1080 px de largura, convertidos para a resolução real.
    const pxScale = u.uResolution.value.x / 1080;
    u.uChroma.value = fx.chroma * pxScale;
    u.uBlur.value.set(fx.blur[0] * pxScale, fx.blur[1] * pxScale);

    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
    // Títulos e nomes das peças por cima da imagem pronta (sem desfoque de câmera, foco ou
    // tom do palco).
    const hasTitles = placeTitles(s.titles);
    const hasCallouts = placeCallouts(s.callouts);
    if (hasTitles || hasCallouts) {
      const autoClear = renderer.autoClear;
      renderer.autoClear = false;
      renderer.render(overlayScene, overlayCamera);
      renderer.autoClear = autoClear;
    }
  }

  /** Compila shaders e envia texturas para a GPU antes do primeiro quadro. */
  async function warmUp(state) {
    const textures = new Set();
    board.traverse((o) => {
      if (!o.isMesh) return;
      ['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach((slot) => {
        if (o.material[slot]) textures.add(o.material[slot]);
      });
    });
    textures.forEach((t) => renderer.initTexture(t));
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    render({ ...state, fade: 0 });
  }

  return { setSize, render, warmUp };
}
