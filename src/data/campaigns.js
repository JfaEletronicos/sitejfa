/**
 * Banners do carrossel de campanhas da Home.
 * Cada item é uma arte pronta: imagem desktop (~2000x271), imagem mobile
 * opcional (~600x800), destino do clique e texto alternativo. Para
 * adicionar/remover uma campanha, edite apenas este array.
 */
const somAutomotivo = (id) => ({
  id,
  name: 'JFA e-Lítio Pro Som Automotivo',
  desktopImage: '/images/banner_som_automotivo_desktop.webp',
  href: '#/baterias/e-litio-pro-12-8v/50ah',
  alt: 'Campanha JFA e-Lítio Pro: seu som pede mais, a bateria entrega. Energia de alta performance para projetos de som automotivo.',
});

// A mesma arte nas três posições, para manter o movimento do carrossel.
export const CAMPAIGN_BANNERS = [
  somAutomotivo('elitio-pro-som-1'),
  somAutomotivo('elitio-pro-som-2'),
  somAutomotivo('elitio-pro-som-3'),
];
