import { trackEvent } from '../lib/analytics';
import { PRODUCTS as PT_PRODUCTS } from '../data/products';
import { SECTOR_CATALOGS as PT_CATALOGS, SECTOR_ICONS, SECTOR_MENU } from '../data/sectors';
import { PRODUCT_DETAILS as PT_DETAILS } from '../data/productDetails';
import { PRODUCT_QUICK_SPECS as PT_QUICK_SPECS } from '../data/productSpecs';
import { EXPORT_GROUPS, EXPORT_PRODUCTS } from '../data/exportProducts';
import { EXPORT_PHONE } from '../data/exportContact';
import { t, tf, pick, IS_EXPORT } from '../i18n';
import { createCatalogGrid, buildFilterTabs, bindFilterTrack } from './catalogGrid';
import { renderPhotoDownloads } from './photoDownloads';
import { renderHowTo } from './howTo';

// Em inglês/espanhol (exportação), o catálogo, os textos e o contato são os de
// exportação: produtos de data/exportProducts.js numa categoria só (automotivo).
const PRODUCTS = IS_EXPORT
  ? EXPORT_PRODUCTS.map((p) => ({
      id: p.id,
      name: pick(p.name),
      category: pick(p.category),
      status: 'current',
      manualUrl: p.manualUrl,
    }))
  : PT_PRODUCTS;
const PRODUCT_DETAILS = IS_EXPORT
  ? Object.fromEntries(
      EXPORT_PRODUCTS.map((p) => [
        p.id,
        {
          images: p.images,
          summary: pick(p.summary),
          blocks: pick(p.blocks),
          docs: [{ label: t('product.manual'), url: p.manualUrl }],
          video: p.video,
        },
      ]),
    )
  : PT_DETAILS;
const SECTOR_CATALOGS = IS_EXPORT
  ? {
      automotivo: {
        title: t('export.catalogTitle'),
        groups: EXPORT_GROUPS.map((g) => ({
          key: g.key,
          label: pick(g.label),
          ids: EXPORT_PRODUCTS.filter((p) => p.group === g.key).map((p) => p.id),
        })),
      },
    }
  : PT_CATALOGS;
const PRODUCT_QUICK_SPECS = IS_EXPORT ? {} : PT_QUICK_SPECS;
const WHATSAPP_PHONE = IS_EXPORT ? EXPORT_PHONE : '553125336100';
const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const ARROW_OUT_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M9 7h8v8M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

/**
 * Páginas de categoria: Automotivo, Telecom, Motorhome, Solar e Náutica como catálogo (mesmo layout de #/baterias),
 * com página própria para cada produto que tem detalhes em `productDetails.js`,
 * e Moov e Parts como landing pages próprias. O roteador chama
 * `ctx.renderSectorPage(slug)` e `ctx.renderSectorProduct(slug, id)`, que montam a
 * página e devolvem a view a mostrar.
 * @param {import('./context').BehaviorContext} ctx
 */
