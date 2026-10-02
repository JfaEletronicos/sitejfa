#!/usr/bin/env node
/**
 * Monta o modelo do motion da E-LÍTIO PRO (public/models/elitio-pro.glb) a partir do CAD
 * original da caixa (SolidWorks → glTF, em assets/elitio-pro/caixa-cad.glb):
 *   - materiais reais no lugar das cores de exibição do CAD (caixa black piano, moldura do
 *     display, botão liga/desliga em aço, tela apagada);
 *   - adesivos do arquivo de impressão (recortes do PDF, tamanho real) nas faces da caixa;
 *   - arruela e parafuso sextavado nos bornes, anel vermelho no positivo e alças de corda
 *     trançada (geometria, sem textura), conforme a foto do produto.
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
  screen: new THREE.MeshPhysicalMaterial({ name: 'Display tela (apagada)', color: 0x0a0b12, roughness: 0.06,
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
