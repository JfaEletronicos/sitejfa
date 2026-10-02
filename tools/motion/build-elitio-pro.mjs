#!/usr/bin/env node
/**
 * Monta o modelo do motion da E-LÍTIO PRO (public/models/elitio-pro.glb) a partir do CAD
 * original da caixa (SolidWorks → glTF, em assets/elitio-pro/caixa-cad.glb):
 *   - materiais reais no lugar das cores de exibição do CAD (caixa black piano, moldura do
 *     display, botão liga/desliga em aço; a tela acesa é desenhada no shader do palco);
 *   - adesivos do arquivo de impressão (recortes do PDF, tamanho real) nas faces da caixa;
 *   - arruela e parafuso sextavado nos bornes, anel vermelho no positivo e alças de corda
 *     trançada (geometria, sem textura), conforme a foto do produto;
 *   - rebarba da injeção na linha de molde entre corpo e tampa e marca do ponto de injeção;
 *   - camadas da vista explodida (grupos EXPLODE_<camada>: corpo, células, suporte, barramentos, BMS, tampa, anéis, botão,
 *     painel, arruelas e parafusos), com células,
 *     barramentos e BMS conceituais (formas limpas, sem componentes inventados).
 * O acabamento fino da superfície (casca de laranja, riscos, desgaste) é feito no shader do
 * palco (surface-detail.js), sem textura.
 * A geometria do CAD não é alterada. Roda no Chromium (o exportador do three precisa de canvas):
 *
 *   node tools/motion/build-elitio-pro.mjs
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';

const ROOT = new URL('../../', import.meta.url).pathname;
const SRC = join(ROOT, 'assets/elitio-pro');
const OUT = join(ROOT, 'public/models/elitio-pro.glb');

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    for (const base of [process.env.PLAYWRIGHT_MODULE_DIR, '/opt/node-tools/node_modules/']) {
      if (!base) continue;
      try {
        return createRequire(join(base, 'noop.js'))('playwright');
      } catch {
        // tenta o próximo
      }
    }
  }
  throw new Error('Playwright não encontrado.');
}

const PAGE = /* html */ `<!doctype html><script type="importmap">
{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}
</script><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const gltf = await new GLTFLoader().loadAsync('/src/caixa-cad.glb');
const root = new THREE.Group();
root.name = 'E-LITIO PRO 12V 280Ah';
const cad = gltf.scene;
root.add(cad);
const mm = 0.001; // o CAD está em metros

const piano = new THREE.MeshPhysicalMaterial({ name: 'Caixa black piano', color: 0x030304, roughness: 0.12,
  ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.015 });
const M = {
  frame: new THREE.MeshPhysicalMaterial({ name: 'Display moldura', color: 0x8e9197, roughness: 0.35, metalness: 0.1,
    clearcoat: 0.6, clearcoatRoughness: 0.15 }),
  face: new THREE.MeshPhysicalMaterial({ name: 'Display face', color: 0x060607, roughness: 0.1, clearcoat: 1,
    clearcoatRoughness: 0.02 }),
  screen: new THREE.MeshPhysicalMaterial({ name: 'Display tela', color: 0x0a0b12, roughness: 0.06,
    clearcoat: 1, clearcoatRoughness: 0.01 }),
  dark: new THREE.MeshStandardMaterial({ name: 'Display peças escuras', color: 0x111215, roughness: 0.4 }),
  light: new THREE.MeshStandardMaterial({ name: 'Display ícones', color: 0xdfe2e6, roughness: 0.45 }),
  key: new THREE.MeshPhysicalMaterial({ name: 'Display teclas', color: 0x2b2e33, roughness: 0.35, clearcoat: 0.5 }),
  button: new THREE.MeshStandardMaterial({ name: 'Botão liga/desliga aço', color: 0xa9adb3, roughness: 0.28, metalness: 1 }),
  zinc: new THREE.MeshStandardMaterial({ name: 'Parafuso zincado', color: 0xc2c5ca, roughness: 0.32, metalness: 1 }),
  red: new THREE.MeshPhysicalMaterial({ name: 'Anel positivo', color: 0xb3121a, roughness: 0.18, clearcoat: 1,
    clearcoatRoughness: 0.03 }),
  grip: new THREE.MeshPhysicalMaterial({ name: 'Pegador', color: 0x050506, roughness: 0.35, clearcoat: 0.6,
    clearcoatRoughness: 0.2 }),
  rope: new THREE.MeshStandardMaterial({ name: 'Corda', color: 0x0c0c0d, roughness: 0.7 }),
};
// Índice do material no CAD → material real (conjunto do display)
const DISPLAY = { 0: 'frame', 1: 'dark', 2: 'light', 3: 'dark', 4: 'screen', 5: 'key', 6: 'light', 7: 'face', 8: 'dark' };
cad.traverse((o) => {
  if (!o.isMesh) return;
  const idx = gltf.parser.associations.get(o.material)?.materials;
  const inDisplay = o.parent?.name?.includes('DISPLAY') || o.name.startsWith('mesh_1');
  if (o.name.includes('Bot') || o.parent?.name?.includes('Bot')) o.material = M.button;
  else if (!inDisplay) o.material = piano;
  else o.material = M[DISPLAY[idx]] || M.dark;
});

// Peças acrescentadas (em mm, convertidas para metros)
const parts = new THREE.Group();
parts.name = 'Acabamento (foto do produto)';
parts.scale.setScalar(mm);
root.add(parts);
const add = (mesh, x, y, z, name) => { mesh.position.set(x, y, z); mesh.name = name; parts.add(mesh); return mesh; };

const POCKET_Y = 233.8, TERM = { x: 185, z: -55, top: 236.6 }, TOP = 239.9;
function terminal(x, ring, tag) {
  if (ring) add(new THREE.Mesh(new THREE.TorusGeometry(13, 2.2, 16, 48), ring), x, POCKET_Y + 0.8, TERM.z, 'Anel ' + tag).rotation.x = Math.PI / 2;
  add(new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 1.4, 40), M.zinc), x, TERM.top + 0.7, TERM.z, 'Arruela ' + tag);
  add(new THREE.Mesh(new THREE.CylinderGeometry(6.8, 6.8, 5.5, 6), M.zinc), x, TERM.top + 4.15, TERM.z, 'Parafuso ' + tag).rotation.y = Math.PI / 6;
  add(new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.8, 0.8, 36), M.zinc), x, TERM.top + 7.3, TERM.z, 'Chanfro ' + tag);
}
terminal(TERM.x, M.red, 'positivo');
terminal(-TERM.x, null, 'negativo');

// Rebarba da injeção: filete fino e irregular de plástico na linha de molde entre corpo e
// tampa (y ≈ 194,6 mm) contornando a caixa, e a marca do ponto de injeção nas pontas.
{
  const hx = 222.5, hz = 85, r = 6, y = 194.6, path = [];
  const corner = (cx, cz, a0) => {
    for (let k = 0; k <= 8; k++) {
      const a = a0 + (k / 8) * (Math.PI / 2);
      path.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r, Math.cos(a), Math.sin(a)]);
    }
  };
  const side = (x0, z0, x1, z1, nx, nz) => {
    const n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 1.5);
    for (let k = 1; k < n; k++) path.push([x0 + ((x1 - x0) * k) / n, z0 + ((z1 - z0) * k) / n, nx, nz]);
  };
  corner(hx - r, hz - r, 0); side(hx - r, hz, -hx + r, hz, 0, 1);
  corner(-hx + r, hz - r, Math.PI / 2); side(-hx, hz - r, -hx, -hz + r, -1, 0);
  corner(-hx + r, -hz + r, Math.PI); side(-hx + r, -hz, hx - r, -hz, 0, -1);
  corner(hx - r, -hz + r, (3 * Math.PI) / 2); side(hx, -hz + r, hx, hz - r, 1, 0);
  // Saliência de 0,1 a 1,1 mm: trechos quase lisos e alguns picos (sementes fixas).
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const lumps = Array.from({ length: 40 }, () => [rnd() * path.length, 2 + rnd() * 14, rnd()]);
  const out = path.map((_, i) => {
    let o = 0.1;
    lumps.forEach(([c, w, a]) => {
      const d = Math.min(Math.abs(i - c), path.length - Math.abs(i - c));
      o += a * Math.exp(-(d * d) / (w * w)) * 0.9;
    });
    return Math.min(o, 1.1);
  });
  const pos = [], idx = [], t = 0.18;
  path.forEach(([x, z, nx, nz], i) => {
    const o = out[i];
    pos.push(x, y - t, z, x + nx * o, y - t * 0.4, z + nz * o, x + nx * o, y + t * 0.4, z + nz * o, x, y + t, z);
  });
  for (let i = 0; i < path.length; i++) {
    const a = i * 4, b = ((i + 1) % path.length) * 4;
    for (let k = 0; k < 3; k++) idx.push(a + k, b + k, b + k + 1, a + k, b + k + 1, a + k + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  add(new THREE.Mesh(geo, piano), 0, 0, 0, 'Rebarba da linha de molde');
  const gate = new THREE.MeshPhysicalMaterial({ name: 'Ponto de injeção', color: 0x060607, roughness: 0.55,
    clearcoat: 0.3, clearcoatRoughness: 0.5 });
  for (const sx of [1, -1]) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.8, 0.5, 32), gate), sx * (hx + 0.2), 26, 0,
      'Ponto de injeção').rotation.z = Math.PI / 2;
  }
}

// Corda trançada: três fios em hélice em volta do caminho
function rope(curve, name) {
  const N = 220, frames = curve.computeFrenetFrames(N, false), len = curve.getLength();
  const twist = (len / 9) * Math.PI * 2;
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, p = curve.getPointAt(u), a = u * twist + (s * Math.PI * 2) / 3;
      const n = frames.normals[i], b = frames.binormals[i];
      pts.push(p.clone().addScaledVector(n, Math.cos(a) * 1.35).addScaledVector(b, Math.sin(a) * 1.35));
    }
    add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N, 1.3, 8, false), M.rope), 0, 0, 0, name + ' fio ' + (s + 1));
  }
}
const LUG = { x: 230, z: 52 }, BODY_L = 445;
for (const side of [1, -1]) {
  const hx = side * LUG.x, gx = side * (BODY_L / 2 + 14), tag = side > 0 ? 'positivo' : 'negativo';
  add(new THREE.Mesh(new RoundedBoxGeometry(16, 20, 132, 4, 6), M.grip), gx, 40, 0, 'Pegador ' + tag);
  for (const z of [-LUG.z, LUG.z]) {
    const zs = Math.sign(z);
    rope(new THREE.CatmullRomCurve3([
      new THREE.Vector3(hx, 188, z), new THREE.Vector3(hx, 200, z), new THREE.Vector3(hx + side * 7, 201, z + zs * 2),
      new THREE.Vector3(gx + side, 175, z + zs * 4), new THREE.Vector3(gx, 110, z + zs * 7),
      new THREE.Vector3(gx, 52, z + zs * 9), new THREE.Vector3(gx, 36, z + zs * 9),
    ]), 'Corda ' + tag);
  }
}

// Adesivos (BOPP com laminação fosca)
const loader = new THREE.TextureLoader();
async function label(file, w, h, name) {
  const t = await loader.loadAsync('/src/adesivos/' + file);
  t.colorSpace = THREE.SRGBColorSpace;
  t.userData.mimeType = 'image/webp';
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({
    name: 'Adesivo ' + name, map: t, alphaTest: 0.5, roughness: 0.6, specularIntensity: 0.35 }));
  m.name = 'Adesivo ' + name;
  parts.add(m);
  return m;
}
const LABEL_Y = 97.5, CASE_D = 170;
(await label('frontal.webp', 235, 152.9, 'frontal')).position.set(0, LABEL_Y, CASE_D / 2 + 0.25);
{ const m = await label('ficha.webp', 75, 152.9, 'ficha técnica'); m.rotation.y = Math.PI; m.position.set(BODY_L / 2 - 15 - 75 / 2, LABEL_Y, -CASE_D / 2 - 0.25); }
{ const m = await label('superior.webp', 235, 58.1, 'superior'); m.rotation.x = -Math.PI / 2; m.position.set(-8, TOP + 0.2, 39); }
{ const m = await label('aviso-recomendado.webp', 58.1, 25, 'RECOMENDADO'); m.rotation.x = -Math.PI / 2; m.position.set(TERM.x - 5, TOP + 0.2, -14); }
{ const m = await label('aviso-atencao.webp', 58.1, 25, 'ATENÇÃO'); m.rotation.x = -Math.PI / 2; m.position.set(-TERM.x + 5, TOP + 0.2, -14); }

// ---- Vista explodida: a caixa vira camadas que o palco afasta na vertical ----
// Grupos EXPLODE_<nome> (corpo, células, bms, tampa). A caixa do CAD é dividida na linha de
// molde (y = 194,6 mm): o que está acima vai com a tampa (com display, botão, bornes, alças e
// adesivos de cima); o corpo leva os adesivos da frente e de trás, a rebarba e as marcas.
root.updateMatrixWorld(true);
const L = {};
const LAYERS = ['body', 'cells', 'holder', 'bus', 'bms', 'lid', 'rings', 'button', 'panel', 'washers', 'bolts'];
for (const name of LAYERS) {
  L[name] = new THREE.Group();
  L[name].name = 'EXPLODE_' + name;
  root.add(L[name]);
}
const SEAM = 0.1946;
let caseMesh = null;
cad.traverse((o) => {
  if (o.isMesh && o.material === piano) caseMesh = o;
});
{
  const g = caseMesh.geometry.index ? caseMesh.geometry.toNonIndexed() : caseMesh.geometry.clone();
  g.applyMatrix4(caseMesh.matrixWorld);
  const P = g.attributes.position, N = g.attributes.normal;
  const parts2 = { lid: [[], []], body: [[], []] };
  for (let i = 0; i < P.count; i += 3) {
    const cy = (P.getY(i) + P.getY(i + 1) + P.getY(i + 2)) / 3;
    const dst = parts2[cy > SEAM ? 'lid' : 'body'];
    for (let k = 0; k < 3; k++) {
      dst[0].push(P.getX(i + k), P.getY(i + k), P.getZ(i + k));
      dst[1].push(N.getX(i + k), N.getY(i + k), N.getZ(i + k));
    }
  }
  for (const name of ['lid', 'body']) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(parts2[name][0], 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(parts2[name][1], 3));
    const m = new THREE.Mesh(geo, piano);
    m.name = name === 'lid' ? 'Tampa (CAD)' : 'Corpo (CAD)';
    L[name].add(m);
  }
  caseMesh.parent.remove(caseMesh);
}
piano.side = THREE.DoubleSide;
// Peças do CAD: painel (conjunto do display) e botão liga/desliga, cada um na sua camada.
let disp = null;
let btn = null;
cad.traverse((o) => {
  if (!disp && /DISPLAY/.test(o.name)) disp = o;
  if (!btn && /Bot/.test(o.name)) btn = o;
});
L.panel.attach(disp);
L.button.attach(btn);
// Peças acrescentadas, por nome. As alças ficam com o corpo (penduradas na tampa, viram ruído).
for (const o of [...parts.children]) {
  const name = o.name;
  const layer = /frontal|ficha|Rebarba|Ponto de injeção|Pegador|Corda/.test(name)
    ? 'body'
    : /^Anel/.test(name)
      ? 'rings'
      : /^Arruela/.test(name)
        ? 'washers'
        : /^(Parafuso|Chanfro)/.test(name)
          ? 'bolts'
          : 'lid';
  L[layer].attach(o);
}
// Borda do corte: anel na boca do corpo (parede de 3 mm). A tampa fica aberta por baixo
// (o BMS mora dentro dela quando a bateria está fechada).
function roundRect(hx, hz, r) {
  const sh = new THREE.Shape();
  sh.moveTo(-hx + r, -hz);
  sh.lineTo(hx - r, -hz); sh.absarc(hx - r, -hz + r, r, -Math.PI / 2, 0, false);
  sh.lineTo(hx, hz - r); sh.absarc(hx - r, hz - r, r, 0, Math.PI / 2, false);
  sh.lineTo(-hx + r, hz); sh.absarc(-hx + r, hz - r, r, Math.PI / 2, Math.PI, false);
  sh.lineTo(-hx, -hz + r); sh.absarc(-hx + r, -hz + r, r, Math.PI, Math.PI * 1.5, false);
  return sh;
}
const mmGroup = (layer, name) => {
  const g = new THREE.Group();
  g.name = name;
  g.scale.setScalar(mm);
  L[layer].add(g);
  return g;
};
{
  const ring = roundRect(222.5, 85, 6);
  ring.holes.push(roundRect(219.5, 82, 4));
  const m = new THREE.Mesh(new THREE.ShapeGeometry(ring, 12), piano);
  m.rotation.x = -Math.PI / 2; m.position.y = 194.6; m.name = 'Boca do corpo';
  mmGroup('body', 'Corte do corpo').add(m);
}
// Células prismáticas (conceituais): alumínio acetinado, tampa isolante e dois terminais.
{
  const g = mmGroup('cells', 'Células');
  const alu = new THREE.MeshPhysicalMaterial({ name: 'Célula alumínio', color: 0xaeb4bc, metalness: 1, roughness: 0.32 });
  const cap = new THREE.MeshPhysicalMaterial({ name: 'Célula tampa', color: 0x1a1c20, roughness: 0.6 });
  const stud = new THREE.MeshStandardMaterial({ name: 'Célula terminal', color: 0xc9cdd3, metalness: 1, roughness: 0.25 });
  for (const x of [-117, -39, 39, 117]) {
    const body = new THREE.Mesh(new RoundedBoxGeometry(72, 180, 160, 3, 3), alu);
    body.position.set(x, 96, 0); g.add(body);
    const top = new THREE.Mesh(new RoundedBoxGeometry(70, 2, 156, 2, 0.8), cap);
    top.position.set(x, 187, 0); g.add(top);
    for (const z of [-52, 52]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 6, 32), stud);
      t.position.set(x, 191, z); g.add(t);
    }
  }
}
// Suporte das células: placa isolante preta com furos para os terminais (conceitual).
{
  const g = mmGroup('holder', 'Suporte das células');
  const sh = new THREE.Shape();
  sh.moveTo(-152, -83); sh.lineTo(152, -83); sh.lineTo(152, 83); sh.lineTo(-152, 83); sh.closePath();
  for (const x of [-117, -39, 39, 117]) for (const z of [-52, 52]) {
    const h = new THREE.Path();
    h.absarc(x, z, 7.5, 0, Math.PI * 2, false);
    sh.holes.push(h);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: true, bevelSize: 0.6, bevelThickness: 0.6, bevelSegments: 2, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ name: 'Suporte das células', color: 0x141518, roughness: 0.55 }));
  m.position.y = 188.6;
  g.add(m);
}
// Barramentos de cobre (ligação em série) e módulo BMS com dissipador (conceituais).
{
  const g = mmGroup('bus', 'Barramentos');
  const cu = new THREE.MeshPhysicalMaterial({ name: 'Barramento cobre', color: 0xc8814f, metalness: 1, roughness: 0.28 });
  for (const [x, z] of [[-78, 52], [0, -52], [78, 52]]) {
    const b = new THREE.Mesh(new RoundedBoxGeometry(84, 3, 22, 2, 1), cu);
    b.position.set(x, 196, z); g.add(b);
  }
}
{
  const g = mmGroup('bms', 'BMS');
  const anod = new THREE.MeshPhysicalMaterial({ name: 'BMS anodizado', color: 0x23262b, metalness: 0.5, roughness: 0.38 });
  const fin = new THREE.MeshStandardMaterial({ name: 'BMS dissipador', color: 0x9da3ab, metalness: 1, roughness: 0.4 });
  const plate = new THREE.Mesh(new RoundedBoxGeometry(170, 6, 70, 2, 1.5), anod);
  plate.position.set(0, 200, 0); g.add(plate);
  for (let k = 0; k < 14; k++) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 60), fin);
    f.position.set(-71.5 + k * 11, 207, 0); g.add(f);
  }
}

const glb = await new GLTFExporter().parseAsync(root, { binary: true });
const bytes = new Uint8Array(glb);
let bin = '';
for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
window.result = btoa(bin);
</script>`;

const TYPES = {
  '.js': 'text/javascript',
  '.glb': 'model/gltf-binary',
  '.webp': 'image/webp',
  '.html': 'text/html',
};
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = null;
  if (url === '/') return res.writeHead(200, { 'content-type': 'text/html' }).end(PAGE);
  if (url.startsWith('/three/')) file = join(ROOT, 'node_modules/three', url.slice(7));
  else if (url.startsWith('/src/')) file = join(SRC, url.slice(5));
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const { chromium } = await loadPlaywright();
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error(e.message));
await page.goto(`http://localhost:${server.address().port}/`);
const b64 = await page
  .waitForFunction(() => window.result, null, { timeout: 120000 })
  .then((h) => h.jsonValue());
writeFileSync(OUT, Buffer.from(b64, 'base64'));
console.log(OUT, Math.round(Buffer.from(b64, 'base64').length / 1024), 'KB');
await browser.close();
server.close();
