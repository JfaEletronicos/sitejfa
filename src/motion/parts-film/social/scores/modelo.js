/**
 * ROTEIRO-MODELO (?variant=modelo · 9:16 · 4,6 s): ponto de partida de todo motion novo
 * do mesmo estilo. Copie este arquivo para scores/<nome>.js, troque meta.id e registre
 * em main.js (VARIANTS). As regras de estilo e o fluxo de trabalho estão em
 * .claude/skills/motion/SKILL.md; a referência de cada campo, em referencia.md.
 *
 * Duas cenas mostram o que o motor faz, no padrão aprovado:
 *   cena 1 (escura): placa revelada do preto, bloco de texto colado à esquerda com fontes
 *     variadas, palavra que troca de fonte, ponte em itálico ("e...") e texto gigante de
 *     fundo com letra esticada à moda da Stretch Pro, cobrindo a tela
 *   passagem: a câmera gira de lado em volta da placa e entra entre os planos de texto
 *     (um universo só); o fundo clareia devagar
 *   cena 2 (clara): bloco de texto com uma letra que estica, texto de fundo que estica de
 *     cima para baixo durante a cena e trilha de circuito revelada por máscara, atrás da placa
 */
import { word, fontCycle, PLACA } from '../kit';

export const META = {
  id: 'modelo',
  title: 'Modelo de motion JFA Parts',
  duration: 4.6,
  stillTime: 4.2,
  format: '9x16',
};

export const SCENES = [
  { id: 'cena-1', label: 'Cena 1', start: 0, end: 2.15 },
  { id: 'cena-2', label: 'Cena 2', start: 2.15, end: 4.6 },
];

// Um espaço por cena: ângulo (yaw) dos planos de texto em volta da placa. A câmera
// virtual chega a esse ângulo quando a cena está de frente.
export const SPACES = {
  1: { yaw: 0 },
  2: { yaw: 52 },
};

// Placa: um plano contínuo para as duas cenas (marcações com velocidade contínua). Ela é o
// foco: centralizada e grande. A luz começa apagada (só o contraluz) e revela a placa.
export const SHOTS = [
  {
    t: [0, 4.6],
    keys: [
      {
        t: 0,
        target: PLACA.CENTER,
        az: -24,
        el: 43,
        dist: 3.75,
        roll: 35,
        shift: [0, -0.27],
        rot: [8, 0, 0],
      },
      {
        t: 0.55,
        target: PLACA.CENTER,
        az: -20.5,
        el: 45,
        dist: 3.48,
        roll: 38,
        shift: [0, -0.19],
        rot: [4, 0, 0],
      },
      {
        t: 1.0,
        target: PLACA.CENTER,
        az: -18,
        el: 46,
        dist: 3.4,
        roll: 39,
        shift: [0, -0.17],
        rot: [3, 0, 0],
      },
      { t: 1.95, target: PLACA.CENTER, az: -13, el: 48, dist: 3.05, roll: 41, shift: [0, -0.14] },
      { t: 2.7, target: PLACA.CENTER, az: -12, el: 52, dist: 3.5, roll: 30, shift: [0.07, -0.14] },
      {
        t: 4.6,
        target: PLACA.CENTER,
        az: -8,
        el: 54,
        dist: 3.2,
        roll: 27,
        shift: [0.07, -0.12],
        rot: [-2, 0, 0],
      },
    ],
    light: {
      base: 'feature',
      keys: [
        [
          0,
          { keyLux: 0, env: 0, fill: 0, rimLux: 0.45, keyAngle: 7, keyLead: -1.45, bloom: 0.02, sweep: 70 },
        ],
        [0.4, { keyLux: 2.6, keyAngle: 10, keyLead: -1.05, env: 0.02 }],
        [0.95, { keyLux: 6, keyAngle: 20, keyLead: -0.45, env: 0.16, fill: 0.05, sweep: 30 }],
        [
          1.5,
          {
            keyLux: 8,
            keyAngle: 32,
            keyLead: 0,
            env: 0.38,
            fill: 0.12,
            rimLux: 2.0,
            bloom: 0.04,
            sweep: -10,
          },
        ],
        [2.3, { keyLux: 8, fill: 0.12, env: 0.38, sweep: -40, exposure: 1.02 }],
        [3.0, { keyLux: 8.4, fill: 0.24, env: 0.5, rimLux: 2.0, bloom: 0.02, sweep: 40, exposure: 1.04 }],
        [4.6, { sweep: -30 }],
      ],
    },
  },
];

// Câmera virtual (move a placa e os planos de texto juntos). A passagem entre cenas é a
// órbita de lado, que desacelera sem voltar.
export const CAMERA_RIG = [
  { t: -0.2, yaw: -11, pitch: 6, dolly: 0, truck: [0.02, 0] },
  { t: 1.0, yaw: -1.5, pitch: 1.5, dolly: 0.07, truck: [0, 0] },
  { t: 1.75, yaw: 6, pitch: -2.5, dolly: 0.1, truck: [0, 0] },
  { t: 2.18, yaw: 27, pitch: -1, dolly: 0.2, truck: [0, 0] },
  { t: 2.65, yaw: 44.5, pitch: 1.5, dolly: 0.1, truck: [0, 0] },
  { t: 3.2, yaw: 51.5, pitch: 1, dolly: 0.08, truck: [0, 0] },
  { t: 4.6, yaw: 55, pitch: 0, dolly: 0.13, truck: [0, 0], rest: true },
];

