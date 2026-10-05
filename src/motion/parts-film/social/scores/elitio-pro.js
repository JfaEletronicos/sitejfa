/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 33,9 s): filme de lançamento com
 * linguagem de filme de produto, clean e elegante, em UM plano contínuo (sem cortes e sem
 * paradas), em voo livre como um pássaro (6DoF: posição e olhar independentes, curvas suaves
 * e inclinadas): takes longos e lentos ligados por deslocamentos rápidos com rastro de
 * velocidade, girando sempre para o mesmo lado em volta da bateria.
 * A bateria nunca se move; a vista explodida é a única exceção. Estúdio escuro de fotografia
 * em 3D (ciclorama grafite, piso com reflexo leve) e luz de estúdio fixa (studio: 'cinema'),
 * motion blur de câmera real só quando a imagem anda rápido (meta.shutter, mais aberto nos
 * deslocamentos). Títulos em 2D por cima da imagem (TITLES), cards de vidro (GLASS) e nomes
 * das peças na explodida (CALLOUTS).
 * Modelo do CAD original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 *   01 abertura (0–2,1): sai do preto já em movimento e mergulha.
 *   02 revelação (2,1–13,6): takes do adesivo frontal (logotipo), do adesivo de cima, do
 *      adesivo traseiro e do display aceso, de cima, ligados por deslocamentos rápidos;
 *      fecha a volta recuando.
 *   03 cards (13,6–17,4): 3/4 alto, deriva lenta, cards Liquid Glass com as especificações.
 *   04 vista explodida (17,4–24,1): a tampa sobe inteira e BMS, barramentos, suporte e
 *      células se separam; nomes das peças ligados por linhas finas; a bateria se recompõe.
 *   05 hero (24,1–27,1): aproximação lenta e baixa, "3X mais energia" com o contador.
 *   06 final (27,1–31,9): afastamento, nome, especificações e "Já disponível".
 *   07 assinatura (31,9–33,9): a cena some no preto e o logo JFA aparece.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 33.9,
  stillTime: 33.8,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a imagem anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Abertura', start: 0, end: 2.1 },
  { id: 'cena-02', label: '02 Revelação', start: 2.1, end: 13.6 },
  { id: 'cena-03', label: '03 Cards', start: 13.6, end: 17.4 },
  { id: 'cena-04', label: '04 Explodida', start: 17.4, end: 24.1 },
  { id: 'cena-05', label: '05 Hero', start: 24.1, end: 27.1 },
  { id: 'cena-06', label: '06 Final', start: 27.1, end: 31.9 },
  { id: 'cena-07', label: '07 Assinatura', start: 31.9, end: 33.9 },
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

// Estúdio escuro de fotografia com luz fixa de estúdio: fundo e chão quase pretos, e o
// produto bem iluminado, destacado do resto (sem compromisso com luz realista: o ambiente
// que o produto reflete é claro, mas o ciclorama quase não o recebe). Uma softbox na frente, no alto e perto (ilumina bem a bateria e cai
// rápido, sem clarear o fundo), com sombra macia, e dois recortes finos atrás, um de cada
// lado, que desenham as arestas contra o escuro. Ambiente quase preto (poucos reflexos) e
// reflexo leve no chão. Nenhuma luz anda nem muda: só a câmera se move.
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
// Profundidade de campo nos closes (foco no alvo da câmera).
const MACRO = { aperture: 3.0 };
const WIDE = { aperture: STUDIO.aperture };
// Obturador: normal nos takes (nítidos) e bem aberto nos deslocamentos de um ponto a
// outro, para o rastro de alta velocidade (o motion blur só aparece onde a imagem anda).
const TAKE = { shutter: 1 / 30 };
const RUSH = { shutter: 1 / 12 };

