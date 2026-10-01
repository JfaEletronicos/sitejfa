/**
 * Página do filme da JFA Parts (parts-filme.html).
 *
 * Parâmetros de URL:
 *   ?format=16x9 | 9x16 | 1x1 | 4x5  quadro com proporção fixa (padrão: ocupa a janela)
 *   ?debug                          régua de tempo com atos e marcações de som
 *   ?t=8.5                          começa nesse instante
 *   ?capture                        não toca sozinho (para gravar quadro a quadro via window.partsFilm)
 */
import './parts-film.css';
import { DURATION, ACTS, COPY, SOUND_CUES } from './timeline';
import { createFilm, frameState } from './film';

const MODEL_URL = '/models/placa_lb1004.glb';
const FORMATS = { '16x9': 16 / 9, '9x16': 9 / 16, '1x1': 1, '4x5': 4 / 5 };
// Quadro estático usado com "reduzir movimento" (hero + assinatura).
const STILL_TIME = 16.6;
// Limite de pixels renderizados (mantém o filme leve em telas de alta densidade).
const MAX_PIXELS = 3.2e6;

const params = new URLSearchParams(window.location.search);
const formatRatio = FORMATS[params.get('format')] || null;
const debug = params.has('debug');
const captureMode = params.has('capture');
const startAt = Math.min(Math.max(parseFloat(params.get('t')) || 0, 0), DURATION);

const frameEl = document.querySelector('.pf-frame');
const canvas = frameEl.querySelector('.pf-canvas');
const copyRoot = frameEl.querySelector('.pf-copy');
const loader = frameEl.querySelector('.pf-loader');
const loaderBar = frameEl.querySelector('.pf-loader-bar');
const action = frameEl.querySelector('.pf-action');

// Textos vêm da timeline (uma única fonte para conteúdo e tempos).
COPY.forEach((cue) => {
  const el = document.createElement(cue.id === 'manifesto' ? 'h1' : 'p');
  el.className = `pf-line pf-${cue.id}`;
  el.dataset.copy = cue.id;
  el.textContent = cue.text;
  copyRoot.appendChild(el);
});

const isPortrait = () => frameEl.clientWidth / frameEl.clientHeight < 0.95;

