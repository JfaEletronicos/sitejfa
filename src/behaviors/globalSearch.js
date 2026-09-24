import { trackEvent } from '../lib/analytics';
import { normalize, compact, searchCatalog } from '../lib/search';
import { PRODUCTS } from '../data/products';

/**
 * Busca global do header (produtos, manuais, categorias, Parts, Energia e suporte).
 * @param {import('./context').BehaviorContext} ctx
 */
export function initGlobalSearch(ctx) {
  const { root, on } = ctx;
  (() => {
    const searchTrigger = root.getElementById('searchTrigger');
    const searchPanel = root.getElementById('searchPanel');
    const searchInputEl = root.getElementById('searchInput');
    const searchCloseBtn = root.getElementById('searchClose');
    const resultsEl = root.getElementById('searchResults');
    if (!searchTrigger || !searchPanel || !searchInputEl || !resultsEl) return;
    const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const LINE_LABELS = { automotivo: 'Automotivo', energia: 'Energia', parts: 'Parts', moov: 'Moov' };
    const lineLabelFor = (p) => p.lines.map((l) => LINE_LABELS[l] || l).join('/');
    const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();
    const STATIC_GROUPS = {
      parts: {
        label: 'JFA PARTS',
        name: 'JFA Parts',
        meta: 'Placas eletr\xF4nicas para linha branca',
        keywords: ['parts', 'placa', 'placas', 'linha branca'],
      },
      energia: {
        label: 'ENERGIA',
        name: 'JFA Energia',
        meta: 'Baterias, inversores e solu\xE7\xF5es de energia',
        keywords: ['energia', 'solar', 'invers', 'eolic', 'off grid', 'offgrid'],
      },
    };
    const SUPORTE_ENTRIES = [
      {
        name: 'Manuais',
        meta: 'Busque e baixe manuais por produto',
        target: 'manuais',
        keywords: ['manual', 'manuais', 'pdf', 'suporte'],
      },
      {
        name: 'Representantes',
        meta: 'Atendimento por estado/regi\xE3o',
        target: 'representantes',
        keywords: ['representante', 'representantes', 'assistencia', 'atendimento', 'regiao', 'suporte'],
      },
    ];
    const kwMatch = (keywords, q, qc) =>
      keywords.some((k) => q.includes(k) || qc.includes(k.replace(/\s+/g, '')));
    const gotoFrontsIndex = (idx) => {
      const fronts = root.getElementById('frontsSection');
      if (fronts) fronts.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const navItem = root.querySelector('.fronts-nav-item[data-goto="' + idx + '"]');
      if (navItem) setTimeout(() => navItem.click(), ctx.reduceMotion ? 0 : 260);
    };
    const gotoManualsTab = (line) => {
      const manualsSectionEl = root.getElementById('manualsSection');
      if (manualsSectionEl)
        manualsSectionEl.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const tab = root.querySelector('.manuals-tab[data-line="' + line + '"]');
      if (tab) setTimeout(() => tab.click(), ctx.reduceMotion ? 0 : 260);
    };
    const gotoManualsWithQuery = (query) => {
      const manualsSection = root.getElementById('manualsSection');
      const manualsInput = root.getElementById('manualsSearchInput');
      if (manualsSection)
        manualsSection.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (manualsInput) {
        setTimeout(
          () => {
            manualsInput.value = query;
            manualsInput.dispatchEvent(new Event('input', { bubbles: true }));
            manualsInput.focus();
          },
          ctx.reduceMotion ? 0 : 320,
        );
      }
    };
    const gotoSection = (id) => {
      const target = root.getElementById(id);
      if (target) target.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
    let rowActions = [];
    const buildGroups = (query) => {
      const q = normalize(query),
        qc = compact(query);
      const matched = searchCatalog(query);
      const groups = [];
      if (matched.length) {
        groups.push({
          label: 'PRODUTOS',
          rows: matched.slice(0, 5).map((p) => ({
            html:
              '<button class="jfa-search-row" type="button" data-idx="__I__"><span class="jfa-search-row-main"><span class="jfa-search-row-name">' +
              escapeHtml(p.name) +
              '</span><span class="jfa-search-row-meta">' +
              escapeHtml(lineLabelFor(p) + ' \u2022 ' + p.category) +
              '</span></span><span class="jfa-search-row-action">Ver produto</span></button>',
            action: () => {
              closePanel();
              gotoManualsWithQuery(p.name);
            },
          })),
        });
        groups.push({
          label: 'MANUAIS',
          rows: matched.slice(0, 4).map((p) => ({
            html:
              '<a class="jfa-search-row" data-idx="__I__" href="' +
              escapeHtml(p.manualUrl) +
              '" target="_blank" rel="noopener" download="manual-jfa-' +
              p.id +
              '.pdf"><span class="jfa-search-row-main"><span class="jfa-search-row-name">' +
              escapeHtml(p.name) +
              '</span><span class="jfa-search-row-meta">PDF \u2022 ' +
              escapeHtml(p.category) +
              '</span></span><span class="jfa-search-row-action">Baixar</span></a>',
            action: () => {
              trackEvent('manual_download', {
                product_name: p.name,
                category: p.category,
                segment: lineLabelFor(p),
                source: 'global_search',
              });
              closePanel();
            },
          })),
        });
      }
      const catMatches = q
        ? CATEGORIES.filter((c) => {
            const f = normalize(c),
              fc = compact(c);
            return f.includes(q) || fc.includes(qc);
          })
        : [];
      if (catMatches.length) {
        groups.push({
          label: 'CATEGORIAS',
          rows: catMatches.slice(0, 5).map((c) => ({
            html:
              '<button class="jfa-search-row" type="button" data-idx="__I__"><span class="jfa-search-row-main"><span class="jfa-search-row-name">' +
              escapeHtml(c) +
              '</span><span class="jfa-search-row-meta">Ver manuais desta categoria</span></span><span class="jfa-search-row-action">Filtrar</span></button>',
            action: () => {
              closePanel();
              gotoManualsWithQuery(c);
            },
          })),
        });
      }
      Object.keys(STATIC_GROUPS).forEach((key) => {
        const g = STATIC_GROUPS[key];
        if (!q || !kwMatch(g.keywords, q, qc)) return;
        groups.push({
          label: g.label,
          rows: [
            {
              html:
                '<button class="jfa-search-row" type="button" data-idx="__I__"><span class="jfa-search-row-main"><span class="jfa-search-row-name">' +
                escapeHtml(g.name) +
                '</span><span class="jfa-search-row-meta">' +
                escapeHtml(g.meta) +
                '</span></span><span class="jfa-search-row-action">Ver \u2192</span></button>',
              action: () => {
                closePanel();
                if (key === 'parts') gotoManualsTab('parts');
                else gotoFrontsIndex(1);
              },
            },
          ],
        });
      });
      const suporteRows = q ? SUPORTE_ENTRIES.filter((e) => kwMatch(e.keywords, q, qc)) : [];
      if (suporteRows.length) {
        groups.push({
          label: 'SUPORTE',
          rows: suporteRows.map((e) => ({
            html:
              '<button class="jfa-search-row" type="button" data-idx="__I__"><span class="jfa-search-row-main"><span class="jfa-search-row-name">' +
              escapeHtml(e.name) +
              '</span><span class="jfa-search-row-meta">' +
              escapeHtml(e.meta) +
              '</span></span><span class="jfa-search-row-action">Ver \u2192</span></button>',
            action: () => {
              closePanel();
              gotoSection(e.target);
            },
          })),
        });
      }
      return groups;
    };
    const ENERGY_HINT_WORDS = ['invers', 'solar', 'eolic', 'off grid', 'offgrid', 'nobreak', 'gerador'];
    const render = (query) => {
      const q = normalize(query),
        qc = compact(query);
      if (!q) {
        resultsEl.innerHTML =
          '<p class="jfa-search-hint">Digite o nome, modelo ou c\xF3digo do que voc\xEA procura. Ex.: K600, Storm 220A, 48V100A...</p>';
        rowActions = [];
        return;
      }
      const groups = buildGroups(query);
      let idx = 0;
      rowActions = [];
      if (!groups.length) {
        const hint = ENERGY_HINT_WORDS.some((w) => q.includes(w) || qc.includes(w.replace(/\s+/g, '')));
        resultsEl.innerHTML =
          '<p class="jfa-search-empty">Nenhum resultado para "' +
          escapeHtml(query) +
          '".</p>' +
          (hint
            ? '<button class="jfa-search-suggest" type="button" data-idx="__ENERGY__">Voc\xEA procura solu\xE7\xF5es de energia solar? Conhe\xE7a JFA Energia \u2192</button>'
            : '<p class="jfa-search-hint">Tente o nome do produto, a categoria ou fale com a gente pelos Manuais/Representantes.</p>');
        const energyBtn = resultsEl.querySelector('[data-idx="__ENERGY__"]');
        if (energyBtn)
          on(energyBtn, 'click', () => {
            closePanel();
            gotoFrontsIndex(1);
          });
      } else {
        resultsEl.innerHTML = groups
          .map((g) => {
            const rowsHtml = g.rows
              .map((r) => {
                const html = r.html.replace('__I__', String(idx));
                rowActions[idx] = r.action;
                idx += 1;
                return html;
              })
              .join('');
            return (
              '<div class="jfa-search-group"><span class="jfa-search-group-label">' +
              g.label +
              '</span>' +
              rowsHtml +
              '</div>'
            );
          })
          .join('');
        Array.from(resultsEl.querySelectorAll('.jfa-search-row')).forEach((rowEl) => {
          on(rowEl, 'click', (e) => {
            const i = Number(rowEl.getAttribute('data-idx'));
            if (rowActions[i]) {
              if (rowEl.tagName !== 'A') e.preventDefault();
              rowActions[i]();
            }
          });
        });
      }
      trackEvent('product_search', { search_term: query, result_count: rowActions.length });
    };
    let debounceTimer = null;
    on(searchInputEl, 'input', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const value = searchInputEl.value;
      debounceTimer = setTimeout(() => render(value), 140);
    });
    const openPanel = () => {
      searchPanel.hidden = false;
      requestAnimationFrame(() => searchPanel.classList.add('is-open'));
      searchTrigger.setAttribute('aria-expanded', 'true');
      searchTrigger.classList.add('is-active');
      render(searchInputEl.value);
      setTimeout(() => searchInputEl.focus(), ctx.reduceMotion ? 0 : 80);
    };
    const closePanel = () => {
      searchPanel.classList.remove('is-open');
      searchTrigger.setAttribute('aria-expanded', 'false');
      searchTrigger.classList.remove('is-active');
      setTimeout(
        () => {
          if (!searchPanel.classList.contains('is-open')) searchPanel.hidden = true;
        },
        ctx.reduceMotion ? 0 : 240,
      );
      searchTrigger.focus();
    };
    on(searchTrigger, 'click', () => {
      const isOpen = searchPanel.classList.contains('is-open');
      if (isOpen) closePanel();
      else openPanel();
    });
    if (searchCloseBtn) on(searchCloseBtn, 'click', closePanel);
    on(searchPanel, 'click', (e) => {
      if (e.target === searchPanel) closePanel();
    });
    on(root, 'keydown', (e) => {
      if (e.key === 'Escape' && searchPanel.classList.contains('is-open')) closePanel();
    });
  })();
}
