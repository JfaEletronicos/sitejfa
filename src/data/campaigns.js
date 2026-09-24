/**
 * Banners do carrossel de campanhas (Home e página de Baterias).
 * Cada item é uma arte pronta: imagem desktop (~2300x400) e mobile (~600x800),
 * destino do clique e texto alternativo. Para adicionar/remover uma campanha,
 * edite apenas este array.
 */
export const CAMPAIGN_BANNERS = [
  {
    id: 'energia-solar',
    name: 'JFA Energia Solar',
    desktopImage: '/images/banner_solar_desktop.webp',
    mobileImage: '/images/banner_solar_mobile.webp',
    href: 'https://loja.jfaeletronicos.com',
    alt: 'Campanha JFA Energia Solar: e-Lítio Pro para armazenar a energia solar produzida durante o dia e usar quando precisar.',
  },
  {
    id: 'elitio-nautica',
    name: 'JFA e-Lítio Náutica',
    desktopImage: '/images/banner_nautica_desktop.webp',
    mobileImage: '/images/banner_nautica_mobile.webp',
    href: 'https://loja.jfaeletronicos.com',
    alt: 'Campanha JFA e-Lítio Náutica: baterias de lítio para acompanhar sua rotina náutica, mais tempo na água.',
  },
  {
    id: 'elitio-pro-automotivo',
    name: 'JFA e-Lítio Pro Automotivo',
    desktopImage: '/images/banner_automotivo_desktop.webp',
    mobileImage: '/images/banner_automotivo_mobile.webp',
    href: 'https://loja.jfaeletronicos.com',
    alt: 'Campanha JFA e-Lítio Pro: energia de alta performance para projetos de som automotivo.',
  },
];
