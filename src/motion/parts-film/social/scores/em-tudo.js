/**
 * ROTEIRO "Você não vê, mas ela está em tudo" (?variant=social-kinetic · 9:16 · 20 s).
 * Roda no motor de tipografia cinética (social/kinetic.js); o modelo de um roteiro novo
 * está em scores/modelo.js.
 *
 * Tudo em segundos sobre a base de 20 s (SOCIAL_MOTION_CONFIG.duration estica ou comprime).
 * Posições em % do quadro (x da esquerda, y de cima; valores fora de 0–100 cortam a
 * palavra pela borda de propósito). Tamanhos de letra em TYPOGRAPHY.
 *
 * Ritmo: RÁPIDO · RÁPIDO · RÁPIDO · PAUSA · EXPLOSÃO · RÁPIDO · PAUSA · HERO
 *
 * Pontos do modelo real (cena em unidades de 10 cm, placa deitada, componentes para cima):
 *   encoder com eixo em (-0,01; 0 a 0,27; -0,11) · CI principal em (0,49; 0,02; -0,15)
 *   botões táteis em z≈0,05, x = 0,61 / 0,89 / 1,16 / 1,42 · placa: x ±1,55, z ±0,39
 */
import { word, fontCycle, stack, pose, PLACA, cutCues } from '../kit';

/** Identidade do motion: id na URL (?variant=), título acessível, duração base (s),
 * quadro mostrado parado com "reduzir movimento" e proporção. */
export const META = {
  id: 'social-kinetic',
  title: 'JFA Parts: você não vê, mas ela está em tudo. Tudo começa por dentro.',
  duration: 20,
  stillTime: 19,
  format: '9x16',
};

/** Cenas (régua do modo debug). */
export const SCENES = [
  { id: 'hook', label: 'Você não vê, mas...', start: 0, end: 2.15 },
  { id: 'em-tudo', label: 'Ela está em tudo', start: 2.15, end: 4.42 },
  { id: 'palavras', label: 'Controle · Energia', start: 4.42, end: 6.45 },
  { id: 'pausa-1', label: 'Pausa', start: 6.45, end: 7.12 },
  { id: 'explosao', label: 'Precisão · Conexão · Tecnologia', start: 7.12, end: 10.78 },
  { id: 'caos', label: 'Caos', start: 10.78, end: 12.75 },
  { id: 'pausa-2', label: 'Tudo começa por dentro', start: 12.75, end: 15.3 },
  { id: 'final', label: 'JFA Parts', start: 15.3, end: 20 },
];

// ---------------------------------------------------------------------------
// ESPAÇOS: cada cena monta os seus planos de texto num ângulo em volta da placa
// (yaw, graus). Quando a câmera virtual chega a esse ângulo, os planos da cena ficam de
// frente; os da cena anterior giram para o lado. Passar de cena = andar no mesmo universo.
// As cenas ainda em rascunho ficam em "rest", de frente para onde a câmera para.
// ---------------------------------------------------------------------------
export const SPACES = {
  1: { yaw: 0 },
  2: { yaw: 52 },
  rest: { yaw: 55 },
};

// ---------------------------------------------------------------------------
// PLANOS 3D
// pose: alvo, azimute/elevação (graus), distância, `lens` (× CAMERA.fov), `roll` (giro do quadro, graus)
// board: rotação [yaw, pitch, roll] (graus) e posição; shift: posição da placa no quadro
// (fração; +x direita, +y cima); pan: movimento de câmera que também desloca as camadas
// de texto (com paralaxe); light: preset de luz ou preset com marcações (kinetic.js).
// Planos com `keys` usam marcações contínuas (sem corte entre cenas).
// ---------------------------------------------------------------------------
const { ENCODER, CHIP, CENTER } = PLACA;

