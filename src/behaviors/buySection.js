/**
 * Onde comprar: parallax/luz dos cards no hover e scroll suave para representantes.
 * @param {import('./context').BehaviorContext} ctx
 */
function initBuySection(ctx) {
  const { root, on, cleanups } = ctx;
  const buyGrid = root.getElementById('buyGrid');
  const buyCards = buyGrid ? Array.from(buyGrid.querySelectorAll('.buy-card')) : [];
  if (buyGrid && buyCards.length) {
    const buyHoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    let buyRafId = null;
    let buyPendingMove = null;
    const setBuyActive = (activeCard) => {
      buyCards.forEach((card) => {
        card.classList.toggle('is-buy-active', card === activeCard);
        card.classList.toggle('is-buy-inactive', !!activeCard && card !== activeCard);
      });
    };
    const clearBuyParallax = (card) => {
      card.style.removeProperty('--buy-nx');
      card.style.removeProperty('--buy-ny');
    };
    const flushBuyMove = () => {
      buyRafId = null;
      if (!buyPendingMove) return;
      const { card, nx, ny } = buyPendingMove;
      buyPendingMove = null;
      card.style.setProperty('--buy-nx', nx.toFixed(3));
      card.style.setProperty('--buy-ny', ny.toFixed(3));
    };
    buyCards.forEach((card) => {
      on(card, 'pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || !buyHoverMQ.matches) return;
        setBuyActive(card);
      });
      on(card, 'pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !buyHoverMQ.matches) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        buyPendingMove = { card, nx, ny };
        if (buyRafId == null) buyRafId = requestAnimationFrame(flushBuyMove);
      });
      on(card, 'pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        setBuyActive(null);
        clearBuyParallax(card);
      });
      on(card, 'focus', () => {
        if (buyHoverMQ.matches) setBuyActive(card);
      });
      on(card, 'blur', () => {
        setBuyActive(null);
        clearBuyParallax(card);
      });
    });
    cleanups.push(() => {
      if (buyRafId != null) cancelAnimationFrame(buyRafId);
    });
  }
  const buyRepStrip = root.querySelector('.buy-rep-strip');
  if (buyRepStrip) {
    on(buyRepStrip, 'click', (e) => {
      const targetId = (buyRepStrip.getAttribute('href') || '').replace('#', '');
      const target = targetId ? root.getElementById(targetId) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }
}
export { initBuySection };
