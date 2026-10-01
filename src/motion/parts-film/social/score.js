/**
 * ROTEIRO DA VARIANTE "social-kinetic" (9:16, base de 20 s).
 *
 * Tudo em segundos sobre a base de 20 s (SOCIAL_MOTION_CONFIG.duration estica ou comprime).
 * Posições em % do quadro (x da esquerda, y de cima; valores fora de 0–100 cortam a
 * palavra pela borda de propósito). Tamanhos de letra em TYPOGRAPHY.
 *
 * Ritmo: RÁPIDO · RÁPIDO · RÁPIDO · PAUSA · EXPLOSÃO · RÁPIDO · PAUSA · HERO
 *
 * Pontos do modelo real (cena em unidades de 10 cm, placa deitada, componentes para cima):
 *   encoder com eixo em (-0,01; 0 a 0,27; -0,11) · CI principal em (0,49; 0,02; -0,15)
 *   botões táteis em z≈0,05, x = 0,61 / 0,89 / 1,16 / 1,42 · placa: x ±1,55, z ±0,39
 */

/** Cenas (régua do modo debug). */
export const SCENES = [
  { id: 'hook', label: 'Você não vê', start: 0, end: 1.95 },
  { id: 'em-tudo', label: 'Mas ela está em tudo', start: 1.95, end: 4.42 },
  { id: 'palavras', label: 'Controle · Energia', start: 4.42, end: 6.45 },
  { id: 'pausa-1', label: 'Pausa', start: 6.45, end: 7.12 },
  { id: 'explosao', label: 'Precisão · Conexão · Tecnologia', start: 7.12, end: 10.78 },
  { id: 'caos', label: 'Caos', start: 10.78, end: 12.75 },
  { id: 'pausa-2', label: 'Tudo começa por dentro', start: 12.75, end: 15.3 },
  { id: 'final', label: 'JFA Parts', start: 15.3, end: 20 },
];

// ---------------------------------------------------------------------------
// PLANOS 3D
// pose: alvo, azimute/elevação (graus), distância, `lens` (× CAMERA.fov), `roll` (giro do quadro, graus)
// board: rotação [yaw, pitch, roll] (graus) e posição; shift: posição da placa no quadro
// (fração; +x direita, +y cima); pan: movimento de câmera que também desloca as camadas
// de texto (com paralaxe); light: preset de luz (kinetic.js).
// ---------------------------------------------------------------------------
const pose = (target, az, el, dist, extra = {}) => ({ target, az, el, dist, lens: 1, roll: 0, ...extra });
const ENCODER = [-0.012, 0.13, -0.11];
const CHIP = [0.485, 0.012, -0.151];
const CENTER = [0, 0, 0];

