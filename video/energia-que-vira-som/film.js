// JFA — "Energia que vira som"
// Filme 3D determinístico: cada quadro é função pura do tempo t (segundos).
// Bateria → Fonte → Caixa de som são as MESMAS peças mudando de pose:
// nada aparece por fade; as peças se remodelam no lugar, com squash & stretch de desenho animado.
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
import { createSpirit } from './spirit.js';

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
  let last = '';
  tex.redraw = (...a) => {
    draw(c.getContext('2d'), w, h, ...a);
    tex.needsUpdate = true;
    last = JSON.stringify(a);
  };
  // Redesenha só quando o conteúdo muda (ex.: o voltímetro entre dois quadros iguais).
  tex.redrawIfChanged = (...a) => {
    if (JSON.stringify(a) !== last) tex.redraw(...a);
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
// Todas as peças vivem num "rig" com pivô no piso: é ele que encolhe, estica e quica.
const rig = new THREE.Group();
scene.add(rig);
function morphPart(obj, poses, steps, opts = {}) {
  obj.castShadow = obj.receiveShadow = true;
  obj.traverse((o) => {
    if (o.isMesh) o.castShadow = o.receiveShadow = true;
  });
  rig.add(obj);
  const part = { obj, poses, steps: chainSteps(steps), spark: opts.spark ? makeSpark() : null, sparkAt: opts.sparkAt };
  parts.push(part);
  return obj;
}
const P = (p, r = [0, 0, 0], s = [1, 1, 1]) => ({ p, r, s });

// Curva "mecânica" sem pausa: arranca progressivamente, dispara e assenta com leve
// overshoot (~4%). Não há recuo nem espera: o movimento começa no primeiro quadro.
function mech(x) {
  const u = x * x - 1;
  return 1 + 2.1 * u * u * u + 1.1 * u * u;
}

// Encadeamento: dentro de uma mesma transformação, o passo seguinte começa enquanto o
// anterior ainda termina, e os deslocamentos se somam. A peça nunca para numa pose
// intermediária; só assenta (com tranco e faísca) no fim da corrente.
const CHAIN_GAP = 1.0; // passos separados por menos que isso formam uma corrente
const OVERLAP = 0.4; // fração do passo seguinte que corre junto com o fim do anterior
function chainSteps(steps) {
  for (let i = 0; i < steps.length - 1; i++) {
    const a = steps[i];
    const b = steps[i + 1];
    if (b.t0 - a.t1 < CHAIN_GAP) {
      a.t1 = Math.max(a.t1, b.t0 + OVERLAP * (b.t1 - b.t0));
      a.chained = true;
    }
  }
  return steps;
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
  const sq = squash(t);
  rig.scale.set(1 - 0.5 * sq, 1 + sq, 1 - 0.5 * sq);
  rig.position.y = drop(t);
  for (const part of parts) {
    const { obj, poses, steps } = part;
    // Soma dos deslocamentos de cada passo (telescópica: no fim de tudo, chega à última pose).
    const base = poses[steps[0].from];
    const p = [...base.p];
    const r = [...base.r];
    const s = [...base.s];
    let landed = null;
    for (const st of steps) {
      if (t <= st.t0) break;
      const x = clamp((t - st.t0) / (st.t1 - st.t0));
      const k = st.soft ? ease(x) : mech(x);
      const a = poses[st.from];
      const b = poses[st.to];
      // Arco que sai como um seno e chega com derivada zero em k=1: o overshoot não faz
      // a peça ricochetear e o início não dá tranco.
      const kc = clamp(k);
      const arc = Math.sin(Math.PI * kc) * (1 - kc ** 4);
      for (let i = 0; i < 3; i++) {
        p[i] += (b.p[i] - a.p[i]) * k;
        r[i] += (b.r[i] - a.r[i]) * k + arc * (st.spin ? st.spin[i] : 0);
        s[i] += (b.s[i] - a.s[i]) * k;
      }
      p[1] += arc * (st.lift || 0);
      p[2] += arc * (st.push || 0);
      if (x >= 1 && !st.chained && !st.soft) landed = st;
      else if (x < 1) landed = null;
    }
    // Tranco de encaixe: 2–3 quadros de impacto quando a corrente assenta.
    const age = landed ? t - landed.t1 : 9;
    if (age < 0.3) p[1] -= 0.012 * Math.exp(-age * 30) * Math.cos(age * 90);
    obj.position.set(...p);
    obj.rotation.set(...r);
    obj.scale.set(...s.map((v) => Math.max(v, 0.001)));
    if (part.spark) {
      const on = age < 0.35;
      part.spark.visible = on;
      if (on) {
        const k = Math.exp(-age * 9);
        part.spark.position.set(p[0] + (part.sparkAt?.[0] || 0), p[1] + s[1] / 2, p[2] + s[2] / 2);
        part.spark.scale.setScalar(0.35 * k + 0.05);
        part.spark.material.opacity = k;
      }
    }
  }
}

const rbox = (mat, r = 0.035) => new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 4, r), mat);

