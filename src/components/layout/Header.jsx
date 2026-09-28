import {
  SHOPEE_URL,
  SHOPEE_LOGO,
  SHOPEE_LOGO_LIGHT,
  MERCADO_LIVRE_URL,
  MERCADO_LIVRE_LOGO,
  MERCADO_LIVRE_LOGO_LIGHT,
} from '../../data/links';
import { SECTOR_MENU, SECTOR_ICONS } from '../../data/sectors';
import { t, LANG, LANGS, IS_EXPORT } from '../../i18n';

const CURRENT_LANG = LANGS.find((l) => l.code === LANG) || LANGS[0];

/** Header fixo com navegação e o painel de busca global. */
export default function Header() {
  return (
    <>
      <header className="jfa-header" id="jfaHeader">
        <nav className="jfa-nav-left" aria-label={t('nav.main')}>
          <a className="jfa-logo jfa-logo-link" id="navHome" href="#home" aria-label={t('nav.home')}>
            <img className="jfa-logo-mark" src="/images/jfa_logo_mark.webp" alt="" width="40" height="40" />{' '}
            <span className="jfa-logo-word">JFA</span>
          </a>
          {IS_EXPORT ? (
            // Exportação (EN/ES): um catálogo só, direto na página dele.
            <a href="#/setores/automotivo" id="navExportProducts">
              {t('nav.categories')}
            </a>
          ) : (
            <>
              {/* Baterias não têm mais um item próprio: cada categoria mostra as suas. */}
              <div className="jfa-sector-nav" id="sectorNav">
                <button
                  className="jfa-sector-trigger"
                  id="navSetores"
                  type="button"
                  aria-expanded="false"
                  aria-controls="sectorMenu"
                >
                  {t('nav.categories')}
                  <svg className="jfa-sector-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="jfa-sector-menu" id="sectorMenu" hidden>
                  {SECTOR_MENU.map((s, i) => (
                    <a
                      key={s.slug}
                      className="jfa-sector-item"
                      href={`#/setores/${s.slug}`}
                      data-sector={s.slug}
                      style={{ '--i': i }}
                    >
                      <span
                        className="jfa-sector-icon"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: SECTOR_ICONS[s.slug] }}
                      />
                      <span className="jfa-sector-text">
                        <span className="jfa-sector-name">{s.title}</span>
                        <span className="jfa-sector-line">{s.line}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </nav>
        <nav className="jfa-nav-right" aria-label={t('nav.right')}>
          {IS_EXPORT ? (
            <>
              <a href="#manuais" data-header-scroll="manuais">
                {t('nav.manuals')}
              </a>{' '}
              <a href="#contato" data-header-scroll="contato">
                {t('nav.contact')}
              </a>{' '}
            </>
          ) : (
            <>
              <a href="#/suporte" data-nav-page="suporte">
                Suporte
              </a>{' '}
              <a href="#/manuais" data-nav-page="manuais">
                Manuais
              </a>{' '}
              <a href="#/representantes" data-nav-page="representantes">
                Representantes
              </a>{' '}
              {/* Lojas: no lugar do nome, o logo de cada marketplace. */}
              <a
                href={SHOPEE_URL}
                className="jfa-nav-external jfa-nav-brand is-shopee"
                data-header-external="shopee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shopee"
              >
                <img
                  className="brand-logo is-on-dark"
                  src={SHOPEE_LOGO}
                  alt="Shopee"
                  width="75"
                  height="25"
                />
                <img
                  className="brand-logo is-on-light"
                  src={SHOPEE_LOGO_LIGHT}
                  alt=""
                  width="75"
                  height="25"
                />
              </a>{' '}
              <a
                href={MERCADO_LIVRE_URL}
                className="jfa-nav-external jfa-nav-brand is-ml"
                data-header-external="mercado-livre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mercado Livre"
              >
                <img
                  className="brand-logo is-on-dark"
                  src={MERCADO_LIVRE_LOGO}
                  alt="Mercado Livre"
                  width="95"
                  height="24"
                />
                <img
                  className="brand-logo is-on-light"
                  src={MERCADO_LIVRE_LOGO_LIGHT}
                  alt=""
                  width="95"
                  height="24"
                />
              </a>{' '}
            </>
          )}
          {/* Idioma: PT (site completo), EN e ES (exportação). */}
          <div className="jfa-lang" id="langSwitch">
            <button
              className="jfa-lang-trigger"
              id="langTrigger"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="langMenu"
              aria-label={t('nav.language') + ': ' + CURRENT_LANG.label}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.6" />
                <ellipse cx="12" cy="12" rx="3.6" ry="8.4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3.6 12h16.8" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>{CURRENT_LANG.short}</span>
            </button>
            <div className="jfa-lang-menu" id="langMenu" role="menu" hidden>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  className={'jfa-lang-item' + (l.code === LANG ? ' is-active' : '')}
                  type="button"
                  role="menuitemradio"
                  aria-checked={l.code === LANG}
                  data-lang={l.code}
                  lang={l.html}
                >
                  <span className="jfa-lang-code">{l.short}</span> {l.label}
                </button>
              ))}
            </div>
          </div>{' '}
          <button
            className="jfa-theme-toggle"
            id="themeToggle"
            type="button"
            aria-label={t('theme.toggle')}
            aria-pressed="false"
          >
            <svg className="jfa-theme-icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg className="jfa-theme-icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>{' '}
          {/* Busca: só no site em português (o catálogo de exportação é curto). */}
          {!IS_EXPORT && (
            <button
              className="jfa-search-trigger"
              id="searchTrigger"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="searchPanel"
              aria-label="Buscar produto, modelo ou código"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </nav>
      </header>
      {!IS_EXPORT && (
        <div
          className="jfa-search-panel"
          id="searchPanel"
          role="dialog"
          aria-modal="true"
          aria-label="Busca"
          hidden
        >
          <div className="jfa-search-card">
            <div className="jfa-search-field">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>{' '}
              <input
                type="text"
                className="jfa-search-input"
                id="searchInput"
                placeholder="Busque produto, modelo ou código"
                autoComplete="off"
                aria-label="Busque produto, modelo ou código"
              />{' '}
              <button className="jfa-search-close" id="searchClose" type="button" aria-label="Fechar busca">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="jfa-search-results" id="searchResults" aria-live="polite" />
          </div>
        </div>
      )}
    </>
  );
}
