import { t, pick } from '../../i18n';
import { EXPORT_GROUPS, EXPORT_PRODUCTS } from '../../data/exportProducts';
import { INTERNATIONAL_SALES } from '../../data/representatives';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const onlyDigits = (s) => String(s).replace(/\D/g, '');

/**
 * Home da visualização de exportação (EN/ES): catálogo de exportação,
 * manuais para baixar e contatos de vendas internacionais. Os textos vêm de
 * i18n/strings.js e os produtos de data/exportProducts.js.
 */
export default function ExportHome() {
  return (
    <div className="export-home" id="exportHome">
      {/* Catálogo de exportação */}
      <section className="export-section" id="exportCatalogSection">
        <span className="jfa-anchor" id="produtos" aria-hidden="true" />
        <div className="export-head">
          <span className="export-eyebrow">{t('export.catalogEyebrow')}</span>
          <h2 className="export-title">{t('export.catalogTitle')}</h2>
          <p className="export-sub">{t('export.catalogSub')}</p>
        </div>
        {EXPORT_GROUPS.map((g) => {
          const items = EXPORT_PRODUCTS.filter((p) => p.group === g.key);
          if (!items.length) return null;
          return (
            <div className="export-group" key={g.key}>
              <h3 className="export-group-title">{pick(g.label)}</h3>
              <div className="catalog-grid export-grid">
                {items.map((p) => (
                  <a className="catalog-card" key={p.id} href={'#/setores/automotivo/' + p.id}>
                    <span className="catalog-card-media">
                      <img src={p.images[0]} alt={pick(p.name)} loading="lazy" decoding="async" />
                    </span>
                    <h4 className="catalog-card-name">{pick(p.name)}</h4>
                    <p className="catalog-card-meta">{pick(p.category)}</p>
                    <p className="catalog-card-desc">{pick(p.summary)}</p>
                    <span className="catalog-card-cta">
                      {t('catalog.more')} <ArrowIcon />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Manuais */}
      <section className="export-section export-manuals" id="exportManualsSection">
        <span className="jfa-anchor" id="manuais" aria-hidden="true" />
        <div className="export-head">
          <span className="export-eyebrow">{t('export.manualsEyebrow')}</span>
          <h2 className="export-title">{t('export.manualsTitle')}</h2>
          <p className="export-sub">{t('export.manualsSub')}</p>
        </div>
        <ul className="export-manuals-list">
          {EXPORT_PRODUCTS.map((p) => (
            <li key={p.id}>
              <a
                className="export-manual"
                href={p.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-export-manual={p.id}
              >
                <span className="export-manual-thumb" aria-hidden="true" data-theme-keep>
                  <img src={p.images[0]} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="export-manual-body">
                  <span className="export-manual-name">{pick(p.name)}</span>
                  <span className="export-manual-meta">{pick(p.category)} · PDF</span>
                </span>
                <span className="export-manual-cta">
                  <DownloadIcon /> {t('export.download')}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Vendas internacionais */}
      <section className="export-section export-contact" id="exportContactSection">
        <span className="jfa-anchor" id="contato" aria-hidden="true" />
        <div className="export-head">
          <span className="export-eyebrow">{t('export.contactEyebrow')}</span>
          <h2 className="export-title">{t('export.contactTitle')}</h2>
          <p className="export-sub">{t('export.contactSub')}</p>
        </div>
        <div className="export-contacts">
          {INTERNATIONAL_SALES.contacts.map((c) => (
            <div className="export-contact-card" key={c.name}>
              <span className="export-contact-name">{c.name}</span>
              <span className="export-contact-phone">{c.phone}</span>
              <div className="export-contact-actions">
                <a
                  className="export-contact-btn is-whats"
                  data-theme-keep
                  href={
                    'https://api.whatsapp.com/send?phone=' +
                    onlyDigits(c.phone) +
                    '&text=' +
                    encodeURIComponent(t('export.whatsappText'))
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  data-export-contact="whatsapp"
                >
                  {t('export.whatsapp')}
                </a>
                {c.email && (
                  <a className="export-contact-btn" href={'mailto:' + c.email} data-export-contact="email">
                    {c.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
