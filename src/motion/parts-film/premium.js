/**
 * Variante "premium" (padrão): filme de produto "Tudo começa por dentro." (~18 s).
 * Tempos e movimentos em timeline.js; aqui só o estado de cada instante e os textos.
 */
import { DURATION, ACTS, COPY, SOUND_CUES, camera, tracks } from './timeline';
import { cueState } from './tracks';

/**
 * Estado completo de um instante do filme (função pura do tempo).
 * @param {number} t Tempo em segundos.
 * @param {boolean} portrait Quadro vertical (gira a câmera para alinhar a placa).
 */
export function frameState(t, portrait) {
  return {
    t,
    cam: camera(t),
    roll: portrait ? tracks.portraitRoll(t) : 0,
    fit: tracks.fit(t),
    zoomOut: portrait ? tracks.portraitZoom(t) : 1,
    shift: tracks.frameShift(t) + (portrait ? tracks.portraitShift(t) : 0),
    fade: tracks.fade(t),
    aperture: tracks.aperture(t),
    keyLux: tracks.keyLux(t),
    keyAngle: tracks.keyAngle(t),
    keyLead: tracks.keyLead(t),
    keyDist: tracks.keyDist(t),
    keyAz: tracks.keyAz(t),
    keyEl: tracks.keyEl(t),
    rimLux: tracks.rimLux(t),
    fill: tracks.fill(t),
    env: tracks.env(t),
    sweep: tracks.sweep(t),
    bgGlow: tracks.bgGlow(t),
    bloom: tracks.bloom(t),
    exposure: tracks.exposure(t),
    boardYaw: tracks.boardYaw(t),
    boardPitch: tracks.boardPitch(t),
    boardRoll: tracks.boardRoll(t),
    // Flutuação lenta, só no fim (amplitude vem da timeline).
    floatY: tracks.float(t) * Math.sin(((t - 12) / 5.4) * Math.PI * 2),
  };
}

export default {
  id: 'premium',
  format: null,
  transparent: false,

  /** Monta os textos no quadro e devolve a variante pronta para o relógio do filme. */
  mount({ frameEl }) {
    const copyRoot = frameEl.querySelector('.pf-copy');
    const isPortrait = () => frameEl.clientWidth / frameEl.clientHeight < 0.95;
    const copyEls = COPY.map((cue) => {
      const el = document.createElement(cue.id === 'manifesto' ? 'h1' : 'p');
      el.className = `pf-line pf-${cue.id}`;
      el.dataset.copy = cue.id;
      el.textContent = cue.text;
      copyRoot.appendChild(el);
      return { el, cue };
    });
    let stage = null;

    function applyCopy(t) {
      const fade = tracks.fade(t);
      copyEls.forEach(({ el, cue }) => {
        const s = cueState(t, cue);
        const opacity = s.opacity * (cue.out == null ? fade : 1);
        el.style.opacity = opacity.toFixed(4);
        el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
        el.style.setProperty('--rise', s.rise.toFixed(4));
        el.style.setProperty('--grow', s.scale.toFixed(4));
      });
    }

    return {
      duration: DURATION,
      acts: ACTS,
      cues: SOUND_CUES,
      // Quadro estático usado com "reduzir movimento" (hero + assinatura).
      stillTime: 16.6,
      autoplay: true,
      loop: false,
      bind(s) {
        stage = s;
      },
      state: (t) => frameState(t, isPortrait()),
      draw(t) {
        stage.render(frameState(t, isPortrait()));
        applyCopy(t);
      },
      /** Sem WebGL: fica só a assinatura tipográfica. */
      fallback() {
        copyEls.forEach(({ el, cue }) => {
          if (cue.id !== 'brand' && cue.id !== 'brandSub') return;
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        });
      },
    };
  },
};
