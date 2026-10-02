/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 27,5 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro. A bateria nunca se move (só a câmera e a
 * luz); a vista explodida é a única exceção. Estúdio branco em 3D (ciclorama iluminado pelas
 * luzes do set), luz e reflexos presos ao mundo (studio: 'white' no palco) e motion blur de
 * câmera de verdade nos movimentos rápidos (meta.shutter).
 * Modelo do CAD original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 * Nesta etapa não entram textos, cards, trilha nem efeitos de motion: só cenário, luz,
 * produto e câmera (pedido do cliente, que vale acima do checklist geral da skill).
 *
 *   01 silhueta (0–4,5): estúdio apagado; a luz de fundo acende uma mancha no chão e na
 *      parede atrás (silhueta), depois o contraluz e a luz de cima; termina todo claro.
 *   02 revelação (4,5–10,5): planos rápidos com cortes secos e motion blur: logotipo,
 *      conexões, lateral, acabamento (lento, para contraste) e proporções.
 *   03 cards (10,5–13,5): 3/4 controlado com espaço em volta (cards entram depois).
 *   04 vista explodida (13,5–20): a bateria se separa em camadas na vertical, a câmera
 *      contorna devagar e tudo volta ao lugar (clique em 19,2).
 *   05 hero (20–23,5): aproximação lenta, espaço acima para a mensagem.
 *   06 final (23,5–27,5): começa perto e se afasta devagar, muito espaço negativo.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 27.5,
  stillTime: 27.4,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a câmera anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.5 },
  { id: 'cena-02', label: '02 Revelação', start: 4.5, end: 10.5 },
  { id: 'cena-03', label: '03 Cards', start: 10.5, end: 13.5 },
  { id: 'cena-04', label: '04 Explodida', start: 13.5, end: 20 },
  { id: 'cena-05', label: '05 Hero', start: 20, end: 23.5 },
  { id: 'cena-06', label: '06 Final', start: 23.5, end: 27.5 },
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

// Estúdio todo aceso (cenas 02 a 06): luz de cima com sombra, contraluz, rebatimento das
// paredes, reflexos das softboxes e a luz de fundo.
const STUDIO = {
  keyLux: 1.4,
  keyAz: -30,
  keyEl: 72,
  keyAngle: 34,
  rimLux: 1.1,
  rimAz: 200,
  fill: 0.45,
  env: 1,
  wash: 0.6,
  contact: 0.75,
  bloom: 0,
  sweep: 15,
  exposure: 1,
};

// Plano com marcações de velocidade contínua (o último assenta com rest) e o estúdio aceso.
const shot = (t, keys) => ({ t, keys, light: { base: 'feature', keys: [[0, STUDIO]] } });

