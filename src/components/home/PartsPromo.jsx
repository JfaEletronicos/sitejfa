/** Divulgação da JFA Parts com carrossel de fotos. */
export default function PartsPromo() {
  return (
    <section className="parts-promo-section" id="partsPromoSection">
      <span className="jfa-anchor" id="parts-jfa" aria-hidden="true" />
      <div className="parts-promo-bg" aria-hidden="true" />
      <div className="parts-promo-texture" aria-hidden="true" />
      <div className="parts-promo-inner" data-theme-keep>
        <div className="parts-promo-head">
          <span className="parts-promo-eyebrow">JFA Parts</span>
          <h2 className="parts-promo-title">Placas feitas aqui. Para quem faz tudo voltar a funcionar.</h2>
          <p className="parts-promo-sub">
            Placas eletrônicas para a linha branca, desenvolvidas no Brasil para técnicos e assistências.
          </p>
        </div>
        <div className="parts-promo-body">
          <div className="parts-promo-media" aria-hidden="true">
            <div className="parts-promo-media-slide is-active">
              <img src="/images/board_lb1004.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="parts-promo-media-slide">
              <img src="/images/board_lb1009.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="parts-promo-grid">
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Fabricação própria</span>
            </div>
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Mais facilidade para encontrar a peça certa</span>
            </div>
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Suporte de verdade</span>
            </div>
          </div>
        </div>
        <div className="parts-promo-cta-wrap">
          <a className="parts-promo-cta-big" href="#manuais" data-goto-manuals-tab="parts">
            Conheça nossas placas{' '}
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
      </div>
    </section>
  );
}