function initSectorPages(ctx) {
  const { root, on } = ctx;
  const catalogView = root.getElementById('setorCatalogView');
  if (!catalogView) return;
  const productsById = {};
  PRODUCTS.forEach((p) => {
    productsById[p.id] = p;
  });
  // Variações que têm página própria no site mas não estão no catálogo de manuais
  // (ex.: Patch Panel GIGA/FAST) vêm só de productDetails.js, com nome e categoria.
  Object.keys(PRODUCT_DETAILS).forEach((id) => {
    const d = PRODUCT_DETAILS[id];
    if (!productsById[id] && d.name) {
      productsById[id] = {
        id,
        name: d.name,
        category: d.category,
        status: 'current',
        manualUrl: d.docs[0] ? d.docs[0].url : '',
      };
    }
  });
  const nameOf = (p) => (PRODUCT_DETAILS[p.id] && PRODUCT_DETAILS[p.id].name) || p.name;

  // Catálogo
  const title = root.getElementById('setorCatalogTitle');
  const track = root.getElementById('setorCatalogNav');
  const grid = root.getElementById('setorCatalogGrid');
  const catalog = createCatalogGrid(ctx, {
    grid,
    indicator: root.getElementById('setorCatalogIndicator'),
    attr: 'groups',
  });
  bindFilterTrack(ctx, track, catalog);
  const buildProductCard = (p, groupKey, slug) => {
    const detail = PRODUCT_DETAILS[p.id];
    const a = document.createElement('a');
    a.className = 'catalog-card';
    // Com detalhes: página do produto. Sem detalhes ainda: abre o manual.
    if (detail) {
      a.href = '#/setores/' + slug + '/' + p.id;
    } else {
      a.href = p.manualUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.dataset.groups = groupKey;
    const media = document.createElement('span');
    media.className = 'catalog-card-media';
    const image = detail && detail.images[0];
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = nameOf(p);
      img.loading = 'lazy';
      img.decoding = 'async';
      media.appendChild(img);
    } else {
      // Sem foto ainda: ícone do setor no lugar.
      media.classList.add('is-placeholder');
      media.innerHTML = SECTOR_ICONS[slug];
    }
    a.appendChild(media);
    const name = document.createElement('h3');
    name.className = 'catalog-card-name';
    name.textContent = nameOf(p);
    a.appendChild(name);
    const meta = document.createElement('p');
    meta.className = 'catalog-card-meta';
    meta.textContent = p.category;
    a.appendChild(meta);
    if (detail && detail.summary) {
      const desc = document.createElement('p');
      desc.className = 'catalog-card-desc';
      desc.textContent = detail.summary;
      a.appendChild(desc);
    }
    const cta = document.createElement('span');
    cta.className = 'catalog-card-cta';
    cta.innerHTML = detail ? t('catalog.more') + ' ' + ARROW_SVG : t('catalog.manual') + ' ' + ARROW_OUT_SVG;
    a.appendChild(cta);
    on(a, 'click', () =>
      trackEvent(detail ? 'sector_product_click' : 'manual_download', {
        product_id: p.id,
        source: 'setor_' + slug,
      }),
    );
    return a;
  };
  let builtSlug = null;
  const renderCatalog = (slug) => {
    const cfg = SECTOR_CATALOGS[slug];
    title.textContent = cfg.title;
    if (builtSlug === slug) return;
    builtSlug = slug;
    grid.innerHTML = '';
    const batteries =
      cfg.batterySector && ctx.batteriesForSector ? ctx.batteriesForSector(cfg.batterySector) : [];
    const groups = cfg.groups.filter((g) => g.ids.length || (g.key === cfg.batteryGroup && batteries.length));
    buildFilterTabs(track, [{ key: 'all', label: t('catalog.all') }, ...groups]);
    groups.forEach((g) => {
      if (g.key === cfg.batteryGroup) {
        batteries.forEach((card) => {
          card.dataset.groups = g.key;
          grid.appendChild(card);
          catalog.observe(card);
        });
      }
      g.ids.forEach((id) => {
        const p = productsById[id];
        if (!p || p.status !== 'current') return;
        const card = buildProductCard(p, g.key, slug);
        grid.appendChild(card);
        catalog.observe(card);
      });
    });
    requestAnimationFrame(() =>
      catalog.positionIndicator(track.querySelector('.catalog-filter-tab.is-active')),
    );
  };

  // Página do produto: mesma estrutura da página de bateria.
  const byId = (x) => root.getElementById(x);
  const prod = {
    view: byId('produtoView'),
    crumbSector: byId('produtoBreadcrumbSector'),
    crumbCurrent: byId('produtoBreadcrumbCurrent'),
    media: byId('produtoHeroMedia'),
    thumbs: byId('produtoThumbs'),
    eyebrow: byId('produtoEyebrow'),
    badge: byId('produtoBadge'),
    title: byId('produtoTitle'),
    headline: byId('produtoHeadline'),
    desc: byId('produtoDesc'),
    quickSection: byId('produtoQuickSpecsSection'),
    quick: byId('produtoQuickSpecs'),
    techSection: byId('produtoTechSection'),
    tech: byId('produtoTechGrid'),
    whySection: byId('produtoWhySection'),
    whyTitle: byId('produtoWhyTitle'),
    whyText: byId('produtoWhyText'),
    whyReasons: byId('produtoWhyReasons'),
    specsSection: byId('produtoSpecsSection'),
    specsTable: byId('produtoSpecsTable'),
    docs: byId('produtoDocs'),
    photos: byId('produtoPhotos'),
    support: byId('produtoSupportCta'),
    othersLabel: byId('produtoOthersLabel'),
    othersAll: byId('produtoOthersAll'),
    others: byId('produtoOthersGrid'),
  };
  const SECTOR_TITLES = IS_EXPORT
    ? { automotivo: t('nav.categories') }
    : Object.fromEntries(SECTOR_MENU.map((m) => [m.slug, m.title]));
  const svg = (d) =>
    '<svg viewBox="0 0 24 24" fill="none"><path d="' +
    d +
    '" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  // Ícones dos cards de tecnologia (usados em sequência).
  const TECH_ICONS = [
    svg('M13 2 4 14h7l-1 8 9-12h-7l1-8z'),
    svg('M12 3 4 7v5c0 4.6 3.2 7.9 8 9 4.8-1.1 8-4.4 8-9V7l-8-4ZM9 12l2 2 4-4'),
    svg('M4 5h16v11H4zM8 20h8M12 16v4'),
    svg(
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
    ),
    svg('M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01M2 9.5a14 14 0 0 1 20 0'),
    svg('M20 6 9 17l-5-5'),
  ];
  const DOC_ICON_DOWNLOAD = svg('M12 4v11m0 0-4-4m4 4 4-4M5 19h14');
  const DOC_ICON_LIBRARY = svg('M4 5h6v14H4zM10 5h4v14h-4zM15.5 5.5l3.5-.9 3 13.6-3.5.9z');
  const plain = (h) =>
    h
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .trim();
  const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
  // Item de lista → card: título curto (negrito ou até a primeira pausa) + texto.
  const splitItem = (html) => {
    const bold = html.match(/^<strong>(.*?)<\/strong>\s*[,:–-]?\s*(.*)$/);
    if (bold && plain(bold[1]).length <= 70) {
      return { title: plain(bold[1]).replace(/[,:]$/, ''), text: cap(plain(bold[2])) };
    }
    const t = plain(html);
    const m = t.match(/^(.{3,60}?)(?::\s|\s[–-]\s|,\s)(.+)$/);
    if (m) return { title: m[1], text: cap(m[2]) };
    return { title: t, text: '' };
  };
  const showPhoto = (src, alt) => {
    const current = prod.media.querySelector('img');
    if (current && current.getAttribute('src') === src) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.decoding = 'async';
    if (!current || ctx.reduceMotion) {
      prod.media.innerHTML = '';
      prod.media.appendChild(img);
      return;
    }
    current.classList.add('is-swapping');
    setTimeout(() => {
      prod.media.innerHTML = '';
      img.classList.add('is-swapping');
      prod.media.appendChild(img);
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.remove('is-swapping')));
    }, 180);
  };
  const renderSectorProduct = (slug, id) => {
    const cfg = SECTOR_CATALOGS[slug];
    const p = productsById[id];
    const detail = PRODUCT_DETAILS[id];
    if (!cfg || !p || !detail || !prod.view) return null;
    const group = cfg.groups.find((g) => g.ids.includes(id));
    const pname = nameOf(p);
    const sectorTitle = SECTOR_TITLES[slug] || slug;
    // 01 · Hero
    prod.view.classList.remove('is-entering');
    void prod.view.offsetWidth;
    prod.view.classList.add('is-entering');
    prod.crumbSector.href = '#/setores/' + slug;
    prod.crumbSector.textContent = sectorTitle;
    prod.crumbCurrent.textContent = pname;
    prod.eyebrow.textContent = IS_EXPORT ? t('product.eyebrow') : sectorTitle + ' JFA';
    prod.badge.textContent = p.category;
    prod.title.textContent = pname;
    prod.headline.textContent = detail.summary;
    const paras = detail.blocks.filter((b) => b.t === 'p');
    // O resumo em português é o começo do 1º parágrafo ("…"): a descrição é o resto
    // dele. Quando o resumo é uma frase própria (exportação), vale o parágrafo todo.
    const firstPara = paras[0] ? plain(paras[0].h) : '';
    const firstRest = firstPara.startsWith(detail.summary.replace(/…$/, ''))
      ? firstPara.slice(detail.summary.length).trim()
      : firstPara;
    // Exportação: o resumo já é a frase de abertura; o texto completo fica em "Por que escolher".
    const descText = IS_EXPORT ? '' : firstRest || (paras[1] ? plain(paras[1].h) : '');
    prod.desc.textContent = descText;
    prod.desc.hidden = !descText;
    prod.media.innerHTML = '';
    showPhoto(detail.images[0], pname);
    prod.thumbs.innerHTML = '';
    prod.thumbs.hidden = detail.images.length <= 1;
    if (detail.images.length > 1) {
      // Como na página de bateria: aparecem a foto anterior, a atual e a próxima.
      const N = detail.images.length;
      let idx = 0;
      const btns = detail.images.map((src, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bateria-gallery-thumb';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', tf('product.photoOf', { n: i + 1, name: pname }));
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        btn.appendChild(img);
        on(btn, 'click', () => goTo(i));
        prod.thumbs.appendChild(btn);
        return btn;
      });
      const syncThumbs = () => {
        btns.forEach((btn, i) => {
          btn.classList.toggle('is-active', i === idx);
          btn.classList.toggle('is-prev', N > 2 && i === (idx - 1 + N) % N);
          btn.classList.toggle('is-next', i === (idx + 1) % N && i !== idx);
          btn.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
      };
      const goTo = (i) => {
        idx = (i + N) % N;
        syncThumbs();
        showPhoto(detail.images[idx], pname + ' — foto ' + (idx + 1));
      };
      syncThumbs();
    }
    // 02 · Especificações rápidas
    const specs = PRODUCT_QUICK_SPECS[id] || [];
    prod.quickSection.hidden = !specs.length;
    prod.quick.innerHTML = specs
      .map(
        () =>
          '<div class="bateria-quickspec-item"><span class="bateria-quickspec-value"></span><span class="bateria-quickspec-label"></span></div>',
      )
      .join('');
    Array.from(prod.quick.children).forEach((el, i) => {
      el.children[0].textContent = specs[i][1];
      el.children[1].textContent = specs[i][0];
    });
    // 03 · Tecnologia: a lista de diferenciais vira cards.
    const lists = detail.blocks
      .map((b, i) => ({
        b,
        head: detail.blocks
          .slice(0, i)
          .reverse()
          .find((x) => x.t === 'h'),
      }))
      .filter((x) => x.b.t === 'ul');
    const isApps = (x) => x.head && /aplica/i.test(x.head.h);
    const techList = lists.find((x) => !isApps(x)) || null;
    const techItems = techList ? techList.b.items.slice(0, 6).map(splitItem) : [];
    prod.techSection.hidden = !techItems.length;
    prod.tech.innerHTML = '';
    techItems.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'bateria-tech-card';
      card.innerHTML =
        '<span class="bateria-tech-icon">' +
        TECH_ICONS[i % TECH_ICONS.length] +
        '</span><h3 class="bateria-tech-title"></h3><p class="bateria-tech-text"></p>';
      card.querySelector('.bateria-tech-title').textContent = it.title;
      const text = card.querySelector('.bateria-tech-text');
      text.textContent = it.text;
      text.hidden = !it.text;
      prod.tech.appendChild(card);
    });
    // 04 · Por que escolher: descrição completa + aplicações (ou demais listas).
    prod.whyTitle.textContent = pname;
    prod.whyText.innerHTML = paras.map((b) => '<p class="bateria-why-text">' + b.h + '</p>').join('');
    const reasonList = lists.find((x) => x !== techList);
    const reasons = reasonList ? reasonList.b.items.slice(0, 6) : [];
    prod.whyReasons.innerHTML = '';
    prod.whyReasons.hidden = !reasons.length;
    reasons.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'bateria-why-reason';
      item.innerHTML = '<span class="bateria-why-value"></span><span class="bateria-why-reason-text"></span>';
      item.children[0].textContent = String(i + 1).padStart(2, '0');
      // Rótulos em caixa alta vindos do site ("MODO MEMÓRIA: ...") viram texto normal.
      item.children[1].textContent = plain(r).replace(
        /^([^:a-z]{4,}):/,
        (m, g) => cap(g.toLowerCase()) + ':',
      );
      prod.whyReasons.appendChild(item);
    });
    prod.whySection.hidden = !paras.length && !reasons.length;
    prod.whySection.classList.toggle('has-no-reasons', !reasons.length);
    // 05 · Ficha técnica
    const table = detail.blocks.find((b) => b.t === 'table');
    prod.specsSection.hidden = !table;
    prod.specsTable.innerHTML = table ? '<div class="produto-table-wrap">' + table.html + '</div>' : '';
    // 06 · Documentos e suporte (mesmo visual da página de bateria)
    prod.docs.innerHTML = '';
    const rows = detail.docs.map((doc, i) => ({
      href: doc.url,
      external: true,
      title: i === 0 ? t('product.manual') : doc.label,
      text: i === 0 ? t('product.manualText') : t('product.docText'),
      cta: i === 0 ? t('product.downloadManual') : t('product.downloadDoc'),
    }));
    rows.push({
      // Exportação: a lista de manuais fica na Home (#manuais).
      href: IS_EXPORT ? '#manuais' : '#/manuais',
      title: t('product.manualsHub'),
      text: t('product.manualsHubText'),
      cta: t('product.seeManuals'),
    });
    rows.forEach((r, i) => {
      const row = document.createElement('a');
      row.className = 'bateria-doc-row' + (r.external && i === 0 ? ' is-primary' : '');
      row.href = r.href;
      if (r.external) {
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
      }
      row.innerHTML =
        '<span class="bateria-doc-row-icon">' +
        (r.external ? DOC_ICON_DOWNLOAD : DOC_ICON_LIBRARY) +
        '</span><span class="bateria-doc-row-body"><p class="bateria-doc-row-title"></p><p class="bateria-doc-row-text"></p></span><span class="bateria-doc-row-arrow"></span>';
      row.querySelector('.bateria-doc-row-title').textContent = r.title;
      row.querySelector('.bateria-doc-row-text').textContent = r.text;
      row.querySelector('.bateria-doc-row-arrow').textContent = r.cta + ' →';
      if (r.external)
        on(row, 'click', () => trackEvent('manual_download', { product_id: id, source: 'produto_docs' }));
      prod.docs.appendChild(row);
    });
    renderPhotoDownloads(prod.photos, detail.images, pname, { product_id: id });
    // Como usar: vídeo do campo `video` do produto (sem vídeo: "Vídeo em breve").
    renderHowTo('produto', { id, name: pname, video: detail.video, poster: detail.videoPoster });
    prod.support.href =
      'https://api.whatsapp.com/send?phone=' +
      WHATSAPP_PHONE +
      '&text=' +
      encodeURIComponent(tf('product.whatsappText', { name: pname }));
    prod.support.onclick = () => trackEvent('whatsapp_click', { source: 'produto_page', product_id: id });
    // 07 · Outros produtos da mesma linha (ou do setor, se a linha tiver só este).
    const pool = (group && group.ids.length > 1 ? group.ids : cfg.groups.flatMap((g) => g.ids)).filter(
      (x) => x !== id && productsById[x] && productsById[x].status === 'current',
    );
    prod.othersLabel.textContent =
      group && group.ids.length > 1 ? tf('product.moreIn', { group: group.label }) : t('product.others');
    prod.othersAll.href = '#/setores/' + slug;
    prod.others.innerHTML = '';
    pool.slice(0, 3).forEach((x) => {
      const card = buildProductCard(productsById[x], group ? group.key : '', slug);
      card.classList.add('is-revealed');
      prod.others.appendChild(card);
    });
    trackEvent('sector_product_view', { sector: slug, product_id: id });
    return 'produto';
  };
  ctx.renderSectorProduct = renderSectorProduct;

  // Moov: cliques nos botões que levam à loja oficial.
  const moovView = root.getElementById('moovView');
  if (moovView) {
    moovView
      .querySelectorAll('[data-moov-cta]')
      .forEach((a) => on(a, 'click', () => trackEvent('moov_store_click', { position: a.dataset.moovCta })));
  }

  ctx.renderSectorPage = (slug) => {
    // Moov: landing page fixa (components/pages/MoovPage.jsx).
    if (slug === 'moov' && root.getElementById('moovView')) {
      trackEvent('sector_page_view', { sector: slug });
      return 'moov';
    }
    if (SECTOR_CATALOGS[slug]) {
      renderCatalog(slug);
      trackEvent('sector_page_view', { sector: slug });
      return 'setorCatalog';
    }
    // Parts: landing page fixa (components/pages/PartsPage.jsx).
    if (slug === 'parts' && root.getElementById('partsView')) {
      trackEvent('sector_page_view', { sector: slug });
      return 'parts';
    }
    return null;
  };
  ctx.positionSectorFilter = () =>
    catalog.positionIndicator(track.querySelector('.catalog-filter-tab.is-active'));
}
export { initSectorPages };
