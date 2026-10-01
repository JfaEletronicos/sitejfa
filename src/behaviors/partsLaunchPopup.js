import { trackEvent } from '../lib/analytics';

/**
 * Pop-up de lançamento da JFA Parts. Já vem aberto no HTML (ver
 * PartsLaunchPopup.jsx) e entra com fade; aqui ficam o vídeo, o foco e o
 * fechamento (X, fundo, Esc ou "Saiba mais"). Uma vez por visita.
 * @param {import('./context').BehaviorContext} ctx
 */
function initPartsLaunchPopup(ctx) {
  const { root, on } = ctx;
  const popup = root.getElementById('partsLaunch');
  if (!popup) return;
  const video = root.getElementById('partsLaunchVideo');
  const cta = root.getElementById('partsLaunchCta');
  const KEY = 'jfa-parts-launch-seen';

  const close = (reason) => {
    if (popup.hidden || popup.classList.contains('is-closing')) return;
    popup.classList.add('is-closing');
    document.documentElement.classList.remove('has-parts-launch');
    if (video) video.pause();
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* sem armazenamento: pode voltar na próxima página aberta */
    }
    setTimeout(
      () => {
        popup.hidden = true;
        popup.classList.remove('is-open', 'is-closing');
      },
      ctx.reduceMotion ? 0 : 350,
    );
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

  if (!popup.hidden) {
    document.documentElement.classList.add('has-parts-launch');
    const box = root.getElementById('partsLaunchBox');
    if (box) box.focus({ preventScroll: true });
    if (video) {
      if (ctx.reduceMotion) video.pause();
      else {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
    trackEvent('parts_launch_popup_view');
  }
}
export { initPartsLaunchPopup };
