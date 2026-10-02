import { SHOW_MOOV, SHOW_PARTS } from '../../data/visibility';
import { t, pick, IS_EXPORT } from '../../i18n';
import { EXPORT_CATALOG_GROUPS } from '../../data/exportProducts';

const Chevron = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Exportação (EN/ES): as áreas são as linhas de exportação, cada uma com um
// produto de exportação; o botão filtra "Descubra as soluções" pela linha.
const EXPORT_FRONTS = {
  power: {
    image: '/images/produtos/fonte-xline-export-1.webp',
    headline: { en: 'Energy for your sound system', es: 'Energía para su sistema de sonido' },
    desc: {
      en: 'Power supplies and chargers that power, charge and monitor automotive batteries.',
      es: 'Fuentes y cargadores que alimentan, cargan y monitorean baterías automotrices.',
    },
  },
  controls: {
    image: '/images/produtos/controle-k1200-universal-1.webp',
    headline: { en: 'Control from far away', es: 'Control a larga distancia' },
    desc: {
      en: 'Long-range remote controls for car sound events, with up to 1,200 meters of reach.',
      es: 'Controles remotos de largo alcance para eventos de sonido, con hasta 1.200 metros.',
    },
  },
  accessories: {
    image: '/images/produtos/voltimetro-sequenciador-vs5hi-1.webp',
    headline: { en: 'Every detail of the project', es: 'Cada detalle del proyecto' },
    desc: {
      en: 'Converters, filters and voltmeters that complete a clean and safe installation.',
      es: 'Convertidores, filtros y voltímetros que completan una instalación limpia y segura.',
    },
  },
};

// A fonte dos títulos (Stretch Pro) não tem Á/Ú: essas letras usam a fonte de apoio.
const fixAccents = (str) =>
  String(str)
    .split(/([ÁáÚú])/)
    .map((part, i) =>
      /^[ÁáÚú]$/.test(part) ? (
        <span key={i} className="accent-fix">
          {part}
        </span>
      ) : (
        part
      ),
    );

function ExportFronts() {
  const groups = EXPORT_CATALOG_GROUPS.filter((g) => EXPORT_FRONTS[g.key]);
  const n = groups.length;
  return (
    <section className="fronts" id="frontsSection" data-theme-keep>
      <span className="jfa-anchor" id="frentes" aria-hidden="true" />{' '}
      <canvas
        className="section-energy-canvas section-fronts-mesh"
        id="frontsEnergyCanvas"
        aria-hidden="true"
      />
      <div className="fronts-top">
        <span className="fronts-eyebrow">{'\u00a0' + t('fronts.eyebrow').replace(/\{n\}/g, n)}</span>
        <h2 className="fronts-title">
          {fixAccents(t('fronts.title'))} <em>JFA</em>.
        </h2>
        <p className="fronts-sub">{t('fronts.sub')}</p>
      </div>
      <div className="fronts-stage" id="frontsStage">
        <button
          className="fronts-arrow fronts-arrow-prev"
          id="frontsPrev"
          type="button"
          aria-label={t('fronts.prev')}
        >
          <Chevron d="M15 6l-6 6 6 6" />
        </button>
        <div className="fronts-track" id="frontsTrack">
          {groups.map((g, i) => {
            const f = EXPORT_FRONTS[g.key];
            return (
              <article
                key={g.key}
                className={'front-panel' + (i === n - 1 ? ' is-active' : '')}
                data-front={i}
              >
                <div className="front-info">
                  <span className="front-index">{pad2(i + 1) + ' / ' + pad2(n)}</span>
                  <h3 className="front-kicker">JFA {pick(g.label)}</h3>
                  <p className="front-headline">{pick(f.headline)}</p>
                </div>
                <div className="front-visual">
                  <img
                    className="front-visual-img"
                    src={f.image}
                    alt={pick(g.label)}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="front-desc">{pick(f.desc)}</p>
                <a className="front-cta" href="#solucoes" data-goto-products-category={g.key}>
                  {t('fronts.cta')} <Chevron d="M5 12h13M13 6l6 6-6 6" />
                </a>
              </article>
            );
          })}
        </div>
        <button
          className="fronts-arrow fronts-arrow-next"
          id="frontsNext"
          type="button"
          aria-label={t('fronts.next')}
        >
          <Chevron d="M9 6l6 6-6 6" />
        </button>
      </div>
      <nav className="fronts-nav" id="frontsNav" aria-label={t('fronts.nav')}>
        <div className="fronts-nav-line">
          <div className="fronts-nav-fill" id="frontsNavFill" />
        </div>
        <div className="fronts-nav-items">
          {groups.map((g, i) => (
            <button key={g.key} className="fronts-nav-item" data-goto={i} type="button">
              <span className="fronts-nav-num">{pad2(i + 1)}</span>
              <span className="fronts-nav-name">{pick(g.label)}</span>
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}

// OCULTO: Moov/Parts — com as flags de data/visibility.js em false, as frentes
// Parts e Moov saem do carrossel e a contagem ("4 frentes", "01 / 04") se ajusta.
const FRONTS_COUNT = 2 + (SHOW_PARTS ? 1 : 0) + (SHOW_MOOV ? 1 : 0);
const pad2 = (n) => String(n).padStart(2, '0');
const frontIndex = (n) => pad2(n) + ' / ' + pad2(FRONTS_COUNT);

/** Frentes JFA (Moov, Energia, Parts, Automotivo). */
export default function Fronts() {
  if (IS_EXPORT) return <ExportFronts />;
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
                src="/images/produtos/fonte-storm-lithium-1.webp"
                alt="Fonte e carregador JFA Storm Lithium 12V 70A"
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
