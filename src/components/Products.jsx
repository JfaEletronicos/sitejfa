/** Soluções JFA: certificações, filtro por linha e carrossel de produtos. */
export default function Products() {
  return (
    <section className="products" id="productsSection">
      <span className="jfa-anchor" id="solucoes" aria-hidden="true" />{' '}
      <canvas className="section-energy-canvas" id="productsEnergyCanvas" aria-hidden="true" />
      <div className="products-section-bg" aria-hidden="true" />
      <div className="products-section-texture" aria-hidden="true" />
      <div className="products-bg">
        <div className="products-atmosphere" aria-hidden="true" />
        <div className="diag-shape diag-1" />
      </div>
      <div className="products-head" id="productsHead">
        <div className="products-head-row">
          <div className="products-head-copy">
            <h2 className="products-title">
              <span className="pt-line1">
                Descubra as soluções <em>JFA</em>
              </span>
            </h2>
            <p className="products-sub">
              Cada produto nasce da vontade de fazer melhor, resolver problemas reais e acompanhar de perto as
              necessidades de diferentes projetos.
            </p>
          </div>
          <div className="products-head-certs">
            <span className="jfa-anchor" id="certificacoes" aria-hidden="true" />
            <div className="products-certs-row">
              <span className="products-cert-item">
                <img
                  className="products-cert-seal"
                  src="/images/seal_inmetro.webp"
                  alt="Selo Inmetro"
                  loading="lazy"
                  decoding="async"
                />{' '}
                <span className="products-cert-label">Inmetro</span>
              </span>{' '}
              <span className="products-cert-item">
                <img
                  className="products-cert-seal"
                  src="/images/seal_anatel.webp"
                  alt="Selo Anatel"
                  loading="lazy"
                  decoding="async"
                />{' '}
                <span className="products-cert-label">Anatel</span>
              </span>
            </div>
            <p className="products-certs-note">
              Registro de conformidade confirmado para 2 modelos específicos (Bateria 48V 50A Rack e 12,8V
              100A) -- não se estende ao restante do catálogo.
            </p>
          </div>
        </div>
        <div
          className="products-category-nav"
          id="productsCategoryNav"
          role="group"
          aria-label="Filtrar produtos por linha"
        >
          <button
            className="products-category-pill is-active"
            type="button"
            data-category="all"
            aria-pressed="true"
          >
            Todos
          </button>{' '}
          <button
            className="products-category-pill"
            type="button"
            data-category="automotivo"
            aria-pressed="false"
          >
            Automotivo
          </button>{' '}
          <button
            className="products-category-pill"
            type="button"
            data-category="energia"
            aria-pressed="false"
          >
            Energia
          </button>
        </div>
      </div>
      <div className="carousel-runway" id="carouselRunway">
        <div className="carousel-viewport" id="carouselViewport">
          <div className="carousel-track" id="carouselTrack">
            <div className="p-card card-storm" data-line="automotivo">
              <img
                src="/images/card_storm.webp"
                alt="JFA Storm Lithium 12V 70A"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">Storm Lithium 12V.70A</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#">
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-nautica" data-line="energia">
              <img
                src="/images/card_nautica.webp"
                alt="Bateria JFA e-Lítio Náutica 12,8V 100A"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio Náutica</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#">
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-elitio50" data-line="automotivo energia">
              <img
                src="/images/card_elitio50.webp"
                alt="Bateria JFA e-Lítio PRO 12,8V 50A 640W"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio PRO 50A</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#">
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-panel" data-line="automotivo energia">
              <img
                src="/images/card_panel.webp"
                alt="Painel de controle JFA e-Lítio PRO LiFePO4"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio</h3>
                <p className="p-card-sub">Mais capacidade para ir além e menos preocupação durante o uso.</p>
                <a className="p-card-cta" href="#">
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-redline" data-line="automotivo">
              <img
                src="/images/card_redline.webp"
                alt="Controle JFA Redline"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">Redline</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#">
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-storm" data-line="automotivo" aria-hidden="true">
              <img src="/images/card_storm.webp" alt="" loading="lazy" decoding="async" draggable="false" />
              <div className="p-card-info">
                <h3 className="p-card-name">Storm Lithium 12V.70A</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#" tabIndex={-1}>
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-nautica" data-line="energia" aria-hidden="true">
              <img src="/images/card_nautica.webp" alt="" loading="lazy" decoding="async" draggable="false" />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio Náutica</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#" tabIndex={-1}>
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-elitio50" data-line="automotivo energia" aria-hidden="true">
              <img
                src="/images/card_elitio50.webp"
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio PRO 50A</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#" tabIndex={-1}>
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-panel" data-line="automotivo energia" aria-hidden="true">
              <img src="/images/card_panel.webp" alt="" loading="lazy" decoding="async" draggable="false" />
              <div className="p-card-info">
                <h3 className="p-card-name">e-Lítio</h3>
                <p className="p-card-sub">Mais capacidade para ir além e menos preocupação durante o uso.</p>
                <a className="p-card-cta" href="#" tabIndex={-1}>
                  Conhecer produto
                </a>
              </div>
            </div>
            <div className="p-card card-redline" data-line="automotivo" aria-hidden="true">
              <img src="/images/card_redline.webp" alt="" loading="lazy" decoding="async" draggable="false" />
              <div className="p-card-info">
                <h3 className="p-card-name">Redline</h3>
                <p className="p-card-sub" />
                <a className="p-card-cta" href="#" tabIndex={-1}>
                  Conhecer produto
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="products-endcap">
        <span className="products-endcap-text">Encontrou o que procura?</span>{' '}
        <a className="products-endcap-link" href="#loja">
          Veja onde comprar{' '}
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
    </section>
  );
}
