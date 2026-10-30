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
  'https://www.mercadolivre.com.br/social/mp20241020101949?matt_word=mp20241020101949&matt_tool=20296064&forceInApp=true&ref=BOhp9LwkF8noYTt%2BXIz7Uq8EI%2BSQIsGbxhZL7yrEYt8BZC2zXjdxtlsvC4T%2F1mipTt3z8GDYe804Uky7ggz%2FlmmDUygWZdPC619ZZi23BWS7ff2ZfihErWgVZwCE8J9tGg3l9RMryM9ldKqRAwbLYk6iUPHycWL64KHv%2FBBOaXXm79Z7KSXOMADjSMbbPo1%2BXfvYjWDMyshvDgIy035ZzQbjBhrP0y9RezcSYj5uc%2BEFDF2c4R22rkOuDDCtv%2B82iMyBXI9%2F';

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
