const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Grid de catálogo (baterias e setores): filtro animado por aba, entrada dos cards
 * ao aparecer na tela e parallax sutil da foto no mouse.
 *
 * O filtro faz a saída com fade + leve redução, reorganiza o grid com animação
 * (FLIP) e entra com fade + translateY curto. Nunca recarrega.
 *
 * @param {import('./context').BehaviorContext} ctx
 * @param {{ grid: HTMLElement, indicator?: HTMLElement|null, empty?: HTMLElement|null, attr?: string }} opts
 *   `attr`: atributo data-* do card com as chaves separadas por vírgula (padrão "sectors").
 */
function createCatalogGrid(ctx, { grid, indicator = null, empty = null, attr = 'sectors' }) {
  const { on } = ctx;
  let filterToken = 0;
  const positionIndicator = (btn) => {
    if (!indicator || !btn) return;
    indicator.style.width = btn.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
  };
  const filter = (key) => {
    const token = ++filterToken;
    const cards = Array.from(grid.querySelectorAll('.catalog-card'));
    cards.forEach((c) => c.getAnimations().forEach((anim) => anim.cancel()));
    const matches = (card) => key === 'all' || (card.dataset[attr] || '').split(',').includes(key);
    const isEmpty = !cards.some(matches);
    if (empty) {
      empty.hidden = !isEmpty;
      if (isEmpty && !ctx.reduceMotion && typeof empty.animate === 'function')
        empty.animate(
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 420, delay: 180, easing: EASE_OUT, fill: 'backwards' },
        );
    }
    if (ctx.reduceMotion || typeof grid.animate !== 'function') {
      cards.forEach((c) => {
        c.hidden = !matches(c);
        if (!c.hidden) c.classList.add('is-revealed');
      });
      return;
    }
    const leaving = cards.filter((c) => !c.hidden && !matches(c));
    const entering = cards.filter((c) => c.hidden && matches(c));
    const staying = cards.filter((c) => !c.hidden && matches(c));
    const exits = leaving.map((c) =>
      c.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.96)' },
        ],
        { duration: 220, easing: 'ease', fill: 'forwards' },
      ),
    );
    Promise.all(exits.map((anim) => anim.finished.catch(() => {}))).then(() => {
      if (token !== filterToken) return;
      const first = new Map(staying.map((c) => [c, c.getBoundingClientRect()]));
      leaving.forEach((c) => {
        c.hidden = true;
        c.getAnimations().forEach((anim) => anim.cancel());
      });
      entering.forEach((c) => {
        c.hidden = false;
        c.classList.add('is-revealed');
      });
      staying.forEach((c) => {
        const from = first.get(c);
        const to = c.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (dx || dy)
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], {
            duration: 460,
            easing: EASE_OUT,
          });
      });
      entering.forEach((c, i) =>
        c.animate(
          [
            { opacity: 0, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 460, delay: 80 + i * 60, easing: EASE_OUT, fill: 'backwards' },
        ),
      );
    });
  };
  // Cards entram uma única vez ao aparecer na tela, em stagger curto.
  let revealObs = null;
  if ('IntersectionObserver' in window) {
    revealObs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((en) => en.isIntersecting);
        visible.forEach((en, i) => {
          const card = en.target;
          card.style.transitionDelay = 120 + i * 70 + 'ms';
          card.classList.add('is-revealed');
          setTimeout(() => {
            card.style.transitionDelay = '';
          }, 1200);
          revealObs.unobserve(card);
        });
      },
      { threshold: 0.12 },
    );
    ctx.cleanups.push(() => revealObs.disconnect());
  }
  const observe = (card) => {
    if (revealObs) revealObs.observe(card);
    else card.classList.add('is-revealed');
  };
  // Parallax sutil da foto no card (só mouse): escreve variáveis CSS, 1x por frame.
  let parallaxRaf = null;
  let parallaxPending = null;
  const flushParallax = () => {
    parallaxRaf = null;
    if (!parallaxPending) return;
    const { card, nx, ny } = parallaxPending;
    parallaxPending = null;
    card.style.setProperty('--card-nx', nx.toFixed(3));
    card.style.setProperty('--card-ny', ny.toFixed(3));
  };
  on(grid, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse' || ctx.reduceMotion) return;
    const card = e.target.closest('.catalog-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    parallaxPending = {
      card,
      nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(flushParallax);
  });
  on(grid, 'pointerout', (e) => {
    const card = e.target.closest('.catalog-card');
    if (!card || card.contains(e.relatedTarget)) return;
    card.style.removeProperty('--card-nx');
    card.style.removeProperty('--card-ny');
  });
  ctx.cleanups.push(() => {
    if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
  });
  return { filter, positionIndicator, observe };
}

/**
 * Abas do filtro: (re)cria os botões na trilha; a primeira começa ativa.
 * @param {HTMLElement} track
 * @param {Array<{ key: string, label: string }>} tabs
 */
function buildFilterTabs(track, tabs) {
  track.querySelectorAll('.catalog-filter-tab').forEach((t) => t.remove());
  tabs.forEach(({ key, label }, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'catalog-filter-tab' + (i === 0 ? ' is-active' : '');
    tab.dataset.sector = key;
    tab.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    tab.textContent = label;
    track.appendChild(tab);
  });
}

/**
 * Liga (uma vez) o clique das abas e o reposicionamento do indicador no resize.
 * @param {import('./context').BehaviorContext} ctx
 */
function bindFilterTrack(ctx, track, catalog) {
  ctx.on(track, 'click', (e) => {
    const tab = e.target.closest('.catalog-filter-tab');
    if (!tab || tab.classList.contains('is-active')) return;
    Array.from(track.querySelectorAll('.catalog-filter-tab')).forEach((t) => {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
    });
    catalog.positionIndicator(tab);
    catalog.filter(tab.dataset.sector);
  });
  ctx.on(window, 'resize', () =>
    catalog.positionIndicator(track.querySelector('.catalog-filter-tab.is-active')),
  );
}

export { createCatalogGrid, buildFilterTabs, bindFilterTrack };
