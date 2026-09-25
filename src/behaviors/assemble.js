/**
 * Entrada "montando o site": cada seção da Home se monta de um jeito próprio
 * quando aparece na tela (uma vez só); nas páginas de baterias, cada peça
 * entra ao chegar na tela, a cada abertura da página. As peças começam escondidas e entram
 * com a animação da seção, em sequência.
 * @param {import('./context').BehaviorContext} ctx
 */
// Cada seção: lista de [seletor, animação]. As peças entram em sequência.
const SECTIONS = [
  // Acesso rápido: título desce e os blocos caem girando até encaixar.
  {
    section: '.quick-access',
    parts: [
      ['.quick-access-title', 'asmRiseBig'],
      ['.quick-access-item', 'asmDrop'],
    ],
  },
  // Frentes: título sobe, palco revelado por cortina lateral, navegação sobe.
  {
    section: '#frontsSection',
    parts: [
      ['.fronts-eyebrow', 'asmPop'],
      ['.fronts-title', 'asmSkew'],
      ['.fronts-sub', 'asmRiseBig'],
      ['.fronts-stage', 'asmWipe'],
      ['.fronts-nav', 'asmRise'],
    ],
  },
  // Produtos: título inclinado, selos saltam, filtros estouram, esteira entra pela direita.
  {
    section: '#productsSection',
    parts: [
      ['.products-title', 'asmSkew'],
      ['.products-sub', 'asmRiseBig'],
      ['.products-cert-item', 'asmSpin'],
      ['.products-certs-note', 'asmFromRight'],
      ['.products-category-pill', 'asmPop'],
      ['.products-endcap', 'asmFromRight'],
      ['.carousel-runway', 'asmSlideLeft'],
    ],
  },
  // Onde comprar: título, cards chegando de lados opostos, faixa sobe.
  {
    section: '#buySection',
    parts: [
      ['.buy-eyebrow', 'asmPop'],
      ['.buy-title', 'asmFlipDown'],
      ['.buy-sub', 'asmRiseBig'],
      ['.buy-grid > .buy-card:nth-child(1)', 'asmFromLeft'],
      ['.buy-grid > .buy-card:nth-child(2)', 'asmFromRight'],
      ['.buy-rep-strip', 'asmRise'],
    ],
  },
  // Banner: entra deslizando pela lateral direita.
  { section: '#campaignSection', parts: [['.campaign-carousel', 'asmSideIn']] },
  // JFA Parts: card vira em 3D, textos sobem, destaques deslizam, foto aproxima.
  {
    section: '#partsPromoSection',
    parts: [
      ['.parts-promo-inner', 'asmFlipUp'],
      ['.parts-promo-eyebrow', 'asmPop'],
      ['.parts-promo-title', 'asmSkew'],
      ['.parts-promo-sub', 'asmRiseBig'],
      ['.parts-promo-grid', 'asmFromLeft'],
      ['.parts-promo-media', 'asmZoomOut'],
      ['.parts-promo-cta-wrap', 'asmPop'],
    ],
  },
  // Representantes: texto pela esquerda, busca abre, mapa se aproxima.
  {
    section: '#repsSection',
    parts: [
      ['.reps-top > *', 'asmFromLeft'],
      ['.reps-search-wrap', 'asmExpand'],
      ['.reps-map-wrap', 'asmZoomOut'],
      ['.reps-col2-lower > *', 'asmRise'],
      ['.reps-intl-wrap', 'asmFromLeft'],
    ],
  },
  // Manuais: cabeçalho sobe, busca abre do centro, abas estouram em sequência.
  {
    section: '#manualsSection',
    parts: [
      ['.manuals-eyebrow', 'asmPop'],
      ['.manuals-title', 'asmFlipDown'],
      ['.manuals-sub', 'asmRiseBig'],
      ['.manuals-search-wrap', 'asmExpand'],
      ['.manuals-tabs > *', 'asmPop'],
    ],
  },
  // Rodapé: marca, colunas e base sobem em sequência.
  {
    section: '#jfaFooter',
    parts: [
      ['.jfa-footer-brand', 'asmFromLeft'],
      ['.jfa-footer-col', 'asmLift'],
      ['.jfa-footer-bottom', 'asmRise'],
    ],
  },
];
// Páginas de baterias: o conteúdo é recriado a cada abertura, então cada peça
// é observada sozinha e entra quando chega na tela (o site vai se montando no scroll).
const PAGE_VIEWS = {
  baterias: {
    view: '#bateriasView',
    parts: [
      ['.baterias-intro-title', 'asmSkew'],
      ['.catalog-filter-tab', 'asmPop'],
      // Efeito dominó: um card depois do outro, da primeira à última.
      ['#bateriasGrid .catalog-card', 'asmDomino'],
    ],
  },
  bateria: {
    view: '#bateriaView',
    parts: [
      ['.bateria-breadcrumb', 'asmFromLeft'],
      ['.bateria-gallery-stage', 'asmFlipUp'],
      ['.bateria-gallery-thumbs', 'asmFromLeft'],
      ['.bateria-hero-content-in > *', 'asmFromRight'],
      ['.bateria-quickspec-item', 'asmDrop'],
      ['.bateria-block-head > *', 'asmSkew'],
      ['.bateria-tech-card', 'asmFlipDown'],
      ['.bateria-app-tabs', 'asmExpand'],
      ['.bateria-app-body', 'asmZoomIn'],
      ['.bateria-why-copy > *', 'asmFromLeft'],
      ['.bateria-why-reason', 'asmPop'],
      ['.bateria-system-copy > *', 'asmFromLeft'],
      ['.bateria-system-node', 'asmSpin'],
      ['.bateria-system-link', 'asmExpand'],
      ['.bateria-doc-row', 'asmFromRight'],
      ['.bateria-support-line', 'asmRise'],
      ['.bateria-others-head', 'asmRise'],
      ['#bateriaOthersGrid .catalog-card', 'asmFromLeft'],
    ],
  },
};
const STEP_MS = 110;
const MAX_DELAY_MS = 1300;

