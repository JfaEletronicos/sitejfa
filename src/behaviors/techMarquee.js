/**
 * Faixa tipográfica cujo deslocamento horizontal é função do scroll vertical.
 * @param {import('./context').BehaviorContext} ctx
 */
export function initTechMarquee(ctx) {
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
    const MARQUEE_SPEED = 1.6;
    const MARQUEE_EASE = 0.16;
    let marqueeX = 0;
    let marqueeRaf = null;
    let marqueeInView = false;
    const tickMarquee = () => {
      marqueeRaf = null;
      if (!marqueeInView || ctx.reduceMotion) return;
      const targetX = (window.scrollY || window.pageYOffset || 0) * MARQUEE_SPEED;
      marqueeX += (targetX - marqueeX) * MARQUEE_EASE;
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
