#!/usr/bin/env node
/**
 * Captura quadros de um motion para revisar (precisa do npm run dev rodando).
 *
 *   node tools/motion/frames.mjs --variant modelo --times 0.5,1.5,2.4,3.5
 *     --size 432x768     tamanho do quadro (padrão 432x768; 1080x1920 para detalhe)
 *     --out pasta        onde salvar (padrão .motion-frames/<variante>)
 *     --repeat           captura de novo depois de ir até o fim e voltar (segunda rodagem)
 *     --sheet            monta folha de contato (ImageMagick `montage`)
 *     --levels           clareia os quadros da folha (mostra elementos quase apagados)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { openFilm, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const variant = args.variant && args.variant !== true ? args.variant : '';
const [width, height] = String(args.size || '432x768')
  .split('x')
  .map(Number);
const times = String(args.times || '0')
  .split(',')
  .map(Number)
  .filter(Number.isFinite);
const out = args.out || join('.motion-frames', variant || 'premium');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const { browser, page, seek } = await openFilm({ variant, width, height, base: args.base });
const files = [];
const shoot = async (tag) => {
  for (const t of times) {
    await seek(t);
    const file = join(out, `${tag}${t.toFixed(2).padStart(5, '0')}.png`);
    await page.screenshot({ path: file });
    files.push(file);
  }
};
await shoot('');
if (args.repeat) {
  // Segunda rodagem: vai até o fim (passando pelo meio) e volta; tudo deve ser igual.
  const duration = await page.evaluate(() => window.partsFilm.duration);
  for (let t = 0; t <= duration; t += 0.5) await seek(t);
  await shoot('repeat-');
}
await browser.close();

if (args.sheet) {
  const sheet = join(out, 'folha.png');
  const tile = `${Math.min(files.length, 8)}x`;
  const geometry = `${Math.round(width * 0.7)}x${Math.round(height * 0.7)}+2+2`;
  try {
    execFileSync('montage', [...files, '-tile', tile, '-geometry', geometry, '-background', 'gray', sheet]);
    // Clarear depois de montar (o montage do ImageMagick 6 não aceita -level).
    if (args.levels) execFileSync('convert', [sheet, '-level', '0%,45%', sheet]);
    console.log(sheet);
  } catch {
    console.error('Folha de contato: precisa do ImageMagick (montage e convert).');
  }
}
files.forEach((f) => console.log(f));
