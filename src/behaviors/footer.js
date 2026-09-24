/**
 * Rodapé: ano corrente, links internos e entrada animada.
 * @param {import('./context').BehaviorContext} ctx
 */
function initFooter(ctx) {
  const { root, on, cleanups } = ctx;
  (() => {
    const footer = root.getElementById('jfaFooter');
    if (!footer) return;
    const yearEl = root.getElementById('footerYear');
    if (yearEl) yearEl.textContent = String(/* @__PURE__ */ new Date().getFullYear());
    const smoothScrollTo = (el) => {
      if (!el) return;
      el.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
    Array.from(footer.querySelectorAll('a[data-footer-goto]')).forEach((a) => {
      on(a, 'click', (e) => {
        e.preventDefault();
        smoothScrollTo(root.getElementById('frontsSection'));
        const idx = a.getAttribute('data-footer-goto');
        const navItem = root.querySelector('.fronts-nav-item[data-goto="' + idx + '"]');
        if (navItem) setTimeout(() => navItem.click(), ctx.reduceMotion ? 0 : 260);
      });
    });
    Array.from(footer.querySelectorAll('a[data-footer-scroll]')).forEach((a) => {
      on(a, 'click', (e) => {
        e.preventDefault();
        smoothScrollTo(root.getElementById(a.getAttribute('data-footer-scroll')));
      });
    });
    const toTopBtn = root.getElementById('footerToTop');
    if (toTopBtn) {
      on(toTopBtn, 'click', () =>
        window.scrollTo({ top: 0, behavior: ctx.reduceMotion ? 'auto' : 'smooth' }),
      );
    }
    if (!ctx.reduceMotion && 'IntersectionObserver' in window) {
      const footerObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              footer.classList.add('is-visible');
              footerObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      footerObs.observe(footer);
      cleanups.push(() => footerObs.disconnect());
    } else {
      footer.classList.add('is-visible');
    }
  })();
}
export { initFooter };
