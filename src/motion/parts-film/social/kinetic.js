/**
 * Variante "social-kinetic": peça vertical de tipografia cinética com a placa 3D real.
 *
 * Camadas do quadro (de trás para a frente):
 *   fundo (cor chapada) → composição [blocos de cor → palavras de trás → placa 3D (canvas
 *   transparente) → palavras da frente] → painéis de transição (flash, cortina, máscara).
 * A composição inteira recebe as distorções globais; cada palavra recebe as suas; a
 * placa recebe as dela no shader (efeito de tela, sem deformar o modelo).
 *
 * Tudo é função pura do tempo: config.js (controles), score.js (roteiro),
 * distortion.js e transitions.js (sistemas).
 */
import './kinetic.css';
import { EASE, spline } from '../tracks';
import {
  SOCIAL_MOTION_CONFIG as CFG,
  TYPOGRAPHY as TYPO,
  CAMERA as CAM,
  COLORS,
  BASE_DURATION,
  readOverrides,
} from './config';
import { addDistortion, emptyDistortion, evalPreset } from './distortion';
import { TRANSITIONS, emptyFx } from './transitions';
import { SCENES, SHOTS, WORDS, BACKGROUND, BLOCKS, CUTS, FX, CUES, CAMERA_RIG } from './score';

// Largura de referência dos tamanhos de TYPOGRAPHY (px).
const REF_WIDTH = 390;
// Valores padrão: as intensidades valem relativas a eles (padrão = roteiro como desenhado).
const DEFAULTS = { ...CFG };

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const DEG = Math.PI / 180;

// Câmera virtual única: move a placa 3D e os planos de texto juntos.
const rig = spline(CAMERA_RIG, ['yaw', 'pitch', 'dolly', 'truck']);
// Profundidade de cada camada de texto (fração da altura do quadro; negativo = atrás
// da placa). Multiplicada por CAMERA.parallax / 0,15 (0 = sem profundidade).
const LAYER_DEPTH = { far: -0.9, back: -0.1, front: 0.1 };
const BASE_PARALLAX = 0.15;
const lerp = (a, b, k) => a + (b - a) * k;
const lerpArr = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const CURVES = {
  ...EASE,
  expoOut: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  expoIn: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
  easeIn: (x) => x * x * x,
};
const curve = (name) => CURVES[name] || EASE.soft;

/** Intensidade relativa ao padrão (1 = como desenhado, 0 = desligado). */
const K = (key) => (DEFAULTS[key] ? CFG[key] / DEFAULTS[key] : CFG[key]);

// Luz por plano (campos do palco 3D).
const LIGHTS = {
  // Recorte forte, contraluz e brilho (planos rápidos sobre preto).
  punch: {
    keyLux: 7.6,
    keyAngle: 30,
    keyAz: -38,
    keyEl: 52,
    rimLux: 2.2,
    fill: 0.1,
    env: 0.42,
    bloom: 0.04,
    exposure: 1.0,
  },
  // Macro: luz recortada e profundidade de campo.
  macro: {
    keyLux: 5.6,
    keyAngle: 16,
    keyAz: -30,
    keyEl: 56,
    rimLux: 1.5,
    fill: 0.03,
    env: 0.14,
    bloom: 0.07,
    exposure: 1.0,
  },
  // Sobre fundo azul ou branco: mais luz e preenchimento.
  onColor: {
    keyLux: 8.2,
    keyAngle: 34,
    keyAz: -35,
    keyEl: 60,
    rimLux: 2.0,
    fill: 0.22,
    env: 0.5,
    bloom: 0.02,
    exposure: 1.02,
  },
  // Produto em destaque: recorte de estúdio, contraluz e reflexo controlado.
  feature: {
    keyLux: 8,
    keyAngle: 32,
    keyAz: -40,
    keyEl: 54,
    rimLux: 2.0,
    fill: 0.12,
    env: 0.38,
    bloom: 0.04,
    exposure: 1.02,
  },
  // Hero: o estúdio do filme premium.
  hero: {
    keyLux: 7.6,
    keyAngle: 24,
    keyAz: -40,
    keyEl: 52,
    rimLux: 1.7,
    fill: 0.12,
    env: 0.58,
    bloom: 0.035,
    exposure: 1.02,
  },
};

