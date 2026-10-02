/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 27,5 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro, em UM plano contínuo (sem cortes e sem
 * paradas: a câmera só para no último quadro), em voo livre como um pássaro (6DoF: posição
 * e olhar independentes, curvas suaves e inclinadas), alternando trechos lentos e rápidos e
 * girando sempre para o mesmo lado em volta da bateria (sem ir e voltar).
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
 *      (silhueta), depois contraluz e luz de cima; termina todo claro. Deriva lenta.
 *   02 revelação (4,2–13,4): voo livre em volta do produto, sempre para o mesmo lado:
 *      fly-by no logotipo, subida ao borne positivo, mergulho na ponta, traseira (ficha),
 *      outra ponta e quina da tampa (lento); recua rápido para as proporções.
 *   03 cards (13,4–16): 3/4 alto e controlado, deriva lenta.
 *   04 vista explodida (16–20,8): a tampa sobe inteira e BMS, barramentos, suporte e
 *      células se separam na vertical; a câmera fica em 3/4 lento, de fora, e a bateria se
 *      recompõe (clique em ~20,7).
 *   05 hero (20,8–23,5): aproximação lenta e baixa em 3/4, espaço acima para a mensagem.
 *   06 final (23,5–27,5): afastamento lento, muito espaço negativo.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 27.5,
  stillTime: 27.4,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a imagem anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.2 },
  { id: 'cena-02', label: '02 Revelação 360', start: 4.2, end: 13.5 },
  { id: 'cena-03', label: '03 Cards', start: 13.5, end: 16 },
  { id: 'cena-04', label: '04 Explodida', start: 16, end: 20.8 },
  { id: 'cena-05', label: '05 Hero', start: 20.8, end: 23.5 },
  { id: 'cena-06', label: '06 Final', start: 23.5, end: 27.5 },
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

