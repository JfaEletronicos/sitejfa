/**
 * SISTEMA DE DISTORÇÃO (centralizado). Um único formato de valores serve à composição
 * inteira, a cada palavra e à placa (na placa, só como efeito de tela: o modelo 3D
 * nunca é deformado).
 *
 *   horizontalStretch / verticalStretch  escala extra (0,5 = +50%)
 *   skew                                 inclinação horizontal (graus)
 *   displacement                         deslocamento/onda (fração da largura do quadro)
 *   chromaticOffset                      separação de cor (px num quadro de 1080 px)
 *   blur                                 rastro/desfoque de movimento (px num quadro de 1080 px)
 *   intensity                            multiplicador do conjunto
 */
import { CAMERA } from './config';

export const DISTORTION = {
  horizontalStretch: 0,
  verticalStretch: 0,

  skew: 0,
  displacement: 0,

  chromaticOffset: 0,
  blur: 0,

  intensity: 1,
};

const KEYS = ['horizontalStretch', 'verticalStretch', 'skew', 'displacement', 'chromaticOffset', 'blur'];
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
// Queda rápida a partir do pico (impactos) e arco (sobe e desce).
const decay = (p, k) => Math.pow(1 - clamp01(p), k);
const arc = (p) => Math.sin(Math.PI * clamp01(p));

/** Ruído determinístico em [-1, 1] (o mesmo instante sempre dá o mesmo valor). */
export function noise(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * Presets: função do progresso do efeito (p, 0 a 1) e do tempo (t, s) → valores.
 * Distorção editorial, controlada: o "glitch" é curto e discreto de propósito.
 */
export const DISTORTION_PRESETS = {
  clean: () => ({ ...DISTORTION }),

  // Estica na horizontal e volta (entradas rápidas).
  stretch: (p) => ({
    ...DISTORTION,
    horizontalStretch: 0.6 * decay(p, 2),
    verticalStretch: -0.1 * decay(p, 2),
    skew: -7 * decay(p, 2),
    blur: 26 * decay(p, 3),
  }),

  // Comprime na horizontal (e alonga na vertical).
  squeeze: (p) => ({
    ...DISTORTION,
    horizontalStretch: -0.42 * decay(p, 2),
    verticalStretch: 0.24 * decay(p, 2),
  }),

  // Tremor curto (só em impactos). Amplitude vem de CAMERA.shakeIntensity.
  shake: (p, t) => {
    const step = Math.floor(t * 50);
    const k = decay(p, 1.6);
    return {
      ...DISTORTION,
      displacement: CAMERA.shakeIntensity * noise(step) * k,
      skew: 2.5 * noise(step + 7) * k,
    };
  },

  // Onda e inclinação que oscilam (palavras "vivas").
  warp: (p, t) => {
    const k = arc(p);
    return {
      ...DISTORTION,
      displacement: 0.012 * k * Math.sin(t * 17),
      skew: 9 * k * Math.sin(t * 11),
      verticalStretch: 0.12 * k * Math.sin(t * 7 + 1),
      chromaticOffset: 5 * k,
    };
  },

  // Saltos curtos e quantizados, com pouca intensidade.
  glitch: (p, t) => {
    const step = Math.floor(t * 24);
    const on = noise(step) > 0.15 ? 1 : 0;
    const k = decay(p, 1) * on;
    return {
      ...DISTORTION,
      horizontalStretch: 0.1 * noise(step + 1) * k,
      displacement: 0.018 * noise(step + 2) * k,
      chromaticOffset: 9 * k,
    };
  },

  // Batida: achata, separa cor e treme, tudo caindo rápido.
  impact: (p, t) => {
    const k = decay(p, 3.2);
    return {
      ...DISTORTION,
      horizontalStretch: -0.08 * k,
      verticalStretch: 0.2 * k,
      displacement: CAMERA.shakeIntensity * 0.8 * noise(Math.floor(t * 50)) * decay(p, 1.5),
      chromaticOffset: 12 * k,
      blur: 14 * k,
    };
  },

  // Borrão de velocidade: estica, inclina e deixa rastro (arco).
  smear: (p) => {
    const k = arc(p);
    return {
      ...DISTORTION,
      horizontalStretch: 0.7 * k,
      skew: -12 * k,
      blur: 90 * k,
    };
  },
};

/** Valores de um preset no progresso `p`, já multiplicados por `amount` e pela intensidade. */
export function evalPreset(name, p, t, amount = 1) {
  const d = DISTORTION_PRESETS[name](p, t);
  const k = amount * d.intensity;
  const out = { ...DISTORTION };
  KEYS.forEach((key) => {
    out[key] = d[key] * k;
  });
  return out;
}

/** Soma `b` (vezes `k`) em `a`. */
export function addDistortion(a, b, k = 1) {
  KEYS.forEach((key) => {
    a[key] += b[key] * k;
  });
  return a;
}

/** Cópia zerada para acumular. */
export const emptyDistortion = () => ({ ...DISTORTION });
