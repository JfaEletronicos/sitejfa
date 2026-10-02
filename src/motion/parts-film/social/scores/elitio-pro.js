/**
 * E-LÍTIO PRO 12V 280Ah (?variant=elitio-pro · 9:16): comercial premium em que a bateria
 * nunca se move; o dinamismo vem só da câmera, da luz e da composição. Modelo do CAD
 * original da caixa (public/models/elitio-pro.glb, montado por
 * tools/motion/build-elitio-pro.mjs), em pé, em unidades de 10 cm (475 × 240 × 170 mm).
 *
 * Feito cena por cena (aprovação antes da próxima). Pedido do cliente para este filme,
 * que vale acima do checklist geral da skill: se algo pode ser comunicado visualmente,
 * não entra texto.
 *
 *   cena 01 · silhueta (0–3 s): estúdio preto, sem texto e sem efeitos. A câmera flutua
 *     devagar; uma luz muito suave revela primeiro o contorno, depois bordas e pequenos
 *     reflexos; no fim a luz sobe um pouco e a silhueta inteira fica reconhecível.
 *     Curiosidade → tensão → desejo de ver o produto.
 */
export const META = {
  id: 'elitio-pro',
  title: 'E-LÍTIO PRO 12V 280Ah',
  duration: 3,
  stillTime: 2.9,
  format: '9x16',
};

export const SCENES = [{ id: 'cena-01', label: '01 Silhueta', start: 0, end: 3 }];

// Pontos do modelo (unidades de 10 cm; base no chão, frente para +z).
export const BATERIA = {
  CENTER: [0, 1.2, 0],
  TOP: [0, 2.4, 0],
};

export const SPACES = {
  1: { yaw: 0 },
};

// A bateria fica parada (rot sempre zero): só a câmera anda.
export const SHOTS = [
  {
    t: [0, 3],
    keys: [
      // Começa perto e baixo, no escuro: ainda não se vê nada.
      { t: 0, target: [0.2, 1.1, 0], az: -60, el: 4, dist: 16.2 },
      { t: 1.5, target: [0.1, 1.16, 0], az: -51, el: 7.5, dist: 17.4 },
      // Termina no enquadramento que a cena 02 corta para o estúdio branco.
      { t: 3, target: BATERIA.CENTER, az: -42, el: 10.5, dist: 18.4, rest: true },
    ],
    // Só contraluz e o reflexo da faixa de luz atrás do produto (env): primeiro o contorno,
    // depois bordas e pequenos reflexos; no fim a luz principal sobe um pouco.
    light: {
      base: 'feature',
      keys: [
        [0, { keyLux: 0, env: 0, fill: 0, rimLux: 0, bloom: 0, exposure: 1, sweep: 34 }],
        [0.35, { rimLux: 0, env: 0 }],
        [1.2, { rimLux: 0.55, env: 0.05, sweep: 22 }],
        [2.0, { rimLux: 1.0, env: 0.08, keyLux: 0, sweep: 10 }],
        [2.75, { rimLux: 1.35, env: 0.12, keyLux: 0.55, fill: 0.02, bloom: 0.015, sweep: 0 }],
        [3, { rimLux: 1.4, env: 0.13, keyLux: 0.65, sweep: -2 }],
      ],
    },
  },
];

// Câmera virtual: só a flutuação lenta (sem velocidade aparente).
export const CAMERA_RIG = [
  { t: 0, yaw: -2.5, pitch: 1.5, dolly: 0, truck: [0, 0] },
  { t: 1.6, yaw: 0, pitch: 0.5, dolly: 0.015, truck: [0, 0] },
  { t: 3, yaw: 1.2, pitch: 0, dolly: 0.025, truck: [0, 0], rest: true },
];

// Sem texto nesta cena (pedido do cliente).
export const WORDS = [];

export const GRAPHICS = [];

// Preto absoluto e, aos poucos, um halo grafite muito tênue atrás da bateria.
export const BACKGROUND = [
  [0, 'void'],
  [0.6, 'smoke', 2.2],
];

export const BLOCKS = [];
export const CUTS = [];
export const FX = [];

export const CUES = [
  { t: 0, id: 'silencio', label: 'Silêncio / ambiente grave', until: 1.2 },
  { t: 1.2, id: 'contorno', label: 'Contorno aparece (respiro)', until: 2.75 },
  { t: 2.75, id: 'silhueta', label: 'Silhueta reconhecível (tensão)' },
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
