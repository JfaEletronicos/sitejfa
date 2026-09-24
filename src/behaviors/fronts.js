/**
 * Frentes JFA: carrossel de 4 painéis com arraste, setas, navegação e demonstração inicial.
 * @param {import('./context').BehaviorContext} ctx
 */
export function initFronts(ctx) {
  const { root, on, cleanups } = ctx;
  const frontsTop = root.querySelector('.fronts-top');
  if (frontsTop) {
    if ('IntersectionObserver' in window) {
      const frontsTopObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              frontsTopObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      frontsTopObs.observe(frontsTop);
      cleanups.push(() => frontsTopObs.disconnect());
    } else {
      frontsTop.classList.add('is-visible');
    }
  }
  const frontsStage = root.getElementById('frontsStage');
  const frontsTrack = root.getElementById('frontsTrack');
  const frontPanels = frontsTrack ? Array.from(frontsTrack.querySelectorAll('.front-panel')) : [];
  const frontInfos = frontPanels.map((p) => p.querySelector('.front-info'));
  const frontDescs = frontPanels.map((p) => p.querySelector('.front-desc'));
  const frontCtas = frontPanels.map((p) => p.querySelector('.front-cta'));
  const frontVisualImgs = frontPanels.map((p) => p.querySelector('.front-visual-img'));
  const frontsNavEl = root.getElementById('frontsNav');
  const frontsNavFill = root.getElementById('frontsNavFill');
  const frontsNavItems = frontsNavEl ? Array.from(frontsNavEl.querySelectorAll('.fronts-nav-item')) : [];
  const frontsPrev = root.getElementById('frontsPrev');
  const frontsNext = root.getElementById('frontsNext');
  if (frontsStage && frontsTrack && frontPanels.length) {
    const FRONT_LAST = frontPanels.length - 1;
    const FRONT_N = frontPanels.length;
    const wrapFrontIndex = (i) => ((i % FRONT_N) + FRONT_N) % FRONT_N;
    let activeIndex = FRONT_LAST;
    let userInteractedFronts = false;
    let nudgeTimeoutId = null;
    const markFrontsInteracted = () => {
      if (userInteractedFronts) return;
      userInteractedFronts = true;
      if (nudgeTimeoutId) {
        clearTimeout(nudgeTimeoutId);
        nudgeTimeoutId = null;
      }
    };
    const boundarySign = new Array(FRONT_N).fill(0);
    const applyFrontsFrame = (index, dragPx) => {
      const stageW = frontsStage.offsetWidth || 1;
      const slot = 34;
      const dragSlots = dragPx ? ((dragPx / stageW) * 100) / slot : 0;
      frontPanels.forEach((panel, i) => {
        let raw = i - index + dragSlots;
        if (raw > FRONT_N / 2) raw -= FRONT_N;
        else if (raw < -FRONT_N / 2) raw += FRONT_N;
        if (Math.abs(raw) === FRONT_N / 2) {
          if (boundarySign[i] !== 0) raw = boundarySign[i] * (FRONT_N / 2);
        }
        boundarySign[i] = raw >= 0 ? 1 : -1;
        const distance = raw;
        const absD = Math.min(Math.abs(distance), 1.6);
        const isPassed = distance < -1e-3;
        const scale = absD <= 1 ? 1 - 0.14 * absD : 0.86 - (0.24 * (absD - 1)) / 0.6;
        const opacityRaw = absD <= 1 ? 1 - 0.72 * absD : Math.max(0, 0.28 - (0.26 * (absD - 1)) / 0.6);
        const opacity = isPassed ? 0 : opacityRaw;
        const blurPx = isPassed ? 0 : absD <= 0.15 ? 0 : Math.min(19, 4.5 + absD * 11.5);
        const tx = distance * slot;
        const ty = Math.min(absD, 1) * 16;
        panel.style.transform = `translate3d(calc(-50% + ${tx}%), calc(-50% + ${ty}px), 0) scale(${scale})`;
        panel.style.opacity = String(Math.max(0, opacity));
        panel.style.filter = blurPx > 0.05 ? `blur(${blurPx}px)` : 'none';
        if (frontVisualImgs[i]) {
          const feather = Math.max(14, 100 - absD * 75);
          frontVisualImgs[i].style.setProperty('--fv-feather', feather.toFixed(1) + '%');
        }
        const isActive = absD < 0.06;
        panel.style.pointerEvents = isActive ? 'auto' : 'none';
        if (!isActive) {
          panel.classList.remove('is-active');
        } else if (frontsTrack.classList.contains('is-dragging')) {
          panel.classList.add('is-active');
        }
        const textOpacity = Math.max(0, 1 - absD * 2.5);
        const lagAmt = Math.min(absD, 1);
        const lagSign = distance > 0 ? 1 : distance < 0 ? -1 : 0;
        const lagX = lagSign * lagAmt * 46;
        const lagY = lagAmt * 6;
        const textBlur = blurPx > 0.05 ? Math.min(4, blurPx * 0.5) : 0;
        const textTransform = `translate3d(${lagX}px, ${lagY}px, 0)`;
        const textFilter = textBlur > 0.05 ? `blur(${textBlur}px)` : 'none';
        [frontInfos[i], frontDescs[i], frontCtas[i]].forEach((el) => {
          if (!el) return;
          el.style.opacity = String(textOpacity);
          el.style.transform = textTransform;
          el.style.filter = textFilter;
        });
        if (frontCtas[i]) {
          frontCtas[i].tabIndex = isActive ? 0 : -1;
        }
      });
      if (frontsNavFill) frontsNavFill.style.width = (100 / FRONT_LAST) * index + '%';
      frontsNavItems.forEach((item, i) => item.classList.toggle('is-active', i === index));
      if (frontsPrev) frontsPrev.disabled = false;
      if (frontsNext) frontsNext.disabled = false;
    };
    const goTo = (i) => {
      activeIndex = wrapFrontIndex(i);
      applyFrontsFrame(activeIndex, 0);
    };
    frontPanels.forEach((panel, i) => {
      const onPanelSettled = (e) => {
        if (e.target !== panel || e.propertyName !== 'transform') return;
        if (i === activeIndex) panel.classList.add('is-active');
      };
      on(panel, 'transitionend', onPanelSettled);
    });
    let drag = null;
    const DRAG_THRESHOLD = 50;
    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('.front-cta')) return;
      markFrontsInteracted();
      drag = { pointerId: e.pointerId, startX: e.clientX };
      frontsTrack.classList.add('is-dragging');
      if (frontsTrack.setPointerCapture) {
        try {
          frontsTrack.setPointerCapture(e.pointerId);
        } catch {
          /* ignora */
        }
      }
    };
    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.pointerId) return;
      applyFrontsFrame(activeIndex, e.clientX - drag.startX);
    };
    const endDrag = (e) => {
      if (!drag || (e && e.pointerId !== drag.pointerId)) return;
      const dx = e && e.clientX !== void 0 ? e.clientX - drag.startX : 0;
      drag = null;
      frontsTrack.classList.remove('is-dragging');
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        goTo(activeIndex + (dx < 0 ? 1 : -1));
      } else {
        applyFrontsFrame(activeIndex, 0);
      }
    };
    on(frontsTrack, 'pointerdown', onPointerDown);
    on(window, 'pointermove', onPointerMove);
    on(window, 'pointerup', endDrag);
    on(window, 'pointercancel', endDrag);
    if (frontsPrev)
      on(frontsPrev, 'click', () => {
        markFrontsInteracted();
        goTo(activeIndex - 1);
      });
    if (frontsNext)
      on(frontsNext, 'click', () => {
        markFrontsInteracted();
        goTo(activeIndex + 1);
      });
    frontsNavItems.forEach((item, i) =>
      on(item, 'click', () => {
        markFrontsInteracted();
        goTo(i);
      }),
    );
    let frontsResizeT = null;
    const onFrontsResize = () => {
      clearTimeout(frontsResizeT);
      frontsResizeT = setTimeout(() => applyFrontsFrame(activeIndex, 0), 150);
    };
    on(window, 'resize', onFrontsResize);
    cleanups.push(() => clearTimeout(frontsResizeT));
    applyFrontsFrame(activeIndex, 0);
    const runFrontsNudge = () => {
      if (userInteractedFronts || ctx.reduceMotion) return;
      nudgeTimeoutId = setTimeout(() => {
        nudgeTimeoutId = null;
        if (userInteractedFronts) return;
        markFrontsInteracted();
        goTo(activeIndex + 1);
      }, 550);
    };
    if ('IntersectionObserver' in window) {
      const frontsDemoObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runFrontsNudge();
              frontsDemoObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      frontsDemoObs.observe(frontsStage);
      cleanups.push(() => {
        frontsDemoObs.disconnect();
        if (nudgeTimeoutId) clearTimeout(nudgeTimeoutId);
      });
    }
  }
}
