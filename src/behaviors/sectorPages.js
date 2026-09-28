import { trackEvent } from '../lib/analytics';
import { PRODUCTS } from '../data/products';
import { SECTOR_CATALOGS, SECTOR_INSTITUTIONAL, SECTOR_ICONS } from '../data/sectors';
import { createCatalogGrid, buildFilterTabs, bindFilterTrack } from './catalogGrid';

const WHATSAPP_PHONE = '553125336100';
const ARROW_OUT_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M9 7h8v8M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

/**
 * Páginas de setor: Automotivo e Telecom como catálogo (mesmo layout de #/baterias)
 * e Moov e Parts como páginas institucionais. O roteador chama
 * `ctx.renderSectorPage(slug)`, que monta a página e devolve a view a mostrar.
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
  const buildProductCard = (p, groupKey, cfg, slug) => {
    const a = document.createElement('a');
    a.className = 'catalog-card';
    a.href = p.manualUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.groups = groupKey;
    const media = document.createElement('span');
    media.className = 'catalog-card-media';
    const image = cfg.images[p.id];
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
    const cta = document.createElement('span');
    cta.className = 'catalog-card-cta';
    cta.innerHTML = 'Ver manual ' + ARROW_OUT_SVG;
    a.appendChild(cta);
    on(a, 'click', () => trackEvent('manual_download', { product_id: p.id, source: 'setor_' + slug }));
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
        const card = buildProductCard(p, g.key, cfg, slug);
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

  ctx.renderSectorPage = (slug) => {
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
