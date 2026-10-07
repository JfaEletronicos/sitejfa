// JFA — "Energia que vira som"
// Filme 3D determinístico: cada quadro é função pura do tempo t (segundos).
// Bateria → Fonte → Caixa de som são as MESMAS peças mudando de pose:
// nada aparece por fade; tudo desliza, gira e se encaixa.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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
  new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.32, metalness: 0.55 }),
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

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
function morphPart(obj, poses, steps) {
  obj.castShadow = obj.receiveShadow = true;
  obj.traverse((o) => {
    if (o.isMesh) o.castShadow = o.receiveShadow = true;
  });
  scene.add(obj);
  parts.push({ obj, poses, steps });
  return obj;
}
const P = (p, r = [0, 0, 0], s = [1, 1, 1]) => ({ p, r, s });

function applyParts(t) {
  for (const { obj, poses, steps } of parts) {
    let cur = poses[steps.length ? steps[0].from : 'A'];
    for (const st of steps) {
      if (t >= st.t1) {
        cur = poses[st.to];
        continue;
      }
      if (t > st.t0) {
        const k = ease(clamp((t - st.t0) / (st.t1 - st.t0)));
        const a = poses[st.from];
        const b = poses[st.to];
        const arc = Math.sin(Math.PI * k);
        const p = lerp3(a.p, b.p, k);
        p[1] += arc * (st.lift || 0);
        if (st.push) p[2] += arc * st.push;
        cur = { p, r: lerp3(a.r, b.r, k), s: lerp3(a.s, b.s, k) };
      }
      break;
    }
    obj.position.set(...cur.p);
    obj.rotation.set(...cur.r);
    obj.scale.set(...cur.s);
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
      { from: 'A1', to: 'B', t0: a0 + 1.1, t1: a0 + 2.2 },
      { from: 'B', to: 'C', t0: b0 + 0.35, t1: b0 + 1.6, lift: 0.25 },
    ],
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
      { from: 'A1', to: 'B', t0: a0 + 1.25 + i * 0.05, t1: a0 + 2.15 + i * 0.05 },
      { from: 'B', to: 'C', t0: b0 + 0.1 + i * 0.07, t1: b0 + 1.3 + i * 0.07, lift: 0.5, push: 0.6 },
    ],
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
  { from: 'A1', to: 'B', t0: a0 + 1.2, t1: a0 + 2.3 },
  { from: 'B', to: 'C', t0: b0 + 0.2, t1: b0 + 1.2, lift: 0.4, push: -0.9 },
]);

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
function cameraAt(t) {
  const take = TAKES.find((k) => t >= k.start && t < k.end) || TAKES[TAKES.length - 1];
  const c = take.cam;
  const k = ease(clamp((t - take.start) / (take.end - take.start)));
  const pos = lerp3(c.from, c.to, k);
  const tgt = lerp3(c.tgtFrom, c.tgtTo || c.tgtFrom, k);
  return { take, pos, tgt, fov: lerp(c.fov[0], c.fov[1] ?? c.fov[0], k) };
}

// ---------- graves ----------
const T13 = TAKES.find((k) => k.id === '13');
const KICKS = [0.35, 0.8, 1.25, 1.42, 1.65].map((x) => T13.start + x);
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

  // Energia: as células acendem ao se abrirem, e o painel liga no take 06.
  const T6 = TAKES.find((k) => k.id === '06');
  const cellGlow = 0.9 * seg(t, a0 + 0.5, a0 + 1.0) * (1 - seg(t, a0 + 1.8, a0 + 2.4));
  cells.forEach((m, i) => {
    const led = seg(t, 15.0 + i * 0.09, 15.25 + i * 0.09);
    const run = Math.max(0, Math.sin((t - T6.start) * 5 - i * 0.6)) * seg(t, T6.start + 0.3, T6.start + 0.8) * (1 - seg(t, T6.end, T6.end + 0.4));
    m.material.emissiveIntensity = cellGlow + 0.5 * run + led * (2.4 + 2.2 * e);
  });
  const volts = 14.4 * seg(t, T6.start + 0.2, T6.start + 1.3);
  const flow = seg(t, T6.start + 0.8, T6.end - 0.1);
  if (t > T6.start - 0.5 && t < b0 + 1.5) psuPanel.redraw(volts, flow);
  else if (t < T6.start) psuPanel.redraw(0, 0);
  plateMats[5].emissiveIntensity = 0.12 + 0.5 * seg(t, T6.start + 0.2, T6.start + 0.6);

  // Graves: emergem de dentro das câmaras girando até assentar na frente.
  woofers.forEach((w, i) => {
    const side = i ? 1 : -1;
    const t0 = 12.45 + i * 0.35;
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
  const shake = 0.035 * e;
  camera.position.set(cam.pos[0] + shake * noise(t * 7), cam.pos[1] + shake * noise(t * 9 + 3), cam.pos[2] + shake * 0.5 * noise(t * 5 + 7));
  camera.fov = cam.fov - 0.6 * e;
  camera.updateProjectionMatrix();
  camera.lookAt(...cam.tgt);
  camera.rotateZ(0.004 * e * noise(t * 11));

  // Abertura do filme a partir do preto.
  renderer.toneMappingExposure = 0.05 + 0.95 * seg(t, 0, 1.1);
  renderer.render(scene, camera);
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
