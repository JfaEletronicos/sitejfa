/** Página #/baterias: abertura curta e catálogo de baterias (preenchido pelo router). */
export default function BatteriesPage() {
  return (
    <div className="page-view" id="bateriasView" hidden>
      <section className="catalog-section baterias-catalog" id="catalogo-baterias">
        <h1 className="baterias-intro-title">Energia para diferentes projetos.</h1>
        <div className="catalog-filter-nav" role="group" aria-label="Filtrar baterias por aplicação">
          <div className="catalog-filter-track" id="bateriasSectorNav">
            <span className="catalog-filter-indicator" id="bateriasFilterIndicator" aria-hidden="true" />
          </div>
        </div>
        <div className="catalog-grid" id="bateriasGrid" />
        <p className="catalog-empty" id="bateriasEmpty" hidden>
          Em breve, baterias JFA para esta aplicação.{' '}
          <a href="#representantes" data-header-scroll="representantes">
            Fale com um representante
          </a>{' '}
          para encontrar a melhor solução para o seu projeto.
        </p>
      </section>
    </div>
  );
}
