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
 * Estúdio branco (variante da bateria): sala em meia-luz, chão claro que rebate luz, uma
 * softbox grande e suave no alto e dois rebatedores laterais fracos e fixos. Só o
 * suficiente para o black piano ter forma; o brilho que anda vem da passagem de luz de cada
 * take (uma luz por vez), não do ambiente. Nenhuma imagem é usada.
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
  box(5, 3.2, 1.1, [0, 4.8, 0.4]);
  box(1.6, 5, 0.42, [-4.8, 0.8, 1.4]);
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

/**
 * Feixe de luz no ar: cone aberto da fonte para onde a luz aponta, somado à imagem, mais
 * forte perto da fonte e no miolo do cone, com variação lenta (fumaça leve). Cone unitário
 * (ponta na origem, base de raio 1 em y = -1) posto no lugar a cada quadro por `aimBeam`.
 */
function buildBeam() {
  const geo = new THREE.CylinderGeometry(0.03, 1, 1, 48, 1, true);
  geo.translate(0, -0.5, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.ZeroFactor,
    blendDstAlpha: THREE.OneFactor,
    uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color(1.0, 0.97, 0.92) } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying vec3 vW;
      varying vec3 vN;
      void main() {
        vAlong = uv.y;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform vec3 uColor;
      varying float vAlong;
      varying vec3 vW;
      varying vec3 vN;
      void main() {
        float core = pow(abs(dot(normalize(vN), normalize(cameraPosition - vW))), 2.2);
        float fade = pow(vAlong, 1.3) * smoothstep(0.0, 0.25, vAlong);
        float haze = 0.75 + 0.25 * sin(vW.x * 2.3 + vW.y * 1.7 + vW.z * 2.9);
        gl_FragColor = vec4(uColor * uOpacity * core * fade * haze, 0.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 5;
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * Poeira no ar que só aparece dentro do feixe (brilha ao atravessar a luz e some fora dela),
 * flutuando devagar. Pontos somados à imagem; posição calculada no shader pelo tempo.
 */
function buildDust(count = 2400) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  let r = 0x9e3779b9;
  const rnd = () => {
    r ^= r << 13;
    r ^= r >>> 17;
    r ^= r << 5;
    return (r >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    pos[i * 3] = -9 + rnd() * 18;
    pos[i * 3 + 1] = 0.2 + rnd() * 11;
    pos[i * 3 + 2] = -7 + rnd() * 16;
    seed[i] = rnd();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.ZeroFactor,
    blendDstAlpha: THREE.OneFactor,
    uniforms: {
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uApex: { value: new THREE.Vector3() },
      uAxis: { value: new THREE.Vector3(0, -1, 0) },
      uCos: { value: 0.98 },
      uLen: { value: 10 },
      uProj: { value: 800 },
    },
    vertexShader: /* glsl */ `
      attribute float seed;
      uniform float uTime, uCos, uLen, uProj;
      uniform vec3 uApex, uAxis;
      varying float vLit;
      void main() {
        float t = uTime;
        vec3 p = position + vec3(
          sin(t * 0.13 + seed * 31.0) * 0.45,
          sin(t * 0.09 + seed * 17.0) * 0.3 - t * 0.02,
          cos(t * 0.11 + seed * 23.0) * 0.45);
        p.y = 0.2 + mod(p.y - 0.2, 11.0);
        vec3 d = p - uApex;
        float along = dot(d, uAxis);
        float c = along / max(length(d), 1e-3);
        float inside = smoothstep(uCos, mix(uCos, 1.0, 0.35), c) * step(0.0, along) * (1.0 - smoothstep(uLen * 0.8, uLen, along));
        float twinkle = 0.55 + 0.45 * sin(t * (0.6 + seed) + seed * 40.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float px = (0.006 + 0.01 * fract(seed * 7.3)) * uProj / max(-mv.z, 0.05);
        vLit = inside * twinkle * min(px * px, 1.0);
        gl_PointSize = clamp(px, 1.0, 6.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vLit;
      void main() {
        vec2 q = gl_PointCoord * 2.0 - 1.0;
        float a = max(1.0 - dot(q, q), 0.0);
        gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * uOpacity * vLit * a * a, 0.0);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 6;
  return points;
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
      vec3 body = a > 0.0001 ? toSRGB(neutralToneMap(scene.rgb / a * uExposure)) * a : vec3(0.0);
      vec3 halo = toSRGB(glow(uv) * uBloom) * (1.0 - a);
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
 *   `detail` = [[/nome do material/, { wear, scratch, peel }]] acabamento fino no shader.
 */
export async function createStage({
  canvas,
  model,
  transparent = false,
  upAxis = 'z',
  studio = 'dark',
  cyc: cycColor = null,
  detail = [],
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
  // "white": estúdio branco; "cinema": set escuro (grafite, faixas de luz). Os dois têm
  // ciclorama 3D, piso com reflexo, sombra de contato, feixes de luz no ar e luzes presas ao
  // mundo.
  const white = studio === 'white' || studio === 'cinema';
  const cinema = studio === 'cinema';
  const envTarget =
    studio === 'white' ? buildWhiteStudioEnvironment(renderer) : buildStudioEnvironment(renderer);
  scene.environment = envTarget.texture;

  const pivot = new THREE.Group();
  const board = buildBoard(gltf, renderer.capabilities.getMaxAnisotropy(), upAxis);
  pivot.add(board);
  scene.add(pivot);
  // Acabamento fino (casca de laranja, riscos, desgaste) por nome de material; o ruído
  // usa milímetros (1 unidade de cena = 1000 / MODEL_SCALE mm).
  if (detail.length) {
    board.traverse((o) => {
      if (!o.isMesh) return;
      const rule = detail.find(([re]) => re.test(o.material.name || ''));
      if (rule) surfaceDetail(o.material, { ...rule[1], unit: 1000 / MODEL_SCALE });
    });
  }

  // Estúdio branco de verdade: chão e parede infinita (ciclorama com curva no rodapé) em
  // 3D, iluminados pelas mesmas luzes do produto, mais a sombra de contato. A luz desenha o
  // espaço (manchas no chão, queda nas paredes, sombra), em vez de clarear a imagem.
  let contact = null;
  let wash = null;
  let reflect = null;
  let pass = null;
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
        color: cycColor ?? (cinema ? 0x2a2c30 : 0xe6e7e9),
        roughness: cinema ? 0.8 : 0.92,
        side: THREE.DoubleSide,
      }),
    );
    cyc.position.y = box.min.y;
    cyc.receiveShadow = true;
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
    // Passagem de luz (uma por take): spot com sombra que acende onde passa, uma faixa de
    // softbox no mesmo lugar (o brilho que corre pelo black piano, pelo display e pelos
    // metais) e o feixe visível no ar com poeira brilhando dentro dele.
    RectAreaLightUniformsLib.init();
    const spot = new THREE.SpotLight(0xfff3e6, 0, 0, 12 * DEG, 0.75, 2);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.bias = -0.00006;
    spot.shadow.normalBias = 0.001;
    spot.shadow.radius = 4;
    spot.shadow.camera.near = 0.5;
    spot.shadow.camera.far = 40;
    const strip = new THREE.RectAreaLight(0xfff6ee, 0, 2.4, 0.5);
    pass = { spot, strip, beam: buildBeam(), dust: buildDust() };
    scene.add(spot, spot.target, strip, pass.beam, pass.dust);
  }

  // Luz principal: spot suave com sombra (recorte de luz de estúdio).
  const key = new THREE.SpotLight(0xfff4ea, 0, 0, 10 * DEG, 1, 2);
  key.castShadow = true;
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
    [key, rim, fill, wash, pass.spot, pass.strip].forEach((l) => l.layers.enable(1));
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
   * Passagem de luz do take: a faixa de softbox na posição do reflexo (o brilho que corre)
   * e o spot com o feixe e a poeira um pouco acima dela, mirando o mesmo ponto.
   */
  const passDir = new THREE.Vector3();
  const passFrom = new THREE.Vector3();
  const passGlint = new THREE.Vector3();
  const passAim = new THREE.Vector3();
  const DOWN = new THREE.Vector3(0, -1, 0);
  function placePass(ps) {
    const { spot, strip, beam, dust } = pass;
    const on = ps && (ps.lux > 0 || ps.glint > 0) && ps.pos;
    if (!on) {
      spot.intensity = 0;
      strip.intensity = 0;
      beam.visible = false;
      dust.visible = false;
      return;
    }
    passFrom.fromArray(ps.spot || ps.pos);
    passGlint.fromArray(ps.pos);
    passAim.fromArray(ps.aim);
    const d = passFrom.distanceTo(passAim);
    passDir.subVectors(passAim, passFrom).normalize();
    spot.position.copy(passFrom);
    spot.target.position.copy(passAim);
    spot.target.updateMatrixWorld();
    spot.angle = ps.angle * DEG;
    spot.intensity = ps.lux * d * d;
    // Faixa fina de través ao caminho: a linha de brilho atravessa a superfície (em vez de
    // escorregar ao longo de si mesma).
    strip.position.copy(passGlint);
    strip.up.fromArray(ps.dir || [0, 1, 0]);
    if (strip.up.lengthSq() < 1e-8) strip.up.set(0, 1, 0);
    strip.up.normalize();
    strip.lookAt(passAim);
    strip.width = ps.strip[0];
    strip.height = ps.strip[1];
    strip.intensity = ps.glint;
    // O feixe vai até o chão (ou bem além do alvo, se a luz vier de lado).
    const len = passDir.y < -0.05 ? Math.min(passFrom.y / -passDir.y, d * 2.5) : d * 1.6;
    const radius = Math.tan(ps.angle * DEG) * len;
    beam.visible = ps.beam > 0;
    beam.position.copy(passFrom);
    beam.quaternion.setFromUnitVectors(DOWN, passDir);
    beam.scale.set(radius, len, radius);
    beam.material.uniforms.uOpacity.value = ps.beam;
    const du = dust.material.uniforms;
    dust.visible = ps.dust > 0;
    du.uOpacity.value = ps.dust;
    du.uTime.value = ps.time;
    du.uApex.value.copy(passFrom);
    du.uAxis.value.copy(passDir);
    du.uCos.value = Math.cos(ps.angle * DEG * 1.1);
    du.uLen.value = len;
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
    if (pass) {
      const h = size.height * renderer.getPixelRatio();
      pass.dust.material.uniforms.uProj.value = h / (2 * Math.tan((camera.fov * DEG) / 2));
    }

    const kaz = s.keyAz * DEG;
    const kel = s.keyEl * DEG;
    if (white) {
      // Set de verdade: luz principal, contraluz e reflexos presos ao mundo (a câmera anda,
      // a luz e as sombras ficam onde estão).
      const kd = 14;
      key.target.position.set(0, 0.9, 0);
      key.position.set(
        kd * Math.sin(kaz) * Math.cos(kel),
        kd * Math.sin(kel),
        kd * Math.cos(kaz) * Math.cos(kel),
      );
      key.angle = s.keyAngle * DEG;
      key.intensity = s.keyLux * kd * kd;
      const raz = (s.rimAz ?? 200) * DEG;
      rim.position.set(Math.sin(raz) * 6, 4.5, Math.cos(raz) * 6);
      rim.target.position.set(0, 1, 0);
      rim.intensity = s.rimLux;
      fill.intensity = s.fill;
      scene.environmentIntensity = s.env;
      scene.environmentRotation.set(0, s.sweep * DEG, 0);
      wash.intensity = s.wash ?? 0;
      contact.material.uniforms.uOpacity.value = s.contact ?? 0;
      placePass(s.pass);
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
  function drawScene(s) {
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
      order.forEach((i) => {
        place(samples[i]);
        drawScene(samples[i]);
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
      drawScene(s);
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
