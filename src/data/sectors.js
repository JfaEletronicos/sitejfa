/**
 * Setores do menu "Setores" do header.
 * - Automotivo e Telecom: catálogos no layout da página de baterias (#/setores/:slug),
 *   com os produtos de `products.js` separados em grupos (as abas do filtro).
 * - Moov e Parts: páginas institucionais.
 */

// Ícones do menu e dos cards sem foto (traço, 24x24).
export const SECTOR_ICONS = {
  automotivo:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16v-3.2l1.8-4.3A2 2 0 0 1 7.6 7.3h8.8a2 2 0 0 1 1.8 1.2l1.8 4.3V16a1 1 0 0 1-1 1h-1.2M4 16a1 1 0 0 0 1 1h1.2m11.6 0H6.2M4.4 12.6h15.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.6" cy="17" r="1.7" stroke="currentColor" stroke-width="1.6"/><circle cx="16.4" cy="17" r="1.7" stroke="currentColor" stroke-width="1.6"/></svg>',
  telecom:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 11v10M9 21h6M8.5 7.5a5 5 0 0 0 0 7M15.5 7.5a5 5 0 0 1 0 7M5.6 4.6a9 9 0 0 0 0 12.8M18.4 4.6a9 9 0 0 1 0 12.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11" r="1.6" fill="currentColor"/></svg>',
  moov: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5.5" cy="16" r="3.5" stroke="currentColor" stroke-width="1.6"/><circle cx="18.5" cy="16" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 16 9 9h6l3.5 7M9 9l3 7h-1M8 6h3M15 9l-1-3h2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  parts:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

/** Itens do menu "Setores", na ordem em que aparecem. */
export const SECTOR_MENU = [
  { slug: 'automotivo', title: 'Automotivo', line: 'Áudio, controles, fontes e baterias.' },
  { slug: 'telecom', title: 'Telecom', line: 'Energia para sistemas conectados.' },
  { slug: 'moov', title: 'Moov', line: 'Mobilidade elétrica.' },
  { slug: 'parts', title: 'Parts', line: 'Placas eletrônicas para reposição.' },
];

/**
 * Catálogos por setor. `groups` são as abas do filtro; cada grupo lista ids de
 * `products.js`. `batterySector` puxa as baterias desse setor (com página própria).
 * Fotos e página de cada produto vêm de `productDetails.js` (sem detalhes, o card
 * mostra o ícone do setor e abre o manual).
 */
export const SECTOR_CATALOGS = {
  automotivo: {
    title: 'Tecnologia para o seu projeto automotivo.',
    batterySector: 'automotivo',
    batteryGroup: 'baterias',
    groups: [
      { key: 'baterias', label: 'Baterias', ids: [] },
      {
        key: 'audio',
        label: 'Áudio',
        ids: [
          'ap400x4',
          'ap800x4',
          'processador-audio-j4-redline',
          'conversor-rca-slim',
          'filtro-rca-antirruido',
        ],
      },
      {
        key: 'controles',
        label: 'Controles',
        ids: [
          'controle-redline',
          'controle-acqua-1200',
          'controle-k600',
          'controle-k600-universal',
          'controle-k1200-universal',
        ],
      },
      {
        key: 'fontes',
        label: 'Fontes e carregadores',
        ids: [
          'fonte-storm-lithium',
          'fonte-carregador-storm',
          'fonte-carregador-storm-lite',
          'fonte-carregador-bob-storm',
          'fonte-storm-220a',
          'fonte-storm-truck',
          'fonte-carregador-redline',
          'carregador-portatil-redline',
          'fontes-carregadores-sci',
          'fonte-m120a',
        ],
      },
      {
        key: 'acessorios',
        label: 'Acessórios',
        ids: ['pbs-protetor-baterias-serie', 'voltimetro-sequenciador-vs5hi', 'sr5-evolution'],
      },
    ],
  },
  telecom: {
    title: 'Energia para sistemas que precisam permanecer conectados.',
    groups: [
      { key: 'distribuicao', label: 'Distribuição', ids: ['patch-panel-regua-poe', 'pdu-dc'] },
      {
        key: 'energia',
        label: 'Energia',
        ids: ['fonte-nobreak', 'gerenciador-fonte-redundante', 'equalizador-balanceador-banco-baterias'],
      },
      {
        key: 'conversao',
        label: 'Conversão',
        ids: [
          'conversor-dc-dc-step-down-up',
          'inversor-senoidal-rack-1000w',
          'inversor-senoidal-rack-3000w-5000w',
        ],
      },
    ],
  },
};

/** Páginas institucionais (#/setores/moov e #/setores/parts). */
export const SECTOR_INSTITUTIONAL = {
  moov: {
    eyebrow: 'JFA Moov',
    title: 'Mobilidade elétrica.',
    sub: 'Tecnologia aplicada à mobilidade.',
    image: '/images/front_moov.webp',
    imageAlt: 'Bicicleta elétrica JFA Moov',
    story: [
      'Expandimos nossa atuação para soluções voltadas ao transporte elétrico, com foco principal em bicicletas elétricas e mobilidade com autonomia.',
      'A JFA Moov é a frente da JFA dedicada à mobilidade: a mesma experiência em energia e eletrônica, agora aplicada a quem se movimenta pela cidade.',
    ],
    manualsTab: 'moov',
    manualsLabel: 'Ver manuais da JFA Moov',
    whatsappText: 'Olá, quero saber mais sobre a JFA Moov!',
  },
  parts: {
    eyebrow: 'JFA Parts',
    title: 'Tecnologia para continuar funcionando.',
    sub: 'Placas eletrônicas para linha branca, desenvolvidas no Brasil.',
    image: '/images/front_parts.webp',
    imageAlt: 'Placa eletrônica JFA Parts',
    story: [
      'A história da JFA sempre foi movida por um princípio simples: entender uma necessidade e desenvolver a própria solução para ela. Foi assim que conhecimento, tecnologia e experiência foram se acumulando ao longo dos anos e abrindo espaço para novos caminhos.',
      'A JFA Parts nasce para levar o jeito JFA de desenvolver tecnologia às placas eletrônicas para linha branca, unindo fabricação própria, conhecimento técnico e uma estrutura construída para estar próxima de quem trabalha todos os dias fazendo equipamentos voltarem a funcionar.',
    ],
    accent: 'Uma nova história começa aqui. Com toda a experiência da JFA por trás.',
    manualsTab: 'parts',
    manualsLabel: 'Ver manuais da JFA Parts',
    whatsappText: 'Olá, quero saber mais sobre a JFA Parts!',
  },
};