function initAssemble(ctx) {
  const { root, cleanups } = ctx;
  if (ctx.reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('asm-on');
  cleanups.push(() => document.documentElement.classList.remove('asm-on'));
  const groups = [];
  SECTIONS.forEach((cfg) => {
    const section = root.querySelector(cfg.section);
    if (!section) return;
    const items = [];
    cfg.parts.forEach(([sel, anim]) => {
      section.querySelectorAll(sel).forEach((el) => items.push({ el, anim }));
    });
    if (!items.length) return;
    items.forEach(({ el }) => el.classList.add('asm-pending'));
    section.classList.add('asm-section');
    groups.push({ section, items });
  });
  // As seções já tinham entradas próprias (classes is-visible/is-revealed).
  // Elas são concluídas junto com a nova animação para não rodarem depois dela.
  const LEGACY_CONTAINERS = '.products-head, .fronts-top, .manuals-head, .reps-top, .reps-stage, .jfa-footer';
  const settleLegacy = (el) => {
    const reveal = el.closest('[data-reveal]');
    if (reveal) reveal.classList.add('is-visible');
    const box = el.closest(LEGACY_CONTAINERS);
    if (box) box.classList.add('is-visible');
    if (el.matches(LEGACY_CONTAINERS)) el.classList.add('is-visible');
    el.querySelectorAll(LEGACY_CONTAINERS + ', .p-card, [data-reveal]').forEach((c) =>
      c.classList.add('is-visible'),
    );
  };
  const animate = (el, anim, delay) => {
    settleLegacy(el);
    // Cards do catálogo têm uma entrada própria (sobe 18px ao ganhar is-revealed);
    // marca já como revelado para ela não rodar depois e causar um "pulinho".
    if (el.classList.contains('catalog-card')) el.classList.add('is-revealed');
    el.style.animation = `${anim} 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms backwards`;
    el.classList.remove('asm-pending');
    el.addEventListener(
      'animationend',
      (e) => {
        if (e.target === el) el.style.animation = '';
      },
      { once: true },
    );
  };
  // Páginas: prepara as peças visíveis e anima cada uma ao entrar na tela.
  const pageObservers = {};
  ctx.replayAssemble = (name) => {
    const cfg = PAGE_VIEWS[name];
    const view = cfg && root.querySelector(cfg.view);
    if (!view) return;
    if (pageObservers[name]) pageObservers[name].disconnect();
    view.querySelectorAll('.asm-pending').forEach((el) => el.classList.remove('asm-pending'));
    const animOf = new Map();
    cfg.parts.forEach(([sel, anim]) => {
      view.querySelectorAll(sel).forEach((el) => {
        if (!el.getClientRects().length || animOf.has(el)) return;
        animOf.set(el, anim);
        el.classList.add('asm-pending');
      });
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries
          .filter((en) => en.isIntersecting)
          // Ordem do documento: da primeira peça para a última (efeito dominó).
          .sort((a, b) =>
            a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          )
          .forEach((en, i) => {
            const anim = animOf.get(en.target);
            const step = anim === 'asmDomino' ? 140 : 90;
            animate(en.target, anim, Math.min(i * step, MAX_DELAY_MS));
            obs.unobserve(en.target);
          });
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' },
    );
    animOf.forEach((_, el) => obs.observe(el));
    pageObservers[name] = obs;
  };
  cleanups.push(() => Object.values(pageObservers).forEach((o) => o.disconnect()));
  // Se o site já abriu direto numa página de baterias, monta agora.
  Object.keys(PAGE_VIEWS).forEach((name) => {
    const view = root.querySelector(PAGE_VIEWS[name].view);
    if (view && !view.hidden) ctx.replayAssemble(name);
  });
  if (!groups.length) return;
  const play = (group) => {
    group.section.classList.add('asm-live');
    group.items.forEach(({ el, anim }, i) => {
      animate(el, anim, Math.min(i * STEP_MS, MAX_DELAY_MS));
    });
  };
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = groups.find((g) => g.section === entry.target);
        if (group) play(group);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  groups.forEach((g) => obs.observe(g.section));
  cleanups.push(() => {
    obs.disconnect();
    groups.forEach((g) => g.items.forEach(({ el }) => el.classList.remove('asm-pending')));
  });
}
export { initAssemble };