export const SHOTS = [
  // CENAS 1 E 2 num plano só (a passagem entre elas é a câmera andando, sem corte).
  // A placa é o centro do quadro o tempo todo: sobe para o lugar, assenta, avança
  // devagar e, depois da órbita da câmera, segue como foco da cena 2.
  {
    t: [0, 4.42],
    keys: [
      { t: 0, target: CENTER, az: -24, el: 43, dist: 3.75, roll: 35, shift: [0, -0.27], rot: [8, 0, 0] },
      { t: 0.55, target: CENTER, az: -20.5, el: 45, dist: 3.48, roll: 38, shift: [0, -0.19], rot: [4, 0, 0] },
      { t: 1.0, target: CENTER, az: -18, el: 46, dist: 3.4, roll: 39, shift: [0, -0.17], rot: [3, 0, 0] },
      { t: 1.95, target: CENTER, az: -13, el: 48, dist: 3.05, roll: 41, shift: [0, -0.14], rot: [0, 0, 0] },
      { t: 2.7, target: CENTER, az: -12, el: 52, dist: 3.5, roll: 30, shift: [0.07, -0.14], rot: [0, 0, 0] },
      { t: 4.42, target: CENTER, az: -8, el: 54, dist: 3.2, roll: 27, shift: [0.07, -0.12], rot: [-2, 0, 0] },
    ],
    // A placa começa preta (só o contorno do contraluz) e a luz vai revelando, de uma
    // ponta até o centro, até o estúdio completo; na cena 2, luz de fundo claro.
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
        [4.42, { sweep: -30 }],
      ],
    },
  },
  // CONTROLE.: macro em órbita do encoder (o eixo atravessa a palavra).
  {
    t: [4.42, 5.45],
    cam: [pose(ENCODER, 18, 16, 1.0), pose(ENCODER, 68, 22, 0.82)],
    ease: 'soft',
    shift: [
      [0.1, -0.1],
      [0.06, -0.1],
    ],
    pan: [
      [0.02, 0],
      [-0.02, 0],
    ],
    light: 'macro',
    aperture: 0.32,
    sweep: [40, -40],
  },
  // ENERGIA.: placa em pé à direita, cortada em cima e embaixo.
  {
    t: [5.45, 6.45],
    cam: [pose([0.1, 0, 0], 0, 80, 3.5, { roll: 90 }), pose([-0.15, 0, 0], 0, 80, 3.2, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [10, 0, 0] }, { rot: [4, 0, 0] }],
    shift: [
      [0.3, 0.04],
      [0.2, 0.08],
    ],
    light: 'onColor',
    sweep: [45, -35],
  },
  // PAUSA: macro quase parado na fileira de botões.
  {
    t: [6.45, 7.12],
    cam: [
      pose([1.0, 0.03, 0.05], 80, 9, 0.33, { lens: 0.9 }),
      pose([0.99, 0.03, 0.05], 80, 9.3, 0.325, { lens: 0.9 }),
    ],
    ease: 'linear',
    light: 'macro',
    aperture: 0.75,
    sweep: [10, -12],
  },
  // PRECISÃO.: placa enorme; a borda dela corta a palavra.
  {
    t: [7.12, 8.3],
    cam: [pose([0.42, 0, 0.06], -8, 60, 2.05), pose([0.5, 0, 0.06], -4, 62, 1.75)],
    ease: 'expoOut',
    shift: [
      [0, -0.13],
      [0, -0.11],
    ],
    pan: [
      [0, 0.02],
      [0, 0],
    ],
    light: 'punch',
    sweep: [55, -20],
  },
  // CONEXÃO.: a placa passa rápido (transição) e vira uma faixa entre "CON" e "EXÃO.".
  {
    t: [8.3, 8.54],
    cam: [pose([3.6, 0, 0], 0, 88, 4.1), pose([1.05, 0, 0], 0, 88, 4.1)],
    ease: 'expoOut',
    light: 'punch',
    blur: [-120, 0],
    sweep: [30, 20],
  },
  {
    t: [8.54, 9.42],
    cam: [pose([1.05, 0, 0], 0, 88, 4.1), pose([-0.35, 0, 0], 0, 88, 3.9)],
    ease: 'linear',
    light: 'punch',
    sweep: [20, -40],
  },
  // TECNOLO [placa] GIA.
  {
    t: [9.42, 10.06],
    cam: [pose(CENTER, 14, 68, 5.6, { roll: -34 }), pose(CENTER, 8, 70, 5.0, { roll: -30 })],
    ease: 'expoOut',
    board: [{ rot: [9, 0, 0] }, { rot: [-5, 0, 0] }],
    light: 'punch',
    sweep: [45, -30],
  },
  // A placa sai por cima e a palavra toma o quadro.
  {
    t: [10.06, 10.22],
    cam: [pose(CENTER, 8, 70, 5.0, { roll: -30 }), pose(CENTER, 8, 70, 5.0, { roll: -30 })],
    ease: 'linear',
    board: [{ rot: [-5, 0, 0] }, { rot: [-14, 0, 0] }],
    shift: [
      [0, 0],
      [0.12, 1.05],
    ],
    light: 'punch',
    blur: [0, -140],
  },
  { t: [10.22, 10.78], hidden: true },
  // CAOS: planos de ~0,28 s, cada um numa escala e num ângulo.
  {
    t: [10.78, 11.06],
    cam: [
      pose([-0.012, 0.16, -0.11], -40, 10, 0.72, { roll: 8 }),
      pose([-0.012, 0.16, -0.11], -52, 12, 0.66, { roll: 8 }),
    ],
    ease: 'linear',
    shift: [
      [-0.12, -0.05],
      [-0.12, -0.05],
    ],
    light: 'onColor',
    aperture: 0.3,
  },
  {
    t: [11.06, 11.33],
    cam: [pose([-0.8, 0, 0], 20, 55, 1.9, { roll: 45 }), pose([-0.6, 0, 0], 26, 55, 1.7, { roll: 45 })],
    ease: 'linear',
    shift: [
      [0.12, 0.06],
      [0.12, 0.06],
    ],
    light: 'punch',
  },
  {
    t: [11.33, 11.6],
    cam: [pose(CHIP, 0, 80, 0.62), pose(CHIP, 6, 80, 0.55)],
    ease: 'linear',
    shift: [
      [0.06, -0.3],
      [0.06, -0.3],
    ],
    light: 'onColor',
  },
  {
    t: [11.6, 11.88],
    cam: [pose([1.5, 0, 0], 0, 86, 4.0), pose([-0.7, 0, 0], 0, 86, 4.0)],
    ease: 'soft',
    light: 'onColor',
    blur: [-70, 0],
  },
  {
    t: [11.88, 12.16],
    cam: [pose(CENTER, -20, 60, 3.3, { roll: 90 }), pose(CENTER, 8, 60, 3.0, { roll: 90 })],
    ease: 'linear',
    shift: [
      [0.24, -0.12],
      [0.24, -0.12],
    ],
    light: 'punch',
  },
  {
    t: [12.16, 12.46],
    cam: [pose(CENTER, 0, 68, 8.4, { roll: 90 }), pose(CENTER, 0, 68, 7.6, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [28, 0, 0] }, { rot: [0, 0, 0] }],
    light: 'punch',
  },
  { t: [12.46, 12.75], hidden: true },
  // PAUSA: tela escura, placa inteira em pé, movimento lento.
  {
    t: [12.75, 15.3],
    cam: [pose(CENTER, 3, 64, 7.2, { roll: 90 }), pose(CENTER, 0, 66, 6.7, { roll: 90 })],
    ease: 'soft',
    board: [{ rot: [5, 0, 0] }, { rot: [0, 0, 0] }],
    light: 'hero',
    sweep: [55, -45],
  },
  // FINAL: "JFA / PARTS" gigante atrás da placa...
  {
    t: [15.3, 16.95],
    cam: [pose(CENTER, 0, 64, 5.2, { roll: 90 }), pose(CENTER, 0, 65, 5.0, { roll: 90 })],
    ease: 'expoOut',
    board: [{ rot: [-10, 0, 0] }, { rot: [-1.5, 0, 0] }],
    light: 'hero',
    sweep: [-50, 40],
  },
  // ...e o hero limpo com a assinatura.
  {
    t: [16.95, 20],
    cam: [pose(CENTER, 0, 65, 7.6, { roll: 90 }), pose(CENTER, 0, 66, 7.4, { roll: 90 })],
    ease: 'settle',
    board: [{ rot: [2.5, 0, 0] }, { rot: [0, 0, 0] }],
    shift: [
      [0, 0.08],
      [0, 0.08],
    ],
    light: 'hero',
    sweep: [45, -40],
  },
];

