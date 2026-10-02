/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 28,5 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro, em UM plano contínuo (sem cortes e sem
 * paradas: a câmera só para no último quadro), alternando trechos lentos e rápidos e
 * girando sempre para o mesmo lado em volta da bateria (360°, sem ir e voltar).
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
 *   02 revelação 360 (4,2–13,5): a câmera acelera e dá a volta inteira rente ao produto,
 *      sempre para o mesmo lado: logotipo, borne positivo, ponta com alça, traseira (ficha
 *      técnica), outra ponta e quina da tampa (lento); recua rápido para as proporções.
 *   03 cards (13,5–16): 3/4 controlado com espaço em volta, órbita suave.
 *   04 vista explodida (16–22,1): a tampa sobe inteira e BMS, barramentos, suporte e
 *      células se separam na vertical; a câmera contorna, atravessa o vão entre corpo e
 *      células e, do outro lado, vira para ver tudo voltar ao lugar (clique em ~22,1).
 *   05 hero (22,1–24,9): aproximação lenta e baixa, espaço acima para a mensagem.
 *   06 final (24,9–28,5): ainda perto, a câmera se afasta devagar; muito espaço negativo.
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
  { id: 'cena-02', label: '02 Revelação 360', start: 4.2, end: 13.5 },
  { id: 'cena-03', label: '03 Cards', start: 13.5, end: 16 },
  { id: 'cena-04', label: '04 Explodida', start: 16, end: 22.1 },
  { id: 'cena-05', label: '05 Hero', start: 22.1, end: 24.9 },
  { id: 'cena-06', label: '06 Final', start: 24.9, end: 28.5 },
];

