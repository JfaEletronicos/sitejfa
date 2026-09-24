const STORE_URL = 'https://loja.jfaeletronicos.com';
const MERCADO_LIVRE_URL =
  'https://www.mercadolivre.com.br/loja/jfa-eletronicos?item_id=MLB3492722035&category_id=MLB5672&official_store_id=223044&client=recoview-selleritems&recos_listing=true';

const ExternalIcon = () => (
  <svg className="jfa-nav-external-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 7h8v8M17 7 7 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Header fixo com navegação e o painel de busca global. */
export default function Header() {
  return (
    <>
      <header className="jfa-header" id="jfaHeader">
        <nav className="jfa-nav-left" aria-label="Navegação principal">
          <a href="#/baterias" id="navBaterias">
            Bateria
          </a>{' '}
          <a href="#/setores" id="navSetores">
            Setores
          </a>
        </nav>
        <a className="jfa-logo jfa-logo-link" id="navHome" href="#home" aria-label="JFA -- voltar ao início">
          <img className="jfa-logo-mark" src="/images/jfa_logo_mark.webp" alt="" width="40" height="40" />{' '}
          <span className="jfa-logo-word">JFA</span>
        </a>
        <nav className="jfa-nav-right" aria-label="Suporte e compra">
          <a href="#manuais" data-header-scroll="manuais">
            Manuais
          </a>{' '}
          <a href="#representantes" data-header-scroll="representantes">
            Representantes
          </a>{' '}
          <a
            href={STORE_URL}
            className="jfa-nav-external"
            data-header-external="loja-oficial"
            target="_blank"
            rel="noopener noreferrer"
          >
            Loja Oficial <ExternalIcon />
          </a>{' '}
          <a
            href={MERCADO_LIVRE_URL}
            className="jfa-nav-external"
            data-header-external="mercado-livre"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mercado Livre <ExternalIcon />
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
