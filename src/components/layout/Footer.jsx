import { SHOW_MOOV, SHOW_PARTS } from '../../data/visibility';
import { SECTOR_MENU } from '../../data/sectors';
import { INSTAGRAM_URL, YOUTUBE_URL } from '../../data/links';
import { t, IS_EXPORT } from '../../i18n';
import { exportWhatsappUrl } from '../../data/exportContact';

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
              <img
                className="jfa-logo-img"
                src="/images/jfa_logo_white.webp"
                alt="JFA"
                width="720"
                height="242"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="jfa-footer-tagline">{t('footer.tagline')}</p>
            {/* Redes sociais: ícone na cor original de cada rede + nome. */}
            <div className="jfa-footer-social-wrap">
              <span className="jfa-footer-social-title">{t('footer.follow')}</span>
              <div className="jfa-footer-social" aria-label={t('footer.social')}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-social="instagram">
                  <svg className="jfa-social-icon is-instagram" viewBox="0 0 24 24" aria-hidden="true">
                    <defs>
                      <radialGradient id="igGradient" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#igGradient)" />
                    <rect
                      x="5.5"
                      y="5.5"
                      width="13"
                      height="13"
                      rx="4"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="16.3" cy="7.7" r="1" fill="#fff" />
                  </svg>
                  <span>{t('footer.instagramLabel')}</span>
                </a>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" data-social="youtube">
                  <svg className="jfa-social-icon is-youtube" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8Z"
                      fill="#FF0000"
                    />
                    <path d="M9.7 15.3 15.6 12 9.7 8.7v6.6Z" fill="#fff" />
                  </svg>
                  <span>{t('footer.youtubeLabel')}</span>
                </a>
              </div>
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
                <a href={exportWhatsappUrl()} target="_blank" rel="noopener noreferrer">
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
