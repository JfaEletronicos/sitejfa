import { PARTS_BOARDS, PARTS_PARTNERS } from '../../data/partsBoards';

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

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A luz de leitura só aparece sobre a placa (usa a própria foto como máscara). */
const scanMask = (src) => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
});

/** Linhas de circuito animadas (fundo do Hero e do CTA final). */
const CIRCUIT_PATHS = [
  'M0 80 H180 L220 120 H420 L460 80 H760',
  'M0 220 H120 L160 180 H360 L400 220 H620 L660 260 H900',
  'M60 0 V90 L100 130 V300',
  'M300 0 V60 L340 100 V200 L300 240 V400',
  'M520 400 V320 L560 280 V160 L600 120 V0',
  'M760 400 V300 L720 260 H580',
  'M900 140 H760 L720 180 H640',
  'M0 340 H240 L280 300 H480',
];

const Circuits = () => (
  <svg
    className="parts-circuits"
    viewBox="0 0 900 400"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {CIRCUIT_PATHS.map((d, i) => (
      <g key={d}>
        <path className="parts-circuit-base" d={d} />
        <path className="parts-circuit-pulse" d={d} style={{ '--i': i }} />
      </g>
    ))}
    {[
      [180, 80],
      [420, 120],
      [360, 180],
      [100, 130],
      [340, 100],
      [560, 280],
      [720, 260],
      [240, 340],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} className="parts-circuit-node" cx={x} cy={y} r="3.5" />
    ))}
  </svg>
);

/** Ilustração de placa com o código, usada enquanto o modelo não tem foto. */
export const BoardIllustration = ({ model }) => (
  <svg className="parts-board-art" viewBox="0 0 320 200" aria-hidden="true">
    <rect x="8" y="8" width="304" height="184" rx="14" className="pba-board" />
    <path
      className="pba-trace"
      d="M30 40 H120 L140 60 H200 M30 160 H90 L110 140 H180 L200 120 H290 M240 30 V70 L260 90 H290"
    />
    <rect x="130" y="80" width="64" height="40" rx="4" className="pba-chip" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={136 + i * 9} y="74" width="4" height="6" className="pba-pin" />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={`b${i}`} x={136 + i * 9} y="120" width="4" height="6" className="pba-pin" />
    ))}
    <circle cx="40" cy="100" r="9" className="pba-cap" />
    <circle cx="66" cy="100" r="6" className="pba-cap" />
    <rect x="236" y="130" width="56" height="18" rx="3" className="pba-conn" />
    <circle cx="28" cy="28" r="5" className="pba-hole" />
    <circle cx="292" cy="28" r="5" className="pba-hole" />
    <circle cx="28" cy="172" r="5" className="pba-hole" />
    <circle cx="292" cy="172" r="5" className="pba-hole" />
    <text x="162" y="166" textAnchor="middle" className="pba-label">
      {model}
    </text>
  </svg>
);

/**
 * Página #/setores/parts: landing page da JFA Parts (placas para linha branca).
 * Interações (buscador, carrossel, cards) em behaviors/partsPage.js.
 */
