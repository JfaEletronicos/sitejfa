/**
 * Olhos da cena 1 ("VOCÊ NÃO VÊ"), desenhados em SVG (nada de imagem): dois ovais
 * brancos com volume, íris marrom, pupila e brilho. As pupilas olham para os lados
 * em movimentos rápidos (sacadas), os olhos piscam e, no fim, se fecham.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
let uid = 0;

// Geometria no viewBox 0 0 200 170 (cada olho é um oval alto).
const EYES = [
  { cx: 54, cy: 85 },
  { cx: 146, cy: 85 },
];
const RX = 41;
const RY = 70;
// A íris fica na metade de baixo do olho, como na referência.
const IRIS = { dy: 22, r: 23, travel: 15 };
// Ponto em que a pálpebra fecha (um pouco abaixo do centro).
const LID_Y = 32;

const el = (tag, attrs, parent) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (parent) parent.appendChild(node);
  return node;
};

/** Monta o SVG e devolve o nó e a função que aplica olhar e abertura. */
export function createEyes() {
  const id = `sk-eyes-${uid++}`;
  const svg = el('svg', { viewBox: '0 0 200 170', class: 'sk-eyes', 'aria-hidden': 'true' });
  const defs = el('defs', {}, svg);

  // Branco do olho com volume (mais claro no alto, cinza nas bordas).
  const white = el('radialGradient', { id: `${id}-white`, cx: '42%', cy: '34%', r: '72%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#ffffff' }, white);
  el('stop', { offset: '62%', 'stop-color': '#f1f2f4' }, white);
  el('stop', { offset: '100%', 'stop-color': '#b9bcc4' }, white);
  // Íris marrom com borda escura.
  const iris = el('radialGradient', { id: `${id}-iris`, cx: '45%', cy: '42%', r: '60%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#c27a2c' }, iris);
  el('stop', { offset: '58%', 'stop-color': '#8a4a12' }, iris);
  el('stop', { offset: '100%', 'stop-color': '#4a2507' }, iris);

  const parts = EYES.map(({ cx, cy }, i) => {
    const clip = el('clipPath', { id: `${id}-clip-${i}` }, defs);
    el('ellipse', { cx, cy, rx: RX, ry: RY }, clip);
    // O olho inteiro achata na vertical (em torno da linha da pálpebra) ao fechar.
    const lid = el('g', {}, svg);
    el('ellipse', { cx, cy, rx: RX, ry: RY, fill: `url(#${id}-white)` }, lid);
    const inner = el('g', { 'clip-path': `url(#${id}-clip-${i})` }, lid);
    const look = el('g', {}, inner);
    const ix = cx;
    const iy = cy + IRIS.dy;
    el('circle', { cx: ix, cy: iy, r: IRIS.r, fill: `url(#${id}-iris)` }, look);
    el(
      'circle',
      { cx: ix, cy: iy, r: IRIS.r - 1, fill: 'none', stroke: '#3a1c05', 'stroke-width': 2.4 },
      look,
    );
    el('circle', { cx: ix, cy: iy, r: 11.5, fill: '#120a04' }, look);
    el('circle', { cx: ix - 6, cy: iy - 7, r: 4.6, fill: '#ffffff', opacity: 0.92 }, look);
    // Olho fechado: um arco suave no lugar da pálpebra, traço escuro sobre contorno
    // branco (aparece no fundo escuro e por cima das letras brancas).
    const closed = el('g', { opacity: 0 }, svg);
    const arc = `M ${cx - RX + 6} ${cy + LID_Y - 4} Q ${cx} ${cy + LID_Y + 16} ${cx + RX - 6} ${cy + LID_Y - 4}`;
    el(
      'path',
      { d: arc, fill: 'none', stroke: '#ffffff', 'stroke-width': 15, 'stroke-linecap': 'round' },
      closed,
    );
    el(
      'path',
      { d: arc, fill: 'none', stroke: '#3a1c05', 'stroke-width': 7, 'stroke-linecap': 'round' },
      closed,
    );
    return { lid, look, closed, cx, cy };
  });

  /**
   * @param {number} gaze -1 (esquerda) a 1 (direita)
   * @param {number} open 1 = aberto, 0 = fechado
   */
  function update(gaze, open) {
    const o = Math.max(0, Math.min(1, open));
    parts.forEach(({ lid, look, closed, cy }) => {
      look.setAttribute('transform', `translate(${(gaze * IRIS.travel).toFixed(2)} 0)`);
      const pivot = cy + LID_Y;
      // Achata até virar uma linha; perto de fechado, entra o arco.
      const sy = Math.max(o, 0.02);
      lid.setAttribute(
        'transform',
        `translate(0 ${(pivot * (1 - sy)).toFixed(2)}) scale(1 ${sy.toFixed(3)})`,
      );
      lid.setAttribute('opacity', o < 0.08 ? '0' : '1');
      closed.setAttribute('opacity', o < 0.16 ? String(Math.min(1, (0.16 - o) / 0.08)) : '0');
    });
  }

  update(0, 1);
  return { node: svg, update };
}
