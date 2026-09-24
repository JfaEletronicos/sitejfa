/**
 * @typedef {object} BehaviorContext
 * @property {Document} root Raiz das consultas de DOM.
 * @property {Array<() => void>} cleanups Funções executadas ao desmontar.
 * @property {(el: EventTarget | null, ev: string, fn: EventListener, opts?: AddEventListenerOptions | boolean) => void} on
 *   Registra um listener e agenda sua remoção automática.
 * @property {boolean} reduceMotion Estado atual de `prefers-reduced-motion` (atualizado ao vivo).
 * @property {MediaQueryList} reduceMotionMQ
 * @property {MediaQueryList} fineMQ Media query de ponteiro fino (mouse).
 * @property {Array<(reduce: boolean) => void>} reduceMotionListeners Chamados quando a preferência muda.
 * @property {(line: string) => void} [setProductsCategory] Exposto pelo carrossel de produtos.
 * @property {() => void} [syncHeaderSpacer] Exposto pelo header.
 * @property {(() => void) | null} refreshManualsField Exposto pelo campo de energia.
 */

/**
 * Cria o contexto compartilhado pelos módulos de comportamento da página.
 * @returns {BehaviorContext}
 */
export function createBehaviorContext() {
  const cleanups = [];
  const on = (el, ev, fn, opts) => {
    if (!el) return;
    el.addEventListener(ev, fn, opts);
    cleanups.push(() => el.removeEventListener(ev, fn, opts));
  };
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  const ctx = {
    root: document,
    cleanups,
    on,
    reduceMotionMQ,
    fineMQ: window.matchMedia('(pointer: fine)'),
    reduceMotion: reduceMotionMQ.matches,
    reduceMotionListeners: [],
    refreshManualsField: null,
  };
  return ctx;
}

/**
 * Passa a acompanhar mudanças de `prefers-reduced-motion` em tempo real.
 * @param {BehaviorContext} ctx
 */
export function watchReducedMotion(ctx) {
  const onReduceChange = (e) => {
    ctx.reduceMotion = e.matches;
    ctx.reduceMotionListeners.forEach((fn) => fn(ctx.reduceMotion));
  };
  const mq = ctx.reduceMotionMQ;
  if (mq.addEventListener) mq.addEventListener('change', onReduceChange);
  ctx.cleanups.push(() => {
    if (mq.removeEventListener) mq.removeEventListener('change', onReduceChange);
  });
}
