/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 28,5 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro, em UM plano contínuo (sem cortes e sem
 * paradas: a câmera só para no último quadro), alternando trechos lentos e rápidos.
 * A bateria nunca se move; a vista explodida é a única exceção. Estúdio branco em 3D
 * (ciclorama iluminado pelas luzes do set, piso brilhante com reflexo), luz e reflexos
 * presos ao mundo (studio: 'white' no palco) e motion blur de câmera real só quando a
 * imagem anda rápido (meta.shutter).
 * Modelo do CAD original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 * Nesta etapa não entram textos, cards, trilha nem efeitos de motion: só cenário, luz,
 * produto e câmera (pedido do cliente, que vale acima do checklist geral da skill).
 *
 *   01 silhueta (0–4,2): estúdio apagado; a luz de fundo acende o chão e a parede atrás
 *      (silhueta), depois contraluz e luz de cima; termina todo claro. Dolly lento.
 *   02 revelação (4,2–11,4): a câmera acelera e passa rente ao produto: logotipo,
 *      conexões (borne positivo), lateral (whip em volta da quina), acabamento (lento, rente
 *      à quina da tampa) e recuo rápido para as proporções.
 *   03 cards (11,4–14,6): 3/4 controlado com espaço em volta, órbita suave.
 *   04 vista explodida (14,6–21,6): a bateria se separa peça por peça na vertical (painel,
 *      parafusos, arruelas, botão, anéis, tampa, BMS, barramentos, suporte, células, corpo),
 *      a câmera contorna devagar e tudo volta ao lugar (clique em 21).
 *   05 hero (21,6–24,8): aproximação lenta e baixa, espaço acima para a mensagem.
 *   06 final (24,8–28,5): ainda perto, a câmera se afasta devagar; muito espaço negativo.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 28.5,
  stillTime: 28.4,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a imagem anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.2 },
  { id: 'cena-02', label: '02 Revelação', start: 4.2, end: 11.4 },
  { id: 'cena-03', label: '03 Cards', start: 11.4, end: 14.6 },
  { id: 'cena-04', label: '04 Explodida', start: 14.6, end: 21.6 },
  { id: 'cena-05', label: '05 Hero', start: 21.6, end: 24.8 },
  { id: 'cena-06', label: '06 Final', start: 24.8, end: 28.5 },
];

// Pontos do modelo (unidades de 10 cm; base no chão, frente para +z, positivo em +x).
export const BATERIA = {
  CENTER: [0, 1.2, 0],
  LOGO: [0, 1.32, 0.86],
  POSITIVO: [1.85, 2.42, -0.55],
  LATERAL: [2.3, 1.0, 0],
  QUINA: [-1.6, 1.95, 0.86],
};

export const SPACES = {
  1: { yaw: 0 },
};

// Estúdio aceso: luz de cima com sombra, contraluz, rebatimento das paredes, reflexos das
// softboxes, luz de fundo e piso brilhante. Níveis contidos (nada estoura).
const STUDIO = {
  keyLux: 0.75,
  keyAz: -30,
  keyEl: 70,
  keyAngle: 36,
  rimLux: 0.9,
  rimAz: 200,
  fill: 0.26,
  env: 0.85,
  wash: 0.32,
  contact: 0.85,
  floorReflect: 0.55,
  aperture: 0.6,
  bloom: 0,
  sweep: 15,
  exposure: 0.95,
};
// Profundidade de campo nos closes (foco no alvo da câmera).
const MACRO = { aperture: 2.6 };