// UM plano contínuo em voo livre (6DoF), como um pássaro em volta da bateria: posição e
// olhar com trajetórias próprias, caminho sem laços e curvas inclinadas pela aceleração
// lateral, sem tremida. A velocidade de cada trecho vem do espaçamento entre marcações e
// muda aos poucos (nunca volta nem passa do ponto); `stop` assenta a câmera antes de ela
// mudar de sentido. O ângulo em volta da bateria só cresce (nunca vai e volta). Unidades
// de 10 cm.
export const SHOTS = [
  {
    t: [0, 33.9],
    flight: true,
    keys: [
      // 01 · abertura curta: sai do preto já em movimento e mergulha logo.
      { t: 0, pos: [-6.8, 1.2, 15.8], look: [0.4, 1.18, 0] },
      { t: 1.4, pos: [-5.0, 1.45, 12.6], look: [0.2, 1.2, 0] },
      // 02 · revelação: takes longos e lentos ligados por deslocamentos rápidos.
      // Logotipo: o mergulho freia rente à frente e desliza devagar lendo o adesivo frontal.
      { t: 2.1, pos: [-1.2, 0.8, 4.8], look: [0.3, 1.2, 0.86] },
      { t: 2.5, pos: [0.6, 1.0, 3.6], look: [0.1, 1.3, 0.86] },
      { t: 3.25, pos: [1.25, 1.3, 3.65], look: [0.0, 1.32, 0.86], lens: 0.95 },
      { t: 4.05, pos: [1.7, 1.5, 3.7], look: [0.15, 1.34, 0.86], lens: 0.95 },
      // ...sobe rápido para o adesivo de cima e desliza sobre ele, de cima...
      { t: 4.6, pos: [2.7, 4.3, 2.6], look: [0.1, 2.3, 0.35], lens: 0.85 },
      { t: 4.95, pos: [2.75, 4.85, 2.3], look: [-0.08, 2.4, 0.39], lens: 0.78 },
      { t: 5.75, pos: [2.95, 4.95, 1.85], look: [-0.1, 2.4, 0.39], lens: 0.78 },
      { t: 6.55, pos: [3.15, 4.95, 1.4], look: [-0.14, 2.4, 0.39], lens: 0.78 },
      // ...desce rápido pela ponta até a traseira e desliza lendo o adesivo traseiro...
      { t: 7.05, pos: [4.6, 2.0, -1.5], look: [2.0, 1.1, -0.6] },
      { t: 7.45, pos: [3.1, 1.25, -3.5], look: [1.75, 1.0, -0.86], lens: 0.88 },
      { t: 7.7, pos: [2.85, 1.2, -3.7], look: [1.72, 1.0, -0.86], lens: 0.85 },
      { t: 8.5, pos: [2.3, 1.15, -3.9], look: [1.7, 1.0, -0.86], lens: 0.85 },
      { t: 9.3, pos: [1.65, 1.15, -4.0], look: [1.66, 1.0, -0.86], lens: 0.85 },
      // ...corre pela traseira, contorna a outra ponta subindo e chega por cima ao display...
      { t: 9.8, pos: [-2.2, 2.6, -3.4], look: [-0.8, 1.6, -0.5] },
      { t: 10.25, pos: [-3.3, 4.6, -0.3], look: [-0.4, 2.3, -0.35], lens: 0.65 },
      { t: 10.55, pos: [-2.45, 5.15, 0.9], look: [-0.15, 2.42, -0.36], lens: 0.57 },
      { t: 10.8, pos: [-2.1, 5.26, 1.29], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 11.6, pos: [-1.97, 5.27, 1.42], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 12.4, pos: [-1.84, 5.27, 1.55], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 12.7, pos: [-1.6, 5.22, 1.88], look: [-0.06, 2.3, -0.3], lens: 0.6 },
      // ...e fecha a volta recuando rápido numa espiral que abre e sobe (proporções)...
      { t: 13.1, pos: [-0.75, 4.75, 5.3], look: [0, 1.7, 0] },
      { t: 13.6, pos: [1.2, 4.8, 10.4], look: [0, 1.35, 0] },
      // 03 · cards: a espiral perde velocidade no 3/4 alto, deriva lenta.
      { t: 16.2, pos: [6.33, 5.5, 17.38], look: [0, 1.35, 0] },
      // 04 · explodida: 3/4 lento, de fora, fechando devagar em volta; o olhar sobe com a
      // estrutura aberta, fica na leitura (nomes das peças) e desce quando ela se fecha.
      { t: 17.4, pos: [9.2, 5.9, 17.3], look: [0, 2.4, 0] },
      { t: 19.4, pos: [9.79, 5.65, 14.5], look: [0, 3.3, 0] },
      { t: 22.8, pos: [9.94, 5.4, 12.28], look: [0, 3.2, 0] },
      { t: 24.1, pos: [9.9, 4.3, 11.0], look: [0, 1.6, 0] },
      // 05 · hero e 06 · final num movimento só, sem parar e sem voltar: a câmera desce e se
      // aproxima girando devagar em volta da bateria (espaço acima para a frase) e, sem
      // frear, abre em espiral subindo para o afastamento final (o ângulo só cresce), até a
      // cena sumir no preto.
      { t: 25.4, pos: [9.0, 1.75, 8.54], look: [0.15, 1.3, 0], shift: [0, -0.11] },
      { t: 26.7, pos: [8.55, 1.3, 6.92], look: [0.1, 1.28, 0], shift: [0, -0.1] },
      { t: 28.05, pos: [10.22, 2.2, 7.02], look: [0.05, 1.25, 0], shift: [0, -0.05] },
      { t: 29.25, pos: [13.57, 3.9, 8.48], look: [0, 1.2, 0] },
      { t: 32.3, pos: [19.4, 6.7, 11.1], look: [0, 1.2, 0], rest: true },
    ],
    // Luz fixa do set (STUDIO), profundidade de campo nos takes de perto e obturador por
    // trecho; a cena sai do preto no começo e volta ao preto no fim (assinatura JFA).
    light: {
      base: 'feature',
      keys: [
        [0, { ...STUDIO, exposure: 0 }],
        [0.6, { exposure: STUDIO.exposure }],
        [31.4, { exposure: STUDIO.exposure }],
        [32.3, { exposure: 0 }],
        [2.4, WIDE],
        [2.8, MACRO],
        [3.95, MACRO],
        [4.3, WIDE],
        [4.95, MACRO],
        [6.45, MACRO],
        [6.8, WIDE],
        [7.6, MACRO],
        [9.2, MACRO],
        [9.55, WIDE],
        [10.55, WIDE],
        [10.85, MACRO],
        [12.5, MACRO],
        [12.95, WIDE],
        // Rastro de velocidade só nos deslocamentos entre os takes.
        [1.55, TAKE],
        [1.75, RUSH],
        [2.15, RUSH],
        [2.4, TAKE],
        [4.15, TAKE],
        [4.3, RUSH],
        [4.7, RUSH],
        [4.9, TAKE],
        [6.6, TAKE],
        [6.75, RUSH],
        [7.4, RUSH],
        [7.6, TAKE],
        [9.35, TAKE],
        [9.5, RUSH],
        [10.4, RUSH],
        [10.65, TAKE],
        [12.65, TAKE],
        [12.8, RUSH],
        [13.6, RUSH],
        [14.1, TAKE],
      ],
    },
  },
];

