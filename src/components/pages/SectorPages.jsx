/**
 * Páginas de setor, preenchidas por behaviors/sectorPages.js:
 * - #/setores/automotivo e #/setores/telecom: catálogo no layout da página de baterias;
 * (Moov e Parts têm landing pages próprias: MoovPage.jsx e PartsPage.jsx.)
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

/**
 * Página #/setores/:setor/:produto: detalhe de um produto do setor, com a mesma
 * estrutura da página de bateria (Hero, especificações rápidas, tecnologia, por que
 * escolher, ficha técnica, suporte técnico e outros produtos). Preenchida por
 * behaviors/sectorPages.js; seções sem conteúdo ficam escondidas.
 */
export function SectorProductPage() {
  return (
    <div className="page-view" id="produtoView" hidden>
      <nav className="bateria-breadcrumb" aria-label="Você está aqui">
        <a id="produtoBreadcrumbSector" href="#/setores/automotivo">
          Automotivo
        </a>{' '}
        <span className="bateria-breadcrumb-sep" aria-hidden="true">
          /
        </span>{' '}
        <span className="bateria-breadcrumb-current" id="produtoBreadcrumbCurrent" />
      </nav>

      {/* 01 · Hero: galeria + nome, headline, descrição e onde comprar */}
      <section className="bateria-hero">
        <div className="bateria-hero-inner">
          <div className="bateria-gallery">
            <div className="bateria-gallery-stage">
              <div className="bateria-gallery-grid" aria-hidden="true" />
              <div className="bateria-gallery-mesh" aria-hidden="true" />
              <div className="bateria-floor-shadow" aria-hidden="true" />
              <div className="bateria-hero-media produto-hero-media" id="produtoHeroMedia" />
            </div>
            <div
              className="bateria-gallery-thumbs"
              id="produtoThumbs"
              role="tablist"
              aria-label="Fotos do produto"
              hidden
            />
          </div>
          <div className="bateria-hero-content">
            <div className="bateria-hero-content-in">
              <span className="bateria-label" id="produtoEyebrow" />
              <span className="bateria-app-badge" id="produtoBadge" />
              <h1 className="bateria-title" id="produtoTitle" />
              <p className="bateria-headline" id="produtoHeadline" />
              <p className="bateria-desc" id="produtoDesc" />
              <div className="bateria-commerce">
                <p className="bateria-commerce-fallback-text">Consulte disponibilidade.</p>
                <div className="bateria-cta-row">
                  <a className="hero-cta" href="#/representantes">
                    Encontrar onde comprar
                  </a>
                </div>
                <p className="bateria-commerce-microcopy">Compra pelos canais oficiais JFA.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Faixa de especificações rápidas */}
      <section className="bateria-quickspecs is-visible" id="produtoQuickSpecsSection">
        <div className="bateria-section-inner">
          <div className="bateria-quickspecs-row" id="produtoQuickSpecs" />
        </div>
      </section>

      {/* 03 · Tecnologia: os diferenciais do produto */}
      <section className="bateria-section bateria-tech-section is-visible" id="produtoTechSection">
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Tecnologia</span>
            <h2 className="bateria-block-title">Recursos que fazem a diferença.</h2>
            <p className="bateria-block-sub">Os principais diferenciais deste produto JFA.</p>
          </div>
          <div className="bateria-tech-grid" id="produtoTechGrid" />
        </div>
      </section>

      {/* 04 · Por que escolher: descrição completa e aplicações */}
      <section className="bateria-section bateria-why-section" id="produtoWhySection">
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Por que escolher</span>
            <h2 className="bateria-block-title">A escolha certa para o seu projeto.</h2>
          </div>
          <div className="bateria-why" id="produtoWhy">
            <div className="bateria-why-copy">
              <h3 className="bateria-why-title" id="produtoWhyTitle" />
              <div className="produto-why-text" id="produtoWhyText" />
            </div>
            <div className="bateria-why-reasons" id="produtoWhyReasons" />
          </div>
        </div>
      </section>

      {/* 05 · Ficha técnica (quando o site traz tabela) */}
      <section className="bateria-section produto-specs-section" id="produtoSpecsSection">
        <div className="bateria-section-inner">
          <div className="bateria-block-head">
            <span className="bateria-label">Características técnicas</span>
            <h2 className="bateria-block-title">Ficha técnica.</h2>
          </div>
          <div id="produtoSpecsTable" />
        </div>
      </section>

      {/* 06 · Manuais, documentos e suporte */}
      <section className="bateria-section bateria-docs-section">
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
          <div className="bateria-docs-hub" id="produtoDocs" />
          <div className="product-photos" id="produtoPhotos" hidden>
            <div className="product-photos-head">
              <div>
                <p className="bateria-doc-row-title">Fotos do produto</p>
                <p className="bateria-doc-row-text">
                  Imagens em alta qualidade, sem fundo, para baixar e divulgar.
                </p>
              </div>
              <button className="product-photos-all" type="button">
                Baixar todas
              </button>
            </div>
            <div className="product-photos-grid" />
          </div>
          <p className="bateria-support-line">
            Precisa de ajuda para escolher seu produto?{' '}
            <a id="produtoSupportCta" target="_blank" rel="noopener noreferrer">
              Falar com a JFA <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* 07 · Outros produtos */}
      <section className="bateria-section bateria-others-section">
        <div className="bateria-section-inner">
          <div className="bateria-others-head">
            <span className="bateria-label" id="produtoOthersLabel">
              Outros produtos
            </span>
            <a href="#/setores/automotivo" className="bateria-others-all" id="produtoOthersAll">
              Ver todos <ArrowIcon />
            </a>
          </div>
          <div className="catalog-grid" id="produtoOthersGrid" />
        </div>
      </section>
    </div>
  );
}
