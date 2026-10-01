/**
 * PARTITURA DO FILME "Tudo começa por dentro." (JFA Parts, ~18 s)
 *
 * Todos os tempos do filme estão aqui. Ajuste os números e o filme inteiro
 * acompanha: câmera, luz, fundo, profundidade de campo, textos e marcações de som.
 * Use `?debug` na página para ver a régua de tempo e arrastar para qualquer ponto.
 *
 * Espaço da cena (unidades = 10 cm; 1 mm da placa = 0,01):
 *   placa LB1004 deitada no plano XZ, face de componentes para +Y,
 *   comprimento em X (-1,55 a 1,55), largura em Z (-0,39 a 0,39), texto da placa
 *   legível de quem olha a partir de +Z.
 * Pontos de referência do modelo real (medidos no GLB):
 *   botões táteis S2-S5 em z≈0,05 e x = 0,61 / 0,89 / 1,16 / 1,42 (altura 0,05)
 *   CI principal (SOIC) centrado em (0,49; 0,02; -0,15)
 *   encoder com eixo em (-0,01; 0 a 0,27; -0,11)
 */
import { keyed, spline } from './tracks';

export const DURATION = 18;

/** Atos do filme (só referência visual na régua do modo debug). */
export const ACTS = [
  { id: 'intriga', label: 'Intriga', start: 0, end: 3 },
  { id: 'descoberta', label: 'Descoberta', start: 3, end: 7 },
  { id: 'precisao', label: 'Precisão', start: 7, end: 11 },
  { id: 'hero', label: 'Hero product', start: 11, end: 15 },
  { id: 'assinatura', label: 'Assinatura', start: 15, end: 18 },
];

/**
 * Textos. `in`/`out` = início do fade de entrada/saída (s).
 * `out: null` = fica até o fade final para preto.
 */
export const COPY = [
  { id: 'question', text: 'O que faz tudo funcionar?', in: 2.1, out: 5.3, fadeIn: 1.2, fadeOut: 1.0 },
  { id: 'manifesto', text: 'Tudo começa por dentro.', in: 7.5, out: 10.35, fadeIn: 1.3, fadeOut: 1.0 },
  { id: 'caption', text: 'Tecnologia que faz acontecer.', in: 12.1, out: 14.45, fadeIn: 1.2, fadeOut: 0.9 },
  { id: 'brand', text: 'JFA PARTS', in: 15.2, out: null, fadeIn: 1.7 },
  { id: 'brandSub', text: 'Placas eletrônicas', in: 15.75, out: null, fadeIn: 1.5 },
];

/**
 * Marcações para o sound design (não há áudio no projeto; o filme funciona sem som).
 * A página dispara `partsfilm:cue` em `window` quando o tempo passa por cada uma,
 * para sincronizar uma trilha no futuro.
 */
export const SOUND_CUES = [
  { t: 0, id: 'silencio', label: 'Silêncio' },
  { t: 2, id: 'whoosh', label: 'Whoosh extremamente sutil' },
  { t: 4, id: 'atmosfera', label: 'Movimento atmosférico (4–7 s)', until: 7 },
  { t: 9, id: 'impacto-tec', label: 'Pequeno impacto tecnológico' },
  { t: 11, id: 'crescimento', label: 'Crescimento muito sutil (11–15 s)', until: 15 },
  { t: 15, id: 'impacto-marca', label: 'Impacto limpo: hero/assinatura' },
];

/**
 * CÂMERA (protagonista do movimento). Órbita em torno de um alvo:
 *   target = ponto observado; az = giro em torno do eixo vertical (0 = de frente, +90 = pela direita);
 *   el = elevação acima do plano da placa; dist = distância até o alvo; fov = abertura vertical (16:9).
 * A distância é interpolada em escala logarítmica para o afastamento ter velocidade
 * percebida constante. A spline mantém a velocidade contínua entre marcações.
 */