// ---------------------------------------------------------------------------
// CÂMERA MÓVEL (virtual): uma câmera só para a placa e para os planos de texto.
// yaw/pitch = órbita em graus (eixos da tela), dolly = aproximação (fração da
// distância), truck = deslocamento [x, y] (fração do quadro; +y sobe).
// Spline contínua entre marcações: a câmera nunca para de repente.
// ---------------------------------------------------------------------------
export const CAMERA_RIG = [
  // Cena 1: órbita da esquerda para a direita, descendo e aproximando.
  { t: -0.2, yaw: -11, pitch: 6, dolly: 0, truck: [0.02, 0] },
  { t: 1.0, yaw: -1.5, pitch: 1.5, dolly: 0.07, truck: [0, 0] },
  { t: 1.75, yaw: 6, pitch: -2.5, dolly: 0.1, truck: [0, 0] },
  // Passagem 1 → 2: a câmera gira em volta da placa e entra entre os planos de texto
  // (aproxima no meio do caminho); os planos da cena 1 giram para o lado e os da cena 2
  // chegam de frente. Um universo só.
  { t: 2.18, yaw: 27, pitch: -1, dolly: 0.2, truck: [0, 0] },
  { t: 2.65, yaw: 44.5, pitch: 1.5, dolly: 0.1, truck: [0, 0] },
  // Cena 2: a órbita desacelera sem voltar (nada de "mola"), aproximando devagar.
  { t: 3.2, yaw: 51.5, pitch: 1, dolly: 0.08, truck: [0, 0] },
  { t: 4.42, yaw: 55, pitch: 0, dolly: 0.13, truck: [0, 0], rest: true },
];

