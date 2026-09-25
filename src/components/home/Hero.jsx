/** Hero com vídeo de fundo, headline animada e CTAs. */
export default function Hero() {
  return (
    <>
      <div className="scene-side scene-left" id="sceneLeft" aria-hidden="true" />
      <div className="scene-side scene-right" id="sceneRight" aria-hidden="true" />
      <div className="hero-pin-space" id="heroPinSpace">
        <div className="hero-shell" id="heroShell" data-theme-keep>
          <video
            className="hero-bg-video"
            id="heroBgVideo"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            src="/media/hero.mp4"
          />
          <div className="hero-vignette" id="heroVignette" aria-hidden="true" />
          <div className="jfa-header-spacer" id="headerSpacer" aria-hidden="true" />
          <section className="hero" id="heroSection">
            <span className="jfa-anchor" id="home" aria-hidden="true" />
            <div className="hero-inner" id="heroInner">
              <div className="hero-copy" id="heroCopy">
                <h1 className="hero-title">
                  <span className="line">
                    <span className="word">
                      <em>Energia</em>
                    </span>{' '}
                    <span className="word">é</span> <span className="word">o</span>
                  </span>{' '}
                  <span className="line">
                    <span className="word">que</span> <span className="word">nos</span>{' '}
                    <span className="word">move</span>
                  </span>{' '}
                  <span className="line">
                    <span className="word">desde</span> <span className="word">o</span>{' '}
                    <span className="word">começo.</span>
                  </span>
                </h1>
                <p className="hero-sub" id="heroSub">
                  Há <strong>mais de duas décadas</strong>, desenvolvemos soluções para energia, movimento e
                  eletrônica, com tecnologia, suporte e certificações aplicáveis a diferentes categorias.
                </p>
                <div className="hero-cta-row" id="heroCtaRow">
                  <a href="#solucoes" className="hero-cta hero-cta-primary">
                    Explorar produtos
                  </a>{' '}
                  <a href="#manuais" className="hero-cta">
                    Encontrar um manual
                  </a>{' '}
                  <a href="#loja" className="hero-cta hero-cta-tertiary">
                    Onde comprar{' '}
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h13M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <div className="hero-tail" id="heroTail" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