// 03 · cards Liquid Glass (a única cena técnica): uma coluna centrada no quadro, um card em
// cima do outro, com textos centrados. A coluna fica logo atrás da bateria, no eixo da vista
// (por isso fica no meio do quadro a cena toda), e o primeiro card desce até a bateria
// cobrir o pé dele (efeito 3D). Vidro de verdade no espaço 3D (desfoque do que está atrás,
// reflexo e borda fina), virado para onde a câmera passa na cena; cada card entra subindo de
// leve, de baixo para cima, ficam ~1 s e somem antes da explodida.
const COL = [-0.7, -1.87];
const label = (text) => ({
  align: 'center',
  y: 0.33,
  parts: [{ text, weight: 500, size: 0.1, alpha: 0.6, tracking: 0.12 }],
});
const value = (num, unit, size = 0.42) => ({
  align: 'center',
  y: 0.74,
  parts: [
    { text: num, weight: 600, size },
    { text: unit, weight: 300, size, alpha: 0.85 },
  ],
});
const card = (id, t, y, lines, extra = {}) => ({
  id,
  t,
  pos: [COL[0], y, COL[1]],
  w: 2.2,
  h: 1.1,
  rise: 0.1,
  inDur: 0.9,
  lines,
  ...extra,
});
export const GLASS = [
  card('tensao', [14.6, 17.05], 2.7, [label('TENSÃO NOMINAL'), value('12', 'V')]),
  card('capacidade', [14.85, 17.0], 3.98, [label('CAPACIDADE'), value('280', 'Ah')]),
  card('energia', [15.1, 16.95], 5.26, [label('ENERGIA'), value('3,58', ' kWh', 0.42)]),
  card(
    'quimica',
    [15.35, 16.9],
    6.21,
    [
      {
        align: 'center',
        y: 0.66,
        parts: [
          { text: 'CÉLULAS', weight: 400, size: 0.3, alpha: 0.7, tracking: 0.14, gap: 0.12 },
          { text: 'LiFePO', weight: 600, size: 0.38 },
          { text: '4', weight: 600, size: 0.38, sub: true },
        ],
      },
    ],
    { w: 1.9, h: 0.44, radius: 0.22, depth: 0.04 },
  ),
];

