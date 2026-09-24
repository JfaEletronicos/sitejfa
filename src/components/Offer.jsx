/** Oferta em destaque com contagem regressiva. */
export default function Offer() {
  return (
    <section className="offer-section" id="offerSection">
      <span className="jfa-anchor" id="oferta" aria-hidden="true" />
      <div className="offer-section-bg" aria-hidden="true" />
      <div className="offer-section-texture" aria-hidden="true" />
      <canvas className="section-energy-canvas" id="offerEnergyCanvas" aria-hidden="true" />
      <div className="offer-inner">
        <div className="offer-visual">
          <div className="offer-visual-glow" aria-hidden="true" />
          <div className="offer-visual-parallax" id="offerParallax">
            <div className="offer-visual-float">
              <img
                className="offer-visual-img"
                src="/images/product_elitio_pro_100a.webp"
                alt="Bateria JFA e-Lítio Pro 48V/100Ah Rack"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          </div>
          <div className="offer-stat-badge" aria-hidden="true">
            <span className="offer-stat-badge-num">6.000</span>{' '}
            <span className="offer-stat-badge-label">Ciclos</span>
          </div>
        </div>
        <div className="offer-content">
          <span className="offer-eyebrow">Destaque JFA</span>
          <h2 className="offer-headline">Energia para ir muito além.</h2>
          <p className="offer-model">E-LÍTIO PRO 48V/100Ah Rack</p>
          <p className="offer-body">
            Bateria LiFePO4 desenvolvida para aplicações que exigem autonomia, durabilidade e confiança, com
            vida útil de até 6.000 ciclos.
          </p>
          <div className="offer-card">
            <span className="offer-card-tag">Oferta especial</span>
            <div className="offer-pricing">
              <span className="offer-price-old">R$ 5.899,90</span>{' '}
              <span className="offer-price-sale">R$ 5.469,90</span>{' '}
              <span className="offer-price-cash">R$ 5.251,10 à vista com desconto</span>
            </div>
            <div className="offer-card-divider" aria-hidden="true" />
            <div className="offer-countdown" id="offerCountdown">
              <span className="offer-countdown-label">Oferta termina em:</span>
              <div className="offer-countdown-clock" role="timer" aria-label="Tempo restante da oferta">
                <div className="offer-countdown-unit">
                  <span className="offer-countdown-num" id="offerHH">
                    00
                  </span>
                  <span className="offer-countdown-sub">h</span>
                </div>
                <span className="offer-countdown-sep" aria-hidden="true">
                  :
                </span>
                <div className="offer-countdown-unit">
                  <span className="offer-countdown-num" id="offerMM">
                    00
                  </span>
                  <span className="offer-countdown-sub">min</span>
                </div>
                <span className="offer-countdown-sep" aria-hidden="true">
                  :
                </span>
                <div className="offer-countdown-unit">
                  <span className="offer-countdown-num" id="offerSS">
                    00
                  </span>
                  <span className="offer-countdown-sub">s</span>
                </div>
              </div>
            </div>
            <div className="offer-action">
              <a
                className="offer-cta"
                id="offerCta"
                href="https://loja.jfaeletronicos.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                Comprar agora{' '}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>{' '}
              <span className="offer-cta-micro">Compra pela Loja Oficial JFA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
