/**
 * Gera, a partir do dist/index.html, um index.html por endereço do site (com título,
 * descrição, canônico, Open Graph e JSON-LD próprios), o 404.html e o sitemap.xml.
 * Chamado pelo plugin do vite.config.js no fim do build.
 */
import { allPages, absoluteUrl, structuredData, SITE_NAME } from './pages';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Tira do modelo o título e a descrição originais (o build coloca os da página).
const baseHead = (template) =>
  template.replace(/<title>[\s\S]*?<\/title>\s*/i, '').replace(/<meta\s+name="description"[\s\S]*?\/?>\s*/i, '');

const headFor = (page) => {
  const url = absoluteUrl(page.canonical);
  const tags = [
    '<title>' + esc(page.title) + '</title>',
    '<meta name="description" content="' + esc(page.description) + '" />',
    '<link rel="canonical" href="' + esc(url) + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="' + esc(SITE_NAME) + '" />',
    '<meta property="og:locale" content="pt_BR" />',
    '<meta property="og:title" content="' + esc(page.title) + '" />',
    '<meta property="og:description" content="' + esc(page.description) + '" />',
    '<meta property="og:url" content="' + esc(url) + '" />',
    '<meta property="og:image" content="' + esc(absoluteUrl(page.image)) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...structuredData(page).map(
      (d) => '<script type="application/ld+json">' + JSON.stringify(d).replace(/</g, '\\u003c') + '</script>',
    ),
  ];
  return '    ' + tags.join('\n    ') + '\n';
};

/** { pages: [{ path, html }], notFound, sitemap } */
export const renderSite = (template) => {
  const head = baseHead(template);
  const inject = (extra) => head.replace('</head>', extra + '  </head>');
  const pages = allPages().map((p) => ({ path: p.path, html: inject(headFor(p)) }));
  const notFound = inject(
    '    <title>Página não encontrada | ' +
      esc(SITE_NAME) +
      '</title>\n    <meta name="robots" content="noindex" />\n',
  );
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    allPages()
      .filter((p) => p.sitemap)
      .map((p) => '  <url>\n    <loc>' + esc(absoluteUrl(p.path)) + '</loc>\n  </url>\n')
      .join('') +
    '</urlset>\n';
  return { pages, notFound, sitemap };
};