// ---------------------------------------------------------------------------
// Cores (colorIntensity: 0 = só preto e branco)
// ---------------------------------------------------------------------------
const BLUES = new Set(['deepBlue', 'jfaBlue', 'electricBlue']);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb = (c) => `rgb(${c.map((v) => Math.round(v)).join(',')})`;

/** Cor de fundo/bloco/flash: os azuis caem para o preto quando a cor é reduzida. */
function surfaceColor(key) {
  if (!BLUES.has(key)) return COLORS[key];
  return rgb(lerpArr(hex(COLORS.black), hex(COLORS[key]), clamp01(K('colorIntensity'))));
}
/** Cor de texto: os azuis caem para o branco. */
function inkColor(key) {
  if (!BLUES.has(key)) return COLORS[key];
  return rgb(lerpArr(hex(COLORS.white), hex(COLORS[key]), clamp01(K('colorIntensity'))));
}

// ---------------------------------------------------------------------------
// Palavras
// ---------------------------------------------------------------------------
function keyedScale(keys, lt) {
  if (lt <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (lt <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1, c] = keys[i];
      return lerp(v0, v1, curve(c)((lt - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

/** Partes da palavra (uma só, por padrão, com o texto e o estilo da própria palavra). */
const partsOf = (w) =>
  w.parts || [
    {
      text: w.text,
      font: w.font,
      weight: w.weight,
      italic: w.italic,
      color: w.color,
      outline: w.outline,
      tracking: w.tracking,
    },
  ];
const isMask = (w) => w.in.type === 'mask' || w.out.type === 'mask';
const SINGLE_WEIGHT = new Set(['wide', 'condensed', 'serif']);
/** Tamanho de referência (px numa tela de 390 px): número ou huge/large/medium. */
const sizeOf = (w) => (typeof w.size === 'number' ? w.size : TYPO[`${w.size}Size`]);

/** Escala com pico (overshoot) e assentamento: from → peak → 1. */
function popScale(k, from, peak) {
  if (k < 0.62) return lerp(from, peak, CURVES.expoOut(k / 0.62));
  return lerp(peak, 1, EASE.soft((k - 0.62) / 0.38));
}

/**
 * Pose de uma palavra num instante (px no quadro), ou null fora da janela dela.
 * @param {object} w Definição (score.js) · @param {object} m Medidas (largura/altura natural, ajuste)
 */
function wordPose(w, tb, m, frame) {
  const [t0, t1] = w.t;
  if (tb < t0 || tb >= t1) return null;
  // Troca de fonte: várias versões da mesma palavra no mesmo lugar, em fusão rápida.
  const alpha = w.alphaAt ? w.alphaAt(tb) : 1;
  if (alpha <= 0.001) return null;
  const { width: W, height: H } = frame;
  const lt = tb - t0;
  const pl = lt / (t1 - t0);
  const ti = K('typographyIntensity');
  const peak = Math.min(1 + (TYPO.overshoot - 1) * ti, TYPO.maxScale);
  const maxPeak = 1 + (TYPO.maxScale - 1) * ti;

  let dx = 0;
  let dy = 0;
  let scale = 1;
  let sx = m.sx;
  let sy = m.sy;
  let opacity = alpha * (w.opacity ?? 1);

  // Entrada.
  const inDur = w.in.dur ?? TYPO.entranceDuration;
  const ki = clamp01(lt / inDur);
  const far = 1.15 * ti;
  switch (w.in.type) {
    case 'slideLeft':
      dx += (1 - CURVES.expoOut(ki)) * far * W;
      break;
    case 'slideRight':
      dx -= (1 - CURVES.expoOut(ki)) * far * W;
      break;
    case 'slideUp':
      dy += (1 - CURVES.expoOut(ki)) * far * H;
      break;
    case 'slideDown':
      dy -= (1 - CURVES.expoOut(ki)) * far * H;
      break;
    case 'zoom':
      scale *= popScale(ki, 1 - 0.5 * Math.min(ti, 1), peak);
      break;
    case 'explode':
      scale *= popScale(ki, 1 - 0.88 * Math.min(ti, 1), maxPeak);
      break;
    case 'stretch':
      sx *= popScale(ki, 1 - 0.88 * Math.min(ti, 1), peak + 0.15 * ti);
      sy *= lerp(1 + 0.5 * ti, 1, CURVES.expoOut(ki));
      break;
    case 'squeeze':
      sx *= lerp(1 + 1.4 * ti, 1, CURVES.expoOut(ki));
      sy *= lerp(1 - 0.4 * Math.min(ti, 1), 1, CURVES.expoOut(ki));
      break;
    case 'rise':
      opacity *= EASE.soft(ki);
      dy += (1 - EASE.enter(ki)) * 0.035 * H * ti;
      break;
    case 'mask':
      // Cada parte sobe de dentro da própria linha (calculado abaixo).
      break;
    case 'none':
      // Aparece no lugar, sem animação (troca de fonte).
      break;
    default:
      // Corte: já entra grande e assenta.
      scale *= lerp(peak, 1, CURVES.expoOut(ki));
  }

  // Saída.
  const outDur = w.out.dur ?? TYPO.exitDuration;
  const ko = clamp01((tb - (t1 - outDur)) / outDur);
  if (ko > 0) {
    const e = CURVES.easeIn(ko);
    if (w.out.type === 'fade') opacity *= 1 - EASE.soft(ko);
    else if (w.out.type === 'slideLeft') dx -= e * far * W;
    else if (w.out.type === 'slideRight') dx += e * far * W;
    else if (w.out.type === 'slideUp') dy -= e * far * H;
    else if (w.out.type === 'slideDown') dy += e * far * H;
  }

  // Máscara: cada parte sobe de dentro da linha (com o atraso dela) e sai descendo.
  const partY = partsOf(w).map((part, i) => {
    const h = (m.ph && m.ph[i]) || m.nh;
    let y = 0;
    if (w.in.type === 'mask') {
      const k = clamp01((lt - (part.delay || 0)) / inDur);
      y += (1 - CURVES.expoOut(k)) * h * 1.04;
    }
    if (w.out.type === 'mask') {
      // Sai descendo para dentro da linha: a base some primeiro e os acentos por
      // último (nunca aparece "NAO" sem o til).
      const k = clamp01((tb - (t1 - outDur) + (part.delay || 0) * 0.5) / outDur);
      y += CURVES.easeIn(k) * h * 1.04;
    }
    return y;
  });

  // Fusões no começo e no fim da vida da palavra (as cenas se sobrepõem em vez de
  // uma esperar a outra acabar). Máscaras ganham fusão automática.
  const fadeIn = w.fade?.[0] ?? (w.in.type === 'mask' ? inDur * 0.6 : 0);
  const fadeOut = w.fade?.[1] ?? (w.out.type === 'mask' ? outDur : 0);
  if (fadeIn > 0) opacity *= EASE.soft(clamp01(lt / fadeIn));
  if (fadeOut > 0) opacity *= EASE.soft(clamp01((t1 - tb) / fadeOut));

  // Deriva contínua (micro movimento), crescimento e estiramento ao longo da vida da palavra.
  dx += (w.drift[0] / 100) * W * pl * ti;
  dy += (w.drift[1] / 100) * H * pl * ti;
  scale *= 1 + Math.min(w.grow * pl * ti, TYPO.maxScale - 1);
  if (w.stretch) sx *= 1 + w.stretch * pl * ti;
  if (w.scaleKeys) scale = keyedScale(w.scaleKeys, lt);

  // Distorção própria da palavra.
  const d = emptyDistortion();
  w.fx.forEach((f) => {
    const p = (lt - f.at) / f.dur;
    if (p >= 0 && p <= 1)
      addDistortion(d, evalPreset(f.preset, p, tb, f.amount ?? 1), K('distortionIntensity'));
  });
  sx *= 1 + d.horizontalStretch;
  sy *= 1 + d.verticalStretch;
  if (!w.split) dx += d.displacement * W;

  return {
    x: (w.x / 100) * W + dx,
    y: (w.y / 100) * H + dy,
    scale,
    sx,
    sy,
    rot: w.rotate,
    skew: d.skew,
    opacity,
    disp: d.displacement,
    chroma: d.chromaticOffset,
    blur: d.blur,
    partY,
  };
}

// ---------------------------------------------------------------------------
// Variante
// ---------------------------------------------------------------------------
export default {
  id: 'social-kinetic',
  format: '9x16',
  transparent: true,

  mount({ frameEl, params }) {
    readOverrides(params);
    frameEl.querySelector('.pf-copy').hidden = true;
    const canvas = frameEl.querySelector('.pf-canvas');
    const el = (cls, parent, tag = 'div') => {
      const node = document.createElement(tag);
      node.className = cls;
      parent.appendChild(node);
      return node;
    };

    // Camadas.
    const base = el('sk-base', frameEl);
    frameEl.insertBefore(base, canvas);
    const comp = document.createElement('div');
    comp.className = 'sk-comp';
    frameEl.insertBefore(comp, canvas);
    const blocksLayer = el('sk-blocks', comp);
    const far = el('sk-type sk-far', comp);
    const back = el('sk-type sk-back', comp);
    comp.appendChild(canvas);
    const front = el('sk-type sk-front', comp);
    const overlay = document.createElement('div');
    overlay.className = 'sk-overlay';
    frameEl.insertBefore(overlay, frameEl.querySelector('.pf-loader'));
    const wipeEl = el('sk-wipe', overlay);
    const maskEl = el('sk-mask', overlay);
    const flashEl = el('sk-flash', overlay);
    // Título acessível (o quadro é decorativo para leitores de tela).
    const title = el('pf-sr-only', frameEl, 'h1');
    title.textContent = 'JFA Parts: você não vê, mas ela está em tudo. Tudo começa por dentro.';

    const blockEls = BLOCKS.map(() => el('sk-block', blocksLayer));

    // Cada palavra (ou linha) tem uma ou mais partes, cada uma com a sua fonte, peso,
    // estilo e cor, alinhadas na mesma linha de base.
    const words = WORDS.map((w) => {
      const layer = w.layer === 'front' ? front : w.layer === 'far' ? far : back;
      const node = el(`sk-word${isMask(w) ? ' is-mask' : ''}`, layer);
      node.setAttribute('aria-hidden', 'true');
      const parts = partsOf(w).map((part) => {
        const wrap = el(
          `sk-part is-${part.font || 'sans'}${part.outline ? ' is-outline' : ''}${part.italic ? ' is-italic' : ''}`,
          node,
          'span',
        );
        const ink = el('sk-ink', wrap, 'span');
        ink.dataset.text = part.text;
        if (w.split) {
          [...part.text].forEach((ch) => {
            el('sk-letter', ink, 'span').textContent = ch;
          });
        } else {
          ink.textContent = part.text;
        }
        return { part, wrap, ink, letters: w.split ? [...ink.children] : null };
      });
      return { w, node, parts, m: { sx: 1, sy: 1, nw: 1, nh: 1, ox: 0, oy: 0 }, shown: false };
    });

    const frame = { width: 1080, height: 1920 };
    let stage = null;
    let needsMeasure = true;

    /** Mede cada palavra no tamanho atual do quadro e calcula o ajuste de largura. */
    function measure() {
      const u = frame.width / REF_WIDTH;
      words.forEach((item) => {
        const { w, node } = item;
        const size = sizeOf(w) * u;
        node.style.fontSize = `${size}px`;
        item.parts.forEach(({ part, wrap }, i) => {
          wrap.style.fontSize = `${size * (part.scale || 1)}px`;
          // Stretch Pro, Anton e Instrument Serif têm um peso só.
          wrap.style.fontWeight = SINGLE_WEIGHT.has(part.font) ? 400 : part.weight || TYPO.weight;
          wrap.style.letterSpacing = `${(part.tracking ?? TYPO.tracking) * u}px`;
          wrap.style.marginLeft = i > 0 ? `${part.gap ?? 0.26}em` : '0';
          wrap.style.setProperty('--c', inkColor(part.color || 'white'));
        });
        const nw = node.offsetWidth || 1;
        const nh = node.offsetHeight || 1;
        let sx = 1;
        let sy = w.sy;
        // fitY: altura alvo (fração do quadro), esticando só na vertical.
        if (w.fitY) sy = (w.fitY * frame.height) / nh;
        if (w.fit) {
          const target = w.fit * (w.fitAxis === 'y' ? frame.height : frame.width);
          // "stretch": só a largura se ajusta (letras esticadas/comprimidas);
          // "uniform": a palavra inteira escala.
          if (w.fitMode === 'uniform') {
            sx = target / nw;
            sy *= sx;
          } else {
            sx = target / nw;
          }
        }
        const ox = w.align === 'left' ? 0 : w.align === 'right' ? nw : nw / 2;
        const origin = w.origin ? [(w.origin[0] / 100) * nw, (w.origin[1] / 100) * nh] : [ox, nh / 2];
        node.style.transformOrigin = `${origin[0]}px ${origin[1]}px`;
        item.m = {
          sx,
          sy,
          nw,
          nh,
          ox: origin[0],
          oy: origin[1],
          ph: item.parts.map((pt) => pt.wrap.offsetHeight),
        };
      });
      needsMeasure = false;
    }

    const durationScale = () => CFG.duration / BASE_DURATION;
    const cues = CUES.map((c) => ({ ...c }));
    function syncCues() {
      const k = durationScale();
      cues.forEach((c, i) => {
        c.t = CUES[i].t * k;
        if (CUES[i].until) c.until = CUES[i].until * k;
      });
    }
    syncCues();

    /** Efeitos de transição e distorções globais ativos no instante `tb`. */
    function effectsAt(tb) {
      const fx = emptyFx();
      const kt = K('transitionIntensity');
      CUTS.forEach((c) => {
        const p = (tb - (c.t - c.dur / 2)) / c.dur;
        if (p >= 0 && p <= 1) TRANSITIONS[c.type](fx, p, c, kt);
      });
      FX.forEach((f) => {
        const p = (tb - f.t) / f.dur;
        if (p >= 0 && p <= 1) addDistortion(fx.dist, evalPreset(f.preset, p, tb, f.amount ?? 1));
      });
      const kd = K('distortionIntensity');
      Object.keys(fx.dist).forEach((key) => {
        if (key !== 'intensity') fx.dist[key] *= kd;
      });
      return fx;
    }

    const shotAt = (tb) => SHOTS.find((s) => tb >= s.t[0] && tb < s.t[1]) || SHOTS[SHOTS.length - 1];

    /** Estado do palco 3D (mesmo formato do filme premium, com os campos extras). */
    /** Câmera virtual no instante `tb` (intensidade pela câmera do config). */
    function rigAt(tb) {
      const r = rig(tb);
      const k = K('cameraIntensity');
      return {
        yaw: r.yaw * k,
        pitch: r.pitch * k,
        dolly: r.dolly * k * CAM.zoomIntensity,
        truck: [r.truck[0] * k, r.truck[1] * k],
      };
    }

    function stageState(tb, fx, cam) {
      const shot = shotAt(tb);
      if (shot.hidden) return { hidden: true, pan: [0, 0] };
      const [t0, t1] = shot.t;
      const p = clamp01((tb - t0) / (t1 - t0));
      const e = curve(shot.ease)(p);
      const kc = K('cameraIntensity') * e;
      const kz = kc * CAM.zoomIntensity;
      const kp = K('productIntensity') * e;
      const [a, b] = shot.cam;
      const target = lerpArr(a.target, b.target, kc);
      const dist = Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), kz) + fx.camZoom) * (1 - cam.dolly);
      const light = LIGHTS[shot.light] || LIGHTS.punch;
      const boardA = shot.board ? shot.board[0] : { rot: [0, 0, 0] };
      const boardB = shot.board ? shot.board[1] : boardA;
      const rot = lerpArr(boardA.rot, boardB.rot, kp);
      const shift = shot.shift ? lerpArr(shot.shift[0], shot.shift[1], kp) : [0, 0];
      const pan = shot.pan ? lerpArr(shot.pan[0], shot.pan[1], e) : [0, 0];
      const sweep = shot.sweep ? lerp(shot.sweep[0], shot.sweep[1], p) : 40 - 80 * p;
      const blurOn = CFG.motionBlur ? 1 : 0;
      const shotBlur = shot.blur || [0, 0];
      const jitter = fx.dist.displacement;
      return {
        hidden: false,
        cam: {
          target,
          az: lerp(a.az, b.az, kc) + fx.camAz,
          el: lerp(a.el, b.el, kc),
          logDist: Math.log(dist),
          fov: CAM.fov * lerp(a.lens, b.lens, e),
          roll: lerp(a.roll, b.roll, kc),
        },
        roll: 0,
        fit: 0,
        zoomOut: 1,
        shiftX: shift[0] + pan[0] + cam.truck[0] + jitter,
        shift: shift[1] + pan[1] + cam.truck[1],
        orbit: { yaw: cam.yaw, pitch: cam.pitch },
        fade: 1,
        aperture: shot.aperture || 0,
        keyLux: light.keyLux,
        keyAngle: light.keyAngle,
        keyLead: 0,
        keyDist: Math.min(Math.max(dist * 1.15, 1.0), 9),
        keyAz: light.keyAz,
        keyEl: light.keyEl,
        rimLux: light.rimLux,
        fill: light.fill,
        env: light.env,
        sweep,
        bgGlow: 0,
        bloom: light.bloom,
        exposure: light.exposure,
        boardYaw: rot[0],
        boardPitch: rot[1],
        boardRoll: rot[2],
        boardPos: [0, 0, 0],
        floatY: 0,
        pan,
        fx: {
          wave: jitter * 0.35,
          waveFreq: 26,
          wavePhase: tb * 40,
          chroma: Math.max(0, fx.dist.chromaticOffset * 0.6),
          blur: [
            (fx.blurX + shotBlur[0] * K('productIntensity') + fx.dist.blur * 0.4) * blurOn,
            (fx.blurY + shotBlur[1] * K('productIntensity')) * blurOn,
          ],
        },
      };
    }

    function backgroundAt(tb) {
      let key = BACKGROUND[0][1];
      BACKGROUND.forEach(([t, k]) => {
        if (tb >= t) key = k;
      });
      return key;
    }

    function evaluate(tb) {
      const fx = effectsAt(tb);
      const cam = rigAt(tb);
      return { tb, fx, cam, stage: stageState(tb, fx, cam) };
    }

    function paint({ tb, fx, cam, stage: st }) {
      if (needsMeasure) measure();
      const { width: W, height: H } = frame;

      // Fundo.
      const bg = backgroundAt(tb);
      if (bg === 'hero' || bg === 'glow') {
        // Radial azul profundo atrás da placa (no centro dela).
        const at = bg === 'hero' ? '50% 44%' : '50% 60%';
        base.style.background = `radial-gradient(120% 62% at ${at}, ${surfaceColor('deepBlue')} 0%, ${COLORS.black} 72%)`;
      } else {
        base.style.background = surfaceColor(bg);
      }

      // Composição: transições + distorção global.
      const d = fx.dist;
      comp.style.transform =
        `translate3d(${(fx.tx * W + d.displacement * W).toFixed(2)}px, ${(fx.ty * H).toFixed(2)}px, 0) ` +
        `rotate(${fx.rot.toFixed(3)}deg) scale(${fx.scale.toFixed(4)}) ` +
        `scale(${(1 + d.horizontalStretch).toFixed(4)}, ${(1 + d.verticalStretch).toFixed(4)}) ` +
        `skewX(${d.skew.toFixed(3)}deg)`;

      // Blocos de cor.
      BLOCKS.forEach((b, i) => {
        const node = blockEls[i];
        const on = tb >= b.t[0] && tb < b.t[1];
        node.style.visibility = on ? 'visible' : 'hidden';
        if (!on) return;
        // Sem intensidade tipográfica o bloco já aparece no lugar final.
        const dur = b.dur * K('typographyIntensity');
        const k = dur > 0 ? CURVES.expoOut(clamp01((tb - b.t[0]) / dur)) : 1;
        const r = lerpArr(b.from, b.to, k);
        node.style.background = surfaceColor(b.color);
        node.style.left = `${r[0]}%`;
        node.style.top = `${r[1]}%`;
        node.style.width = `${r[2]}%`;
        node.style.height = `${r[3]}%`;
      });

      // Câmera virtual nas camadas de texto: cada camada é um plano numa profundidade,
      // visto pela mesma perspectiva da câmera 3D (CAMERA.fov). Deslocar, aproximar e
      // girar a câmera dá paralaxe real entre fundo, texto e placa.
      const pan = st.pan || [0, 0];
      const P = H / 2 / Math.tan((CAM.fov / 2) * DEG);
      const depthK = CAM.parallax / BASE_PARALLAX;
      const tx = (cam.truck[0] + pan[0]) * W;
      const ty = -(cam.truck[1] + pan[1]) * H;
      [
        [far, LAYER_DEPTH.far],
        [back, LAYER_DEPTH.back],
        [front, LAYER_DEPTH.front],
      ].forEach(([layer, depth]) => {
        const z = depth * depthK * H;
        // Escala que compensa a profundidade: em repouso, cada plano fica do tamanho desenhado.
        const k = (P - z) / P;
        layer.style.transform =
          `perspective(${P.toFixed(1)}px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
          `translateZ(${(cam.dolly * P).toFixed(2)}px) rotateX(${cam.pitch.toFixed(3)}deg) ` +
          `rotateY(${cam.yaw.toFixed(3)}deg) translateZ(${z.toFixed(2)}px) scale(${k.toFixed(4)})`;
      });

      // Palavras.
      const u = W / 1080;
      const blurOn = CFG.motionBlur;
      words.forEach((item) => {
        const { w, node, m } = item;
        const pz = wordPose(w, tb, m, frame);
        if (!pz) {
          if (item.shown) {
            node.style.visibility = 'hidden';
            item.shown = false;
          }
          return;
        }
        if (!item.shown) {
          node.style.visibility = 'visible';
          item.shown = true;
        }
        node.style.opacity = pz.opacity.toFixed(3);
        node.style.transform =
          `translate3d(${(pz.x - m.ox).toFixed(2)}px, ${(pz.y - m.oy).toFixed(2)}px, 0) ` +
          `rotate(${pz.rot}deg) skewX(${pz.skew.toFixed(3)}deg) ` +
          `scale(${(pz.scale * pz.sx).toFixed(4)}, ${(pz.scale * pz.sy).toFixed(4)})`;

        // Separação de cor nas palavras: azuis da marca, não RGB.
        const ch = (pz.chroma + d.chromaticOffset) * u;
        node.style.textShadow =
          ch > 0.4
            ? `${(-ch).toFixed(1)}px 0 0 ${surfaceColor('jfaBlue')}, ${ch.toFixed(1)}px 0 0 ${surfaceColor('electricBlue')}`
            : 'none';

        // Rastro de movimento: velocidade da palavra entre este quadro e o anterior.
        let gx = 0;
        let gy = 0;
        if (blurOn) {
          const prev = wordPose(w, tb - 1 / 60, m, frame);
          if (prev) {
            gx = (prev.x - pz.x) * 0.8 - (pz.blur + d.blur) * u * 0.35;
            gy = (prev.y - pz.y) * 0.8;
          }
        }
        // O rastro vive no espaço já escalado da palavra e fica curto (menos de um
        // terço de letra), para borrar sem formar letras repetidas.
        const sxTot = pz.scale * pz.sx || 1;
        const syTot = pz.scale * pz.sy || 1;
        const lim = 0.14 * sizeOf(w) * (W / REF_WIDTH) * Math.max(sxTot, 0.3);
        gx = Math.max(-lim, Math.min(lim, gx));
        gy = Math.max(-lim, Math.min(lim, gy));
        const visible = Math.abs(gx) + Math.abs(gy) > 2;
        node.style.setProperty('--gx', `${(gx / sxTot).toFixed(2)}px`);
        node.style.setProperty('--gy', `${(gy / syTot).toFixed(2)}px`);
        node.style.setProperty('--go', visible ? '1' : '0');

        item.parts.forEach((pt, i) => {
          pt.ink.style.transform = `translate3d(0, ${(pz.partY[i] || 0).toFixed(2)}px, 0)`;
          if (pt.letters) {
            pt.letters.forEach((s, j) => {
              const off = pz.disp * W * Math.sin(j * 1.9 + tb * 24);
              s.style.transform = `translate3d(0, ${off.toFixed(2)}px, 0)`;
            });
          }
        });
      });

      // Painéis de transição.
      if (fx.wipe) {
        const [t, r, b, l] = fx.wipe.inset;
        wipeEl.style.visibility = 'visible';
        wipeEl.style.background = surfaceColor(fx.wipe.color);
        wipeEl.style.clipPath = `inset(${t}% ${r}% ${b}% ${l}%)`;
      } else {
        wipeEl.style.visibility = 'hidden';
      }
      if (fx.mask) {
        maskEl.style.visibility = 'visible';
        maskEl.style.background = surfaceColor(fx.mask.color);
        const r = `${fx.mask.r.toFixed(2)}%`;
        const g = `radial-gradient(circle at ${fx.mask.x}% ${fx.mask.y}%, transparent ${r}, #000 calc(${r} + 1px))`;
        maskEl.style.webkitMaskImage = g;
        maskEl.style.maskImage = g;
      } else {
        maskEl.style.visibility = 'hidden';
      }
      if (fx.flash && fx.flash.alpha > 0.001) {
        flashEl.style.visibility = 'visible';
        flashEl.style.background = surfaceColor(fx.flash.color);
        flashEl.style.opacity = fx.flash.alpha.toFixed(3);
      } else {
        flashEl.style.visibility = 'hidden';
      }
    }

    // Controles do modo debug (?debug): mudam o filme na hora.
    const num = (obj, key, label, min, max, step, after) => ({
      label,
      min,
      max,
      step,
      get: () => obj[key],
      set: (v) => {
        obj[key] = v;
        if (after) after();
      },
    });
    const remeasure = () => {
      needsMeasure = true;
    };
    const controls = [
      num(CFG, 'duration', 'duração', 18, 21, 0.5, syncCues),
      num(CFG, 'typographyIntensity', 'tipografia', 0, 2, 0.05),
      num(CFG, 'distortionIntensity', 'distorção', 0, 1.6, 0.05),
      num(CFG, 'transitionIntensity', 'transições', 0, 2, 0.05),
      num(CFG, 'cameraIntensity', 'câmera', 0, 1.8, 0.05),
      num(CFG, 'productIntensity', 'produto', 0, 1.6, 0.05),
      num(CFG, 'colorIntensity', 'cor', 0, 0.8, 0.05),
      { label: 'motion blur', type: 'boolean', get: () => CFG.motionBlur, set: (v) => (CFG.motionBlur = v) },
      { label: 'loop', type: 'boolean', get: () => CFG.loop, set: (v) => (CFG.loop = v) },
      num(TYPO, 'hugeSize', 'huge', 100, 200, 2, remeasure),
      num(TYPO, 'largeSize', 'large', 70, 160, 2, remeasure),
      num(TYPO, 'mediumSize', 'medium', 40, 100, 2, remeasure),
      num(TYPO, 'weight', 'peso', 700, 900, 100, remeasure),
      num(TYPO, 'tracking', 'tracking', -8, 4, 0.5, remeasure),
      num(TYPO, 'maxScale', 'maxScale', 1, 2, 0.05),
      num(TYPO, 'entranceDuration', 'entrada', 0.08, 0.4, 0.01),
      num(TYPO, 'exitDuration', 'saída', 0.06, 0.3, 0.01),
      num(TYPO, 'overshoot', 'overshoot', 1, 1.4, 0.01),
      num(CAM, 'fov', 'fov', 24, 60, 1),
      num(CAM, 'zoomIntensity', 'zoom', 0, 2, 0.05),
      num(CAM, 'whipIntensity', 'whip', 0, 2, 0.05),
      num(CAM, 'shakeIntensity', 'shake', 0, 0.06, 0.002),
      num(CAM, 'parallax', 'paralaxe', 0, 0.5, 0.01),
    ];

    const sample = 'VOCÊ NÃO VÊ. ÇÃ';
    const fontsReady = Promise.all([
      ...['300', '700', '800', '900'].map((wgt) => document.fonts?.load(`${wgt} 100px Poppins`, sample)),
      ...['300', '800'].map((wgt) => document.fonts?.load(`italic ${wgt} 100px Poppins`, sample)),
      document.fonts?.load('100px "Stretch Pro"', `${sample} ENERGIA JFA PARTS`),
      document.fonts?.load('100px Anton', sample),
      document.fonts?.load('italic 100px "Instrument Serif"', sample),
      document.fonts?.load('100px "Instrument Serif"', sample),
    ]).catch(() => {});

    return {
      get duration() {
        return CFG.duration;
      },
      get acts() {
        const k = durationScale();
        return SCENES.map((s) => ({ ...s, start: s.start * k, end: s.end * k }));
      },
      cues,
      get stillTime() {
        return 19 * durationScale();
      },
      get autoplay() {
        return CFG.autoplay;
      },
      get loop() {
        return CFG.loop;
      },
      get debug() {
        return CFG.debug;
      },
      controls,
      ready: fontsReady,
      bind(s) {
        stage = s;
      },
      resize(width, height) {
        frame.width = width;
        frame.height = height;
        needsMeasure = true;
      },
      state: (t) => evaluate(t / durationScale()).stage,
      draw(t) {
        const ev = evaluate(t / durationScale());
        stage.render(ev.stage);
        paint(ev);
      },
      /** Sem WebGL: fica a assinatura tipográfica. */
      fallback() {
        frameEl.classList.add('sk-fallback');
        frame.width = frameEl.clientWidth || frame.width;
        frame.height = frameEl.clientHeight || frame.height;
        needsMeasure = true;
        paint({ tb: 19, fx: emptyFx(), cam: rigAt(19), stage: { pan: [0, 0] } });
      },
    };
  },
};
