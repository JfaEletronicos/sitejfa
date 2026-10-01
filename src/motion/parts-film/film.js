/**
 * Relógio do filme, comum às variantes: reprodução (play/pausa/seek/loop),
 * marcações de som e eventos. Cada quadro é desenhado pela variante como função
 * pura do tempo, então pausar, voltar ou gravar quadro a quadro dá sempre a mesma imagem.
 */

/**
 * @param {{ draw: (t: number) => void, duration: () => number,
 *   cues: Array<{ t: number, id: string, label: string }>, loop?: () => boolean }} opts
 */
export function createFilm({ draw, duration, cues, loop = () => false }) {
  const events = new EventTarget();
  let time = 0;
  let playing = false;
  let raf = 0;
  let last = 0;

  function fireCues(from, to) {
    cues.forEach((cue) => {
      if (cue.t >= from && cue.t < to) {
        const detail = { ...cue, time: to };
        events.dispatchEvent(new CustomEvent('cue', { detail }));
        window.dispatchEvent(new CustomEvent('partsfilm:cue', { detail }));
      }
    });
  }

  function tick(now) {
    const end = duration();
    // Passo limitado: se a aba engasgar, o filme não salta.
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    const prev = time;
    time = Math.min(time + dt, end);
    fireCues(prev === 0 ? -1 : prev, time === end ? end + 1 : time);
    draw(time);
    events.dispatchEvent(new CustomEvent('time', { detail: time }));
    if (time >= end) {
      if (loop()) {
        time = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      playing = false;
      raf = 0;
      events.dispatchEvent(new Event('ended'));
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    if (time >= duration()) time = 0;
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
    time = Math.min(Math.max(t, 0), duration());
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
    get duration() {
      return duration();
    },
  };
}