// UM plano contínuo em voo livre (6DoF), como um pássaro em volta da bateria: posição e
// olhar com trajetórias próprias, curvas suaves (spline de curvatura contínua) inclinadas
// pela aceleração lateral, sem tremida. A velocidade vem do espaçamento entre marcações. O
// ângulo em volta da bateria só cresce (nunca vai e volta). Unidades de 10 cm.
export const SHOTS = [
  {
    t: [0, 27.5],
    flight: true,
    keys: [
      // 01 · silhueta: deriva lenta, baixa, bateria levemente fora do centro.
      { t: 0, pos: [-7.5, 1.0, 17.5], look: [0.5, 1.15, 0] },
      { t: 2.2, pos: [-6.3, 1.3, 15.0], look: [0.35, 1.18, 0] },
      { t: 4.0, pos: [-4.6, 1.55, 12.3], look: [0.15, 1.2, 0] },
      // 02 · revelação: mergulho e fly-by rente ao logotipo...
      { t: 4.95, pos: [-1.2, 0.8, 4.8], look: [0.6, 1.15, 0.86] },
      { t: 5.5, pos: [0.9, 1.05, 3.5], look: [0.1, 1.3, 0.86] },
      // ...quase parada para ler...
      { t: 6.0, pos: [1.6, 1.4, 3.6], look: [0.0, 1.32, 0.86], lens: 0.95 },
      { t: 6.4, pos: [1.9, 1.6, 3.7], look: [0.2, 1.35, 0.86], lens: 0.95 },
      // ...sobe por cima da quina até o borne positivo (macro)...
      { t: 6.95, pos: [2.7, 3.6, 1.7], look: [1.6, 2.3, -0.3] },
      { t: 7.4, pos: [2.6, 3.5, -0.2], look: [1.85, 2.45, -0.55] },
      { t: 7.9, pos: [2.85, 3.25, -0.7], look: [1.85, 2.42, -0.55] },
      // ...mergulha na ponta (orelha e alça)...
      { t: 8.4, pos: [4.3, 1.6, -1.3], look: [2.3, 1.0, 0] },
      { t: 8.9, pos: [4.1, 1.2, -2.3], look: [2.3, 1.0, 0] },
      // ...fly-by pela traseira (ficha técnica), olhando para trás enquanto avança...
      { t: 9.55, pos: [2.4, 1.25, -3.4], look: [1.7, 1.0, -0.86] },
      { t: 10.05, pos: [0.6, 1.3, -3.7], look: [1.3, 1.0, -0.86] },
      // ...contorna a outra ponta e chega devagar à quina da tampa (acabamento)...
      { t: 10.7, pos: [-3.7, 1.9, -2.7], look: [-2.3, 1.2, 0] },
      { t: 11.35, pos: [-3.4, 2.8, 2.0], look: [-1.6, 1.95, 0.86], lens: 0.9 },
      { t: 12.05, pos: [-2.5, 2.65, 2.7], look: [-0.9, 1.95, 0.86], lens: 0.9 },
      // ...e recua rápido, subindo: proporções.
      { t: 12.65, pos: [-1.0, 3.0, 7.6], look: [0, 1.3, 0] },
      { t: 13.45, pos: [2.0, 4.0, 15.0], look: [0, 1.3, 0] },
      // 03 · cards: 3/4 alto e controlado, deriva lenta.
      { t: 15.6, pos: [9.0, 5.6, 17.5], look: [0, 1.35, 0] },
      // 04 · explodida: 3/4 lento, de fora; o olhar sobe com a estrutura aberta, fica na
      // leitura e desce quando ela se fecha.
      { t: 16.0, pos: [9.4, 5.9, 16.2], look: [0, 2.4, 0] },
      { t: 17.8, pos: [10.2, 6.4, 14.0], look: [0, 4.0, 0] },
      { t: 19.5, pos: [10.6, 6.2, 12.6], look: [0, 3.8, 0] },
      { t: 20.8, pos: [9.8, 4.2, 11.0], look: [0, 1.6, 0] },
      // 05 · hero: aproximação lenta e baixa em 3/4 (espaço acima para a mensagem).
      { t: 22.2, pos: [8.6, 1.2, 9.4], look: [0.2, 1.3, 0], shift: [0, -0.12] },
      { t: 23.5, pos: [7.1, 0.95, 7.4], look: [0.1, 1.25, 0], shift: [0, -0.08] },
      // 06 · final: afastamento lento, subindo, muito espaço negativo.
      { t: 27.5, pos: [20, 7, 18], look: [0, 1.2, 0], rest: true },
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
        [6.5, WIDE],
        [7.35, MACRO],
        [7.95, MACRO],
        [8.45, WIDE],
        [11.25, WIDE],
        [11.65, MACRO],
        [12.15, MACRO],
        [12.65, WIDE],
      ],
    },
  },
];

// Vista explodida (unidades de 10 cm): a tampa sobe inteira (com display, botão, anéis,
// arruelas e parafusos); por dentro, BMS, barramentos, suporte e células se separam na
// vertical, alinhados. Abre de cima para baixo; fecha de baixo para cima depois que a
// câmera fica em 3/4 de fora, e a tampa assenta por último (clique em ~20,7).
const OPEN = 16.0;
const CLOSE = 19.5;
const layer = (lift, k) => [
  [OPEN + (4 - k) * 0.12, 0],
  [OPEN + 1.3 + (4 - k) * 0.12, lift, 'soft'],
  [CLOSE + k * 0.07, lift],
  [CLOSE + 0.9 + k * 0.07, 0, 'easeIn'],
];
// Uns 9 cm entre uma camada e outra (a câmera passa entre células e suporte).
const LID = layer(6.33, 4);
export const EXPLODE = {
  cells: layer(2.54, 0),
  holder: layer(3.5, 1),
  bus: layer(4.36, 2),
  bms: layer(5.27, 3),
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
  { t: 3.0, id: 'luz', label: 'Estúdio acende', until: 4.2 },
  { t: 4.2, id: 'revelacao', label: 'Voo em volta (whooshes)', until: 13.45 },
  { t: 12.65, id: 'recuo', label: 'Recuo rápido (proporções)' },
  { t: 16.0, id: 'explodida', label: 'Peças se separam', until: 17.8 },
  { t: 20.7, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 23.5, id: 'final', label: 'Afastamento final', until: 27.5 },
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
