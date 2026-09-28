import { BRAZIL_STATES, BRAZIL_MAP } from '../data/brazilMap';

const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const PHONE_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.5.57a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.57 3.5a1 1 0 01-.25 1l-2.2 2.3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path></svg>';

/**
 * Mapa interativo do Brasil com busca por estado e painel de contato.
 * Usado por Representantes (prefixo "reps") e Suporte (prefixo "sup"): os ids
 * do componente seguem o padrão `${prefix}Section`, `${prefix}MapSvg` etc.
 *
 * @param {import('./context').BehaviorContext} ctx
 * @param {{
 *   prefix: string,
 *   entries: Array<{ id: string, name: string, states: string[], stateNames?: string[],
 *     servedLabel?: string, nationwide?: boolean, phones?: string[], whatsapp?: string,
 *     whatsappLabel?: string, address?: string|null, email?: string }>,
 *   stateMap: Record<string, string|string[]>,
 *   fallbackId?: string,
 *   emptyText?: string,
 *   intl?: { name: string, regions: string[], contacts: Array<{ name: string, phone: string }> },
 *   onContact?: (entry: object, kind: string) => void,
 * }} cfg
 */
function createStateMap(ctx, cfg) {
  const { root, on, cleanups } = ctx;
  const { prefix } = cfg;
  const byId = (suffix) => root.getElementById(prefix + suffix);
  const section = byId('Section');
  if (!section) return;
  const top = section.querySelector('.reps-top');
  const stage = byId('Stage');
  if ('IntersectionObserver' in window) {
    const headObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (top) top.classList.add('is-visible');
            if (stage) stage.classList.add('is-visible');
            headObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    headObs.observe(section);
    cleanups.push(() => headObs.disconnect());
  } else {
    if (top) top.classList.add('is-visible');
    if (stage) stage.classList.add('is-visible');
  }
  const entriesById = {};
  cfg.entries.forEach((r) => {
    entriesById[r.id] = r;
  });
  const getIdsForUf = (uf) => {
    const v = cfg.stateMap[uf];
    if (!v) return cfg.fallbackId ? [cfg.fallbackId] : [];
    return Array.isArray(v) ? v : [v];
  };
  const stateByUf = {};
  BRAZIL_STATES.forEach((s) => {
    stateByUf[s.uf] = s;
  });
  const mapSvg = byId('MapSvg');
  const mapWrap = byId('MapWrap');
  const panel = byId('Panel');
  const tooltip = byId('Tooltip');
  const searchInput = byId('SearchInput');
  const suggestEl = byId('Suggest');
  const intlToggle = byId('IntlToggle');
  const intlPanel = byId('IntlPanel');
  if (!mapSvg || !stage || !panel) return;
  mapSvg.setAttribute('viewBox', BRAZIL_MAP.viewBox);
  const svgNS = 'http://www.w3.org/2000/svg';
  const statePaths = {};
  Object.keys(BRAZIL_MAP.paths).forEach((uf) => {
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', BRAZIL_MAP.paths[uf]);
    p.setAttribute('class', 'reps-state');
    p.setAttribute('data-uf', uf);
    p.setAttribute('tabindex', '0');
    p.setAttribute('role', 'button');
    const st = stateByUf[uf];
    p.setAttribute('aria-label', st ? st.name : uf);
    mapSvg.appendChild(p);
    statePaths[uf] = p;
  });
  let selectedUf = null;
  const normalize = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const joinPt = (arr) => {
    if (arr.length <= 1) return arr.join('');
    if (arr.length === 2) return arr.join(' e ');
    return arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1];
  };
  const telHref = (raw) => {
    const digits = raw.replace(/[^\d]/g, '');
    return 'tel:+55' + digits;
  };
  const clearHighlight = () => {
    Object.values(statePaths).forEach((p) =>
      p.classList.remove('is-selected', 'is-secondary', 'is-empty-selected'),
    );
  };
  const showTooltip = (uf, evt) => {
    const st = stateByUf[uf];
    if (!st || !tooltip || !mapWrap) return;
    tooltip.textContent = st.name;
    const wrapRect = mapWrap.getBoundingClientRect();
    tooltip.style.left = evt.clientX - wrapRect.left + 'px';
    tooltip.style.top = evt.clientY - wrapRect.top + 'px';
    tooltip.classList.add('is-visible');
  };
  const hideTooltip = () => {
    if (tooltip) tooltip.classList.remove('is-visible');
  };
  const hideSuggestions = () => {
    if (!suggestEl) return;
    suggestEl.innerHTML = '';
    activeSuggestIndex = -1;
    currentMatches = [];
    if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
  };
  const genericContact = (label) =>
    '<a class="reps-panel-cta" href="#jfaHeader" data-page-anchor data-generic-contact="1">' +
    label +
    ARROW_SVG +
    '</a>';
  const buildEntryBlock = (entry) => {
    let html = '<p class="reps-panel-rep">' + entry.name + '</p>';
    html +=
      '<p class="reps-panel-served">Atendimento em: <b>' +
      (entry.servedLabel || joinPt(entry.stateNames || [])) +
      '</b></p>';
    if (entry.phones && entry.phones.length) {
      html +=
        '<ul class="reps-panel-phones">' +
        entry.phones
          .map(
            (ph) =>
              '<li><a class="reps-panel-phone" href="' + telHref(ph) + '">' + PHONE_SVG + ph + '</a></li>',
          )
          .join('') +
        '</ul>';
    }
    if (entry.address) html += '<p class="reps-panel-address">' + entry.address + '</p>';
    if (entry.email)
      html +=
        '<p class="reps-panel-address"><a href="mailto:' + entry.email + '">' + entry.email + '</a></p>';
    if (entry.whatsapp) {
      html +=
        '<a class="reps-panel-cta" href="' +
        entry.whatsapp +
        '" target="_blank" rel="noopener noreferrer" data-entry-id="' +
        entry.id +
        '" data-contact-kind="whatsapp">' +
        (entry.whatsappLabel || 'Falar no WhatsApp') +
        ARROW_SVG +
        '</a>';
    } else if (entry.phones && entry.phones.length) {
      html +=
        '<a class="reps-panel-cta" href="' +
        telHref(entry.phones[0]) +
        '" data-entry-id="' +
        entry.id +
        '" data-contact-kind="phone">Entrar em contato' +
        ARROW_SVG +
        '</a>';
    } else {
      html += genericContact('Entrar em contato com a JFA');
    }
    return html;
  };
  const renderPanel = (uf) => {
    const st = stateByUf[uf];
    const entries = getIdsForUf(uf)
      .map((id) => entriesById[id])
      .filter(Boolean);
    const stateName = st ? st.name : uf;
    let html = '';
    html +=
      '<button class="reps-panel-back" type="button" data-panel-back><svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Ver mapa completo</button>';
    html += '<span class="reps-panel-uf">' + uf + '</span>';
    html += '<h3 class="reps-panel-state">' + stateName + '</h3>';
    if (entries.length === 1) {
      html += buildEntryBlock(entries[0]);
    } else if (entries.length > 1) {
      html += entries
        .map((entry) => '<div class="reps-panel-rep-group">' + buildEntryBlock(entry) + '</div>')
        .join('');
    } else {
      html +=
        '<p class="reps-panel-empty">' +
        (cfg.emptyText || 'Ainda n\xE3o encontramos um contato cadastrado para esta regi\xE3o.') +
        '</p>';
      html += genericContact('Entrar em contato com a JFA');
    }
    panel.innerHTML = html;
    Array.from(panel.querySelectorAll('[data-generic-contact]')).forEach((a) => {
      on(a, 'click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: ctx.reduceMotion ? 'auto' : 'smooth' });
      });
    });
    Array.from(panel.querySelectorAll('[data-entry-id]')).forEach((a) => {
      on(a, 'click', () => {
        if (cfg.onContact) cfg.onContact(entriesById[a.dataset.entryId], a.dataset.contactKind);
      });
    });
    const backBtn = panel.querySelector('[data-panel-back]');
    if (backBtn) on(backBtn, 'click', () => deselectState());
  };
  const selectState = (uf) => {
    if (!statePaths[uf]) return;
    selectedUf = uf;
    clearHighlight();
    const entries = getIdsForUf(uf)
      .map((id) => entriesById[id])
      .filter(Boolean);
    if (entries.length) {
      // Destaca os outros estados atendidos pelo mesmo contato (menos quando o
      // atendimento é nacional: aí só o estado escolhido acende).
      const servedUfs = new Set([uf]);
      entries.forEach((entry) => {
        if (!entry.nationwide) entry.states.forEach((s) => servedUfs.add(s));
      });
      servedUfs.forEach((s) => {
        if (statePaths[s]) statePaths[s].classList.add(s === uf ? 'is-selected' : 'is-secondary');
      });
    } else {
      statePaths[uf].classList.add('is-empty-selected');
    }
    stage.classList.add('has-selection');
    renderPanel(uf);
    hideSuggestions();
    hideTooltip();
    const st = stateByUf[uf];
    if (searchInput && st) searchInput.value = st.name;
    const heading = panel.querySelector('.reps-panel-state');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };
  const deselectState = () => {
    selectedUf = null;
    clearHighlight();
    stage.classList.remove('has-selection');
    if (searchInput) searchInput.value = '';
    hideSuggestions();
  };
  Object.keys(statePaths).forEach((uf) => {
    const p = statePaths[uf];
    on(p, 'mouseenter', (e) => {
      p.classList.add('is-hover');
      showTooltip(uf, e);
    });
    on(p, 'mousemove', (e) => showTooltip(uf, e));
    on(p, 'mouseleave', () => {
      p.classList.remove('is-hover');
      hideTooltip();
    });
    on(p, 'click', () => {
      if (selectedUf === uf) deselectState();
      else selectState(uf);
    });
    on(p, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectState(uf);
      }
    });
  });
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && selectedUf && section.getClientRects().length) deselectState();
  });
  let activeSuggestIndex = -1;
  let currentMatches = [];
  const updateActiveSuggestion = () => {
    if (!suggestEl) return;
    Array.from(suggestEl.children).forEach((el, i) =>
      el.classList.toggle('is-active', i === activeSuggestIndex),
    );
  };
  const renderSuggestions = (matches) => {
    currentMatches = matches;
    activeSuggestIndex = -1;
    if (!suggestEl || !searchInput) return;
    if (!matches.length) {
      suggestEl.innerHTML = '';
      searchInput.setAttribute('aria-expanded', 'false');
      return;
    }
    suggestEl.innerHTML = matches
      .map(
        (s, i) =>
          '<div class="reps-suggest-item" data-idx="' +
          i +
          '" role="option"><span class="uf">' +
          s.uf +
          '</span>' +
          s.name +
          '</div>',
      )
      .join('');
    searchInput.setAttribute('aria-expanded', 'true');
    Array.from(suggestEl.querySelectorAll('.reps-suggest-item')).forEach((el, i) => {
      on(el, 'mousedown', (e) => {
        e.preventDefault();
        selectState(matches[i].uf);
      });
    });
  };
  const matchStates = (query) => {
    const q = normalize(query);
    if (!q) return [];
    const exactUf = BRAZIL_STATES.find((s) => s.uf.toLowerCase() === q);
    if (exactUf) return [exactUf];
    const starts = BRAZIL_STATES.filter((s) => normalize(s.name).startsWith(q));
    const contains = BRAZIL_STATES.filter((s) => starts.indexOf(s) === -1 && normalize(s.name).includes(q));
    return starts.concat(contains).slice(0, 8);
  };
  if (searchInput) {
    on(searchInput, 'input', () => {
      renderSuggestions(matchStates(searchInput.value));
    });
    on(searchInput, 'keydown', (e) => {
      if (!currentMatches.length) {
        if (e.key === 'Enter') {
          const q = normalize(searchInput.value);
          const exact = BRAZIL_STATES.find((s) => normalize(s.name) === q || s.uf.toLowerCase() === q);
          if (exact) selectState(exact.uf);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSuggestIndex = Math.min(activeSuggestIndex + 1, currentMatches.length - 1);
        updateActiveSuggestion();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSuggestIndex = Math.max(activeSuggestIndex - 1, 0);
        updateActiveSuggestion();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectState(currentMatches[activeSuggestIndex >= 0 ? activeSuggestIndex : 0].uf);
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });
  }
  on(document, 'click', (e) => {
    if (!section.contains(e.target)) return;
    if (!e.target.closest('.reps-search')) hideSuggestions();
  });
  const intl = cfg.intl;
  let intlBuilt = false;
  if (intl && intlToggle && intlPanel) {
    on(intlToggle, 'click', () => {
      const isOpen = intlPanel.classList.contains('is-open');
      if (isOpen) {
        intlPanel.classList.remove('is-open');
        intlToggle.setAttribute('aria-expanded', 'false');
        return;
      }
      if (!intlBuilt) {
        intlPanel.innerHTML =
          '<p class="reps-intl-regions">' +
          intl.name +
          ', atendemos: ' +
          intl.regions.join(', ') +
          '.</p><ul class="reps-intl-contacts">' +
          intl.contacts
            .map(
              (c) =>
                '<li>' +
                c.name +
                ': <a href="tel:' +
                c.phone.replace(/[^\d+]/g, '') +
                '">' +
                c.phone +
                '</a></li>',
            )
            .join('') +
          '</ul>';
        intlBuilt = true;
      }
      intlPanel.classList.add('is-open');
      intlToggle.setAttribute('aria-expanded', 'true');
    });
  }
}
export { createStateMap };
