/** Página #/setores/:slug: detalhe de um setor. */
export default function SectorDetailPage() {
  return (
    <div className="page-view" id="setorView" hidden>
      <section className="page-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="page-hero-inner">
          <span className="page-eyebrow" id="setorEyebrow">
            Setores
          </span>
          <h1 className="page-hero-title" id="setorTitle" />
          <p className="page-hero-sub" id="setorSub" />
        </div>
      </section>
      <section className="setor-intro">
        <p className="setor-intro-text" id="setorIntro" />
      </section>
      <section className="setor-solutions">
        <div className="setor-solutions-empty">
          <p>Em breve, as soluções deste setor estarão disponíveis aqui.</p>
        </div>
      </section>
      <section className="setor-cta-section">
        <a className="setor-cta" id="setorContactCta" target="_blank" rel="noopener noreferrer">
          Falar com a JFA
        </a>
      </section>
    </div>
  );
}
