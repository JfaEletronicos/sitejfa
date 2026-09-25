/**
 * Entrada "montando o site": cada seção da Home se monta de um jeito próprio
 * quando aparece na tela (uma vez só). As peças começam escondidas e entram
 * com a animação da seção, em sequência.
 * @param {import('./context').BehaviorContext} ctx
 */
const SECTIONS = [
  // Acesso rápido: blocos caem de cima e se encaixam.
  { section: '.quick-access', parts: ['.quick-access-item'], anim: 'asmDrop', step: 90 },
  // Frentes: palco revelado por uma cortina da esquerda para a direita; navegação desliza depois.
  { section: '#frontsSection', parts: ['.fronts-stage', '.fronts-nav'], anim: 'asmWipe', step: 260 },
  // Produtos: filtros surgem e a esteira de cards entra pela direita.
  {
    section: '#productsSection',
    parts: ['.products-toolbar', '.carousel-runway'],
    anim: 'asmSlideLeft',
    step: 220,
  },
  // Onde comprar: os dois cards vêm de lados opostos e a faixa de representantes sobe.
  {
    section: '#buySection',
    parts: ['.buy-grid > .buy-card:nth-child(1)', '.buy-grid > .buy-card:nth-child(2)', '.buy-rep-strip'],
    anims: ['asmFromLeft', 'asmFromRight', 'asmRise'],
    step: 140,
  },
  // Banner: abre como uma cortina a partir do centro.
  { section: '#campaignSection', parts: ['.campaign-carousel'], anim: 'asmCurtain', step: 0 },
  // JFA Parts: o card vira em 3D e os destaques aparecem um a um.
  {
    section: '#partsPromoSection',
    parts: ['.parts-promo-inner', '.parts-promo-card', '.parts-promo-media', '.parts-promo-cta-wrap'],
    anims: ['asmFlipUp', 'asmPop', 'asmZoomIn', 'asmPop'],
    step: 110,
  },
  // Faixa de palavras: estica da esquerda para a direita.
  { section: '#techMarquee', parts: ['.tech-marquee-band'], anim: 'asmStretch', step: 0 },
  // Representantes: texto entra pela esquerda e o mapa se aproxima.
  {
    section: '#repsSection',
    parts: ['.reps-text-col', '.reps-map-wrap'],
    anims: ['asmFromLeft', 'asmZoomOut'],
    step: 200,
  },
  // Manuais: a busca se abre do centro e as abas aparecem em sequência.
  {
    section: '#manualsSection',
    parts: ['.manuals-search-wrap', '.manuals-tabs > *'],
    anims: ['asmExpand', 'asmPop'],
    step: 70,
  },
  // Rodapé: sobe em bloco com uma linha de luz no topo.
  { section: '#jfaFooter', parts: ['.jfa-footer-inner'], anim: 'asmLift', step: 0 },
];

function initAssemble(ctx) {
  const { root, cleanups } = ctx;
  if (ctx.reduceMotion || !('IntersectionObserver' in window)) return;
  const groups = [];
  SECTIONS.forEach((cfg) => {
    const section = root.querySelector(cfg.section);
    if (!section) return;
    const items = [];
    cfg.parts.forEach((sel, pi) => {
      section.querySelectorAll(sel).forEach((el) => {
        items.push({ el, anim: cfg.anims ? cfg.anims[pi] : cfg.anim });
      });
    });
    if (!items.length) return;
    items.forEach(({ el }) => el.classList.add('asm-pending'));
    section.classList.add('asm-section');
    groups.push({ section, items, step: cfg.step });
  });
  if (!groups.length) return;
  const play = (group) => {
    group.section.classList.add('asm-live');
    group.items.forEach(({ el, anim }, i) => {
      el.style.animation = `${anim} 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * group.step}ms backwards`;
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
