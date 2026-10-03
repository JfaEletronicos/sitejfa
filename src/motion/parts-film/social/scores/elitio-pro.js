/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16 · 29,45 s): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro, em UM plano contínuo (sem cortes e sem
 * paradas: a câmera só para no último quadro), em voo livre como um pássaro (6DoF: posição
 * e olhar independentes, curvas suaves e inclinadas), alternando trechos lentos e rápidos e
 * girando sempre para o mesmo lado em volta da bateria (sem ir e voltar).
 * A bateria nunca se move; a vista explodida é a única exceção. Estúdio branco em 3D
 * (ciclorama iluminado pelas luzes do set, piso brilhante com reflexo), luz e reflexos
 * presos ao mundo (studio: 'white' no palco) e motion blur de câmera real só quando a
 * imagem anda rápido (meta.shutter), com o obturador bem aberto nos deslocamentos entre os
 * takes (rastro de alta velocidade; `shutter` nas marcações de luz).
 * Modelo do CAD original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 * Nesta etapa não entram textos, cards, trilha nem efeitos de motion: só cenário, luz,
 * produto e câmera (pedido do cliente, que vale acima do checklist geral da skill).
 *
 *   01 silhueta (0–4,2): estúdio apagado; a luz de fundo acende o chão e a parede atrás
 *      (silhueta), depois contraluz e luz de cima; termina todo claro. Deriva lenta.
 *   02 revelação (4,2–15,35): voo livre em volta do produto, sempre para o mesmo lado:
 *      fly-by no logotipo, borne positivo (macro, devagar), mergulho na ponta, traseira
 *      (ficha), outra ponta e o painel com o display aceso, de cima (no fim da volta);
 *      fecha a volta recuando rápido.
 *   03 cards (15,35–17,95): 3/4 alto e controlado, deriva lenta.
 *   04 vista explodida (17,95–22,75): a tampa sobe inteira e BMS, barramentos, suporte e
 *      células se separam na vertical; a câmera fica em 3/4 lento, de fora, e a bateria se
 *      recompõe (clique em ~22,65).
 *   05 hero (22,75–25,45): aproximação lenta e baixa em 3/4, espaço acima para a mensagem.
 *   06 final (25,45–29,45): afastamento lento, muito espaço negativo.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 29.45,
  stillTime: 29.35,
  format: '9x16',
  // Obturador de 1/30 s: motion blur forte só quando a imagem anda rápido.
  shutter: 1 / 30,
};

