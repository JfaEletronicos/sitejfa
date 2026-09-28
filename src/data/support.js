import { SUPPORT_WHATSAPP_URL } from './links';

/**
 * Suporte técnico por estado (página #/suporte). Cada contato segue o mesmo
 * formato dos representantes; `SUPPORT_STATE_MAP` liga a UF ao id do contato.
 * Estado sem contato próprio cai no suporte central da JFA (`SUPPORT_FALLBACK_ID`).
 */
export const SUPPORT_CONTACTS = [
  {
    id: 'suporte-jfa',
    name: 'Suporte t\xE9cnico JFA',
    states: [],
    nationwide: true,
    servedLabel: 'todo o Brasil',
    phones: ['(31) 2533-6100'],
    whatsapp: SUPPORT_WHATSAPP_URL,
    whatsappLabel: 'Falar com o suporte',
    address: null,
  },
];

export const SUPPORT_STATE_MAP = {};

export const SUPPORT_FALLBACK_ID = 'suporte-jfa';
