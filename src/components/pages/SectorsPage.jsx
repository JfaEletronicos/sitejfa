/** Página #/setores: lista de setores atendidos. */
export default function SectorsPage() {
  return (
    <div className="page-view" id="setoresView" hidden>
      <section className="page-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="page-hero-inner">
          <span className="page-eyebrow">Setores</span>
          <h1 className="page-hero-title">Soluções para diferentes caminhos.</h1>
          <p className="page-hero-sub">
            Explore as áreas de atuação da JFA e encontre soluções para cada aplicação.
          </p>
        </div>
      </section>
      <section className="catalog-section">
        <div className="catalog-grid" id="setoresGrid" />
      </section>
    </div>
  );
}
