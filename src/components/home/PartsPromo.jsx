// Linhas de máquinas atendidas pela JFA Parts (blocos da seção).
const PARTS_LINES = [
  {
    key: 'geladeiras',
    tag: 'Refrigeração',
    title: 'Geladeiras',
    text: 'Placas eletrônicas de controle e interface para refrigeradores e freezers.',
    icon: (
      <>
        <rect x="18" y="6" width="44" height="68" rx="5" />
        <path d="M18 30h44M26 15v8M26 38v12" />
        <path d="M24 74v3M56 74v3" />
      </>
    ),
  },
  {
    key: 'lavadoras',
    tag: 'Lavanderia',
    title: 'Lavadoras',
    text: 'Placas de potência e interface para lavadoras, com fabricação própria no Brasil.',
    icon: (
      <>
        <rect x="12" y="8" width="56" height="64" rx="5" />
        <path d="M12 22h56M20 15h10M50 15h.01M58 15h.01" />
        <circle cx="40" cy="46" r="16" />
        <path d="M30 48c4 3 8-3 12 0s6 2 8-1" />
      </>
    ),
  },
  {
    key: 'ar-condicionado',
    tag: 'Climatização',
    title: 'Ar-condicionado',
    text: 'Placas eletrônicas de controle para aparelhos de ar-condicionado.',
    icon: (
      <>
        <rect x="6" y="18" width="68" height="26" rx="5" />
        <path d="M12 36h56M56 26h8" />
        <path d="M22 52c-3 5 3 8 0 13M40 52c-3 5 3 8 0 13M58 52c-3 5 3 8 0 13" />
      </>
    ),
  },
];

const BOARD_LONG = '/images/board_lb1004_cut.webp';
const BOARD_SQUARE = '/images/board_lb1009.webp';
// Reflexo recortado no formato da placa (a luz não passa pelo fundo transparente).
const shineMask = (src) => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
});

const Arrow = () => (
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

/** Divulgação da JFA Parts: texto institucional e as linhas de máquinas atendidas. */
export default function PartsPromo() {
  return (
    <section className="parts-promo-section" id="partsPromoSection">
      <span className="jfa-anchor" id="parts-jfa" aria-hidden="true" />
      <div className="parts-promo-bg" aria-hidden="true" />
      <div className="parts-promo-texture" aria-hidden="true" />
      <div className="parts-promo-inner" data-theme-keep>
        <div className="parts-promo-head">
          <span className="parts-promo-eyebrow">JFA Parts</span>
          <h2 className="parts-promo-title">Da experiência da JFA, nasce uma nova frente.</h2>
        </div>
        <div className="parts-promo-boards">
          <span className="parts-promo-board is-long">
            <img src={BOARD_LONG} alt="Placa eletrônica JFA Parts LB1004" loading="lazy" decoding="async" />
            <span className="parts-promo-shine" style={shineMask(BOARD_LONG)} aria-hidden="true" />
          </span>
          <span className="parts-promo-board is-square">
            <img src={BOARD_SQUARE} alt="Placa eletrônica JFA Parts LB1009" loading="lazy" decoding="async" />
            <span className="parts-promo-shine" style={shineMask(BOARD_SQUARE)} aria-hidden="true" />
          </span>
        </div>
        <div className="parts-promo-story">
          <p>
            Ao longo de sua história, a JFA construiu experiência, estrutura e conhecimento no desenvolvimento
            de soluções para o mercado.
          </p>
          <p>
            Agora, essa experiência dá origem à JFA Parts: uma nova frente dedicada ao desenvolvimento e
            fabricação de placas eletrônicas próprias para linha branca.
          </p>
          <p className="parts-promo-story-accent">
            Uma nova marca, construída sobre uma história que já existe.
          </p>
        </div>
        <div className="parts-promo-lines">
          {PARTS_LINES.map((line) => (
            <a
              key={line.key}
              className={'parts-line-card is-' + line.key}
              href="#/setores/parts"
              data-parts-line={line.key}
            >
              <span className="parts-line-texture" aria-hidden="true" />
              <svg
                className="parts-line-icon"
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {line.icon}
              </svg>
              <span className="parts-line-body">
                <span className="parts-line-tag">{line.tag}</span>
                <span className="parts-line-title">{line.title}</span>
                <span className="parts-line-text">{line.text}</span>
                <span className="parts-line-more">
                  Ver placas <Arrow />
                </span>
              </span>
            </a>
          ))}
        </div>
        <div className="parts-promo-cta-wrap">
          <a className="parts-promo-cta-big" href="#/setores/parts">
            Conheça a JFA Parts <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
