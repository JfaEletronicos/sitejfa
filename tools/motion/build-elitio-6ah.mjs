#!/usr/bin/env node
/**
 * Monta o modelo provisório da E-LÍTIO PRO 12,8V 6Ah (public/models/elitio-6ah.glb), feito
 * em código a partir das fotos do produto enquanto não chega o CAD oficial. Caixa no formato
 * padrão 12V 6/7Ah (151 × 65 × 94 mm): corpo e tampa com aba (linha de molde), degrau dos
 * terminais numa ponta com bloco vermelho no positivo e preto no negativo, e terminais faston
 * F2 (6,35 mm) dobrados em L com furo. Mesmos nomes de material da 280Ah ("Caixa black
 * piano"...), então o filme aplica o mesmo acabamento (look, detail, mirrors). Adesivos do
 * arquivo de impressão (assets/elitio-6ah/adesivos, recortes do PDF em tamanho real). Grupos EXPLODE_body e EXPLODE_lid para os espelhos.
 *
 *   node tools/motion/build-elitio-6ah.mjs [6ah|10ah]
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SRC = join(ROOT, 'assets/elitio-6ah');
// Modelos: 6Ah (151 × 65 × 94 mm) e 10Ah (151 × 98 × 95 mm), mesmos adesivos em tamanho.
const MODELS = {
  '6ah': { name: '6Ah', L: 151, D: 65, H: 94 },
  '10ah': { name: '10Ah', L: 151, D: 98, H: 95 },
};
const ID = process.argv[2] || '6ah';
const CFG = { ...MODELS[ID], id: ID };
if (!MODELS[ID]) throw new Error(`Modelo desconhecido: ${ID} (6ah ou 10ah)`);
const OUT = join(ROOT, `public/models/elitio-${ID}.glb`);

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
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const root = new THREE.Group();
const CFG = ${JSON.stringify(CFG)};
root.name = 'E-LITIO PRO 12,8V ' + CFG.name;
const mm = new THREE.Group();
mm.scale.setScalar(0.001);
root.add(mm);
const layer = (name) => {
  const g = new THREE.Group();
  g.name = 'EXPLODE_' + name;
  mm.add(g);
  return g;
};
const body = layer('body');
const lid = layer('lid');

const piano = new THREE.MeshPhysicalMaterial({ name: 'Caixa black piano', color: 0x030304, roughness: 0.12,
  ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.015 });
const red = new THREE.MeshPhysicalMaterial({ name: 'Bloco positivo', color: 0xb8262b, roughness: 0.32,
  clearcoat: 0.6, clearcoatRoughness: 0.12 });
const block = new THREE.MeshPhysicalMaterial({ name: 'Bloco negativo', color: 0x0a0a0b, roughness: 0.3,
  clearcoat: 0.7, clearcoatRoughness: 0.1 });
const tin = new THREE.MeshStandardMaterial({ name: 'Terminal estanhado', color: 0xc8cbd0, roughness: 0.3, metalness: 1 });

const { L, D, H } = CFG; // comprimento (x), profundidade (z), altura até o topo da tampa
const BODY = H - 20; // altura do corpo (a tampa tem 20 mm)
const STEP = 20; // largura do degrau dos terminais (ponta -x)
const STEP_Y = H - 8; // fundo do degrau
const box = (w, h, d, r, mat, x, y, z, parent, name) => {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat);
  m.position.set(x, y, z);
  m.name = name;
  parent.add(m);
  return m;
};
// Corpo um pouco mais estreito que a tampa: a aba da tampa desenha a linha de molde.
box(L - 1.6, BODY, D - 1.6, 2.5, piano, 0, BODY / 2, 0, body, 'Corpo');
// Tampa: saia (6 mm) e topo; a ponta -x fica mais baixa (degrau dos terminais).
const TOP0 = BODY + 6; // base do topo da tampa
box(L - 0.8, 6.2, D - 0.8, 1.2, piano, 0, BODY + 3, 0, lid, 'Tampa saia');
box(L - STEP, H - TOP0, D, 2.2, piano, STEP / 2, (H + TOP0) / 2, 0, lid, 'Tampa topo');
box(STEP + 2, STEP_Y - TOP0, D, 2.2, piano, -L / 2 + STEP / 2 + 1, (TOP0 + STEP_Y) / 2, 0, lid, 'Tampa degrau');
// Blocos dos terminais no degrau: positivo (vermelho) atrás, negativo (preto) na frente.
const TX = -L / 2 + 9;
const blocks = [
  [-D * 0.29, red, 'positivo'],
  [D * 0.29, block, 'negativo'],
];
for (const [z, mat, tag] of blocks) {
  box(15, 5, 15, 1.2, mat, TX, STEP_Y + 2.5, z, lid, 'Bloco ' + tag);
  // Faston F2 (6,35 × 0,8 mm): sobe do bloco e dobra em L para o lado da tampa, com furo.
  const up = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 6.35), tin);
  up.position.set(TX - 3, STEP_Y + 5 + 4, z);
  up.name = 'Terminal ' + tag + ' haste';
  lid.add(up);
  const bend = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6.35, 16, 1, false, Math.PI / 2, Math.PI / 2), tin);
  bend.rotation.x = Math.PI / 2;
  bend.position.set(TX - 2.6 + 0.4, STEP_Y + 13 - 0.4, z);
  bend.name = 'Terminal ' + tag + ' dobra';
  lid.add(bend);
  const tab = new THREE.Shape();
  tab.moveTo(0, -3.175);
  tab.lineTo(9.5, -3.175);
  tab.lineTo(9.5, 3.175);
  tab.lineTo(0, 3.175);
  tab.closePath();
  const hole = new THREE.Path();
  hole.moveTo(4.2, -1.3);
  hole.lineTo(7.2, -1.3);
  hole.lineTo(7.2, 1.3);
  hole.lineTo(4.2, 1.3);
  hole.closePath();
  tab.holes.push(hole);
  const tg = new THREE.ExtrudeGeometry(tab, { depth: 0.8, bevelEnabled: false });
  tg.rotateX(Math.PI / 2);
  const t = new THREE.Mesh(tg, tin);
  t.position.set(TX - 2.2, STEP_Y + 13.4, z);
  t.name = 'Terminal ' + tag + ' lâmina';
  lid.add(t);
}

// Adesivos do arquivo de impressão (recortes do PDF, tamanho real em mm), rente às faces.
const loader = new THREE.TextureLoader();
const sticker = async (file, name, w, h, parent, pos, rot) => {
  const tex = await loader.loadAsync('/src/adesivos/' + file);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mat = new THREE.MeshPhysicalMaterial({ name, map: tex, roughness: 0.6, specularIntensity: 0.35,
    alphaTest: 0.5 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.name = name;
  parent.add(m);
};
const FRONT_Z = (D - 1.6) / 2 + 0.15;
await sticker('frontal-' + CFG.id + '.webp', 'Adesivo frontal', 139.0, 70.0, body, [0, BODY / 2, FRONT_Z], [0, 0, 0]);
await sticker('ficha-tecnica-' + CFG.id + '.webp', 'Adesivo ficha técnica', 100.2, 70.3, body, [0, BODY / 2, -FRONT_Z], [0, Math.PI, 0]);
// Em cima, ao lado do degrau: os sinais + e − do adesivo ficam junto dos terminais.
await sticker('superior-' + CFG.id + '.webp', 'Adesivo superior', 112.3, 52.3, lid, [STEP / 2 + 0.5, H + 0.15, 0], [-Math.PI / 2, 0, 0]);

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
