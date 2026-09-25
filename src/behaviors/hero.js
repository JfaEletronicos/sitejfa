/**
 * Hero: intro animada da headline (1s, sem desfoque), vídeo de fundo sob demanda e leve parallax no scroll.
 * @param {import('./context').BehaviorContext} ctx
 */
export function initHero(ctx) {
  const { root, on, cleanups } = ctx;
  const heroSection = root.getElementById('heroSection');
  const heroInner = root.getElementById('heroInner');
  const sceneLeft = root.getElementById('sceneLeft');
  const sceneRight = root.getElementById('sceneRight');
  const heroPinSpace = root.getElementById('heroPinSpace');
  const heroBgVideo = root.getElementById('heroBgVideo');
  const titleWords = Array.from(root.querySelectorAll('.hero-title .word'));
  const heroSub = root.getElementById('heroSub');
  const heroCtaRow = root.getElementById('heroCtaRow');
  const playHeroBgVideo = () => {
    if (!heroBgVideo) return;
    const p = heroBgVideo.play();
    if (p && p.catch) p.catch(() => {});
  };
  const pauseHeroBgVideo = () => {
    if (heroBgVideo) heroBgVideo.pause();
  };
  if (heroBgVideo) {
    on(heroBgVideo, 'ended', () => {
      heroBgVideo.currentTime = 0;
      playHeroBgVideo();
    });
  }
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const phaseOf = (progress, start, end) => easeInOutCubic(clamp01((progress - start) / (end - start)));
  const positionScene = () => {
    if (!heroPinSpace) return;
    const h = heroPinSpace.offsetHeight;
    const overlap = Math.min(220, h * 0.14);
    const top = Math.max(0, h - overlap) + 'px';
    if (sceneLeft) sceneLeft.style.top = top;
    if (sceneRight) sceneRight.style.top = top;
  };
  let displayProgress = 0;
  let introStartTime = null;
  let rafId = null;
  const HERO_INTRO_DURATION_MS = 1e3;
  const applyFrame = (progress) => {
    // O texto começa a entrar logo no início (antes esperava metade da intro).
    const textPhase = phaseOf(progress, 0, 1);
    const headlinePhase = textPhase;
    const subPhase = phaseOf(textPhase, 0.15, 1);
    const ctaPhase = phaseOf(textPhase, 0.25, 1);
    const sceneFade = phaseOf(progress, 0.78, 1);
    const TITLE_BASE_OPACITY = 0.3,
      TITLE_BASE_Y = 10,
      TITLE_BASE_BLUR = 0;
    const wordCount = titleWords.length || 1;
    const wordStagger = wordCount > 1 ? 0.36 / (wordCount - 1) : 0;
    titleWords.forEach((word, i) => {
      const localStart = i * wordStagger;
      const local = phaseOf(headlinePhase, localStart, Math.min(1, localStart + 0.6));
      const k = 1 - local;
      word.style.opacity = String(TITLE_BASE_OPACITY + (1 - TITLE_BASE_OPACITY) * local);
      word.style.transform =
        local >= 0.9995 ? 'translate3d(0,0,0)' : `translate3d(0, ${k * TITLE_BASE_Y}px, 0)`;
      word.style.filter = local >= 0.9995 ? 'blur(0px)' : `blur(${(k * TITLE_BASE_BLUR).toFixed(2)}px)`;
    });
    const SUB_BASE_OPACITY = 0.2,
      SUB_BASE_Y = 8,
      SUB_BASE_BLUR = 0;
    if (heroSub) {
      const ks = 1 - subPhase;
      heroSub.style.opacity = String(SUB_BASE_OPACITY + (1 - SUB_BASE_OPACITY) * subPhase);
      heroSub.style.transform =
        subPhase >= 0.9995 ? 'translate3d(0,0,0)' : `translate3d(0, ${ks * SUB_BASE_Y}px, 0)`;
      heroSub.style.filter = subPhase >= 0.9995 ? 'blur(0px)' : `blur(${(ks * SUB_BASE_BLUR).toFixed(2)}px)`;
    }
    const CTA_BASE_OPACITY = 0,
      CTA_BASE_Y = 14,
      CTA_BASE_BLUR = 0;
    if (heroCtaRow) {
      const kc = 1 - ctaPhase;
      heroCtaRow.style.opacity = String(CTA_BASE_OPACITY + (1 - CTA_BASE_OPACITY) * ctaPhase);
      heroCtaRow.style.transform =
        ctaPhase >= 0.9995 ? 'translate3d(0,0,0)' : `translate3d(0, ${kc * CTA_BASE_Y}px, 0)`;
      heroCtaRow.style.filter =
        ctaPhase >= 0.9995 ? 'blur(0px)' : `blur(${(kc * CTA_BASE_BLUR).toFixed(2)}px)`;
    }
    if (sceneLeft) sceneLeft.style.opacity = String(sceneFade * 0.5);
    if (sceneRight) sceneRight.style.opacity = String(sceneFade * 0.5);
  };
  const tick = (now) => {
    if (introStartTime === null) introStartTime = now;
    displayProgress = clamp01((now - introStartTime) / HERO_INTRO_DURATION_MS);
    applyFrame(displayProgress);
    if (displayProgress >= 1 || !heroInView) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  };
  let heroInView = true;
  if (heroSection && 'IntersectionObserver' in window) {
    const heroInViewObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          heroInView = e.isIntersecting;
          if (heroInView) {
            if (rafId == null && !ctx.reduceMotion) rafId = requestAnimationFrame(tick);
            if (!ctx.reduceMotion) playHeroBgVideo();
          } else {
            pauseHeroBgVideo();
          }
        });
      },
      { rootMargin: '500px 0px' },
    );
    heroInViewObs.observe(heroSection);
    cleanups.push(() => heroInViewObs.disconnect());
  }
  ctx.syncHeaderSpacer();
  if (ctx.reduceMotion) {
    if (heroPinSpace) heroPinSpace.style.height = 'auto';
    applyFrame(1);
    positionScene();
  } else {
    applyFrame(0);
    positionScene();
    playHeroBgVideo();
    rafId = requestAnimationFrame(tick);
    cleanups.push(() => {
      if (rafId) cancelAnimationFrame(rafId);
    });
    let resizeT = null;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        ctx.syncHeaderSpacer();
        positionScene();
        applyFrame(displayProgress);
      }, 150);
    };
    on(window, 'resize', onResize);
    cleanups.push(() => clearTimeout(resizeT));
  }
  if (!ctx.reduceMotion && heroSection && heroInner) {
    let ticking1 = false;
    const onHeroScroll = () => {
      if (!heroInView) return;
      if (ticking1) return;
      ticking1 = true;
      requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const h = rect.height || 1;
        const progress = Math.max(0, Math.min(1, -rect.top / h));
        const eased = Math.min(1, progress / 0.7);
        heroInner.style.opacity = String(1 - eased * 0.22);
        heroInner.style.transform = `translate3d(0, ${-eased * 26}px, 0) scale(${1 - eased * 0.03})`;
        ticking1 = false;
      });
    };
    on(window, 'scroll', onHeroScroll, { passive: true });
    onHeroScroll();
  }
  ctx.reduceMotionListeners.push((reduce) => {
    if (reduce) {
      pauseHeroBgVideo();
    } else if (heroInView) {
      playHeroBgVideo();
    }
  });
}
