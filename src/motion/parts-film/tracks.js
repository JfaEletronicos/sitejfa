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
 * Com `monotone`, nenhum campo passa do ponto entre duas marcações (tangentes limitadas,
 * Fritsch–Carlson): a câmera nunca anda para trás para corrigir.
 *
 * @param {Array<{t: number, rest?: boolean} & Record<string, number | number[]>>} keys
 * @param {string[]} fields Campos interpolados (números ou vetores).
 * @param {{ monotone?: boolean }} [opts]
 */
export function spline(keys, fields, { monotone = false } = {}) {
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
        else if (monotone) {
          // Extremo local: para ali; senão, média limitada a 3× a menor inclinação.
          if (prev * next <= 0) m.push(0);
          else {
            const dp = keys[i].t - keys[i - 1].t;
            const dn = keys[i + 1].t - keys[i].t;
            const avg = (prev * dn + next * dp) / (dp + dn);
            const lim = 3 * Math.min(Math.abs(prev), Math.abs(next));
            m.push(Math.sign(avg) * Math.min(Math.abs(avg), lim));
          }
        } else {
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

/**
 * Caminho no espaço (Catmull-Rom centrípeta: sem laços nem bicos entre os pontos), medido
 * em comprimento de arco. Separa a FORMA do voo do RITMO: `at(s)` devolve o ponto a uma
 * distância s do início; `knots` são as distâncias de cada ponto de passagem.
 *
 * @param {number[][]} points Pontos de passagem [x, y, z].
 */
export function arcPath(points, samplesPerSegment = 48) {
  const n = points.length;
  const P = (i) => points[Math.min(Math.max(i, 0), n - 1)];
  const sub = (a, b) => a.map((v, k) => v - b[k]);
  const dist = (a, b) => Math.max(Math.hypot(...sub(a, b)), 1e-6);
  // Ponto num segmento (Barry–Goldman, parametrização centrípeta).
  const segPoint = (i, u) => {
    const p0 = i === 0 ? P(0).map((v, k) => 2 * v - P(1)[k]) : P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = i + 2 > n - 1 ? P(n - 1).map((v, k) => 2 * v - P(n - 2)[k]) : P(i + 2);
    const t0 = 0;
    const t1 = t0 + Math.sqrt(dist(p0, p1));
    const t2 = t1 + Math.sqrt(dist(p1, p2));
    const t3 = t2 + Math.sqrt(dist(p2, p3));
    const t = t1 + (t2 - t1) * u;
    const lerp = (a, b, ta, tb) => a.map((v, k) => ((tb - t) * v + (t - ta) * b[k]) / (tb - ta));
    const a1 = lerp(p0, p1, t0, t1);
    const a2 = lerp(p1, p2, t1, t2);
    const a3 = lerp(p2, p3, t2, t3);
    const b1 = lerp(a1, a2, t0, t2);
    const b2 = lerp(a2, a3, t1, t3);
    return lerp(b1, b2, t1, t2);
  };
  // Tabela de comprimento de arco.
  const table = [{ s: 0, p: P(0) }];
  const knots = [0];
  let s = 0;
  for (let i = 0; i < n - 1; i++) {
    let prev = P(i);
    for (let k = 1; k <= samplesPerSegment; k++) {
      const p = k === samplesPerSegment ? P(i + 1) : segPoint(i, k / samplesPerSegment);
      s += Math.hypot(...sub(p, prev));
      table.push({ s, p });
      prev = p;
    }
    knots.push(s);
  }
  const at = (x) => {
    const target = Math.min(Math.max(x, 0), s);
    let lo = 0;
    let hi = table.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (table[mid].s < target) lo = mid;
      else hi = mid;
    }
    const a = table[lo];
    const b = table[hi];
    const k = b.s > a.s ? (target - a.s) / (b.s - a.s) : 0;
    return a.p.map((v, j) => v + (b.p[j] - v) * k);
  };
  return { at, knots, length: s };
}

// Suavização gaussiana de uma série amostrada (bordas estendidas com `left`/`right`).
function gaussian(values, dt, sigma, left = values[0], right = values[values.length - 1]) {
  if (!(sigma > 0)) return values.slice();
  const r = Math.ceil((3 * sigma) / dt);
  const w = [];
  let sum = 0;
  for (let j = -r; j <= r; j++) {
    const x = Math.exp(-0.5 * ((j * dt) / sigma) ** 2);
    w.push(x);
    sum += x;
  }
  const n = values.length;
  return values.map((_, i) => {
    let acc = 0;
    for (let j = -r; j <= r; j++) {
      const k = i + j;
      acc += w[j + r] * (k < 0 ? left : k >= n ? right : values[k]);
    }
    return acc / sum;
  });
}

/**
 * Ritmo do voo: a distância percorrida ao longo do caminho em função do tempo. Em cada trecho
 * a velocidade é a distância ÷ o tempo entre as marcações (indo a zero numa marcação `stop`
 * ou `rest`), suavizada no tempo por uma gaussiana de `sigma` segundos: acelera e freia aos
 * poucos, nunca volta e nunca passa do ponto. Devolve s(t).
 *
 * @param {{ t: number, stop?: boolean, rest?: boolean }[]} keys
 * @param {number[]} knots Distância de cada marcação ao início do caminho.
 */
export function flightPace(keys, knots, sigma = 0.3, dt = 1 / 240) {
  const n = keys.length;
  const t0 = keys[0].t;
  const t1 = keys[n - 1].t;
  const halt = keys.map((k) => !!(k.stop || k.rest));
  const rawV = (t) => {
    let i = 0;
    while (i < n - 2 && keys[i + 1].t <= t) i++;
    const h = keys[i + 1].t - keys[i].t;
    const avg = (knots[i + 1] - knots[i]) / h;
    const u = Math.min(Math.max((t - keys[i].t) / h, 0), 1);
    const a = halt[i];
    const b = halt[i + 1];
    if (a && b) return 6 * avg * u * (1 - u);
    if (b) return 2 * avg * (1 - u);
    if (a) return 2 * avg * u;
    return avg;
  };
  const count = Math.ceil((t1 - t0) / dt) + 1;
  const v = Array.from({ length: count }, (_, i) => rawV(t0 + i * dt));
  const sv = gaussian(v, dt, sigma, halt[0] ? 0 : v[0], halt[n - 1] ? 0 : v[count - 1]);
  const s = [0];
  for (let i = 1; i < count; i++) s.push(s[i - 1] + ((sv[i - 1] + sv[i]) / 2) * dt);
  const k = knots[n - 1] / (s[count - 1] || 1);
  return (t) => {
    const x = Math.min(Math.max((t - t0) / dt, 0), count - 1);
    const i = Math.min(Math.floor(x), count - 2);
    return (s[i] + (s[i + 1] - s[i]) * (x - i)) * k;
  };
}

/**
 * Suaviza no tempo (gaussiana de `sigma` s) uma trilha `fn(t)` que devolve campos numéricos
 * ou vetores: tira os cantos das mudanças de alvo, lente e enquadramento sem ultrapassar.
 */
export function smoothTrack(fn, t0, t1, sigma, dt = 1 / 240) {
  const count = Math.ceil((t1 - t0) / dt) + 1;
  const raw = Array.from({ length: count }, (_, i) => fn(t0 + i * dt));
  const fields = Object.keys(raw[0]);
  const tracks = {};
  fields.forEach((f) => {
    const size = Array.isArray(raw[0][f]) ? raw[0][f].length : 0;
    const comps = Math.max(size, 1);
    tracks[f] = [];
    for (let c = 0; c < comps; c++)
      tracks[f].push(
        gaussian(
          raw.map((r) => (size ? r[f][c] : r[f])),
          dt,
          sigma,
        ),
      );
  });
  return (t) => {
    const x = Math.min(Math.max((t - t0) / dt, 0), count - 1);
    const i = Math.min(Math.floor(x), count - 2);
    const u = x - i;
    const out = {};
    fields.forEach((f) => {
      const vals = tracks[f].map((tr) => tr[i] + (tr[i + 1] - tr[i]) * u);
      out[f] = Array.isArray(raw[0][f]) ? vals : vals[0];
    });
    return out;
  };
}
