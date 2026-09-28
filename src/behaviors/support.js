import { trackEvent } from '../lib/analytics';
import { SUPPORT_CENTRAL, SUPPORT_CENTERS, SUPPORT_INTERNATIONAL } from '../data/support';
import { SUPPORT_WHATSAPP_URL } from '../data/links';
import { createStateMap } from './stateMap';

const normalize = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * Suporte: o mesmo mapa de Representantes, com as assistências técnicas de cada
 * estado (lista com filtro por cidade). A busca aceita estado ou cidade.
 * @param {import('./context').BehaviorContext} ctx
 */
function initSupport(ctx) {
  const centers = SUPPORT_CENTERS.map((c) => ({ ...c, states: [c.uf] }));
  const stateMap = {};
  centers.forEach((c) => {
    (stateMap[c.uf] = stateMap[c.uf] || []).push(c.id);
  });
  // Cidades com assistência, para a busca ("Digite seu estado ou cidade").
  const cities = [];
  const seenCity = new Set();
  centers.forEach((c) => {
    const key = c.uf + '|' + normalize(c.city);
    if (seenCity.has(key)) return;
    seenCity.add(key);
    cities.push({ uf: c.uf, name: c.city, city: c.city, key: normalize(c.city) });
  });
  const renderEntries = (entries, uf, h) => {
    if (entries.length === 1 && entries[0].id === SUPPORT_CENTRAL.id) return null;
    const count = entries.length;
    const cityNames = Array.from(new Set(entries.map((e) => e.city)));
    let html =
      '<p class="reps-panel-served"><b>' +
      count +
      (count === 1 ? ' assist\xEAncia t\xE9cnica' : ' assist\xEAncias t\xE9cnicas') +
      '</b> em ' +
      (cityNames.length === 1 ? escapeHtml(cityNames[0]) : cityNames.length + ' cidades') +
      '</p>';
    if (cityNames.length > 1) {
      html +=
        '<label class="sup-city-filter"><span class="manuals-sr-only">Filtrar por cidade</span><select data-sup-city><option value="">Todas as cidades</option>' +
        cityNames
          .map((c) => '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>')
          .join('') +
        '</select></label>';
    }
    html +=
      '<ul class="sup-list">' +
      entries
        .map((e) => {
          let li = '<li class="sup-item" data-city="' + escapeHtml(e.city) + '">';
          li += '<p class="sup-item-name">' + escapeHtml(e.name) + '</p>';
          li += '<span class="sup-item-city">' + escapeHtml(e.city) + '</span>';
          if (e.phones.length)
            li +=
              '<div class="sup-item-phones">' +
              e.phones
                .map(
                  (ph) =>
                    '<a class="reps-panel-phone" href="' +
                    h.telHref(ph) +
                    '" data-entry-id="' +
                    e.id +
                    '" data-contact-kind="phone">' +
                    h.PHONE_SVG +
                    h.formatPhone(ph) +
                    '</a>',
                )
                .join('') +
              '</div>';
          li += '<p class="sup-item-address">' + escapeHtml(e.address) + '</p>';
          if (e.note) li += '<p class="sup-item-address">' + escapeHtml(e.note) + '</p>';
          if (e.email)
            li +=
              '<a class="sup-item-email" href="mailto:' +
              escapeHtml(e.email) +
              '" data-entry-id="' +
              e.id +
              '" data-contact-kind="email">' +
              escapeHtml(e.email) +
              '</a>';
          return li + '</li>';
        })
        .join('') +
      '</ul>';
    html +=
      '<p class="sup-list-foot">N\xE3o achou uma assist\xEAncia perto de voc\xEA?</p>' +
      '<a class="reps-panel-cta" href="' +
      SUPPORT_WHATSAPP_URL +
      '" target="_blank" rel="noopener noreferrer" data-entry-id="' +
      SUPPORT_CENTRAL.id +
      '" data-contact-kind="whatsapp">Falar com o suporte JFA' +
      h.ARROW_SVG +
      '</a>';
    return html;
  };
  const onPanelRender = (panel, opts) => {
    const select = panel.querySelector('[data-sup-city]');
    if (!select) return;
    const items = Array.from(panel.querySelectorAll('.sup-item'));
    const apply = () => {
      items.forEach((li) => {
        li.hidden = !!select.value && li.dataset.city !== select.value;
      });
    };
    if (opts.city) select.value = opts.city;
    apply();
    ctx.on(select, 'change', apply);
  };
  createStateMap(ctx, {
    prefix: 'sup',
    entries: [SUPPORT_CENTRAL, ...centers],
    stateMap,
    fallbackId: SUPPORT_CENTRAL.id,
    renderEntries,
    onPanelRender,
    extraMatches: (q) => cities.filter((c) => c.key.startsWith(q) || c.key.includes(' ' + q)),
    intl: {
      render: () =>
        '<ul class="reps-intl-contacts">' +
        SUPPORT_INTERNATIONAL.map(
          (c) =>
            '<li>' +
            escapeHtml(c.name) +
            '<span class="sup-intl-meta">' +
            escapeHtml(c.city) +
            ' \xB7 ' +
            escapeHtml(c.address) +
            ' \xB7 Telefone: ' +
            escapeHtml(c.phoneText) +
            '</span></li>',
        ).join('') +
        '</ul>',
    },
    onContact: (entry, kind) =>
      trackEvent(kind === 'whatsapp' ? 'whatsapp_click' : 'support_contact', {
        source: 'support_page',
        contact: entry ? entry.id : '',
        kind,
      }),
  });
}
export { initSupport };