export const SHOTS = [
  // CENA 1 · VOCÊ NÃO VÊ.: a placa é o centro do quadro desde o primeiro quadro.
  // Um plano contínuo em duas fases (sem corte): ela sobe para o lugar e assenta...
  {
    t: [0, 1.0],
    cam: [pose([0, 0, 0], -24, 43, 3.75, { roll: 35 }), pose([0, 0, 0], -18, 46, 3.4, { roll: 39 })],
    ease: 'expoOut',
    board: [{ rot: [8, 0, 0] }, { rot: [3, 0, 0] }],
    shift: [
      [0, -0.27],
      [0, -0.17],
    ],
    light: 'feature',
    sweep: [55, 15],
  },
  // ...e depois avança devagar em direção à câmera, encostando no "VÊ.".
  {
    t: [1.0, 1.95],
    cam: [pose([0, 0, 0], -18, 46, 3.4, { roll: 39 }), pose([0, 0, 0], -13, 48, 3.0, { roll: 41 })],
    ease: 'glide',
    board: [{ rot: [3, 0, 0] }, { rot: [0, 0, 0] }],
    shift: [
      [0, -0.17],
      [0, -0.14],
    ],
    light: 'feature',
    sweep: [15, -40],
  },
  // MAS: só tipografia (placa fora).
  { t: [1.95, 2.36], hidden: true },
  // ELA: placa inteira atravessando o quadro azul na diagonal.
  {
    t: [2.36, 2.86],
    cam: [pose([0.25, 0, 0], 0, 68, 5.2, { roll: -28 }), pose([0.1, 0, 0], 4, 70, 4.6, { roll: -24 })],
    ease: 'expoOut',
    board: [{ rot: [-8, 0, 0] }, { rot: [-2, 0, 0] }],
    shift: [
      [0.02, -0.16],
      [-0.02, -0.18],
    ],
    light: 'onColor',
    sweep: [40, -30],
  },
  // ESTÁ: macro nos terminais do CI, atrás da palavra.
  {
    t: [2.86, 3.36],
    cam: [pose(CHIP, 24, 26, 0.46, { lens: 0.9 }), pose(CHIP, 32, 24, 0.38, { lens: 0.9 })],
    ease: 'linear',
    shift: [
      [0, -0.05],
      [0, -0.05],
    ],
    light: 'macro',
    aperture: 0.5,
    sweep: [30, -20],
  },
  // EM TUDO.: placa inteira em pé no centro, girando rápido (sem volta completa).
  {
    t: [3.36, 4.42],
    cam: [pose(CENTER, 0, 72, 9.5, { roll: 90 }), pose(CENTER, 0, 66, 6.6, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [-26, 0, 0] }, { rot: [12, 0, 0] }],
    shift: [
      [0, 0],
      [0, 0],
    ],
    light: 'punch',
    sweep: [50, -50],
  },
  // CONTROLE.: macro em órbita do encoder (o eixo atravessa a palavra).
  {
    t: [4.42, 5.45],
    cam: [pose(ENCODER, 18, 16, 1.0), pose(ENCODER, 68, 22, 0.82)],
    ease: 'soft',
    shift: [
      [0.1, -0.1],
      [0.06, -0.1],
    ],
    pan: [
      [0.02, 0],
      [-0.02, 0],
    ],
    light: 'macro',
    aperture: 0.32,
    sweep: [40, -40],
  },
  // ENERGIA.: placa em pé à direita, cortada em cima e embaixo.
  {
    t: [5.45, 6.45],
    cam: [pose([0.1, 0, 0], 0, 80, 3.5, { roll: 90 }), pose([-0.15, 0, 0], 0, 80, 3.2, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [10, 0, 0] }, { rot: [4, 0, 0] }],
    shift: [
      [0.3, 0.04],
      [0.2, 0.08],
    ],
    light: 'onColor',
    sweep: [45, -35],
  },
  // PAUSA: macro quase parado na fileira de botões.
  {
    t: [6.45, 7.12],
    cam: [
      pose([1.0, 0.03, 0.05], 80, 9, 0.33, { lens: 0.9 }),
      pose([0.99, 0.03, 0.05], 80, 9.3, 0.325, { lens: 0.9 }),
    ],
    ease: 'linear',
    light: 'macro',
    aperture: 0.75,
    sweep: [10, -12],
  },
  // PRECISÃO.: placa enorme; a borda dela corta a palavra.
  {
    t: [7.12, 8.3],
    cam: [pose([0.42, 0, 0.06], -8, 60, 2.05), pose([0.5, 0, 0.06], -4, 62, 1.75)],
    ease: 'expoOut',
    shift: [
      [0, -0.13],
      [0, -0.11],
    ],
    pan: [
      [0, 0.02],
      [0, 0],
    ],
    light: 'punch',
    sweep: [55, -20],
  },
  // CONEXÃO.: a placa passa rápido (transição) e vira uma faixa entre "CON" e "EXÃO.".
  {
    t: [8.3, 8.54],
    cam: [pose([3.6, 0, 0], 0, 88, 4.1), pose([1.05, 0, 0], 0, 88, 4.1)],
    ease: 'expoOut',
    light: 'punch',
    blur: [-120, 0],
    sweep: [30, 20],
  },
  {
    t: [8.54, 9.42],
    cam: [pose([1.05, 0, 0], 0, 88, 4.1), pose([-0.35, 0, 0], 0, 88, 3.9)],
    ease: 'linear',
    light: 'punch',
    sweep: [20, -40],
  },
  // TECNOLO [placa] GIA.
  {
    t: [9.42, 10.06],
    cam: [pose(CENTER, 14, 68, 5.6, { roll: -34 }), pose(CENTER, 8, 70, 5.0, { roll: -30 })],
    ease: 'expoOut',
    board: [{ rot: [9, 0, 0] }, { rot: [-5, 0, 0] }],
    light: 'punch',
    sweep: [45, -30],
  },
  // A placa sai por cima e a palavra toma o quadro.
  {
    t: [10.06, 10.22],
    cam: [pose(CENTER, 8, 70, 5.0, { roll: -30 }), pose(CENTER, 8, 70, 5.0, { roll: -30 })],
    ease: 'linear',
    board: [{ rot: [-5, 0, 0] }, { rot: [-14, 0, 0] }],
    shift: [
      [0, 0],
      [0.12, 1.05],
    ],
    light: 'punch',
    blur: [0, -140],
  },
  { t: [10.22, 10.78], hidden: true },
  // CAOS: planos de ~0,28 s, cada um numa escala e num ângulo.
  {
    t: [10.78, 11.06],
    cam: [
      pose([-0.012, 0.16, -0.11], -40, 10, 0.72, { roll: 8 }),
      pose([-0.012, 0.16, -0.11], -52, 12, 0.66, { roll: 8 }),
    ],
    ease: 'linear',
    shift: [
      [-0.12, -0.05],
      [-0.12, -0.05],
    ],
    light: 'onColor',
    aperture: 0.3,
  },
  {
    t: [11.06, 11.33],
    cam: [pose([-0.8, 0, 0], 20, 55, 1.9, { roll: 45 }), pose([-0.6, 0, 0], 26, 55, 1.7, { roll: 45 })],
    ease: 'linear',
    shift: [
      [0.12, 0.06],
      [0.12, 0.06],
    ],
    light: 'punch',
  },
  {
    t: [11.33, 11.6],
    cam: [pose(CHIP, 0, 80, 0.62), pose(CHIP, 6, 80, 0.55)],
    ease: 'linear',
    shift: [
      [0.06, -0.3],
      [0.06, -0.3],
    ],
    light: 'onColor',
  },
  {
    t: [11.6, 11.88],
    cam: [pose([1.5, 0, 0], 0, 86, 4.0), pose([-0.7, 0, 0], 0, 86, 4.0)],
    ease: 'soft',
    light: 'onColor',
    blur: [-70, 0],
  },
  {
    t: [11.88, 12.16],
    cam: [pose(CENTER, -20, 60, 3.3, { roll: 90 }), pose(CENTER, 8, 60, 3.0, { roll: 90 })],
    ease: 'linear',
    shift: [
      [0.24, -0.12],
      [0.24, -0.12],
    ],
    light: 'punch',
  },
  {
    t: [12.16, 12.46],
    cam: [pose(CENTER, 0, 68, 8.4, { roll: 90 }), pose(CENTER, 0, 68, 7.6, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [28, 0, 0] }, { rot: [0, 0, 0] }],
    light: 'punch',
  },
  { t: [12.46, 12.75], hidden: true },
  // PAUSA: tela escura, placa inteira em pé, movimento lento.
  {
    t: [12.75, 15.3],
    cam: [pose(CENTER, 3, 64, 7.2, { roll: 90 }), pose(CENTER, 0, 66, 6.7, { roll: 90 })],
    ease: 'soft',
    board: [{ rot: [5, 0, 0] }, { rot: [0, 0, 0] }],
    light: 'hero',
    sweep: [55, -45],
  },
  // FINAL: "JFA / PARTS" gigante atrás da placa...
  {
    t: [15.3, 16.95],
    cam: [pose(CENTER, 0, 64, 5.2, { roll: 90 }), pose(CENTER, 0, 65, 5.0, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [-10, 0, 0] }, { rot: [-1.5, 0, 0] }],
    light: 'hero',
    sweep: [-50, 40],
  },
  // ...e o hero limpo com a assinatura.
  {
    t: [16.95, 20],
    cam: [pose(CENTER, 0, 65, 7.6, { roll: 90 }), pose(CENTER, 0, 66, 7.4, { roll: 90 })],
    ease: 'settle',
    board: [{ rot: [2.5, 0, 0] }, { rot: [0, 0, 0] }],
    shift: [
      [0, 0.08],
      [0, 0.08],
    ],
    light: 'hero',
    sweep: [45, -40],
  },
];

