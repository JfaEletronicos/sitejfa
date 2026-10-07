// Renderiza o filme quadro a quadro e monta o vídeo final.
//   node video/energia-que-vira-som/render.mjs [--fps 30] [--scale 1] [--only 3d|end|all] [--from s] [--to s]
// Filmagem real (opcional): video/energia-que-vira-som/footage/real.mp4 (8 s, takes 14–16).
// Sem ela, entra uma claquete provisória no lugar.
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { END_3D, REAL_START, END_CARD_START, TOTAL } from './timeline.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const out = join(here, 'out');
const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const FPS = Number(arg('fps', 30));
const SCALE = Number(arg('scale', 1));
const ONLY = arg('only', 'all');
const W = Math.round(1920 * SCALE);
const H = Math.round(1080 * SCALE);

mkdirSync(out, { recursive: true });
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' });
const enc = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-r', String(FPS)];

const server = await createServer({ root, configFile: false, logLevel: 'error', server: { port: 5199, hmr: false, watch: null } });
await server.listen();
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: SCALE });
page.on('pageerror', (e) => console.error('[page]', e.message));
await page.goto('http://localhost:5199/video/energia-que-vira-som/index.html?render');
await page.waitForFunction(() => window.__film, null, { timeout: 120000 });

async function frames(name, t0, t1) {
  const dir = join(out, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir);
  const n = Math.round((t1 - t0) * FPS);
  const started = Date.now();
  for (let i = 0; i < n; i++) {
    const t = t0 + i / FPS;
    await page.evaluate((tt) => window.__film.renderAt(tt), t);
    await page.screenshot({ path: join(dir, `${String(i).padStart(5, '0')}.png`), clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    if (i % 30 === 0) console.log(`${name} ${t.toFixed(2)}s  (${i}/${n}, ${((Date.now() - started) / 1000).toFixed(0)}s)`);
  }
  ff('-framerate', String(FPS), '-i', join(dir, '%05d.png'), '-s', `${W}x${H}`, ...enc, join(out, `${name}.mp4`));
  return dir;
}

const from = Number(arg('from', 0));
const to = Number(arg('to', END_3D));
if (ONLY !== 'end') {
  const dir = await frames('3d', from, to);
  // Quadro de casamento para a equipe de filmagem (posição exata do som no último quadro 3D).
  if (to === END_3D) execFileSync('cp', [join(dir, `${String(Math.round((to - from) * FPS) - 1).padStart(5, '0')}.png`), join(out, 'match-frame.png')]);
}
if (ONLY !== '3d') await frames('end', END_CARD_START, TOTAL);
await browser.close();
await server.close();

if (ONLY === 'all') {
  const real = join(here, 'footage', 'real.mp4');
  const realLen = END_CARD_START - REAL_START;
  const realOut = join(out, 'real.mp4');
  if (existsSync(real)) {
    ff('-i', real, '-t', String(realLen), '-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`, '-an', ...enc, realOut);
  } else {
    // Claquete provisória: o quadro de casamento com a indicação do trecho real.
    ff('-loop', '1', '-i', join(out, 'match-frame.png'), '-t', String(realLen),
      '-vf', `scale=${W}:${H},eq=brightness=-0.25,drawtext=text='TAKES 14-16 — FILMAGEM REAL (footage/real.mp4)':fontcolor=white:fontsize=${Math.round(40 * SCALE)}:x=(w-text_w)/2:y=h*0.85`,
      ...enc, realOut);
  }
  const list = join(out, 'concat.txt');
  writeFileSync(list, ['3d', 'real', 'end'].map((n) => `file '${join(out, n + '.mp4')}'`).join('\n'));
  ff('-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', join(out, 'jfa-energia-que-vira-som.mp4'));
  console.log('OK →', join(out, 'jfa-energia-que-vira-som.mp4'));
}
