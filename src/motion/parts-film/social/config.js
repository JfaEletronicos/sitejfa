/**
 * CONTROLES DA VARIANTE "social-kinetic" (9:16, tipografia cinética).
 *
 * Todos valem de verdade: mude aqui, pela URL (ex.: ?variant=social-kinetic&distortionIntensity=0.4)
 * ou nos controles do modo debug (?debug). Intensidades: 0 desliga, 1 é o desenho original.
 */

export const SOCIAL_MOTION_CONFIG = {
  // Duração total em segundos: o roteiro (desenhado em 20 s) estica ou comprime por inteiro.
  duration: 20,

  // Deslocamentos, overshoot e deriva das palavras.
  typographyIntensity: 1,
  // Esticar, comprimir, inclinar, onda, separação de cor e desfoque.
  distortionIntensity: 0.8,
  // Chicotes, zooms, cortinas e flashes entre as cenas (0 = só cortes secos).
  transitionIntensity: 1,
  // Quanto a câmera anda dentro de cada plano.
  cameraIntensity: 0.9,
  // Quanto a placa gira e atravessa o quadro.
  productIntensity: 0.8,
  // Presença do azul (0 = só preto e branco).
  colorIntensity: 0.8,

  // Rastro nas palavras rápidas e desfoque direcional na placa.
  motionBlur: true,

  autoplay: true,
  loop: false,

  // Régua de tempo e estes controles na tela.
  debug: false,
};

/**
 * Tamanhos em px numa tela de referência de 390 px de largura (o quadro real escala
 * proporcionalmente: em 1080×1920, 1 px daqui = 2,77 px).
 */
export const TYPOGRAPHY = {
  hugeSize: 150,
  largeSize: 110,
  mediumSize: 64,

  // Peso padrão das palavras (Poppins, a fonte do site).
  weight: 900,

  // Espaçamento entre letras (px de referência).
  tracking: -3,

  // Limite das escalas animadas (entradas, explosões, pilhas).
  maxScale: 1.4,

  // Duração padrão das entradas e saídas (s).
  entranceDuration: 0.18,
  exitDuration: 0.14,

  // Pico de escala na chegada de cada palavra.
  overshoot: 1.12,
};

export const CAMERA = {
  // Abertura vertical base (graus) para o quadro 9:16.
  fov: 38,

  // Aproximação/afastamento dentro dos planos e nas transições de zoom.
  zoomIntensity: 1,

  // Giro de câmera e deslocamento nos chicotes (whip).
  whipIntensity: 0.8,

  // Tremor nos impactos (fração do quadro). Só nos impactos, nunca constante.
  shakeIntensity: 0.02,

  // Profundidade entre camadas: texto de trás anda menos, texto da frente anda mais.
  parallax: 0.15,
};

export const COLORS = {
  black: '#05070A',
  deepBlue: '#071426',
  jfaBlue: '#005BFF',
  electricBlue: '#1683FF',
  white: '#FFFFFF',
};

/** Roteiro desenhado em 20 s; `duration` estica ou comprime o tempo por inteiro. */
export const BASE_DURATION = 20;

/** Lê sobrescritas da URL (?chave=valor) para as chaves que existem nos objetos acima. */
export function readOverrides(params) {
  [SOCIAL_MOTION_CONFIG, TYPOGRAPHY, CAMERA].forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!params.has(key)) return;
      const raw = params.get(key);
      if (typeof obj[key] === 'boolean') obj[key] = raw !== '0' && raw !== 'false';
      else if (Number.isFinite(parseFloat(raw))) obj[key] = parseFloat(raw);
    });
  });
}
