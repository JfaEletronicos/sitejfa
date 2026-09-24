/** Página #/baterias/:slug: detalhe de uma bateria (preenchido pelo router). */
export default function BatteryDetailPage() {
  return (
    <div className="page-view" id="bateriaView" hidden>
      <nav className="bateria-breadcrumb" aria-label="Você está aqui">
        <a href="#/baterias">Baterias</a>{' '}
        <span className="bateria-breadcrumb-sep" aria-hidden="true">
          /
        </span>{' '}
        <span className="bateria-breadcrumb-current" id="bateriaBreadcrumbCurrent" />
      </nav>
      <section className="bateria-hero">
        <div className="bateria-hero-inner">
          <div className="bateria-hero-media" id="bateriaHeroMedia" />
          <div className="bateria-hero-content">
            <span className="bateria-label" id="bateriaEyebrow">
              Baterias JFA
            </span>
            <h1 className="bateria-title" id="bateriaTitle" />
            <div
              id="bateriaAppNav"
              className="bateria-app-nav"
              role="group"
              aria-label="Aplicações desta bateria"
            />
            <p className="bateria-context-text" id="bateriaContextText" />
            <p className="bateria-desc" id="bateriaSub" />
            <div className="bateria-hero-specs" id="bateriaHeroSpecs" />
            <div className="bateria-hero-actions" id="bateriaHeroActions" />
          </div>
        </div>
      </section>
      <h3 className="bateria-context-title" id="bateriaContextTitle" hidden />
      <section className="bateria-section bateria-summary">
        <div className="bateria-section-inner bateria-summary-inner">
          <div className="bateria-summary-row" id="bateriaBenefitsSection" hidden>
            <span className="bateria-summary-label">Benefícios</span>
            <div className="bateria-chip-row" id="bateriaFeatures" />
          </div>
          <div className="bateria-summary-row">
            <span className="bateria-summary-label">Especificações</span>
            <dl className="bateria-specs-list" id="bateriaSpecsList" />
          </div>
          <div className="bateria-summary-row" id="bateriaManualsSection" hidden>
            <span className="bateria-summary-label">Manuais</span>
            <div className="bateria-doc-links" id="bateriaDocLinks" />
          </div>
          <p className="bateria-summary-support">
            {' '}
            Precisa de ajuda para escolher sua bateria?{' '}
            <a id="bateriaSupportCta" target="_blank" rel="noopener noreferrer">
              Falar com a JFA{' '}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </p>
        </div>
      </section>
      <section className="bateria-section bateria-options-section" id="bateriaRelatedSection" hidden>
        <div className="bateria-section-inner">
          <div className="bateria-section-head">
            <h2 className="bateria-section-title">Produtos relacionados</h2>
          </div>
          <div className="catalog-grid" id="bateriaRelatedGrid" />
        </div>
      </section>
      <section className="bateria-section bateria-others-section bateria-options-section">
        <div className="bateria-section-inner">
          <div className="bateria-section-head">
            <h2 className="bateria-section-title">Outras baterias JFA</h2>
          </div>
          <div className="catalog-grid" id="bateriaOthersGrid" />
          <p className="bateria-others-cta">
            <a href="#/baterias" className="hero-cta hero-cta-tertiary">
              Ver todas as baterias{' '}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
