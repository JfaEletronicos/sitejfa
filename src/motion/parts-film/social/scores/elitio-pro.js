/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 30,7 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro, em UM plano contínuo (sem cortes e sem
 * paradas: a câmera só para no último quadro), em voo livre (6DoF: posição e olhar
 * independentes, curvas inclinadas, micro-oscilação), alternando trechos lentos e rápidos e
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
 *   04 vista explodida (16–24): as peças se separam com a câmera de fora; pausa de
 *      leitura; a câmera desce em espiral (tornado) por dentro dos vãos, sempre olhando
 *      para o centro fixo; sai pela frente e a bateria se recompõe (clique em ~23,9).
 *   05 hero (24–26,8): aproximação lenta e baixa em 3/4, espaço acima para a mensagem.
 *   06 final (26,8–30,7): afastamento lento, muito espaço negativo.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 30.7,
  stillTime: 30.6,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a imagem anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.2 },
  { id: 'cena-02', label: '02 Revelação 360', start: 4.2, end: 13.5 },
  { id: 'cena-03', label: '03 Cards', start: 13.5, end: 16 },
  { id: 'cena-04', label: '04 Explodida', start: 16, end: 24 },
  { id: 'cena-05', label: '05 Hero', start: 24, end: 26.8 },
  { id: 'cena-06', label: '06 Final', start: 26.8, end: 30.7 },
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

const DEGREE = Math.PI / 180;

// Centro geométrico da bateria aberta (alvo fixo do tornado). A espiral (raio 1,9) desce
// por dentro do volume da bateria, entre a tampa erguida (acima de 8,28) e o corpo (abaixo
// de 1,95): nas pontas passa logo além das extremidades das peças internas (até x = ±1,53),
// na frente e atrás passa rente a elas; nunca cruza uma peça.
const NUCLEO = [0, 4.4, 0];
const HELIX = { r: 1.9, yTop: 7.6, drop: (7.6 - 4.2) / 600 };
const helixAt = (theta, r = HELIX.r) => {
  const a = theta * DEGREE;
  return [r * Math.sin(a), HELIX.yTop - (theta - 90) * HELIX.drop, r * Math.cos(a)];
};
/** Marcações da espiral (a cada 30°) entre os instantes t0 e t1. */
function tornado(t0, t1, from = 90, to = 690) {
  const out = [];
  for (let th = from; th <= to + 1e-6; th += 30) {
    out.push({
      t: t0 + ((th - from) / (to - from)) * (t1 - t0),
      pos: helixAt(th),
      look: NUCLEO,
      wobble: 0.3,
    });
  }
  return out;
}