// ---------------------------------------------------------------------------
// PALAVRAS (word, fontCycle e stack em ../kit.js; tipos de entrada/saída lá também)
// ---------------------------------------------------------------------------
export const WORDS = [
  // 0–2 s · VOCÊ NÃO VÊ, mas...
  // Fundo: "INVISSÍVEL" gigante na Stretch Pro, cobrindo a tela de cima a baixo, com o S
  // esticado (o "SS" vira uma letra só, mais larga), passando devagar atrás de tudo em
  // azul quase apagado. A altura vem do estiramento da própria fonte (as hastes crescem,
  // as barras ficam finas), não de escalar as letras.
  word('INVISSÍVEL', [-0.4, 2.6], {
    layer: 'far',
    font: 'wide',
    liga: true,
    size: 'huge',
    color: 'jfaBlue',
    opacity: 0.11,
    x: -6,
    y: -2,
    originY: 'cap',
    align: 'left',
    fit: 2.3,
    fitMode: 'uniform',
    stretchY: { at: [0.265, 0.7], keys: [[0, 1.04]] },
    drift: [-88, 0],
    // Sai durante a passagem, girando com os planos da cena 1 (o quadro não esvazia).
    fade: [0.35, 0.5],
  }),
  // Um bloco só, linhas coladas, três estilos: Poppins Light, Poppins ExtraBold
  // Itálico (azul) e, no "VÊ", a troca de fonte. As entradas se sobrepõem e a saída é
  // uma fusão enquanto a câmera gira para a cena 2.
  word('VOCÊ NÃO', [-0.12, 2.3], {
    parts: [
      { text: 'VOCÊ', weight: 300, tracking: 1.5 },
      { text: 'NÃO', weight: 800, italic: true, color: 'electricBlue', delay: 0.09, gap: 0.24 },
    ],
    size: 44,
    x: 9,
    y: 19.2,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'fade', dur: 0.45 },
  }),
  // "VÊ" não para quieto: troca de fonte em ritmo (curto, curto, longo) com fusão
  // curta entre as fontes, já durante a entrada, e trava na Stretch Pro no fim.
  ...fontCycle(
    'VÊ',
    [0.02, 2.3],
    [
      { font: 'wide', size: 90 },
      { font: 'serif', italic: true, size: 124 },
      { font: 'sans', weight: 900, size: 102 },
      { font: 'condensed', size: 98 },
      { font: 'sans', weight: 300, italic: true, size: 104 },
      { font: 'sans', weight: 800, italic: true, outline: true, size: 104 },
    ],
    {
      from: 0.3,
      lock: 1.55,
      rhythm: [0.1, 0.1, 0.2],
      order: [1, 2, 3, 4, 5, 1, 3, 2, 4, 5],
      crossfade: 0.07,
    },
    { x: 9, y: 30.1, align: 'left', in: { type: 'mask', dur: 0.5 }, out: { type: 'fade', dur: 0.45 } },
  ),
  // "mas..." embaixo do "VÊ": a ponta que leva para a cena 2 (serifada, itálica, minúscula).
  word('mas...', [1.0, 2.4], {
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

  // 2,2–4,4 s · ELA ESTÁ EM TUDO (espaço 2, fundo claro)
  // Fundo: um texto só, "TUUDO" (U esticado da Stretch Pro) na largura toda, que vai
  // esticando de cima para baixo durante a cena inteira até cobrir a tela.
  word('TUUDO', [2.0, 4.65], {
    space: 2,
    layer: 'far',
    font: 'wide',
    liga: true,
    size: 'huge',
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
        [2.5, 1.0, 'glide'],
      ],
    },
    fade: [0.55, 0.35],
  }),
  // Um bloco só, colado, alinhado à esquerda: Instrument Serif itálica + Poppins Black
  // azul na primeira linha e Anton (condensada) na segunda. Entradas sobrepostas.
  word('ELA ESTÁ', [2.2, 4.6], {
    space: 2,
    parts: [
      { text: 'ELA', font: 'serif', italic: true, color: 'black' },
      { text: 'ESTÁ', weight: 900, color: 'electricBlue', delay: 0.1, gap: 0.22 },
    ],
    size: 46,
    x: 9,
    y: 18.6,
    align: 'left',
    in: { type: 'mask', dur: 0.46 },
    out: { type: 'fade', dur: 0.3 },
  }),
  // Na frente da placa: se a ponta dela encostar, passa por trás da palavra.
  // Animação da cena: depois de assentar, o T de "TUDO" se estica devagar como as letras
  // da Stretch Pro: só a barra de cima cresce, para os dois lados, e a haste fica no
  // meio, com a espessura desenhada. (No U e no O as curvas finas da Anton se separavam.)
  word('EM TUDO', [2.4, 4.6], {
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
      index: 3,
      at: [0.16, 0.85],
      keys: [
        [0.5, 0],
        [2.0, 0.6, 'soft'],
      ],
    },
  }),

  // 4,4–6,5 s · CONTROLE. / ENERGIA.
  word('CONTROLE', [4.42, 5.45], {
    x: -6,
    y: 31,
    align: 'left',
    fit: 1.3,
    in: { type: 'slideRight', dur: 0.24 },
    drift: [4, 0],
    fx: [{ preset: 'stretch', at: 0, dur: 0.34 }],
  }),
  word('CONTROLE', [4.6, 5.45], {
    x: 50,
    y: 83,
    size: 'medium',
    outline: true,
    fit: 0.86,
    in: { type: 'slideLeft', dur: 0.24 },
    drift: [-6, 0],
  }),
  word('ENERGIA', [5.45, 6.45], {
    font: 'wide',
    x: 25,
    y: 50,
    rotate: -90,
    fit: 0.98,
    fitAxis: 'y',
    size: 'large',
    in: { type: 'slideUp', dur: 0.28 },
    drift: [0, -4],
    fx: [{ preset: 'stretch', at: 0, dur: 0.36 }],
  }),

  // 7,1–10,8 s · PRECISÃO. / CON–EXÃO. / TECNOLO–GIA / TECNOLOGIA
  word('PRECISÃO', [7.12, 8.3], {
    y: 30,
    fit: 1.12,
    sy: 1.2,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.04,
    fx: [{ preset: 'impact', at: 0, dur: 0.45 }],
  }),
  word('CON', [8.42, 9.42], {
    y: 20,
    fit: 0.98,
    sy: 1.75,
    in: { type: 'squeeze', dur: 0.2 },
    drift: [-3, 0],
  }),
  word('EXÃO', [8.5, 9.42], {
    y: 81,
    fit: 0.98,
    sy: 1.75,
    in: { type: 'squeeze', dur: 0.2 },
    drift: [3, 0],
  }),
  word('TECNOLO', [9.42, 10.14], {
    x: -3,
    y: 17,
    align: 'left',
    fit: 1.08,
    in: { type: 'slideLeft', dur: 0.2 },
    drift: [-3, 0],
  }),
  word('GIA', [9.5, 10.14], {
    x: 103,
    y: 83,
    align: 'right',
    fit: 0.66,
    in: { type: 'slideRight', dur: 0.2 },
    drift: [3, 0],
  }),
  // A palavra nasce pequena e cresce até cobrir a tela (transição textWipe às 10,78).
  word('TECNOLOGIA', [10.18, 10.78], {
    y: 50,
    size: 'medium',
    fit: 0.5,
    scaleKeys: [
      [0, 0.25],
      [0.16, 1.0, 'enter'],
      [0.36, 1.08, 'linear'],
      [0.6, 70, 'expoIn'],
    ],
    // Ponto de crescimento dentro da haste do "T" (a tela fica toda branca).
    origin: [4.6, 56],
  }),

  // 10,8–12,75 s · CAOS
  word('CONTROLE', [10.78, 11.06], {
    layer: 'front',
    color: 'black',
    x: 86,
    y: 50,
    rotate: 90,
    fit: 1.02,
    fitAxis: 'y',
    in: { type: 'slideDown', dur: 0.16 },
  }),
  word('ENERGIA', [11.06, 11.33], {
    layer: 'front',
    font: 'wide',
    x: -12,
    y: 72,
    align: 'left',
    size: 'large',
    fit: 1.25,
    fx: [{ preset: 'smear', at: 0, dur: 0.27 }],
  }),
  word('PRECISÃO', [11.33, 11.6], {
    layer: 'front',
    color: 'black',
    x: -18,
    y: 26,
    align: 'left',
    fit: 1.45,
    sy: 1.3,
    in: { type: 'zoom', dur: 0.14 },
  }),
  word('CONEXÃO', [11.6, 11.88], {
    layer: 'front',
    y: 50,
    fit: 1.0,
    sy: 2.1,
    fx: [{ preset: 'glitch', at: 0, dur: 0.28 }],
  }),
  word('TECNOLOGIA', [11.88, 12.16], {
    layer: 'front',
    color: 'electricBlue',
    x: 102,
    y: 24,
    align: 'right',
    fit: 1.5,
    sy: 1.15,
    in: { type: 'slideLeft', dur: 0.14 },
  }),
  ...stack('TECNOLOGIA', [12.16, 12.46], 5, {
    size: 'large',
    fit: 1.0,
    gap: 9,
    stagger: 0.03,
    spread: 6,
    grow: 0.06,
    solidCenter: true,
  }),

  // 12,75–15,3 s · PAUSA
  word('TUDO COMEÇA', [12.95, 15.3], {
    size: 'large',
    weight: 800,
    y: 10,
    fit: 0.84,
    fitMode: 'uniform',
    in: { type: 'rise', dur: 0.6 },
    out: { type: 'fade', dur: 0.3 },
    drift: [0, -1.2],
  }),
  word('POR DENTRO', [13.35, 15.3], {
    size: 'large',
    weight: 800,
    y: 90,
    fit: 0.84,
    fitMode: 'uniform',
    in: { type: 'rise', dur: 0.6 },
    out: { type: 'fade', dur: 0.3 },
    drift: [0, -1.2],
  }),

  // 15,3–20 s · FINAL
  word('JFA', [15.3, 16.95], {
    font: 'wide',
    y: 31,
    fit: 1.1,
    sy: 1.25,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.05,
  }),
  word('PARTS', [15.38, 16.95], {
    font: 'wide',
    y: 69,
    fit: 1.1,
    sy: 1.25,
    in: { type: 'explode', dur: 0.26 },
    grow: 0.05,
  }),
  word('JFA PARTS', [17.05, 20], {
    font: 'wide',
    size: 'medium',
    y: 82,
    fit: 0.7,
    fitMode: 'uniform',
    in: { type: 'zoom', dur: 0.24 },
  }),
  word('TECNOLOGIA QUE FAZ ACONTECER', [17.55, 20], {
    size: 'medium',
    weight: 700,
    y: 87.6,
    fit: 0.7,
    fitMode: 'uniform',
    tracking: 1.5,
    color: 'electricBlue',
    in: { type: 'rise', dur: 0.4 },
  }),
];

