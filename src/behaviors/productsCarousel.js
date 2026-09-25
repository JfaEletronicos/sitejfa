/**
 * Soluções JFA: filtro por linha, entrada dos cards e carrossel infinito com arraste, inércia e autoplay.
 * @param {import('./context').BehaviorContext} ctx
 */
function initProductsCarousel(ctx) {
  const { root, on, cleanups } = ctx;
  const productsHead = root.getElementById('productsHead');
  const productsSection = root.getElementById('productsSection');
  let productsInView = true;
  let restartProductsAutoplay = null;
  if (productsSection && 'IntersectionObserver' in window) {
    const productsInViewObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          productsSection.classList.toggle('is-in-view', e.isIntersecting);
          productsInView = e.isIntersecting;
          if (productsInView && restartProductsAutoplay) restartProductsAutoplay();
        });
      },
      { rootMargin: '200px 0px' },
    );
    productsInViewObs.observe(productsSection);
    cleanups.push(() => productsInViewObs.disconnect());
  }
  const viewport = root.getElementById('carouselViewport');
  const track = root.getElementById('carouselTrack');
  const cards = track ? Array.from(track.children) : [];
  const categoryNav = root.getElementById('productsCategoryNav');
  const categoryPills = categoryNav
    ? Array.from(categoryNav.querySelectorAll('.products-category-pill'))
    : [];
  const setProductsCategory = (line) => {
    if (!track) return;
    if (!line || line === 'all') track.removeAttribute('data-active-line');
    else track.setAttribute('data-active-line', line);
    categoryPills.forEach((p) => {
      const active = p.getAttribute('data-category') === line;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };
  ctx.setProductsCategory = setProductsCategory;

  categoryPills.forEach((p) => {
    on(p, 'click', () => setProductsCategory(p.getAttribute('data-category')));
  });
  const uniqueCards = cards.slice(0, 6);
  if ('IntersectionObserver' in window) {
    const headObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            uniqueCards.forEach((c, i) => {
              c.style.transitionDelay = i * 80 + 'ms';
              c.classList.add('is-visible');
            });
            headObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    if (productsHead) headObs.observe(productsHead);
    cleanups.push(() => headObs.disconnect());
    cards.forEach((c) => {
      if (!uniqueCards.includes(c)) c.classList.add('is-visible');
    });
  } else {
    if (productsHead) productsHead.classList.add('is-visible');
    cards.forEach((c) => c.classList.add('is-visible'));
  }
  if (viewport && track && cards.length >= 10) {
    const uniqueCount = 5;
    let singleSetWidth = 0;
    let posX = 0;
    let dragging = false;
    let startPointerX = 0;
    let startPosX = 0;
    let lastMoveX = 0;
    let lastMoveT = 0;
    let velocity = 0;
    let momentumId = null;
    let activePointerId = null;
    let movedPastThreshold = false;
    const hoverCapableMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    let hovered = false;
    let autoplaySuspended = false;
    let resumeTimeoutId = null;
    let autoplayId = null;
    let autoplayLastT = null;
    let currentSpeed = 0;
    let autoplayPxPerSec = 0;
    const wrap = (x) => {
      if (singleSetWidth <= 0) return 0;
      let r = x % singleSetWidth;
      if (r > 0) r -= singleSetWidth;
      return r;
    };
    const measure = () => {
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      let w = 0;
      for (let i = 0; i < uniqueCount; i++) w += cards[i].getBoundingClientRect().width + gap;
      singleSetWidth = w;
      const avgCardWidth = w / uniqueCount;
      const secondsPerCard = window.innerWidth <= 767 ? 13 : window.innerWidth <= 1024 ? 9.5 : 8;
      // +20% de velocidade sobre o tempo por card definido acima.
      autoplayPxPerSec = avgCardWidth > 0 ? (avgCardWidth / secondsPerCard) * 1.2 : 0;
    };
    const applyTransform = () => {
      track.style.transform = `translate3d(${posX}px,0,0)`;
    };
    const stopMomentum = () => {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    };
    const momentumStep = () => {
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.02) {
        momentumId = null;
        return;
      }
      posX = wrap(posX + velocity * 16);
      applyTransform();
      momentumId = requestAnimationFrame(momentumStep);
    };
    let pointerDownTarget = null;
    const onPointerDown = (e) => {
      if (e.button !== void 0 && e.button !== 0) return;
      dragging = true;
      movedPastThreshold = false;
      pointerDownTarget = e.target;
      stopMomentum();
      startPointerX = e.clientX;
      startPosX = posX;
      lastMoveX = e.clientX;
      lastMoveT = performance.now();
      velocity = 0;
      viewport.classList.add('is-dragging');
      activePointerId = e.pointerId;
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch {
        /* ignora */
      }
    };
    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== activePointerId) return;
      const now = performance.now();
      const dx = e.clientX - startPointerX;
      if (Math.abs(dx) > 4) movedPastThreshold = true;
      posX = wrap(startPosX + dx);
      applyTransform();
      const dt = now - lastMoveT;
      if (dt > 0) velocity = (e.clientX - lastMoveX) / dt;
      lastMoveX = e.clientX;
      lastMoveT = now;
    };
    let selectedCard = null;
    let selectionActive = false;
    const clearSelection2 = () => {
      if (!selectedCard) return;
      selectedCard.classList.remove('is-selected');
      track.classList.remove('has-selection');
      selectedCard = null;
      selectionActive = false;
    };
    const selectCard = (card) => {
      if (selectedCard === card) {
        clearSelection2();
        return;
      }
      if (selectedCard) selectedCard.classList.remove('is-selected');
      selectedCard = card;
      selectionActive = true;
      card.classList.add('is-selected');
      track.classList.add('has-selection');
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      if (activePointerId != null) {
        try {
          viewport.releasePointerCapture(activePointerId);
        } catch {
          /* ignora */
        }
        activePointerId = null;
      }
      if (!movedPastThreshold && pointerDownTarget) {
        if (!pointerDownTarget.closest('.p-card-cta')) {
          const card = pointerDownTarget.closest('.p-card');
          if (card) selectCard(card);
        }
      }
      pointerDownTarget = null;
      if (!ctx.reduceMotion && Math.abs(velocity) > 0.02) {
        momentumId = requestAnimationFrame(momentumStep);
      }
      autoplaySuspended = true;
      if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
      resumeTimeoutId = setTimeout(() => {
        resumeTimeoutId = null;
        autoplaySuspended = false;
      }, 850);
    };
    const onClickCapture = (e) => {
      if (movedPastThreshold) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    on(document, 'pointerdown', (e) => {
      if (selectedCard && !viewport.contains(e.target)) clearSelection2();
    });
    on(window, 'keydown', (e) => {
      if (e.key === 'Escape') clearSelection2();
    });
    cleanups.push(() => clearSelection2());
    const autoplayTick = (t) => {
      if (autoplayLastT == null) {
        autoplayLastT = t;
        autoplayId = requestAnimationFrame(autoplayTick);
        return;
      }
      const dt = Math.min(0.05, (t - autoplayLastT) / 1e3);
      autoplayLastT = t;
      const hoverPausing = hoverCapableMQ.matches && hovered;
      const targetSpeed =
        ctx.reduceMotion ||
        dragging ||
        autoplaySuspended ||
        hoverPausing ||
        selectionActive ||
        !productsInView
          ? 0
          : autoplayPxPerSec;
      const ease = 1 - Math.exp(-dt / 0.35);
      currentSpeed += (targetSpeed - currentSpeed) * ease;
      if (!dragging && Math.abs(currentSpeed) > 0.01) {
        posX = wrap(posX - currentSpeed * dt);
        applyTransform();
      }
      if (!productsInView && !dragging && Math.abs(currentSpeed) < 0.01) {
        autoplayId = null;
        autoplayLastT = null;
        return;
      }
      autoplayId = requestAnimationFrame(autoplayTick);
    };
    restartProductsAutoplay = () => {
      if (autoplayId == null) autoplayId = requestAnimationFrame(autoplayTick);
    };
    measure();
    posX = wrap(0);
    applyTransform();
    on(viewport, 'pointerdown', onPointerDown);
    on(window, 'pointermove', onPointerMove, { passive: true });
    on(window, 'pointerup', endDrag);
    on(window, 'pointercancel', endDrag);
    on(viewport, 'dragstart', (e) => e.preventDefault());
    on(viewport, 'click', onClickCapture, true);
    on(viewport, 'mouseenter', () => {
      hovered = true;
    });
    on(viewport, 'mouseleave', () => {
      hovered = false;
    });
    let resizeT = null;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        measure();
        posX = wrap(posX);
        applyTransform();
      }, 150);
    };
    on(window, 'resize', onResize);
    cleanups.push(() => {
      clearTimeout(resizeT);
      stopMomentum();
      if (autoplayId) cancelAnimationFrame(autoplayId);
      if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
      restartProductsAutoplay = null;
    });
    autoplayId = requestAnimationFrame(autoplayTick);
  }
}
export { initProductsCarousel };
