/**
 * Faixa tipográfica inclinada que corre sozinha, pausando fora da tela.
 * @param {import('./context').BehaviorContext} ctx
 */
function initTechMarquee(ctx) {
  const { root, on, cleanups } = ctx;
  const techMarquee = root.getElementById('techMarquee');
  const techMarqueeTrack = root.getElementById('techMarqueeTrack');
  if (techMarquee && techMarqueeTrack) {
    let unitWidth = 0;
    const measureMarquee = () => {
      const firstPhrase = techMarqueeTrack.firstElementChild;
      unitWidth = firstPhrase ? firstPhrase.offsetWidth : 0;
    };
    measureMarquee();
    on(window, 'resize', measureMarquee, { passive: true });
    const wrapMarqueeX = (x) => {
      if (!unitWidth) return 0;
      let m = x % unitWidth;
      if (m > 0) m -= unitWidth;
      return m;
    };
    // Rolagem automática contínua (px por segundo), independente do scroll.
    const MARQUEE_PX_PER_S = 38;
    let marqueeX = 0;
    let marqueeRaf = null;
    let marqueeInView = false;
    let lastTs = null;
    const tickMarquee = (ts) => {
      marqueeRaf = null;
      if (!marqueeInView || ctx.reduceMotion) {
        lastTs = null;
        return;
      }
      const dt = lastTs == null ? 0 : Math.min(ts - lastTs, 64);
      lastTs = ts;
      marqueeX -= (MARQUEE_PX_PER_S * dt) / 1000;
      techMarqueeTrack.style.transform = 'translate3d(' + wrapMarqueeX(marqueeX) + 'px,0,0)';
      marqueeRaf = requestAnimationFrame(tickMarquee);
    };
    const startMarqueeLoop = () => {
      if (!marqueeRaf && !ctx.reduceMotion) marqueeRaf = requestAnimationFrame(tickMarquee);
    };
    const stopMarqueeLoop = () => {
      if (marqueeRaf) {
        cancelAnimationFrame(marqueeRaf);
        marqueeRaf = null;
      }
      lastTs = null;
    };
    if ('IntersectionObserver' in window) {
      const marqueeInViewObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            marqueeInView = e.isIntersecting;
            if (marqueeInView) {
              measureMarquee();
              startMarqueeLoop();
            } else {
              stopMarqueeLoop();
            }
          });
        },
        { rootMargin: '200px 0px' },
      );
      marqueeInViewObs.observe(techMarquee);
      cleanups.push(() => {
        marqueeInViewObs.disconnect();
        stopMarqueeLoop();
      });
      const marqueeEntranceObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              techMarquee.classList.add('is-visible');
              marqueeEntranceObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      marqueeEntranceObs.observe(techMarquee);
      cleanups.push(() => marqueeEntranceObs.disconnect());
    } else {
      techMarquee.classList.add('is-visible');
    }
  }
}
export { initTechMarquee };