/** Baixa o modelo acompanhando o progresso (em paralelo com o código do three.js). */
async function fetchModel(onProgress) {
  const res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error(`Modelo indisponível (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !total) return res.arrayBuffer();
  const reader = res.body.getReader();
  const out = new Uint8Array(total);
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (received + value.length > out.length) return res.arrayBuffer();
    out.set(value, received);
    received += value.length;
    onProgress(received / total);
  }
  return out.buffer;
}

function showFailure() {
  frameEl.classList.add('is-fallback');
  loader.hidden = true;
  // Sem WebGL: fica só a assinatura tipográfica.
  copyRoot.querySelectorAll('[data-copy="brand"], [data-copy="brandSub"]').forEach((el) => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
}

async function boot() {
  const setProgress = (p) => loaderBar.style.setProperty('--p', Math.min(p, 1).toFixed(3));
  let stage;
  try {
    const [buffer, { createStage }] = await Promise.all([fetchModel(setProgress), import('./stage')]);
    stage = await createStage({ canvas, model: buffer });
  } catch (err) {
    console.error('[JFA Parts] filme indisponível:', err);
    showFailure();
    return;
  }
  if (document.fonts?.ready) await document.fonts.ready;

  const film = createFilm({ stage, copyRoot, isPortrait });
  window.partsFilm = film;

  function layout() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let w = vw;
    let h = vh;
    if (formatRatio) {
      if (vw / vh > formatRatio) w = Math.round(vh * formatRatio);
      else h = Math.round(vw / formatRatio);
    }
    frameEl.style.width = `${w}px`;
    frameEl.style.height = `${h}px`;
    frameEl.dataset.orient = w / h < 0.95 ? 'portrait' : w / h < 1.4 ? 'square' : 'landscape';
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (w * h)));
    stage.setSize(w, h, dpr * quality);
    film.redraw();
  }
  // Qualidade adaptativa: se a máquina não sustentar ~40 fps, reduz a resolução
  // interna (até duas vezes) em vez de deixar o movimento engasgar.
  let quality = 1;
  let slowFrames = 0;
  let lastStamp = 0;
  film.events.addEventListener('time', () => {
    const now = performance.now();
    const dt = now - lastStamp;
    lastStamp = now;
    if (!film.playing || dt > 250 || quality <= 0.57) return;
    slowFrames = dt > 25 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 45) {
      slowFrames = 0;
      quality *= 0.75;
      layout();
    }
  });
  layout();
  window.addEventListener('resize', layout);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    film.pause();
    showFailure();
  });

  film.seek(startAt);
  await stage.warmUp(frameState(startAt, isPortrait()));
  film.seek(startAt);
  loader.classList.add('is-done');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const setAction = (label) => {
    action.textContent = label;
    action.hidden = !label;
  };

  film.events.addEventListener('ended', () => setAction('Assistir novamente'));
  film.events.addEventListener('play', () => setAction(''));
  film.events.addEventListener('pause', () => {
    if (film.time < DURATION) setAction('Continuar');
  });
  action.addEventListener('click', () => {
    if (film.time >= DURATION || reduceMotion.matches) film.seek(0);
    film.play();
  });
  canvas.addEventListener('click', () => (film.playing ? film.pause() : film.play()));
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.code === 'Space' || e.code === 'KeyK') {
      e.preventDefault();
      if (film.playing) film.pause();
      else film.play();
    } else if (e.code === 'KeyR' || e.code === 'Home') {
      film.seek(0);
      film.play();
    } else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      film.seek(film.time + (e.code === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 0.1 : 1));
    }
  });
  // Aba em segundo plano: pausa; ao voltar, continua de onde parou.
  let resumeOnShow = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeOnShow = film.playing;
      film.pause();
    } else if (resumeOnShow) {
      film.play();
    }
  });

  if (debug) mountDebug(film);
  if (captureMode) {
    // Gravação quadro a quadro / ajustes: acesso direto ao palco e ao estado de cada instante.
    window.partsFilmDev = { stage, frameState: (t) => frameState(t, isPortrait()) };
    return;
  }

  if (reduceMotion.matches && !params.has('t')) {
    // Reduzir movimento: mostra o quadro final parado; o filme só toca se a pessoa pedir.
    film.seek(STILL_TIME);
    setAction('Assistir ao filme');
    return;
  }
  setTimeout(() => film.play(), 450);
}

/** Régua de tempo para ajuste fino (?debug). Não aparece no filme. */
function mountDebug(film) {
  const bar = document.createElement('div');
  bar.className = 'pf-debug';
  const acts = ACTS.map(
    (a) =>
      `<span class="pf-debug-act" style="left:${(a.start / DURATION) * 100}%;width:${((a.end - a.start) / DURATION) * 100}%">${a.label}</span>`,
  ).join('');
  const cues = SOUND_CUES.map(
    (c) =>
      `<span class="pf-debug-cue" style="left:${(c.t / DURATION) * 100}%${c.until ? `;width:${((c.until - c.t) / DURATION) * 100}%` : ''}" title="${c.t}s · ${c.label}"></span>`,
  ).join('');
  bar.innerHTML = `
    <button type="button" class="pf-debug-play">Play</button>
    <div class="pf-debug-track">
      <div class="pf-debug-acts">${acts}</div>
      <div class="pf-debug-cues">${cues}</div>
      <input type="range" min="0" max="${DURATION}" step="0.01" value="0" aria-label="Tempo do filme" />
    </div>
    <output class="pf-debug-time">0.00 s</output>
    <output class="pf-debug-cue-label"></output>`;
  document.body.appendChild(bar);
  const range = bar.querySelector('input');
  const out = bar.querySelector('.pf-debug-time');
  const cueOut = bar.querySelector('.pf-debug-cue-label');
  const btn = bar.querySelector('.pf-debug-play');
  range.addEventListener('input', () => {
    film.pause();
    film.seek(parseFloat(range.value));
  });
  btn.addEventListener('click', () => (film.playing ? film.pause() : film.play()));
  film.events.addEventListener('time', (e) => {
    range.value = e.detail;
    out.textContent = `${e.detail.toFixed(2)} s`;
  });
  film.events.addEventListener('play', () => (btn.textContent = 'Pausa'));
  film.events.addEventListener('pause', () => (btn.textContent = 'Play'));
  film.events.addEventListener('ended', () => (btn.textContent = 'Play'));
  film.events.addEventListener('cue', (e) => (cueOut.textContent = `♪ ${e.detail.t}s · ${e.detail.label}`));
}

boot();
