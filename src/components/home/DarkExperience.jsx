/** Ambiente escuro compartilhado por Manuais e Representantes. */
export default function DarkExperience() {
  return (
    <div className="dark-experience" id="darkExperience">
      <div className="dark-experience-bg" aria-hidden="true" />
      <div className="dark-experience-texture" id="darkExperienceTexture" aria-hidden="true" />
      <section className="manuals" id="manualsSection">
        <span className="jfa-anchor" id="manuais" aria-hidden="true" />{' '}
        <canvas className="section-energy-canvas" id="manualsEnergyCanvas" aria-hidden="true" />
        <div className="manuals-inner">
          <div className="manuals-head" id="manualsHead">
            <span className="manuals-eyebrow">Manuais</span>
            <h2 className="manuals-title">Encontre o manual que precisa.</h2>
            <p className="manuals-sub">
              Escolha uma área e vá direto ao produto, ou pesquise pelo nome, modelo ou linha a qualquer
              momento.
            </p>
          </div>
          <div className="manuals-search-wrap">
            <div className="manuals-search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>{' '}
              <label htmlFor="manualsSearchInput" className="manuals-sr-only">
                Buscar manual por produto, modelo ou linha
              </label>{' '}
              <input
                type="text"
                id="manualsSearchInput"
                placeholder="Qual produto você procura?"
                autoComplete="off"
                aria-autocomplete="list"
                role="combobox"
                aria-expanded="false"
                aria-controls="manualsResults"
              />
            </div>
            <span className="manuals-search-hint">
              Pesquise por nome, modelo ou linha: a busca funciona independente da linha selecionada abaixo.
            </span>
          </div>
          <div
            className="manuals-tabs"
            id="manualsTabs"
            role="tablist"
            aria-label="Navegar manuais por linha"
          >
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
            <button className="manuals-tab" type="button" role="tab" data-line="parts" aria-selected="false">
              Parts
            </button>{' '}
            <button className="manuals-tab" type="button" role="tab" data-line="moov" aria-selected="false">
              Moov
            </button>
          </div>
          <div
            className="manuals-category-tabs"
            id="manualsCategoryTabs"
            role="tablist"
            aria-label="Filtrar por categoria"
            hidden
          />
          <div className="manuals-tab-panel" id="manualsTabPanel" role="tabpanel" hidden />
          <p className="manuals-tab-prompt" id="manualsTabPrompt">
            Escolha uma área acima para ver os manuais disponíveis.
          </p>
          <div className="manuals-results-wrap" id="manualsResultsWrap" hidden>
            <span className="manuals-results-label" id="manualsResultsLabel">
              Resultados
            </span>
            <div
              className="manuals-results"
              id="manualsResults"
              role="listbox"
              aria-label="Resultados de manuais"
            />
            <p className="manuals-empty" id="manualsEmpty">
              Nenhum manual encontrado.
              <br />
              Tente pesquisar por outro nome ou modelo.
            </p>
            <button className="manuals-showmore" id="manualsShowMore" type="button">
              Mostrar todos os resultados →
            </button>
          </div>
          <span className="manuals-sr-only" id="manualsAnnounce" aria-live="polite" role="status" />
        </div>
      </section>
      <section className="reps" id="repsSection">
        <span className="jfa-anchor" id="representantes" aria-hidden="true" />{' '}
        <canvas className="section-energy-canvas" id="repsEnergyCanvas" aria-hidden="true" />
        <div className="jfa-corner jfa-corner-tr jfa-corner-reps" aria-hidden="true" />
        <svg
          className="jfa-sparkle jfa-sparkle-reps"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" />
        </svg>
        <div className="reps-inner">
          <div className="reps-layout">
            <div className="reps-stage" id="repsStage">
              <div className="reps-map-wrap" id="repsMapWrap">
                <svg
                  className="reps-map"
                  id="repsMapSvg"
                  viewBox="22.00 1.00 357.00 371.00"
                  role="img"
                  aria-label="Mapa do Brasil: selecione um estado"
                >
                  <path
                    className="reps-map-backdrop"
                    d="M106.00,14.00 L108.00,38.00 L98.00,40.00 L94.00,33.00 L60.00,37.00 L58.00,64.00 L63.00,69.00 L60.00,86.00 L42.00,90.00 L34.00,96.00 L26.00,114.00 L26.00,131.00 L42.00,150.00 L53.00,150.00 L55.00,158.00 L86.00,158.00 L98.00,153.00 L99.00,162.00 L108.00,171.00 L141.00,184.00 L143.00,204.00 L157.00,205.00 L159.00,214.00 L164.00,216.00 L163.00,256.00 L183.00,262.00 L184.00,272.00 L192.00,275.00 L192.00,288.00 L196.00,290.00 L168.00,317.00 L167.00,334.00 L174.00,334.00 L199.00,354.00 L200.00,368.00 L216.00,368.00 L226.00,346.00 L237.00,343.00 L245.00,325.00 L255.00,314.00 L256.00,286.00 L289.00,266.00 L312.00,265.00 L313.00,251.00 L322.00,250.00 L332.00,224.00 L337.00,219.00 L341.00,176.00 L347.00,175.00 L352.00,168.00 L351.00,150.00 L360.00,141.00 L370.00,140.00 L371.00,127.00 L375.00,126.00 L373.00,100.00 L370.00,96.00 L355.00,94.00 L334.00,76.00 L296.00,72.00 L281.00,61.00 L253.00,52.00 L246.00,46.00 L246.00,36.00 L239.00,32.00 L235.00,13.00 L220.00,13.00 L209.00,30.00 L181.00,28.00 L179.00,33.00 L160.00,35.00 L162.00,15.00 L157.00,5.00 L142.00,5.00 L128.00,14.00 Z"
                  />
                </svg>
                <div className="reps-tooltip" id="repsTooltip" />
              </div>
            </div>
            <div className="reps-text-col">
              <div className="reps-top">
                <h2 className="reps-title">Encontre um representante JFA.</h2>
                <p className="reps-sub">
                  Nossa rede conecta você a quem conhece nossos produtos, nosso mercado e a sua região.
                </p>
              </div>
              <div className="reps-search-wrap">
                <div className="reps-search">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>{' '}
                  <input
                    type="text"
                    id="repsSearchInput"
                    placeholder="Digite seu estado"
                    autoComplete="off"
                    aria-label="Buscar estado"
                    aria-expanded="false"
                    aria-autocomplete="list"
                    role="combobox"
                  />
                  <div className="reps-suggest" id="repsSuggest" role="listbox" />
                </div>
                <span className="reps-search-hint">Ou escolha no mapa.</span>
              </div>
            </div>
            <div className="reps-col2-lower">
              <aside className="reps-panel" id="repsPanel" aria-live="polite" />
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