// Janelas das transformações (ver timeline.js)
const T3 = TAKES.find((k) => k.id === '03');
const T4 = TAKES.find((k) => k.id === '04');
const T7 = TAKES.find((k) => k.id === '07');
// Abertura: a bateria cai do alto e chega ao chão como num desenho animado — estica na
// queda, achata no impacto ("smack"), quica duas vezes cada vez menos e assenta.
const FALL0 = 0.3; // começa a cair (antes disso está fora de quadro, no alto)
const FALL_H = 2.6; // altura da queda
const FALL_T = 0.5; // tempo até o 1º impacto
const G = (2 * FALL_H) / FALL_T ** 2;
const BOUNCES = [0.28, 0.06]; // alturas dos quiques
const IMPACTS = (() => {
  const out = [FALL0 + FALL_T];
  for (const h of BOUNCES) out.push(out[out.length - 1] + (2 * Math.sqrt(2 * G * h)) / G);
  return out;
})();
const IMPACT_AMP = [1, 0.45, 0.15];
// Altura da bateria acima do piso (física simples: queda + quiques).
function drop(t) {
  if (t < FALL0) return FALL_H;
  if (t < IMPACTS[0]) return FALL_H - 0.5 * G * (t - FALL0) ** 2;
  for (let i = 0; i < BOUNCES.length; i++) {
    if (t < IMPACTS[i + 1]) {
      const u = t - IMPACTS[i];
      return Math.max(0, Math.sqrt(2 * G * BOUNCES[i]) * u - 0.5 * G * u * u);
    }
  }
  return 0;
}
// Squash & stretch da queda: estica enquanto cai rápido, achata em cada impacto.
function fallSquash(t) {
  let s = 0;
  if (t > FALL0 && t < IMPACTS[0]) s += 0.16 * ((t - FALL0) / FALL_T) ** 2;
  IMPACTS.forEach((ti, i) => {
    const u = t - ti;
    if (u >= 0 && u < 1.2) s += -0.24 * IMPACT_AMP[i] * Math.exp(-11 * u) * Math.cos(19 * u);
  });
  return s;
}
// Força dos impactos no chão (poeira, onda e tranco de câmera).
const land = (t) => IMPACTS.reduce((a, ti, i) => (t >= ti ? a + IMPACT_AMP[i] * Math.exp(-(t - ti) * 9) : a), 0);
const a0 = T4.start + 0.2; // bateria → fonte
const b0 = T7.end - 1.0; // fonte → caixa de som (o "tchan" do final)
const POLE_DIVE = T3.end - 0.4; // o espírito mergulha no polo e vira o fio de energia

// Transformações leves, de desenho animado: as peças se remodelam no lugar com
// movimento suave (sem voar nem girar), e o objeto inteiro faz squash & stretch:
// encolhe (antecipação), estica enquanto muda de forma, quica e assenta.
const soft = (from, to, t0, t1, extra = {}) => ({ from, to, t0, t1, soft: true, ...extra });
const SQUASH = [
  [a0 - 0.2, 1],
  [b0 - 0.2, 1],
];
function squash(t) {
  let s = 0;
  for (const [te, amp] of SQUASH) {
    const u = t - te;
    if (u < 0) continue;
    if (u < 0.2) s += -0.08 * amp * ease(u / 0.2);
    else {
      const v = u - 0.2;
      s += amp * Math.exp(-5.5 * v) * (-0.08 * Math.cos(13 * v) + 0.16 * Math.sin(13 * v));
    }
  }
  return s + fallSquash(t);
}