export const camera = spline(
  [
    // INTRIGA: macro rente à superfície, deslizando pela fileira de botões táteis.
    { t: 0, target: [1.23, 0.028, 0.05], az: 79, el: 6.5, logDist: Math.log(0.25), fov: 34 },
    { t: 3, target: [0.97, 0.03, 0.04], az: 75, el: 8.5, logDist: Math.log(0.3), fov: 33 },
    // DESCOBERTA: atravessa a superfície rumo ao CI e ao encoder, subindo devagar.
    { t: 5.1, target: [0.56, 0.026, -0.08], az: 60, el: 15, logDist: Math.log(0.58), fov: 31 },
    { t: 7, target: [0.24, 0.022, -0.06], az: 41, el: 25, logDist: Math.log(1.3), fov: 28 },
    // PRECISÃO: afasta e revela a geometria; a placa ganha o quadro.
    // Daqui em diante az, el e distância seguem uma aproximação exponencial
    // (constante de ~2 s): o movimento só desacelera, sem nenhuma retomada.
    { t: 9, target: [0.07, 0.01, 0.0], az: 20, el: 40, logDist: Math.log(3.58), fov: 25 },
    { t: 11, target: [0.0, 0.0, 0.0], az: 8.06, el: 54.9, logDist: Math.log(5.19), fov: 23 },
    // HERO: quase de frente; a câmera só desacelera.
    { t: 13, target: [0.0, 0.0, 0.0], az: 3.25, el: 60.9, logDist: Math.log(5.95), fov: 22 },
    { t: 15, target: [0.0, 0.0, 0.0], az: 1.31, el: 63.4, logDist: Math.log(6.27), fov: 22 },
    // ASSINATURA: praticamente parada.
    { t: 18, target: [0.0, 0.0, 0.0], az: 0.34, el: 64.6, logDist: Math.log(6.4), fov: 22, rest: true },
  ],
  ['target', 'az', 'el', 'logDist', 'fov'],
);

