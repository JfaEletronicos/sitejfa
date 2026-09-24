/** Carrossel de banners de campanha (slides gerados a partir de data/campaigns.js). */
export default function CampaignCarousel() {
  return (
    <section className="campaign-section" id="campaignSection">
      <span className="jfa-anchor" id="destaques" aria-hidden="true" />
      <div className="campaign-section-bg" aria-hidden="true" />
      <div className="campaign-section-texture" aria-hidden="true" />
      <canvas className="section-energy-canvas" id="campaignEnergyCanvas" aria-hidden="true" />
      <div className="campaign-carousel" id="campaignCarousel">
        <button
          className="campaign-arrow campaign-arrow-prev"
          id="campaignPrev"
          type="button"
          aria-label="Banner anterior"
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
        <div className="campaign-viewport" id="campaignViewport">
          <div className="campaign-track" id="campaignTrack" />
        </div>
        <button
          className="campaign-arrow campaign-arrow-next"
          id="campaignNext"
          type="button"
          aria-label="Próximo banner"
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
      <div
        className="campaign-pagination"
        id="campaignPagination"
        role="tablist"
        aria-label="Selecionar campanha"
      />
    </section>
  );
}
