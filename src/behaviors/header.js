import { trackEvent } from '../lib/analytics';

/**
 * Header fixo: vidro no scroll, navegação suave entre seções e estado ativo do logo.
 * @param {import('./context').BehaviorContext} ctx
 */
function initHeader(ctx) {
  const { root, on, cleanups } = ctx;
  const heroSection = root.getElementById('heroSection');
  const jfaHeader = root.getElementById('jfaHeader');
  const headerSpacer = root.getElementById('headerSpacer');
  const navHome = root.getElementById('navHome');
  const syncHeaderSpacer = () => {
    if (!jfaHeader || !headerSpacer) return;
    headerSpacer.style.height = jfaHeader.offsetHeight + 'px';
  };
  ctx.syncHeaderSpacer = syncHeaderSpacer;

  let navScrollRaf = null;
  const onNavScroll = () => {
    if (navScrollRaf) return;
    navScrollRaf = requestAnimationFrame(() => {
      navScrollRaf = null;
      if (jfaHeader) jfaHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    });
  };
  on(window, 'scroll', onNavScroll, { passive: true });
  cleanups.push(() => {
    if (navScrollRaf) cancelAnimationFrame(navScrollRaf);
  });
  onNavScroll();
  if (navHome) {
    on(navHome, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: ctx.reduceMotion ? 'auto' : 'smooth' });
    });
  }
  Array.from(root.querySelectorAll('a[data-header-goto]')).forEach((a) => {
    on(a, 'click', (e) => {
      e.preventDefault();
      const fronts = root.getElementById('frontsSection');
      if (fronts) fronts.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const idx = a.getAttribute('data-header-goto');
      const navItem = root.querySelector('.fronts-nav-item[data-goto="' + idx + '"]');
      if (navItem) setTimeout(() => navItem.click(), ctx.reduceMotion ? 0 : 260);
    });
  });
  Array.from(root.querySelectorAll('a[data-header-scroll]')).forEach((a) => {
    on(a, 'click', (e) => {
      e.preventDefault();
      const target = root.getElementById(a.getAttribute('data-header-scroll'));
      if (target) target.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
  Array.from(root.querySelectorAll('a[data-header-goto-buy]')).forEach((a) => {
    on(a, 'click', (e) => {
      e.preventDefault();
      const buySection = root.getElementById('buySection');
      if (buySection)
        buySection.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const which = a.getAttribute('data-header-goto-buy');
      const card = root.querySelector('.buy-card[data-buy-path="' + which + '"]');
      if (card) {
        setTimeout(
          () => {
            card.classList.add('is-pinged');
            setTimeout(() => card.classList.remove('is-pinged'), 1400);
          },
          ctx.reduceMotion ? 0 : 420,
        );
      }
      trackEvent(which === 'mercado-livre' ? 'mercado_livre_click' : 'store_official_click', {
        destination: which,
        source: 'header',
      });
    });
  });
  Array.from(root.querySelectorAll('a[data-header-external]')).forEach((a) => {
    on(a, 'click', () => {
      const which = a.getAttribute('data-header-external');
      trackEvent(which === 'mercado-livre' ? 'mercado_livre_click' : 'store_official_click', {
        destination: which,
        source: 'header',
      });
    });
  });
  Array.from(root.querySelectorAll('a[data-goto-products-category]')).forEach((a) => {
    on(a, 'click', (e) => {
      e.preventDefault();
      const productsSectionEl = root.getElementById('productsSection');
      if (productsSectionEl)
        productsSectionEl.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const line = a.getAttribute('data-goto-products-category');
      setTimeout(() => ctx.setProductsCategory(line), ctx.reduceMotion ? 0 : 260);
    });
  });
  Array.from(root.querySelectorAll('a[data-goto-manuals-tab]')).forEach((a) => {
    on(a, 'click', (e) => {
      e.preventDefault();
      const manualsSectionEl = root.getElementById('manualsSection');
      if (manualsSectionEl)
        manualsSectionEl.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const line = a.getAttribute('data-goto-manuals-tab');
      const tab = root.querySelector('.manuals-tab[data-line="' + line + '"]');
      if (tab) setTimeout(() => tab.click(), ctx.reduceMotion ? 0 : 260);
    });
  });
  if (navHome && heroSection && 'IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => navHome.classList.toggle('is-active', e.isIntersecting));
      },
      { threshold: 0, rootMargin: '-35% 0px -60% 0px' },
    );
    navObs.observe(heroSection);
    cleanups.push(() => navObs.disconnect());
  } else if (navHome) {
    navHome.classList.add('is-active');
  }
}
export { initHeader };
