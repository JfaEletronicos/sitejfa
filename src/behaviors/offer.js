/**
 * Oferta em destaque: entrada animada, contagem regressiva e parallax da imagem.
 * @param {import('./context').BehaviorContext} ctx
 */
export function initOffer(ctx) {
  const { root, on, cleanups } = ctx;
  (() => {
    const offerSection = root.getElementById('offerSection');
    if (!offerSection) return;
    if ('IntersectionObserver' in window) {
      const offerInViewObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-inview');
              offerInViewObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      offerInViewObs.observe(offerSection);
      cleanups.push(() => offerInViewObs.disconnect());
    } else {
      offerSection.classList.add('is-inview');
    }
    const OFFER_END_AT = /* @__PURE__ */ new Date('2026-09-29T23:59:59-03:00').getTime();
    const offerHH = root.getElementById('offerHH');
    const offerMM = root.getElementById('offerMM');
    const offerSS = root.getElementById('offerSS');
    if (offerHH && offerMM && offerSS) {
      const pad2 = (n) => String(n).padStart(2, '0');
      let offerTimerId = null;
      const tickOfferCountdown = () => {
        const remaining = OFFER_END_AT - Date.now();
        if (remaining <= 0) {
          offerHH.textContent = '00';
          offerMM.textContent = '00';
          offerSS.textContent = '00';
          if (offerTimerId) {
            clearInterval(offerTimerId);
            offerTimerId = null;
          }
          return;
        }
        const totalSeconds = Math.floor(remaining / 1e3);
        offerHH.textContent = pad2(Math.floor(totalSeconds / 3600));
        offerMM.textContent = pad2(Math.floor((totalSeconds % 3600) / 60));
        offerSS.textContent = pad2(totalSeconds % 60);
      };
      tickOfferCountdown();
      offerTimerId = window.setInterval(tickOfferCountdown, 1e3);
      cleanups.push(() => {
        if (offerTimerId) clearInterval(offerTimerId);
      });
    }
    const offerParallax = root.getElementById('offerParallax');
    if (offerParallax) {
      const applyOfferParallax = (px, py) => {
        offerParallax.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
      };
      const onOfferMove = (e) => {
        if (ctx.reduceMotion || !ctx.fineMQ.matches) return;
        const rect = offerSection.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
        const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
        applyOfferParallax(nx * 4, ny * 4);
      };
      const onOfferLeave = () => applyOfferParallax(0, 0);
      on(offerSection, 'pointermove', onOfferMove);
      on(offerSection, 'pointerleave', onOfferLeave);
    }
  })();
}
