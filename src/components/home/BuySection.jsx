/** Onde comprar: Loja Oficial, Mercado Livre e representantes. */
export default function BuySection() {
  return (
    <section className="buy-section" id="buySection">
      <span className="jfa-anchor" id="loja" aria-hidden="true" />
      <div className="buy-section-bg" aria-hidden="true" />
      <div className="buy-section-texture" aria-hidden="true" />
      <div className="buy-head">
        <span className="buy-eyebrow">DÚVIDAS SOBRE ONDE COMPRAR?</span>
        <h2 className="buy-title">Saiba onde achar cada produto!</h2>
        <p className="buy-sub">
          Nem todo produto JFA é vendido no mesmo lugar. Escolha o canal certo e encontre o que procura mais
          rápido.
        </p>
      </div>
      <div className="buy-grid" id="buyGrid">
        <a
          className="buy-card"
          data-buy-path="loja-oficial"
          href="https://loja.jfaeletronicos.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="buy-card-glow" aria-hidden="true" />{' '}
          <span className="buy-card-media" aria-hidden="true">
            <img src="/images/card_elitio50.webp" alt="" loading="lazy" decoding="async" draggable="false" />
          </span>{' '}
          <span className="buy-card-eyebrow">Loja Oficial JFA</span>{' '}
          <span className="buy-card-title">Procurando baterias de lítio? Compre aqui.</span>
          <p className="buy-card-body">
            Baterias de lítio e soluções JFA Parts disponíveis direto na nossa Loja Oficial.
          </p>
          <span className="buy-card-arrow">
            Comprar na Loja Oficial{' '}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>{' '}
        <a
          className="buy-card"
          data-buy-path="mercado-livre"
          href="https://www.mercadolivre.com.br/loja/jfa-eletronicos?item_id=MLB3492722035&category_id=MLB5672&official_store_id=223044&client=recoview-selleritems&recos_listing=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="buy-card-glow" aria-hidden="true" />{' '}
          <span className="buy-card-media" aria-hidden="true">
            <img src="/images/card_nautica.webp" alt="" loading="lazy" decoding="async" draggable="false" />
          </span>{' '}
          <span className="buy-card-eyebrow">Mercado Livre</span>{' '}
          <span className="buy-card-title">Confira nosso catálogo completo.</span>
          <p className="buy-card-body">
            Fontes, controles, amplificadores e as outras linhas do nosso catálogo estão disponíveis
            exclusivamente pela loja oficial JFA no Mercado Livre.
          </p>
          <span className="buy-card-arrow">
            Ver produtos{' '}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
      <a className="buy-rep-strip" href="#representantes" data-buy-path="representante">
        <svg className="buy-rep-strip-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s7-6.1 7-11.5A7 7 0 105 9.5C5 14.9 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>{' '}
        <span className="buy-rep-strip-copy">
          <span className="buy-rep-strip-title">Quer atendimento mais próximo?</span>{' '}
          <span className="buy-rep-strip-body">Nossa rede de representantes pode ajudar.</span>
        </span>{' '}
        <span className="buy-rep-strip-cta">
          Encontrar representante{' '}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h13M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </section>
  );
}
