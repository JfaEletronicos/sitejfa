/** Página #/baterias: abertura curta e catálogo de baterias (preenchido pelo router). */
export default function BatteriesPage() {
  return (
    <div className="page-view" id="bateriasView" hidden>
      <section className="catalog-section baterias-catalog" id="catalogo-baterias">
        <h1 className="baterias-intro-title">Baterias JFA. Energia para diferentes projetos.</h1>
        <div className="catalog-filter-nav" role="group" aria-label="Filtrar baterias por aplicação">
          <div className="catalog-filter-track" id="bateriasSectorNav">
            <span className="catalog-filter-indicator" id="bateriasFilterIndicator" aria-hidden="true" />
          </div>
        </div>
        <div className="catalog-grid" id="bateriasGrid" />
      </section>
    </div>
  );
}
