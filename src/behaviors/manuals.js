import { searchCatalog } from '../lib/search';
import { trackEvent } from '../lib/analytics';
import { PRODUCTS } from '../data/products';

/**
 * Manuais: busca, abas por linha/categoria e lista de downloads.
 * @param {import('./context').BehaviorContext} ctx
 */
function initManuals(ctx) {
  const { root, on, cleanups } = ctx;
  (() => {
    const manualsSection = root.getElementById('manualsSection');
    const manualsHead = root.getElementById('manualsHead');
    const searchInput = root.getElementById('manualsSearchInput');
    const tabsEl = root.getElementById('manualsTabs');
    const categoryTabsEl = root.getElementById('manualsCategoryTabs');
    const tabPanelEl = root.getElementById('manualsTabPanel');
    const resultsWrap = root.getElementById('manualsResultsWrap');
    const resultsEl = root.getElementById('manualsResults');
    const resultsLabel = root.getElementById('manualsResultsLabel');
    const emptyEl = root.getElementById('manualsEmpty');
    const showMoreBtn = root.getElementById('manualsShowMore');
    const announceEl = root.getElementById('manualsAnnounce');
    if (!manualsSection || !searchInput || !resultsEl) return;
    const RELATED_DOCS = {
      'fonte-carregador-bob-storm': [
        {
          label: 'Esquema de liga\xE7\xE3o | Modo Mem\xF3ria',
          filename: 'esquema-ligacao-bob-storm.pdf',
          url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/07/esquema-ligacao-bob-storm-modo-memoria.pdf',
        },
      ],
      'fonte-carregador-storm': [
        {
          label: 'Bitola m\xEDnima dos cabos',
          filename: 'bitola-cabos-storm.jpg',
          url: 'https://images.weserv.nl/?output=webp&url=https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/11/tamanho-bitola-linha-storm-jfa-1.jpg',
        },
      ],
    };
    const LINE_LABELS = { automotivo: 'Automotivo', energia: 'Energia', parts: 'Parts', moov: 'Moov' };
    const RESULTS_CAP = 7;
    const productsById = {};
    PRODUCTS.forEach((p) => {
      productsById[p.id] = p;
    });
    const runSearch = searchCatalog;
    let state = { query: '', showAll: false, activeIndex: -1 };
    let manualsRevealArmed = false;
    const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const dlIconSvg =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const checkIconSvg =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const chevronSvg =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l6 7-6 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const lineLabel = (p) => p.lines.map((l) => LINE_LABELS[l] || l).join('/');
    const buildRow = (p, idx) => {
      const related = RELATED_DOCS[p.id];
      const tag = p.status === 'discontinued' ? '<span class="manuals-result-tag">Fora de linha</span>' : '';
      let html =
        '<div class="manuals-result" data-idx="' +
        idx +
        '" data-id="' +
        p.id +
        '" role="option"><a class="manuals-result-row" href="' +
        escapeAttr(p.manualUrl) +
        '" download="manual-jfa-' +
        p.id +
        '.pdf" target="_blank" rel="noopener" aria-label="Baixar manual ' +
        escapeAttr(p.name) +
        '"><span class="manuals-result-main"><span class="manuals-result-name">' +
        p.name +
        tag +
        '</span><span class="manuals-result-meta">' +
        lineLabel(p) +
        ' \u2022 ' +
        p.category +
        '</span></span><span class="manuals-result-dl"><span class="manuals-result-dl-label">Baixar manual</span>' +
        dlIconSvg +
        '</span></a>';
      if (related && related.length) {
        const panelId = 'manualsRelated-' + p.id;
        html +=
          '<div class="manuals-related"><button class="manuals-related-toggle" type="button" aria-expanded="false" aria-controls="' +
          panelId +
          '">Documentos relacionados' +
          chevronSvg +
          '</button><div class="manuals-related-panel" id="' +
          panelId +
          '" hidden><a class="manuals-related-doc" href="' +
          escapeAttr(p.manualUrl) +
          '" download="manual-jfa-' +
          p.id +
          '.pdf" target="_blank" rel="noopener">Manual principal \u2193</a>' +
          related
            .map(
              (d) =>
                '<a class="manuals-related-doc" href="' +
                escapeAttr(d.url) +
                '" download="' +
                escapeAttr(d.filename) +
                '" target="_blank" rel="noopener">' +
                d.label +
                ' \u2193</a>',
            )
            .join('') +
          '</div></div>';
      }
      html += '</div>';
      return html;
    };
    const announce = (msg) => {
      if (announceEl) announceEl.textContent = msg;
    };
    const wireResultRows = (container) => {
      Array.from(container.querySelectorAll('.manuals-result-row')).forEach((a) => {
        on(a, 'click', () => {
          const row = a.closest('.manuals-result');
          const p = productsById[row ? row.getAttribute('data-id') : ''];
          if (!p) return;
          announce('Download de ' + p.name + ' iniciado.');
          trackEvent('manual_download', {
            product_name: p.name,
            category: p.category,
            segment: lineLabel(p),
          });
          const dl = a.querySelector('.manuals-result-dl');
          const label = a.querySelector('.manuals-result-dl-label');
          if (dl && label) {
            const prevHtml = dl.innerHTML;
            dl.classList.add('is-done');
            label.textContent = 'Download iniciado';
            dl.innerHTML = '<span class="manuals-result-dl-label">Download iniciado</span>' + checkIconSvg;
            setTimeout(() => {
              dl.classList.remove('is-done');
              dl.innerHTML = prevHtml;
            }, 1800);
          }
        });
      });
      Array.from(container.querySelectorAll('.manuals-related-toggle')).forEach((btn) => {
        on(btn, 'click', () => {
          const panel = root.getElementById(btn.getAttribute('aria-controls'));
          if (!panel) return;
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!expanded));
          panel.hidden = expanded;
        });
      });
    };
    const attachRowHandlers = () => wireResultRows(resultsEl);
    const updateActiveRow = () => {
      Array.from(resultsEl.children).forEach((el, i) =>
        el.classList.toggle('is-active', i === state.activeIndex),
      );
    };
    const render = () => {
      const hasQuery = !!state.query.trim();
      resultsWrap.hidden = !hasQuery;
      if (tabPanelEl) tabPanelEl.hidden = hasQuery;
      if (!hasQuery) {
        state.activeIndex = -1;
        searchInput.setAttribute('aria-expanded', 'false');
        return;
      }
      const full = runSearch(state.query);
      resultsLabel.textContent = 'Resultados';
      resultsLabel.hidden = false;
      const visible = state.showAll ? full : full.slice(0, RESULTS_CAP);
      resultsEl.innerHTML = visible.map((p, i) => buildRow(p, i)).join('');
      attachRowHandlers();
      state.activeIndex = -1;
      emptyEl.classList.toggle('is-shown', full.length === 0);
      showMoreBtn.classList.toggle('is-shown', !state.showAll && full.length > RESULTS_CAP);
      searchInput.setAttribute('aria-expanded', String(visible.length > 0));
      if (manualsRevealArmed) revealResultRows();
    };
    function revealResultRows() {
      if (!ctx.reduceMotion) {
        requestAnimationFrame(() => {
          Array.from(resultsEl.children).forEach((el, i) => {
            el.style.transitionDelay = Math.min(i, 8) * 35 + 'ms';
            requestAnimationFrame(() => el.classList.add('is-in'));
          });
        });
      } else {
        Array.from(resultsEl.children).forEach((el) => el.classList.add('is-in'));
      }
    }
    const AUTOMOTIVE_CATEGORY_LABELS = {
      Baterias: 'Baterias',
      Amplificadores: 'Amplificadores',
      Controles: 'Controles de longa dist\xE2ncia',
      'Fontes e carregadores': 'Fontes e carregadores',
      'Fora de linha': 'Fora de linha',
    };
    const AUTOMOTIVE_CATEGORY_ORDER = [
      'Baterias',
      'Amplificadores',
      'Controles de longa dist\xE2ncia',
      'Fontes e carregadores',
      'Outros produtos',
      'Fora de linha',
    ];
    let tabPanelIdx = 0;
    const getLineCategories = (line) => {
      const isAutomotive = line === 'automotivo';
      const products = PRODUCTS.filter(
        (p) => p.lines.indexOf(line) !== -1 && (isAutomotive || p.status !== 'discontinued'),
      );
      const categories = [];
      const byCategory = {};
      products.forEach((p) => {
        const cat = isAutomotive ? AUTOMOTIVE_CATEGORY_LABELS[p.category] || 'Outros produtos' : p.category;
        if (!byCategory[cat]) {
          byCategory[cat] = [];
          categories.push(cat);
        }
        byCategory[cat].push(p);
      });
      const orderedCats = isAutomotive ? AUTOMOTIVE_CATEGORY_ORDER.filter((c) => byCategory[c]) : categories;
      return { isAutomotive, byCategory, orderedCats };
    };
    const buildTabPanelHtml = (line, category) => {
      const { byCategory, orderedCats } = getLineCategories(line);
      if (!orderedCats.length) {
        return '<p class="manuals-tab-empty">Novos manuais ser\xE3o disponibilizados em breve.</p>';
      }
      const cats = category ? orderedCats.filter((c) => c === category) : orderedCats;
      if (!cats.length) {
        return '<p class="manuals-tab-empty">Novos manuais ser\xE3o disponibilizados em breve.</p>';
      }
      return cats
        .map((cat) => {
          const rows = byCategory[cat].map((p) => buildRow(p, tabPanelIdx++)).join('');
          return (
            '<div class="manuals-tab-category"><span class="manuals-tab-category-title">' +
            cat +
            '</span>' +
            rows +
            '</div>'
          );
        })
        .join('');
    };
    const manualsTabPrompt = root.getElementById('manualsTabPrompt');
    let activeTab = null;
    let activeCategory = null;
    let categoryPicked = false;
    const renderCategoryTabs = () => {
      if (!categoryTabsEl) return;
      if (!activeTab) {
        categoryTabsEl.hidden = true;
        categoryTabsEl.innerHTML = '';
        return;
      }
      const { orderedCats } = getLineCategories(activeTab);
      if (orderedCats.length < 2) {
        categoryTabsEl.hidden = true;
        categoryTabsEl.innerHTML = '';
        return;
      }
      categoryTabsEl.hidden = false;
      const catBtns = orderedCats
        .map((cat) => {
          const isActive = categoryPicked && cat === activeCategory;
          return (
            '<button class="manuals-category-tab' +
            (isActive ? ' is-active' : '') +
            '" type="button" role="tab" data-category="' +
            cat +
            '" aria-selected="' +
            (isActive ? 'true' : 'false') +
            '">' +
            cat +
            '</button>'
          );
        })
        .join('');
      const isAllActive = categoryPicked && !activeCategory;
      const allBtn =
        '<button class="manuals-category-tab' +
        (isAllActive ? ' is-active' : '') +
        '" type="button" role="tab" aria-selected="' +
        (isAllActive ? 'true' : 'false') +
        '">Todas</button>';
      categoryTabsEl.innerHTML = catBtns + allBtn;
      Array.from(categoryTabsEl.querySelectorAll('.manuals-category-tab')).forEach((btn) => {
        on(btn, 'click', () => {
          activeCategory = btn.getAttribute('data-category') || null;
          categoryPicked = true;
          renderCategoryTabs();
          renderTabPanel();
          if (ctx.refreshManualsField) ctx.refreshManualsField();
        });
      });
    };
    const manualsTabPromptDefaultText = manualsTabPrompt ? manualsTabPrompt.textContent : '';
    const renderTabPanel = () => {
      if (!tabPanelEl) return;
      if (!activeTab) {
        tabPanelEl.hidden = true;
        tabPanelEl.innerHTML = '';
        tabPanelEl.classList.remove('is-filtered');
        if (manualsTabPrompt) {
          manualsTabPrompt.textContent = manualsTabPromptDefaultText;
          manualsTabPrompt.hidden = false;
        }
        return;
      }
      const { orderedCats } = getLineCategories(activeTab);
      const needsCategoryPick = orderedCats.length >= 2 && !categoryPicked;
      if (needsCategoryPick) {
        tabPanelEl.hidden = true;
        tabPanelEl.innerHTML = '';
        tabPanelEl.classList.remove('is-filtered');
        if (manualsTabPrompt) {
          manualsTabPrompt.textContent = 'Escolha uma categoria acima para ver os manuais dispon\xEDveis.';
          manualsTabPrompt.hidden = false;
        }
        return;
      }
      tabPanelEl.hidden = false;
      if (manualsTabPrompt) manualsTabPrompt.hidden = true;
      tabPanelEl.classList.toggle('is-filtered', !!activeCategory);
      tabPanelIdx = 0;
      tabPanelEl.innerHTML = buildTabPanelHtml(activeTab, activeCategory);
      wireResultRows(tabPanelEl);
      Array.from(tabPanelEl.querySelectorAll('.manuals-result')).forEach((el) => el.classList.add('is-in'));
    };
    renderTabPanel();
    render();
    if (tabsEl) {
      Array.from(tabsEl.querySelectorAll('.manuals-tab')).forEach((btn) => {
        on(btn, 'click', () => {
          const line = btn.getAttribute('data-line');
          const closing = line === activeTab;
          const nextTab = closing ? null : line;
          Array.from(tabsEl.querySelectorAll('.manuals-tab')).forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          if (!closing) {
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
          }
          activeTab = nextTab;
          activeCategory = null;
          categoryPicked = false;
          if (tabPanelEl && !ctx.reduceMotion) {
            tabPanelEl.classList.add('is-switching');
            setTimeout(() => {
              renderCategoryTabs();
              renderTabPanel();
              tabPanelEl.classList.remove('is-switching');
              if (ctx.refreshManualsField) ctx.refreshManualsField();
            }, 220);
          } else {
            renderCategoryTabs();
            renderTabPanel();
            if (ctx.refreshManualsField) ctx.refreshManualsField();
          }
        });
      });
    }
    if ('IntersectionObserver' in window) {
      const resultsRevealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              manualsRevealArmed = true;
              revealResultRows();
              resultsRevealObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      resultsRevealObs.observe(manualsSection);
      cleanups.push(() => resultsRevealObs.disconnect());
    } else {
      manualsRevealArmed = true;
      revealResultRows();
    }
    on(searchInput, 'input', () => {
      state.query = searchInput.value;
      state.showAll = false;
      render();
    });
    on(searchInput, 'keydown', (e) => {
      const rows = Array.from(resultsEl.children);
      if (!rows.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.activeIndex = Math.min(state.activeIndex + 1, rows.length - 1);
        updateActiveRow();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.activeIndex = Math.max(state.activeIndex - 1, 0);
        updateActiveRow();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = state.activeIndex >= 0 ? state.activeIndex : 0;
        const link = rows[idx] && rows[idx].querySelector('.manuals-result-row');
        if (link) link.click();
      } else if (e.key === 'Escape') {
        state.activeIndex = -1;
        updateActiveRow();
        searchInput.blur();
      }
    });
    on(showMoreBtn, 'click', () => {
      state.showAll = true;
      render();
    });
    if ('IntersectionObserver' in window) {
      const headObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              headObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      if (manualsHead) headObs.observe(manualsHead);
      cleanups.push(() => headObs.disconnect());
    } else if (manualsHead) {
      manualsHead.classList.add('is-visible');
    }
  })();
}
export { initManuals };