// UM plano contínuo em voo livre (6DoF): posição e olhar com trajetórias próprias, curvas
// inclinadas pela aceleração lateral e micro-oscilação orgânica. A velocidade vem do
// espaçamento entre marcações (spline sem ultrapassagem: cada eixo fica entre duas
// marcações vizinhas, o que garante que a câmera não entra no produto). O ângulo em volta
// da bateria só cresce (nunca vai e volta). Unidades de 10 cm.
export const SHOTS = [
  {
    t: [0, 30.7],
    flight: true,
    wobble: 0.05,
    keys: [
      // 01 · silhueta: deriva lenta, baixa, bateria levemente fora do centro.
      { t: 0, pos: [-7.5, 1.0, 17.5], look: [0.5, 1.15, 0] },
      { t: 2.2, pos: [-6.3, 1.3, 15.0], look: [0.35, 1.18, 0] },
      { t: 4.0, pos: [-4.6, 1.55, 12.3], look: [0.15, 1.2, 0] },
      // 02 · revelação: mergulho agressivo e fly-by rente ao logotipo...
      { t: 4.95, pos: [-1.2, 0.7, 4.6], look: [0.6, 1.15, 0.86] },
      { t: 5.45, pos: [0.9, 1.05, 3.4], look: [0.1, 1.3, 0.86] },
      // ...quase parada para ler...
      { t: 5.95, pos: [1.6, 1.4, 3.6], look: [0.0, 1.32, 0.86], lens: 0.95 },
      { t: 6.35, pos: [1.9, 1.55, 3.7], look: [0.2, 1.35, 0.86], lens: 0.95 },
      // ...sobe por cima da quina até o borne positivo (macro)...
      { t: 6.9, pos: [2.6, 3.6, 1.6], look: [1.6, 2.3, -0.3] },
      { t: 7.35, pos: [2.5, 3.5, -0.2], look: [1.85, 2.45, -0.55] },
      { t: 7.85, pos: [2.75, 3.25, -0.7], look: [1.85, 2.42, -0.55] },
      // ...mergulha na ponta (orelha e alça)...
      { t: 8.35, pos: [4.2, 1.5, -1.3], look: [2.3, 1.0, 0] },
      { t: 8.85, pos: [4.0, 1.1, -2.2], look: [2.3, 1.0, 0] },
      // ...fly-by pela traseira (ficha técnica), olhando para trás enquanto avança...
      { t: 9.5, pos: [2.4, 1.2, -3.3], look: [1.7, 1.0, -0.86] },
      { t: 10.0, pos: [0.6, 1.25, -3.6], look: [1.3, 1.0, -0.86] },
      // ...contorna a outra ponta e chega devagar à quina da tampa (acabamento)...
      { t: 10.65, pos: [-3.6, 1.8, -2.6], look: [-2.3, 1.2, 0] },
      { t: 11.3, pos: [-3.3, 2.7, 1.9], look: [-1.6, 1.95, 0.86], lens: 0.9 },
      { t: 12.0, pos: [-2.4, 2.55, 2.6], look: [-0.9, 1.95, 0.86], lens: 0.9 },
      // ...e recua rápido, subindo: proporções.
      { t: 12.6, pos: [-1.0, 2.9, 7.5], look: [0, 1.3, 0] },
      { t: 13.4, pos: [2.0, 4.0, 15.0], look: [0, 1.3, 0] },
      // 03 · cards: 3/4 alto e controlado, deriva lenta.
      { t: 15.6, pos: [9.0, 5.6, 17.5], look: [0, 1.35, 0] },
      // 04 · explodida: a câmera fica de fora enquanto as camadas se separam...
      { t: 16.0, pos: [9.0, 5.8, 15.5], look: [0, 2.4, 0] },
      { t: 17.8, pos: [8.4, 6.0, 12.5], look: NUCLEO, wobble: 0.4 },
      // ...pausa de leitura (quase parada)...
      { t: 18.5, pos: [8.1, 6.1, 11.9], look: NUCLEO, wobble: 0.3 },
      // ...entra no vão de cima pela ponta do positivo e desce em espiral (tornado) por
      // dentro dos vãos, sempre olhando para o centro...
      { t: 19.0, pos: [3.6, 7.9, 1.8], look: NUCLEO, wobble: 0.3 },
      ...tornado(19.4, 22.4),
      // ...e sai pela frente, abrindo o raio e desacelerando.
      { t: 22.75, pos: helixAt(712, 3.0), look: NUCLEO, wobble: 0.5 },
      { t: 23.2, pos: helixAt(735, 5), look: [0, 3.2, 0] },
      { t: 24.0, pos: [3.8, 2.2, 8.2], look: [0, 1.25, 0] },
      // 05 · hero: aproximação lenta e baixa em 3/4 (espaço acima para a mensagem).
      { t: 25.5, pos: [5.0, 0.95, 10.5], look: [0.2, 1.3, 0], shift: [0, -0.12] },
      { t: 26.8, pos: [4.2, 0.85, 8.0], look: [0.1, 1.25, 0], shift: [0, -0.08] },
      // 06 · final: afastamento lento, subindo, muito espaço negativo.
      { t: 30.7, pos: [16, 6.5, 24], look: [0, 1.2, 0], rest: true },
    ],
    // Luz presa ao set: primeiro a luz de fundo (silhueta), depois contraluz e luz de cima,
    // e o estúdio inteiro aceso a partir de 4,2 s. Profundidade de campo nos closes e no
    // tornado (peças próximas desfocadas, centro em foco).
    light: {
      base: 'feature',
      keys: [
        [0, { ...STUDIO, keyLux: 0, rimLux: 0, fill: 0, env: 0, wash: 0, contact: 0, floorReflect: 0 }],
        [0.4, { wash: 0 }],
        [1.8, { wash: 0.6, rimLux: 0, keyLux: 0, env: 0, fill: 0, contact: 0.25 }],
        [3.0, { rimLux: 0.8, keyLux: 0.35, env: 0.2, contact: 0.55, fill: 0.05, floorReflect: 0.3 }],
        [4.2, { ...STUDIO }],
        [5.3, WIDE],
        [5.95, MACRO],
        [6.5, WIDE],
        [7.3, MACRO],
        [7.9, MACRO],
        [8.4, WIDE],
        [11.2, WIDE],
        [11.6, MACRO],
        [12.1, MACRO],
        [12.6, WIDE],
        // Por dentro da estrutura aberta a tampa faz sombra: as softboxes laterais (ambiente
        // e rebatimento) sobem durante o tornado para as peças continuarem legíveis.
        [18.8, { ...WIDE, env: STUDIO.env, fill: STUDIO.fill, exposure: STUDIO.exposure }],
        [19.4, { aperture: 0.9, env: 1.5, fill: 0.7, exposure: 1.1 }],
        [22.4, { aperture: 0.9, env: 1.5, fill: 0.7, exposure: 1.1 }],
        [23.1, { ...WIDE, env: STUDIO.env, fill: STUDIO.fill, exposure: STUDIO.exposure }],
      ],
    },
  },
];

// Vista explodida (unidades de 10 cm): a tampa sobe inteira (com display, botão, anéis,
// arruelas e parafusos); por dentro, BMS, barramentos, suporte e células se separam na
// vertical, alinhados. Abre de cima para baixo; fecha de baixo para cima depois que a
// câmera sai do tornado, e a tampa assenta por último (clique em ~23,9).
const OPEN = 16.0;
const CLOSE = 22.7;
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
  { t: 30.7, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
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
  { t: 4.2, id: 'revelacao', label: 'Voo em volta (whooshes)', until: 13.4 },
  { t: 12.6, id: 'recuo', label: 'Recuo rápido (proporções)' },
  { t: 16.0, id: 'explodida', label: 'Peças se separam', until: 17.8 },
  { t: 17.8, id: 'leitura', label: 'Pausa de leitura', until: 18.5 },
  { t: 19.0, id: 'tornado', label: 'Tornado por dentro (whoosh contínuo)', until: 22.75 },
  { t: 23.9, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 26.8, id: 'final', label: 'Afastamento final', until: 30.7 },
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
