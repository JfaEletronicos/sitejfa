/**
 * JFA Parts (#/setores/parts): placas do catálogo/buscador e sócios da seção
 * "Nossa história".
 *
 * Placas: `model` é o código buscado; `application` agrupa (lavadoras etc.);
 * `compatibility` só é mostrada quando cadastrada (nunca inventar); `image` é
 * opcional (sem foto, o card mostra uma ilustração de placa com o código).
 * `keywords` são outros termos que o buscador aceita para o mesmo modelo.
 */
export const PARTS_BOARDS = [
  {
    model: 'BWL11',
    title: 'Placa eletrônica para lavadoras',
    application: 'Lavadora',
    compatibility: ['V1', 'V2', 'V3'],
    keywords: [],
    image: '',
  },
  {
    model: 'LTE12',
    title: 'Placa eletrônica para linha branca',
    application: 'Linha branca',
    compatibility: [],
    keywords: [],
    image: '',
  },
  {
    model: 'LED13',
    title: 'Placa eletrônica para lavadoras',
    application: 'Lavadora',
    compatibility: [],
    keywords: [],
    image: '',
  },
  {
    model: 'BWM08',
    title: 'Placa eletrônica para lavadoras',
    application: 'Lavadora',
    compatibility: [],
    keywords: [],
    image: '',
  },
];

/**
 * Sócios (seção "Nossa história"). O bloco só aparece para quem tiver `quote`;
 * `photo` é opcional (sem foto, mostra as iniciais).
 */
export const PARTS_PARTNERS = [
  { name: 'Anderson', role: 'Sócio', photo: '', quote: '' },
  { name: 'Flavio', role: 'Sócio', photo: '', quote: '' },
];

export const PARTS_WHATSAPP_PHONE = '553125336100';
