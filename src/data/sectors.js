/**
 * Páginas de setor (#/setores/:slug). `whatsappText` é a mensagem
 * pré-preenchida do botão de WhatsApp. O headline de Náutica usa
 * `<span class="accent-fix">` porque a fonte Stretch Pro não desenha o acento de "á".
 */
export const SECTOR_PAGES = [
  {
    slug: 'automotivo',
    title: 'Automotivo',
    headline: 'Soluções JFA para Automotivo.',
    sub: 'Tecnologia aplicada a projetos automotivos.',
    intro:
      'Áudio, energia e eletrônica embarcada pensados para quem constrói e instala projetos automotivos.',
    whatsappText: 'Olá, quero saber mais sobre soluções JFA para Automotivo!',
  },
  {
    slug: 'motorhome',
    title: 'Motorhome',
    headline: 'Soluções JFA para Motorhome.',
    sub: 'Energia e tecnologia para acompanhar diferentes caminhos.',
    intro: 'Energia e autonomia pensadas para quem vive na estrada, sem abrir mão do conforto.',
    whatsappText: 'Olá, quero saber mais sobre soluções JFA para Motorhome!',
  },
  {
    slug: 'nautica',
    title: 'Náutica',
    headline: 'Soluções JFA para N<span class="accent-fix">á</span>utica.',
    sub: 'Tecnologia para aplicações que seguem além da terra.',
    intro: 'Energia confiável para embarcações, pensada para resistir à rotina náutica.',
    whatsappText: 'Olá, quero saber mais sobre soluções JFA para Náutica!',
  },
  {
    slug: 'telecom',
    title: 'Telecom',
    headline: 'Soluções JFA para Telecom.',
    sub: 'Energia e confiabilidade para sistemas que precisam permanecer conectados.',
    intro: 'Energia e distribuição pensadas para infraestrutura que não pode parar.',
    whatsappText: 'Olá, quero saber mais sobre soluções JFA para Telecom!',
  },
  {
    slug: 'moov',
    title: 'Moov',
    headline: 'JFA Moov.',
    sub: 'Tecnologia aplicada à mobilidade.',
    intro: 'A frente JFA dedicada a soluções de mobilidade.',
    whatsappText: 'Olá, quero saber mais sobre a JFA Moov!',
  },
  {
    slug: 'parts',
    title: 'Parts',
    headline: 'JFA Parts.',
    sub: 'Placas eletrônicas e tecnologia para continuar funcionando.',
    intro: 'Placas eletrônicas desenvolvidas no Brasil para técnicos e assistências técnicas.',
    whatsappText: 'Olá, quero saber mais sobre a JFA Parts!',
  },
];
