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
      if (which === 'suporte') {
        trackEvent('whatsapp_click', { source: 'header_support' });
        return;
      }
      trackEvent(which === 'mercado-livre' ? 'mercado_livre_click' : 'shopee_click', {
        destination: which,
        source: 'header',
      });
    });
  });
  Array.from(root.querySelectorAll('a[data-header-external]')).forEach((a) => {
    on(a, 'click', () => {
      const which = a.getAttribute('data-header-external');
      if (which === 'suporte') {
        trackEvent('whatsapp_click', { source: 'header_support' });
        return;
      }
      trackEvent(which === 'mercado-livre' ? 'mercado_livre_click' : 'shopee_click', {
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
  // Menu "Setores": abre em leque ao clicar (ou ao passar o mouse) e leva para a página do setor.
  const sectorNav = root.getElementById('sectorNav');
  const sectorTrigger = root.getElementById('navSetores');
  const sectorMenu = root.getElementById('sectorMenu');
  if (sectorNav && sectorTrigger && sectorMenu) {
    let hideTimer = null;
    let hoverTimer = null;
    let openedByHover = false;
    const isOpen = () => sectorTrigger.getAttribute('aria-expanded') === 'true';
    const openMenu = () => {
      clearTimeout(hideTimer);
      if (isOpen()) return;
      sectorMenu.hidden = false;
      sectorTrigger.setAttribute('aria-expanded', 'true');
      void sectorMenu.offsetWidth;
      sectorMenu.classList.add('is-open');
      const current = location.hash.match(/^#\/setores\/([\w-]+)/);
      sectorMenu
        .querySelectorAll('.jfa-sector-item')
        .forEach((a) => a.classList.toggle('is-active', !!current && a.dataset.sector === current[1]));
    };
    const closeMenu = () => {
      openedByHover = false;
      if (!isOpen()) return;
      sectorTrigger.setAttribute('aria-expanded', 'false');
      sectorMenu.classList.remove('is-open');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!isOpen()) sectorMenu.hidden = true;
      }, 320);
    };
    ctx.openSectorMenu = openMenu;
    on(sectorTrigger, 'click', () => {
      // Aberto pelo mouse um instante antes: o clique confirma em vez de fechar.
      if (isOpen() && openedByHover) {
        openedByHover = false;
        return;
      }
      if (isOpen()) closeMenu();
      else openMenu();
    });
    on(sectorTrigger, 'keydown', (e) => {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      openMenu();
      const first = sectorMenu.querySelector('.jfa-sector-item');
      if (first) first.focus();
    });
    on(sectorMenu, 'keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const items = Array.from(sectorMenu.querySelectorAll('.jfa-sector-item'));
      const i = items.indexOf(document.activeElement);
      const next = items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
      if (next) next.focus();
    });
    on(sectorMenu, 'click', (e) => {
      const item = e.target.closest('.jfa-sector-item');
      if (!item) return;
      trackEvent('sector_menu_click', { sector: item.dataset.sector });
      closeMenu();
    });
    // Mouse: abre ao passar por cima e fecha com uma pequena folga ao sair.
    on(sectorNav, 'pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!isOpen()) openedByHover = true;
        openMenu();
      }, 80);
    });
    on(sectorNav, 'pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(closeMenu, 220);
    });
    on(document, 'pointerdown', (e) => {
      if (isOpen() && !sectorNav.contains(e.target)) closeMenu();
    });
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        sectorTrigger.focus();
      }
    });
    on(window, 'hashchange', closeMenu);
    cleanups.push(() => {
      clearTimeout(hideTimer);
      clearTimeout(hoverTimer);
    });
  }
  const whatsappFloat = root.getElementById('whatsappFloat');
  if (whatsappFloat)
    on(whatsappFloat, 'click', () => trackEvent('whatsapp_click', { source: 'floating_button' }));
  // Modo claro/escuro: o escuro é o padrão; a escolha fica salva neste navegador.
  const themeToggle = root.getElementById('themeToggle');
  if (themeToggle) {
    const htmlEl = document.documentElement;
    const syncToggle = () => {
      const light = htmlEl.dataset.theme === 'light';
      themeToggle.setAttribute('aria-pressed', light ? 'true' : 'false');
      themeToggle.title = light ? 'Mudar para o modo escuro' : 'Mudar para o modo claro';
    };
    syncToggle();
    on(themeToggle, 'click', () => {
      const light = htmlEl.dataset.theme !== 'light';
      if (light) htmlEl.dataset.theme = 'light';
      else delete htmlEl.dataset.theme;
      try {
        localStorage.setItem('jfa-theme', light ? 'light' : 'dark');
      } catch {
        // Sem armazenamento (aba anônima etc.): o tema vale só nesta visita.
      }
      syncToggle();
      trackEvent('theme_toggle', { theme: light ? 'light' : 'dark' });
    });
  }
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
