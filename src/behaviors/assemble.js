/**
 * Entrada "montando o site": cada seção da Home se monta de um jeito próprio
 * quando aparece na tela (uma vez só). As peças começam escondidas e entram
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
  // JFA Parts: card vira em 3D, textos sobem, destaques deslizam, foto aproxima.
  {
    section: '#partsPromoSection',
    parts: [
      ['.parts-promo-inner', 'asmFlipUp'],
      ['.parts-promo-eyebrow', 'asmPop'],
      ['.parts-promo-title', 'asmSkew'],
      ['.parts-promo-sub', 'asmRiseBig'],
      ['.parts-promo-card', 'asmFromLeft'],
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
const STEP_MS = 110;
const MAX_DELAY_MS = 1300;

function initAssemble(ctx) {
  const { root, cleanups } = ctx;
  if (ctx.reduceMotion || !('IntersectionObserver' in window)) return;
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
  if (!groups.length) return;
  const play = (group) => {
    group.section.classList.add('asm-live');
    group.items.forEach(({ el, anim }, i) => {
      const delay = Math.min(i * STEP_MS, MAX_DELAY_MS);
      el.style.animation = `${anim} 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms backwards`;
      el.classList.remove('asm-pending');
      el.addEventListener(
        'animationend',
        (e) => {
          if (e.target === el) el.style.animation = '';
        },
        { once: true },
      );
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
