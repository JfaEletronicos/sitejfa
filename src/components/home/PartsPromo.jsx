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
          <h2 className="parts-promo-title">Uma nova frente. A mesma forma JFA de fazer tecnologia.</h2>
          <div className="parts-promo-story">
            <p>
              A história da JFA sempre foi movida por um princípio simples: entender uma necessidade e
              desenvolver a própria solução para ela. Foi assim que conhecimento, tecnologia e experiência
              foram se acumulando ao longo dos anos e abrindo espaço para novos caminhos.
            </p>
            <p className="parts-promo-story-accent">
              Agora, parte dessa experiência chega a um novo mercado.
            </p>
            <p>
              A JFA Parts nasce para levar o jeito JFA de desenvolver tecnologia às placas eletrônicas para
              linha branca, unindo fabricação própria, conhecimento técnico e uma estrutura construída para
              estar próxima de quem trabalha todos os dias fazendo equipamentos voltarem a funcionar.
            </p>
            <p className="parts-promo-story-accent">
              Uma nova história começa aqui. Com toda a experiência da JFA por trás.
            </p>
          </div>
        </div>
        <div className="parts-promo-body">
          <div className="parts-promo-media" aria-hidden="true">
            {/* Borrão de movimento horizontal usado na passagem das fotos (ver behaviors/partsPromo.js). */}
            <svg className="parts-promo-filters" width="0" height="0" aria-hidden="true" focusable="false">
              <filter id="partsMotionBlur" x="-30%" y="0" width="160%" height="100%">
                <feGaussianBlur id="partsMotionBlurAmount" stdDeviation="0 0" />
              </filter>
            </svg>
            <div className="parts-promo-media-slide is-active">
              <img src="/images/board_lb1004_cut.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="parts-promo-media-slide">
              <img src="/images/board_lb1009.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
        <div className="parts-promo-cta-wrap">
          <a className="parts-promo-cta-big" href="#manuais" data-goto-manuals-tab="parts">
            Conheça a JFA Parts{' '}
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
