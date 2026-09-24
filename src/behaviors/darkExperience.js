/**
 * Ambiente escuro compartilhado entre Manuais e Representantes.
 * @param {import('./context').BehaviorContext} ctx
 */
function initDarkExperience(ctx) {
  const { root, cleanups } = ctx;
  (() => {
    const wrap = root.getElementById('darkExperience');
    if (!wrap) return;
    const texture = root.getElementById('darkExperienceTexture');
    if (texture && 'IntersectionObserver' in window) {
      const clamp01 = (v) => Math.max(0, Math.min(1, v));
      let textureRaf = null;
      const updateTexture = () => {
        textureRaf = null;
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const viewportCenter = vh * 0.5;
        const progress = clamp01((viewportCenter - rect.top) / Math.max(1, rect.height));
        texture.style.opacity = String(0.08 + progress * 0.24);
      };
      const onScroll = () => {
        if (textureRaf) return;
        textureRaf = requestAnimationFrame(updateTexture);
      };
      let scrollBound = false;
      const bindScroll = () => {
        if (!scrollBound) {
          window.addEventListener('scroll', onScroll, { passive: true });
          scrollBound = true;
        }
      };
      const unbindScroll = () => {
        if (scrollBound) {
          window.removeEventListener('scroll', onScroll);
          scrollBound = false;
        }
      };
      const texObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (ctx.reduceMotion) return;
            if (entry.isIntersecting) {
              updateTexture();
              bindScroll();
            } else {
              unbindScroll();
            }
          });
        },
        { threshold: 0 },
      );
      texObs.observe(wrap);
      cleanups.push(() => {
        unbindScroll();
        texObs.disconnect();
        if (textureRaf) cancelAnimationFrame(textureRaf);
      });
    }
  })();
}
export { initDarkExperience };
