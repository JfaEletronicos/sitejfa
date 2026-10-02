/**
 * Navegador para as ferramentas de motion (frames.mjs, glyph-cuts.mjs): abre a página dos
 * filmes no servidor de desenvolvimento (npm run dev) com o Chromium do Playwright.
 *
 * As fontes do Google são baixadas pelo curl (que respeita o proxy e os certificados da
 * máquina) e guardadas em node_modules/.cache/motion-fonts; o Chromium sem interface nem
 * sempre consegue buscá-las sozinho.
 */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;
const CACHE = join(ROOT, 'node_modules/.cache/motion-fonts');

/** Playwright do projeto, global ou do ambiente de nuvem (/opt/node-tools). */
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
  throw new Error('Playwright não encontrado: npm i -D playwright (ou defina PLAYWRIGHT_MODULE_DIR).');
}

function cachedFetch(url, userAgent) {
  mkdirSync(CACHE, { recursive: true });
  const file = join(CACHE, createHash('sha1').update(url).digest('hex'));
  if (!existsSync(file)) {
    writeFileSync(file, execFileSync('curl', ['-sSfL', '-A', userAgent, url], { maxBuffer: 1 << 26 }));
  }
  return readFileSync(file);
}

/**
 * Abre o motion e espera o filme ficar pronto.
 * @returns {{ browser, page, seek(t: number): Promise<void> }}
 */
export async function openFilm({
  variant,
  width = 432,
  height = 768,
  base = 'http://localhost:5173',
  query: extra = '',
}) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width, height } });
  const ua = await page.evaluate(() => navigator.userAgent);
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => {
    const url = route.request().url();
    try {
      const body = cachedFetch(url, ua);
      const css = url.includes('googleapis');
      route.fulfill({ body, contentType: css ? 'text/css' : 'font/woff2' });
    } catch {
      route.abort();
    }
  });
  page.on('pageerror', (e) => console.error('[página]', e.message));
  const query = `capture${variant ? `&variant=${encodeURIComponent(variant)}` : ''}${extra ? `&${extra}` : ''}`;
  try {
    await page.goto(`${base}/parts-filme.html?${query}`);
  } catch {
    await browser.close();
    throw new Error(`Não abriu ${base}: o servidor de desenvolvimento está rodando (npm run dev)?`);
  }
  await page.waitForFunction(() => window.partsFilm && document.querySelector('.pf-loader.is-done'), null, {
    timeout: 180000,
  });
  const seek = async (t) => {
    await page.evaluate((x) => window.partsFilm.seek(x), t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };
  return { browser, page, seek };
}

/** Lê --chave valor / --flag da linha de comando. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next == null || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}
