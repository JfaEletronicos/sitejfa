import { trackEvent } from '../lib/analytics';

/**
 * Pop-up de lançamento da JFA Parts: abre logo depois que a página carrega
 * (uma vez por visita), toca o filme sem som e fecha pelo X, pelo fundo, pela
 * tecla Esc ou pelo "Saiba mais" (que abre a página da Parts).
 * @param {import('./context').BehaviorContext} ctx
 */
function initPartsLaunchPopup(ctx) {
  const { root, on, cleanups } = ctx;
  const popup = root.getElementById('partsLaunch');
  if (!popup) return;
  const video = root.getElementById('partsLaunchVideo');
  const cta = root.getElementById('partsLaunchCta');
  const KEY = 'jfa-parts-launch-seen';
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    popup.hidden = false;
    document.documentElement.classList.add('has-parts-launch');
    requestAnimationFrame(() => popup.classList.add('is-open'));
    if (video) {
      video.preload = 'auto';
      if (!ctx.reduceMotion) {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
    if (cta) cta.focus({ preventScroll: true });
    trackEvent('parts_launch_popup_view');
  };
  const close = (reason) => {
    if (popup.hidden) return;
    popup.classList.remove('is-open');
    document.documentElement.classList.remove('has-parts-launch');
    if (video) video.pause();
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* sem armazenamento: o pop-up pode voltar na próxima página aberta */
    }
    setTimeout(() => (popup.hidden = true), ctx.reduceMotion ? 0 : 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    trackEvent('parts_launch_popup_close', { reason });
  };

  popup.querySelectorAll('[data-parts-launch-close]').forEach((el) => on(el, 'click', () => close('close')));
  if (cta)
    on(cta, 'click', () => {
      trackEvent('parts_launch_popup_cta');
      close('cta');
    });
  on(document, 'keydown', (e) => {
    if (popup.hidden) return;
    if (e.key === 'Escape') close('esc');
    // Mantém o foco dentro do pop-up.
    if (e.key === 'Tab') {
      const items = Array.from(popup.querySelectorAll('button, a[href]'));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  let seen = false;
  try {
    seen = sessionStorage.getItem(KEY) === '1';
  } catch {
    /* sem armazenamento: mostra */
  }
  // Quem já chega pela página da Parts não precisa do convite.
  if (!seen && !/^#\/setores\/parts/.test(location.hash)) {
    const t = setTimeout(open, 600);
    cleanups.push(() => clearTimeout(t));
  }
}
export { initPartsLaunchPopup };
