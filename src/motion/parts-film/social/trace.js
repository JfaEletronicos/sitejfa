/**
 * Trilha de circuito (cena 2, embaixo de "EM TUDO"), desenhada em SVG: linhas finas
 * com uma descida a 45°, um furo (via) aberto e pontos de solda, como as trilhas da
 * própria placa. Aparece por uma máscara que corre da esquerda para a direita, com a
 * borda suave, como se a trilha estivesse sendo gerada na hora; cada ponto surge
 * quando a máscara passa por ele.
 *
 * Unidades do viewBox: 1 = 1 px num quadro de 1080 de largura.
 */
import { EASE } from '../tracks';

const SVG_NS = 'http://www.w3.org/2000/svg';
const W = 1080;
const H = 180;
// Largura da borda suave da máscara.
const FEATHER = 70;
const INK = '#05070A';
const ACCENT = '#1683FF';
let uid = 0;

// Trilhas: caminho + pontos (x, y, raio, aberto?, cor).
const PATHS = [
  // Principal: sai de um furo alinhado ao texto, desce a 45° e segue para trás da placa.
  'M 106 24 H 380 L 440 84 H 902',
  // De baixo: entra pela borda esquerda e termina antes da descida.
  'M -20 114 H 296',
  // Terceira: começa logo depois da descida e também segue para trás da placa.
  'M 479 146 H 640 L 674 180 H 1100',
];
const DOTS = [
  { x: 97, y: 24, r: 9, open: true },
  { x: 911, y: 84, r: 10, color: ACCENT },
  { x: 305, y: 114, r: 10 },
  { x: 470, y: 146, r: 10 },
];

const el = (tag, attrs, parent) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (parent) parent.appendChild(node);
  return node;
};

/** Monta o SVG e devolve o nó e a função que aplica o quanto já foi revelado (0 a 1). */
export function createTrace() {
  const id = `sk-trace-${uid++}`;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'sk-trace', 'aria-hidden': 'true' });
  const defs = el('defs', {}, svg);
  const fade = el('linearGradient', { id: `${id}-fade` }, defs);
  el('stop', { offset: '0%', 'stop-color': '#fff' }, fade);
  el('stop', { offset: '100%', 'stop-color': '#000' }, fade);
  const mask = el(
    'mask',
    { id: `${id}-mask`, maskUnits: 'userSpaceOnUse', x: -40, y: -40, width: W + 80, height: H + 80 },
    defs,
  );
  const solid = el('rect', { x: -40, y: -40, width: 0, height: H + 80, fill: '#fff' }, mask);
  const edge = el('rect', { x: -40, y: -40, width: FEATHER, height: H + 80, fill: `url(#${id}-fade)` }, mask);

  const g = el('g', { mask: `url(#${id}-mask)` }, svg);
  PATHS.forEach((d) =>
    el(
      'path',
      {
        d,
        fill: 'none',
        stroke: INK,
        'stroke-opacity': 0.6,
        'stroke-width': 4.5,
        'stroke-linejoin': 'round',
      },
      g,
    ),
  );
  const dots = DOTS.map((dot) => ({
    ...dot,
    node: el(
      'circle',
      dot.open
        ? { cx: dot.x, cy: dot.y, r: 0, fill: '#fff', stroke: INK, 'stroke-width': 4.5 }
        : { cx: dot.x, cy: dot.y, r: 0, fill: dot.color || INK },
      g,
    ),
  }));

  /** @param {number} p 0 = nada, 1 = trilha inteira */
  function update(p) {
    // A borda (fim da área visível) vai de antes do quadro até depois dele.
    const x = -40 + Math.max(0, Math.min(1, p)) * (W + 80 + FEATHER);
    solid.setAttribute('width', Math.max(0, x - FEATHER + 40).toFixed(1));
    edge.setAttribute('x', (x - FEATHER).toFixed(1));
    dots.forEach(({ node, x: cx, r }) => {
      const k = Math.max(0, Math.min(1, (x - FEATHER * 0.6 - cx) / 90));
      node.setAttribute('r', (r * EASE.enter(k)).toFixed(2));
    });
  }

  update(0);
  return { node: svg, update };
}