// Pontos do modelo (unidades de 10 cm; base no chão, frente para +z, positivo em +x).
export const BATERIA = {
  CENTER: [0, 1.2, 0],
  LOGO: [0, 1.32, 0.86],
  POSITIVO: [1.85, 2.42, -0.55],
  LATERAL: [2.3, 1.0, 0],
  FICHA: [1.7, 1.0, -0.86],
  OUTRA_PONTA: [-2.3, 1.2, 0],
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
const WIDE = { aperture: STUDIO.aperture };

// Vão da vista explodida por onde a câmera passa: entre a boca do corpo (1,95) e o fundo
// das células erguidas (2,96).
const VAO_Y = 2.45;

// UM plano contínuo (spline sem ultrapassagem). O azimute (az) só cresce: a câmera gira
// sempre para o mesmo lado em volta da bateria (mais de duas voltas no filme), nunca volta.
export const SHOTS = [
  {
    t: [0, 28.5],
    monotone: true,
    keys: [
      // 01 · silhueta: dolly lento e baixo.
      { t: 0, target: [0, 1.12, 0], az: -35, el: 5, dist: 19.5 },
      { t: 2.2, target: [0, 1.15, 0], az: -30, el: 6.2, dist: 17 },
      { t: 4.0, target: [0.1, 1.2, 0.1], az: -24, el: 7, dist: 14.5 },
      // 02 · revelação em volta: acelera rente à frente até o logotipo...
      { t: 4.9, target: [1.1, 1.25, 0.5], az: -8, el: 4.5, dist: 7.2 },
      { t: 5.5, target: [0.15, 1.3, 0.86], az: -3, el: 4, dist: 4.4 },
      { t: 6.1, target: BATERIA.LOGO, az: 1, el: 5, dist: 4.0 },
      // ...sobe até o borne positivo (conexões)...
      { t: 6.7, target: [1.2, 2.2, 0], az: 22, el: 30, dist: 4.6 },
      { t: 7.2, target: BATERIA.POSITIVO, az: 34, el: 40, dist: 2.25 },
      { t: 7.7, target: BATERIA.POSITIVO, az: 46, el: 36, dist: 2.05 },
      // ...contorna a ponta (orelha e alça)...
      { t: 8.3, target: BATERIA.LATERAL, az: 95, el: 14, dist: 4.4 },
      { t: 8.8, target: BATERIA.LATERAL, az: 112, el: 12, dist: 4.2 },
      // ...passa pela traseira (ficha técnica)...
      { t: 9.6, target: BATERIA.FICHA, az: 170, el: 8, dist: 3.6 },
      { t: 10.2, target: BATERIA.FICHA, az: 185, el: 9, dist: 3.4 },
      // ...pela outra ponta e chega à quina da tampa, devagar (acabamento)...
      { t: 10.9, target: BATERIA.OUTRA_PONTA, az: 265, el: 12, dist: 4.6 },
      { t: 11.6, target: BATERIA.QUINA, az: 330, el: 13, dist: 2.6 },
      { t: 12.3, target: [-0.9, 1.95, 0.86], az: 338, el: 15, dist: 2.2 },
      // ...e recua rápido: proporções.
      { t: 12.9, target: [0, 1.25, 0.2], az: 360, el: 9, dist: 9 },
      { t: 13.5, target: [0, 1.3, 0], az: 372, el: 13, dist: 16.5 },
      // 03 · cards: 3/4 controlado, órbita suave.
      { t: 15.6, target: [0, 1.35, 0], az: 392, el: 16, dist: 21.5 },
      // 04 · explodida: a câmera contorna a estrutura aberta (o alvo sobe com ela)...
      { t: 17.4, target: [0, 2.9, 0], az: 430, el: 14, dist: 19 },
      { t: 19.0, target: [0, 3.6, 0], az: 520, el: 14, dist: 19 },
      // ...desce e, sem parar de girar, fecha o raio até passar POR DENTRO do vão (sob as
      // células, acima da boca do corpo), olhando para o centro da estrutura aberta...
      { t: 19.8, target: [0, VAO_Y, 0], az: 600, el: 0, dist: 2.4 },
      { t: 20.5, target: [0, VAO_Y, 0], az: 630, el: 0, dist: 1.4 },
      { t: 21.2, target: [0, VAO_Y, 0], az: 660, el: 0, dist: 2.4 },
      // ...e sai pela frente, se afastando para ver tudo voltar ao lugar.
      { t: 22.0, target: [0, 1.6, 0.5], az: 690, el: 8, dist: 8 },
      // 05 · hero: aproximação lenta, frontal e baixa (espaço acima para a mensagem).
      { t: 23.6, target: BATERIA.CENTER, az: 702, el: 5, dist: 12.5, shift: [0, -0.12] },
      // 06 · final: chega perto e se afasta devagar até sobrar espaço negativo.
      { t: 24.9, target: BATERIA.CENTER, az: 712, el: 6, dist: 9.2, shift: [0, -0.06] },
      { t: 28.5, target: BATERIA.CENTER, az: 736, el: 11, dist: 30, rest: true },
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
        [5.3, WIDE],
        [6.0, MACRO],
        [6.6, WIDE],
        [7.2, MACRO],
        [7.9, MACRO],
        [8.4, WIDE],
        [9.6, MACRO],
        [10.2, MACRO],
        [10.8, WIDE],
        [11.6, MACRO],
        [12.4, MACRO],
        [13.0, WIDE],
        [19.6, WIDE],
        [20.5, { aperture: 1.6 }],
        [21.3, WIDE],
      ],
    },
  },
];

// Vista explodida (unidades de 10 cm): a tampa sobe inteira (com display, botão, anéis,
// arruelas e parafusos); por dentro, BMS, barramentos, suporte e células se separam na
// vertical, alinhados. Abre de cima para baixo; fecha de baixo para cima depois que a
// câmera atravessa o vão, e a tampa assenta por último (clique em ~22,1).
const OPEN = 16.0;
const CLOSE = 21.0;
const layer = (lift, k) => [
  [OPEN + (4 - k) * 0.12, 0],
  [OPEN + 1.3 + (4 - k) * 0.12, lift, 'soft'],
  [CLOSE + k * 0.07, lift],
  [CLOSE + 0.9 + k * 0.07, 0, 'easeIn'],
];
const LID = layer(4.85, 4);
export const EXPLODE = {
  cells: layer(2.9, 0),
  holder: layer(3.45, 1),
  bus: layer(3.85, 2),
  bms: layer(4.25, 3),
  lid: LID,
  rings: LID,
  button: LID,
  panel: LID,
  washers: LID,
  bolts: LID,
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
  { t: 4.2, id: 'revelacao', label: 'Câmera acelera e dá a volta (whoosh)', until: 13.5 },
  { t: 12.3, id: 'recuo', label: 'Recuo rápido (proporções)' },
  { t: 16.0, id: 'explodida', label: 'Peças se separam', until: 17.4 },
  { t: 19.7, id: 'vao', label: 'Câmera atravessa o vão', until: 21.2 },
  { t: 22.1, id: 'clique', label: 'Clique (bateria fecha)' },
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
