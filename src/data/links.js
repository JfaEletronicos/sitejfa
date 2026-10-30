/** Links externos de compra usados no header e nas páginas de produto. */
// Shopee: substitui a antiga Loja Oficial (loja.jfaeletronicos.com) em todo o site.
export const SHOPEE_URL = 'https://shopee.com.br/m/jfa';
// Logos: símbolo na cor original e texto em branco (fundos escuros); a versão
// com o texto na cor original entra no modo claro.
export const SHOPEE_LOGO = '/images/brands/shopee-white.svg';
export const SHOPEE_LOGO_LIGHT = '/images/brands/shopee.svg';
export const MERCADO_LIVRE_LOGO = '/images/brands/mercado-livre-white.webp';
export const MERCADO_LIVRE_LOGO_LIGHT = '/images/brands/mercado-livre.webp';
export const MERCADO_LIVRE_URL =
  'https://meli.la/2RmSk1t';
// Anúncio próprio da bateria E-Lítio Náutica 12,8V 100Ah.
export const MERCADO_LIVRE_NAUTICA_12V_URL = 'https://meli.la/21Pti6U';
// Anúncios por produto (ids de products.js): um botão por item; `label` é a versão
// mostrada no botão. Produto fora desta lista usa MERCADO_LIVRE_URL.
export const MERCADO_LIVRE_PRODUCT_LINKS = {
  'fonte-carregador-bob-storm': [
    { label: '60A', url: 'https://meli.la/2eyoMQp' },
    { label: '90A', url: 'https://meli.la/12dkQHX' },
    { label: '120A', url: 'https://meli.la/1sgpCod' },
  ],
  'fonte-carregador-storm': [
    { label: '40A', url: 'https://meli.la/2KPccHe' },
    { label: '120A', url: 'https://meli.la/21ZkERM' },
    { label: '200A 220V', url: 'https://meli.la/2X2y21a' },
    { label: '200A Plus', url: 'https://meli.la/1vGnh81' },
  ],
  'fonte-carregador-storm-lite': [
    { label: '50A', url: 'https://meli.la/2kWBgx9' },
    { label: '60A', url: 'https://meli.la/2SfANUb' },
  ],
  'fonte-storm-lithium': [{ label: '70A', url: 'https://meli.la/1QWp6fw' }],
  'controle-redline': [
    { label: 'WR 1200m', url: 'https://meli.la/2VHaWvu' },
    { label: '8 botões', url: 'https://meli.la/2b3XTbY' },
  ],
  'controle-acqua-1200': [{ url: 'https://meli.la/2QYmHNb' }],
  'controle-k1200-universal': [{ url: 'https://meli.la/2yKDrBR' }],
};

// Botão flutuante do WhatsApp: telefone principal da JFA, +55 31 2533-6100.
export const WHATSAPP_FLOAT_PHONE = '553125336100';
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

// Redes sociais (rodapé).
export const INSTAGRAM_URL = 'https://www.instagram.com/jfaeletronicos/';
export const YOUTUBE_URL = 'https://www.youtube.com/user/JFACANAL';