// Cascas: metades da bateria → corpo da fonte → as duas câmaras dos graves.
for (const side of [-1, 1]) {
  const d = side > 0 ? 0.06 : 0;
  morphPart(
    rbox([M.caseSide, M.caseSide, M.case, M.case, M.case, M.case]),
    {
      A: P([side * 0.4, 0.48, 0], [0, 0, 0], [0.8, 0.92, 0.9]),
      B: P([side * 0.6, 0.27, 0], [0, 0, 0], [1.2, 0.46, 1.3]),
      C: P([side * 0.76, 0.86, 0], [0, 0, 0], [1.5, 1.52, 1.2]),
    },
    [soft('A', 'B', a0 + d, a0 + 1.1 + d), soft('B', 'C', b0 + d, b0 + 0.9 + d)],
  );
}

// Núcleo de energia: a luz azul que aparece pela fresta quando a bateria "abre".
const core = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), M.cell.clone());
morphPart(
  core,
  {
    A: P([0, 0.48, 0], [0, 0, 0], [0.05, 0.8, 0.82]),
    B: P([0, 0.27, 0], [0, 0, 0], [0.05, 0.38, 1.2]),
    C: P([0, 0.86, 0], [0, 0, 0], [0.05, 1.4, 1.1]),
  },
  [soft('A', 'B', a0, a0 + 1.0), soft('B', 'C', b0, b0 + 0.9)],
);

// Tampa: tampa da bateria → tampa da fonte → painel das cornetas.
const LID = {
  A: P([0, 0.96, 0], [0, 0, 0], [1.64, 0.08, 0.94]),
  B: P([0, 0.52, 0], [0, 0, 0], [2.44, 0.05, 1.34]),
  C: P([0, 1.845, 0], [0, 0, 0], [3.1, 0.45, 1.26]),
};
const lidSteps = () => [soft('A', 'B', a0 + 0.05, a0 + 1.15), soft('B', 'C', b0 + 0.05, b0 + 0.95)];
morphPart(rbox(M.case, 0.02), LID, lidSteps());
// Parafusos dos cantos acompanham a tampa (viram os cantos de alumínio do painel).
for (const [cx, cz] of [[-0.74, -0.38], [0.74, -0.38], [-0.74, 0.38], [0.74, 0.38]]) {
  const bolt = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 6), M.alu);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12), M.alu);
  shaft.position.y = -0.07;
  bolt.add(head, shaft);
  morphPart(
    bolt,
    {
      A: P([cx, 1.01, cz]),
      B: P([cx * 1.4, 0.555, cz * 1.6], [0, 0, 0], [0.8, 0.8, 0.8]),
      C: P([cx * 1.95, 2.075, cz * 1.55], [0, 0, 0], [1.3, 1.3, 1.3]),
    },
    lidSteps(),
  );
}

// Base: fundo da bateria → base da fonte → plinto da caixa.
morphPart(
  rbox(M.aluDark, 0.015),
  {
    A: P([0, 0.02, 0], [0, 0, 0], [1.64, 0.04, 0.94]),
    B: P([0, 0.02, 0], [0, 0, 0], [2.44, 0.04, 1.34]),
    C: P([0, 0.05, 0], [0, 0, 0], [3.1, 0.1, 1.26]),
  },
  [soft('A', 'B', a0, a0 + 1.0), soft('B', 'C', b0, b0 + 0.9)],
);

// Células: sobem de dentro da bateria e viram as aletas da fonte; depois deslizam
// para a frente e viram as réguas de LED da caixa.
const cells = [];
for (let i = 0; i < 8; i++) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const ledTop = row === 0;
  const lx = -1.14 + col * 0.76;
  const m = rbox(M.cell, 0.02);
  m.material = M.cell.clone();
  m.userData.ledX = lx;
  m.userData.ledTop = ledTop;
  cells.push(m);
  morphPart(
    m,
    {
      A: P([-0.6 + col * 0.4, 0.48, row ? 0.2 : -0.2], [0, 0, 0], [0.17, 0.8, 0.36]),
      B: P([-0.7 + i * 0.2, 0.66, 0], [0, 0, 0], [0.05, 0.22, 1.16]),
      C: P([lx, ledTop ? 1.6 : 0.1, 0.645], [0, 0, 0], [0.7, 0.03, 0.03]),
    },
    [soft('A', 'B', a0 + 0.15 + i * 0.04, a0 + 1.05 + i * 0.04, { lift: 0.15 }), soft('B', 'C', b0 + 0.1 + i * 0.03, b0 + 0.9 + i * 0.03, { lift: 0.15 })],
  );
}

