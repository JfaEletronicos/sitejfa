#!/usr/bin/env node
/**
 * Exporta um motion em vídeo, quadro a quadro, na resolução pedida (padrão: 4K vertical,
 * 2160×3840), com o motion blur real do palco. Grava o canvas do palco (o estúdio da bateria
 * é todo 3D; motions com texto em HTML precisam de captura da página). Precisa do npm run dev
 * rodando e do ffmpeg.
 *
 *   node tools/motion/render.mjs --variant elitio-pro
 *     --size 2160x3840   tamanho do quadro (16:9 em 4K: 3840x2160 com --format 16x9)
 *     --fps 30           quadros por segundo
 *     --range 0-4.5      só um trecho (s)
 *     --format 16x9      proporção da página (padrão: a da variante)
 *     --out arquivo.mp4  saída (padrão .motion-render/<variante>-<tamanho>.mp4)
 *     --keep             mantém os PNG dos quadros
 *     --resume           continua um render interrompido (pula os quadros já gravados)
 *
 * Numa máquina com placa de vídeo é rápido; no Chromium sem GPU (swiftshader) leva horas.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { openFilm, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const variant = args.variant && args.variant !== true ? args.variant : '';
const [width, height] = String(args.size || '2160x3840')
  .split('x')
  .map(Number);
const fps = Number(args.fps || 30);
const dir = join('.motion-render', `${variant || 'premium'}-${width}x${height}`);
const out = args.out || `${dir}.mp4`;
if (!args.resume) rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const query = ['quality=max', args.format ? `format=${args.format}` : ''].filter(Boolean).join('&');
const { browser, page } = await openFilm({ variant, width, height, base: args.base, query });
const duration = await page.evaluate(() => window.partsFilm.duration);
const [t0, t1] = args.range ? String(args.range).split('-').map(Number) : [0, duration];
const frames = Math.round((t1 - t0) * fps);
const started = Date.now();
let drawn = 0;
for (let i = 0; i < frames; i++) {
  const file = join(dir, `${String(i).padStart(5, '0')}.png`);
  if (args.resume && existsSync(file) && statSync(file).size > 0) continue;
  // Desenha o instante e lê o canvas na mesma tarefa (o quadro ainda está no buffer).
  const png = await page.evaluate(
    (t) => {
      window.partsFilm.seek(t);
      return document.querySelector('.pf-canvas').toDataURL('image/png');
    },
    t0 + i / fps,
  );
  // Grava e renomeia: um quadro cortado no meio (render interrompido) nunca fica com o nome final.
  writeFileSync(`${file}.tmp`, Buffer.from(png.split(',')[1], 'base64'));
  renameSync(`${file}.tmp`, file);
  drawn += 1;
  if (i % 10 === 0 || i === frames - 1) {
    const per = (Date.now() - started) / drawn / 1000;
    const left = Math.round((per * (frames - i - 1)) / 60);
    console.log(`quadro ${i + 1}/${frames} · ${per.toFixed(1)} s/quadro · faltam ~${left} min`);
  }
}
await browser.close();

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-loglevel',
    'error',
    '-framerate',
    String(fps),
    '-i',
    join(dir, '%05d.png'),
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '14',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    out,
  ],
  { stdio: 'inherit' },
);
if (!args.keep) rmSync(dir, { recursive: true, force: true });
console.log(out);
