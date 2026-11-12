/**
 * Atualiza título, descrição, canônico e prévia de compartilhamento (Open Graph) a cada
 * troca de tela, com os mesmos valores das páginas geradas no build (src/seo/pages.js).
 * Na exportação (inglês/espanhol) os títulos ficam com as próprias páginas.
 */
import { IS_EXPORT } from '../i18n';
import { seoForPath, absoluteUrl } from './pages';

const setTag = (selector, create, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const meta = (key, value, attrName = 'name') =>
  setTag(
    'meta[' + attrName + '="' + key + '"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute(attrName, key);
      return m;
    },
    'content',
    value,
  );

export const applySeo = (path) => {
  if (IS_EXPORT) return;
  const page = seoForPath(path);
  if (!page) return;
  try {
    document.title = page.title;
    meta('description', page.description);
    setTag(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.rel = 'canonical';
        return l;
      },
      'href',
      absoluteUrl(page.canonical),
    );
    meta('og:title', page.title, 'property');
    meta('og:description', page.description, 'property');
    meta('og:url', absoluteUrl(page.canonical), 'property');
    meta('og:image', absoluteUrl(page.image), 'property');
  } catch {
    /* SEO nunca pode quebrar a navegação */
  }
};