// ---------------------------------------------------------------------------
// CÂMERA MÓVEL (virtual): uma câmera só para a placa e para os planos de texto.
// yaw/pitch = órbita em graus (eixos da tela), dolly = aproximação (fração da
// distância), truck = deslocamento [x, y] (fração do quadro; +y sobe).
// Spline contínua entre marcações: a câmera nunca para de repente.
// ---------------------------------------------------------------------------
export const CAMERA_RIG = [
  // Cena 1: órbita da esquerda para a direita, descendo e aproximando.
  { t: -0.2, yaw: -11, pitch: 6, dolly: 0, truck: [0.02, 0] },
  { t: 1.0, yaw: -1.5, pitch: 1.5, dolly: 0.07, truck: [0, 0] },
  { t: 2.0, yaw: 8, pitch: -3, dolly: 0.11, truck: [0, 0], rest: true },
];

// ---------------------------------------------------------------------------
// PALAVRAS
// in/out: cut | slideLeft | slideRight | slideUp | slideDown | zoom | explode | stretch
//         | squeeze | rise (calmo) · fit: largura alvo (fração do quadro; no eixo da palavra)
// ---------------------------------------------------------------------------
const word = (text, t, o = {}) => ({
  text,
  t,
  layer: 'back',
  size: 'huge',
  font: 'sans',
  weight: null,
  color: 'white',
  outline: false,
  x: 50,
  y: 50,
  align: 'center',
  rotate: 0,
  fit: null,
  sy: 1,
  in: { type: 'cut' },
  out: { type: 'cut' },
  drift: [0, 0],
  grow: 0,
  fx: [],
  split: false,
  ...o,
});