export const SCENES = [
  { id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.2 },
  { id: 'cena-02', label: '02 Revelação', start: 4.2, end: 15.35 },
  { id: 'cena-03', label: '03 Cards', start: 15.35, end: 17.95 },
  { id: 'cena-04', label: '04 Explodida', start: 17.95, end: 22.75 },
  { id: 'cena-05', label: '05 Hero', start: 22.75, end: 25.45 },
  { id: 'cena-06', label: '06 Final', start: 25.45, end: 29.45 },
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

// Estúdio branco com luz natural e baixa (referência: vídeo da hero da home): uma janela
// grande e fixa em 3/4 à esquerda (luz suave, sombra macia), contraluz, rebatimento das
// paredes e a queda para o fundo em meia-luz. Nos takes de perto, feixes de sol (SHAFTS).
// Nenhuma luz anda (num plano sem cortes, luz trocando de lugar aparece); só acendem e
// apagam devagar, fora da vista ou durante os deslocamentos. Foco raso.
const STUDIO = {
  keyLux: 0.6,
  keyAz: -35,
  keyEl: 30,
  keyAngle: 30,
  rimLux: 1.5,
  rimAz: 200,
  fill: 0.07,
  env: 0.38,
  wash: 0.14,
  contact: 0.9,
  floorReflect: 0.4,
  aperture: 1.0,
  bloom: 0,
  sweep: 15,
  exposure: 1.0,
};
// Profundidade de campo nos closes (foco no alvo da câmera).
const MACRO = { aperture: 3.0 };
const WIDE = { aperture: STUDIO.aperture };
// Obturador: normal nos takes (nítidos) e bem aberto nos deslocamentos de um ponto a
// outro, para o rastro de alta velocidade (o motion blur só aparece onde a imagem anda).
const TAKE = { shutter: 1 / 30 };
const RUSH = { shutter: 1 / 10 };

// UM plano contínuo em voo livre (6DoF), como um pássaro em volta da bateria: posição e
// olhar com trajetórias próprias, caminho sem laços e curvas inclinadas pela aceleração
// lateral, sem tremida. A velocidade de cada trecho vem do espaçamento entre marcações e
// muda aos poucos (nunca volta nem passa do ponto); `stop` assenta a câmera antes de ela
// mudar de sentido. O ângulo em volta da bateria só cresce (nunca vai e volta). Unidades
// de 10 cm.
export const SHOTS = [
  {
    t: [0, 29.45],
    flight: true,
    keys: [
      // 01 · silhueta: deriva lenta, baixa, bateria levemente fora do centro.
      { t: 0, pos: [-7.5, 1.0, 17.5], look: [0.5, 1.15, 0] },
      { t: 2.2, pos: [-6.3, 1.3, 15.0], look: [0.35, 1.18, 0] },
      { t: 4.0, pos: [-4.6, 1.55, 12.3], look: [0.15, 1.2, 0] },
      // 02 · revelação: mergulho e fly-by rente ao logotipo...
      { t: 4.95, pos: [-1.2, 0.8, 4.8], look: [0.3, 1.2, 0.86] },
      { t: 5.5, pos: [0.9, 1.05, 3.5], look: [0.1, 1.3, 0.86] },
      // ...quase parada para ler...
      { t: 6.0, pos: [1.6, 1.4, 3.6], look: [0.0, 1.32, 0.86], lens: 0.95 },
      { t: 6.4, pos: [1.9, 1.6, 3.7], look: [0.2, 1.35, 0.86], lens: 0.95 },
      // ...sobe pela quina da frente até o borne positivo e fica nele, devagar (macro)...
      // (lente mais fechada e um pouco mais longe: o giro em volta do borne fica lento).
      { t: 7.2, pos: [3.3, 3.7, 1.6], look: [1.7, 2.35, -0.35], lens: 0.85 },
      { t: 7.9, pos: [3.55, 3.9, 0.45], look: [1.85, 2.45, -0.55], lens: 0.72 },
      { t: 8.9, pos: [3.75, 3.75, -0.3], look: [1.85, 2.42, -0.55], lens: 0.72 },
      // ...mergulha na ponta (orelha e alça)...
      { t: 9.5, pos: [4.4, 1.7, -1.5], look: [2.3, 1.0, 0] },
      { t: 9.95, pos: [4.1, 1.2, -2.3], look: [2.3, 1.0, 0] },
      // ...fly-by pela traseira (ficha técnica), olhando para trás enquanto avança...
      { t: 10.6, pos: [2.4, 1.25, -3.4], look: [1.7, 1.0, -0.86] },
      // ...contorna a outra ponta subindo aos poucos e chega por cima ao painel (display
      // aceso), desacelerando até pairar, com o foco nele...
      { t: 11.15, pos: [0.4, 1.5, -3.9], look: [0.6, 1.05, -0.86] },
      { t: 11.8, pos: [-3.3, 2.7, -3.0], look: [-1.3, 1.5, -0.5] },
      { t: 12.45, pos: [-3.4, 4.6, -0.2], look: [-0.5, 2.3, -0.35], lens: 0.65 },
      { t: 12.85, pos: [-2.45, 5.15, 0.9], look: [-0.15, 2.42, -0.36], lens: 0.57 },
      { t: 13.1, pos: [-2.1, 5.26, 1.29], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 13.65, pos: [-1.97, 5.27, 1.42], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 14.2, pos: [-1.84, 5.27, 1.55], look: [-0.08, 2.44, -0.36], lens: 0.55 },
      { t: 14.5, pos: [-1.6, 5.22, 1.88], look: [-0.06, 2.3, -0.3], lens: 0.6 },
      // ...e fecha a volta recuando numa espiral que abre e sobe (proporções)...
      { t: 15.0, pos: [-0.75, 4.75, 5.3], look: [0, 1.7, 0] },
      { t: 15.6, pos: [1.2, 4.8, 10.4], look: [0, 1.35, 0] },
      // 03 · cards: a espiral perde velocidade no 3/4 alto, deriva lenta.
      { t: 16.75, pos: [6.33, 5.5, 17.38], look: [0, 1.35, 0] },
      // 04 · explodida: 3/4 lento, de fora, fechando devagar em volta; o olhar sobe com a
      // estrutura aberta, fica na leitura e desce quando ela se fecha.
      { t: 17.95, pos: [9.2, 5.9, 17.3], look: [0, 2.4, 0] },
      { t: 19.75, pos: [9.79, 5.65, 14.5], look: [0, 3.2, 0] },
      { t: 21.45, pos: [9.94, 5.4, 12.28], look: [0, 3.1, 0] },
      { t: 22.75, pos: [9.9, 4.3, 11.0], look: [0, 1.6, 0] },
      // 05 · hero: aproximação lenta e baixa em 3/4 (espaço acima para a mensagem), que
      // assenta antes de recuar.
      { t: 24.15, pos: [8.67, 1.25, 9.14], look: [0.2, 1.3, 0], shift: [0, -0.12] },
      { t: 25.45, pos: [7.0, 0.95, 7.27], look: [0.1, 1.25, 0], shift: [0, -0.08], stop: true },
      // 06 · final: afastamento lento, subindo, muito espaço negativo.
      { t: 29.45, pos: [20, 7, 18], look: [0, 1.2, 0], rest: true },
    ],
    // Luz presa ao set: primeiro a luz de fundo (silhueta), depois contraluz e luz de cima,
    // e o estúdio inteiro aceso a partir de 4,2 s. Profundidade de campo nos closes.
    light: {
      base: 'feature',
      keys: [
        [
          0,
          {
            ...STUDIO,
            keyLux: 0,
            rimLux: 0,
            fill: 0,
            env: 0,
            wash: 0,
            contact: 0,
            floorReflect: 0,
          },
        ],
        [0.4, { wash: 0 }],
        // Primeiro o fundo (silhueta); depois as arestas e a luz de cima.
        [1.8, { wash: 0.3, rimLux: 0, keyLux: 0, env: 0, fill: 0, contact: 0.3 }],
        [3.0, { rimLux: 1.4, keyLux: 0.25, env: 0.3, contact: 0.7, fill: 0.03, floorReflect: 0.25 }],
        [4.2, { ...STUDIO }],
        // Nos takes de perto a janela baixa um pouco (os feixes de sol mandam, SHAFTS); no
        // recuo depois do display ela volta.
        [5.2, { keyLux: 0.6 }],
        [6.2, { keyLux: 0.42 }],
        [14.5, { keyLux: 0.42 }],
        [15.8, { keyLux: 0.6 }],
        [5.3, WIDE],
        [6.0, MACRO],
        [6.6, WIDE],
        [7.85, MACRO],
        [8.95, MACRO],
        [9.45, WIDE],
        [12.3, WIDE],
        [13.05, MACRO],
        [14.3, MACRO],
        [14.85, WIDE],
        // Rastro de velocidade entre os takes: mergulho até o logotipo, logotipo → borne,
        // borne → ponta → traseira → outra ponta → display, e o recuo depois do display.
        [3.7, TAKE],
        [4.25, RUSH],
        [5.4, RUSH],
        [5.85, TAKE],
        [6.35, TAKE],
        [6.7, RUSH],
        [7.3, RUSH],
        [7.7, TAKE],
        [8.6, TAKE],
        [8.95, RUSH],
        [12.55, RUSH],
        [13.0, TAKE],
        [14.2, TAKE],
        [14.5, RUSH],
        [15.4, RUSH],
        [16.0, TAKE],
      ],
    },
  },
];

// Feixes de sol dos takes de perto: um por take, cada um PARADO no seu lugar (fonte longe,
// raios quase paralelos, borda macia, névoa e poeira dentro), entrando de cima por um lado
// em que a câmera o veja atravessar o quadro. Acende antes de a câmera chegar (t[0]→t[1],
// enquanto o ponto ainda está fora do quadro ou no deslocamento) e apaga depois que ela sai
// (t[2]→t[3]); a luz nunca muda de lugar na frente da câmera. Névoa leve (`haze`): no close
// a câmera olha através do feixe, e névoa forte vira véu.
export const SHAFTS = [
  // Logotipo (acende junto com o estúdio, ainda de longe).
  { t: [3.4, 4.6, 6.5, 7.3], aim: [0.0, 1.4, 0.86], az: 25, el: 55, radius: 0.75 },
  // Borne positivo (acende enquanto a câmera está no logotipo, fora do quadro).
  { t: [5.9, 6.9, 9.0, 9.8], aim: [1.85, 2.42, -0.55], az: -130, el: 58, radius: 0.7 },
  // Ponta direita: orelha e alça (acende enquanto a câmera está no borne).
  { t: [7.9, 8.8, 10.2, 11.0], aim: [2.38, 1.2, 0.1], az: 60, el: 50, radius: 0.8, lux: 2.2 },
  // Traseira: ficha técnica (acende enquanto a câmera está na ponta direita).
  { t: [9.8, 10.4, 11.5, 12.2], aim: [1.0, 1.1, -0.86], az: -160, el: 48, radius: 0.9 },
  // Display (acende enquanto a câmera passa pela traseira).
  { t: [11.0, 12.1, 14.4, 15.3], aim: [-0.08, 2.44, -0.36], az: 125, el: 60, radius: 0.65 },
];

// Vista explodida (unidades de 10 cm): a tampa sobe inteira (com display, botão, anéis,
// arruelas e parafusos); por dentro, BMS, barramentos, suporte e células se separam na
// vertical, alinhados. Abre de cima para baixo; fecha de baixo para cima depois que a
// câmera fica em 3/4 de fora, e a tampa assenta por último (clique em ~22,65).
const OPEN = 17.95;
const CLOSE = 21.45;
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

// Câmera virtual (move os planos de texto, que ainda não existem): parada.
export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: 29.45, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
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
  { t: 4.2, id: 'revelacao', label: 'Voo em volta (whooshes)', until: 15.35 },
  { t: 7.9, id: 'borne', label: 'Borne positivo (macro)', until: 8.9 },
  { t: 13.1, id: 'display', label: 'Painel (display aceso)', until: 14.2 },
  { t: 14.5, id: 'recuo', label: 'Recuo (proporções)' },
  { t: 17.95, id: 'explodida', label: 'Peças se separam', until: 19.75 },
  { t: 22.65, id: 'clique', label: 'Clique (bateria fecha)' },
  { t: 25.45, id: 'final', label: 'Afastamento final', until: 29.45 },
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
  shafts: SHAFTS,
};
