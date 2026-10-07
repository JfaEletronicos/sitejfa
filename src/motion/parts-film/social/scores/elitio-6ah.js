/**
 * E-LÍTIO PRO 12,8V 6Ah (?variant=elitio-6ah · 9:16 · 12 s): só o elemento 3D, para revisão
 * do modelo (sem texto). A câmera dá uma volta lenta em volta da bateria, no estúdio escuro do
 * filme da 280Ah. Modelo provisório feito a partir das fotos (tools/motion/build-elitio-6ah.mjs),
 * em unidades de 10 cm (151 × 65 × 94 mm), base no chão, frente para +z, terminais em -x.
 */
export const META = {
  id: 'elitio-6ah',
  title: 'E-LÍTIO PRO 12,8V 6Ah (modelo 3D)',
  duration: 12,
  stillTime: 1.2,
  format: '9x16',
  shutter: 1 / 30,
};

export const SCENES = [{ id: 'cena-01', label: '01 Volta', start: 0, end: 12 }];
export const SPACES = { 1: { yaw: 0 } };

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

// Volta lenta: raio de ~5,6 (56 cm), altura variando de leve, olhar no centro da caixa.
const C = [0, 0.48, 0];
const orbit = (t, az, el, r) => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return {
    t,
    pos: [C[0] + Math.sin(a) * Math.cos(e) * r, C[1] + Math.sin(e) * r, C[2] + Math.cos(a) * Math.cos(e) * r],
    look: C,
  };
};
export const SHOTS = [
  {
    t: [0, 12],
    flight: true,
    keys: Array.from({ length: 13 }, (_, k) =>
      orbit(k, -40 + k * 30, 22 + 8 * Math.sin(k * 0.9), 5.6 - 0.5 * Math.sin(k * 0.6)),
    ),
    light: { base: 'feature', keys: [[0, STUDIO]] },
  },
];

export const TITLES = [];
export const GLASS = [];
export const EXPLODE = {};
export const CALLOUTS = [];
export const CAMERA_RIG = [
  { t: 0, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0] },
  { t: 12, yaw: 0, pitch: 0, dolly: 0, truck: [0, 0], rest: true },
];
export const WORDS = [];
export const GRAPHICS = [];
export const BACKGROUND = [[0, 'void']];
export const BLOCKS = [];
export const CUTS = [];
export const FX = [];
export const CUES = [];

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
