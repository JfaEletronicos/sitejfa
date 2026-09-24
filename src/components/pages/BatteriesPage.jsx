/** Página #/baterias: banners e catálogo de baterias (preenchido pelo router). */
export default function BatteriesPage() {
  return (
    <div className="page-view" id="bateriasView" hidden>
      <section className="campaign-section baterias-banner-section" aria-label="Campanhas JFA">
        <div className="campaign-section-bg" aria-hidden="true" />
        <div className="campaign-viewport" id="bateriasBannerViewport">
          <button
            className="campaign-arrow campaign-arrow-prev"
            id="bateriasBannerPrev"
            type="button"
            aria-label="Banner anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 4l-8 8 8 8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="campaign-track" id="bateriasBannerTrack" />
          <button
            className="campaign-arrow campaign-arrow-next"
            id="bateriasBannerNext"
            type="button"
            aria-label="Próximo banner"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 4l8 8-8 8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
      <section className="catalog-section" id="catalogo-baterias">
        <div
          className="products-category-nav"
          id="bateriasSectorNav"
          role="group"
          aria-label="Filtrar baterias por aplicação"
        />
        <div className="catalog-grid" id="bateriasGrid" />
      </section>
    </div>
  );
}
