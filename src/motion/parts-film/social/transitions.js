/**
 * SISTEMA DE TRANSIÇÕES. Cada transição dura de 0,08 s a 0,35 s e fica centrada no
 * corte (p = 0,5): a primeira metade leva a cena que sai, a segunda traz a que entra.
 * Cada uma soma efeitos num acumulador (ver emptyFx): movimento da composição,
 * distorção, desfoque, giro de câmera e painéis de cor por cima do quadro.
 */
import { CAMERA } from './config';
import { addDistortion, emptyDistortion, evalPreset } from './distortion';

const easeIn = (x) => x * x * x;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const arc = (p) => Math.sin(Math.PI * Math.min(Math.max(p, 0), 1));
const half = (p) => (p < 0.5 ? { out: true, q: p / 0.5 } : { out: false, q: (p - 0.5) / 0.5 });

/** Acumulador de efeitos de um quadro. */
export function emptyFx() {
  return {
    // Composição inteira (fração do quadro, escala, graus).
    tx: 0,
    ty: 0,
    scale: 1,
    rot: 0,
    dist: emptyDistortion(),
    // Desfoque direcional da placa (px em 1080) e giro/zoom extra da câmera.
    blurX: 0,
    blurY: 0,
    camAz: 0,
    camZoom: 0,
    // Painéis por cima de tudo.
    flash: null, // { color, alpha }
    wipe: null, // { color, inset: [top, right, bottom, left] em % }
    mask: null, // { color, r (% da diagonal), x, y (%) }
  };
}

const whip = (dir) => (fx, p, o, k) => {
  const w = CAMERA.whipIntensity * k;
  const { out, q } = half(p);
  // Sai acelerando para um lado, a próxima cena chega do lado oposto freando.
  const travel = out ? easeIn(q) : -(1 - easeOut(q));
  const speed = arc(p);
  fx.tx += dir * 0.6 * travel * w;
  fx.camAz += -dir * 28 * travel * w;
  fx.blurX += dir * 150 * speed * w;
  addDistortion(fx.dist, evalPreset('smear', p, 0), 0.7 * w);
};

const zoom = (dirIn) => (fx, p, o, k) => {
  const z = CAMERA.zoomIntensity * k;
  const { out, q } = half(p);
  if (dirIn) fx.scale *= out ? 1 + 0.85 * easeIn(q) * z : 1 - 0.4 * (1 - expoOut(q)) * z;
  else fx.scale *= out ? 1 - 0.45 * easeIn(q) * z : 1 + 0.7 * (1 - expoOut(q)) * z;
  fx.camZoom += (dirIn ? -1 : 1) * 0.35 * arc(p) * z;
  fx.dist.chromaticOffset += 10 * arc(p) * k;
};

const wipe = (vertical) => (fx, p, o, k) => {
  if (k <= 0) return;
  const { out, q } = half(p);
  // Painel entra por baixo (ou pela esquerda) até cobrir a tela no corte e sai pelo
  // lado oposto depois dele. Valores = recorte (inset) do painel, em %.
  const entering = out ? 100 * (1 - easeIn(q)) : 0;
  const leaving = out ? 0 : 100 * expoOut(q);
  fx.wipe = {
    color: o.color || 'jfaBlue',
    inset: vertical ? [entering, 0, leaving, 0] : [0, entering, 0, leaving],
  };
};

export const TRANSITIONS = {
  // Corte seco (o padrão da peça).
  hardCut: () => {},

  // Chicote: tudo é arrastado para a esquerda/direita com rastro.
  whipLeft: whip(-1),
  whipRight: whip(1),

  zoomIn: zoom(true),
  zoomOut: zoom(false),

  // Cortina de cor (de baixo para cima / da esquerda para a direita).
  verticalWipe: wipe(true),
  horizontalWipe: wipe(false),

  // A palavra cresce até cobrir o quadro (a escala vem da própria palavra no roteiro);
  // a transição só garante a tela cheia na cor dela no instante do corte.
  textWipe: (fx, p, o, k) => {
    const a = p < 0.5 ? Math.pow(Math.max(0, (p - 0.3) / 0.2), 2) : 1 - expoOut((p - 0.5) / 0.5);
    fx.flash = { color: o.color || 'white', alpha: Math.min(1, a * Math.max(k, 0.6)) };
  },

  // A cena nova aparece por um círculo que cresce.
  maskReveal: (fx, p, o, k) => {
    if (p < 0.5 || k <= 0) return;
    fx.mask = { color: o.color || 'black', r: 160 * expoOut((p - 0.5) / 0.5), x: o.x ?? 50, y: o.y ?? 50 };
  },

  // Corte com batida de escala.
  scaleCut: (fx, p, o, k) => {
    const z = CAMERA.zoomIntensity * k;
    const { out, q } = half(p);
    fx.scale *= out ? 1 + 0.12 * easeIn(q) * z : 1 + 0.3 * (1 - expoOut(q)) * z;
    addDistortion(fx.dist, evalPreset('impact', out ? 1 : q, q), 0.6 * k);
  },

  // Distorção forte só no instante do corte.
  distortionCut: (fx, p, o, k) => {
    const s = arc(p);
    fx.dist.horizontalStretch += 0.85 * s * k;
    fx.dist.skew += 14 * s * k * (o.dir || 1);
    fx.dist.chromaticOffset += 16 * s * k;
    fx.dist.blur += 40 * s * k;
    addDistortion(fx.dist, evalPreset('glitch', p, p * 0.35), 0.5 * k);
    fx.blurX += 60 * s * k;
  },

  // A placa atravessa o quadro na frente do corte (o movimento está no plano 3D).
  productPass: (fx, p, o, k) => {
    const s = arc(p);
    fx.blurX += (o.dir || -1) * 170 * s * k;
    fx.dist.horizontalStretch += 0.22 * s * k;
    fx.tx += (o.dir || -1) * 0.03 * s * k;
  },

  // Sequência de cores chapadas (ex.: branco → azul → preto) cobrindo o corte.
  colorFlash: (fx, p, o, k) => {
    if (k <= 0) return;
    const seq = o.colors || ['white', 'jfaBlue', 'black'];
    const i = Math.min(seq.length - 1, Math.floor(p * seq.length));
    // Some no fim para revelar a cena que entra.
    const alpha = p > 0.86 ? 1 - (p - 0.86) / 0.14 : 1;
    fx.flash = { color: seq[i], alpha: alpha * Math.min(1, k) };
  },
};