// UM plano contínuo (spline sem ultrapassagem): a velocidade vem do espaçamento entre as
// marcações; nenhuma marcação para a câmera, só a última (rest).
export const SHOTS = [
  {
    t: [0, 28.5],
    monotone: true,
    keys: [
      // 01 · silhueta: dolly lento e baixo.
      { t: 0, target: [0, 1.12, 0], az: -24, el: 5, dist: 19.5 },
      { t: 2.2, target: [0, 1.15, 0], az: -22.5, el: 6.2, dist: 17.1 },
      { t: 4.0, target: [0.1, 1.2, 0.1], az: -19, el: 6.8, dist: 14.6 },
      // 02 · revelação: acelera e passa rente à frente até o logotipo.
      { t: 4.9, target: [1.1, 1.25, 0.5], az: 9, el: 4.5, dist: 7.2 },
      { t: 5.5, target: [0.15, 1.3, 0.86], az: 4, el: 4, dist: 4.4 },
      { t: 6.1, target: BATERIA.LOGO, az: 0, el: 5, dist: 4.0 },
      // sobe por cima até o borne positivo (conexões).
      { t: 6.7, target: [1.2, 2.2, 0], az: 20, el: 30, dist: 4.6 },
      { t: 7.2, target: BATERIA.POSITIVO, az: 32, el: 40, dist: 2.25 },
      { t: 7.7, target: BATERIA.POSITIVO, az: 42, el: 36, dist: 2.05 },
      // whip em volta da quina até a lateral (orelha e alça).
      { t: 8.25, target: BATERIA.LATERAL, az: 95, el: 14, dist: 4.4 },
      { t: 8.8, target: BATERIA.LATERAL, az: 88, el: 12, dist: 4.0 },
      // cruza a frente rápido até a quina da tampa e desliza devagar (acabamento).
      { t: 9.6, target: BATERIA.QUINA, az: -30, el: 13, dist: 2.6 },
      { t: 10.4, target: [-0.9, 1.95, 0.86], az: -22, el: 15, dist: 2.2 },
      // recuo rápido: proporções.
      { t: 11.0, target: [0, 1.25, 0.2], az: 8, el: 9, dist: 9 },
      { t: 11.6, target: [0, 1.3, 0], az: 22, el: 13, dist: 16.5 },
      // 03 · cards: 3/4 controlado, órbita suave.
      { t: 14.4, target: [0, 1.35, 0], az: 34, el: 16, dist: 21.5 },
      // 04 · explodida: o alvo sobe com a abertura; a câmera contorna devagar.
      { t: 16.2, target: [0, 3.0, 0], az: 26, el: 14, dist: 19 },
      { t: 18.6, target: [0, 3.9, 0], az: 2, el: 14, dist: 19.5 },
      { t: 20.4, target: [0, 3.4, 0], az: -18, el: 15, dist: 19 },
      { t: 21.6, target: [0, 1.45, 0], az: -26, el: 13, dist: 16 },
      // 05 · hero: aproximação lenta, frontal e baixa (espaço acima para a mensagem).
      { t: 23.6, target: BATERIA.CENTER, az: -14, el: 5, dist: 12.5, shift: [0, -0.12] },
      // 06 · final: chega perto e se afasta devagar até sobrar espaço negativo.
      { t: 24.9, target: BATERIA.CENTER, az: -8, el: 6, dist: 9.2, shift: [0, -0.06] },
      { t: 28.5, target: BATERIA.CENTER, az: 6, el: 11, dist: 30, rest: true },
    ],
    // Luz presa ao set: primeiro a luz de fundo (silhueta), depois contraluz e luz de cima,
    // e o estúdio inteiro aceso a partir de 4,2 s. Profundidade de campo nos closes.
    light: {
      base: 'feature',
      keys: [
        [0, { ...STUDIO, keyLux: 0, rimLux: 0, fill: 0, env: 0, wash: 0, contact: 0, floorReflect: 0 }],
        [0.4, { wash: 0 }],
        [1.8, { wash: 0.6, rimLux: 0, keyLux: 0, env: 0, fill: 0, contact: 0.25 }],
        [3.0, { rimLux: 0.8, keyLux: 0.35, env: 0.2, contact: 0.55, fill: 0.05, floorReflect: 0.3 }],
        [4.2, { ...STUDIO }],
        [5.3, { aperture: STUDIO.aperture }],
        [6.0, MACRO],
        [6.6, { aperture: STUDIO.aperture }],
        [7.2, MACRO],
        [7.9, MACRO],
        [8.4, { aperture: STUDIO.aperture }],
        [9.6, MACRO],
        [10.5, MACRO],
        [11.2, { aperture: STUDIO.aperture }],
      ],
    },
  },
];

// Vista explodida peça por peça (unidades de 10 cm): cada camada sobe na vertical,
// alinhada, abrindo de cima para baixo; fecha de baixo para cima e a tampa assenta por
// último (clique em 21,0). Ordem de baixo para cima: corpo, células, suporte, barramentos,
// BMS, tampa, anéis, botão, painel, arruelas, parafusos.
const OPEN = 15.0;
const CLOSE = 19.6;
const layer = (lift, k) => [
  [OPEN + (10 - k) * 0.09, 0],
  [OPEN + 1.25 + (10 - k) * 0.09, lift, 'soft'],
  [CLOSE + k * 0.05, lift],
  [CLOSE + 0.9 + k * 0.05, 0, 'easeIn'],
];
export const EXPLODE = {
  cells: layer(2.2, 0),
  holder: layer(2.6, 1),
  bus: layer(2.95, 2),
  bms: layer(3.3, 3),
  lid: layer(3.75, 4),
  rings: layer(4.2, 5),
  button: layer(4.45, 6),
  panel: layer(4.75, 7),
  washers: layer(5.2, 8),
  bolts: layer(5.6, 9),
};

// Câmera virtual (move os planos de texto, que ainda não existem): parada.
export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: 28.5, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
];

export const WORDS = [];
export const GRAPHICS = [];
// O estúdio é 3D (ciclorama); o fundo da página fica preto por trás.
export const BACKGROUND = [[0, 'void']];
export const BLOCKS = [];
export const CUTS = [];
export const FX = [];

export const CUES = [
  { t: 0, id: 'escuro', label: 'Escuro / ambiente grave', until: 1.8 },
  { t: 1.8, id: 'silhueta', label: 'Luz de fundo: silhueta', until: 3.0 },
  { t: 3.0, id: 'luz', label: 'Estúdio acende', until: 4.2 },
  { t: 4.2, id: 'revelacao', label: 'Câmera acelera (whoosh)', until: 11.6 },
  { t: 8.25, id: 'whip', label: 'Whip pan (lateral)' },
  { t: 11.0, id: 'recuo', label: 'Recuo rápido (proporções)' },
  { t: 15.0, id: 'explodida', label: 'Peças se separam', until: 16.5 },
  { t: 21.0, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 24.9, id: 'final', label: 'Afastamento final', until: 28.5 },
];

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
};