/**
 * Troca de fonte: a mesma palavra em vários estilos, no mesmo lugar, em fusão rápida
 * (`crossfade` s) a cada troca. Ritmo em ciclos entre `from` e `lock`; antes e depois
 * fica o primeiro estilo da lista.
 */
function fontCycle(text, t, styles, { from, lock, rhythm, order, crossfade = 0.06 }, o = {}) {
  const switches = [[t[0], 0]];
  let at = from;
  let i = 0;
  while (at < lock) {
    switches.push([at, order[i % order.length]]);
    at += rhythm[i % rhythm.length];
    i++;
  }
  switches.push([lock, 0]);
  const ramp = (x) => {
    const c = Math.min(Math.max(x, 0), 1);
    return c * c * (3 - 2 * c);
  };
  // Opacidade de um estilo: soma dos trechos em que ele é o ativo, com rampas
  // centradas em cada troca (o estilo que sai e o que entra se cruzam).
  const alphaOf = (k) => (tb) => {
    let a = 0;
    switches.forEach(([start, idx], i) => {
      if (idx !== k) return;
      const end = i + 1 < switches.length ? switches[i + 1][0] : Infinity;
      const enter = i === 0 ? 1 : ramp((tb - start) / crossfade + 0.5);
      const leave = end === Infinity ? 1 : ramp((end - tb) / crossfade + 0.5);
      a = Math.max(a, enter * leave);
    });
    return a;
  };
  return styles.map((style, k) =>
    word(text, t, {
      ...o,
      ...style,
      in: k === 0 ? o.in : { type: 'none' },
      alphaAt: alphaOf(k),
    }),
  );
}

