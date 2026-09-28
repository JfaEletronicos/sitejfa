import {
  SHOPEE_URL,
  SHOPEE_LOGO,
  SHOPEE_LOGO_LIGHT,
  MERCADO_LIVRE_URL,
  MERCADO_LIVRE_LOGO,
  MERCADO_LIVRE_LOGO_LIGHT,
} from '../../data/links';

/** Onde comprar: um card para a Shopee, outro para o Mercado Livre (identificados pelo logo) e representantes. */
export default function BuySection() {
  return (
    <section className="buy-section" id="buySection">
      <span className="jfa-anchor" id="loja" aria-hidden="true" />
      <div className="buy-section-bg" aria-hidden="true" />
      <div className="buy-section-texture" aria-hidden="true" />
      <div className="buy-head">
        <span className="buy-eyebrow">DÚVIDAS SOBRE ONDE COMPRAR?</span>
        <h2 className="buy-title">Compre direto nos marketplaces oficiais da JFA!</h2>
        <p className="buy-sub">
          Encontre as baterias de lítio JFA na Shopee e todo o nosso catálogo no Mercado Livre.
        </p>
      </div>
      <div className="buy-grid" id="buyGrid">
        <a
          className="buy-card"
          data-buy-path="shopee"
          href={SHOPEE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="buy-card-glow" aria-hidden="true" />{' '}
          <span className="buy-card-media" aria-hidden="true">
            <img src="/images/card_elitio50.webp" alt="" loading="lazy" decoding="async" draggable="false" />
          </span>{' '}
          <span className="buy-card-eyebrow buy-card-brand">
            <img
              className="brand-logo is-on-dark"
              src={SHOPEE_LOGO}
              alt="Shopee"
              width="96"
              height="32"
              loading="lazy"
              decoding="async"
            />
            <img
              className="brand-logo is-on-light"
              src={SHOPEE_LOGO_LIGHT}
              alt=""
              width="96"
              height="32"
              loading="lazy"
              decoding="async"
            />
          </span>{' '}
          <span className="buy-card-title">Baterias de lítio JFA.</span>
          <p className="buy-card-body">
            Encontre modelos da linha e-Lítio e aproveite a praticidade da Shopee para comprar sua bateria
            JFA.
          </p>
          <span className="buy-card-arrow">
            Ver baterias na Shopee{' '}
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
          href={MERCADO_LIVRE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="buy-card-glow" aria-hidden="true" />{' '}
          <span className="buy-card-media" aria-hidden="true">
            <img
              src="/images/produtos/fonte-storm-1.webp"
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </span>{' '}
          <span className="buy-card-eyebrow buy-card-brand">
            <img
              className="brand-logo is-on-dark"
              src={MERCADO_LIVRE_LOGO}
              alt="Mercado Livre"
              width="126"
              height="32"
              loading="lazy"
              decoding="async"
            />
            <img
              className="brand-logo is-on-light"
              src={MERCADO_LIVRE_LOGO_LIGHT}
              alt=""
              width="126"
              height="32"
              loading="lazy"
              decoding="async"
            />
          </span>{' '}
          <span className="buy-card-title">Encontre seu produto JFA.</span>
          <p className="buy-card-body">
            Acesse fontes, controles, amplificadores, baterias e outras linhas JFA reunidas em nosso catálogo
            no Mercado Livre.
          </p>
          <span className="buy-card-arrow">
            Ver catálogo no Mercado Livre{' '}
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
