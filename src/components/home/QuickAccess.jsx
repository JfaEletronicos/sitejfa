import { t, IS_EXPORT } from '../../i18n';
import { exportWhatsappUrl } from '../../data/exportContact';

const PT_WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=553125336100&text=Ol%C3%A1%2C+quero+saber+mais+sobre+os+produtos+Automotivo%21';

/** Atalhos "O que você procura?". */
export default function QuickAccess() {
  return (
    <section className="quick-access" id="quickAccessSection">
      <div className="quick-access-inner">
        <h2 className="quick-access-title">{t('qa.title')}</h2>
        <div className="quick-access-grid">
          <a className="quick-access-item" href="#solucoes" data-header-scroll="solucoes">
            <span className="quick-access-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3v18M4 7.5l8 4.5 8-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{' '}
            <span className="quick-access-text">
              <span className="quick-access-item-title">{t('qa.products')}</span>{' '}
              <span className="quick-access-item-sub">{t('qa.productsSub')}</span>
            </span>
          </a>{' '}
          <a className="quick-access-item" href="#manuais" data-header-scroll="manuais">
            <span className="quick-access-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path
                  d="M9.5 12.5h6M9.5 16h6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            <span className="quick-access-text">
              <span className="quick-access-item-title">{t('qa.manuals')}</span>{' '}
              <span className="quick-access-item-sub">{t('qa.manualsSub')}</span>
            </span>
          </a>{' '}
          {/* Representantes: só no site em português (a exportação não tem o mapa). */}
          {!IS_EXPORT && (
            <a className="quick-access-item" href="#representantes" data-header-scroll="representantes">
              <span className="quick-access-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>{' '}
              <span className="quick-access-text">
                <span className="quick-access-item-title">Representantes</span>{' '}
                <span className="quick-access-item-sub">Encontre atendimento na sua região</span>
              </span>
            </a>
          )}{' '}
          <a
            className="quick-access-item quick-access-whatsapp"
            id="quickAccessWhatsapp"
            href={IS_EXPORT ? exportWhatsappUrl() : PT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="quick-access-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{' '}
            <span className="quick-access-text">
              <span className="quick-access-item-title">{t('qa.talk')}</span>{' '}
              <span className="quick-access-item-sub">{t('qa.talkSub')}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
