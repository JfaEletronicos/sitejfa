import { trackEvent } from '../lib/analytics';
import { CAMPAIGN_BANNERS } from '../data/campaigns';

/**
 * Carrossel de campanhas da Home: loop infinito com clones, arraste, setas, paginação e autoplay.
 * @param {import('./context').BehaviorContext} ctx
 */
function initCampaignCarousel(ctx) {
  const { root, on, cleanups } = ctx;
  (() => {
    const campaignSection = root.getElementById('campaignSection');
    const campaignViewport = root.getElementById('campaignViewport');
    const campaignTrack = root.getElementById('campaignTrack');
    const campaignPrev = root.getElementById('campaignPrev');
    const campaignNext = root.getElementById('campaignNext');
    if (!campaignSection || !campaignViewport || !campaignTrack || !CAMPAIGN_BANNERS.length) return;
    const N = CAMPAIGN_BANNERS.length;
    const loops = N > 1;
    const buildSlide = (banner, realIndex, isClone) => {
      const a = document.createElement('a');
      a.className = 'campaign-slide';
      a.href = banner.href;
      a.draggable = false;
      a.setAttribute('aria-label', banner.ariaLabel || banner.name || banner.alt);
      a.dataset.realIndex = String(realIndex);
      if (isClone) {
        a.setAttribute('aria-hidden', 'true');
        a.tabIndex = -1;
      }
      if (/^https?:\/\//i.test(banner.href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      const media = document.createElement('span');
      media.className = 'campaign-slide-media';
      const picture = document.createElement('picture');
      let sourceEl = null;
      if (banner.mobileImage) {
        sourceEl = document.createElement('source');
        sourceEl.media = '(max-width: 640px)';
        picture.appendChild(sourceEl);
      }
      const img = document.createElement('img');
      img.alt = isClone ? '' : banner.alt || '';
      img.src = banner.desktopImage;
      if (sourceEl) sourceEl.srcset = banner.mobileImage;
      img.loading = 'lazy';
      img.fetchPriority = !isClone && realIndex <= 1 ? 'high' : 'auto';
      img.decoding = 'async';
      img.draggable = false;
      if (banner.focalPoint) img.style.objectPosition = banner.focalPoint;
      picture.appendChild(img);
      media.appendChild(picture);
      a.appendChild(media);
      return a;
    };
    const frag = document.createDocumentFragment();
    if (loops) frag.appendChild(buildSlide(CAMPAIGN_BANNERS[N - 1], N - 1, true));
    CAMPAIGN_BANNERS.forEach((banner, i) => frag.appendChild(buildSlide(banner, i, false)));
    if (loops) frag.appendChild(buildSlide(CAMPAIGN_BANNERS[0], 0, true));
    campaignTrack.appendChild(frag);
    const slideEls = Array.from(campaignTrack.children);
    let current = loops ? 1 : 0;
    let peek = 0,
      slideW = 0;
    const setTrackTransform = (animate) => {
      const x = peek - current * slideW;
      if (animate) {
        campaignTrack.style.transform = `translate3d(${x}px,0,0)`;
      } else {
        campaignTrack.style.transition = 'none';
        campaignTrack.style.transform = `translate3d(${x}px,0,0)`;
        void campaignTrack.offsetHeight;
        campaignTrack.style.transition = '';
      }
    };
    const computeLayout = () => {
      const vw =
        campaignViewport.clientWidth || campaignViewport.getBoundingClientRect().width || window.innerWidth;
      // Banner de ponta a ponta: cada slide ocupa a largura toda, sem espiar os vizinhos.
      peek = 0;
      slideW = Math.max(1, vw - peek * 2);
      slideEls.forEach((el) => {
        el.style.width = slideW + 'px';
      });
      setTrackTransform(false);
    };
    const realIndexOf = (trackIndex) => (loops ? (trackIndex - 1 + N) % N : trackIndex);
    let lastViewedRealIndex = -1;
    const maybeFireCampaignView = () => {
      if (!inViewport || tabHidden) return;
      const realIdx = realIndexOf(current);
      if (realIdx === lastViewedRealIndex) return;
      lastViewedRealIndex = realIdx;
      const banner = CAMPAIGN_BANNERS[realIdx];
      trackEvent('campaign_banner_view', {
        campaign_id: banner.id,
        campaign_name: banner.name || banner.id,
        campaign_position: realIdx + 1,
      });
    };
    const updateActiveState = () => {
      slideEls.forEach((el, i) => {
        const active = i === current;
        el.classList.toggle('is-active', active);
        if (el.getAttribute('aria-hidden') !== 'true') el.tabIndex = active ? 0 : -1;
      });
      maybeFireCampaignView();
    };
    const goTo = (trackIndex, animate) => {
      current = trackIndex;
      setTrackTransform(animate !== false);
      updateActiveState();
    };
    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);
    on(campaignTrack, 'transitionend', (e) => {
      if (!loops || e.target !== campaignTrack || e.propertyName !== 'transform') return;
      if (current === 0) {
        current = N;
        setTrackTransform(false);
      } else if (current === N + 1) {
        current = 1;
        setTrackTransform(false);
      }
    });
    on(campaignTrack, 'click', (e) => {
      const slideEl = e.target.closest('.campaign-slide');
      if (!slideEl) return;
      const idx = slideEls.indexOf(slideEl);
      if (slideEl.getAttribute('aria-hidden') === 'true' || idx !== current) {
        e.preventDefault();
        return;
      }
      const banner = CAMPAIGN_BANNERS[Number(slideEl.dataset.realIndex)];
      trackEvent('campaign_banner_click', {
        campaign_id: banner.id,
        campaign_name: banner.name || banner.id,
        campaign_position: Number(slideEl.dataset.realIndex) + 1,
        destination: banner.href,
      });
    });
    if (campaignPrev)
      on(campaignPrev, 'click', () => {
        markCampaignInteracted();
        prev();
      });
    if (campaignNext)
      on(campaignNext, 'click', () => {
        markCampaignInteracted();
        next();
      });
    if (!loops) {
      if (campaignPrev) campaignPrev.hidden = true;
      if (campaignNext) campaignNext.hidden = true;
    }
    const AUTOPLAY_MS = 7e3,
      RESUME_IDLE_MS = 6e3;
    let autoplayTimerId = null,
      resumeTimeoutId = null;
    let hovering = false,
      dragging = false,
      tabHidden = document.hidden,
      inViewport = false,
      userPausedUntilIdle = false;
    const canAutoplay = () =>
      loops &&
      !ctx.reduceMotion &&
      !hovering &&
      !dragging &&
      !tabHidden &&
      inViewport &&
      !userPausedUntilIdle;
    const stopAutoplay = () => {
      if (autoplayTimerId) {
        clearInterval(autoplayTimerId);
        autoplayTimerId = null;
      }
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (canAutoplay())
        autoplayTimerId = window.setInterval(() => {
          if (canAutoplay()) next();
        }, AUTOPLAY_MS);
    };
    const refreshAutoplay = () => {
      if (canAutoplay()) {
        if (!autoplayTimerId) startAutoplay();
      } else {
        stopAutoplay();
      }
    };
    const markCampaignInteracted = () => {
      userPausedUntilIdle = true;
      stopAutoplay();
      if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
      resumeTimeoutId = window.setTimeout(() => {
        userPausedUntilIdle = false;
        refreshAutoplay();
      }, RESUME_IDLE_MS);
    };
    cleanups.push(() => {
      stopAutoplay();
      if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
    });
    on(campaignViewport, 'pointerenter', () => {
      hovering = true;
      refreshAutoplay();
    });
    on(campaignViewport, 'pointerleave', () => {
      hovering = false;
      refreshAutoplay();
    });
    on(document, 'visibilitychange', () => {
      tabHidden = document.hidden;
      refreshAutoplay();
      maybeFireCampaignView();
    });
    const onCampaignReduceChange = () => refreshAutoplay();
    if (ctx.reduceMotionMQ.addEventListener)
      ctx.reduceMotionMQ.addEventListener('change', onCampaignReduceChange);
    cleanups.push(() => {
      if (ctx.reduceMotionMQ.removeEventListener)
        ctx.reduceMotionMQ.removeEventListener('change', onCampaignReduceChange);
    });
    if ('IntersectionObserver' in window) {
      const campaignInViewObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            inViewport = e.isIntersecting;
            refreshAutoplay();
            maybeFireCampaignView();
          });
        },
        { threshold: 0.15 },
      );
      campaignInViewObs.observe(campaignSection);
      cleanups.push(() => campaignInViewObs.disconnect());
    } else {
      inViewport = true;
    }
    const DRAG_START_PX = 6;
    const DRAG_FLIP_FRAC = 0.18;
    let pointerState = null;
    const dampDrag = (raw) => {
      const soft = slideW * 0.9;
      if (Math.abs(raw) <= soft || soft <= 0) return raw;
      const over = Math.abs(raw) - soft;
      return Math.sign(raw) * (soft + over * 0.35);
    };
    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerState = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, dx: 0, captured: false };
    };
    const onPointerMove = (e) => {
      if (!pointerState || e.pointerId !== pointerState.pointerId) return;
      const rawDx = e.clientX - pointerState.startX;
      const rawDy = e.clientY - pointerState.startY;
      if (!pointerState.captured) {
        if (Math.abs(rawDx) < DRAG_START_PX) {
          if (Math.abs(rawDy) > Math.abs(rawDx) && Math.abs(rawDy) > DRAG_START_PX) pointerState = null;
          return;
        }
        pointerState.captured = true;
        dragging = true;
        campaignTrack.classList.add('is-dragging');
        markCampaignInteracted();
        if (campaignTrack.setPointerCapture) {
          try {
            campaignTrack.setPointerCapture(e.pointerId);
          } catch {
            /* ignora */
          }
        }
      }
      const dx = dampDrag(rawDx);
      pointerState.dx = dx;
      campaignTrack.style.transform = `translate3d(${(peek - current * slideW + dx).toFixed(1)}px,0,0)`;
    };
    const endDrag = (e) => {
      if (!pointerState || (e && e.pointerId !== pointerState.pointerId)) return;
      const wasDragging = pointerState.captured;
      const dx = pointerState.dx;
      pointerState = null;
      if (!wasDragging) return;
      dragging = false;
      campaignTrack.classList.remove('is-dragging');
      refreshAutoplay();
      if (Math.abs(dx) > slideW * DRAG_FLIP_FRAC) goTo(current + (dx < 0 ? 1 : -1));
      else setTrackTransform(true);
    };
    on(campaignTrack, 'pointerdown', onPointerDown);
    on(window, 'pointermove', onPointerMove, { passive: true });
    on(window, 'pointerup', endDrag);
    on(window, 'pointercancel', endDrag);
    let campaignResizeT = null;
    const onCampaignResize = () => {
      clearTimeout(campaignResizeT);
      campaignResizeT = setTimeout(computeLayout, 150);
    };
    on(window, 'resize', onCampaignResize);
    cleanups.push(() => clearTimeout(campaignResizeT));
    computeLayout();
    updateActiveState();
    startAutoplay();
  })();
}
export { initCampaignCarousel };
