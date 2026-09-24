/**
 * JFA Parts: carrossel automático de fotos (pausa fora da tela).
 * @param {import('./context').BehaviorContext} ctx
 */
export function initPartsPromo(ctx) {
  const { root, cleanups } = ctx;
  const partsMedia = root.querySelector('.parts-promo-media');
  if (partsMedia) {
    const partsMediaSlides = Array.from(partsMedia.querySelectorAll('.parts-promo-media-slide'));
    if (partsMediaSlides.length > 1) {
      let partsMediaIdx = Math.max(
        0,
        partsMediaSlides.findIndex((s) => s.classList.contains('is-active')),
      );
      let partsMediaTimer = null;
      let partsMediaInView = true;
      const advancePartsMedia = () => {
        if (ctx.reduceMotion) return;
        const prevEl = partsMediaSlides[partsMediaIdx];
        const nextIdx = (partsMediaIdx + 1) % partsMediaSlides.length;
        const nextEl = partsMediaSlides[nextIdx];
        prevEl.classList.remove('is-active');
        prevEl.classList.add('is-leaving');
        nextEl.classList.add('is-active');
        window.setTimeout(() => prevEl.classList.remove('is-leaving'), 900);
        partsMediaIdx = nextIdx;
      };
      const stopPartsMedia = () => {
        if (partsMediaTimer) {
          window.clearInterval(partsMediaTimer);
          partsMediaTimer = null;
        }
      };
      const startPartsMedia = () => {
        stopPartsMedia();
        if (ctx.reduceMotion || !partsMediaInView) return;
        partsMediaTimer = window.setInterval(advancePartsMedia, 3200);
      };
      if ('IntersectionObserver' in window) {
        const partsMediaObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              partsMediaInView = e.isIntersecting;
              if (partsMediaInView) startPartsMedia();
              else stopPartsMedia();
            });
          },
          { rootMargin: '200px 0px' },
        );
        partsMediaObs.observe(partsMedia);
        cleanups.push(() => partsMediaObs.disconnect());
      } else {
        startPartsMedia();
      }
      cleanups.push(stopPartsMedia);
    }
  }
}
