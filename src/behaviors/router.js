import { trackEvent } from '../lib/analytics';
import { CAMPAIGN_BANNERS } from '../data/campaigns';
import { SECTOR_PAGES } from '../data/sectors';

/**
 * Roteador por hash (#/baterias, #/baterias/:slug, #/setores, #/setores/:slug): alterna as views e preenche o conteúdo das páginas internas.
 * @param {import('./context').BehaviorContext} ctx
 */
function initRouter(ctx) {
  const { root, on } = ctx;
  (() => {
    const homeView = root.getElementById('homeView');
    const bateriasView = root.getElementById('bateriasView');
    const bateriaView = root.getElementById('bateriaView');
    const setoresView = root.getElementById('setoresView');
    const setorView = root.getElementById('setorView');
    if (!homeView || !bateriasView || !bateriaView || !setoresView || !setorView) return;
    const pageBody = root.body || document.body;
    const fixStretchProAccent = (str) =>
      String(str).replace(/[ÁáÚú]/g, (c) => '<span class="accent-fix">' + c + '</span>');
    const APP_LABELS = { automotivo: 'Automotivo', solar: 'Solar', nautico: 'N\xE1utico' };
    const APP_CONTEXT = {
      automotivo: {
        title: 'Energia para projetos automotivos que exigem mais.',
        text: 'Uma solu\xE7\xE3o de l\xEDtio para sistemas automotivos que precisam de alta capacidade, estabilidade e autonomia.',
      },
      solar: {
        title: 'Armazene energia para usar quando precisar.',
        text: 'Solu\xE7\xF5es LiFePO4 desenvolvidas para integrar sistemas de armazenamento de energia com estabilidade, gerenciamento e longa vida \xFAtil.',
      },
      nautico: {
        title: 'Energia preparada para ir a bordo.',
        text: 'Solu\xE7\xF5es desenvolvidas para oferecer autonomia e confiabilidade em aplica\xE7\xF5es n\xE1uticas.',
      },
    };
    const BATTERY_PLACEHOLDER_SVG =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"></rect><rect x="19" y="10.5" width="2.4" height="5" rx="1" fill="currentColor"></rect><path d="M8 12h2l1.2-2 1.6 4 1.2-2h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const BATTERY_CATALOG = [
      // Removidos nesta rodada (pedido explícito, "estão repetidos e sem
      // foto"): 'elitio-12v-100ah' (E-Lítio 12V 100Ah -- sobreposto pelo
      // "Pro 12V 100Ah" logo abaixo, que tem foto real confirmada),
      // 'elitio-pro-48v-50ah' (E-Lítio Pro 48V 50Ah) e
      // 'elitio-pro-solar-48v-50ah-rack' (E-Lítio Pro Solar 48V 50Ah
      // Rack) -- nenhum dos dois tinha foto confirmada nem estava ligado
      // a nenhuma combinação de voltagem/capacidade exclusiva no
      // catálogo. Todo o catálogo agora tem foto real em 100% dos itens.
      {
        id: 'elitio-pro-12v-100ah',
        slug: 'e-litio-pro-12v-100ah',
        name: 'E-L\xEDtio Pro 12V 100Ah',
        voltage: '12V',
        capacity: '100Ah',
        technology: 'LiFePO4',
        sectors: ['solar'],
        features: ['BMS', 'Bluetooth'],
        shortDescription: 'Armazenamento inteligente de energia para sistemas solares.',
        // Foto real confirmada (mesma pasta do Drive JFA, etiqueta impressa
        // "e-LÍTIO PRO -- BATERIA DE LÍTIO 12,8V 100A") -- bate exatamente
        // com este item (único "Pro" 12V/100Ah do catálogo).
        image: '/images/bateria_elitio_pro_12v8_100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      {
        id: 'elitio-pro-solar-48v-100ah-rack',
        slug: 'e-litio-pro-solar-48v-100ah-rack',
        name: 'E-L\xEDtio Pro Solar 48V 100Ah Rack',
        voltage: '48V',
        capacity: '100Ah',
        technology: 'LiFePO4',
        sectors: ['solar'],
        features: ['Rack'],
        shortDescription: 'Mais capacidade para projetos solares que exigem maior autonomia.',
        // Foto real (pasta "Bateria de Lítio/48V 100A" do Drive JFA) --
        // único produto do catálogo com essa combinação exata de
        // tensão+capacidade (48V/100Ah), e a peça no rack visível na
        // foto bate com o "Rack" do nome -- por isso é o único item
        // com `image` até agora; os outros 5 seguem no ícone-placeholder
        // (nenhuma foto real confirmada pra eles ainda).
        image: '/images/bateria_elitio_pro_48v100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      {
        id: 'elitio-nautica-12-8v-100ah',
        slug: 'e-litio-nautica-12-8v-100ah',
        name: 'E-L\xEDtio N\xE1utica 12,8V 100Ah',
        voltage: '12,8V',
        capacity: '100Ah',
        technology: 'LiFePO4',
        sectors: ['nautico'],
        features: [],
        shortDescription: 'Energia e autonomia para aplica\xE7\xF5es em embarca\xE7\xF5es.',
        // Foto real confirmada (etiqueta impressa "e-LÍTIO NÁUTICA --
        // BATERIA DE LÍTIO 12,8V 100A") -- bate exatamente com este item.
        image: '/images/bateria_elitio_nautica_12v8_100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      // Rodada "FOTOS REAIS DO DRIVE" -- 4 produtos novos abaixo, cada um
      // confirmado por foto real com etiqueta impressa (tensão/capacidade/
      // tecnologia lidas diretamente do rótulo do produto, nunca
      // inventadas) que não correspondia a nenhum item já existente no
      // catálogo. Copy/setor seguem o mesmo padrão de frase curta e
      // factual dos itens vizinhos de mesma linha (Pro/Náutica) -- sinalizar
      // ao usuário pra revisão, já que setor/features exigem algum
      // julgamento (não vêm literalmente escritos na etiqueta).
      {
        id: 'elitio-pro-12-8v-50ah',
        slug: 'e-litio-pro-12-8v-50ah',
        name: 'E-L\xEDtio Pro 12,8V 50Ah',
        voltage: '12,8V',
        capacity: '50Ah',
        technology: 'LiFePO4',
        sectors: ['solar'],
        features: ['BMS'],
        shortDescription:
          'Uma solu\xE7\xE3o compacta de 12,8V para sistemas que precisam de energia est\xE1vel e monitorada.',
        image: '/images/bateria_elitio_pro_12v8_50a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      {
        id: 'elitio-pro-25-6v-50ah',
        slug: 'e-litio-pro-25-6v-50ah',
        name: 'E-L\xEDtio Pro 25,6V 50Ah',
        voltage: '25,6V',
        capacity: '50Ah',
        technology: 'LiFePO4',
        sectors: ['solar'],
        features: ['BMS'],
        shortDescription:
          'Uma solu\xE7\xE3o de 25,6V para sistemas que precisam de energia est\xE1vel e monitorada.',
        image: '/images/bateria_elitio_pro_25v6_50a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      {
        id: 'elitio-pro-25-6v-100ah',
        slug: 'e-litio-pro-25-6v-100ah',
        name: 'E-L\xEDtio Pro 25,6V 100Ah',
        voltage: '25,6V',
        capacity: '100Ah',
        technology: 'LiFePO4',
        sectors: ['solar'],
        features: ['BMS'],
        shortDescription: 'Mais capacidade para projetos solares que exigem maior autonomia.',
        image: '/images/bateria_elitio_pro_25v6_100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
      {
        id: 'elitio-nautica-25-6v-100ah',
        slug: 'e-litio-nautica-25-6v-100ah',
        name: 'E-L\xEDtio N\xE1utica 25,6V 100Ah',
        voltage: '25,6V',
        capacity: '100Ah',
        technology: 'LiFePO4',
        sectors: ['nautico'],
        features: [],
        shortDescription: 'Mais energia e autonomia para embarca\xE7\xF5es que exigem maior capacidade.',
        image: '/images/bateria_elitio_nautica_25v6_100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
    ];
    const BATTERY_SECTORS = Array.from(new Set(BATTERY_CATALOG.flatMap((b) => b.sectors)));
    const bySlug = (slug) => BATTERY_CATALOG.find((b) => b.slug === slug);
    const bateriasNav = root.getElementById('bateriasSectorNav');
    const bateriasGrid = root.getElementById('bateriasGrid');
    let bateriasBuilt = false;
    const buildBateriaCard = (b) => {
      const a = document.createElement('a');
      a.className = 'catalog-card';
      a.href = '#/baterias/' + b.slug;
      a.dataset.sectors = b.sectors.join(',');
      const media = document.createElement('span');
      media.className = 'catalog-card-media';
      if (b.image) {
        const img = document.createElement('img');
        img.src = b.image;
        img.alt = b.name;
        img.loading = 'lazy';
        img.decoding = 'async';
        media.appendChild(img);
      } else {
        media.innerHTML = BATTERY_PLACEHOLDER_SVG;
      }
      a.appendChild(media);
      const name = document.createElement('h3');
      name.className = 'catalog-card-name';
      name.textContent = b.name;
      a.appendChild(name);
      const meta = document.createElement('p');
      meta.className = 'catalog-card-meta';
      meta.textContent = [b.voltage, b.capacity, b.technology].filter(Boolean).join(' \xB7 ');
      a.appendChild(meta);
      const lines = document.createElement('p');
      lines.className = 'catalog-card-lines';
      lines.textContent = b.sectors.map((s) => APP_LABELS[s] || s).join(' \xB7 ');
      a.appendChild(lines);
      const desc = document.createElement('p');
      desc.className = 'catalog-card-desc';
      desc.textContent = b.shortDescription;
      a.appendChild(desc);
      const cta = document.createElement('span');
      cta.className = 'catalog-card-cta';
      cta.innerHTML =
        'Conhecer bateria <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      a.appendChild(cta);
      on(a, 'click', () => trackEvent('battery_card_click', { battery_id: b.id, sectors: b.sectors }));
      return a;
    };
    const filterBaterias = (sector) => {
      Array.from(bateriasGrid.children).forEach((card) => {
        const show = sector === 'all' || (card.dataset.sectors || '').split(',').includes(sector);
        if (show) {
          card.hidden = false;
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.hidden = true;
          }, 350);
        }
      });
    };
    const initBateriasBanner = () => {
      const viewport = root.getElementById('bateriasBannerViewport');
      const track = root.getElementById('bateriasBannerTrack');
      const prevBtn = root.getElementById('bateriasBannerPrev');
      const nextBtn = root.getElementById('bateriasBannerNext');
      if (!viewport || !track || !CAMPAIGN_BANNERS.length) return;
      const N = CAMPAIGN_BANNERS.length;
      let idx = 0;
      CAMPAIGN_BANNERS.forEach((banner, i) => {
        const a = document.createElement('a');
        a.className = 'campaign-slide';
        a.href = banner.href;
        a.draggable = false;
        a.setAttribute('aria-label', banner.ariaLabel || banner.name || banner.alt);
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
        img.alt = banner.alt || '';
        img.src = banner.desktopImage;
        if (sourceEl) sourceEl.srcset = banner.mobileImage;
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.fetchPriority = i === 0 ? 'high' : 'auto';
        img.decoding = 'async';
        img.draggable = false;
        if (banner.focalPoint) img.style.objectPosition = banner.focalPoint;
        picture.appendChild(img);
        media.appendChild(picture);
        a.appendChild(media);
        on(a, 'click', (e) => {
          if (i !== idx) e.preventDefault();
          trackEvent('campaign_banner_click', {
            campaign_id: banner.id,
            campaign_name: banner.name || banner.id,
            campaign_position: i + 1,
            destination: banner.href,
            source: 'baterias_banner',
          });
        });
        track.appendChild(a);
      });
      const slideEls = Array.from(track.children);
      if (N < 2) {
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
      }
      const render = () => {
        track.style.transform = 'translate3d(' + -idx * 100 + '%,0,0)';
        slideEls.forEach((el, i) => {
          el.classList.toggle('is-active', i === idx);
          el.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
          el.tabIndex = i === idx ? 0 : -1;
        });
      };
      const goTo = (i) => {
        idx = (i + N) % N;
        render();
      };
      const next = () => goTo(idx + 1);
      const prev = () => goTo(idx - 1);
      if (prevBtn) on(prevBtn, 'click', prev);
      if (nextBtn) on(nextBtn, 'click', next);
      render();
      if (N > 1 && !ctx.reduceMotion) {
        let timerId = null;
        let hovering = false;
        const AUTOPLAY_MS = 6e3;
        const start = () => {
          if (!timerId)
            timerId = setInterval(() => {
              if (!hovering) next();
            }, AUTOPLAY_MS);
        };
        const stop = () => {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        };
        on(viewport, 'pointerenter', () => {
          hovering = true;
        });
        on(viewport, 'pointerleave', () => {
          hovering = false;
        });
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) start();
              else stop();
            });
          },
          { threshold: 0.2 },
        );
        io.observe(viewport);
      }
      let startX = 0,
        dragging = false;
      on(track, 'pointerdown', (e) => {
        dragging = true;
        startX = e.clientX;
      });
      on(track, 'pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) next();
          else prev();
        }
      });
    };
    const buildBateriasView = () => {
      if (bateriasBuilt) return;
      bateriasBuilt = true;
      initBateriasBanner();
      const allPill = document.createElement('button');
      allPill.type = 'button';
      allPill.className = 'products-category-pill is-active';
      allPill.dataset.sector = 'all';
      allPill.setAttribute('aria-pressed', 'true');
      allPill.textContent = 'Todas';
      bateriasNav.appendChild(allPill);
      BATTERY_SECTORS.forEach((s) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'products-category-pill';
        pill.dataset.sector = s;
        pill.setAttribute('aria-pressed', 'false');
        pill.textContent = APP_LABELS[s] || s;
        bateriasNav.appendChild(pill);
      });
      on(bateriasNav, 'click', (e) => {
        const pill = e.target.closest('.products-category-pill');
        if (!pill) return;
        Array.from(bateriasNav.children).forEach((p) => {
          p.classList.toggle('is-active', p === pill);
          p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
        });
        filterBaterias(pill.dataset.sector);
      });
      BATTERY_CATALOG.forEach((b) => bateriasGrid.appendChild(buildBateriaCard(b)));
    };
    const bateriaHeroMedia = root.getElementById('bateriaHeroMedia');
    const bateriaEyebrow = root.getElementById('bateriaEyebrow');
    const bateriaTitle = root.getElementById('bateriaTitle');
    const bateriaSub = root.getElementById('bateriaSub');
    const bateriaHeroSpecs = root.getElementById('bateriaHeroSpecs');
    const bateriaAppNav = root.getElementById('bateriaAppNav');
    const bateriaContextTitle = root.getElementById('bateriaContextTitle');
    const bateriaContextText = root.getElementById('bateriaContextText');
    const bateriaBenefitsSection = root.getElementById('bateriaBenefitsSection');
    const bateriaFeatures = root.getElementById('bateriaFeatures');
    const bateriaSpecsList = root.getElementById('bateriaSpecsList');
    const bateriaRelatedSection = root.getElementById('bateriaRelatedSection');
    const bateriaRelatedGrid = root.getElementById('bateriaRelatedGrid');
    const bateriaManualsSection = root.getElementById('bateriaManualsSection');
    const bateriaDocLinks = root.getElementById('bateriaDocLinks');
    const bateriaBuyBox = root.getElementById('bateriaBuyBox');
    const bateriaSupportCta = root.getElementById('bateriaSupportCta');
    const bateriaOthersGrid = root.getElementById('bateriaOthersGrid');
    const bateriaBreadcrumbCurrent = root.getElementById('bateriaBreadcrumbCurrent');
    const setBateriaContext = (sector) => {
      const ctx2 = APP_CONTEXT[sector];
      if (!ctx2) return;
      bateriaContextTitle.textContent = ctx2.title;
      bateriaContextText.textContent = ctx2.text;
    };
    let bateriaCarouselCleanup = null;
    const buildBateriaHeroCarousel = (photos, altBase) => {
      bateriaHeroMedia.innerHTML = '';
      bateriaHeroMedia.classList.toggle('has-carousel', photos.length > 1);
      if (photos.length <= 1) {
        const img = document.createElement('img');
        img.src = photos[0];
        img.alt = altBase;
        img.decoding = 'async';
        bateriaHeroMedia.appendChild(img);
        return null;
      }
      const wrap = document.createElement('div');
      wrap.className = 'bateria-photo-carousel';
      const track = document.createElement('div');
      track.className = 'bateria-photo-track';
      photos.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'bateria-photo-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = altBase + ' -- foto ' + (i + 1) + ' de ' + photos.length;
        img.decoding = 'async';
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);
      });
      wrap.appendChild(track);
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'bateria-photo-arrow bateria-photo-arrow-prev';
      prevBtn.setAttribute('aria-label', 'Foto anterior');
      prevBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 4l-8 8 8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'bateria-photo-arrow bateria-photo-arrow-next';
      nextBtn.setAttribute('aria-label', 'Pr\xF3xima foto');
      nextBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4l8 8-8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      wrap.appendChild(prevBtn);
      wrap.appendChild(nextBtn);
      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'bateria-photo-dots';
      dotsWrap.setAttribute('role', 'tablist');
      dotsWrap.setAttribute('aria-label', 'Selecionar foto');
      const dots = photos.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'bateria-photo-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
        dotsWrap.appendChild(dot);
        return dot;
      });
      wrap.appendChild(dotsWrap);
      bateriaHeroMedia.appendChild(wrap);
      const N = photos.length;
      let idx = 0;
      const localCleanups = [];
      const lon = (el, ev, fn, opts) => {
        el.addEventListener(ev, fn, opts);
        localCleanups.push(() => el.removeEventListener(ev, fn, opts));
      };
      const render = () => {
        track.style.transform = 'translate3d(' + -idx * 100 + '%,0,0)';
        dots.forEach((d, i) => {
          d.classList.toggle('is-active', i === idx);
          d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
      };
      const goTo = (i) => {
        idx = (i + N) % N;
        render();
      };
      const next = () => goTo(idx + 1);
      const prev = () => goTo(idx - 1);
      lon(prevBtn, 'click', prev);
      lon(nextBtn, 'click', next);
      dots.forEach((d, i) => lon(d, 'click', () => goTo(i)));
      render();
      let timerId = null;
      let hovering = false;
      const AUTOPLAY_MS = 3800;
      const start = () => {
        if (!timerId && !ctx.reduceMotion)
          timerId = setInterval(() => {
            if (!hovering) next();
          }, AUTOPLAY_MS);
      };
      const stop = () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
      };
      lon(wrap, 'pointerenter', () => {
        hovering = true;
      });
      lon(wrap, 'pointerleave', () => {
        hovering = false;
      });
      let io = null;
      if (!ctx.reduceMotion) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) start();
              else stop();
            });
          },
          { threshold: 0.2 },
        );
        io.observe(wrap);
      }
      let startX = 0,
        dragging = false;
      lon(track, 'pointerdown', (e) => {
        dragging = true;
        startX = e.clientX;
      });
      lon(track, 'pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) next();
          else prev();
        }
      });
      return () => {
        stop();
        if (io) io.disconnect();
        localCleanups.forEach((fn) => fn());
      };
    };
    on(bateriaAppNav, 'click', (e) => {
      const pill = e.target.closest('.products-category-pill');
      if (!pill) return;
      Array.from(bateriaAppNav.children).forEach((p) => {
        p.classList.toggle('is-active', p === pill);
        p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
      });
      setBateriaContext(pill.dataset.sector);
    });
    const renderBateriaView = (slug) => {
      const b = bySlug(slug);
      if (!b) {
        location.hash = '#/baterias';
        return;
      }
      if (bateriaCarouselCleanup) {
        bateriaCarouselCleanup();
        bateriaCarouselCleanup = null;
      }
      const bateriaPhotos = b.images && b.images.length ? b.images : b.image ? [b.image] : [];
      if (bateriaPhotos.length) {
        bateriaCarouselCleanup = buildBateriaHeroCarousel(bateriaPhotos, b.name);
      } else {
        bateriaHeroMedia.classList.remove('has-carousel');
        bateriaHeroMedia.innerHTML = BATTERY_PLACEHOLDER_SVG;
      }
      bateriaEyebrow.textContent = 'Baterias JFA';
      bateriaTitle.innerHTML = fixStretchProAccent(b.name);
      bateriaSub.textContent = b.shortDescription;
      bateriaBreadcrumbCurrent.textContent = b.name;
      bateriaHeroSpecs.innerHTML = '';
      [b.voltage, b.capacity, b.technology].filter(Boolean).forEach((v) => {
        const chip = document.createElement('span');
        chip.className = 'bateria-spec-chip';
        chip.textContent = v;
        bateriaHeroSpecs.appendChild(chip);
      });
      bateriaAppNav.innerHTML = '';
      b.sectors.forEach((s, i) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'products-category-pill' + (i === 0 ? ' is-active' : '');
        pill.dataset.sector = s;
        pill.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        pill.textContent = APP_LABELS[s] || s;
        bateriaAppNav.appendChild(pill);
      });
      setBateriaContext(b.sectors[0]);
      bateriaFeatures.innerHTML = '';
      bateriaBenefitsSection.hidden = !b.features.length;
      b.features.forEach((f) => {
        const chip = document.createElement('span');
        chip.className = 'bateria-chip';
        chip.textContent = f;
        bateriaFeatures.appendChild(chip);
      });
      bateriaSpecsList.innerHTML = '';
      [
        ['Tens\xE3o', b.voltage],
        ['Capacidade', b.capacity],
        ['Tecnologia', b.technology],
      ]
        .filter(([, v]) => v)
        .forEach(([label, value]) => {
          const wrap = document.createElement('div');
          wrap.innerHTML = '<dt>' + label + '</dt><dd>' + value + '</dd>';
          bateriaSpecsList.appendChild(wrap);
        });
      bateriaRelatedGrid.innerHTML = '';
      const related = (b.relatedProducts || []).map(bySlug).filter(Boolean).slice(0, 3);
      bateriaRelatedSection.hidden = !related.length;
      related.forEach((r) => bateriaRelatedGrid.appendChild(buildBateriaCard(r)));
      bateriaDocLinks.innerHTML = '';
      bateriaManualsSection.hidden = !b.manualUrl;
      if (b.manualUrl) {
        const link = document.createElement('a');
        link.className = 'bateria-doc-link';
        link.href = b.manualUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML =
          '<span>Baixar manual t\xE9cnico</span><svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        on(link, 'click', () => trackEvent('battery_manual_click', { battery_id: b.id }));
        bateriaDocLinks.appendChild(link);
      }
      const commerce = b.commerce || {};
      bateriaBuyBox.innerHTML = '';
      if (commerce.availableOnline) {
        const p = document.createElement('p');
        p.textContent = 'Dispon\xEDvel na Loja Oficial JFA.';
        bateriaBuyBox.appendChild(p);
        const priceRow = document.createElement('div');
        priceRow.className = 'bateria-buy-price-row';
        if (commerce.oldPrice) {
          const old = document.createElement('span');
          old.className = 'bateria-buy-price-old';
          old.textContent = commerce.oldPrice;
          priceRow.appendChild(old);
        }
        if (commerce.price) {
          const price = document.createElement('span');
          price.className = 'bateria-buy-price';
          price.textContent = commerce.price;
          priceRow.appendChild(price);
        }
        if (commerce.pixPrice) {
          const pix = document.createElement('span');
          pix.className = 'bateria-buy-price-pix';
          pix.textContent = commerce.pixPrice + ' no Pix';
          priceRow.appendChild(pix);
        }
        if (priceRow.children.length) bateriaBuyBox.appendChild(priceRow);
        const actions = document.createElement('div');
        actions.className = 'bateria-buy-actions';
        if (commerce.storeUrl) {
          const a1 = document.createElement('a');
          a1.className = 'hero-cta';
          a1.href = commerce.storeUrl;
          a1.target = '_blank';
          a1.rel = 'noopener noreferrer';
          a1.textContent = 'Comprar agora';
          actions.appendChild(a1);
        }
        if (commerce.mercadoLivreUrl) {
          const a2 = document.createElement('a');
          a2.className = 'hero-cta hero-cta-tertiary';
          a2.href = commerce.mercadoLivreUrl;
          a2.target = '_blank';
          a2.rel = 'noopener noreferrer';
          a2.textContent = 'Comprar no Mercado Livre';
          actions.appendChild(a2);
        }
        bateriaBuyBox.appendChild(actions);
      } else {
        const p = document.createElement('p');
        p.textContent = 'Consulte disponibilidade com um representante JFA.';
        bateriaBuyBox.appendChild(p);
        const rep = document.createElement('a');
        rep.className = 'hero-cta';
        rep.href = '#representantes';
        rep.setAttribute('data-header-scroll', 'representantes');
        rep.textContent = 'Encontrar representante';
        bateriaBuyBox.appendChild(rep);
      }
      bateriaSupportCta.href =
        'https://api.whatsapp.com/send?phone=' +
        WHATSAPP_PHONE +
        '&text=' +
        encodeURIComponent('Ol\xE1, quero saber mais sobre a ' + b.name + '!');
      bateriaSupportCta.onclick = () =>
        trackEvent('whatsapp_click', { source: 'bateria_page', battery_id: b.id });
      bateriaOthersGrid.innerHTML = '';
      BATTERY_CATALOG.filter((x) => x.id !== b.id)
        .slice(0, 3)
        .forEach((x) => bateriaOthersGrid.appendChild(buildBateriaCard(x)));
      trackEvent('battery_page_view', { battery_id: b.id, sectors: b.sectors });
    };
    const setoresGrid = root.getElementById('setoresGrid');
    let setoresBuilt = false;
    const buildSetoresView = () => {
      if (setoresBuilt) return;
      setoresBuilt = true;
      SECTOR_PAGES.forEach((s) => {
        const a = document.createElement('a');
        a.className = 'catalog-card';
        a.href = '#/setores/' + s.slug;
        const name = document.createElement('h3');
        name.className = 'catalog-card-name';
        name.textContent = s.title;
        a.appendChild(name);
        const lines = document.createElement('p');
        lines.className = 'catalog-card-lines';
        lines.textContent = s.sub;
        a.appendChild(lines);
        const cta = document.createElement('span');
        cta.className = 'catalog-card-cta';
        cta.innerHTML =
          'Ver setor <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        a.appendChild(cta);
        setoresGrid.appendChild(a);
      });
    };
    const WHATSAPP_PHONE = '553125336100';
    const renderSetorView = (slug) => {
      const s = SECTOR_PAGES.find((x) => x.slug === slug);
      if (!s) {
        location.hash = '#/setores';
        return;
      }
      root.getElementById('setorEyebrow').textContent = 'Setores \xB7 ' + s.title;
      root.getElementById('setorTitle').innerHTML = s.headline;
      root.getElementById('setorSub').textContent = s.sub;
      root.getElementById('setorIntro').textContent = s.intro;
      const cta = root.getElementById('setorContactCta');
      cta.href =
        'https://api.whatsapp.com/send?phone=' +
        WHATSAPP_PHONE +
        '&text=' +
        encodeURIComponent(s.whatsappText);
      cta.onclick = () => trackEvent('whatsapp_click', { source: 'setor_page', sector: slug });
      trackEvent('sector_page_view', { sector: slug });
    };
    const showView = (name) => {
      homeView.hidden = name !== 'home';
      bateriasView.hidden = name !== 'baterias';
      bateriaView.hidden = name !== 'bateria';
      setoresView.hidden = name !== 'setores';
      setorView.hidden = name !== 'setor';
      pageBody.classList.toggle('is-page-view', name !== 'home');
      if (name !== 'home') window.scrollTo(0, 0);
    };
    const applyRoute = () => {
      const hash = location.hash || '';
      if (!hash.startsWith('#/')) {
        const target = hash.length > 1 ? root.getElementById(hash.slice(1)) : null;
        const activeView = target && target.closest('.page-view:not([hidden])');
        if (activeView && activeView.id !== 'homeView') return;
        showView('home');
        return;
      }
      const parts = hash.slice(2).split('/').filter(Boolean);
      if (parts[0] === 'baterias' && parts[1]) {
        renderBateriaView(parts[1]);
        showView('bateria');
      } else if (parts[0] === 'baterias') {
        buildBateriasView();
        showView('baterias');
        trackEvent('page_view', { view: 'baterias' });
      } else if (parts[0] === 'setores' && parts[1]) {
        renderSetorView(parts[1]);
        showView('setor');
      } else if (parts[0] === 'setores') {
        buildSetoresView();
        showView('setores');
        trackEvent('page_view', { view: 'setores' });
      } else {
        showView('home');
      }
    };
    on(window, 'hashchange', applyRoute);
    applyRoute();
    document.addEventListener(
      'click',
      (e) => {
        if (!pageBody.classList.contains('is-page-view')) return;
        const trigger = e.target.closest(
          'a[href^="#"]:not([href^="#/"]):not([data-page-anchor]), [data-header-scroll], [data-goto-products-category], [data-goto-manuals-tab], [data-header-goto], [data-header-goto-buy], [data-footer-goto], #navHome',
        );
        if (trigger) showView('home');
      },
      true,
    );
  })();
}
export { initRouter };