// Rótulo frontal: vira como uma carta (o verso é o painel da fonte). Na caixa, é
// engolido pelo corpo que cresce e fica atrás como placa de bornes.
const plateMats = [M.black, M.black, M.black, M.black,
  new THREE.MeshStandardMaterial({ map: batteryLabel, roughness: 0.45, metalness: 0.2 }),
  new THREE.MeshStandardMaterial({ map: psuPanel, roughness: 0.4, metalness: 0.2, emissiveMap: psuPanel, emissive: 0xffffff, emissiveIntensity: 0.0 }),
];
morphPart(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), plateMats), {
  A: P([0, 0.5, 0.457], [0, 0, 0], [1.2, 0.5, 0.012]),
  B: P([0, 0.27, 0.657], [0, Math.PI, 0], [2.3, 0.4, 0.012]),
  C: P([0, 0.86, -0.607], [0, 0, 0], [1.4, 0.24, 0.012]),
}, [soft('A', 'B', a0 + 0.1, a0 + 1.0, { push: 0.3 }), soft('B', 'C', b0, b0 + 0.8)]);

// Polos: polos da bateria → bornes de saída da fonte → bornes traseiros da caixa.
for (const side of [-1, 1]) {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 24), M.alu);
  const capM = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 32), side < 0 ? M.black : M.red);
  capM.position.y = -0.03;
  g.add(post, capM);
  morphPart(g, {
    A: P([side * 0.55, 1.05, 0], [0, 0, 0], [1, 1, 1]),
    B: P([side * 0.9, 0.3, -0.7], [-Math.PI / 2, 0, 0], [1, 1, 1]),
    C: P([side * 0.45, 0.86, -0.64], [-Math.PI / 2, 0, 0], [1, 1, 1]),
  }, [soft('A', 'B', a0, a0 + 1.0), soft('B', 'C', b0, b0 + 0.8)]);
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
  poly([[1.05, 0.27, 0.67], [1.05, 0.27, 0.9], [1.25, 0.012, 1.1], [1.7, 0.012, 0.9], [1.56, 0.1, 0.645], [1.56, 2.08, 0.645], [-1.56, 2.08, 0.645], [-1.56, 0.1, 0.645], [1.56, 0.1, 0.645]]),
  0.006,
  500,
);
const energyRings = [-1, 1].map((side) => glowPath(circle(side * 0.76, 0.86, 0.66, 0.62), 0.005, 160));

// Cabeça do traço de energia que sai do borne (a câmera do take 07 a persegue).
const T6e = TAKES.find((k) => k.id === '06');
// O primeiro trecho (borne → piso → quina da caixa) é uma fração do comprimento; o resto é
// o contorno. Os dois trechos se sobrepõem, então a energia acelera sem nunca parar.
const BORNE_DIVE = T6e.end - 0.4; // o espírito entra no borne e o traço sai dele
const LEG = (() => {
  const l = energyB.geometry.parameters.path.getCurveLengths();
  return l[3] / l[l.length - 1];
})();
const energyHead = (t) => LEG * seg(t, BORNE_DIVE, BORNE_DIVE + 1.1) + (1 - LEG) * seg(t, BORNE_DIVE + 0.7, b0);
// A câmera persegue a energia até a quina e sobe pela aresta; quando a energia dispara
// pelo contorno, a câmera não a acompanha (seria um chicote) e abre para o plano geral.
// (média de pontos vizinhos no traço: a câmera arredonda as quinas em vez de mudar de direção num quadro)
const energyHeadPoint = (t) => {
  const path = energyB.geometry.parameters.path;
  const h = LEG * seg(t, BORNE_DIVE, BORNE_DIVE + 1.1) + 0.12 * seg(t, BORNE_DIVE + 0.8, BORNE_DIVE + 1.8);
  const acc = [0, 0, 0];
  for (let j = -3; j <= 3; j++) {
    const q = path.getPointAt(clamp(h + j * 0.012, 0.001, 1));
    acc[0] += q.x / 7;
    acc[1] += q.y / 7;
    acc[2] += q.z / 7;
  }
  return acc;
};