/** Pilha de linhas repetidas que se abre a partir do centro (explosão tipográfica). */
function stack(text, t, rows, o = {}) {
  const out = [];
  const mid = (rows - 1) / 2;
  for (let i = 0; i < rows; i++) {
    const k = i - mid;
    const ring = Math.abs(k);
    out.push(
      word(text, [t[0] + ring * (o.stagger ?? 0.05), t[1]], {
        ...o,
        y: (o.y ?? 50) + k * (o.gap ?? 11),
        outline: o.solidCenter ? ring > 0 : ring % 2 === 1,
        color: o.accentRing === ring ? 'electricBlue' : o.color || 'white',
        drift: [0, k * (o.spread ?? 0)],
        in: { type: 'explode', dur: 0.22 },
      }),
    );
  }
  return out;
}

export const WORDS = [
  // 0–2 s · VOCÊ NÃO VÊ
  // Fundo: "INVISÍVEL" gigante, esticada na altura do quadro, passando devagar atrás de
  // tudo em azul quase apagado (o que a placa é: invisível).
  word('INVISÍVEL', [-0.4, 2.3], {
    layer: 'far',
    font: 'condensed',
    size: 'huge',
    color: 'jfaBlue',
    opacity: 0.1,
    x: -6,
    y: 50,
    align: 'left',
    fit: 2.3,
    fitY: 1.06,
    drift: [-88, 0],
    stretch: 0.18,
    fade: [0.35, 0.4],
  }),
  // Um bloco só, linhas coladas, três estilos: Poppins Light, Poppins ExtraBold
  // Itálico (azul) e, no "VÊ", a troca de fonte. As entradas se sobrepõem.
  word('VOCÊ NÃO', [-0.12, 1.98], {
    parts: [
      { text: 'VOCÊ', weight: 300, tracking: 1.5 },
      { text: 'NÃO', weight: 800, italic: true, color: 'electricBlue', delay: 0.09, gap: 0.24 },
    ],
    size: 44,
    x: 9,
    y: 19.2,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'mask', dur: 0.3 },
  }),
  // "VÊ" não para quieto: troca de fonte em ritmo (rápido, rápido, médio) com fusão
  // curta entre as fontes, já durante a entrada, e trava na Stretch Pro no fim.
  ...fontCycle(
    'VÊ',
    [0.02, 2.0],
    [
      { font: 'wide', size: 90 },
      { font: 'serif', italic: true, size: 124 },
      { font: 'sans', weight: 900, size: 102 },
      { font: 'condensed', size: 98 },
      { font: 'sans', weight: 300, italic: true, size: 104 },
      { font: 'sans', weight: 800, italic: true, outline: true, size: 104 },
    ],
    {
      from: 0.3,
      lock: 1.55,
      rhythm: [0.067, 0.067, 0.133],
      order: [1, 2, 3, 4, 5, 1, 3, 2, 4, 5, 3, 1, 2, 4, 5],
      crossfade: 0.06,
    },
    { x: 9, y: 30.1, align: 'left', in: { type: 'mask', dur: 0.5 }, out: { type: 'mask', dur: 0.3 } },
  ),

  // 2–4,4 s · MAS / ELA / ESTÁ / EM TUDO.
  word('MAS', [1.95, 2.36], {
    color: 'black',
    y: 50,
    fit: 1.34,
    rotate: -4,
    grow: 0.08,
  }),
  word('ELA', [2.36, 2.86], {
    y: 33,
    fit: 1.04,
    sy: 1.1,
    in: { type: 'zoom', dur: 0.2 },
    grow: 0.06,
  }),
  word('ESTÁ', [2.86, 3.36], {
    layer: 'front',
    y: 47,
    fit: 1.16,
    sy: 1.45,
    split: true,
    fx: [{ preset: 'warp', at: 0, dur: 0.5 }],
    drift: [-3, 0],
  }),
  ...stack('EM TUDO', [3.36, 4.42], 7, {
    size: 'large',
    fit: 1.08,
    gap: 12.5,
    spread: 4,
    grow: 0.12,
    accentRing: 2,
  }),

  // 4,4–6,5 s · CONTROLE. / ENERGIA.
  word('CONTROLE', [4.42, 5.45], {
    x: -6,
    y: 31,
    align: 'left',
    fit: 1.3,
    in: { type: 'slideRight', dur: 0.24 },
    drift: [4, 0],
    fx: [{ preset: 'stretch', at: 0, dur: 0.34 }],
  }),
  word('CONTROLE', [4.6, 5.45], {
    x: 50,
    y: 83,
    size: 'medium',
    outline: true,
    fit: 0.86,
    in: { type: 'slideLeft', dur: 0.24 },
    drift: [-6, 0],
  }),
  word('ENERGIA', [5.45, 6.45], {
    font: 'wide',
    x: 25,
    y: 50,
    rotate: -90,
    fit: 0.98,
    fitAxis: 'y',
    size: 'large',
    in: { type: 'slideUp', dur: 0.28 },
    drift: [0, -4],
    fx: [{ preset: 'stretch', at: 0, dur: 0.36 }],
  }),

  // 7,1–10,8 s · PRECISÃO. / CON–EXÃO. / TECNOLO–GIA / TECNOLOGIA
  word('PRECISÃO', [7.12, 8.3], {
    y: 30,
    fit: 1.12,
    sy: 1.2,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.04,
    fx: [{ preset: 'impact', at: 0, dur: 0.45 }],
  }),
  word('CON', [8.42, 9.42], {
    y: 20,
    fit: 0.98,
    sy: 1.75,
    in: { type: 'squeeze', dur: 0.2 },
    drift: [-3, 0],
  }),
  word('EXÃO', [8.5, 9.42], {
    y: 81,
    fit: 0.98,
    sy: 1.75,
    in: { type: 'squeeze', dur: 0.2 },
    drift: [3, 0],
  }),
  word('TECNOLO', [9.42, 10.14], {
    x: -3,
    y: 17,
    align: 'left',
    fit: 1.08,
    in: { type: 'slideLeft', dur: 0.2 },
    drift: [-3, 0],
  }),
  word('GIA', [9.5, 10.14], {
    x: 103,
    y: 83,
    align: 'right',
    fit: 0.66,
    in: { type: 'slideRight', dur: 0.2 },
    drift: [3, 0],
  }),
  // A palavra nasce pequena e cresce até cobrir a tela (transição textWipe às 10,78).
  word('TECNOLOGIA', [10.18, 10.78], {
    y: 50,
    size: 'medium',
    fit: 0.5,
    scaleKeys: [
      [0, 0.25],
      [0.16, 1.0, 'enter'],
      [0.36, 1.08, 'linear'],
      [0.6, 70, 'expoIn'],
    ],
    // Ponto de crescimento dentro da haste do "T" (a tela fica toda branca).
    origin: [4.6, 56],
  }),

  // 10,8–12,75 s · CAOS
  word('CONTROLE', [10.78, 11.06], {
    layer: 'front',
    color: 'black',
    x: 86,
    y: 50,
    rotate: 90,
    fit: 1.02,
    fitAxis: 'y',
    in: { type: 'slideDown', dur: 0.16 },
  }),
  word('ENERGIA', [11.06, 11.33], {
    layer: 'front',
    font: 'wide',
    x: -12,
    y: 72,
    align: 'left',
    size: 'large',
    fit: 1.25,
    fx: [{ preset: 'smear', at: 0, dur: 0.27 }],
  }),
  word('PRECISÃO', [11.33, 11.6], {
    layer: 'front',
    color: 'black',
    x: -18,
    y: 26,
    align: 'left',
    fit: 1.45,
    sy: 1.3,
    in: { type: 'zoom', dur: 0.14 },
  }),
  word('CONEXÃO', [11.6, 11.88], {
    layer: 'front',
    y: 50,
    fit: 1.0,
    sy: 2.1,
    fx: [{ preset: 'glitch', at: 0, dur: 0.28 }],
  }),
  word('TECNOLOGIA', [11.88, 12.16], {
    layer: 'front',
    color: 'electricBlue',
    x: 102,
    y: 24,
    align: 'right',
    fit: 1.5,
    sy: 1.15,
    in: { type: 'slideLeft', dur: 0.14 },
  }),
  ...stack('TECNOLOGIA', [12.16, 12.46], 5, {
    size: 'large',
    fit: 1.0,
    gap: 9,
    stagger: 0.03,
    spread: 6,
    grow: 0.06,
    solidCenter: true,
  }),

  // 12,75–15,3 s · PAUSA
  word('TUDO COMEÇA', [12.95, 15.3], {
    size: 'large',
    weight: 800,
    y: 10,
    fit: 0.84,
    fitMode: 'uniform',
    in: { type: 'rise', dur: 0.6 },
    out: { type: 'fade', dur: 0.3 },
    drift: [0, -1.2],
  }),
  word('POR DENTRO', [13.35, 15.3], {
    size: 'large',
    weight: 800,
    y: 90,
    fit: 0.84,
    fitMode: 'uniform',
    in: { type: 'rise', dur: 0.6 },
    out: { type: 'fade', dur: 0.3 },
    drift: [0, -1.2],
  }),

  // 15,3–20 s · FINAL
  word('JFA', [15.3, 16.95], {
    font: 'wide',
    y: 31,
    fit: 1.1,
    sy: 1.25,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.05,
  }),
  word('PARTS', [15.38, 16.95], {
    font: 'wide',
    y: 69,
    fit: 1.1,
    sy: 1.25,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.05,
  }),
  word('JFA PARTS', [17.05, 20], {
    font: 'wide',
    size: 'medium',
    y: 82,
    fit: 0.7,
    fitMode: 'uniform',
    in: { type: 'zoom', dur: 0.24 },
  }),
  word('TECNOLOGIA QUE FAZ ACONTECER', [17.55, 20], {
    size: 'medium',
    weight: 700,
    y: 87.6,
    fit: 0.7,
    fitMode: 'uniform',
    tracking: 1.5,
    color: 'electricBlue',
    in: { type: 'rise', dur: 0.4 },
  }),
];

