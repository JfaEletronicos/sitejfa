import { trackEvent } from '../lib/analytics';
import { REPRESENTATIVES, STATE_TO_REPRESENTATIVE, INTERNATIONAL_SALES } from '../data/representatives';
import { createStateMap } from './stateMap';

/**
 * Representantes: mapa interativo do Brasil, busca por estado, painel de contato
 * e vendas internacionais (mesma seção na Home e na página #/representantes).
 * @param {import('./context').BehaviorContext} ctx
 */
function initRepresentatives(ctx) {
  createStateMap(ctx, {
    prefix: 'reps',
    entries: REPRESENTATIVES,
    stateMap: STATE_TO_REPRESENTATIVE,
    emptyText: 'Ainda n\xE3o encontramos um representante cadastrado para esta regi\xE3o.',
    intl: INTERNATIONAL_SALES,
    onContact: (rep, kind) => trackEvent('representative_contact', { representative: rep.id, kind }),
  });
}
export { initRepresentatives };
