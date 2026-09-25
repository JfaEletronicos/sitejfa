import { trackEvent } from '../lib/analytics';
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
        title: 'Mais energia para projetos que exigem desempenho.',
        text: 'Alta capacidade de armazenamento para projetos automotivos compat\xEDveis que precisam de estabilidade e autonomia.',
      },
      solar: {
        title: 'Armazene energia para usar quando precisar.',
        text: 'Uma solu\xE7\xE3o desenvolvida para integrar sistemas de armazenamento de energia, ajudando a manter energia dispon\xEDvel com gerenciamento inteligente e alta capacidade.',
      },
      nautico: {
        title: 'Energia preparada para ir a bordo.',
        text: 'Uma solu\xE7\xE3o desenvolvida para aplica\xE7\xF5es n\xE1uticas compat\xEDveis que precisam de autonomia, estabilidade e confiabilidade.',
      },
    };
    const BATTERY_PLACEHOLDER_SVG =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"></rect><rect x="19" y="10.5" width="2.4" height="5" rx="1" fill="currentColor"></rect><path d="M8 12h2l1.2-2 1.6 4 1.2-2h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const TECH_BENEFITS = {
      lifepo4: {
        title: 'Tecnologia LiFePO\u2084',
        text: 'Uma tecnologia desenvolvida para sistemas que precisam combinar armazenamento de energia, estabilidade e longa vida \xFAtil.',
        icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"></rect><rect x="19" y="10.5" width="2.4" height="5" rx="1" fill="currentColor"></rect><path d="M8 12h2l1.2-2 1.6 4 1.2-2h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      },
      bms: {
        title: 'BMS integrado',
        text: 'O gerenciamento eletr\xF4nico acompanha o funcionamento da bateria e atua na prote\xE7\xE3o dos principais par\xE2metros de opera\xE7\xE3o.',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v5c0 4.6 3.2 7.9 8 9 4.8-1.1 8-4.4 8-9V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      },
      bluetooth: {
        title: 'Conectividade Bluetooth',
        text: 'Mais praticidade para acompanhar informa\xE7\xF5es da bateria em dispositivos compat\xEDveis.',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10-5 5V2l5 5L7 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      },
      rack: {
        title: 'Formato em rack',
        text: 'Um formato pensado para integra\xE7\xE3o organizada em sistemas que j\xE1 utilizam estrutura em rack.',
        icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="5" rx="1.2" stroke="currentColor" stroke-width="1.6"></rect><rect x="4" y="10" width="16" height="5" rx="1.2" stroke="currentColor" stroke-width="1.6"></rect><rect x="4" y="17" width="16" height="4" rx="1.2" stroke="currentColor" stroke-width="1.6"></rect></svg>',
      },
    };
    // Só recursos que o produto realmente tem, no máximo 3.
    const buildTechBenefits = (b) => {
      const list = [];
      if ((b.technology || '').toLowerCase() === 'lifepo4') list.push(TECH_BENEFITS.lifepo4);
      if (b.features.includes('BMS')) list.push(TECH_BENEFITS.bms);
      if (b.features.includes('Bluetooth')) list.push(TECH_BENEFITS.bluetooth);
      if (b.features.includes('Rack')) list.push(TECH_BENEFITS.rack);
      return list.slice(0, 3);
    };
    const buildQuickSpecs = (b) => {
      const items = [];
      if (b.voltage) items.push(['Tens\xE3o', b.voltage]);
      if (b.capacity) items.push(['Capacidade', b.capacity]);
      if (b.technology) items.push(['Tecnologia', b.technology]);
      if (b.features.includes('BMS')) items.push(['Gerenciamento', 'BMS']);
      if (b.features.includes('Bluetooth')) items.push(['Conectividade', 'Bluetooth']);
      return items.slice(0, 5);
    };
    // Linhas sem valor somem; grupo sem nenhuma linha some inteiro.
    const buildSpecGroups = (b) => {
      const groups = [
        {
          title: 'Energia',
          rows: [
            ['Tens\xE3o nominal', b.voltage],
            ['Capacidade', b.capacity],
            ['Tecnologia', b.technology],
          ],
        },
        { title: 'Opera\xE7\xE3o', rows: [] },
        {
          title: 'Sistema',
          rows: [
            ['BMS', b.features.includes('BMS') ? 'Integrado' : null],
            ['Bluetooth', b.features.includes('Bluetooth') ? 'Integrado' : null],
          ],
        },
        { title: 'F\xEDsico', rows: [['Formato', b.features.includes('Rack') ? 'Rack' : null]] },
      ];
      return groups
        .map((g) => ({ title: g.title, rows: g.rows.filter(([, v]) => v) }))
        .filter((g) => g.rows.length);
    };
    const RAW_BATTERY_CATALOG = [
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
        sectors: ['solar', 'automotivo'],
        features: ['BMS', 'Bluetooth'],
        shortDescription: 'Armazenamento inteligente de energia para sistemas solares.',
        // Foto real confirmada (mesma pasta do Drive JFA, etiqueta impressa
        // "e-LÍTIO PRO -- BATERIA DE LÍTIO 12,8V 100A") -- bate exatamente
        // com este item (único "Pro" 12V/100Ah do catálogo).
        marketingHeadline: 'Energia armazenada. Controle na sua m\xE3o.',
        longDescription:
          'Gerenciamento BMS e conectividade Bluetooth para acompanhar a bateria de perto, com a estabilidade e a autonomia que sistemas de armazenamento de energia exigem.',
        image: '/images/bateria_elitio_pro_12v8_100a.webp',
        images: [
          '/images/bateria_elitio_pro_12v8_100a.webp',
          '/images/bateria_elitio_pro_12v8_100a_a1.webp',
          '/images/bateria_elitio_pro_12v8_100a_a2.webp',
          '/images/bateria_elitio_pro_12v8_100a_a3.webp',
        ],
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
        shortDescription: 'Integra\xE7\xE3o em rack para sistemas solares de maior porte.',
        // Foto real (pasta "Bateria de Lítio/48V 100A" do Drive JFA) --
        // único produto do catálogo com essa combinação exata de
        // tensão+capacidade (48V/100Ah), e a peça no rack visível na
        // foto bate com o "Rack" do nome -- por isso é o único item
        // com `image` até agora; os outros 5 seguem no ícone-placeholder
        // (nenhuma foto real confirmada pra eles ainda).
        marketingHeadline: 'Mais capacidade para o seu sistema solar.',
        longDescription:
          'Formato rack para uma integra\xE7\xE3o organizada em sistemas solares de maior porte.',
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
        marketingHeadline: 'Energia preparada para ir a bordo.',
        longDescription:
          'Desenvolvida para aplica\xE7\xF5es n\xE1uticas que exigem autonomia, estabilidade e confiabilidade em qualquer trajeto.',
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
        shortDescription: 'Energia est\xE1vel e monitorada em um tamanho reduzido.',
        marketingHeadline: 'Energia compacta, controle sempre presente.',
        longDescription:
          'Gerenciamento BMS em um tamanho reduzido, para sistemas de armazenamento de energia que precisam de estabilidade.',
        image: '/images/bateria_elitio_pro_12v8_50a.webp',
        // Galeria da página de detalhe; `image` continua sendo a foto dos cards.
        images: [
          '/images/bateria_elitio_pro_12v8_50a.webp',
          '/images/bateria_elitio_pro_12v8_50a_a1.webp',
          '/images/bateria_elitio_pro_12v8_50a_a2.webp',
          '/images/bateria_elitio_pro_12v8_50a_a3.webp',
          '/images/bateria_elitio_pro_12v8_50a_a4.webp',
        ],
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
        shortDescription: 'Energia est\xE1vel e monitorada para sistemas de armazenamento.',
        marketingHeadline: 'Mais tens\xE3o para o seu sistema de energia.',
        longDescription:
          'Gerenciamento BMS para sistemas de armazenamento de energia que exigem estabilidade e controle.',
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
        marketingHeadline: 'Mais capacidade para projetos solares maiores.',
        longDescription:
          'Gerenciamento BMS para sistemas de armazenamento de energia que precisam de maior autonomia.',
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
        marketingHeadline: 'Mais autonomia para ir mais longe na \xE1gua.',
        longDescription:
          'Desenvolvida para aplica\xE7\xF5es n\xE1uticas que exigem estabilidade e confiabilidade em trajetos mais longos.',
        image: '/images/bateria_elitio_nautica_25v6_100a.webp',
        manualUrl: '',
        commerce: {},
        relatedProducts: [],
      },
    ];
    // Cada bateria existe uma única vez por id e por slug (a primeira ocorrência vence).
    const BATTERY_CATALOG = RAW_BATTERY_CATALOG.filter((b, i, all) => {
      const dupe = all.findIndex((x) => x.id === b.id || x.slug === b.slug) !== i;
      if (dupe && import.meta.env.DEV) console.warn('[baterias] item duplicado ignorado:', b.id);
      return !dupe;
    });
    // Abas fixas do filtro (Automotivo aparece mesmo sem produto ainda) + qualquer setor extra dos dados.
    const BATTERY_SECTORS = Array.from(
      new Set(['automotivo', 'solar', 'nautico', ...BATTERY_CATALOG.flatMap((b) => b.sectors)]),
    );
    const bySlug = (slug) => BATTERY_CATALOG.find((b) => b.slug === slug);
    const bateriasNav = root.getElementById('bateriasSectorNav');
    const navBaterias = root.getElementById('navBaterias');
    const navSetores = root.getElementById('navSetores');
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
      on(a, 'click', (e) => {
        trackEvent('battery_card_click', { battery_id: b.id, sectors: b.sectors });
        const img = media.querySelector('img');
        if (!document.startViewTransition || ctx.reduceMotion || !img || e.metaKey || e.ctrlKey || e.shiftKey)
          return;
        e.preventDefault();
        img.style.viewTransitionName = 'bateria-product';
        const transition = document.startViewTransition(() => {
          img.style.viewTransitionName = '';
          history.pushState(null, '', a.getAttribute('href'));
          applyRoute();
          bateriaHeroMedia.style.viewTransitionName = 'bateria-product';
        });
        transition.finished.finally(() => {
          bateriaHeroMedia.style.viewTransitionName = '';
        });
      });
      return a;
    };
    // Filtro por aplicação: saída com fade + leve redução, reorganização do grid
    // animada (FLIP) e entrada com fade + translateY curto. Nunca recarrega.
    const bateriasFilterIndicator = root.getElementById('bateriasFilterIndicator');
    const bateriasEmpty = root.getElementById('bateriasEmpty');
    const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
    let filterToken = 0;
    const positionFilterIndicator = (btn) => {
      if (!bateriasFilterIndicator || !btn) return;
      bateriasFilterIndicator.style.width = btn.offsetWidth + 'px';
      bateriasFilterIndicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    };
    const filterBaterias = (sector) => {
      const token = ++filterToken;
      const cards = Array.from(bateriasGrid.querySelectorAll('.catalog-card'));
      cards.forEach((c) => c.getAnimations().forEach((anim) => anim.cancel()));
      const matches = (card) => sector === 'all' || (card.dataset.sectors || '').split(',').includes(sector);
      const isEmpty = !cards.some(matches);
      if (bateriasEmpty) {
        bateriasEmpty.hidden = !isEmpty;
        if (isEmpty && !ctx.reduceMotion && typeof bateriasEmpty.animate === 'function')
          bateriasEmpty.animate(
            [
              { opacity: 0, transform: 'translateY(10px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 420, delay: 180, easing: EASE_OUT, fill: 'backwards' },
          );
      }
      if (ctx.reduceMotion || typeof bateriasGrid.animate !== 'function') {
        cards.forEach((c) => {
          c.hidden = !matches(c);
          if (!c.hidden) c.classList.add('is-revealed');
        });
        return;
      }
      const leaving = cards.filter((c) => !c.hidden && !matches(c));
      const entering = cards.filter((c) => c.hidden && matches(c));
      const staying = cards.filter((c) => !c.hidden && matches(c));
      const exits = leaving.map((c) =>
        c.animate(
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.96)' },
          ],
          { duration: 220, easing: 'ease', fill: 'forwards' },
        ),
      );
      Promise.all(exits.map((anim) => anim.finished.catch(() => {}))).then(() => {
        if (token !== filterToken) return;
        const first = new Map(staying.map((c) => [c, c.getBoundingClientRect()]));
        leaving.forEach((c) => {
          c.hidden = true;
          c.getAnimations().forEach((anim) => anim.cancel());
        });
        entering.forEach((c) => {
          c.hidden = false;
          c.classList.add('is-revealed');
        });
        staying.forEach((c) => {
          const from = first.get(c);
          const to = c.getBoundingClientRect();
          const dx = from.left - to.left;
          const dy = from.top - to.top;
          if (dx || dy)
            c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], {
              duration: 460,
              easing: EASE_OUT,
            });
        });
        entering.forEach((c, i) =>
          c.animate(
            [
              { opacity: 0, transform: 'translateY(14px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 460, delay: 80 + i * 60, easing: EASE_OUT, fill: 'backwards' },
          ),
        );
      });
    };
    // Cards do catálogo entram uma única vez ao aparecer na tela, em stagger curto.
    let catalogRevealObs = null;
    if ('IntersectionObserver' in window) {
      catalogRevealObs = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((en) => en.isIntersecting);
          visible.forEach((en, i) => {
            const card = en.target;
            card.style.transitionDelay = 120 + i * 70 + 'ms';
            card.classList.add('is-revealed');
            setTimeout(() => {
              card.style.transitionDelay = '';
            }, 1200);
            catalogRevealObs.unobserve(card);
          });
        },
        { threshold: 0.12 },
      );
      ctx.cleanups.push(() => catalogRevealObs.disconnect());
    }
    // Parallax sutil da foto no card (só mouse): escreve variáveis CSS, 1x por frame.
    let cardParallaxRaf = null;
    let cardParallaxPending = null;
    const flushCardParallax = () => {
      cardParallaxRaf = null;
      if (!cardParallaxPending) return;
      const { card, nx, ny } = cardParallaxPending;
      cardParallaxPending = null;
      card.style.setProperty('--card-nx', nx.toFixed(3));
      card.style.setProperty('--card-ny', ny.toFixed(3));
    };
    on(bateriasGrid, 'pointermove', (e) => {
      if (e.pointerType !== 'mouse' || ctx.reduceMotion) return;
      const card = e.target.closest('.catalog-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      cardParallaxPending = {
        card,
        nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
      if (!cardParallaxRaf) cardParallaxRaf = requestAnimationFrame(flushCardParallax);
    });
    on(bateriasGrid, 'pointerout', (e) => {
      const card = e.target.closest('.catalog-card');
      if (!card || card.contains(e.relatedTarget)) return;
      card.style.removeProperty('--card-nx');
      card.style.removeProperty('--card-ny');
    });
    ctx.cleanups.push(() => {
      if (cardParallaxRaf) cancelAnimationFrame(cardParallaxRaf);
    });
    const buildBateriasView = () => {
      if (bateriasBuilt) return;
      bateriasBuilt = true;
      const addFilterTab = (sector, label, active) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'catalog-filter-tab' + (active ? ' is-active' : '');
        tab.dataset.sector = sector;
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
        tab.textContent = label;
        bateriasNav.appendChild(tab);
      };
      addFilterTab('all', 'Todas', true);
      BATTERY_SECTORS.forEach((s) => addFilterTab(s, APP_LABELS[s] || s, false));
      on(bateriasNav, 'click', (e) => {
        const tab = e.target.closest('.catalog-filter-tab');
        if (!tab || tab.classList.contains('is-active')) return;
        Array.from(bateriasNav.querySelectorAll('.catalog-filter-tab')).forEach((t) => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
        });
        positionFilterIndicator(tab);
        filterBaterias(tab.dataset.sector);
      });
      on(window, 'resize', () =>
        positionFilterIndicator(bateriasNav.querySelector('.catalog-filter-tab.is-active')),
      );
      BATTERY_CATALOG.forEach((b) => {
        const card = buildBateriaCard(b);
        bateriasGrid.appendChild(card);
        if (catalogRevealObs) catalogRevealObs.observe(card);
        else card.classList.add('is-revealed');
      });
    };
    // Entrada da página /baterias: título, filtro e grid em sequência (a cada abertura).
    const playBateriasEntrance = () => {
      bateriasView.classList.remove('is-entering');
      void bateriasView.offsetWidth;
      bateriasView.classList.add('is-entering');
      requestAnimationFrame(() =>
        positionFilterIndicator(bateriasNav.querySelector('.catalog-filter-tab.is-active')),
      );
    };
    const bateriaHeroMedia = root.getElementById('bateriaHeroMedia');
    const bateriaGalleryThumbs = root.getElementById('bateriaGalleryThumbs');
    const bateriaEyebrow = root.getElementById('bateriaEyebrow');
    const bateriaAppBadge = root.getElementById('bateriaAppBadge');
    const bateriaTitle = root.getElementById('bateriaTitle');
    const bateriaHeadline = root.getElementById('bateriaHeadline');
    const bateriaSub = root.getElementById('bateriaSub');
    const bateriaCommerceHero = root.getElementById('bateriaCommerceHero');
    const bateriaQuickSpecs = root.getElementById('bateriaQuickSpecs');
    const bateriaTechGrid = root.getElementById('bateriaTechGrid');
    const bateriaAppSection = root.getElementById('bateriaAppSection');
    const bateriaAppTabs = root.getElementById('bateriaAppTabs');
    const bateriaAppTabsUnderline = root.getElementById('bateriaAppTabsUnderline');
    const bateriaAppCopy = bateriaAppSection ? bateriaAppSection.querySelector('.bateria-app-copy') : null;
    const bateriaAppHeadline = root.getElementById('bateriaAppHeadline');
    const bateriaAppText = root.getElementById('bateriaAppText');
    const bateriaAppImage = root.getElementById('bateriaAppImage');
    const bateriaSpecGroups = root.getElementById('bateriaSpecGroups');
    const bateriaRelatedSection = root.getElementById('bateriaRelatedSection');
    const bateriaRelatedGrid = root.getElementById('bateriaRelatedGrid');
    const bateriaDocsHub = root.getElementById('bateriaDocsHub');
    const bateriaSupportCta = root.getElementById('bateriaSupportCta');
    const bateriaOthersGrid = root.getElementById('bateriaOthersGrid');
    const bateriaBreadcrumbCurrent = root.getElementById('bateriaBreadcrumbCurrent');
    // Miniaturas só aparecem com mais de 1 foto; onSelect move o carrossel principal.
    const buildGalleryThumbs = (photos, altBase, onSelect) => {
      bateriaGalleryThumbs.innerHTML = '';
      if (photos.length <= 1) {
        bateriaGalleryThumbs.hidden = true;
        return [];
      }
      bateriaGalleryThumbs.hidden = false;
      return photos.map((src, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bateria-gallery-thumb' + (i === 0 ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Ver foto ' + (i + 1) + ' de ' + altBase);
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        btn.appendChild(img);
        on(btn, 'click', () => onSelect(i, btn.classList.contains('is-prev') ? -1 : 1));
        bateriaGalleryThumbs.appendChild(btn);
        return btn;
      });
    };
    let bateriaCarouselCleanup = null;
    const buildBateriaHeroCarousel = (photos, altBase, onIndexChange) => {
      bateriaHeroMedia.innerHTML = '';
      bateriaHeroMedia.classList.toggle('has-carousel', photos.length > 1);
      if (photos.length <= 1) {
        const img = document.createElement('img');
        img.src = photos[0];
        img.alt = altBase;
        img.decoding = 'async';
        bateriaHeroMedia.appendChild(img);
        return { cleanup: null, goTo: null };
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
      const slides = Array.from(track.children);
      slides.forEach((slide, i) => {
        if (i !== 0) slide.style.transform = 'translateX(100%)';
      });
      // Troca com a foto atual saindo para a esquerda (ou direita, ao voltar) e a nova entrando do lado oposto.
      const slideTo = (newIdx, dir) => {
        const oldSlide = slides[idx];
        const newSlide = slides[newIdx];
        newSlide.style.transition = 'none';
        newSlide.style.transform = 'translateX(' + (dir > 0 ? 100 : -100) + '%)';
        void newSlide.offsetWidth;
        newSlide.style.transition = '';
        newSlide.style.transform = '';
        oldSlide.style.transform = 'translateX(' + (dir > 0 ? -100 : 100) + '%)';
      };
      const render = () => {
        slides.forEach((slide, i) => {
          slide.classList.toggle('is-active', i === idx);
          slide.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
        });
        dots.forEach((d, i) => {
          d.classList.toggle('is-active', i === idx);
          d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        if (onIndexChange) onIndexChange(idx);
      };
      const goTo = (i, dir) => {
        const newIdx = (i + N) % N;
        if (newIdx === idx) return;
        slideTo(newIdx, dir || (newIdx > idx ? 1 : -1));
        idx = newIdx;
        render();
      };
      const next = () => goTo(idx + 1, 1);
      const prev = () => goTo(idx - 1, -1);
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
      return {
        cleanup: () => {
          stop();
          if (io) io.disconnect();
          localCleanups.forEach((fn) => fn());
        },
        goTo,
      };
    };
    // Parallax sutil do produto (via --bh-nx/--bh-ny), só com mouse.
    const bateriaStage = root.querySelector('.bateria-gallery-stage');
    if (bateriaStage) {
      const bateriaHoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
      let bhRafId = null;
      let bhPendingMove = null;
      const flushBhMove = () => {
        bhRafId = null;
        if (!bhPendingMove) return;
        const { nx, ny } = bhPendingMove;
        bhPendingMove = null;
        bateriaHeroMedia.style.setProperty('--bh-nx', nx.toFixed(3));
        bateriaHeroMedia.style.setProperty('--bh-ny', ny.toFixed(3));
      };
      on(bateriaStage, 'pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !bateriaHoverMQ.matches || ctx.reduceMotion) return;
        const rect = bateriaStage.getBoundingClientRect();
        bhPendingMove = {
          nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        };
        if (!bhRafId) bhRafId = requestAnimationFrame(flushBhMove);
      });
      on(bateriaStage, 'pointerleave', () => {
        bateriaHeroMedia.style.removeProperty('--bh-nx');
        bateriaHeroMedia.style.removeProperty('--bh-ny');
      });
      ctx.cleanups.push(() => {
        if (bhRafId) cancelAnimationFrame(bhRafId);
      });
    }
    // Zoom tipo lupa sobre a foto ativa (só mouse): lente circular que acompanha o cursor.
    if (bateriaStage) {
      const ZOOM = 2.4;
      const lens = document.createElement('div');
      lens.className = 'bateria-zoom-lens';
      lens.setAttribute('aria-hidden', 'true');
      bateriaStage.appendChild(lens);
      const zoomMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
      let lensRaf = null;
      let lensPending = null;
      const hideLens = () => {
        lensPending = null;
        lens.classList.remove('is-visible');
      };
      const flushLens = () => {
        lensRaf = null;
        if (!lensPending) return;
        const { x, y } = lensPending;
        lensPending = null;
        const img =
          bateriaHeroMedia.querySelector('.bateria-photo-slide.is-active img') ||
          bateriaHeroMedia.querySelector('img');
        if (!img || !img.naturalWidth) return hideLens();
        const r = img.getBoundingClientRect();
        const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
        const cw = img.naturalWidth * scale;
        const ch = img.naturalHeight * scale;
        const px = x - (r.left + (r.width - cw) / 2);
        const py = y - (r.top + (r.height - ch) / 2);
        if (px < 0 || py < 0 || px > cw || py > ch) return hideLens();
        const stageRect = bateriaStage.getBoundingClientRect();
        const size = lens.offsetWidth;
        lens.style.backgroundImage = 'url("' + img.currentSrc + '")';
        lens.style.backgroundSize = cw * ZOOM + 'px ' + ch * ZOOM + 'px';
        lens.style.backgroundPosition = -(px * ZOOM - size / 2) + 'px ' + -(py * ZOOM - size / 2) + 'px';
        lens.style.transform =
          'translate(' + (x - stageRect.left - size / 2) + 'px,' + (y - stageRect.top - size / 2) + 'px)';
        lens.classList.add('is-visible');
      };
      on(bateriaStage, 'pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !zoomMQ.matches || e.target.closest('button')) return hideLens();
        lensPending = { x: e.clientX, y: e.clientY };
        if (!lensRaf) lensRaf = requestAnimationFrame(flushLens);
      });
      on(bateriaStage, 'pointerleave', hideLens);
      ctx.cleanups.push(() => {
        if (lensRaf) cancelAnimationFrame(lensRaf);
      });
    }
    // Compra na Hero: sem venda online confirmada, cai em "Consulte disponibilidade".
    const buildCommerceBlock = (container, b, opts) => {
      const compact = !!(opts && opts.compact);
      const fallbackLabel = (opts && opts.fallbackLabel) || 'Encontrar representante';
      container.innerHTML = '';
      const commerce = b.commerce || {};
      if (commerce.availableOnline) {
        const priceRow = document.createElement('div');
        priceRow.className = 'bateria-price-row';
        if (commerce.oldPrice) {
          const old = document.createElement('span');
          old.className = 'bateria-price-old';
          old.textContent = 'De ' + commerce.oldPrice;
          priceRow.appendChild(old);
        }
        if (commerce.price) {
          const price = document.createElement('span');
          price.className = 'bateria-price-current';
          price.textContent = commerce.price;
          priceRow.appendChild(price);
        }
        if (priceRow.children.length) container.appendChild(priceRow);
        const condBits = [];
        if (commerce.pixPrice) condBits.push(commerce.pixPrice + ' no Pix');
        if (commerce.installments) condBits.push(commerce.installments);
        if (condBits.length) {
          const cond = document.createElement('p');
          cond.className = 'bateria-price-conditions';
          cond.textContent = condBits.join(' ou ');
          container.appendChild(cond);
        }
        const actions = document.createElement('div');
        actions.className = 'bateria-cta-row';
        if (commerce.storeUrl) {
          const a = document.createElement('a');
          a.className = 'hero-cta hero-cta-primary';
          a.href = commerce.storeUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = 'Comprar na Loja Oficial';
          on(a, 'click', () =>
            trackEvent('battery_buy_click', { battery_id: b.id, channel: 'loja_oficial' }),
          );
          actions.appendChild(a);
        }
        if (commerce.mercadoLivreUrl) {
          const a = document.createElement('a');
          a.className = 'hero-cta hero-cta-tertiary';
          a.href = commerce.mercadoLivreUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = 'Comprar no Mercado Livre';
          on(a, 'click', () =>
            trackEvent('battery_buy_click', { battery_id: b.id, channel: 'mercado_livre' }),
          );
          actions.appendChild(a);
        }
        const rep = document.createElement('a');
        rep.className = 'bateria-cta-link';
        rep.href = '#representantes';
        rep.setAttribute('data-header-scroll', 'representantes');
        rep.textContent = 'Encontrar representante';
        actions.appendChild(rep);
        container.appendChild(actions);
      } else {
        const p = document.createElement('p');
        p.className = 'bateria-commerce-fallback-text';
        p.textContent = compact
          ? 'Consulte disponibilidade.'
          : 'Consulte disponibilidade nos canais oficiais e com representantes JFA.';
        container.appendChild(p);
        const actions = document.createElement('div');
        actions.className = 'bateria-cta-row';
        const rep = document.createElement('a');
        rep.className = 'hero-cta';
        rep.href = '#representantes';
        rep.setAttribute('data-header-scroll', 'representantes');
        rep.textContent = fallbackLabel;
        on(rep, 'click', () => trackEvent('battery_find_rep_click', { battery_id: b.id }));
        actions.appendChild(rep);
        container.appendChild(actions);
      }
      const micro = document.createElement('p');
      micro.className = 'bateria-commerce-microcopy';
      micro.textContent = 'Compra pelos canais oficiais JFA.';
      container.appendChild(micro);
    };
    // Aplicações: abas só com setores reais; troca o conteúdo sem navegar.
    let currentAppActive = null;
    let currentAppImage = '';
    let currentAppImageAlt = '';
    const renderAppTab = (sector, opts) => {
      const appCtx = APP_CONTEXT[sector];
      if (!appCtx || !bateriaAppHeadline) return;
      const apply = () => {
        bateriaAppHeadline.textContent = appCtx.title;
        bateriaAppText.textContent = appCtx.text;
        if (currentAppImage) {
          bateriaAppImage.src = currentAppImage;
          bateriaAppImage.alt = currentAppImageAlt;
          bateriaAppImage.hidden = false;
        } else {
          bateriaAppImage.hidden = true;
        }
      };
      if ((opts && opts.skipAnim) || ctx.reduceMotion) {
        apply();
        return;
      }
      if (bateriaAppCopy) bateriaAppCopy.classList.add('is-switching');
      bateriaAppImage.classList.add('is-switching');
      setTimeout(() => {
        apply();
        if (bateriaAppCopy) bateriaAppCopy.classList.remove('is-switching');
        bateriaAppImage.classList.remove('is-switching');
      }, 240);
    };
    const positionAppUnderline = (btn) => {
      if (!bateriaAppTabsUnderline) return;
      if (!btn) {
        bateriaAppTabsUnderline.style.width = '0px';
        return;
      }
      bateriaAppTabsUnderline.style.width = btn.offsetWidth + 'px';
      bateriaAppTabsUnderline.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    };
    const switchAppTab = (sector, btn) => {
      if (sector === currentAppActive) return;
      currentAppActive = sector;
      Array.from(bateriaAppTabs.querySelectorAll('.bateria-app-tab')).forEach((p) => {
        p.classList.toggle('is-active', p.dataset.sector === sector);
        p.setAttribute('aria-selected', p.dataset.sector === sector ? 'true' : 'false');
      });
      positionAppUnderline(btn || bateriaAppTabs.querySelector('.bateria-app-tab.is-active'));
      renderAppTab(sector);
    };
    on(bateriaAppTabs, 'click', (e) => {
      const btn = e.target.closest('.bateria-app-tab');
      if (!btn) return;
      switchAppTab(btn.dataset.sector, btn);
    });
    // Card editorial dos produtos relacionados (sem tensão/capacidade, CTA "Conhecer produto").
    const buildEditorialCard = (b) => {
      const a = document.createElement('a');
      a.className = 'catalog-card';
      a.href = '#/baterias/' + b.slug;
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
      const func = document.createElement('p');
      func.className = 'catalog-card-lines';
      func.textContent = b.sectors.map((s) => APP_LABELS[s] || s).join(' \xB7 ');
      a.appendChild(func);
      const desc = document.createElement('p');
      desc.className = 'catalog-card-desc';
      desc.textContent = b.shortDescription;
      a.appendChild(desc);
      const cta = document.createElement('span');
      cta.className = 'catalog-card-cta';
      cta.innerHTML =
        'Conhecer produto <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      a.appendChild(cta);
      on(a, 'click', () => trackEvent('battery_related_click', { battery_id: b.id }));
      return a;
    };
    // Documentos: manual só com manualUrl real; link para a Central de Manuais sempre presente.
    const buildDocsHub = (b) => {
      bateriaDocsHub.innerHTML = '';
      const rows = [];
      if (b.manualUrl) {
        rows.push({
          href: b.manualUrl,
          external: true,
          title: 'Manual t\xE9cnico',
          text: 'Informa\xE7\xF5es de instala\xE7\xE3o, opera\xE7\xE3o e cuidados.',
          cta: 'Baixar manual',
          event: 'battery_manual_click',
        });
      }
      rows.push({
        anchor: 'manuais',
        title: 'Central de manuais',
        text: 'Manuais organizados por categoria na se\xE7\xE3o de Manuais do site.',
        cta: 'Ver manuais',
      });
      rows.forEach((r) => {
        const row = document.createElement('a');
        row.className = 'bateria-doc-row';
        if (r.external) {
          row.href = r.href;
          row.target = '_blank';
          row.rel = 'noopener noreferrer';
        } else {
          row.href = '#' + r.anchor;
          row.setAttribute('data-header-scroll', r.anchor);
        }
        const icon = document.createElement('span');
        icon.className = 'bateria-doc-row-icon';
        icon.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        row.appendChild(icon);
        const body = document.createElement('span');
        body.className = 'bateria-doc-row-body';
        const title = document.createElement('p');
        title.className = 'bateria-doc-row-title';
        title.textContent = r.title;
        body.appendChild(title);
        const text = document.createElement('p');
        text.className = 'bateria-doc-row-text';
        text.textContent = r.text;
        body.appendChild(text);
        row.appendChild(body);
        const arrow = document.createElement('span');
        arrow.className = 'bateria-doc-row-arrow';
        arrow.textContent = r.cta + ' →';
        row.appendChild(arrow);
        if (r.event) on(row, 'click', () => trackEvent(r.event, { battery_id: b.id }));
        bateriaDocsHub.appendChild(row);
      });
    };
    // Revelação das seções ao rolar (uma vez só).
    const bateriaRevealEls = Array.from(root.querySelectorAll('#bateriaView [data-reveal]'));
    const checkBateriaReveals = () => {
      bateriaRevealEls.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) el.classList.add('is-visible');
      });
    };
    if (bateriaRevealEls.length) {
      const bateriaRevealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              bateriaRevealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      bateriaRevealEls.forEach((el) => bateriaRevealObs.observe(el));
      ctx.cleanups.push(() => bateriaRevealObs.disconnect());
    }
    const renderBateriaView = (slug) => {
      const b = bySlug(slug);
      if (!b) {
        location.hash = '#/baterias';
        return;
      }
      // 01 · Hero (entrada sequencial a cada abertura)
      bateriaView.classList.remove('is-entering');
      void bateriaView.offsetWidth;
      bateriaView.classList.add('is-entering');
      if (bateriaCarouselCleanup) {
        bateriaCarouselCleanup();
        bateriaCarouselCleanup = null;
      }
      const bateriaPhotos = b.images && b.images.length ? b.images : b.image ? [b.image] : [];
      let thumbBtns = [];
      // Miniaturas: só a foto atual nítida, com a anterior e a próxima desfocadas ao redor.
      const syncThumbs = (idx) => {
        const n = thumbBtns.length;
        thumbBtns.forEach((t, i) => {
          const isNext = n > 1 && i === (idx + 1) % n;
          const isPrev = n > 2 && i === (idx - 1 + n) % n;
          t.classList.toggle('is-active', i === idx);
          t.classList.toggle('is-next', isNext);
          t.classList.toggle('is-prev', isPrev);
          t.tabIndex = i === idx || isNext || isPrev ? 0 : -1;
        });
      };
      if (bateriaPhotos.length) {
        const carousel = buildBateriaHeroCarousel(bateriaPhotos, b.name, syncThumbs);
        bateriaCarouselCleanup = carousel.cleanup;
        bateriaHeroMedia.classList.toggle('has-thumbs', bateriaPhotos.length > 1);
        thumbBtns = buildGalleryThumbs(bateriaPhotos, b.name, (i, dir) => {
          if (carousel.goTo) carousel.goTo(i, dir);
          syncThumbs(i);
        });
        syncThumbs(0);
      } else {
        bateriaHeroMedia.classList.remove('has-carousel', 'has-thumbs');
        bateriaHeroMedia.innerHTML = BATTERY_PLACEHOLDER_SVG;
        bateriaGalleryThumbs.hidden = true;
        bateriaGalleryThumbs.innerHTML = '';
      }
      bateriaEyebrow.textContent = 'Baterias JFA';
      bateriaAppBadge.textContent = APP_LABELS[b.sectors[0]] || '';
      bateriaTitle.innerHTML = fixStretchProAccent(b.name);
      bateriaHeadline.textContent = b.marketingHeadline || '';
      bateriaHeadline.hidden = !b.marketingHeadline;
      bateriaSub.textContent = b.longDescription || b.shortDescription;
      bateriaBreadcrumbCurrent.textContent = b.name;
      buildCommerceBlock(bateriaCommerceHero, b, { compact: true, fallbackLabel: 'Encontrar onde comprar' });
      // 02 · Especificações rápidas
      bateriaQuickSpecs.innerHTML = '';
      buildQuickSpecs(b).forEach(([label, value]) => {
        const item = document.createElement('div');
        item.className = 'bateria-quickspec-item';
        const val = document.createElement('span');
        val.className = 'bateria-quickspec-value';
        val.textContent = value;
        item.appendChild(val);
        const lab = document.createElement('span');
        lab.className = 'bateria-quickspec-label';
        lab.textContent = label;
        item.appendChild(lab);
        bateriaQuickSpecs.appendChild(item);
      });
      // 03 · Tecnologia/benefícios
      bateriaTechGrid.innerHTML = '';
      const benefits = buildTechBenefits(b);
      const techSection = bateriaTechGrid.closest('.bateria-tech-section');
      if (techSection) techSection.hidden = !benefits.length;
      benefits.forEach((benefit) => {
        const card = document.createElement('div');
        card.className = 'bateria-tech-card';
        const icon = document.createElement('span');
        icon.className = 'bateria-tech-icon';
        icon.innerHTML = benefit.icon;
        card.appendChild(icon);
        const title = document.createElement('h3');
        title.className = 'bateria-tech-title';
        title.textContent = benefit.title;
        card.appendChild(title);
        const text = document.createElement('p');
        text.className = 'bateria-tech-text';
        text.textContent = benefit.text;
        card.appendChild(text);
        bateriaTechGrid.appendChild(card);
      });
      // 04 · Aplicações: a seção inteira some com 1 único setor.
      const hasMultipleApps = b.sectors.length >= 2;
      if (bateriaAppSection) bateriaAppSection.hidden = !hasMultipleApps;
      currentAppImage = bateriaPhotos[0] || '';
      currentAppImageAlt = b.name;
      currentAppActive = null;
      Array.from(bateriaAppTabs.querySelectorAll('.bateria-app-tab')).forEach((el) => el.remove());
      if (hasMultipleApps) {
        bateriaAppTabs.hidden = false;
        let firstTabBtn = null;
        b.sectors.forEach((s, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'bateria-app-tab' + (i === 0 ? ' is-active' : '');
          btn.dataset.sector = s;
          btn.setAttribute('role', 'tab');
          btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
          btn.textContent = APP_LABELS[s] || s;
          bateriaAppTabs.appendChild(btn);
          if (i === 0) firstTabBtn = btn;
        });
        currentAppActive = b.sectors[0];
        renderAppTab(b.sectors[0], { skipAnim: true });
        requestAnimationFrame(() => positionAppUnderline(firstTabBtn));
      }
      // 05 · Especificações técnicas
      bateriaSpecGroups.innerHTML = '';
      const groups = buildSpecGroups(b);
      const specsSection = bateriaSpecGroups.closest('.bateria-specs-section');
      if (specsSection) specsSection.hidden = !groups.length;
      groups.forEach((group) => {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'bateria-spec-group-title';
        title.textContent = group.title;
        wrap.appendChild(title);
        const rowsWrap = document.createElement('div');
        rowsWrap.className = 'bateria-spec-group-rows';
        group.rows.forEach(([label, value]) => {
          const row = document.createElement('div');
          row.className = 'bateria-spec-row';
          const lab = document.createElement('span');
          lab.className = 'bateria-spec-row-label';
          lab.textContent = label;
          row.appendChild(lab);
          const val = document.createElement('span');
          val.className = 'bateria-spec-row-value';
          val.textContent = value;
          row.appendChild(val);
          rowsWrap.appendChild(row);
        });
        wrap.appendChild(rowsWrap);
        bateriaSpecGroups.appendChild(wrap);
      });
      // 07 · Produtos relacionados (só relatedProducts configurado)
      bateriaRelatedGrid.innerHTML = '';
      const related = (b.relatedProducts || []).map(bySlug).filter(Boolean).slice(0, 3);
      bateriaRelatedSection.hidden = !related.length;
      related.forEach((r) => bateriaRelatedGrid.appendChild(buildEditorialCard(r)));
      // 08 · Documentos e suporte
      buildDocsHub(b);
      bateriaSupportCta.href =
        'https://api.whatsapp.com/send?phone=' +
        WHATSAPP_PHONE +
        '&text=' +
        encodeURIComponent('Ol\xE1, quero saber mais sobre a ' + b.name + '!');
      bateriaSupportCta.onclick = () =>
        trackEvent('whatsapp_click', { source: 'bateria_page', battery_id: b.id });
      // 10 · Outras baterias: até 3, nunca a atual.
      bateriaOthersGrid.innerHTML = '';
      BATTERY_CATALOG.filter((x) => x.id !== b.id)
        .slice(0, 3)
        .forEach((x) => bateriaOthersGrid.appendChild(buildBateriaCard(x)));
      document.title = b.name + ' | Bateria LiFePO₄ JFA';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc)
        metaDesc.setAttribute(
          'content',
          'Conhe\xE7a a ' +
            b.name +
            ' JFA: caracter\xEDsticas, aplica\xE7\xF5es, especifica\xE7\xF5es t\xE9cnicas, manual e canais oficiais de compra.',
        );
      trackEvent('battery_page_view', { battery_id: b.id, sectors: b.sectors });
      requestAnimationFrame(checkBateriaReveals);
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
      if (navBaterias) navBaterias.classList.toggle('is-active', name === 'baterias' || name === 'bateria');
      if (navSetores) navSetores.classList.toggle('is-active', name === 'setores' || name === 'setor');
      if (name === 'baterias') playBateriasEntrance();
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
