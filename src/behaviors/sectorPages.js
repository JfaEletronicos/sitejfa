import { trackEvent } from '../lib/analytics';
import { PRODUCTS } from '../data/products';
import { SECTOR_CATALOGS, SECTOR_INSTITUTIONAL, SECTOR_ICONS } from '../data/sectors';
import { PRODUCT_DETAILS } from '../data/productDetails';
import { createCatalogGrid, buildFilterTabs, bindFilterTrack } from './catalogGrid';

const WHATSAPP_PHONE = '553125336100';
const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const ARROW_OUT_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M9 7h8v8M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

/**
 * Páginas de setor: Automotivo e Telecom como catálogo (mesmo layout de #/baterias),
 * com página própria para cada produto que tem detalhes em `productDetails.js`,
 * e Moov e Parts como páginas institucionais. O roteador chama
 * `ctx.renderSectorPage(slug)` e `ctx.renderSectorProduct(slug, id)`, que montam a
 * página e devolvem a view a mostrar.
 * @param {import('./context').BehaviorContext} ctx
 */
function initSectorPages(ctx) {
  const { root, on } = ctx;
  const catalogView = root.getElementById('setorCatalogView');
  const instView = root.getElementById('setorInstView');
  if (!catalogView || !instView) return;
  const productsById = {};
  PRODUCTS.forEach((p) => {
    productsById[p.id] = p;
  });

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
      img.alt = p.name;
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
    name.textContent = p.name;
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
    cta.innerHTML = detail ? 'Conhecer produto ' + ARROW_SVG : 'Ver manual ' + ARROW_OUT_SVG;
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
    buildFilterTabs(track, [{ key: 'all', label: 'Todos' }, ...groups]);
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

  // Institucional
  const inst = {
    eyebrow: root.getElementById('setorInstEyebrow'),
    title: root.getElementById('setorInstTitle'),
    sub: root.getElementById('setorInstSub'),
    image: root.getElementById('setorInstImage'),
    story: root.getElementById('setorInstStory'),
    manuals: root.getElementById('setorInstManuals'),
    manualsLabel: root.getElementById('setorInstManualsLabel'),
    whatsapp: root.getElementById('setorInstWhatsapp'),
  };
  let instSlug = null;
  const renderInstitutional = (slug) => {
    const s = SECTOR_INSTITUTIONAL[slug];
    instSlug = slug;
    instView.dataset.sector = slug;
    inst.eyebrow.textContent = s.eyebrow;
    inst.title.textContent = s.title;
    inst.sub.textContent = s.sub;
    inst.image.src = s.image;
    inst.image.alt = s.imageAlt;
    inst.story.innerHTML = '';
    s.story.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      inst.story.appendChild(p);
    });
    if (s.accent) {
      const p = document.createElement('p');
      p.className = 'setor-inst-accent';
      p.textContent = s.accent;
      inst.story.appendChild(p);
    }
    inst.manualsLabel.textContent = s.manualsLabel;
    inst.whatsapp.href =
      'https://api.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + encodeURIComponent(s.whatsappText);
  };
  // "Ver manuais": abre #/manuais já na aba do setor (o roteador aplica ao mostrar a página).
  on(inst.manuals, 'click', () => {
    if (instSlug) ctx.pendingManualsTab = SECTOR_INSTITUTIONAL[instSlug].manualsTab;
  });
  on(inst.whatsapp, 'click', () =>
    trackEvent('whatsapp_click', { source: 'setor_page', sector: instSlug || '' }),
  );

  // Página do produto
  const prod = {
    view: root.getElementById('produtoView'),
    crumbSector: root.getElementById('produtoBreadcrumbSector'),
    crumbCurrent: root.getElementById('produtoBreadcrumbCurrent'),
    media: root.getElementById('produtoHeroMedia'),
    thumbs: root.getElementById('produtoThumbs'),
    eyebrow: root.getElementById('produtoEyebrow'),
    title: root.getElementById('produtoTitle'),
    summary: root.getElementById('produtoSummary'),
    manual: root.getElementById('produtoManualCta'),
    about: root.getElementById('produtoAbout'),
    docs: root.getElementById('produtoDocs'),
    othersLabel: root.getElementById('produtoOthersLabel'),
    othersAll: root.getElementById('produtoOthersAll'),
    others: root.getElementById('produtoOthersGrid'),
  };
  const SECTOR_TITLES = { automotivo: 'Automotivo', telecom: 'Telecom' };
  const DOC_ICON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
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
    prod.crumbSector.href = '#/setores/' + slug;
    prod.crumbSector.textContent = SECTOR_TITLES[slug] || slug;
    prod.crumbCurrent.textContent = p.name;
    prod.eyebrow.textContent = (SECTOR_TITLES[slug] || '') + ' \xB7 ' + p.category;
    prod.title.textContent = p.name;
    prod.summary.textContent = detail.summary;
    // Galeria: foto principal + miniaturas (só com mais de uma foto).
    prod.media.innerHTML = '';
    showPhoto(detail.images[0], p.name);
    prod.thumbs.innerHTML = '';
    prod.thumbs.hidden = detail.images.length <= 1;
    if (detail.images.length > 1) {
      // Mesma lógica da página de bateria: aparecem a foto anterior, a atual e a próxima.
      const N = detail.images.length;
      let idx = 0;
      const btns = detail.images.map((src, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bateria-gallery-thumb';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Ver foto ' + (i + 1) + ' de ' + p.name);
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
        showPhoto(detail.images[idx], p.name + ' \u2014 foto ' + (idx + 1));
      };
      syncThumbs();
    }
    const mainDoc = detail.docs[0];
    prod.manual.hidden = !mainDoc;
    if (mainDoc) prod.manual.href = mainDoc.url;
    prod.manual.onclick = () => trackEvent('manual_download', { product_id: id, source: 'produto_page' });
    // Sobre o produto: blocos vindos do site (HTML limitado a <strong>).
    prod.about.innerHTML = detail.blocks
      .map((b) => {
        if (b.t === 'h') return '<h3>' + b.h + '</h3>';
        if (b.t === 'ul') return '<ul>' + b.items.map((it) => '<li>' + it + '</li>').join('') + '</ul>';
        return '<p>' + b.h + '</p>';
      })
      .join('');
    // Documentos: mesmo visual da página de bateria.
    prod.docs.innerHTML = '';
    detail.docs.forEach((doc, i) => {
      const row = document.createElement('a');
      row.className = 'bateria-doc-row' + (i === 0 ? ' is-primary' : '');
      row.href = doc.url;
      row.target = '_blank';
      row.rel = 'noopener noreferrer';
      row.innerHTML =
        '<span class="bateria-doc-row-icon">' +
        DOC_ICON +
        '</span><span class="bateria-doc-row-body"><p class="bateria-doc-row-title"></p><p class="bateria-doc-row-text">PDF</p></span><span class="bateria-doc-row-arrow">Baixar \u2192</span>';
      row.querySelector('.bateria-doc-row-title').textContent = doc.label;
      on(row, 'click', () => trackEvent('manual_download', { product_id: id, source: 'produto_docs' }));
      prod.docs.appendChild(row);
    });
    // Outros produtos da mesma linha (ou do setor, se a linha tiver só este).
    const pool = (group && group.ids.length > 1 ? group.ids : cfg.groups.flatMap((g) => g.ids)).filter(
      (x) => x !== id && productsById[x] && productsById[x].status === 'current',
    );
    prod.othersLabel.textContent =
      group && group.ids.length > 1 ? 'Mais em ' + group.label : 'Outros produtos';
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
    if (SECTOR_INSTITUTIONAL[slug]) {
      renderInstitutional(slug);
      trackEvent('sector_page_view', { sector: slug });
      return 'setorInst';
    }
    return null;
  };
  ctx.positionSectorFilter = () =>
    catalog.positionIndicator(track.querySelector('.catalog-filter-tab.is-active'));
}
export { initSectorPages };