// ---------------------------------------------------------------------------
// GRÁFICOS (SVG, sem imagem). Posição = centro, em % do quadro; largura em % da largura.
// ---------------------------------------------------------------------------
export const GRAPHICS = [
  // Cena 1: olhos depois do "VÊ", entre as duas linhas, inclinados e cobrindo um
  // pouco do texto. Olham para os lados, piscam e se fecham no fim.
  {
    type: 'eyes',
    t: [0.36, 1.98],
    layer: 'back',
    x: 51,
    y: 26.2,
    width: 26,
    aspect: 170 / 200,
    rotate: -12,
    in: { dur: 0.3 },
    out: { dur: 0.3 },
    // [tempo local (s), olhar: -1 esquerda, 1 direita]
    look: [
      [0.16, -1],
      [0.46, 1],
      [0.82, -0.75],
      [0.98, 0.15],
    ],
    blinks: [0.66],
    closeAt: 1.14,
  },
];

// ---------------------------------------------------------------------------
// FUNDO (troca seca) e BLOCOS DE COR (retângulos em %: [x, y, largura, altura])
// ---------------------------------------------------------------------------
export const BACKGROUND = [
  [0, 'glow'],
  [1.95, 'white'],
  [2.36, 'jfaBlue'],
  [2.86, 'black'],
  [4.42, 'deepBlue'],
  [5.45, 'jfaBlue'],
  [6.45, 'black'],
  [10.78, 'jfaBlue'],
  [11.06, 'black'],
  [11.33, 'white'],
  [11.6, 'electricBlue'],
  [11.88, 'black'],
  [15.3, 'hero'],
];

