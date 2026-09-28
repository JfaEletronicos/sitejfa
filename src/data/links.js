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

// JFA Moov: categoria de bicicletas elétricas da loja oficial, e-mail e WhatsApp
// de atendimento (o número publicado no site da loja).
export const MOOV_STORE_URL = 'https://www.lojacamelstore.com/bicicleta-eletrica';
export const MOOV_EMAIL = 'atendimento@lojacamelstore.com';
export const MOOV_WHATSAPP_LABEL = '(31) 98902-0339';
export const MOOV_WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=5531989020339&text=' +
  encodeURIComponent('Olá! Vim pelo site da JFA e quero saber mais sobre as bicicletas elétricas.');

// Suporte técnico da JFA (mesmo número usado nos botões "Falar com a JFA" das páginas).
export const SUPPORT_WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=553125336100&text=' +
  encodeURIComponent('Olá! Preciso de suporte com um produto JFA.');