// Cenas ainda em rascunho (a partir de 4,4 s) ficam no espaço "rest".
WORDS.forEach((w) => {
  if (!w.space) w.space = w.t[0] >= 4.4 ? 'rest' : 1;
});

// ---------------------------------------------------------------------------
// GRÁFICOS (SVG, sem imagem). Posição = centro, em % do quadro; largura em % da largura.
// ---------------------------------------------------------------------------
export const GRAPHICS = [
  // Cena 1: olhos depois do "VÊ", entre as duas linhas, inclinados e cobrindo um
  // pouco do texto. As pupilas trocam de lado uma vez, devagar, e os olhos se fecham no fim.
  {
    type: 'eyes',
    t: [0.36, 2.3],
    layer: 'back',
    x: 51,
    y: 26.2,
    width: 26,
    aspect: 170 / 200,
    rotate: -12,
    in: { dur: 0.3 },
    out: { dur: 0.45 },
    // [tempo local (s), olhar: -1 esquerda a 1 direita, duração (s), curva]
    // Entra olhando para a esquerda e troca de lado uma vez só, devagar.
    look: [
      [0, -1, 0],
      [0.34, 1, 0.62, 'glide'],
    ],
    closeAt: 1.12,
  },
  // Cena 2: trilha de circuito embaixo de "EM TUDO", atrás da placa, gerada na hora por
  // uma máscara que corre da esquerda para a direita.
  {
    type: 'trace',
    space: 2,
    t: [2.72, 4.6],
    layer: 'back',
    x: 50,
    y: 40,
    width: 100,
    aspect: 180 / 1080,
    rotate: 0,
    in: { type: 'none' },
    out: { dur: 0.3 },
    // [início (tempo local), duração, curva]
    reveal: [0, 1.1, 'soft'],
  },
];