export const SHOTS = [
  // 01 · SILHUETA: dolly lento e baixo. A luz acende por partes, presa ao set: primeiro a
  // luz de fundo (mancha no chão e na parede atrás: silhueta), depois contraluz e luz de
  // cima (bordas, reflexos, sombra no chão), e por fim o estúdio inteiro.
  {
    t: [0, 4.5],
    keys: [
      { t: 0, target: [0, 1.12, 0], az: -24, el: 5, dist: 19.5 },
      { t: 2.2, target: [0, 1.15, 0], az: -22.5, el: 6.2, dist: 17.1 },
      { t: 4.5, target: BATERIA.CENTER, az: -21, el: 7.2, dist: 15.4 },
    ],
    light: {
      base: 'feature',
      keys: [
        [0, { ...STUDIO, keyLux: 0, rimLux: 0, fill: 0, env: 0, wash: 0, contact: 0 }],
        [0.4, { wash: 0 }],
        [1.8, { wash: 0.85, rimLux: 0, keyLux: 0, env: 0, fill: 0, contact: 0.2 }],
        [3.0, { rimLux: 1.0, keyLux: 0.55, env: 0.18, contact: 0.5, fill: 0.04 }],
        [4.5, { ...STUDIO }],
      ],
    },
  },

  // 02 · REVELAÇÃO: cortes secos entre planos rápidos (motion blur forte) e um lento.
  // a) logotipo: travelling rente à frente, da direita para a esquerda, freando no logo.
  shot(
    [4.5, 5.7],
    [
      { t: 4.5, target: [3.4, 1.2, 0.86], az: 32, el: 3, dist: 5.2 },
      { t: 5.15, target: [0.5, 1.3, 0.86], az: 7, el: 4, dist: 4.3 },
      { t: 5.7, target: BATERIA.LOGO, az: 2, el: 4, dist: 4.0, rest: true },
    ],
  ),
  // b) conexões: mergulho rápido do alto até o borne positivo (parafuso e anel).
  shot(
    [5.7, 7.0],
    [
      { t: 5.7, target: BATERIA.POSITIVO, az: 70, el: 58, dist: 7.5 },
      { t: 6.3, target: BATERIA.POSITIVO, az: 38, el: 42, dist: 2.3 },
      { t: 7.0, target: BATERIA.POSITIVO, az: 31, el: 39, dist: 1.85, rest: true },
    ],
  ),
  // c) lateral: chicote (whip) em volta da quina até a ponta, com orelha e alça.
  shot(
    [7.0, 8.3],
    [
      { t: 7.0, target: BATERIA.LATERAL, az: 150, el: 9, dist: 5.6 },
      { t: 7.5, target: BATERIA.LATERAL, az: 98, el: 11, dist: 4.4 },
      { t: 8.3, target: BATERIA.LATERAL, az: 82, el: 12, dist: 4.1, rest: true },
    ],
  ),
  // d) acabamento: lento, rente à quina da tampa (reflexo do black piano e linha de molde).
  shot(
    [8.3, 9.4],
    [
      { t: 8.3, target: BATERIA.QUINA, az: -38, el: 13, dist: 2.4 },
      { t: 9.4, target: [-0.8, 1.95, 0.86], az: -24, el: 15, dist: 2.1, rest: true },
    ],
  ),
  // e) proporções: recuo rápido do detalhe até o produto inteiro, assentando.
  shot(
    [9.4, 10.5],
    [
      { t: 9.4, target: [0, 1.3, 0.3], az: 18, el: 8, dist: 4.2 },
      { t: 9.85, target: [0, 1.25, 0], az: 24, el: 9.5, dist: 11.5 },
      { t: 10.5, target: BATERIA.CENTER, az: 27, el: 10, dist: 15.6, rest: true },
    ],
  ),

  // 03 · CARDS: 3/4 controlado, produto menor com espaço em volta; órbita suave.
  shot(
    [10.5, 13.5],
    [
      { t: 10.5, target: [0, 1.35, 0], az: -40, el: 17, dist: 22 },
      { t: 13.5, target: [0, 1.35, 0], az: -31, el: 15.5, dist: 21, rest: true },
    ],
  ),

  // 04 · VISTA EXPLODIDA: a câmera contorna devagar enquanto as camadas sobem e voltam;
  // o alvo sobe junto com a abertura (e desce no fechamento).
  shot(
    [13.5, 20],
    [
      { t: 13.5, target: [0, 1.4, 0], az: 34, el: 15, dist: 15.5 },
      { t: 15.6, target: [0, 3.0, 0], az: 16, el: 15, dist: 16.5 },
      { t: 18.2, target: [0, 3.0, 0], az: -10, el: 17, dist: 16.5 },
      { t: 20, target: [0, 1.5, 0], az: -24, el: 15, dist: 15, rest: true },
    ],
  ),

  // 05 · HERO: aproximação lenta, frontal e baixa; produto um pouco abaixo do centro
  // (espaço acima para a mensagem).
  shot(
    [20, 23.5],
    [
      { t: 20, target: BATERIA.CENTER, az: -14, el: 4.5, dist: 17, shift: [0, -0.12] },
      { t: 23.5, target: BATERIA.CENTER, az: -9, el: 5.5, dist: 13, shift: [0, -0.12], rest: true },
    ],
  ),

  // 06 · FINAL: começa perto e se afasta devagar; produto no centro, muito espaço negativo.
  shot(
    [23.5, 27.5],
    [
      { t: 23.5, target: BATERIA.CENTER, az: 12, el: 7, dist: 8 },
      { t: 27.5, target: BATERIA.CENTER, az: 4, el: 10, dist: 30, rest: true },
    ],
  ),
];

// Vista explodida (unidades de 10 cm): cada camada sobe na vertical, alinhada. Abre de
// cima para baixo e fecha de baixo para cima; a tampa fecha por último (clique em 19,2).
export const EXPLODE = {
  lid: [
    [14.2, 0],
    [15.4, 3.55, 'soft'],
    [18.3, 3.55],
    [19.2, 0, 'easeIn'],
  ],
  bms: [
    [14.4, 0],
    [15.6, 3.0, 'soft'],
    [18.2, 3.0],
    [19.1, 0, 'easeIn'],
  ],
  cells: [
    [14.6, 0],
    [15.8, 2.45, 'soft'],
    [18.1, 2.45],
    [19.0, 0, 'easeIn'],
  ],
};

// Câmera virtual (move os planos de texto, que ainda não existem): parada.
export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: 27.5, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
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
  { t: 3.0, id: 'luz', label: 'Estúdio acende', until: 4.5 },
  { t: 4.5, id: 'logo', label: 'Corte + whoosh (logotipo)' },
  { t: 5.7, id: 'conexoes', label: 'Corte + whoosh (conexões)' },
  { t: 7.0, id: 'lateral', label: 'Whip pan (lateral)' },
  { t: 8.3, id: 'acabamento', label: 'Corte para lento (acabamento)' },
  { t: 9.4, id: 'proporcoes', label: 'Recuo rápido (proporções)' },
  { t: 10.5, id: 'cards', label: 'Corte: enquadramento dos cards' },
  { t: 13.5, id: 'explodida', label: 'Corte: vista explodida', until: 15.8 },
  { t: 19.2, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 20, id: 'hero', label: 'Corte: hero' },
  { t: 23.5, id: 'final', label: 'Corte: final (afastamento)' },
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
