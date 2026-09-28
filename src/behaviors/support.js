import { trackEvent } from '../lib/analytics';
import { SUPPORT_CONTACTS, SUPPORT_STATE_MAP, SUPPORT_FALLBACK_ID } from '../data/support';
import { createStateMap } from './stateMap';

/**
 * Suporte: o mesmo mapa de Representantes, com os contatos de suporte técnico.
 * @param {import('./context').BehaviorContext} ctx
 */
function initSupport(ctx) {
  createStateMap(ctx, {
    prefix: 'sup',
    entries: SUPPORT_CONTACTS,
    stateMap: SUPPORT_STATE_MAP,
    fallbackId: SUPPORT_FALLBACK_ID,
    onContact: (entry, kind) =>
      trackEvent(kind === 'whatsapp' ? 'whatsapp_click' : 'support_contact', {
        source: 'support_page',
        contact: entry.id,
      }),
  });
}
export { initSupport };
