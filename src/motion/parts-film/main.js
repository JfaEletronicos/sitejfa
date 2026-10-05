/**
 * Página dos filmes da JFA Parts (parts-filme.html). O mesmo palco 3D (modelo real) e o
 * mesmo relógio servem a todas as variantes:
 *   premium (padrão)          filme de produto "Tudo começa por dentro." (~18 s)
 *   ?variant=social-kinetic   peça vertical 9:16 de tipografia cinética (~20 s)
 *   ?variant=modelo           roteiro-modelo para motions novos do mesmo estilo
 *   ?variant=elitio-pro       bateria E-LÍTIO PRO 12V 280Ah (modelo do CAD, em pé)
 * Motion novo de tipografia cinética = um roteiro em social/scores/ + uma linha em VARIANTS
 * (ver .claude/skills/motion/SKILL.md).
 *
 * Parâmetros de URL:
 *   ?format=16x9 | 9x16 | 1x1 | 4x5  quadro com proporção fixa (padrão: a da variante ou a janela)
 *   ?debug                          régua de tempo, marcações de som e controles da variante
 *   ?t=8.5                          começa nesse instante
 *   ?range=0-2                      repete só esse trecho (s), para revisar uma cena
 *   ?capture                        não toca sozinho (para gravar quadro a quadro via window.partsFilm)
 *   ?quality=max                    resolução cheia (sem teto de pixels nem redução automática; 4K)
 */
import './parts-film.css';
import { createFilm } from './film';
import { ELITIO_PRO_DETAIL } from './surface-detail';

const PLACA = '/models/placa_lb1004.glb';
const ELITIO_PRO = '/models/elitio-pro.glb';
const FORMATS = { '16x9': 16 / 9, '9x16': 9 / 16, '1x1': 1, '4x5': 4 / 5 };
// Limite de pixels renderizados (mantém o filme leve em telas de alta densidade).
const MAX_PIXELS = 3.2e6;
// Tipografia cinética: o motor (social/kinetic.js) rodando um roteiro (social/scores/).
const kinetic = (loadScore) => () =>
  Promise.all([import('./social/kinetic'), loadScore()]).then(([engine, score]) =>
    engine.createKineticVariant(score.default),
  );
// Cada variante: como carregar e qual modelo 3D (GLB em public/models) usar; `upAxis: 'y'`
// para modelos que já vêm em pé; `studio: 'white'` (estúdio branco) ou `'cinema'` (estúdio
// escuro de fotografia) com chão e luz presa ao mundo, `cyc` para a cor do ciclorama; `detail` para o acabamento fino da superfície (surface-detail.js).
const VARIANTS = {
  premium: { load: () => import('./premium').then((m) => m.default), model: PLACA },
  'social-kinetic': { load: kinetic(() => import('./social/scores/em-tudo')), model: PLACA },
  modelo: { load: kinetic(() => import('./social/scores/modelo')), model: PLACA },
  'elitio-pro': {
    load: kinetic(() => import('./social/scores/elitio-pro')),
    model: ELITIO_PRO,
    upAxis: 'y',
    studio: 'cinema',
    detail: ELITIO_PRO_DETAIL,
  },
};

const params = new URLSearchParams(window.location.search);
const variantId = VARIANTS[params.get('variant')] ? params.get('variant') : 'premium';
const captureMode = params.has('capture');
// ?quality=max: resolução cheia (exportação em 4K), sem teto de pixels nem redução automática.
const fullQuality = params.get('quality') === 'max';

const frameEl = document.querySelector('.pf-frame');
const canvas = frameEl.querySelector('.pf-canvas');
const loader = frameEl.querySelector('.pf-loader');
const loaderBar = frameEl.querySelector('.pf-loader-bar');
const action = frameEl.querySelector('.pf-action');

