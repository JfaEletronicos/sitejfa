/**
 * Prévia RLX Importe: piso da Hero montado régua por régua e entrada
 * "montando o site" em cada seção (mesmo padrão do behaviors/assemble.js da JFA).
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header de vidro ao rolar.
  var header = document.querySelector('.rlx-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Piso da Hero: fileiras de réguas com emendas desencontradas e tons variados.
  var floor = document.querySelector('.rlx-floor');
  var ROWS = 12;
  floor.style.setProperty('--rows', ROWS);
  var planks = [];
  for (var r = 0; r < ROWS; r++) {
    var row = document.createElement('div');
    row.className = 'rlx-floor-row';
    // Primeira régua de cada fileira com tamanho diferente para desencontrar as emendas.
    var widths = [0.4 + ((r * 0.37) % 1) * 1.4];
    for (var i = 0; i < 7; i++) widths.push(2.2 + ((r * 7 + i * 3) % 5) * 0.25);
    widths.forEach(function (w, i) {
      var p = document.createElement('span');
      p.className = 'rlx-plank';
      p.style.setProperty('--w', w.toFixed(2));
      p.style.setProperty('--h', 25 + ((r * 5 + i * 11) % 6));
      p.style.setProperty('--s', 42 + ((r * 3 + i * 7) % 8) + '%');
      p.style.setProperty('--l', 36 + ((r * 13 + i * 5) % 12) + '%');
      p.style.setProperty('--tilt', (i % 2 ? 4 : -4) + 'deg');
      row.appendChild(p);
      planks.push({ el: p, r: r, i: i });
    });
    floor.appendChild(row);
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('asm-on');

  // Instalação: da fileira da frente para o fundo, da esquerda para a direita.
  planks.forEach(function (p) {
    var order = (ROWS - 1 - p.r) * 0.7 + p.i;
    p.el.style.animation =
      'rlxPlank 0.9s cubic-bezier(0.16, 1, 0.3, 1) ' + Math.round(order * 45) + 'ms backwards';
  });

  var STEP_MS = 110;
  var MAX_DELAY_MS = 1300;
  var animate = function (el, delay) {
    var anim = el.getAttribute('data-asm') || 'asmRise';
    el.style.animation = anim + ' 1.1s cubic-bezier(0.16, 1, 0.3, 1) ' + delay + 'ms backwards';
    el.classList.add('asm-done');
    el.addEventListener(
      'animationend',
      function (e) {
        if (e.target === el) el.style.animation = '';
      },
      { once: true },
    );
  };

  var sections = document.querySelectorAll('.rlx-hero, .rlx-section');
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var section = entry.target;
        obs.unobserve(section);
        section.classList.add('asm-live');
        // Na Hero, o texto entra depois que as primeiras réguas assentam.
        var base = section.classList.contains('rlx-hero') ? 350 : 0;
        section.querySelectorAll('.asm').forEach(function (el, i) {
          animate(el, base + Math.min(i * STEP_MS, MAX_DELAY_MS));
        });
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  sections.forEach(function (s) {
    obs.observe(s);
  });
})();
