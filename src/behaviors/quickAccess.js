import { trackEvent } from '../lib/analytics';

/**
 * Acesso rápido: telemetria do atalho de WhatsApp.
 * @param {import('./context').BehaviorContext} ctx
 */
function initQuickAccess(ctx) {
  const { root, on } = ctx;
  const quickAccessWhatsapp = root.getElementById('quickAccessWhatsapp');
  if (quickAccessWhatsapp) {
    on(quickAccessWhatsapp, 'click', () => trackEvent('whatsapp_click', { source: 'quick_access' }));
  }
}
export { initQuickAccess };
