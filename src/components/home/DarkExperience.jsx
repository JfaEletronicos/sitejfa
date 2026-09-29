import StateMapSection from '../shared/StateMapSection';
import { SHOW_MOOV, SHOW_PARTS } from '../../data/visibility';
import { t, pick, IS_EXPORT } from '../../i18n';
import { EXPORT_GROUPS } from '../../data/exportProducts';

/** Ambiente escuro compartilhado por Manuais e Representantes (as seções também abrem nas páginas #/manuais e #/representantes). */
export default function DarkExperience() {
  return (
    <div className="dark-experience" id="darkExperience">
      <div className="dark-experience-bg" aria-hidden="true" />
      <div className="dark-experience-texture" id="darkExperienceTexture" aria-hidden="true" />
      {/* Representantes: só no site em português. */}
      {!IS_EXPORT && (
        <StateMapSection
          prefix="reps"
          anchorId="representantes"
          title="Encontre um representante JFA."
          sub="Nossa rede conecta você a quem conhece nossos produtos, nosso mercado e a sua região."
        >
          <div className="reps-intl-wrap">
            <button
              className="reps-intl"
              id="repsIntlToggle"
              type="button"
              aria-expanded="false"
              aria-controls="repsIntlPanel"
            >
              <svg className="reps-intl-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="3.6" ry="8.4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.6 12h16.8" stroke="currentColor" strokeWidth="1.5" />
              </svg>{' '}
              <span>Vendas internacionais</span>{' '}
              <svg className="reps-intl-chevron" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="reps-intl-panel" id="repsIntlPanel" />
          </div>
        </StateMapSection>
      )}
      <section className="manuals" id="manualsSection">
        <span className="jfa-anchor" id="manuais" aria-hidden="true" />{' '}
        <canvas className="section-energy-canvas" id="manualsEnergyCanvas" aria-hidden="true" />
        <div className="manuals-inner">
          <div className="manuals-head" id="manualsHead">
            <span className="manuals-eyebrow">{t('manuals.eyebrow')}</span>
            <h2 className="manuals-title">{t('manuals.title')}</h2>
            <p className="manuals-sub">{t('manuals.sub')}</p>
          </div>
          <div className="manuals-search-wrap">
            <div className="manuals-search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>{' '}
              <label htmlFor="manualsSearchInput" className="manuals-sr-only">
                {t('manuals.searchLabel')}
              </label>{' '}
              <input
                type="text"
                id="manualsSearchInput"
                placeholder={t('manuals.placeholder')}
                autoComplete="off"
                aria-autocomplete="list"
                role="combobox"
                aria-expanded="false"
                aria-controls="manualsResults"
              />
            </div>
            <span className="manuals-search-hint">{t('manuals.hint')}</span>
          </div>
          <div className="manuals-tabs" id="manualsTabs" role="tablist" aria-label={t('manuals.tabsAria')}>
            {IS_EXPORT
              ? EXPORT_GROUPS.map((g) => (
                  <button
                    key={g.key}
                    className="manuals-tab"
                    type="button"
                    role="tab"
                    data-line={g.key}
                    aria-selected="false"
                  >
                    {pick(g.label)}
                  </button>
                ))
              : null}
            {!IS_EXPORT && (
              <>
                <button
                  className="manuals-tab"
                  type="button"
                  role="tab"
                  data-line="automotivo"
                  aria-selected="false"
                >
                  Automotivo
                </button>{' '}
                <button
                  className="manuals-tab"
                  type="button"
                  role="tab"
                  data-line="energia"
                  aria-selected="false"
                >
                  Energia
                </button>{' '}
                {/* OCULTO: Moov/Parts (data/visibility.js) */}
                {SHOW_PARTS && (
                  <button
                    className="manuals-tab"
                    type="button"
                    role="tab"
                    data-line="parts"
                    aria-selected="false"
                  >
                    Parts
                  </button>
                )}{' '}
                {SHOW_MOOV && (
                  <button
                    className="manuals-tab"
                    type="button"
                    role="tab"
                    data-line="moov"
                    aria-selected="false"
                  >
                    Moov
                  </button>
                )}
              </>
            )}
          </div>
          <div
            className="manuals-category-tabs"
            id="manualsCategoryTabs"
            role="tablist"
            aria-label={t('manuals.categoryAria')}
            hidden
          />
          <div className="manuals-tab-panel" id="manualsTabPanel" role="tabpanel" hidden />
          <p className="manuals-tab-prompt" id="manualsTabPrompt">
            {t('manuals.prompt')}
          </p>
          <div className="manuals-results-wrap" id="manualsResultsWrap" hidden>
            <span className="manuals-results-label" id="manualsResultsLabel">
              {t('manuals.results')}
            </span>
            <div
              className="manuals-results"
              id="manualsResults"
              role="listbox"
              aria-label={t('manuals.resultsAria')}
            />
            <p className="manuals-empty" id="manualsEmpty">
              {t('manuals.empty1')}
              <br />
              {t('manuals.empty2')}
            </p>
            <button className="manuals-showmore" id="manualsShowMore" type="button">
              {t('manuals.showMore')}
            </button>
          </div>
          <span className="manuals-sr-only" id="manualsAnnounce" aria-live="polite" role="status" />
        </div>
      </section>
    </div>
  );
}
