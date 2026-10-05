/**
 * MODELO de vídeo promocional de produto 3D (?variant=produto-modelo · 9:16). Copie para
 * `scores/<id>.js` e troque produto, pontos, takes e textos. Identidade fixa (skill
 * `promo-produto`): estúdio escuro de fotografia, Poppins em 2D por cima da imagem, produto 3D
 * em destaque, câmera em voo livre fluida e orgânica, takes de tamanho médio (~1,6–2,2 s)
 * ligados por deslocamentos rápidos com rastro. Com ou sem cortes: `SEM_CORTES` (escolha do
 * usuário).
 *
 * O exemplo usa a bateria E-LÍTIO PRO (unidades de 10 cm, base no chão, frente para +z).
 *
 *   01 abertura (0–1,8): sai do preto já em movimento.
 *   02 detalhes (1,8–9,4): três takes de detalhe ligados por deslocamentos rápidos.
 *   03 hero (9,4–12,6): aproximação lenta com a frase principal.
 *   04 final (12,6–16,4): afastamento, nome, especificações e chamada; logo da JFA no preto.
 */

// true: um plano só, sem cortes (a câmera voa de um take ao outro); false: cada take é um
// plano próprio e a troca é um corte seco (cada plano ainda anda devagar, nunca parado).
const SEM_CORTES = true;

export const META = {
  id: 'produto-modelo',
  title: 'Modelo de vídeo promocional',
  duration: 16.4,
  stillTime: 16.3,
  format: '9x16',
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Abertura', start: 0, end: 1.8 },
  { id: 'cena-02', label: '02 Detalhes', start: 1.8, end: 9.4 },
  { id: 'cena-03', label: '03 Hero', start: 9.4, end: 12.6 },
  { id: 'cena-04', label: '04 Final', start: 12.6, end: 16.4 },
];

// Pontos do produto (unidades do modelo).
const P = {
  CENTRO: [0, 1.2, 0],
  FRENTE: [0, 1.32, 0.86],
  TOPO: [-0.08, 2.4, 0.39],
  TRAS: [1.7, 1.0, -0.86],
};

export const SPACES = { 1: { yaw: 0 } };

// Estúdio escuro de fotografia (`studio: 'cinema'` na variante): luz fixa, nada anda nem
// muda de luz; só a câmera se move.
const STUDIO = {
  keyLux: 6.5,
  keyAz: 10,
  keyEl: 55,
  edge: 6,
  rimLux: 0,
  rimAz: 200,
  fill: 0.03,
  env: 1.6,
  wash: 0,
  contact: 0.9,
  floorReflect: 0.3,
  aperture: 1.0,
  bloom: 0.05,
  grain: 1,
  vignette: 0.32,
  sweep: 0,
  exposure: 1.12,
};
const MACRO = { aperture: 3.0 };
const WIDE = { aperture: STUDIO.aperture };
const TAKE = { shutter: 1 / 30 };
const RUSH = { shutter: 1 / 12 };

/**
 * Takes em ordem. Cada um: `t` = [início, fim] do plano (com cortes) e `keys` = marcações do
 * voo ({ t, pos, look, lens, shift, rest }). Take de detalhe: ~1,6–2,2 s de deslize lento,
 * close com profundidade de campo (`macro`). Sem cortes, as marcações de todos os takes viram
 * um voo só e os intervalos entre os takes são os deslocamentos rápidos (com rastro).
 */
const TAKES = [
  {
    id: 'abertura',
    t: [0, 1.8],
    keys: [
      { t: 0, pos: [-6.8, 1.2, 15.8], look: [0.4, 1.18, 0] },
      { t: 1.4, pos: [-5.0, 1.45, 12.6], look: [0.2, 1.2, 0] },
    ],
  },
  {
    id: 'frente',
    t: [1.8, 4.2],
    macro: true,
    keys: [
      { t: 2.1, pos: [-1.2, 0.8, 4.8], look: [0.3, 1.2, 0.86] },
      { t: 2.5, pos: [0.6, 1.0, 3.6], look: [0.1, 1.3, 0.86] },
      { t: 3.25, pos: [1.25, 1.3, 3.65], look: P.FRENTE, lens: 0.95 },
      { t: 4.05, pos: [1.7, 1.5, 3.7], look: [0.15, 1.34, 0.86], lens: 0.95 },
    ],
  },
  {
    id: 'topo',
    t: [4.2, 6.7],
    macro: true,
    keys: [
      { t: 4.6, pos: [2.7, 4.3, 2.6], look: [0.1, 2.3, 0.35], lens: 0.85 },
      { t: 4.95, pos: [2.75, 4.85, 2.3], look: P.TOPO, lens: 0.78 },
      { t: 5.75, pos: [2.95, 4.95, 1.85], look: [-0.1, 2.4, 0.39], lens: 0.78 },
      { t: 6.55, pos: [3.15, 4.95, 1.4], look: [-0.14, 2.4, 0.39], lens: 0.78 },
    ],
  },
  {
    id: 'tras',
    t: [6.7, 9.4],
    macro: true,
    keys: [
      { t: 7.05, pos: [4.6, 2.0, -1.5], look: [2.0, 1.1, -0.6] },
      { t: 7.45, pos: [3.1, 1.25, -3.5], look: [1.75, 1.0, -0.86], lens: 0.88 },
      { t: 7.7, pos: [2.85, 1.2, -3.7], look: P.TRAS, lens: 0.85 },
      { t: 8.5, pos: [2.3, 1.15, -3.9], look: [1.7, 1.0, -0.86], lens: 0.85 },
      { t: 9.3, pos: [1.65, 1.15, -4.0], look: [1.66, 1.0, -0.86], lens: 0.85 },
    ],
  },
  {
    id: 'hero',
    t: [9.4, 12.6],
    keys: [
      { t: 9.9, pos: [9.9, 4.3, 11.0], look: [0, 1.6, 0] },
      { t: 11.2, pos: [9.0, 1.75, 8.54], look: [0.15, 1.3, 0], shift: [0, -0.11] },
      { t: 12.5, pos: [8.55, 1.3, 6.92], look: [0.1, 1.28, 0], shift: [0, -0.1] },
    ],
  },
  {
    id: 'final',
    t: [12.6, 16.4],
    keys: [
      { t: 13.4, pos: [10.22, 2.2, 7.02], look: [0.05, 1.25, 0], shift: [0, -0.05] },
      { t: 14.4, pos: [13.57, 3.9, 8.48], look: P.CENTRO },
      { t: 16.3, pos: [19.4, 6.7, 11.1], look: P.CENTRO, rest: true },
    ],
  },
];

