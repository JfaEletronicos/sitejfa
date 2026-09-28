import { STRINGS } from './strings';

/**
 * Idiomas do site: Português (site completo, Brasil), Inglês e Espanhol
 * (visualização de exportação: catálogo de exportação, manuais e vendas
 * internacionais).
 *
 * Escolha do idioma, nesta ordem: `?lang=xx` na URL, a escolha salva do
 * visitante (`localStorage` "jfa-lang") e o idioma do navegador (pt → PT,
 * es → ES, qualquer outro → EN). Trocar de idioma salva a escolha e recarrega a
 * página, porque os comportamentos são montados uma vez só.
 */
export const LANGS = [
  { code: 'pt', label: 'Português', short: 'PT', html: 'pt-BR' },
  { code: 'en', label: 'English', short: 'EN', html: 'en' },
  { code: 'es', label: 'Español', short: 'ES', html: 'es' },
];

const STORAGE_KEY = 'jfa-lang';
const isLang = (l) => LANGS.some((x) => x.code === l);

const detectLang = () => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (isLang(fromUrl)) {
      localStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
  } catch {
    /* sem URL/armazenamento: segue para o navegador */
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* armazenamento bloqueado */
  }
  // Robôs de busca (Google etc.) ficam no português: o endereço principal é o site brasileiro.
  if (
    typeof navigator !== 'undefined' &&
    /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)
  )
    return 'pt';
  const langs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  for (const l of langs) {
    const code = String(l || '')
      .slice(0, 2)
      .toLowerCase();
    if (code === 'pt') return 'pt';
    if (code === 'es') return 'es';
    if (code) return 'en';
  }
  return 'pt';
};

/** Idioma atual (definido uma vez, antes da primeira renderização). */
export const LANG = typeof window === 'undefined' ? 'pt' : detectLang();

/** Inglês e espanhol mostram a visualização de exportação. */
export const IS_EXPORT = LANG !== 'pt';

/** Texto da chave no idioma atual (cai para o português se faltar). */
export const t = (key) => {
  const entry = STRINGS[key];
  if (!entry) {
    if (import.meta.env.DEV) console.warn('[i18n] chave sem texto:', key);
    return key;
  }
  return entry[LANG] ?? entry.pt;
};

/** Escolhe o valor do idioma atual num objeto { en, es } (ou { pt, en, es }). */
export const pick = (obj) => (obj ? (obj[LANG] ?? obj.en ?? obj.pt) : '');

/** Salva o idioma escolhido e recarrega a página nele. */
export const setLang = (code) => {
  if (!isLang(code) || code === LANG) return;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* sem armazenamento: vale só pela URL */
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', code);
  window.location.replace(url.toString());
};

/** Texto com variáveis: tf('product.moreIn', { group: 'Áudio' }). */
export const tf = (key, vars = {}) => t(key).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