export const BLOCKS = [
  // Coluna azul elétrica atrás de "CONTROLE." (corta a cena na vertical).
  { t: [4.5, 5.45], color: 'electricBlue', from: [70, 100, 14, 0], to: [70, 0, 14, 100], dur: 0.3 },
  // Barra azul sob "PRECISÃO." que abre da esquerda.
  { t: [7.2, 8.3], color: 'jfaBlue', from: [0, 41, 0, 3], to: [0, 41, 100, 3], dur: 0.35 },
  // Bloco que cobre metade da tela no caos.
  { t: [11.88, 12.16], color: 'jfaBlue', from: [0, 58, 100, 0], to: [0, 58, 100, 42], dur: 0.16 },
  // Linha fina azul na assinatura final.
  { t: [17.2, 20], color: 'jfaBlue', from: [50, 77.2, 0, 0.3], to: [42, 77.2, 16, 0.3], dur: 0.45 },
];

// ---------------------------------------------------------------------------
// TRANSIÇÕES (centradas no corte) e DISTORÇÕES GLOBAIS (sobre a composição inteira)
// ---------------------------------------------------------------------------
export const CUTS = [
  { t: 1.95, type: 'hardCut', dur: 0.08 },
  { t: 2.36, type: 'hardCut', dur: 0.08 },
  { t: 2.86, type: 'distortionCut', dur: 0.16 },
  { t: 3.36, type: 'scaleCut', dur: 0.14 },
  { t: 4.42, type: 'zoomIn', dur: 0.24 },
  { t: 5.45, type: 'verticalWipe', dur: 0.26, color: 'jfaBlue' },
  { t: 6.45, type: 'hardCut', dur: 0.08 },
  { t: 7.12, type: 'colorFlash', dur: 0.26, colors: ['white', 'jfaBlue', 'black'] },
  { t: 8.3, type: 'productPass', dur: 0.24, dir: -1 },
  { t: 9.42, type: 'whipRight', dur: 0.2 },
  { t: 10.78, type: 'textWipe', dur: 0.3, color: 'white' },
  { t: 11.06, type: 'hardCut', dur: 0.08 },
  { t: 11.33, type: 'horizontalWipe', dur: 0.14, color: 'white' },
  { t: 11.6, type: 'distortionCut', dur: 0.12, dir: -1 },
  { t: 11.88, type: 'whipLeft', dur: 0.14 },
  { t: 12.16, type: 'zoomOut', dur: 0.14 },
  { t: 12.6, type: 'colorFlash', dur: 0.3, colors: ['white', 'jfaBlue', 'black'] },
  { t: 15.3, type: 'scaleCut', dur: 0.2 },
  { t: 16.95, type: 'maskReveal', dur: 0.34, color: 'black', x: 50, y: 50 },
];

