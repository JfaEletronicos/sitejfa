// O pop-up já nasce aberto (antes de qualquer outra coisa na página), a não ser
// que já tenha sido visto nesta visita ou que a pessoa chegue pela página da Parts.
const startsOpen = () => {
  if (typeof window === 'undefined') return false;
  if (/^#\/setores\/parts/.test(window.location.hash)) return false;
  try {
    return sessionStorage.getItem('jfa-parts-launch-seen') !== '1';
  } catch {
    return true;
  }
};

/**
 * Pop-up de lançamento da JFA Parts: headline, filme e botão "Saiba mais"
 * (leva a #/setores/parts). Comportamento em behaviors/partsLaunchPopup.js.
 */
export default function PartsLaunchPopup() {
  const open = startsOpen();
  return (
    <div
      className={'parts-launch' + (open ? ' is-open' : '')}
      id="partsLaunch"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partsLaunchTitle"
      hidden={!open}
      data-theme-keep
    >
      <div className="parts-launch-backdrop" data-parts-launch-close aria-hidden="true" />
      <div className="parts-launch-box" id="partsLaunchBox" tabIndex={-1}>
        <button className="parts-launch-close" type="button" data-parts-launch-close aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="parts-launch-title" id="partsLaunchTitle">
          Conheça a nova frente da JFA: <strong>Parts</strong>.
          <span className="parts-launch-text">Placas eletrônicas para linha branca de eletrodomésticos.</span>
        </h2>
        <div className="parts-launch-media">
          <video
            className="parts-launch-video"
            id="partsLaunchVideo"
            src="/media/jfa-parts-filme.mp4"
            poster="/media/jfa-parts-filme-poster.webp"
            muted
            loop
            playsInline
            autoPlay={open}
            preload={open ? 'auto' : 'none'}
            aria-hidden="true"
          />
        </div>
        <a className="parts-launch-cta" href="#/setores/parts" id="partsLaunchCta">
          Saiba mais
        </a>
      </div>
    </div>
  );
}
