/** Header fixo com navegação e o painel de busca global. */
export default function Header() {
  return (
    <>
      <header className="jfa-header" id="jfaHeader">
        <div className="jfa-nav-left">
          <a href="#solucoes" data-header-scroll="solucoes">
            PRODUTOS
          </a>{' '}
          <a href="#frentes" data-header-goto="2">
            JFA PARTS
          </a>{' '}
          <a href="#manuais" data-header-scroll="manuais">
            MANUAIS
          </a>
        </div>
        <a className="jfa-logo jfa-logo-link" id="navHome" href="#home" aria-label="JFA -- voltar ao início">
          <img className="jfa-logo-mark" src="/images/jfa_logo_mark.webp" alt="" width="40" height="40" />{' '}
          <span className="jfa-logo-word">JFA</span>
        </a>
        <nav className="jfa-nav-right">
          <a href="#representantes" data-header-scroll="representantes">
            REPRESENTANTES
          </a>{' '}
          <a href="#home" data-header-scroll="home">
            SOBRE NÓS
          </a>{' '}
          <a href="#loja" data-header-goto-buy="loja-oficial">
            LOJA OFICIAL
          </a>{' '}
          <button
            className="jfa-search-trigger"
            id="searchTrigger"
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="searchPanel"
            aria-label="Buscar produto, modelo ou código"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </nav>
      </header>
      <div
        className="jfa-search-panel"
        id="searchPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Busca"
        hidden
      >
        <div className="jfa-search-card">
          <div className="jfa-search-field">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>{' '}
            <input
              type="text"
              className="jfa-search-input"
              id="searchInput"
              placeholder="Busque produto, modelo ou código"
              autoComplete="off"
              aria-label="Busque produto, modelo ou código"
            />{' '}
            <button className="jfa-search-close" id="searchClose" type="button" aria-label="Fechar busca">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="jfa-search-results" id="searchResults" aria-live="polite" />
        </div>
      </div>
    </>
  );
}