export const FX = [
  { t: 3.36, dur: 0.42, preset: 'impact' },
  { t: 7.12, dur: 0.5, preset: 'impact' },
  { t: 7.14, dur: 0.3, preset: 'shake' },
  { t: 10.78, dur: 0.24, preset: 'impact', amount: 0.8 },
  { t: 11.6, dur: 0.2, preset: 'glitch', amount: 0.6 },
  { t: 15.3, dur: 0.4, preset: 'impact', amount: 0.7 },
];

/** Pontos de sincronização para o sound design (o filme funciona sem áudio). */
const CUE_LABEL = {
  hardCut: 'Corte seco',
  whipLeft: 'Whoosh',
  whipRight: 'Whoosh',
  zoomIn: 'Impacto + sub',
  zoomOut: 'Impacto curto',
  verticalWipe: 'Swipe',
  horizontalWipe: 'Swipe',
  textWipe: 'Riser + corte',
  maskReveal: 'Respiro + abertura',
  scaleCut: 'Impacto',
  distortionCut: 'Glitch curto',
  productPass: 'Passagem (whoosh grave)',
  colorFlash: 'Impacto + flash',
};
export const CUES = [
  { t: 0, id: 'abertura', label: 'Batida de abertura' },
  ...CUTS.map((c) => ({ t: c.t, id: `${c.type}-${c.t}`, label: CUE_LABEL[c.type] })),
  { t: 12.75, id: 'pausa', label: 'Silêncio (pausa)', until: 15.3 },
].sort((a, b) => a.t - b.t);
