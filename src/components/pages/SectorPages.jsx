/**
 * Páginas de setor, preenchidas por behaviors/sectorPages.js:
 * - #/setores/automotivo e #/setores/telecom: catálogo no layout da página de baterias;
 * - #/setores/moov e #/setores/parts: página institucional.
 */
export function SectorCatalogPage() {
  return (
    <div className="page-view" id="setorCatalogView" hidden>
      <section className="catalog-section baterias-catalog">
        <h1 className="baterias-intro-title" id="setorCatalogTitle" />
        <div className="catalog-filter-nav" role="group" aria-label="Filtrar produtos por linha">
          <div className="catalog-filter-track" id="setorCatalogNav">
            <span className="catalog-filter-indicator" id="setorCatalogIndicator" aria-hidden="true" />
          </div>
        </div>
        <div className="catalog-grid" id="setorCatalogGrid" />
      </section>
    </div>
  );
}

export function SectorInstitutionalPage() {
  return (
    <div className="page-view" id="setorInstView" hidden>
      <section className="setor-inst">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="setor-inst-hero">
          <div className="setor-inst-copy">
            <span className="page-eyebrow" id="setorInstEyebrow" />
            <h1 className="setor-inst-title" id="setorInstTitle" />
            <p className="setor-inst-sub" id="setorInstSub" />
            <div className="setor-inst-ctas">
              <a className="setor-inst-cta" id="setorInstManuals" href="#/manuais">
                <span id="setorInstManualsLabel" />
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
              <a
                className="setor-inst-cta is-secondary"
                id="setorInstWhatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com a JFA
              </a>
            </div>
          </div>
          <div className="setor-inst-visual">
            <img id="setorInstImage" alt="" decoding="async" />
          </div>
        </div>
        <div className="setor-inst-story" id="setorInstStory" />
      </section>
    </div>
  );
}

/** Página #/setores/:setor/:produto: detalhe de um produto do setor (layout da página de bateria). */
export function SectorProductPage() {
  return (
    <div className="page-view" id="produtoView" hidden>
      <nav className="bateria-breadcrumb" aria-label="Você está aqui">
        <a id="produtoBreadcrumbSector" href="#/setores/automotivo">
          Automotivo
        </a>{' '}
        <span className="bateria-breadcrumb-sep" aria-hidden="true">
          /
        </span>{' '}
        <span className="bateria-breadcrumb-current" id="produtoBreadcrumbCurrent" />
      </nav>
      <section className="bateria-hero">
        <div className="bateria-hero-inner">
          <div className="bateria-gallery">
            {/* Palco claro nos dois temas (as fotos têm fundos claros variados). */}
            <div className="bateria-gallery-stage" data-theme-keep>
              <div className="bateria-gallery-grid" aria-hidden="true" />
              <div className="bateria-gallery-mesh" aria-hidden="true" />
              <div className="bateria-floor-shadow" aria-hidden="true" />
              <div className="bateria-hero-media produto-hero-media" id="produtoHeroMedia" />
            </div>
            <div
              className="bateria-gallery-thumbs"
              id="produtoThumbs"
              role="tablist"
              aria-label="Fotos do produto"
              hidden
            />
          </div>
          <div className="bateria-hero-content">
            <div className="bateria-hero-content-in">
              <span className="bateria-label" id="produtoEyebrow" />
              <h1 className="bateria-title" id="produtoTitle" />
              <p className="bateria-desc" id="produtoSummary" />
              <div className="bateria-cta-row">
                <a className="hero-cta bateria-cta-buy" href="#/representantes">
                  Encontrar representante
                </a>
                <a
                  className="bateria-cta-link"
                  id="produtoManualCta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baixar manual
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bateria-section produto-about-section">
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Sobre o produto</span>
          </div>
          <div className="produto-about" id="produtoAbout" />
        </div>
      </section>
      <section className="bateria-section bateria-docs-section">
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Documentos</span>
          </div>
          <div className="bateria-docs-hub" id="produtoDocs" />
        </div>
      </section>
      <section className="bateria-section bateria-others-section">
        <div className="bateria-section-inner">
          <div className="bateria-others-head">
            <span className="bateria-label" id="produtoOthersLabel">
              Outros produtos
            </span>
            <a href="#/setores/automotivo" className="bateria-others-all" id="produtoOthersAll">
              Ver todos{' '}
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
          </div>
          <div className="catalog-grid" id="produtoOthersGrid" />
        </div>
      </section>
    </div>
  );
}