// Títulos em 2D por cima da imagem, na linguagem de filme de produto: poucos, centrados,
// tipografia limpa (Poppins semibold e light, cinza claro no secundário), entrando com fusão,
// subida curta e desfoque que se resolve; saindo com fusão. Nada de texto em 3D.
const SUB = '#b8bcc5';
export const TITLES = [
  // 05 · hero: a mensagem acima da bateria enquanto a câmera se aproxima; o número rola como
  // um contador, 1 → 2 → 3, parando um instante em cada um.
  {
    id: 'hero-1',
    t: [24.95, 27.0],
    y: 22.5,
    rollAt: [25.35, 0.9],
    parts: [
      { text: '3', roll: ['1', '2', '3'], weight: 600, size: 0.046 },
      { text: 'X mais energia', weight: 600, size: 0.046 },
    ],
  },
  {
    id: 'hero-2',
    t: [25.3, 27.05],
    y: 27.2,
    parts: [{ text: 'para o seu projeto', weight: 300, size: 0.024, color: SUB, tracking: 0.01 }],
  },
  // 06 · final: nome, especificações e chamada; somem junto com a cena.
  {
    id: 'final-nome',
    t: [28.15, 31.4],
    outDur: 0.8,
    y: 21.5,
    parts: [{ text: 'E-LÍTIO PRO', weight: 600, size: 0.05 }],
  },
  {
    id: 'final-specs',
    t: [28.55, 31.4],
    outDur: 0.8,
    y: 26.4,
    parts: [{ text: '12V  ·  280Ah  ·  3,58 kWh', weight: 300, size: 0.021, color: SUB, tracking: 0.02 }],
  },
  {
    id: 'final-cta',
    t: [29.35, 31.4],
    outDur: 0.8,
    y: 72.5,
    pill: true,
    parts: [{ text: 'Já disponível', weight: 500, size: 0.02, tracking: 0.02 }],
  },
  // 07 · assinatura: com a cena já no preto, o logo JFA (arquivo do cliente) aparece no centro.
  {
    id: 'assinatura',
    t: [31.95, 99],
    inDur: 1.3,
    y: 50,
    image: '/images/jfa_logo_white.webp',
    size: 0.05,
    rise: 0.004,
  },
];

