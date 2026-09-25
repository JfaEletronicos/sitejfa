/**
 * Banners do carrossel de campanhas da Home.
 * Cada item é uma arte pronta: imagem desktop (~2000x271), imagem mobile
 * opcional (~600x800), destino do clique e texto alternativo. Para
 * adicionar/remover uma campanha, edite apenas este array.
 */
export const CAMPAIGN_BANNERS = [
  {
    id: 'elitio-pro-som',
    name: 'JFA e-Lítio Pro Som Automotivo',
    desktopImage: '/images/banner_som_automotivo_desktop.webp',
    href: '#/baterias/e-litio-pro-12-8v/50ah',
    alt: 'Campanha JFA e-Lítio Pro: seu som pede mais, a bateria entrega. Energia de alta performance para projetos de som automotivo.',
  },
  {
    id: 'energia-solar',
    name: 'JFA Energia Solar',
    desktopImage: '/images/banner_solar_2000.webp',
    href: '#/baterias/e-litio-pro-solar-48v-100ah-rack',
    alt: 'Campanha JFA Energia Solar que não depende do horário: armazene a energia produzida durante o dia para usar quando precisar.',
  },
  {
    id: 'elitio-nautica',
    name: 'JFA e-Lítio Náutica',
    desktopImage: '/images/banner_nautica_2000.webp',
    href: '#/baterias/e-litio-nautica-12-8v-100ah',
    alt: 'Campanha JFA e-Lítio Náutica: mais tempo na água, menos preocupação com energia. Baterias de lítio para acompanhar sua rotina náutica.',
  },
];
