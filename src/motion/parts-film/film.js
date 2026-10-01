/**
 * Controle do filme: relógio, estado de cada quadro (a partir da timeline),
 * textos em DOM, marcações de som e reprodução (play/pausa/seek).
 */
import { DURATION, COPY, SOUND_CUES, camera, tracks } from './timeline';
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

/**
 * @param {{ stage: { render: (state: object) => void }, copyRoot: HTMLElement, isPortrait: () => boolean }} opts
 */
export function createFilm({ stage, copyRoot, isPortrait }) {
  const events = new EventTarget();
  const copyEls = new Map();
  COPY.forEach((cue) => {
    const el = copyRoot.querySelector(`[data-copy="${cue.id}"]`);
    if (el) copyEls.set(cue.id, { el, cue });
  });

  let time = 0;
  let playing = false;
  let raf = 0;
  let last = 0;

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

  function draw(t) {
    stage.render(frameState(t, isPortrait()));
    applyCopy(t);
  }

  function fireCues(from, to) {
    SOUND_CUES.forEach((cue) => {
      if (cue.t >= from && cue.t < to) {
        const detail = { ...cue, time: to };
        events.dispatchEvent(new CustomEvent('cue', { detail }));
        window.dispatchEvent(new CustomEvent('partsfilm:cue', { detail }));
      }
    });
  }

  function tick(now) {
    // Passo limitado: se a aba engasgar, o filme não salta.
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    const prev = time;
    time = Math.min(time + dt, DURATION);
    fireCues(prev === 0 ? -1 : prev, time === DURATION ? DURATION + 1 : time);
    draw(time);
    events.dispatchEvent(new CustomEvent('time', { detail: time }));
    if (time >= DURATION) {
      playing = false;
      raf = 0;
      events.dispatchEvent(new Event('ended'));
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    if (time >= DURATION) time = 0;
    playing = true;
    last = performance.now();
    events.dispatchEvent(new Event('play'));
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(raf);
    raf = 0;
    events.dispatchEvent(new Event('pause'));
  }

  function seek(t) {
    time = Math.min(Math.max(t, 0), DURATION);
    if (!playing) draw(time);
    events.dispatchEvent(new CustomEvent('time', { detail: time }));
  }

  return {
    events,
    play,
    pause,
    seek,
    /** Redesenha o instante atual (ex.: depois de redimensionar). */
    redraw: () => draw(time),
    get time() {
      return time;
    },
    get playing() {
      return playing;
    },
    duration: DURATION,
  };
}