function updateEnergy(t, e) {
  // Fase 1: da bateria para a fonte (cabeça corre, cauda segue).
  energyA.reveal(seg(t, a0 + 0.2, a0 + 1.6), seg(t, POLE_DIVE, a0 + 0.6), 1); // (cauda, cabeça)
  // Fase 2: do borne até o projeto da caixa; depois esmaece quando as peças ocupam o lugar.
  const fade = 1 - seg(t, b0 + 1.2, b0 + 2.0);
  const pulse = 0.9 * Math.min(1, e);
  energyB.reveal(0, energyHead(t), Math.max(fade, pulse));
  energyRings.forEach((r, i) => r.reveal(0, seg(t, BORNE_DIVE + 1.0 + i * 0.15, BORNE_DIVE + 1.6 + i * 0.15), Math.max(fade, pulse)));
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
// Corneta retangular de boca larga (tipo trio), montada na frente do painel: campana em
// tronco de pirâmide, moldura de alumínio e o driver escondido dentro do painel.
function makeHorn() {
  const g = new THREE.Group();
  const flareGeo = new THREE.CylinderGeometry(0.27, 0.06, 0.2, 4, 1, true);
  flareGeo.rotateY(Math.PI / 4);
  flareGeo.scale(1.45, 1, 1);
  flareGeo.translate(0, -0.1, 0);
  flareGeo.rotateX(Math.PI / 2); // boca em z=0, fundo em z=-0.2
  const flare = new THREE.Mesh(flareGeo, M.horn);
  const outer = new THREE.Shape();
  outer.moveTo(-0.3, -0.21).lineTo(0.3, -0.21).lineTo(0.3, 0.21).lineTo(-0.3, 0.21).lineTo(-0.3, -0.21);
  const hole = new THREE.Path();
  hole.moveTo(-0.272, -0.186).lineTo(-0.272, 0.186).lineTo(0.272, 0.186).lineTo(0.272, -0.186).lineTo(-0.272, -0.186);
  outer.holes.push(hole);
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.025, bevelEnabled: false }), M.alu);
  const driver = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.14), M.aluDark);
  driver.position.z = -0.27;
  const throat = new THREE.Mesh(new THREE.CircleGeometry(0.055, 32), M.led.clone());
  throat.position.z = -0.195;
  g.add(flare, frame, driver, throat);
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
const waves = Array.from({ length: 5 }, () => {
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
// Curvas de câmera sem pausa: a câmera entra no take já em movimento e sai ainda em
// movimento (a velocidade nunca chega a zero nas pontas). O "peso" vem só da variação
// de velocidade dentro do take.
const CURVES = {
  glide: (x) => x, // grua em velocidade constante
  float: (x) => 1.5 * x - 0.5 * x * x, // entra rápida e desacelera, sem parar (1,5 → 0,5)
  in: (x) => 0.5 * x + 0.5 * x * x, // entra mais lenta e acelera (0,5 → 1,5)
  stop: (x) => 1.3 * x - 0.3 * x * x, // chega freando, ainda em movimento (1,3 → 0,7)
};
function cameraAt(t) {
  const take = TAKES.find((k) => t >= k.start && t < k.end) || TAKES[TAKES.length - 1];
  const c = take.cam;
  const x = clamp((t - take.start) / (take.end - take.start));
  const curve = CURVES[c.curve || 'glide'];
  const k = curve(x);
  // Inércia: a mira segue a posição com um pequeno atraso no meio do take, mas já se
  // move no primeiro quadro e ainda se move no último.
  const kt = clamp(k - 0.05 * Math.sin(Math.PI * x));
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
// Antes da primeira pancada, o sistema "carrega" (LEDs sobem e correm, cones vibram);
// a última pancada abre a onda de choque que atravessa a tela e leva ao mundo real.
const KICKS = [0.8, 0.55, 0.38, 0.25].map((x) => END_3D - x);
const SHOCK = KICKS[KICKS.length - 1];
const KICK_AMP = [0.6, 0.8, 0.9, 1.4];

// Encadeamento entre grupos de animação: cada grupo começa antes de o anterior acabar.
const POWER = a0 + 1.3; // a fonte liga enquanto as últimas peças ainda assentam
// O som é o "tchan" do final: graves, cornetas e LEDs entram em cascata rápida de "pops".
const T8 = TAKES.find((k) => k.id === '08');
const T10 = TAKES.find((k) => k.id === '10');
const WOOFER_POP = T8.start; // o grave esquerdo salta de dentro do anel de energia
const HORN_POP = T10.start - 0.05;
const backOut = (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2; // pop com overshoot
// O espírito de energia acende as luzes ao passar: pula pelas cornetas (cada garganta
// acende no toque), corre pela régua de cima (esq. → dir.), desce e volta pela de baixo.
const SPAN = 1.62; // meia-largura do percurso do espírito na frente da caixa
const HOP = [T10.start - 0.05, T10.end];
const LED_TOP = [HOP[1], HOP[1] + 0.3];
const LED_BOT = [LED_TOP[1] + 0.1, LED_TOP[1] + 0.4];
const LED_END = LED_BOT[1] + 0.3; // fim das rampas (réguas e anéis)
const passX = (x, [t0, t1], dir = 1) => t0 + ((dir > 0 ? x + SPAN : SPAN - x) / (2 * SPAN)) * (t1 - t0);
const HORN_X = [-1.14, -0.38, 0.38, 1.14];

// ---------- espírito de energia ----------
const spirit = createSpirit(
  scene,
  {
    pole: [0.55, 1.08, 0],
    borne: [1.05, 0.27, 0.67],
    wooferL: [-0.76, 0.86, 0.63],
    hornX: HORN_X,
    hornY: 1.845,
    hornZ: 0.9,
    span: SPAN,
    ledY: [1.6, 0.1],
    ledZ: 0.72,
    poleApproach: TAKES.find((k) => k.id === '03').start - 0.05,
    poleDive: POLE_DIVE, // = início do fio de energia da bateria
    emergeA: a0 + 0.6, // = fim do fio (frente da futura fonte)
    fonteOrbit: TAKES.find((k) => k.id === '05').start - 0.05,
    panel: T6e.start - 0.05,
    borneDive: BORNE_DIVE, // = saída do traço que desenha a caixa
    emergeB: b0, // = fim do traço (quina da caixa)
    ring: [T8.start - 0.05, T8.end],
    hop: HOP,
    ledTop: LED_TOP,
    ledBot: LED_BOT,
    windup: [T13.start, KICKS[0]],
    shock: SHOCK,
    end: END_3D,
    hidden: [[POLE_DIVE, a0 + 0.6], [BORNE_DIVE, b0], [KICKS[0], SHOCK]],
    touches: [POLE_DIVE, a0 + 0.6, BORNE_DIVE, b0, KICKS[0], SHOCK],
    stars: [
      { t: IMPACTS[IMPACTS.length - 1] + 0.25, p: [0.85, 0.98, 0.48], s: 0.35 },
      { t: POLE_DIVE, p: [0.55, 1.16, 0.02], s: 0.55 },
      { t: a0 + 0.6, p: [0, 0.27, 0.88], s: 0.45 },
      { t: TAKES.find((k) => k.id === '05').start + 0.05, p: [1.2, 0.55, 0.67], s: 0.4 },
      { t: BORNE_DIVE, p: [1.05, 0.27, 0.72], s: 0.5 },
      { t: b0, p: [1.56, 0.12, 0.67], s: 0.45 },
      { t: T8.end - 0.05, p: [-0.76, 0.86, 0.9], s: 0.4 },
      ...HORN_X.map((x) => ({ t: passX(x, HOP), p: [x, 1.845, 0.9], s: 0.26 })),
      { t: LED_BOT[1], p: [-SPAN, 0.1, 0.72], s: 0.3 },
      { t: KICKS[0], p: [0, 0.86, 0.72], s: 1.0 },
      { t: SHOCK, p: [0, 0.86, 0.8], s: 0.8 },
    ],
  },
  sparkTex,
);
function bass(t) {
  let e = 0;
  for (const k of KICKS) if (t >= k) e += Math.exp(-(t - k) * 9) * clamp((t - k) / 0.03);
  return Math.min(e, 1.4);
}

// ---------- texto: uma frase só, em reticências, que atravessa o filme ----------
const T2 = TAKES.find((k) => k.id === '02');
const T12 = TAKES.find((k) => k.id === '12');
const CAPTIONS = [
  { t0: IMPACTS[IMPACTS.length - 1] + 0.35, t1: T2.end - 0.1, html: 'A partir da energia <b>JFA</b>…' },
  { t0: a0 + 1.35, t1: TAKES.find((k) => k.id === '05').end - 0.5, html: '…tudo se transforma…' },
  { t0: T12.start + 0.1, t1: T12.end + 0.4, html: '…até virar som.' },
];
const capEl = document.getElementById('cap');
let capHtml = '';
function updateCaption(t) {
  const c = CAPTIONS.find((k) => t >= k.t0 - 0.05 && t <= k.t1 + 0.4);
  if (!c || t >= END_CARD_START) {
    capEl.style.opacity = '0';
    return;
  }
  if (c.html !== capHtml) capEl.innerHTML = capHtml = c.html;
  const a = seg(t, c.t0, c.t0 + 0.45) * (1 - seg(t, c.t1, c.t1 + 0.35));
  capEl.style.opacity = String(a);
  capEl.style.transform = `translateY(${(1 - seg(t, c.t0, c.t0 + 0.6)) * 10}px)`;
}

// ---------- quadro ----------
let fontsReady = false;
export function renderAt(t, draw = true) {
  const end = document.getElementById('end');
  if (t >= END_CARD_START) {
    // Encerramento: apenas "JFA — Energia que vira som."
    end.style.opacity = String(seg(t, END_CARD_START, END_CARD_START + 0.9));
    end.querySelector('.tag').style.opacity = String(seg(t, END_CARD_START + 0.5, END_CARD_START + 1.4));
    return;
  }
  end.style.opacity = '0';
  updateCaption(t);

  applyParts(t);
  const e = bass(t);
  updateEnergy(t, e);

  // Energia: as células acendem ao se abrirem; a fonte liga enquanto ainda termina de
  // se montar, e o voltímetro sobe sem interrupção até o close do take 06.
  const T6 = TAKES.find((k) => k.id === '06');
  const cellGlow = 0.9 * seg(t, a0 + 0.05, a0 + 0.35) * (1 - seg(t, a0 + 0.9, a0 + 1.3));
  core.material.emissiveIntensity = 2.6 * cellGlow;
  // Carga antes do grave: LEDs sobem e uma onda corre pelas réguas.
  // Começa antes de os LEDs terminarem e já sobe rápido (ease-out), sem trecho morto.
  const charge = (1 - (1 - clamp((t - (LED_END - 0.3)) / (KICKS[0] - LED_END + 0.3))) ** 2) * (1 - seg(t, KICKS[0], KICKS[0] + 0.2));
  cells.forEach((m, i) => {
    const pass = m.userData.ledTop ? passX(m.userData.ledX, LED_TOP) : passX(m.userData.ledX, LED_BOT, -1);
    const led = seg(t, pass - 0.04, pass + 0.22);
    const chase = 1 + 0.9 * Math.sqrt(charge) * Math.max(0, Math.sin(t * 7 - i * 0.9));
    const run = Math.max(0, Math.sin((t - POWER) * 5 - i * 0.6)) * seg(t, POWER, POWER + 0.5) * (1 - seg(t, T6.end, T6.end + 0.4));
    m.material.emissiveIntensity = cellGlow + 0.5 * run + led * (2.4 + 1.2 * charge + 2.2 * e) * chase;
  });
  const volts = 14.4 * seg(t, POWER + 0.2, T6.start + 0.85);
  const flow = seg(t, T6.start + 0.5, T6.end - 0.1);
  if (t < b0 + 1.5) psuPanel.redrawIfChanged(volts, flow);
  plateMats[5].emissiveIntensity = 0.12 + 0.5 * seg(t, POWER, POWER + 0.5);

  // Graves: saltam de dentro das câmaras com um "pop" (leve overshoot), um depois do outro.
  woofers.forEach((w, i) => {
    const side = i ? 1 : -1;
    const t0 = WOOFER_POP + i * 0.3;
    const k = backOut(clamp((t - t0) / 0.5));
    w.position.set(side * 0.76, 0.86, lerp(0.2, 0.63, k));
    w.rotation.set(0, 0, lerp(side * -0.6, 0, k));
    w.visible = t > t0;
    w.userData.cone.position.z = 0.09 * e * Math.cos((t - T13.start) * 26) + 0.012 * charge * Math.sin(t * 31 + i);
    w.userData.surround.scale.setScalar(1 + 0.02 * e);
    const ringPass = passX(side * 0.76, LED_BOT, -1); // acende quando o espírito passa embaixo
    w.userData.ring.material.emissiveIntensity = seg(t, ringPass - 0.04, ringPass + 0.3) * (2.2 + 1.5 * charge + 2.5 * e);
  });

  // Cornetas: saltam do painel uma a uma, com "pop".
  horns.forEach((h, i) => {
    const t0 = HORN_POP + i * 0.1;
    const k = backOut(clamp((t - t0) / 0.4));
    const x = HORN_X[i];
    h.position.set(x, 1.845 + 0.006 * e * Math.sin(t * 90 + i), lerp(0.4, 0.83, k));
    h.scale.setScalar(lerp(0.7, 1, Math.min(k, 1.05)));
    h.visible = t > t0;
    const touch = passX(x, HOP); // acende quando o espírito encosta na boca
    h.userData.throat.material.emissiveIntensity = seg(t, touch - 0.03, touch + 0.15) * (1.5 + 1.5 * charge + 3 * e);
  });

  // Ondas no piso a cada pancada.
  waves.forEach((w, i) => {
    const kt = [IMPACTS[0], ...KICKS][i];
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
    if (onFloor) yy += (e + 0.8 * land(t)) * 0.12 * rnd * (1.2 - Math.min(1, Math.hypot(x, z) / 5));
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
  [...KICKS.map((k, i) => [k, KICK_AMP[i]]), ...IMPACTS.map((k, i) => [k, 0.5 * IMPACT_AMP[i]])].forEach(([kt, amp], i) => {
    const age = t - kt;
    if (age < 0 || age > 1.2) return;
    jolt += amp * 0.03 * Math.exp(-age * 16) * Math.cos(age * 34);
    punch += amp * 1.6 * Math.exp(-age * 11);
    roll += amp * 0.006 * Math.exp(-age * 7) * Math.sin(age * 22 + i);
  });
  camera.position.set(cam.pos[0] + 0.006 * e * noise(t * 7), cam.pos[1] - jolt, cam.pos[2]);
  camera.fov = cam.fov - punch;
  camera.updateProjectionMatrix();
  camera.lookAt(...cam.tgt);
  camera.rotateZ(roll);

  spirit.update(t, e, camera);

  // Abertura do filme a partir do preto (sobe já no primeiro quadro).
  renderer.toneMappingExposure = 0.05 + 0.95 * (1 - Math.pow(1 - clamp(t / 0.5), 2));
  const dist = Math.hypot(cam.pos[0] - cam.focusPt[0], cam.pos[1] - cam.focusPt[1], cam.pos[2] - cam.focusPt[2]);
  bokeh.uniforms.focus.value = dist;
  bokeh.uniforms.aperture.value = cam.take.cam.dof || 0.00008;
  bloom.strength = 0.38 + 0.3 * Math.min(e, 1);
  finish.uniforms.time.value = t;
  finish.uniforms.shock.value = t >= SHOCK && t < END_3D ? (t - SHOCK) / (END_3D - SHOCK) : -1;
  if (draw) composer.render();
}

// Estado de movimento de um quadro (para checar continuidade sem renderizar).
export function probe(t) {
  renderAt(t, false);
  const v = (o) => [o.position.x, o.position.y, o.position.z];
  return {
    take: cameraAt(t).take.id,
    cam: v(camera),
    dir: camera.getWorldDirection(new THREE.Vector3()).toArray(),
    parts: parts.map((p) => [...v(p.obj), p.obj.rotation.x, p.obj.rotation.y, p.obj.rotation.z, p.obj.scale.x, p.obj.scale.y, p.obj.scale.z]),
    woofers: woofers.map((w) => [...v(w), w.rotation.z]),
    horns: horns.map((h) => [...v(h), h.rotation.z]),
  };
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
  window.__film = { renderAt, probe, END_3D, END_CARD_START, TOTAL, ready: fontsReady };

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
