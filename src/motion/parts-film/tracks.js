/**
 * Curvas e interpolação do filme. Tudo é função pura do tempo, então qualquer
 * quadro pode ser renderizado de novo de forma idêntica (seek, pausa, captura).
 */

/**
 * Curva cubic-bezier igual à do CSS (x1, y1, x2, y2).
 * @returns {(t: number) => number}
 */
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (s) => ((ax * s + bx) * s + cx) * s;
  const sampleY = (s) => ((ay * s + by) * s + cy) * s;
  const slopeX = (s) => (3 * ax * s + 2 * bx) * s + cx;

  const solve = (x) => {
    let s = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(s) - x;
      if (Math.abs(err) < 1e-6) return s;
      const d = slopeX(s);
      if (Math.abs(d) < 1e-6) break;
      s -= err / d;
    }
    // Newton não convergiu: bissecção.
    let lo = 0;
    let hi = 1;
    s = x;
    for (let i = 0; i < 32; i++) {
      const v = sampleX(s);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return s;
  };

  return (t) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solve(t)));
}

/** Curvas nomeadas. Nada é linear: tudo acelera e desacelera como um corpo com massa. */
export const EASE = {
  linear: (t) => t,
  // Entrada e saída longas e simétricas (movimentos de luz, câmera em trechos isolados).
  glide: cubicBezier(0.65, 0, 0.35, 1),
  // Saída suave, sem pressa (padrão para valores que mudam entre marcações).
  soft: cubicBezier(0.4, 0, 0.2, 1),
  // Desacelera até parar: chegada de câmera/produto.
  settle: cubicBezier(0.22, 1, 0.36, 1),
  // Entrada de texto: começa já em movimento e pousa devagar.
  enter: cubicBezier(0.16, 1, 0.3, 1),
  // Saída de texto: some acelerando levemente.
  exit: cubicBezier(0.55, 0, 0.75, 0.4),
  // Ganho lento (luz/fundo crescendo).
  swell: cubicBezier(0.45, 0, 0.25, 1),
};

const easeOf = (e) => (typeof e === 'function' ? e : EASE[e] || EASE.soft);
const lerp = (a, b, k) => a + (b - a) * k;

/**
 * Trilha escalar por marcações: [[tempo, valor, curva?], ...].
 * A curva de cada marcação vale para o trecho que CHEGA nela.
 * Antes da primeira marcação vale o primeiro valor; depois da última, o último.
 */
export function keyed(keys) {
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    const last = keys[keys.length - 1];
    if (t >= last[0]) return last[1];
    let i = 1;
    while (keys[i][0] < t) i++;
    const [t0, v0] = keys[i - 1];
    const [t1, v1, ease] = keys[i];
    return lerp(v0, v1, easeOf(ease)((t - t0) / (t1 - t0)));
  };
}

/**
 * Spline de Hermite com nós no tempo (Catmull-Rom não uniforme): passa por todas
 * as marcações com velocidade contínua, então a câmera nunca "freia" numa marcação.
 * Marcações com `rest: true` têm velocidade zero (partida/chegada em repouso).
 *
 * @param {Array<{t: number, rest?: boolean} & Record<string, number | number[]>>} keys
 * @param {string[]} fields Campos interpolados (números ou vetores).
 */
export function spline(keys, fields) {
  const n = keys.length;
  // Tangente de cada campo em cada marcação (média ponderada das inclinações vizinhas).
  const tangents = keys.map((k, i) => {
    const out = {};
    fields.forEach((f) => {
      const v = k[f];
      const size = Array.isArray(v) ? v.length : 1;
      const at = (j, c) => (Array.isArray(keys[j][f]) ? keys[j][f][c] : keys[j][f]);
      const m = [];
      for (let c = 0; c < size; c++) {
        if (k.rest) {
          m.push(0);
          continue;
        }
        const prev = i > 0 ? (at(i, c) - at(i - 1, c)) / (keys[i].t - keys[i - 1].t) : null;
        const next = i < n - 1 ? (at(i + 1, c) - at(i, c)) / (keys[i + 1].t - keys[i].t) : null;
        if (prev === null) m.push(next);
        else if (next === null) m.push(prev);
        else {
          const dp = keys[i].t - keys[i - 1].t;
          const dn = keys[i + 1].t - keys[i].t;
          m.push((prev * dn + next * dp) / (dp + dn));
        }
      }
      out[f] = m;
    });
    return out;
  });

  return (t) => {
    let i = 0;
    if (t <= keys[0].t) i = 0;
    else if (t >= keys[n - 1].t) i = n - 2;
    else while (keys[i + 1].t < t) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const h = b.t - a.t;
    const s = Math.min(Math.max((t - a.t) / h, 0), 1);
    const s2 = s * s;
    const s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1;
    const h10 = s3 - 2 * s2 + s;
    const h01 = -2 * s3 + 3 * s2;
    const h11 = s3 - s2;
    const out = {};
    fields.forEach((f) => {
      const va = a[f];
      const vb = b[f];
      const ma = tangents[i][f];
      const mb = tangents[i + 1][f];
      const one = (x0, x1, m0, m1) => h00 * x0 + h10 * h * m0 + h01 * x1 + h11 * h * m1;
      out[f] = Array.isArray(va)
        ? va.map((x0, c) => one(x0, vb[c], ma[c], mb[c]))
        : one(va, vb, ma[0], mb[0]);
    });
    return out;
  };
}

/**
 * Opacidade/deslocamento de uma entrada de texto (fade + pequeno deslocamento vertical).
 * @returns {{ opacity: number, rise: number, scale: number }} rise em frações (1 = deslocamento cheio).
 */
export function cueState(t, cue) {
  const fadeIn = cue.fadeIn ?? 1.1;
  const fadeOut = cue.fadeOut ?? 0.9;
  if (t < cue.in) return { opacity: 0, rise: 1, scale: 0 };
  const kin = EASE.enter(Math.min((t - cue.in) / fadeIn, 1));
  let opacity = EASE.soft(Math.min((t - cue.in) / fadeIn, 1));
  let rise = 1 - kin;
  if (cue.out != null && t > cue.out) {
    const kout = Math.min((t - cue.out) / fadeOut, 1);
    opacity *= 1 - EASE.soft(kout);
    rise -= EASE.exit(kout) * 0.45;
  }
  return { opacity, rise, scale: 1 - kin };
}
