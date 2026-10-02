#!/usr/bin/env node
/**
 * Onde cortar uma letra (ou um texto) para esticar "à moda da Stretch Pro" (stretchLetter /
 * stretchY no roteiro). Desenha o texto com a fonte real do filme e procura as faixas em
 * que o desenho não muda de uma coluna (ou linha) para a próxima: esticar ali só alonga o
 * que já existe. Precisa do npm run dev rodando.
 *
 *   node tools/motion/glyph-cuts.mjs --font Anton --text E --axis x
 *   node tools/motion/glyph-cuts.mjs --font "Stretch Pro" --text TUUDO --axis y --liga
 *
 * eixo x: frações da largura da letra (use uma letra só); eixo y: frações da altura das
 * maiúsculas, do topo (0) à base (1). Prefira a faixa estável com MENOR cobertura: com
 * cobertura alta a faixa é uma haste (x) ou uma barra (y), e esticar vira um bloco.
 */
import { openFilm, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const font = args.font || 'Anton';
const text = String(args.text || 'E');
const axis = args.axis === 'y' ? 'y' : 'x';

const { browser, page } = await openFilm({ variant: 'modelo', width: 400, height: 400, base: args.base });
const result = await page.evaluate(
  async ({ font, text, axis, liga }) => {
    const family = /\s/.test(font) ? `"${font}"` : font;
    const S = 400;
    await document.fonts.load(`${S}px ${family}`, text);
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    g.font = `${S}px ${family}`;
    if ('fontVariantLigatures' in g) g.fontVariantLigatures = liga ? 'common-ligatures' : 'none';
    const cap = g.measureText('H').actualBoundingBoxAscent;
    const width = g.measureText(text).width;
    c.width = Math.ceil(width) + 40;
    c.height = S * 2;
    g.font = `${S}px ${family}`;
    const base = S * 1.4;
    g.fillText(text, 20, base);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const on = (x, y) => d[(y * c.width + x) * 4 + 3] > 127;
    const top = Math.round(base - cap);
    // Uma amostra por 1% (coluna da letra ou linha das maiúsculas).
    const samples = [];
    for (let i = 0; i <= 100; i++) {
      const bits = [];
      if (axis === 'x') {
        const x = Math.round(20 + (i / 100) * width);
        for (let y = top - 2; y <= base + 2; y++) bits.push(on(x, y));
      } else {
        const y = Math.round(top + (i / 100) * cap);
        for (let x = 0; x < c.width; x++) bits.push(on(x, y));
      }
      samples.push(bits);
    }
    const diff = (a, b) => a.reduce((n, v, k) => n + (v !== b[k] ? 1 : 0), 0);
    const len = samples[0].length;
    // Faixas estáveis: amostras seguidas que mudam menos de 1% entre si.
    const regions = [];
    let start = 0;
    for (let i = 1; i <= 101; i++) {
      const breaks = i === 101 || diff(samples[i], samples[i - 1]) > len * 0.01;
      if (breaks) {
        if (i - 1 - start >= 3) {
          const mid = Math.round((start + i - 1) / 2);
          const ink = samples[mid].filter(Boolean).length;
          if (ink > 0) regions.push({ from: start / 100, to: (i - 1) / 100, cover: ink / len });
        }
        start = i;
      }
    }
    return { cap, width, regions };
  },
  { font, text, axis, liga: !!args.liga },
);
await browser.close();

const pct = (v) => `${Math.round(v * 100)}%`;
console.log(
  `${text} · ${font} · eixo ${axis} (${axis === 'x' ? 'largura da letra' : 'altura das maiúsculas'})`,
);
if (!result.regions.length)
  console.log('  nenhuma faixa estável: o desenho muda o tempo todo (diagonais/curvas)');
const usable = result.regions.filter((r) => r.to - r.from >= 0.06 && r.cover < 0.85);
const best = usable.sort((a, b) => a.cover - b.cover)[0];
result.regions.forEach((r) => {
  const mark = r === best ? '  ← sugerido' : r.cover >= 0.85 ? '  (haste/barra cheia: não estique aqui)' : '';
  console.log(`  ${r.from.toFixed(2)}–${r.to.toFixed(2)}  cobertura ${pct(r.cover)}${mark}`);
});
if (best) console.log(`at: ${((best.from + best.to) / 2).toFixed(2)}`);
