/**
 * JFA Parts: carrossel automático de fotos (pausa fora da tela).
 * @param {import('./context').BehaviorContext} ctx
 */
function initPartsPromo(ctx) {
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
      // Borrão de movimento só na horizontal (filtro SVG): sobe rápido no início da
      // passagem e zera quando a foto assenta.
      const blurNode = root.getElementById('partsMotionBlurAmount');
      const MOTION_MS = 600;
      let blurRaf = null;
      const runMotionBlur = (els) => {
        if (!blurNode) return;
        if (blurRaf) cancelAnimationFrame(blurRaf);
        els.forEach((el) => (el.style.filter = 'url(#partsMotionBlur)'));
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / MOTION_MS);
          const amount = Math.sin(Math.PI * t) * 38;
          blurNode.setAttribute('stdDeviation', amount.toFixed(1) + ' 0');
          if (t < 1) blurRaf = requestAnimationFrame(step);
          else {
            blurRaf = null;
            els.forEach((el) => (el.style.filter = ''));
          }
        };
        blurRaf = requestAnimationFrame(step);
      };
      cleanups.push(() => {
        if (blurRaf) cancelAnimationFrame(blurRaf);
      });
      let partsMediaInView = true;
      const advancePartsMedia = () => {
        if (ctx.reduceMotion) return;
        const prevEl = partsMediaSlides[partsMediaIdx];
        const nextIdx = (partsMediaIdx + 1) % partsMediaSlides.length;
        const nextEl = partsMediaSlides[nextIdx];
        runMotionBlur([prevEl, nextEl]);
        prevEl.classList.remove('is-active');
        prevEl.classList.add('is-leaving');
        nextEl.classList.add('is-active', 'was-cycled');
        window.setTimeout(() => prevEl.classList.remove('is-leaving'), 700);
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
export { initPartsPromo };