// 04 · explodida: o nome de cada peça ligado por uma linha fina ao ponto da peça (que sobe
// com ela), alternando os lados; entram de cima para baixo depois que a estrutura abre e
// somem antes de ela fechar.
const callout = (id, k, layer, anchor, side, text) => ({
  id,
  t: [OPEN + 0.7 + k * 0.14, CLOSE - 0.4],
  layer,
  anchor,
  side,
  text,
});

// Vista explodida (unidades de 10 cm): a tampa sobe inteira (com display, botão, anéis,
// arruelas e parafusos); por dentro, BMS, barramentos, suporte e células se separam na
// vertical, alinhados. Abre de cima para baixo; fecha de baixo para cima depois que a
// câmera fica em 3/4 de fora, e a tampa assenta por último (clique em ~24,15).
const OPEN = 17.4;
const CLOSE = 23.2;
const layer = (lift, k) => [
  [OPEN + (4 - k) * 0.12, 0],
  [OPEN + 1.3 + (4 - k) * 0.12, lift, 'soft'],
  [CLOSE + k * 0.07, lift],
  [CLOSE + 0.9 + k * 0.07, 0, 'easeIn'],
];
// Uns 4 cm entre uma camada e outra.
const LID = layer(4.1, 4);
export const EXPLODE = {
  cells: layer(2.3, 0),
  holder: layer(2.75, 1),
  bus: layer(3.13, 2),
  bms: layer(3.53, 3),
  lid: LID,
  rings: LID,
  button: LID,
  panel: LID,
  washers: LID,
  bolts: LID,
};

export const CALLOUTS = [
  callout('tampa', 0, 'lid', [2.38, 2.2, 0.3], 'right', 'Tampa'),
  callout('bms', 1, 'bms', [-0.85, 2.03, 0.2], 'left', 'BMS'),
  callout('barramentos', 2, 'bus', [1.2, 1.96, 0.52], 'right', 'Barramentos'),
  callout('suporte', 3, 'holder', [-1.52, 1.89, 0.4], 'left', 'Suporte'),
  callout('celulas', 4, 'cells', [1.53, 1.2, 0.6], 'right', 'Células LiFePO₄'),
  callout('caixa', 5, null, [-2.23, 1.0, 0.7], 'left', 'Caixa'),
];

// Câmera virtual (move os planos de texto, que ainda não existem): parada.
export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: 33.9, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
];

export const WORDS = [];
export const GRAPHICS = [];
// O estúdio é 3D (ciclorama); o fundo da página fica preto por trás.
export const BACKGROUND = [[0, 'void']];
export const BLOCKS = [];
export const CUTS = [];
export const FX = [];

export const CUES = [
  { t: 0, id: 'abertura', label: 'Sai do preto / ambiente grave', until: 2.1 },
  { t: 2.1, id: 'revelacao', label: 'Voo em volta (whooshes nos deslocamentos)', until: 13.6 },
  { t: 2.5, id: 'logotipo', label: 'Adesivo frontal', until: 4.05 },
  { t: 4.95, id: 'superior', label: 'Adesivo de cima', until: 6.55 },
  { t: 7.7, id: 'traseiro', label: 'Adesivo traseiro', until: 9.3 },
  { t: 10.8, id: 'display', label: 'Painel (display aceso)', until: 12.4 },
  { t: 12.8, id: 'recuo', label: 'Recuo (proporções)' },
  { t: 17.4, id: 'explodida', label: 'Peças se separam (nomes das peças)', until: 23.2 },
  { t: 24.4, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 27.1, id: 'final', label: 'Afastamento final', until: 31.9 },
  { t: 31.9, id: 'assinatura', label: 'Fade out + logo JFA', until: 33.9 },
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
  glass: GLASS,
  titles: TITLES,
  callouts: CALLOUTS,
};
