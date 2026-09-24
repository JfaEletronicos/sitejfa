/** Rodapé. */
export default function Footer() {
  return (
    <footer className="jfa-footer" id="jfaFooter">
      <div className="jfa-footer-texture" aria-hidden="true" />
      <div className="jfa-footer-inner">
        <div className="jfa-footer-top">
          <div className="jfa-footer-brand">
            <div className="jfa-logo jfa-footer-logo">
              <img className="jfa-logo-mark" src="/images/jfa_logo_mark.webp" alt="" width="40" height="40" />{' '}
              <span className="jfa-logo-word">JFA</span>
            </div>
            <p className="jfa-footer-tagline">Tecnologia feita por nós.</p>
          </div>
          <nav className="jfa-footer-cols" aria-label="Links do rodapé">
            <div className="jfa-footer-col" data-footer-col="0">
              <span className="jfa-footer-col-title">Produtos</span>{' '}
              <a href="#frentes" data-footer-goto="0">
                Automotivo
              </a>{' '}
              <a href="#frentes" data-footer-goto="1">
                Energia
              </a>{' '}
              <a href="#frentes" data-footer-goto="2">
                Parts
              </a>{' '}
              <a href="#frentes" data-footer-goto="3">
                Moov
              </a>
            </div>
            <div className="jfa-footer-col" data-footer-col="1">
              <span className="jfa-footer-col-title">JFA</span>{' '}
              <a href="#home" data-footer-scroll="home">
                Sobre nós
              </a>{' '}
              <a href="#representantes" data-footer-scroll="representantes">
                Representantes
              </a>{' '}
              <a href="#certificacoes" data-footer-scroll="certificacoes">
                Certificações
              </a>
            </div>
            <div className="jfa-footer-col" data-footer-col="2">
              <span className="jfa-footer-col-title">Suporte</span>{' '}
              <a href="#manuais" data-footer-scroll="manuais">
                Manuais
              </a>{' '}
              <a href="#representantes" data-footer-scroll="representantes">
                Contato
              </a>
            </div>
          </nav>
        </div>
        <div className="jfa-footer-rule" aria-hidden="true" />
        <div className="jfa-footer-bottom">
          <span className="jfa-footer-copy">
            © <span id="footerYear" /> JFA Eletrônicos
          </span>{' '}
          <button className="jfa-footer-top-btn" id="footerToTop" type="button">
            Voltar ao topo{' '}
            <span className="jfa-footer-top-arrow" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