const FADE_IN = [
  [0, { ...STUDIO, exposure: 0 }],
  [0.6, { exposure: STUDIO.exposure }],
];
const FADE_OUT = [
  [15.0, { exposure: STUDIO.exposure }],
  [15.8, { exposure: 0 }],
];

// Profundidade de campo nos takes `macro` (abre perto do começo, fecha perto do fim).
const focusKeys = (tk) =>
  tk.macro
    ? [
        [tk.keys[0].t, WIDE],
        [tk.keys[1].t, MACRO],
        [tk.keys[tk.keys.length - 1].t, MACRO],
        [tk.t[1], WIDE],
      ]
    : [];

// Sem cortes: obturador aberto (rastro) entre o fim de um take e a marcação de chegada do
// próximo; nítido dentro dos takes.
const rushKeys = () =>
  TAKES.slice(1).flatMap((tk, k) => {
    const end = TAKES[k].keys[TAKES[k].keys.length - 1].t;
    const arrive = tk.keys[Math.min(1, tk.keys.length - 1)].t;
    return [
      [end + 0.1, TAKE],
      [end + 0.25, RUSH],
      [arrive - 0.15, RUSH],
      [arrive, TAKE],
    ];
  });

const lerp3 = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const untilCut = (tk) => {
  const ks = tk.keys;
  const a = ks[ks.length - 2];
  const b = ks[ks.length - 1];
  if (!a || b.rest || b.t >= tk.t[1] - 0.05) return ks;
  const k = (tk.t[1] - a.t) / (b.t - a.t);
  return [...ks, { ...b, t: tk.t[1], pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k) }];
};

const lightOf = (keys) => ({ base: 'feature', keys: [...FADE_IN, ...FADE_OUT, ...keys] });

export const SHOTS = SEM_CORTES
  ? [
      {
        t: [0, META.duration],
        flight: true,
        keys: TAKES.flatMap((tk) => tk.keys),
        light: lightOf([...TAKES.flatMap(focusKeys), ...rushKeys()]),
      },
    ]
  : TAKES.map((tk) => ({
      t: tk.t,
      flight: true,
      // Com cortes, cada plano anda do começo ao fim (nunca parado): a última marcação segue
      // na mesma velocidade até o corte.
      keys: untilCut(tk),
      light: lightOf(focusKeys(tk)),
    }));

const SUB = '#b8bcc5';
export const TITLES = [
  {
    id: 'hero-1',
    t: [10.1, 12.5],
    y: 22.5,
    parts: [{ text: 'Frase principal', weight: 600, size: 0.046 }],
  },
  {
    id: 'hero-2',
    t: [10.45, 12.55],
    y: 27.2,
    parts: [{ text: 'complemento curto', weight: 300, size: 0.024, color: SUB, tracking: 0.01 }],
  },
  {
    id: 'final-nome',
    t: [13.1, 15.0],
    outDur: 0.8,
    y: 21.5,
    parts: [{ text: 'NOME DO PRODUTO', weight: 600, size: 0.05 }],
  },
  {
    id: 'final-specs',
    t: [13.45, 15.0],
    outDur: 0.8,
    y: 26.4,
    parts: [{ text: 'Spec  ·  Spec  ·  Spec', weight: 300, size: 0.021, color: SUB, tracking: 0.02 }],
  },
  {
    id: 'final-cta',
    t: [13.9, 15.0],
    outDur: 0.8,
    y: 72.5,
    pill: true,
    parts: [{ text: 'Já disponível', weight: 500, size: 0.02, tracking: 0.02 }],
  },
  {
    id: 'assinatura',
    t: [15.5, 99],
    inDur: 1.3,
    y: 50,
    image: '/images/jfa_logo_white.webp',
    size: 0.05,
    rise: 0.004,
  },
];

export const GLASS = [];
export const EXPLODE = {};
export const CALLOUTS = [];

export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: META.duration, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
];
export const WORDS = [];
export const GRAPHICS = [];
export const BACKGROUND = [[0, 'void']];
export const BLOCKS = [];
export const CUTS = [];
export const FX = [];
export const CUES = TAKES.map((tk) => ({ t: tk.t[0], id: tk.id, label: tk.id, until: tk.t[1] }));

export default {
  meta: META,
  scenes: SCENES,
  spaces: SPACES,
  shots: SHOTS,
  cameraRig: CAMERA_RIG,
  words: WORDS,
  graphics: GRAPHICS,
  background: BACKGROUND,
  blocks: BLOCKS,
  cuts: CUTS,
  fx: FX,
  cues: CUES,
  explode: EXPLODE,
  glass: GLASS,
  titles: TITLES,
  callouts: CALLOUTS,
};
