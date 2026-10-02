/**
 * Estiramento "à moda da Stretch Pro": em vez de escalar a letra inteira (que engorda
 * as hastes e deforma as curvas), só fatias finas dela se estendem; as pontas e a
 * espessura dos traços ficam como desenhadas. É o que a fonte faz nas letras esticadas
 * (UU, SS...), só que contínuo e animável.
 *
 * O texto aparece recortado em pedaços: os trechos entre os cortes, cada um deslocado
 * pelo tanto que esticou antes dele, e em cada corte uma "janela" que preenche o vão
 * com a fatia do corte ampliada. A janela recorta DEPOIS da ampliação (o navegador
 * arredonda recortes para o pixel; antes da ampliação o erro cresceria junto e abriria
 * frestas). Tudo se sobrepõe um pouco, então não aparece emenda.
 *
 *   eixo x: a letra fica mais larga (corte numa coluna onde só há traços horizontais)
 *   eixo y: o texto fica mais alto (corte numa linha onde só há hastes verticais);
 *           com dois cortes, as barras do meio (E, S) ficam no meio da altura nova
 */

const SLICE = 2; // largura da fatia de origem (px, antes da escala da palavra)
const OVERLAP = 1; // sobreposição entre a janela e os trechos vizinhos (px)

const span = (cls, parent, text) => {
  const node = document.createElement('span');
  node.className = cls;
  if (text != null) node.textContent = text;
  parent.appendChild(node);
  return node;
};

/**
 * @param {HTMLElement} parent onde o texto entra
 * @param {string} text
 * @param {'x'|'y'} axis
 * @param {number|number[]} at posição de cada corte: fração da largura da letra (x) ou
 *   da altura das maiúsculas a partir do topo (y)
 */
export function createSlices(parent, text, axis, at = 0.5) {
  const ats = [].concat(at).sort((p, q) => p - q);
  const box = span(`sk-slices is-${axis}`, parent);
  // Trechos (o primeiro fica no fluxo e dá a medida) e, por cima, as janelas.
  const segs = [span('sk-slice', box, text), ...ats.map(() => span('sk-slice is-abs', box, text))];
  const wins = ats.map(() => {
    const win = span('sk-slice-win', box);
    return { win, ink: span('sk-slice is-abs', win, text) };
  });
  const [first] = segs;
  let cuts = [];
  let size = 0;
  let last = -1;
  const metrics = { capTop: 0, capH: 0 };
  const px = (v) => `${v.toFixed(2)}px`;
  // inset(antes, depois) no eixo do corte (null = aberto); o outro eixo fica aberto.
  const inset = (from, toInset) => {
    const s = from == null ? '-1em' : px(from);
    const e = toInset == null ? '-1em' : px(toInset);
    return axis === 'x' ? `inset(-1em ${e} -1em ${s})` : `inset(${s} -1em ${e} -1em)`;
  };
  const move = (d) => (axis === 'x' ? `translate3d(${px(d)}, 0, 0)` : `translate3d(0, ${px(d)}, 0)`);

  /** Mede no tamanho atual (antes da escala da palavra) e prepara os recortes. */
  function measure() {
    last = -1;
    cuts = [];
    set(0);
    const w = first.offsetWidth;
    const h = first.offsetHeight;
    const cs = getComputedStyle(first);
    // Linha de base: um marcador vazio em linha pousa a borda de baixo nela.
    const probe = span('sk-probe', first);
    const baseline = probe.offsetTop;
    first.removeChild(probe);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    metrics.capH = ctx.measureText('H').actualBoundingBoxAscent || parseFloat(cs.fontSize) * 0.7;
    metrics.capTop = baseline - metrics.capH;
    const ls = parseFloat(cs.letterSpacing) || 0;
    size = axis === 'x' ? w : h;
    cuts = axis === 'x' ? ats.map((p) => (w - ls) * p) : ats.map((p) => metrics.capTop + metrics.capH * p);
    segs.forEach((seg, k) => {
      seg.style.clipPath = inset(k ? cuts[k - 1] : null, k < cuts.length ? size - cuts[k] : null);
    });
    wins.forEach(({ ink }, k) => {
      ink.style.transformOrigin = axis === 'x' ? `${px(cuts[k])} 50%` : `50% ${px(cuts[k])}`;
    });
    last = -1;
    set(0);
    return metrics;
  }

  /** Estica `extra` px no total (no espaço da palavra, antes da escala dela). */
  function set(extra) {
    const e = cuts.length ? Math.max(0, extra) : 0;
    if (Math.abs(e - last) < 0.01) return;
    last = e;
    const per = e / Math.max(cuts.length, 1);
    const on = e > 0.05;
    // No eixo x a largura cresce de verdade: as letras seguintes andam junto.
    if (axis === 'x') box.style.paddingRight = px(e);
    segs.forEach((seg, k) => {
      if (k) seg.style.transform = move(k * per);
    });
    // Cada janela cobre o vão do seu corte (mais a sobreposição) e mostra ali a fatia
    // do corte, ampliada só na direção do estiramento.
    const f = ((per + 2 * OVERLAP) / SLICE).toFixed(4);
    wins.forEach(({ win, ink }, k) => {
      win.style.visibility = on ? 'visible' : 'hidden';
      if (!on) return;
      const from = cuts[k] + k * per - OVERLAP;
      const to = cuts[k] + (k + 1) * per + OVERLAP;
      // A janela tem o tamanho da caixa (que no eixo x já cresceu `e`).
      win.style.clipPath = inset(from, (axis === 'x' ? size + e : size) - to);
      ink.style.transform = `${move(k * per + per / 2)} ${axis === 'x' ? `scale(${f}, 1)` : `scale(1, ${f})`}`;
    });
  }

  return { box, measure, set, metrics };
}