/** Baixa o modelo acompanhando o progresso (em paralelo com o código do three.js). */
async function fetchModel(url, onProgress) {
  const res = await fetch(url);
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

async function boot() {
  const setProgress = (p) => loaderBar.style.setProperty('--p', Math.min(p, 1).toFixed(3));
  const entry = VARIANTS[variantId];
  const modelPromise = fetchModel(entry.model, setProgress);
  modelPromise.catch(() => {});

  const variantModule = await entry.load();
  frameEl.dataset.variant = variantModule.id;
  const formatRatio = FORMATS[params.get('format')] || FORMATS[variantModule.format] || null;
  const v = variantModule.mount({ frameEl, params });

  function showFailure() {
    frameEl.classList.add('is-fallback');
    loader.hidden = true;
    v.fallback();
  }

  let stage;
  try {
    const [buffer, { createStage }] = await Promise.all([modelPromise, import('./stage')]);
    stage = await createStage({
      canvas,
      model: buffer,
      transparent: variantModule.transparent,
      upAxis: entry.upAxis,
      studio: entry.studio,
      cyc: entry.cyc,
      detail: entry.detail,
    });
  } catch (err) {
    console.error('[JFA Parts] filme indisponível:', err);
    showFailure();
    return;
  }
  if (document.fonts?.ready) await document.fonts.ready;
  if (v.ready) await v.ready;
  v.bind(stage);

  const film = createFilm({
    draw: (t) => v.draw(t),
    duration: () => v.duration,
    cues: v.cues,
    loop: () => v.loop,
  });
  window.partsFilm = film;
  const clampTime = (t) => Math.min(Math.max(t, 0), v.duration);
  // ?range=a-b: revisão de um trecho, que se repete enquanto toca.
  const range = (params.get('range') || '').split('-').map(parseFloat);
  const hasRange = range.length === 2 && range.every(Number.isFinite) && range[1] > range[0];
  const startAt = clampTime(parseFloat(params.get('t')) || (hasRange ? range[0] : 0));
  if (hasRange) {
    film.events.addEventListener('time', (e) => {
      if (film.playing && e.detail >= range[1]) film.seek(range[0]);
    });
  }

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
    const maxPixels = fullQuality ? Infinity : MAX_PIXELS;
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(maxPixels / (w * h)));
    stage.setSize(w, h, dpr * quality);
    if (v.resize) v.resize(w, h);
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
    if (fullQuality || !film.playing || dt > 250 || quality <= 0.57) return;
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
  await stage.warmUp(v.state(startAt));
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
    if (film.time < film.duration) setAction('Continuar');
  });
  action.addEventListener('click', () => {
    if (film.time >= film.duration || reduceMotion.matches || !film.time) film.seek(0);
    film.play();
  });
  frameEl.addEventListener('click', (e) => {
    if (e.target === action) return;
    if (film.playing) film.pause();
    else film.play();
  });
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

  if (params.has('debug') || v.debug) mountDebug(film, v);
  if (captureMode) {
    // Gravação quadro a quadro / ajustes: acesso direto ao palco e ao estado de cada instante.
    window.partsFilmDev = { stage, frameState: v.state };
    return;
  }

  if (reduceMotion.matches && !params.has('t')) {
    // Reduzir movimento: mostra o quadro final parado; o filme só toca se a pessoa pedir.
    film.seek(v.stillTime);
    setAction('Assistir ao filme');
    return;
  }
  if (v.autoplay) setTimeout(() => film.play(), 450);
  else setAction('Assistir');
}

/** Régua de tempo (e controles da variante, quando houver). Não aparece no filme. */
function mountDebug(film, v) {
  const bar = document.createElement('div');
  bar.className = 'pf-debug';
  bar.innerHTML = `
    <div class="pf-debug-row">
      <button type="button" class="pf-debug-play">Play</button>
      <div class="pf-debug-track">
        <div class="pf-debug-acts"></div>
        <div class="pf-debug-cues"></div>
        <input type="range" min="0" step="0.01" value="0" aria-label="Tempo do filme" />
      </div>
      <output class="pf-debug-time">0.00 s</output>
      <output class="pf-debug-cue-label"></output>
    </div>`;
  document.body.appendChild(bar);
  const range = bar.querySelector('input');
  const out = bar.querySelector('.pf-debug-time');
  const cueOut = bar.querySelector('.pf-debug-cue-label');
  const btn = bar.querySelector('.pf-debug-play');

  // Atos e marcações acompanham a duração (que a variante social permite mudar).
  function paintRuler() {
    const d = film.duration;
    range.max = d;
    bar.querySelector('.pf-debug-acts').innerHTML = v.acts
      .map(
        (a) =>
          `<span class="pf-debug-act" style="left:${(a.start / d) * 100}%;width:${((a.end - a.start) / d) * 100}%">${a.label}</span>`,
      )
      .join('');
    bar.querySelector('.pf-debug-cues').innerHTML = v.cues
      .map(
        (c) =>
          `<span class="pf-debug-cue" style="left:${(c.t / d) * 100}%${c.until ? `;width:${((c.until - c.t) / d) * 100}%` : ''}" title="${c.t.toFixed(2)}s · ${c.label}"></span>`,
      )
      .join('');
  }
  paintRuler();

  if (v.controls) {
    const panel = document.createElement('div');
    panel.className = 'pf-debug-controls';
    v.controls.forEach((c) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const value = document.createElement('output');
      if (c.type === 'boolean') {
        input.type = 'checkbox';
        input.checked = c.get();
        value.textContent = '';
      } else {
        input.type = 'range';
        input.min = c.min;
        input.max = c.max;
        input.step = c.step;
        input.value = c.get();
        value.textContent = c.get();
      }
      input.addEventListener('input', () => {
        c.set(c.type === 'boolean' ? input.checked : parseFloat(input.value));
        if (c.type !== 'boolean') value.textContent = input.value;
        paintRuler();
        film.redraw();
      });
      label.append(`${c.label} `, input, value);
      panel.appendChild(label);
    });
    bar.appendChild(panel);
  }

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
  film.events.addEventListener(
    'cue',
    (e) => (cueOut.textContent = `♪ ${e.detail.t.toFixed(2)}s · ${e.detail.label}`),
  );
}

boot();