// ---------------------------------------------------------------------------
// FUNDO e BLOCOS DE COR (retângulos em %: [x, y, largura, altura])
// ---------------------------------------------------------------------------
// [tempo, cor, fusão (s)]: sem fusão, troca seca.
export const BACKGROUND = [
  [0, 'glow'],
  // Depois da passagem, o fundo clareia devagar até o branco enquanto a cena 2 começa.
  [2.15, 'white', 0.85],
  [4.42, 'deepBlue'],
  [5.45, 'jfaBlue'],
  [6.45, 'black'],
  [10.78, 'jfaBlue'],
  [11.06, 'black'],
  [11.33, 'white'],
  [11.6, 'electricBlue'],
  [11.88, 'black'],
  [15.3, 'hero'],
];

export const BLOCKS = [
  // Coluna azul elétrica atrás de "CONTROLE." (corta a cena na vertical).
  { t: [4.5, 5.45], color: 'electricBlue', from: [70, 100, 14, 0], to: [70, 0, 14, 100], dur: 0.3 },
  // Barra azul sob "PRECISÃO." que abre da esquerda.
  { t: [7.2, 8.3], color: 'jfaBlue', from: [0, 41, 0, 3], to: [0, 41, 100, 3], dur: 0.35 },
  // Bloco que cobre metade da tela no caos.
  { t: [11.88, 12.16], color: 'jfaBlue', from: [0, 58, 100, 0], to: [0, 58, 100, 42], dur: 0.16 },
  // Linha fina azul na assinatura final.
  { t: [17.2, 20], color: 'jfaBlue', from: [50, 77.2, 0, 0.3], to: [42, 77.2, 16, 0.3], dur: 0.45 },
];

