const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Página #/baterias/:slug: detalhe de uma bateria (preenchido pelo router). */
export default function BatteryDetailPage() {
  return (
    <div className="page-view" id="bateriaView" hidden>
      <nav className="bateria-breadcrumb" aria-label="Você está aqui">
        <a href="#/baterias">Baterias</a>{' '}
        <span className="bateria-breadcrumb-sep" aria-hidden="true">
          /
        </span>{' '}
        <span className="bateria-breadcrumb-current" id="bateriaBreadcrumbCurrent" />
      </nav>

      {/* 01 · Hero: galeria + nome, headline, descrição, specs e compra */}
      <section className="bateria-hero">
        <div className="bateria-hero-inner">
          <div className="bateria-gallery" id="bateriaGallery">
            <div className="bateria-gallery-stage">
              <div className="bateria-gallery-grid" aria-hidden="true" />
              <div className="bateria-gallery-mesh" aria-hidden="true" />
              <div className="bateria-floor-shadow" aria-hidden="true" />
              <div className="bateria-hero-media" id="bateriaHeroMedia" />
            </div>
            <div
              className="bateria-gallery-thumbs"
              id="bateriaGalleryThumbs"
              role="tablist"
              aria-label="Fotos do produto"
              hidden
            />
          </div>
          <div className="bateria-hero-content">
            <div className="bateria-hero-content-in">
              <span className="bateria-label" id="bateriaEyebrow">
                Baterias JFA
              </span>
              <span className="bateria-app-badge" id="bateriaAppBadge" />
              <h1 className="bateria-title" id="bateriaTitle" />
              <p className="bateria-headline" id="bateriaHeadline" />
              <div
                className="bateria-variants"
                id="bateriaVariants"
                role="radiogroup"
                aria-label="Capacidade"
                hidden
              />
              <div
                className="bateria-variants"
                id="bateriaApps"
                role="radiogroup"
                aria-label="Aplicação"
                hidden
              />
              <p className="bateria-app-context" id="bateriaAppContext" hidden />
              <p className="bateria-desc" id="bateriaSub" />
              <div className="bateria-seals" id="bateriaSeals" hidden />
              <div className="bateria-commerce" id="bateriaCommerceHero" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Faixa de especificações rápidas */}
      <section className="bateria-quickspecs" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-quickspecs-row" id="bateriaQuickSpecs" />
        </div>
      </section>

      {/* 03 · Tecnologia/benefícios */}
      <section className="bateria-section bateria-tech-section" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Tecnologia</span>
            <h2 className="bateria-block-title">Mais do que armazenar energia.</h2>
            <p className="bateria-block-sub">
              Recursos desenvolvidos para oferecer controle, estabilidade e confiança durante a operação.
            </p>
          </div>
          <div className="bateria-tech-grid" id="bateriaTechGrid" />
        </div>
      </section>

      {/* 04 · Aplicações (só com 2 ou mais setores) */}
      <section className="bateria-section bateria-app-section" id="bateriaAppSection" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Aplicações</span>
            <h2 className="bateria-block-title">Uma bateria. Diferentes possibilidades.</h2>
            <p className="bateria-block-sub">
              Veja como esta solução pode se adaptar a diferentes contextos de uso.
            </p>
          </div>
          <div
            className="bateria-app-tabs"
            id="bateriaAppTabs"
            role="tablist"
            aria-label="Aplicações desta bateria"
          >
            <span className="bateria-app-tabs-underline" id="bateriaAppTabsUnderline" aria-hidden="true" />
          </div>
          <div className="bateria-app-body">
            <div className="bateria-app-copy">
              <h3 className="bateria-app-headline" id="bateriaAppHeadline" />
              <p className="bateria-app-text" id="bateriaAppText" />
            </div>
            <div className="bateria-app-media">
              <img
                className="bateria-app-image"
                id="bateriaAppImage"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Especificações técnicas */}
      <section className="bateria-section bateria-specs-section" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Especificações</span>
            <h2 className="bateria-block-title">
              Os n<span className="accent-fix">ú</span>meros por tr<span className="accent-fix">á</span>s da
              energia.
            </h2>
            <p className="bateria-block-sub">Confira os principais dados técnicos deste modelo.</p>
          </div>
          <div className="bateria-spec-groups" id="bateriaSpecGroups" />
        </div>
      </section>

      {/* 06 · Contexto de sistema */}
      <section className="bateria-section bateria-system-section" data-reveal>
        <div className="bateria-section-inner bateria-system-inner">
          <div className="bateria-system-copy">
            <span className="bateria-label">Seu sistema</span>
            <h2 className="bateria-block-title">
              Pensada para trabalhar como parte de uma solu<span className="accent-fix">çã</span>o completa.
            </h2>
            <p className="bateria-block-sub-lg">
              Bateria, carregamento e gerenciamento precisam trabalhar juntos. A escolha correta dos
              componentes ajuda a construir um sistema mais organizado, seguro e adequado à necessidade do
              projeto.
            </p>
          </div>
          <div className="bateria-system-visual" aria-hidden="true">
            <div className="bateria-system-node is-active">
              <span className="bateria-system-node-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="19" y="10.5" width="2.4" height="5" rx="1" fill="currentColor" />
                  <path
                    d="M8 12h2l1.2-2 1.6 4 1.2-2h2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="bateria-system-node-label">Bateria</span>
            </div>
            <span className="bateria-system-link" aria-hidden="true" />
            <div className="bateria-system-node">
              <span className="bateria-system-node-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="bateria-system-node-label">Carregamento</span>
            </div>
            <span className="bateria-system-link" aria-hidden="true" />
            <div className="bateria-system-node">
              <span className="bateria-system-node-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 19V5m0 14h16M8 15l3-4 3 3 4-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="bateria-system-node-label">Gerenciamento</span>
            </div>
          </div>
        </div>
      </section>

      {/* 07 · Produtos relacionados (só com relatedProducts configurado) */}
      <section
        className="bateria-section bateria-related-section"
        id="bateriaRelatedSection"
        data-reveal
        hidden
      >
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Complete seu sistema</span>
            <h2 className="bateria-block-title">Tecnologias que trabalham juntas.</h2>
            <p className="bateria-block-sub">Conheça soluções JFA relacionadas a esta bateria.</p>
          </div>
          <div className="bateria-editorial-grid" id="bateriaRelatedGrid" />
        </div>
      </section>

      {/* 08 · Manuais, documentos e suporte */}
      <section className="bateria-section bateria-docs-section" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Suporte técnico</span>
            <h2 className="bateria-block-title">
              Informa<span className="accent-fix">çã</span>o para instalar e utilizar com confian
              <span className="accent-fix">ç</span>a.
            </h2>
            <p className="bateria-block-sub">
              Encontre os documentos técnicos disponíveis para este produto.
            </p>
          </div>
          <div className="bateria-docs-hub" id="bateriaDocsHub" />
          <p className="bateria-support-line">
            Precisa de ajuda para escolher sua bateria?{' '}
            <a id="bateriaSupportCta" target="_blank" rel="noopener noreferrer">
              Falar com a JFA <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* 09 · Bloco final de compra removido: o CTA de compra fica na Hero. */}

      {/* 10 · Outras baterias */}
      <section className="bateria-section bateria-others-section" data-reveal>
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Outras opções</span>
            <h2 className="bateria-block-title">Encontre a bateria certa para o seu projeto.</h2>
            <p className="bateria-block-sub">Compare outras configurações disponíveis no portfólio JFA.</p>
          </div>
          <div className="catalog-grid" id="bateriaOthersGrid" />
          <p className="bateria-others-cta">
            <a href="#/baterias" className="hero-cta hero-cta-tertiary">
              Ver todas as baterias <ArrowIcon />
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
