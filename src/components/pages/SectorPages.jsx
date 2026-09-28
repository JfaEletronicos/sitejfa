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
