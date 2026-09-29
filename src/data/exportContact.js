import { INTERNATIONAL_SALES } from './representatives';
import { t } from '../i18n';

/**
 * Contato de exportação (inglês/espanhol): WhatsApp de vendas internacionais,
 * usado no Hero, no acesso rápido, no botão flutuante, nas páginas de produto e
 * no rodapé.
 */
export const EXPORT_CONTACT = INTERNATIONAL_SALES.contacts[INTERNATIONAL_SALES.contacts.length - 1];
export const EXPORT_PHONE = EXPORT_CONTACT.phone.replace(/\D/g, '');
export const exportWhatsappUrl = (text = t('export.whatsappText')) =>
  'https://api.whatsapp.com/send?phone=' + EXPORT_PHONE + '&text=' + encodeURIComponent(text);
