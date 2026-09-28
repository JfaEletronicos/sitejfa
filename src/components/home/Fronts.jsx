import { SHOW_MOOV, SHOW_PARTS } from '../../data/visibility';

// OCULTO: Moov/Parts — com as flags de data/visibility.js em false, as frentes
// Parts e Moov saem do carrossel e a contagem ("4 frentes", "01 / 04") se ajusta.
const FRONTS_COUNT = 2 + (SHOW_PARTS ? 1 : 0) + (SHOW_MOOV ? 1 : 0);
const pad2 = (n) => String(n).padStart(2, '0');
const frontIndex = (n) => pad2(n) + ' / ' + pad2(FRONTS_COUNT);

/** Frentes JFA (Moov, Energia, Parts, Automotivo). */
export default function Fronts() {
  return (
    <section className="fronts" id="frontsSection" data-theme-keep>
      <span className="jfa-anchor" id="frentes" aria-hidden="true" />{' '}
      <canvas
        className="section-energy-canvas section-fronts-mesh"
        id="frontsEnergyCanvas"
        aria-hidden="true"
      />
      <div className="fronts-top">
        <span className="fronts-eyebrow">
          {'\u00a0' + FRONTS_COUNT + ' frentes. ' + FRONTS_COUNT + ' caminhos. Uma só JFA.'}
        </span>
        <h2 className="fronts-title">
          Conheça as <span className="accent-fix">á</span>reas da <em>JFA</em>.
        </h2>
        <p className="fronts-sub">
          Cada frente segue seu próprio caminho, levando a tecnologia e o jeito JFA de fazer para diferentes
          mercados.
        </p>
      </div>
      <div className="fronts-stage" id="frontsStage">
        <button
          className="fronts-arrow fronts-arrow-prev"
          id="frontsPrev"
          type="button"
          aria-label="Frente anterior"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="fronts-track" id="frontsTrack">
          <article className="front-panel" data-front="0">
            <div className="front-info">
              <span className="front-index">{frontIndex(1)}</span>
              <h3 className="front-kicker">JFA Automotivo</h3>
              <p className="front-headline">Qualidade para seu projeto</p>
            </div>
            <div className="front-visual">
              <img
                className="front-visual-img"
                src="/images/front_automotivo.webp"
                alt="Amplificador JFA AP800X4"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="front-desc">
              Desenvolvemos soluções voltadas ao universo automotivo, com produtos pensados para desempenho,
              controle e confiabilidade em diferentes tipos de projeto.
            </p>
            <a className="front-cta" href="#solucoes" data-goto-products-category="automotivo">
              Conheça a linha{' '}
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </article>
          <article className={'front-panel' + (SHOW_MOOV ? '' : ' is-active')} data-front="1">
            <div className="front-info">
              <span className="front-index">{frontIndex(2)}</span>
              <h3 className="front-kicker">JFA Energia</h3>
              <p className="front-headline">Energia onde você precisa</p>
            </div>
            <div className="front-visual">
              <img
                className="front-visual-img"
                src="/images/front_energia.webp"
                alt="Bateria JFA e-Lítio Náutica"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="front-desc">
              Criamos soluções para sistemas que exigem fornecimento, gerenciamento e continuidade, com foco
              em eficiência e estabilidade.
            </p>
            <a className="front-cta" href="#solucoes" data-goto-products-category="energia">
              Conheça a linha{' '}
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </article>
          {SHOW_PARTS && (
            <article className="front-panel" data-front="2">
              <div className="front-info">
                <span className="front-index">{frontIndex(3)}</span>
                <h3 className="front-kicker">JFA Parts</h3>
                <p className="front-headline">Tecnologia para continuar funcionando</p>
              </div>
              <div className="front-visual">
                <img
                  className="front-visual-img"
                  src="/images/board_lb1009.webp"
                  alt="Placa eletrônica JFA Parts"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="front-desc">
                Reunimos placas e soluções eletrônicas para reposição e manutenção, com foco especial em
                componentes para linha branca e aplicações eletrônicas.
              </p>
              <a className="front-cta" href="#manuais" data-goto-manuals-tab="parts">
                Conheça a linha{' '}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </article>
          )}
          {SHOW_MOOV && (
            <article className="front-panel is-active" data-front="3">
              <div className="front-info">
                <span className="front-index">{frontIndex(SHOW_PARTS ? 4 : 3)}</span>
                <h3 className="front-kicker">JFA Moov</h3>
                <p className="front-headline">Mobilidade elétrica.</p>
              </div>
              <div className="front-visual">
                <img
                  className="front-visual-img"
                  src="/images/front_moov.webp"
                  alt="Bicicleta elétrica JFA Moov"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="front-desc">
                Expandimos nossa atuação para soluções voltadas ao transporte elétrico, com foco principal em
                bicicletas elétricas e mobilidade com autonomia.
              </p>
              <a className="front-cta" href="#manuais" data-goto-manuals-tab="moov">
                Conheça a linha{' '}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </article>
          )}
        </div>
        <button
          className="fronts-arrow fronts-arrow-next"
          id="frontsNext"
          type="button"
          aria-label="Próxima frente"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <nav className="fronts-nav" id="frontsNav" aria-label="Navegação entre frentes JFA">
        <div className="fronts-nav-line">
          <div className="fronts-nav-fill" id="frontsNavFill" />
        </div>
        <div className="fronts-nav-items">
          <button className="fronts-nav-item" data-goto="0" type="button">
            <span className="fronts-nav-num">01</span>
            <span className="fronts-nav-name">Automotivo</span>
          </button>{' '}
          <button className="fronts-nav-item" data-goto="1" type="button">
            <span className="fronts-nav-num">02</span>
            <span className="fronts-nav-name">Energia</span>
          </button>{' '}
          {SHOW_PARTS && (
            <button className="fronts-nav-item" data-goto="2" type="button">
              <span className="fronts-nav-num">03</span>
              <span className="fronts-nav-name">Parts</span>
            </button>
          )}{' '}
          {SHOW_MOOV && (
            <button className="fronts-nav-item" data-goto={SHOW_PARTS ? 3 : 2} type="button">
              <span className="fronts-nav-num">{pad2(SHOW_PARTS ? 4 : 3)}</span>
              <span className="fronts-nav-name">Moov</span>
            </button>
          )}
        </div>
      </nav>
    </section>
  );
}
