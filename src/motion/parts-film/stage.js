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
 * e deita a placa no plano XZ (componentes para +Y).
 */
function buildBoard(gltf, maxAnisotropy) {
  const root = gltf.scene;
  root.updateMatrixWorld(true);
  const place = new THREE.Matrix4()
    .makeScale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE)
    .multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  const groups = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const geo = o.geometry.clone();
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(place, o.matrixWorld));
    const attrs = Object.keys(geo.attributes).sort().join(',');
    const key = `${o.material.uuid}|${attrs}|${geo.index ? 'i' : 'n'}`;
    if (!groups.has(key)) groups.set(key, { material: o.material, geos: [] });
    groups.get(key).geos.push(geo);
  });

  const board = new THREE.Group();
  board.name = 'Placa LB1004';
  groups.forEach(({ material, geos }) => {
    const geo = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
    geos.forEach((g) => g !== geo && g.dispose());
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    board.add(mesh);
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
 * @param {{ canvas: HTMLCanvasElement, model: ArrayBuffer, transparent?: boolean }} opts
 *   `model` = conteúdo do GLB da placa; `transparent` = fundo transparente (variante social).
 */
export async function createStage({ canvas, model, transparent = false }) {
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
  const envTarget = buildStudioEnvironment(renderer);
  scene.environment = envTarget.texture;

  const pivot = new THREE.Group();
  const board = buildBoard(gltf, renderer.capabilities.getMaxAnisotropy());
  pivot.add(board);
  scene.add(pivot);

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

  // Preenchimento quase nulo (azul profundo por cima, preto por baixo).
  const fill = new THREE.HemisphereLight(0x3a64c8, 0x05070a, 0);
  scene.add(fill);

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
  let frame = 0;

  function setSize(width, height, pixelRatio) {
    size.width = width;
    size.height = height;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const w = Math.max(1, Math.round(width * pixelRatio));
    const h = Math.max(1, Math.round(height * pixelRatio));
    sceneTarget.setSize(w, h);
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
   *   Campos opcionais: `hidden` (quadro sem a placa), `boardPos`, `shiftX`, `cam.roll` (graus)
   *   e `fx` ({ wave, waveFreq, wavePhase, chroma, blur: [x, y] }, em pixels do quadro).
   */
  function render(s) {
    const aspect = size.width / size.height;

    if (s.hidden) {
      renderer.setRenderTarget(null);
      renderer.clear();
      return;
    }

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
    const halfTan = screenHalfTan(s.cam.fov, aspect, s.fit, s.roll) * s.zoomOut;
    camera.fov = (2 * Math.atan(halfTan)) / DEG;
    camera.aspect = aspect;
    camera.near = Math.max(0.004, dist * 0.015);
    camera.far = dist * 4 + 12;
    camera.updateProjectionMatrix();
    // Deslocamento ótico (move a composição sem mudar a perspectiva).
    camera.projectionMatrix.elements[8] = -2 * (s.shiftX || 0);
    camera.projectionMatrix.elements[9] = -2 * s.shift;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

    // Luz principal: segue o alvo da câmera, um pouco à frente do caminho.
    key.target.position.set(tmpTarget.x + s.keyLead, 0, tmpTarget.z);
    const kaz = s.keyAz * DEG;
    const kel = s.keyEl * DEG;
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

    renderer.setRenderTarget(sceneTarget);
    renderer.clear();
    renderer.render(scene, camera);

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