/** Trilhas escalares: [[tempo, valor, curva da chegada], ...]. */
export const tracks = {
  // Fade global (0 = preto). Abre do preto e termina em preto.
  fade: keyed([
    [0, 0],
    [1.6, 1, 'swell'],
    [16.85, 1],
    [18, 0, 'glide'],
  ]),

  // Profundidade de campo (0 = tudo em foco). Forte no macro, some no hero.
  aperture: keyed([
    [0, 1.0],
    [3, 0.9, 'soft'],
    [5.2, 0.62, 'soft'],
    [7, 0.32, 'soft'],
    [9, 0.1, 'soft'],
    [11, 0, 'soft'],
  ]),

  // LUZ PRINCIPAL (spot com sombra). Iluminância no alvo, abertura do cone e posição.
  keyLux: keyed([
    [0, 2.2],
    [3, 3.2, 'soft'],
    [7, 4.8, 'soft'],
    [11, 6.6, 'soft'],
    [15, 7.4, 'soft'],
  ]),
  keyAngle: keyed([
    [0, 5.5],
    [3, 7.5, 'soft'],
    [7, 14, 'soft'],
    [11, 21, 'soft'],
    [15, 23, 'soft'],
  ]),
  // Luz fica um pouco à frente do caminho da câmera (revela o que vem a seguir).
  keyLead: keyed([
    [0, -0.2],
    [3, -0.15, 'soft'],
    [7, -0.08, 'soft'],
    [11, -0.28, 'soft'],
    [15, -0.32, 'soft'],
  ]),
  keyDist: keyed([
    [0, 1.3],
    [3, 1.5, 'soft'],
    [7, 3.4, 'soft'],
    [11, 6.6, 'soft'],
    [15, 7.4, 'soft'],
  ]),
  keyAz: keyed([
    [0, -28],
    [7, -36, 'soft'],
    [11, -40, 'soft'],
  ]),
  keyEl: keyed([
    [0, 58],
    [7, 54, 'soft'],
    [11, 52, 'soft'],
  ]),

  // Contraluz frio (realça topo e bordas dos componentes).
  rimLux: keyed([
    [0, 0.5],
    [7, 0.8, 'soft'],
    [11, 1.25, 'soft'],
    [15, 1.4, 'soft'],
  ]),
  // Preenchimento quase nulo, levemente azulado.
  fill: keyed([
    [0, 0],
    [7, 0.05, 'soft'],
    [11, 0.1, 'soft'],
    [15, 0.12, 'soft'],
  ]),

  // REFLEXOS (estúdio procedural). Intensidade e passagem da faixa de luz:
  // sweep = posição da softbox em graus em relação ao reflexo especular da câmera
  // (0 = reflexo exatamente na direção do espectador).
  env: keyed([
    [0, 0.032],
    [3, 0.052, 'soft'],
    [5.5, 0.18, 'soft'],
    [8, 0.38, 'soft'],
    [11, 0.5, 'soft'],
    [15, 0.56, 'soft'],
  ]),
  // Valores maiores levam o reflexo para a esquerda do quadro; as passagens
  // principais (intriga/descoberta, precisão e hero) correm da esquerda para a direita.
  sweep: keyed([
    [0, 62],
    [1.2, 48, 'soft'],
    [4.2, -6, 'glide'],
    [6.4, -52, 'glide'],
    [7.4, 58, 'glide'],
    [10.6, -58, 'glide'],
    [11.6, 50, 'glide'],
    [14.4, -42, 'glide'],
    [18, -64, 'soft'],
  ]),

  // FUNDO: preto profundo com um radial azul JFA muito discreto atrás do produto.
  bgGlow: keyed([
    [0, 0.0],
    [3, 0.08, 'swell'],
    [7, 0.3, 'swell'],
    [11, 0.6, 'swell'],
    [15, 0.72, 'swell'],
    [16.8, 1, 'swell'],
  ]),

  // Bloom (só nos pontos mais brilhantes) e vinheta.
  bloom: keyed([
    [0, 0.08],
    [11, 0.035, 'soft'],
  ]),
  exposure: keyed([
    [0, 1.0],
    [18, 1.0],
  ]),

  // Produto: rotação mínima que desacelera até quase parar (graus).
  // yaw = giro no plano da placa; pitch = inclinação no eixo do comprimento;
  // roll = uma ponta sobe e a outra desce.
  boardYaw: keyed([
    [0, 0],
    [7, 0],
    [11, 1.1, 'glide'],
    [15, 0.12, 'settle'],
    [18, 0, 'settle'],
  ]),
  boardPitch: keyed([
    [0, 0],
    [7, 0],
    [11, -3.2, 'glide'],
    [15, -0.35, 'settle'],
    [18, 0, 'settle'],
  ]),
  boardRoll: keyed([
    [0, 0],
    [7, 0],
    [11, 2.2, 'glide'],
    [15, 0.25, 'settle'],
    [18, 0, 'settle'],
  ]),
  // Flutuação (amplitude em unidades de cena).
  float: keyed([
    [0, 0],
    [12, 0],
    [15, 0.012, 'swell'],
  ]),

  // Deslocamento ótico da composição (fração da altura do quadro; + sobe a placa),
  // sem mexer na perspectiva: desce durante "Tudo começa por dentro." (texto no alto)
  // e sobe na assinatura para abrir espaço a "JFA PARTS".
  frameShift: keyed([
    [0, 0],
    [6.5, 0],
    [8.4, -0.06, 'glide'],
    [11.6, 0, 'glide'],
    [14.6, 0],
    [16.4, 0.06, 'glide'],
  ]),

  // Enquadramento fora de 16:9: 0 preserva a altura do quadro (macro, corta as laterais),
  // 1 preserva a largura (o produto inteiro sempre cabe).
  fit: keyed([
    [0, 0],
    [3, 0],
    [10, 1, 'glide'],
  ]),

  // SÓ EM TELAS VERTICAIS (9:16, 4:5): a câmera gira devagar até alinhar o comprimento
  // da placa com a altura do quadro (0 = sem giro, 1 = 90°)...
  portraitRoll: keyed([
    [0, 0],
    [3.4, 0],
    [10.4, 1, 'glide'],
  ]),
  // ...afasta um pouco (1 = enquadramento normal)...
  portraitZoom: keyed([
    [0, 1],
    [5, 1],
    [8.5, 1.42, 'glide'],
    [11, 1.22, 'glide'],
    [15, 1.16, 'soft'],
  ]),
  // ...e desloca a placa para abrir espaço aos textos: para baixo durante
  // "Tudo começa por dentro." (texto no alto) e para cima no hero e na assinatura.
  portraitShift: keyed([
    [0, 0],
    [6, 0],
    [8.5, -0.07, 'glide'],
    [10.6, -0.04, 'soft'],
    [12.5, 0.07, 'glide'],
    [15, 0.06, 'soft'],
    [16.4, 0.02, 'glide'],
  ]),
};
