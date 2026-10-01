/**
 * Pop-up de lançamento da JFA Parts: abre assim que a página carrega, com o filme
 * da Parts, a headline e o botão "Saiba mais" (leva a #/setores/parts).
 * Comportamento em behaviors/partsLaunchPopup.js.
 */
export default function PartsLaunchPopup() {
  return (
    <div
      className="parts-launch"
      id="partsLaunch"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partsLaunchTitle"
      hidden
      data-theme-keep
    >
      <div className="parts-launch-backdrop" data-parts-launch-close aria-hidden="true" />
      <div className="parts-launch-box">
        <button className="parts-launch-close" type="button" data-parts-launch-close aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="parts-launch-media">
          <video
            className="parts-launch-video"
            id="partsLaunchVideo"
            src="/media/jfa-parts-filme.mp4"
            poster="/media/jfa-parts-filme-poster.webp"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        </div>
        <div className="parts-launch-copy">
          <span className="parts-launch-eyebrow">Lançamento</span>
          <h2 className="parts-launch-title" id="partsLaunchTitle">
            Conheça a nova frente da JFA: <em>Parts</em>.
          </h2>
          <p className="parts-launch-text">Placas eletrônicas para linha branca de eletrodomésticos.</p>
          <a className="parts-launch-cta" href="#/setores/parts" id="partsLaunchCta">
            Saiba mais
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
  );
}