// ---------------------------------------------------------------------------
// TRANSIÇÕES (centradas no corte) e DISTORÇÕES GLOBAIS (sobre a composição inteira)
// ---------------------------------------------------------------------------
export const CUTS = [
  { t: 4.42, type: 'zoomIn', dur: 0.24 },
  { t: 5.45, type: 'verticalWipe', dur: 0.26, color: 'jfaBlue' },
  { t: 6.45, type: 'hardCut', dur: 0.08 },
  { t: 7.12, type: 'colorFlash', dur: 0.26, colors: ['white', 'jfaBlue', 'black'] },
  { t: 8.3, type: 'productPass', dur: 0.24, dir: -1 },
  { t: 9.42, type: 'whipRight', dur: 0.2 },
  { t: 10.78, type: 'textWipe', dur: 0.3, color: 'white' },
  { t: 11.06, type: 'hardCut', dur: 0.08 },
  { t: 11.33, type: 'horizontalWipe', dur: 0.14, color: 'white' },
  { t: 11.6, type: 'distortionCut', dur: 0.12, dir: -1 },
  { t: 11.88, type: 'whipLeft', dur: 0.14 },
  { t: 12.16, type: 'zoomOut', dur: 0.14 },
  { t: 12.6, type: 'colorFlash', dur: 0.3, colors: ['white', 'jfaBlue', 'black'] },
  { t: 15.3, type: 'scaleCut', dur: 0.2 },
  { t: 16.95, type: 'maskReveal', dur: 0.34, color: 'black', x: 50, y: 50 },
];

export const FX = [
  { t: 7.12, dur: 0.5, preset: 'impact' },
  { t: 7.14, dur: 0.3, preset: 'shake' },
  { t: 10.78, dur: 0.24, preset: 'impact', amount: 0.8 },
  { t: 11.6, dur: 0.2, preset: 'glitch', amount: 0.6 },
  { t: 15.3, dur: 0.4, preset: 'impact', amount: 0.7 },
];

/** Pontos de sincronização para o sound design (o filme funciona sem áudio). */
export const CUES = [
  { t: 0, id: 'abertura', label: 'Batida de abertura' },
  { t: 1.75, id: 'passagem', label: 'Passagem lateral (whoosh suave)', until: 2.65 },
  { t: 2.15, id: 'fundo-claro', label: 'Fundo clareando (swell)', until: 3.0 },
  ...cutCues(CUTS),
  { t: 12.75, id: 'pausa', label: 'Silêncio (pausa)', until: 15.3 },
].sort((a, b) => a.t - b.t);

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