export const WORDS = [
  // CENA 1 · fundo: texto gigante cobrindo a tela, letra dobrada esticada (UU) e altura
  // pelo estiramento da fonte. Palavras de fundo sem diagonais (N, V, X...) esticam melhor.
  word('OCUULTO', [-0.4, 2.6], {
    layer: 'far',
    font: 'wide',
    liga: true,
    color: 'jfaBlue',
    opacity: 0.11,
    x: -6,
    y: -2,
    originY: 'cap',
    align: 'left',
    fit: 2.3,
    fitMode: 'uniform',
    stretchY: { at: 0.47, keys: [[0, 1.04]] },
    drift: [-88, 0],
    fade: [0.35, 0.5],
  }),
  // CENA 1 · bloco colado à esquerda: duas fontes na primeira linha, entradas sobrepostas.
  word('PRIMEIRA FRASE', [-0.12, 2.3], {
    parts: [
      { text: 'PRIMEIRA', weight: 300, tracking: 1.5 },
      { text: 'FRASE', weight: 800, italic: true, color: 'electricBlue', delay: 0.09, gap: 0.24 },
    ],
    size: 40,
    x: 9,
    y: 19.2,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'fade', dur: 0.45 },
  }),
  // Animação da cena: troca de fonte em ritmo (curto, curto, longo) que trava no fim.
  ...fontCycle(
    'AQUI',
    [0.02, 2.3],
    [
      { font: 'wide', size: 80 },
      { font: 'serif', italic: true, size: 112 },
      { font: 'sans', weight: 900, size: 96 },
      { font: 'condensed', size: 92 },
    ],
    { from: 0.3, lock: 1.55, rhythm: [0.1, 0.1, 0.2], order: [1, 2, 3, 1, 3, 2], crossfade: 0.07 },
    { x: 9, y: 30.1, align: 'left', in: { type: 'mask', dur: 0.5 }, out: { type: 'fade', dur: 0.45 } },
  ),
  // Ponte para a cena 2: minúscula, serifada e itálica, com tempo de leitura.
  word('e...', [1.0, 2.4], {
    font: 'serif',
    italic: true,
    lower: true,
    size: 40,
    x: 9.6,
    y: 38.4,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'fade', dur: 0.45 },
  }),

  // CENA 2 · fundo: um texto só, que estica de cima para baixo durante a cena inteira.
  word('TUUDO', [2.0, 4.85], {
    space: 2,
    layer: 'far',
    font: 'wide',
    liga: true,
    color: 'jfaBlue',
    opacity: 0.12,
    x: 50,
    y: 2,
    originY: 'cap',
    fit: 1.1,
    fitMode: 'uniform',
    stretchY: {
      at: 0.47,
      keys: [
        [0.15, 0],
        [2.6, 1.0, 'glide'],
      ],
    },
    fade: [0.55, 0.35],
  }),
  word('SEGUNDA FRASE', [2.2, 4.8], {
    space: 2,
    parts: [
      { text: 'SEGUNDA', font: 'serif', italic: true, color: 'black' },
      { text: 'FRASE', weight: 900, color: 'electricBlue', delay: 0.1, gap: 0.22 },
    ],
    size: 46,
    x: 9,
    y: 18.6,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'fade', dur: 0.3 },
  }),
  // Animação da cena: uma letra estica como na Stretch Pro (aqui o E: só as barras crescem).
  word('DA CENA', [2.4, 4.8], {
    space: 2,
    layer: 'front',
    font: 'condensed',
    color: 'black',
    size: 84,
    x: 9,
    y: 29.4,
    align: 'left',
    in: { type: 'mask', dur: 0.5 },
    out: { type: 'fade', dur: 0.3 },
    stretchLetter: {
      index: 4,
      // Coluna só com as barras do E (na Anton a haste vai até ~52% da largura).
      at: 0.7,
      keys: [
        [0.5, 0],
        [2.0, 0.6, 'soft'],
      ],
    },
  }),
];

// Gráficos em SVG (kinetic.js → GRAPHIC_TYPES): aqui a trilha de circuito da cena 2.
export const GRAPHICS = [
  {
    type: 'trace',
    space: 2,
    t: [2.72, 4.8],
    layer: 'back',
    x: 50,
    y: 40,
    width: 100,
    aspect: 180 / 1080,
    rotate: 0,
    in: { type: 'none' },
    out: { dur: 0.3 },
    reveal: [0, 1.1, 'soft'],
  },
];

// Fundo: [início, cor ou 'glow' | 'hero' | 'white', fusão (s)].
export const BACKGROUND = [
  [0, 'glow'],
  [2.15, 'white', 0.85],
];

export const BLOCKS = [];
export const CUTS = [];
export const FX = [];

export const CUES = [
  { t: 0, id: 'abertura', label: 'Batida de abertura' },
  { t: 1.75, id: 'passagem', label: 'Passagem lateral (whoosh suave)', until: 2.65 },
  { t: 2.15, id: 'fundo-claro', label: 'Fundo clareando (swell)', until: 3.0 },
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
