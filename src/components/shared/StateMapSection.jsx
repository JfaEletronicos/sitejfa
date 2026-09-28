/**
 * Seção com o mapa interativo do Brasil, busca por estado e painel de contato.
 * Usada por Representantes (prefixo "reps") e Suporte (prefixo "sup"); a
 * interatividade fica em behaviors/stateMap.js, que acha as peças pelos ids.
 */
export default function StateMapSection({
  prefix,
  anchorId,
  title,
  sub,
  placeholder = 'Digite seu estado',
  children,
}) {
  return (
    <section className="reps" id={`${prefix}Section`}>
      <span className="jfa-anchor" id={anchorId} aria-hidden="true" />{' '}
      <canvas className="section-energy-canvas" id={`${prefix}EnergyCanvas`} aria-hidden="true" />
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
          <div className="reps-stage" id={`${prefix}Stage`}>
            <div className="reps-map-wrap" id={`${prefix}MapWrap`}>
              <svg
                className="reps-map"
                id={`${prefix}MapSvg`}
                viewBox="22.00 1.00 357.00 371.00"
                role="img"
                aria-label="Mapa do Brasil: selecione um estado"
              >
                <path
                  className="reps-map-backdrop"
                  d="M106.00,14.00 L108.00,38.00 L98.00,40.00 L94.00,33.00 L60.00,37.00 L58.00,64.00 L63.00,69.00 L60.00,86.00 L42.00,90.00 L34.00,96.00 L26.00,114.00 L26.00,131.00 L42.00,150.00 L53.00,150.00 L55.00,158.00 L86.00,158.00 L98.00,153.00 L99.00,162.00 L108.00,171.00 L141.00,184.00 L143.00,204.00 L157.00,205.00 L159.00,214.00 L164.00,216.00 L163.00,256.00 L183.00,262.00 L184.00,272.00 L192.00,275.00 L192.00,288.00 L196.00,290.00 L168.00,317.00 L167.00,334.00 L174.00,334.00 L199.00,354.00 L200.00,368.00 L216.00,368.00 L226.00,346.00 L237.00,343.00 L245.00,325.00 L255.00,314.00 L256.00,286.00 L289.00,266.00 L312.00,265.00 L313.00,251.00 L322.00,250.00 L332.00,224.00 L337.00,219.00 L341.00,176.00 L347.00,175.00 L352.00,168.00 L351.00,150.00 L360.00,141.00 L370.00,140.00 L371.00,127.00 L375.00,126.00 L373.00,100.00 L370.00,96.00 L355.00,94.00 L334.00,76.00 L296.00,72.00 L281.00,61.00 L253.00,52.00 L246.00,46.00 L246.00,36.00 L239.00,32.00 L235.00,13.00 L220.00,13.00 L209.00,30.00 L181.00,28.00 L179.00,33.00 L160.00,35.00 L162.00,15.00 L157.00,5.00 L142.00,5.00 L128.00,14.00 Z"
                />
              </svg>
              <div className="reps-tooltip" id={`${prefix}Tooltip`} />
            </div>
          </div>
          <div className="reps-text-col">
            <div className="reps-top">
              <h2 className="reps-title">{title}</h2>
              <p className="reps-sub">{sub}</p>
            </div>
            <div className="reps-search-wrap">
              <div className="reps-search">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>{' '}
                <input
                  type="text"
                  id={`${prefix}SearchInput`}
                  placeholder={placeholder}
                  autoComplete="off"
                  aria-label="Buscar estado"
                  aria-expanded="false"
                  aria-autocomplete="list"
                  role="combobox"
                />
                <div className="reps-suggest" id={`${prefix}Suggest`} role="listbox" />
              </div>
              <span className="reps-search-hint">Ou escolha no mapa.</span>
            </div>
          </div>
          <div className="reps-col2-lower">
            <aside className="reps-panel" id={`${prefix}Panel`} aria-live="polite" />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
