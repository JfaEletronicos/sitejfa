/**
 * Páginas do site para o Google: título, descrição, imagem, endereço canônico e
 * caminho (breadcrumb) de cada endereço. A mesma lista alimenta as páginas geradas
 * no build (src/seo/build.js: um index.html por endereço e o sitemap.xml) e o
 * navegador (src/seo/apply.js, a cada troca de tela).
 */
import { SECTOR_MENU, SECTOR_CATALOGS } from '../data/sectors';
import { PRODUCTS } from '../data/products';
import { PRODUCT_DETAILS } from '../data/productDetails';
import { BATTERY_CATALOG } from '../data/batteries';

export const SITE_URL = 'https://jfaeletronicos.com';
export const SITE_NAME = 'JFA Eletrônicos';
export const DEFAULT_IMAGE = '/images/jfa_logo_dark.webp';

// Setor da bateria -> categoria do menu (o mesmo mapa do roteador).
const BATTERY_CATEGORY = { automotivo: 'automotivo', solar: 'solar', nautico: 'nautica', energia: 'energia', motorhome: 'motorhome' };

const plain = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Descrição até ~155 caracteres, cortada no fim de uma palavra.
const clip = (text, max = 155) => {
  const t = plain(text).replace(/…$/, '').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s-]+$/, '') + '…';
};

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

let cache = null;

/** Todas as páginas (com `sitemap: false` as que só existem para redirecionar). */
export const allPages = () => {
  if (cache) return cache;
  const pages = [];
  const home = { name: 'Início', path: '/' };
  const productsById = {};
  PRODUCTS.forEach((p) => {
    productsById[p.id] = p;
  });

  pages.push({
    path: '/',
    title: 'JFA Eletrônicos | Fontes, baterias de lítio, nobreaks e inversores',
    description:
      'Há mais de duas décadas a JFA desenvolve fontes automotivas, baterias de lítio LiFePO4, nobreaks, inversores e controles. Manuais, suporte e onde comprar.',
    image: DEFAULT_IMAGE,
    breadcrumbs: [],
    home: true,
  });
  pages.push({
    path: '/suporte',
    title: 'Assistência técnica e suporte | JFA Eletrônicos',
    description:
      'Encontre a assistência técnica autorizada JFA mais perto de você, em todo o Brasil, ou fale direto com o suporte técnico da JFA.',
    breadcrumbs: [home, { name: 'Suporte', path: '/suporte' }],
  });
  pages.push({
    path: '/representantes',
    title: 'Representantes e onde comprar | JFA Eletrônicos',
    description:
      'Encontre o representante comercial JFA do seu estado e saiba onde comprar fontes, baterias de lítio, nobreaks e inversores JFA.',
    breadcrumbs: [home, { name: 'Representantes', path: '/representantes' }],
  });
  pages.push({
    path: '/manuais',
    title: 'Manuais dos produtos | JFA Eletrônicos',
    description:
      'Baixe em PDF os manuais das fontes, baterias de lítio, nobreaks, inversores, controles e demais produtos JFA.',
    breadcrumbs: [home, { name: 'Manuais', path: '/manuais' }],
  });

  // Categorias do menu e os produtos com página em cada uma.
  SECTOR_MENU.forEach((m) => {
    const cfg = SECTOR_CATALOGS[m.slug];
    if (!cfg) return;
    const sectorPath = '/setores/' + m.slug;
    const sectorCrumb = { name: m.title, path: sectorPath };
    const ids = cfg.groups.flatMap((g) => g.ids);
    const names = ids
      .map((id) => (PRODUCT_DETAILS[id] && PRODUCT_DETAILS[id].name) || (productsById[id] && productsById[id].name))
      .filter(Boolean);
    const batteries = BATTERY_CATALOG.filter((b) => b.sectors.includes(cfg.batterySector)).map((b) => b.name);
    const list = [...names, ...batteries].slice(0, 6).join(', ');
    pages.push({
      path: sectorPath,
      title: m.title + ': ' + lowerFirst(m.line.replace(/\.$/, '')) + ' | JFA Eletrônicos',
      description: clip(cfg.title + (list ? ' Conheça ' + list + '.' : '')),
      breadcrumbs: [home, sectorCrumb],
    });
    ids.forEach((id) => {
      const d = PRODUCT_DETAILS[id];
      if (!d) return;
      const name = d.name || (productsById[id] && productsById[id].name);
      if (!name) return;
      const firstPara = (d.blocks || []).find((b) => b.t === 'p');
      pages.push({
        path: sectorPath + '/' + id,
        title: name + ' | JFA Eletrônicos',
        description: clip(firstPara ? firstPara.h : d.summary),
        image: d.images && d.images[0],
        breadcrumbs: [home, sectorCrumb, { name, path: sectorPath + '/' + id }],
      });
    });
  });

  // Baterias: a página da bateria e, com variantes, uma por capacidade. A variante
  // padrão é a própria página da bateria (o endereço dela aponta o canônico para lá).
  BATTERY_CATALOG.forEach((b) => {
    const base = '/baterias/' + b.slug;
    const catSlug = BATTERY_CATEGORY[b.sectors[0]] || 'automotivo';
    const cat = SECTOR_MENU.find((m) => m.slug === catSlug);
    const catCrumb = cat ? [{ name: cat.title, path: '/setores/' + cat.slug }] : [];
    const describe = (x) => clip([x.marketingHeadline, x.longDescription || x.shortDescription].filter(Boolean).join(' '));
    const variants = b.variants || [];
    const def = variants.find((v) => v.key === b.defaultVariant) || variants[0];
    const merged = (v) => (v ? { ...b, ...v } : b);
    const mainName = def ? b.name + ' ' + def.capacity : b.name;
    pages.push({
      path: base,
      title: mainName + ' | Bateria de lítio JFA',
      description: describe(merged(def)),
      image: (merged(def).images || [])[0] || b.image,
      breadcrumbs: [home, ...catCrumb, { name: mainName, path: base }],
    });
    variants.forEach((v) => {
      const path = base + '/' + v.key;
      const name = b.name + ' ' + v.capacity;
      const isDefault = v === def;
      pages.push({
        path,
        canonical: isDefault ? base : path,
        sitemap: !isDefault,
        title: name + ' | Bateria de lítio JFA',
        description: describe(merged(v)),
        image: (v.images || [])[0] || b.image,
        breadcrumbs: [home, ...catCrumb, { name, path: isDefault ? base : path }],
      });
    });
  });

  cache = pages.map((p) => ({ image: DEFAULT_IMAGE, canonical: p.path, sitemap: true, ...p }));
  return cache;
};

let byPath = null;
/** Página de um endereço ("/setores/automotivo"), ou null. */
export const seoForPath = (path) => {
  if (!byPath) byPath = new Map(allPages().map((p) => [p.path, p]));
  return byPath.get(path) || null;
};

export const absoluteUrl = (path) => (/^https?:\/\//.test(path) ? path : SITE_URL + path);

/** Dados estruturados (JSON-LD): organização e site na Home, caminho nas demais. */
export const structuredData = (page) => {
  const items = [];
  if (page.home) {
    items.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl(DEFAULT_IMAGE),
      sameAs: ['https://www.instagram.com/jfaeletronicos/', 'https://www.youtube.com/user/JFACANAL'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+55-31-2533-6100',
        contactType: 'customer service',
        areaServed: 'BR',
        availableLanguage: ['Portuguese'],
      },
    });
    items.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL });
  }
  if (page.breadcrumbs && page.breadcrumbs.length > 1) {
    items.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absoluteUrl(c.path),
      })),
    });
  }
  return items;
};
