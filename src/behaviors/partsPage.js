import { trackEvent } from '../lib/analytics';
import { PARTS_BOARDS, PARTS_WHATSAPP_PHONE } from '../data/partsBoards';

const whatsappUrl = (text) =>
  'https://api.whatsapp.com/send?phone=' + PARTS_WHATSAPP_PHONE + '&text=' + encodeURIComponent(text);
const normalize = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s\-_.]/g, '')
    .toUpperCase();
const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * JFA Parts (#/setores/parts): buscador de placas com sugestões e "identificação"
 * animada, carrossel de placas, rolagem dos botões internos e WhatsApp do vendedor.
 * @param {import('./context').BehaviorContext} ctx
 */
function initPartsPage(ctx) {
  const { root, on, cleanups } = ctx;
  const view = root.getElementById('partsView');
  if (!view) return;

  // Botões "Encontrar minha placa" / "Conhecer a JFA Parts": rolam até a seção.
  const scrollToId = (id) => {
    const el = root.getElementById(id);
    if (el) el.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  view.querySelectorAll('[data-parts-scroll]').forEach((a) =>
    on(a, 'click', (e) => {
      e.preventDefault();
      scrollToId(a.dataset.partsScroll);
      if (a.dataset.partsScroll === 'partsFinder') setTimeout(() => input && input.focus(), 500);
    }),
  );
  const seller = root.getElementById('partsSellerCta');
  if (seller) {
    seller.href = whatsappUrl('Olá! Quero falar com um vendedor da JFA Parts.');
    on(seller, 'click', () => trackEvent('whatsapp_click', { source: 'parts_final' }));
  }

  // Buscador
  const form = root.getElementById('partsFinderForm');
  const input = root.getElementById('partsFinderInput');
  const suggest = root.getElementById('partsFinderSuggest');
  const result = root.getElementById('partsFinderResult');
  const boardKeys = PARTS_BOARDS.map((b) => ({
    board: b,
    keys: [b.model, ...(b.keywords || [])].map(normalize),
  }));
  const matchBoards = (q) => {
    const n = normalize(q);
    if (!n) return [];
    return boardKeys.filter((x) => x.keys.some((k) => k.includes(n) || n.includes(k))).map((x) => x.board);
  };
  const hideSuggest = () => {
    suggest.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
  };
  let searchTimer = null;
  const showResult = (query) => {
    clearTimeout(searchTimer);
    hideSuggest();
    const q = query.trim();
    if (!q) return;
    const found = matchBoards(q)[0];
    trackEvent('parts_search', { query: q, found: found ? found.model : '' });
    // "Identificando": leitura animada antes do resultado.
    result.hidden = false;
    result.className = 'parts-finder-result is-scanning';
    result.innerHTML =
      '<div class="parts-finder-scan"><span class="parts-finder-scan-bar"></span><p>Identificando <strong>' +
      escapeHtml(q.toUpperCase()) +
      '</strong>…</p></div>';
    searchTimer = setTimeout(
      () => {
        result.className = 'parts-finder-result is-ready';
        if (!found) {
          result.innerHTML =
            '<div class="parts-finder-empty"><p>Não encontramos <strong>' +
            escapeHtml(q.toUpperCase()) +
            '</strong> no catálogo online.</p><p>Nossa equipe comercial pode identificar a placa para você.</p><a class="parts-cta is-whats" target="_blank" rel="noopener noreferrer" href="' +
            whatsappUrl('Olá! Procuro a placa para o modelo ' + q + '. Podem me ajudar?') +
            '">Falar com um vendedor</a></div>';
          return;
        }
        const card = view.querySelector('.parts-card[data-model="' + found.model + '"] .parts-card-media');
        const media = card ? card.innerHTML : '';
        const compat =
          found.compatibility && found.compatibility.length ? found.compatibility.join(' / ') : '';
        result.innerHTML =
          '<div class="parts-finder-found"><div class="parts-finder-found-media">' +
          media +
          '</div><dl class="parts-finder-data">' +
          '<div><dt>Modelo identificado</dt><dd>' +
          escapeHtml(found.model) +
          '</dd></div><div><dt>Placa encontrada</dt><dd>JFA ' +
          escapeHtml(found.model) +
          '</dd></div><div><dt>Aplicação</dt><dd>' +
          escapeHtml(found.application) +
          '</dd></div><div><dt>Compatibilidade</dt><dd>' +
          (compat ? escapeHtml(compat) : 'Consulte nossa equipe comercial') +
          '</dd></div></dl><div class="parts-finder-actions"><button type="button" class="parts-cta is-ghost" data-parts-show="' +
          escapeHtml(found.model) +
          '">Ver placa</button><a class="parts-cta is-whats" target="_blank" rel="noopener noreferrer" href="' +
          whatsappUrl('Olá! Tenho interesse na placa JFA ' + found.model + '.') +
          '" data-parts-buy="' +
          escapeHtml(found.model) +
          '">Comprar / falar com vendedor</a></div></div>';
      },
      ctx.reduceMotion ? 0 : 1100,
    );
  };
  cleanups.push(() => clearTimeout(searchTimer));
  if (form && input && suggest && result) {
    on(form, 'submit', (e) => {
      e.preventDefault();
      showResult(input.value);
    });
    on(input, 'input', () => {
      const list = matchBoards(input.value);
      if (!list.length) return hideSuggest();
      suggest.innerHTML = list
        .map(
          (b) =>
            '<button type="button" class="parts-finder-suggest-item" role="option" data-model="' +
            b.model +
            '"><strong>' +
            b.model +
            '</strong><span>' +
            escapeHtml(b.title) +
            '</span></button>',
        )
        .join('');
      input.setAttribute('aria-expanded', 'true');
    });
    on(suggest, 'mousedown', (e) => {
      const item = e.target.closest('[data-model]');
      if (!item) return;
      e.preventDefault();
      input.value = item.dataset.model;
      showResult(item.dataset.model);
    });
    on(input, 'keydown', (e) => {
      if (e.key === 'Escape') hideSuggest();
    });
    on(input, 'blur', () => setTimeout(hideSuggest, 150));
    on(result, 'click', (e) => {
      const show = e.target.closest('[data-parts-show]');
      if (show) highlightCard(show.dataset.partsShow);
      const buy = e.target.closest('[data-parts-buy]');
      if (buy) trackEvent('whatsapp_click', { source: 'parts_finder', model: buy.dataset.partsBuy });
    });
  }

  // Carrossel: rolagem horizontal (arraste no celular) com setas no computador.
  const carousel = root.getElementById('partsCarousel');
  const step = () => {
    const card = carousel && carousel.querySelector('.parts-card');
    return card ? card.getBoundingClientRect().width + 20 : 300;
  };
  view.querySelectorAll('[data-parts-carousel]').forEach((btn) =>
    on(btn, 'click', () =>
      carousel.scrollBy({
        left: Number(btn.dataset.partsCarousel) * step(),
        behavior: ctx.reduceMotion ? 'auto' : 'smooth',
      }),
    ),
  );
  // "Ver placa" do resultado: rola até o card e dá um destaque.
  const highlightCard = (model) => {
    const card = carousel && carousel.querySelector('.parts-card[data-model="' + model + '"]');
    if (!card) return;
    scrollToId('partsCatalog');
    carousel.scrollTo({
      left: card.offsetLeft - carousel.offsetLeft,
      behavior: ctx.reduceMotion ? 'auto' : 'smooth',
    });
    card.classList.remove('is-pinged');
    void card.offsetWidth;
    card.classList.add('is-pinged');
  };
  // "Ver placa" do card: preenche o buscador e mostra o resultado.
  view.querySelectorAll('[data-parts-find]').forEach((btn) =>
    on(btn, 'click', () => {
      input.value = btn.dataset.partsFind;
      scrollToId('partsFinder');
      showResult(btn.dataset.partsFind);
    }),
  );
}
export { initPartsPage };
