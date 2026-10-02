/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16): base 3D cinematográfica do
 * lançamento, com linguagem de comercial de carro. A bateria nunca se move (só a câmera e a
 * luz); estúdio branco minimalista, luz e reflexos presos ao mundo (studio: 'white' no palco).
 * Modelo do CAD original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 * Nesta etapa não entram textos, cards, trilha nem efeitos de motion: só cenário, luz,
 * produto e câmera (pedido do cliente, que vale acima do checklist geral da skill).
 * Feito cena por cena, com aprovação antes da próxima.
 *
 *   01 · silhueta (0–4,5 s): estúdio branco ainda apagado. A luz chega primeiro ao fundo
 *     (a bateria é só silhueta), depois às bordas e a alguns reflexos. A câmera se aproxima
 *     devagar, como um dolly; a cena termina com a frente ainda na penumbra.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 4.5,
  stillTime: 4.4,
  format: '9x16',
};

export const SCENES = [{ id: 'cena-01', label: '01 Silhueta', start: 0, end: 4.5 }];

// Pontos do modelo (unidades de 10 cm; base no chão, frente para +z).
export const BATERIA = {
  CENTER: [0, 1.2, 0],
};

export const SPACES = {
  1: { yaw: 0 },
};

// A bateria fica parada (rot sempre zero): só a câmera anda.
export const SHOTS = [
  {
    t: [0, 4.5],
    // Dolly lento, baixo e quase frontal; a velocidade cai um pouco no fim, sem parar.
    keys: [
      { t: 0, target: [0, 1.12, 0], az: -24, el: 5, dist: 19.5 },
      { t: 2.2, target: [0, 1.15, 0], az: -22.5, el: 6.2, dist: 17.1 },
      { t: 4.5, target: BATERIA.CENTER, az: -21, el: 7.2, dist: 15.4 },
    ],
    // Luz: só a sombra de contato (o fundo claro chega antes, pela cor de fundo), depois o
    // contraluz desenha as bordas e o ambiente acende alguns reflexos; a luz principal, alta
    // e de lado, mal alcança a frente (penumbra no fim).
    light: {
      base: 'feature',
      keys: [
        [
          0,
          {
            keyLux: 0,
            keyAz: -35,
            keyEl: 70,
            keyAngle: 38,
            rimLux: 0,
            rimAz: 200,
            fill: 0,
            env: 0,
            floor: 0,
            contact: 0,
            bloom: 0,
            sweep: 15,
            exposure: 1,
          },
        ],
        [0.5, { contact: 0, env: 0 }],
        [1.5, { contact: 0.35, rimLux: 0.3, env: 0.015 }],
        [2.5, { contact: 0.55, rimLux: 1.1, env: 0.07, keyLux: 0.03 }],
        [3.5, { contact: 0.65, rimLux: 1.8, env: 0.15, keyLux: 0.08, fill: 0.02, floor: 0.08 }],
        [4.5, { contact: 0.7, rimLux: 2.2, env: 0.22, keyLux: 0.12, fill: 0.03, floor: 0.12 }],
      ],
    },
  },
];

// Câmera virtual: quase parada (um respiro mínimo, como câmera num dolly de verdade).
export const CAMERA_RIG = [
  { t: 0, yaw: -0.4, pitch: 0.2, dolly: 0, truck: [0, 0] },
  { t: 4.5, yaw: 0.4, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
];

export const WORDS = [];
export const GRAPHICS = [];

// O estúdio branco acende devagar a partir do preto: primeiro o fundo (silhueta), e a
// cena termina ainda na meia-luz.
export const BACKGROUND = [
  [0, 'void'],
  [0.3, '#34373c', 4.2],
];

export const BLOCKS = [];
export const CUTS = [];
export const FX = [];

export const CUES = [
  { t: 0, id: 'escuro', label: 'Escuro / ambiente grave', until: 1.5 },
  { t: 1.5, id: 'silhueta', label: 'Silhueta (respiro)', until: 3.5 },
  { t: 3.5, id: 'detalhes', label: 'Bordas e reflexos (tensão)' },
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
};
