/**
 * Catálogo das baterias (páginas /baterias/:slug e /baterias/:slug/:variante), usado pelo
 * roteador, pelos catálogos das categorias e pelas páginas geradas no build (src/seo).
 */
import { MERCADO_LIVRE_URL } from './links';
import { SHOW_BATERIAS_AUTOMOTIVO } from './visibility';

const RAW_BATTERY_CATALOG = [
  // E-Lítio Pro 12,8V: uma página só, com as capacidades 50Ah e 100Ah como
  // variantes (fotos, recursos, manual e selos próprios de cada uma).
  {
    id: 'elitio-pro-12-8v',
    slug: 'e-litio-pro-12-8v',
    name: 'E-L\xEDtio Pro 12,8V',
    voltage: '12,8V',
    capacity: '50Ah | 100Ah',
    technology: 'LiFePO4',
    sectors: ['solar', 'automotivo', 'motorhome'],
    features: ['BMS'],
    shortDescription: 'Armazenamento inteligente de energia em duas capacidades.',
    image: '/images/bateria_elitio_pro_12v8_100a.webp',
    defaultVariant: '100ah',
    variants: [
      {
        key: '50ah',
        capacity: '50Ah',
        features: ['BMS'],
        marketingHeadline: 'Energia compacta, controle sempre presente.',
        longDescription:
          'Gerenciamento BMS em um tamanho reduzido, para sistemas de armazenamento de energia que precisam de estabilidade.',
        images: [
          '/images/bateria_elitio_pro_12v8_50a.webp',
          '/images/bateria_elitio_pro_12v8_50a_a1.webp',
          '/images/bateria_elitio_pro_12v8_50a_a2.webp',
          '/images/bateria_elitio_pro_12v8_50a_a4.webp',
        ],
        // Mesmo produto de PRODUCTS['bateria-litio-12v-50a'] (alias "E-Lítio Pro 12V 50A").
        manualUrl:
          'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/E-LITIO-PRO-12V50A-MANUAL-RV02-25-11-25.pdf',
        certifications: ['inmetro', 'anatel'],
      },
      {
        key: '100ah',
        capacity: '100Ah',
        features: ['BMS', 'Bluetooth'],
        marketingHeadline: 'Energia armazenada. Controle na sua m\xE3o.',
        longDescription:
          'Gerenciamento BMS e conectividade Bluetooth para acompanhar a bateria de perto, com a estabilidade e a autonomia que sistemas de armazenamento de energia exigem.',
        images: [
          '/images/bateria_elitio_pro_12v8_100a.webp',
          '/images/bateria_elitio_pro_12v8_100a_a2.webp',
          '/images/bateria_elitio_pro_12v8_100a_a3.webp',
        ],
        // Mesmo produto de PRODUCTS['bateria-litio-12v-100a'] (alias "E-Lítio Pro 12V 100A").
        manualUrl: 'https://jfaeletronicos.com/qr-code/L12V100A.pdf',
        certifications: ['inmetro', 'anatel'],
      },
    ],
    commerce: { mercadoLivreUrl: MERCADO_LIVRE_URL },
    relatedProducts: [],
  },
  {
    id: 'elitio-pro-solar-48v-100ah-rack',
    slug: 'e-litio-pro-solar-48v-100ah-rack',
    name: 'E-L\xEDtio Pro Solar 48V 100Ah Rack',
    voltage: '48V',
    capacity: '100Ah',
    technology: 'LiFePO4',
    // Rack: Energia e Solar (e, como toda bateria que não é náutica, também Automotivo).
    sectors: ['energia', 'solar', 'automotivo'],
    features: ['Rack'],
    shortDescription: 'Integra\xE7\xE3o em rack para sistemas de energia de maior porte.',
    marketingHeadline: 'Mais capacidade em formato rack.',
    longDescription:
      'Formato rack para uma integra\xE7\xE3o organizada em sistemas de energia de maior porte.',
    image: '/images/bateria_elitio_pro_48v100a.webp',
    images: [
      '/images/bateria_elitio_pro_48v100a_a1.webp',
      '/images/bateria_elitio_pro_48v100a_a2.webp',
      '/images/bateria_elitio_pro_48v100a_a3.webp',
      '/images/bateria_elitio_pro_48v100a.webp',
    ],
    manualUrl: 'https://jfaeletronicos.com/qr-code/P48V100AM.pdf',
    commerce: {},
    relatedProducts: [],
  },
  {
    id: 'elitio-pro-solar-48v-50ah-rack',
    slug: 'e-litio-pro-solar-48v-50ah-rack',
    name: 'E-L\xEDtio Pro Solar 48V 50Ah Rack',
    voltage: '48V',
    capacity: '50Ah',
    technology: 'LiFePO4',
    // Mesmos setores da versão 100Ah Rack.
    sectors: ['energia', 'solar', 'automotivo'],
    features: ['Rack'],
    shortDescription: 'Formato rack 48V para sistemas solares e de energia.',
    marketingHeadline: 'Formato rack com 2,4 kWh em 48V.',
    longDescription:
      'M\xF3dulo de rack 48V em LiFePO4 com painel de controle frontal, para uma integra\xE7\xE3o organizada em sistemas solares e de energia.',
    image: '/images/bateria_elitio_pro_48v50a_rack.webp',
    images: [
      '/images/bateria_elitio_pro_48v50a_rack_a1.webp',
      '/images/bateria_elitio_pro_48v50a_rack_a2.webp',
      '/images/bateria_elitio_pro_48v50a_rack.webp',
    ],
    // Anúncio próprio no Mercado Livre (enviado pela JFA).
    commerce: {
      mercadoLivreUrl:
        'https://www.mercadolivre.com.br/bateria-e-litio-pro-solar-jfa-48v-50a-rack-lifepo4/p/MLB2085939654?pdp_filters=item_id:MLB6784407186',
    },
    relatedProducts: [],
  },
  {
    id: 'elitio-pro-48v-50ah',
    slug: 'e-litio-pro-48v-50ah',
    name: 'E-L\xEDtio Pro 48V 50Ah',
    voltage: '48V',
    capacity: '50Ah',
    technology: 'LiFePO4',
    sectors: ['automotivo'],
    // OCULTO: baterias Automotivo — enquanto a flag estiver desligada, fica em Energia.
    sectorsSemAutomotivo: ['energia', 'solar'],
    features: ['BMS'],
    shortDescription: 'Para sistemas de armazenamento que trabalham em alta tens\xE3o.',
    marketingHeadline: 'Alta tens\xE3o, energia sob controle.',
    longDescription:
      'Gerenciamento BMS e painel de controle integrado para acompanhar a opera\xE7\xE3o de sistemas de armazenamento de energia que exigem estabilidade.',
    image: '/images/bateria_elitio_pro_48v50a.webp',
    images: [
      '/images/bateria_elitio_pro_48v50a.webp',
      '/images/bateria_elitio_pro_48v50a_a1.webp',
      '/images/bateria_elitio_pro_48v50a_a2.webp',
      '/images/bateria_elitio_pro_48v50a_a3.webp',
    ],
    // Mesmo produto de PRODUCTS['bateria-litio-48v-50a'] (alias "E-Lítio Pro 48V 50A").
    manualUrl: 'https://jfaeletronicos.com/qr-code/L48V50A.pdf',
    commerce: {},
    relatedProducts: [],
  },
  {
    id: 'elitio-nautica-12-8v-100ah',
    slug: 'e-litio-nautica-12-8v-100ah',
    name: 'E-L\xEDtio N\xE1utica 12,8V 100Ah',
    voltage: '12,8V',
    capacity: '100Ah',
    technology: 'LiFePO4',
    sectors: ['nautico'],
    features: [],
    shortDescription: 'Energia e autonomia para aplica\xE7\xF5es em embarca\xE7\xF5es.',
    marketingHeadline: 'Energia preparada para ir a bordo.',
    longDescription:
      'Desenvolvida para aplica\xE7\xF5es n\xE1uticas que exigem autonomia, estabilidade e confiabilidade em qualquer trajeto.',
    image: '/images/bateria_elitio_nautica_12v8_100a.webp',
    images: [
      '/images/bateria_elitio_nautica_12v8_100a.webp',
      '/images/bateria_elitio_nautica_12v8_100a_a2.webp',
      '/images/bateria_elitio_nautica_12v8_100a_a3.webp',
    ],
    manualUrl: 'https://jfaeletronicos.com/qr-code/N12V100AP.pdf',
    commerce: {},
    relatedProducts: [],
  },
  // E-Lítio Pro 25,6V: uma página só, com as capacidades 50Ah e 100Ah como
  // variantes (mesmo formato da Pro 12,8V).
  {
    id: 'elitio-pro-25-6v',
    slug: 'e-litio-pro-25-6v',
    name: 'E-L\xEDtio Pro 25,6V',
    voltage: '25,6V',
    capacity: '50Ah | 100Ah',
    technology: 'LiFePO4',
    sectors: ['automotivo', 'motorhome'],
    features: ['BMS'],
    shortDescription: 'Energia est\xE1vel e monitorada em duas capacidades.',
    image: '/images/bateria_elitio_pro_25v6_100a.webp',
    defaultVariant: '100ah',
    variants: [
      {
        key: '50ah',
        capacity: '50Ah',
        features: ['BMS'],
        marketingHeadline: 'Mais tens\xE3o para o seu sistema de energia.',
        longDescription:
          'Gerenciamento BMS para sistemas de armazenamento de energia que exigem estabilidade e controle.',
        images: [
          '/images/bateria_elitio_pro_25v6_50a.webp',
          '/images/bateria_elitio_pro_25v6_50a_a1.webp',
          '/images/bateria_elitio_pro_25v6_50a_a2.webp',
          '/images/bateria_elitio_pro_25v6_50a_a3.webp',
        ],
        manualUrl: 'https://jfaeletronicos.com/qr-code/L25V50A.pdf',
      },
      {
        key: '100ah',
        capacity: '100Ah',
        features: ['BMS'],
        marketingHeadline: 'Mais capacidade para projetos maiores.',
        longDescription:
          'Gerenciamento BMS para sistemas de armazenamento de energia que precisam de maior autonomia.',
        images: ['/images/bateria_elitio_pro_25v6_100a.webp'],
        manualUrl: 'https://jfaeletronicos.com/qr-code/L25V100A.pdf',
      },
    ],
    commerce: {},
    relatedProducts: [],
  },
  {
    id: 'elitio-nautica-25-6v-100ah',
    slug: 'e-litio-nautica-25-6v-100ah',
    name: 'E-L\xEDtio N\xE1utica 25,6V 100Ah',
    voltage: '25,6V',
    capacity: '100Ah',
    technology: 'LiFePO4',
    sectors: ['nautico'],
    features: [],
    shortDescription: 'Mais energia e autonomia para embarca\xE7\xF5es que exigem maior capacidade.',
    marketingHeadline: 'Mais autonomia para ir mais longe na \xE1gua.',
    longDescription:
      'Desenvolvida para aplica\xE7\xF5es n\xE1uticas que exigem estabilidade e confiabilidade em trajetos mais longos.',
    image: '/images/bateria_elitio_nautica_25v6_100a.webp',
    manualUrl: 'https://jfaeletronicos.com/qr-code/N25V100AP.pdf',
    commerce: {},
    relatedProducts: [],
  },
];
// Cada bateria existe uma única vez por id e por slug (a primeira ocorrência vence).
export const BATTERY_CATALOG = RAW_BATTERY_CATALOG.filter((b, i, all) => {
  const dupe = all.findIndex((x) => x.id === b.id || x.slug === b.slug) !== i;
  if (dupe && import.meta.env.DEV) console.warn('[baterias] item duplicado ignorado:', b.id);
  return !dupe;
});
// OCULTO: baterias Automotivo. Tira o setor "automotivo" das baterias (catálogo da
// categoria e botões de aplicação da página); os dados acima ficam intactos.
if (!SHOW_BATERIAS_AUTOMOTIVO) {
  BATTERY_CATALOG.forEach((b) => {
    b.sectors = b.sectors.filter((s) => s !== 'automotivo');
    if (!b.sectors.length && b.sectorsSemAutomotivo) b.sectors = b.sectorsSemAutomotivo;
  });
}
// Links antigos das baterias que viraram variantes de uma página só.
export const SLUG_ALIASES = {
  'e-litio-pro-12v-100ah': ['e-litio-pro-12-8v', '100ah'],
  'e-litio-pro-12-8v-50ah': ['e-litio-pro-12-8v', '50ah'],
  'e-litio-pro-25-6v-50ah': ['e-litio-pro-25-6v', '50ah'],
  'e-litio-pro-25-6v-100ah': ['e-litio-pro-25-6v', '100ah'],
};
