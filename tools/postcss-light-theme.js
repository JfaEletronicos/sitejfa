/**
 * Gera o modo claro do site a partir do CSS escuro existente.
 *
 * Para cada regra com cor, adiciona uma cópia com o prefixo
 * `html[data-theme="light"]` e as cores convertidas: fundos escuros viram
 * claros, textos claros viram azul-marinho e os tons médios (azul JFA,
 * verde do WhatsApp) continuam iguais. Sombras só ficam mais suaves.
 * Áreas marcadas com `data-theme-keep` (vídeo da Hero e seções que já são
 * claras no modo escuro) ficam com as cores originais. Ajustes finos ficam em src/styles/theme-light.css.
 */

const LIGHT = 'html[data-theme="light"]';
const KEEP_ZONE = ':not([data-theme-keep], [data-theme-keep] *)';
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/g;
const SHADOW_PROPS = new Set(['box-shadow', 'text-shadow', 'filter']);
const COLOR_PROPS =
  /^(color|background(-color|-image)?|border(-(top|right|bottom|left))?(-color)?|outline(-color)?|fill|stroke|caret-color|-webkit-text-fill-color|text-decoration-color|--[\w-]+)$/;

const parse = (tok) => {
  if (tok === 'white') return [255, 255, 255, 1];
  if (tok === 'black') return [0, 0, 0, 1];
  if (tok[0] === '#') {
    let h = tok.slice(1);
    if (h.length === 3 || h.length === 4) h = h.replace(/./g, (c) => c + c);
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const parts = tok
    .replace(/rgba?\(|\)/g, '')
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
};

const toHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
};

const fromHsl = ([h, s, l]) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
};

const fmt = ([r, g, b], a) => (a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`);

// Inverte a luminosidade mantendo o tom: branco -> azul-marinho, navy -> azul-gelo.
const invert = (c) => {
  let [h, s, l] = toHsl(c);
  l = 1 - l;
  if (l < 0.25) {
    if (s < 0.2) h = 220;
    s = Math.max(s, 0.55);
    l = 0.1 + l * 0.6;
  } else if (l > 0.8) {
    s = Math.min(s, 0.4);
  }
  return fmt(fromHsl([h, s, l]), c[3]);
};

// Sombras escuras ficam mais leves no fundo claro; brilhos coloridos continuam.
const soften = (c) => {
  const [, , l] = toHsl(c);
  return l < 0.3 ? fmt(c.slice(0, 3), c[3] * 0.45) : fmt(c.slice(0, 3), c[3]);
};

const convert = (value, fn) =>
  value.replace(COLOR_RE, (tok) => {
    const c = parse(tok);
    return c ? fn(c) : tok;
  });

const scopeSelector = (sel) => {
  sel = sel.trim();
  let pseudo = '';
  const i = sel.indexOf('::');
  if (i !== -1) {
    pseudo = sel.slice(i);
    sel = sel.slice(0, i);
  }
  if (/^(html|:root)\b/.test(sel)) return sel.replace(/^(html|:root)/, LIGHT) + pseudo;
  const target = sel.endsWith(' ') || sel === '' ? sel + '*' : sel;
  return `${LIGHT} ${target}${KEEP_ZONE}${pseudo}`;
};

const plugin = () => ({
  postcssPlugin: 'jfa-light-theme',
  OnceExit(root) {
    const out = [];
    root.walkRules((rule) => {
      if (rule.selector.includes('data-theme')) return;
      let p = rule.parent;
      while (p && p.type !== 'root') {
        if (p.type === 'atrule' && /keyframes|font-face/.test(p.name)) return;
        p = p.parent;
      }
      const decls = [];
      rule.each((d) => {
        if (d.type !== 'decl') return;
        COLOR_RE.lastIndex = 0;
        if (!COLOR_RE.test(d.value)) return;
        const prop = d.prop.toLowerCase();
        if (SHADOW_PROPS.has(prop)) decls.push(d.clone({ value: convert(d.value, soften) }));
        else if (COLOR_PROPS.test(prop)) decls.push(d.clone({ value: convert(d.value, invert) }));
      });
      if (!decls.length) return;
      const copy = rule.clone({ selectors: rule.selectors.map(scopeSelector) });
      copy.removeAll();
      decls.forEach((d) => copy.append(d));
      out.push({ rule, copy });
    });
    // Insere logo depois da regra original, mantendo a ordem da cascata.
    out.reverse().forEach(({ rule, copy }) => rule.after(copy));
  },
});
plugin.postcss = true;

export default plugin;
