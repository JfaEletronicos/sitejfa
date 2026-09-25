/** Links externos de compra usados no header e nas páginas de produto. */
export const STORE_URL = 'https://loja.jfaeletronicos.com';
export const MERCADO_LIVRE_URL =
  'https://www.mercadolivre.com.br/loja/jfa-eletronicos?item_id=MLB3492722035&category_id=MLB5672&official_store_id=223044&client=recoview-selleritems&recos_listing=true';

// Botão flutuante do WhatsApp: número do representante de São Paulo (Comercial JFA).
export const WHATSAPP_FLOAT_PHONE = '5531983895799';
export const WHATSAPP_FLOAT_URL =
  'https://api.whatsapp.com/send?phone=' +
  WHATSAPP_FLOAT_PHONE +
  '&text=' +
  encodeURIComponent('Olá! Vim pelo site da JFA e gostaria de mais informações.');

// Suporte técnico da JFA (mesmo número usado nos botões "Falar com a JFA" das páginas).
export const SUPPORT_WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=553125336100&text=' +
  encodeURIComponent('Olá! Preciso de suporte com um produto JFA.');
