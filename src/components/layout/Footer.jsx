import { SHOW_MOOV, SHOW_PARTS } from '../../data/visibility';
import { SECTOR_MENU } from '../../data/sectors';
import { INSTAGRAM_URL, YOUTUBE_URL } from '../../data/links';
import { t, IS_EXPORT } from '../../i18n';

// Categorias do rodapé (JFA Parts e Moov continuam com os links antigos logo abaixo).
const FOOTER_CATEGORIES = SECTOR_MENU.filter((s) => s.slug !== 'parts' && s.slug !== 'moov');

/** Rodapé. */
export default function Footer() {
  return (
    <footer className="jfa-footer" id="jfaFooter" data-theme-keep>
      <div className="jfa-footer-texture" aria-hidden="true" />
      <div className="jfa-footer-inner">
        <div className="jfa-footer-top">
          <div className="jfa-footer-brand">
            <div className="jfa-logo jfa-footer-logo">
              <img className="jfa-logo-mark" src="/images/jfa_logo_mark.webp" alt="" width="40" height="40" />{' '}
              <span className="jfa-logo-word">JFA</span>
            </div>
            <p className="jfa-footer-tagline">{t('footer.tagline')}</p>
            {/* Redes sociais */}
            <div className="jfa-footer-social" aria-label={t('footer.social')}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.instagram')}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.youtube')}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="m10 15 5.2-3L10 9v6Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
          {IS_EXPORT ? (
            <nav className="jfa-footer-cols" aria-label={t('footer.links')}>
              <div className="jfa-footer-col" data-footer-col="0">
                <span className="jfa-footer-col-title">{t('footer.products')}</span>{' '}
                <a href="#/setores/automotivo">{t('footer.automotive')}</a>
              </div>
              <div className="jfa-footer-col" data-footer-col="1">
                <span className="jfa-footer-col-title">{t('footer.jfa')}</span>{' '}
                <a href="#home" data-footer-scroll="home">
                  {t('footer.about')}
                </a>{' '}
                <a href="#contato" data-footer-scroll="contato">
                  {t('nav.contact')}
                </a>
              </div>
              <div className="jfa-footer-col" data-footer-col="2">
                <span className="jfa-footer-col-title">{t('footer.support')}</span>{' '}
                <a href="#manuais" data-footer-scroll="manuais">
                  {t('nav.manuals')}
                </a>
              </div>
            </nav>
          ) : (
            <nav className="jfa-footer-cols" aria-label="Links do rodapé">
              <div className="jfa-footer-col" data-footer-col="0">
                <span className="jfa-footer-col-title">Produtos</span>{' '}
                {FOOTER_CATEGORIES.map((c) => (
                  <a key={c.slug} href={'#/setores/' + c.slug}>
                    {c.title}
                  </a>
                ))}{' '}
                {/* OCULTO: Moov/Parts (data/visibility.js) */}
                {SHOW_PARTS && (
                  <a href="#frentes" data-footer-goto="2">
                    Parts
                  </a>
                )}{' '}
                {SHOW_MOOV && (
                  <a href="#frentes" data-footer-goto="3">
                    Moov
                  </a>
                )}
              </div>
              <div className="jfa-footer-col" data-footer-col="1">
                <span className="jfa-footer-col-title">JFA</span>{' '}
                <a href="#home" data-footer-scroll="home">
                  Sobre nós
                </a>{' '}
                <a href="#/representantes" data-nav-page="representantes">
                  Representantes
                </a>{' '}
                <a href="#certificacoes" data-footer-scroll="certificacoes">
                  Certificações
                </a>
              </div>
              <div className="jfa-footer-col" data-footer-col="2">
                <span className="jfa-footer-col-title">Suporte</span>{' '}
                <a href="#/manuais" data-nav-page="manuais">
                  Manuais
                </a>{' '}
                <a href="#/suporte" data-nav-page="suporte">
                  Contato
                </a>
              </div>
            </nav>
          )}
        </div>
        <div className="jfa-footer-rule" aria-hidden="true" />
        <div className="jfa-footer-bottom">
          <span className="jfa-footer-copy">
            © <span id="footerYear" /> JFA Eletrônicos
          </span>{' '}
          <button className="jfa-footer-top-btn" id="footerToTop" type="button">
            {t('footer.toTop')}{' '}
            <span className="jfa-footer-top-arrow" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
