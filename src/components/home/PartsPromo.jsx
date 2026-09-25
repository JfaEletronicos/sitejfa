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
            A JFA Parts leva a experiência da JFA para um novo mercado: placas eletrônicas para
            eletrodomésticos da linha branca, desenvolvidas no Brasil para técnicos e assistências técnicas.
          </p>
        </div>
        <div className="parts-promo-body">
          <div className="parts-promo-media" aria-hidden="true">
            <div className="parts-promo-media-slide is-active">
              <img src="/images/board_lb1004.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="parts-promo-media-slide">
              <img src="/images/board_lb1004.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="parts-promo-media-slide">
              <img src="/images/board_lb1004.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="parts-promo-grid">
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Fabricação própria</span>
              <p className="parts-promo-card-body">
                Placas produzidas no Brasil, com foco em qualidade, compatibilidade e confiabilidade.
              </p>
            </div>
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Mais facilidade para encontrar a peça certa</span>
              <p className="parts-promo-card-body">
                Com apoio de IA, ficou mais simples identificar a placa compatível com cada eletrodoméstico.
              </p>
            </div>
            <div className="parts-promo-card">
              <span className="parts-promo-card-title">Suporte de verdade</span>
              <p className="parts-promo-card-body">
                Do diagnóstico ao pós-venda, técnicos e assistências contam com suporte especializado.
              </p>
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