export default function PartsPage() {
  const partners = PARTS_PARTNERS.filter((p) => p.quote);
  return (
    <div className="page-view parts-page" id="partsView" hidden>
      {/* 1 · Hero */}
      <section className="parts-hero">
        <Circuits />
        <div className="parts-hero-glow" aria-hidden="true" />
        <div className="parts-inner parts-hero-inner">
          <div className="parts-hero-copy">
            <span className="parts-eyebrow">JFA Parts</span>
            <h1 className="parts-title">A placa certa para o seu reparo.</h1>
            <p className="parts-sub">
              Placas eletrônicas para linha branca, com fabricação própria e a experiência da JFA.
            </p>
            <div className="parts-ctas">
              <a className="parts-cta" href="#partsFinder" data-parts-scroll="partsFinder" data-page-anchor>
                Encontrar minha placa <ArrowIcon />
              </a>
              <a
                className="parts-cta is-ghost"
                href="#partsStory"
                data-parts-scroll="partsStory"
                data-page-anchor
              >
                Conhecer a JFA Parts
              </a>
            </div>
          </div>
          <div className="parts-hero-visual">
            <div className="parts-hero-board">
              <img src="/images/board_lb1009.webp" alt="Placa eletrônica JFA Parts" decoding="async" />
              <span className="parts-scan" style={scanMask('/images/board_lb1009.webp')} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Encontre sua placa */}
      <section className="parts-section parts-finder-section" id="partsFinder">
        <div className="parts-inner parts-narrow">
          <div className="parts-head">
            <span className="parts-label">Encontre sua placa</span>
            <h2 className="parts-h2">Qual placa você procura?</h2>
            <p className="parts-text">Digite o modelo do equipamento e encontre a placa correspondente.</p>
          </div>
          <form className="parts-finder" id="partsFinderForm" role="search" autoComplete="off">
            <div className="parts-finder-field">
              <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.35-4.35" />
              <input
                type="text"
                id="partsFinderInput"
                placeholder="Digite o modelo da máquina... Ex.: BWL11"
                aria-label="Modelo do equipamento"
                aria-autocomplete="list"
                aria-controls="partsFinderSuggest"
                aria-expanded="false"
                role="combobox"
              />
              <button className="parts-finder-btn" type="submit">
                Buscar
              </button>
              <div className="parts-finder-suggest" id="partsFinderSuggest" role="listbox" />
            </div>
          </form>
          <div className="parts-finder-result" id="partsFinderResult" aria-live="polite" hidden />
        </div>
      </section>

      {/* 3 · Carrossel de produtos */}
      <section className="parts-section" id="partsCatalog">
        <div className="parts-inner">
          <div className="parts-head parts-head-row">
            <div>
              <span className="parts-label">Catálogo</span>
              <h2 className="parts-h2">Conheça algumas das nossas placas</h2>
            </div>
            <div className="parts-carousel-arrows">
              <button type="button" className="parts-arrow" data-parts-carousel="-1" aria-label="Anterior">
                <Icon d="M15 5l-7 7 7 7" />
              </button>
              <button type="button" className="parts-arrow" data-parts-carousel="1" aria-label="Próxima">
                <Icon d="M9 5l7 7-7 7" />
              </button>
            </div>
          </div>
          <div className="parts-carousel" id="partsCarousel">
            {PARTS_BOARDS.map((b) => (
              <article className="parts-card" key={b.model} data-model={b.model}>
                <div className="parts-card-media">
                  {b.image ? (
                    <img src={b.image} alt={`Placa ${b.model}`} loading="lazy" decoding="async" />
                  ) : (
                    <BoardIllustration model={b.model} />
                  )}
                </div>
                <div className="parts-card-body">
                  <h3 className="parts-card-model">{b.model}</h3>
                  <p className="parts-card-title">{b.title}</p>
                  <button type="button" className="parts-card-cta" data-parts-find={b.model}>
                    Ver placa <ArrowIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Diferenciais */}
      <section className="parts-section">
        <div className="parts-inner">
          <div className="parts-head">
            <span className="parts-label">Diferenciais</span>
            <h2 className="parts-h2">Por que JFA Parts</h2>
          </div>
          <div className="parts-features">
            <article className="parts-feature">
              <span className="parts-feature-icon">
                <Icon d="M3 21V9l6 4V9l6 4V5h6v16zM7 17h2M12 17h2M17 17h2" />
              </span>
              <h3>Fabricação própria</h3>
              <p>Placas produzidas no Brasil.</p>
            </article>
            <article className="parts-feature">
              <span className="parts-feature-icon">
                <Icon d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
              </span>
              <h3>Tecnologia bivolt</h3>
              <p>Compatibilidade conforme as especificações do produto.</p>
            </article>
            <article className="parts-feature">
              <span className="parts-feature-icon">
                <Icon d="M12 3 4 7v5c0 4.6 3.2 7.9 8 9 4.8-1.1 8-4.4 8-9V7l-8-4ZM9 12l2 2 4-4" />
              </span>
              <h3>Proteção com resina</h3>
              <p>Proteção adicional nos modelos aplicáveis.</p>
            </article>
            <article className="parts-feature">
              <span className="parts-feature-icon">
                <Icon d="M4 19l1.4-4A8 8 0 1 1 9 18.6L4 19zM9 10h6M9 13h4" />
              </span>
              <h3>Suporte especializado</h3>
              <p>Auxílio na identificação e aplicação.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 5 · Nossa história */}
      <section className="parts-section parts-story" id="partsStory">
        <div className="parts-inner parts-story-inner">
          <div className="parts-story-copy">
            <span className="parts-label">Nossa história</span>
            <h2 className="parts-h2">
              Uma nova marca. <span className="parts-h2-accent">A experiência da JFA.</span>
            </h2>
            <p className="parts-text">
              A JFA Parts nasce com a experiência e a estrutura da JFA, trazendo soluções próprias para o
              mercado de placas eletrônicas de linha branca.
            </p>
          </div>
          <div className="parts-story-visual">
            <img
              src="/images/front_parts.webp"
              alt="Placa eletrônica JFA Parts"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        {partners.length > 0 && (
          <div className="parts-inner parts-partners">
            {partners.map((p) => (
              <figure className="parts-partner" key={p.name}>
                <span className="parts-partner-photo">
                  {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : p.name.charAt(0)}
                </span>
                <blockquote>“{p.quote}”</blockquote>
                <figcaption>
                  <strong>{p.name}</strong> · {p.role}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* 6 · CTA final */}
      <section className="parts-final">
        <Circuits />
        <div className="parts-hero-glow" aria-hidden="true" />
        <div className="parts-inner parts-final-inner">
          <div className="parts-final-board">
            <img src="/images/board_lb1004_cut.webp" alt="" loading="lazy" decoding="async" />
            <span
              className="parts-scan"
              style={scanMask('/images/board_lb1004_cut.webp')}
              aria-hidden="true"
            />
          </div>
          <h2 className="parts-h2">Encontre a placa ideal para o seu equipamento.</h2>
          <p className="parts-text">
            Consulte a compatibilidade ou fale diretamente com nossa equipe comercial.
          </p>
          <div className="parts-ctas">
            <a className="parts-cta" href="#partsFinder" data-parts-scroll="partsFinder" data-page-anchor>
              Encontrar minha placa <ArrowIcon />
            </a>
            <a
              className="parts-cta is-whats"
              id="partsSellerCta"
              target="_blank"
              rel="noopener noreferrer"
              data-parts-seller
            >
              Falar com um vendedor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
