import { SHOW_MOOV, SHOW_PARTS } from './visibility';

/**
 * Categorias do menu "Categorias" do header (as baterias não têm mais um lugar à
 * parte: cada categoria mostra as suas).
 * - Automotivo, Telecom, Motorhome, Solar e Náutica: catálogos no layout da página
 *   de baterias (#/setores/:slug), com os produtos de `products.js` separados em
 *   grupos (as abas do filtro) e as baterias do setor (`batterySector`).
 * - JFA Parts e Moov: landing pages próprias (PartsPage.jsx e MoovPage.jsx).
 */

// Ícones do menu e dos cards sem foto (traço, 24x24).
export const SECTOR_ICONS = {
  automotivo:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16v-3.2l1.8-4.3A2 2 0 0 1 7.6 7.3h8.8a2 2 0 0 1 1.8 1.2l1.8 4.3V16a1 1 0 0 1-1 1h-1.2M4 16a1 1 0 0 0 1 1h1.2m11.6 0H6.2M4.4 12.6h15.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.6" cy="17" r="1.7" stroke="currentColor" stroke-width="1.6"/><circle cx="16.4" cy="17" r="1.7" stroke="currentColor" stroke-width="1.6"/></svg>',
  telecom:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 11v10M9 21h6M8.5 7.5a5 5 0 0 0 0 7M15.5 7.5a5 5 0 0 1 0 7M5.6 4.6a9 9 0 0 0 0 12.8M18.4 4.6a9 9 0 0 1 0 12.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11" r="1.6" fill="currentColor"/></svg>',
  motorhome:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 17V7.5A1.5 1.5 0 0 1 4.5 6H15l3.2 4.2 2.1.9a1 1 0 0 1 .7.9V17h-1.6M3 17h1.4m4.2 0h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="5.6" y="8.6" width="3.6" height="2.8" rx=".5" stroke="currentColor" stroke-width="1.4"/><rect x="11" y="8.6" width="3.6" height="2.8" rx=".5" stroke="currentColor" stroke-width="1.4"/><circle cx="6.5" cy="17" r="1.9" stroke="currentColor" stroke-width="1.6"/><circle cx="17.8" cy="17" r="1.9" stroke="currentColor" stroke-width="1.6"/></svg>',
  solar:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="2.6" stroke="currentColor" stroke-width="1.6"/><path d="M12 1.8v1.2M16.6 3.4l-.8.8M18.2 7H17M7 7H5.8M8.2 4.2l-.8-.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 12.5h14l2 8H3l2-8ZM4 16.5h16M9.6 12.5l-1 8M14.4 12.5l1 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  nautica:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v11M12 3l6 9h-6M12 5 7 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 15h17l-2.2 3.4a2 2 0 0 1-1.7.9H7.4a2 2 0 0 1-1.7-.9L3.5 15Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 21.5c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  moov: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5.5" cy="16" r="3.5" stroke="currentColor" stroke-width="1.6"/><circle cx="18.5" cy="16" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 16 9 9h6l3.5 7M9 9l3 7h-1M8 6h3M15 9l-1-3h2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  parts:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

/** Itens do menu "Categorias", na ordem em que aparecem. */
export const SECTOR_MENU = [
  { slug: 'automotivo', title: 'Automotivo', line: 'Áudio, controles, fontes e baterias.' },
  { slug: 'telecom', title: 'Telecom', line: 'Energia, distribuição e inversores.' },
  { slug: 'motorhome', title: 'Motorhome', line: 'Energia para a estrada.' },
  { slug: 'solar', title: 'Solar', line: 'Baterias para armazenar energia.' },
  { slug: 'nautica', title: 'Náutica', line: 'Baterias para ir a bordo.' },
  // OCULTO: Moov/Parts — só entram no menu com as flags de data/visibility.js.
  ...(SHOW_PARTS ? [{ slug: 'parts', title: 'JFA Parts', line: 'Placas eletrônicas para reposição.' }] : []),
  ...(SHOW_MOOV ? [{ slug: 'moov', title: 'Moov', line: 'Mobilidade elétrica.' }] : []),
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
    // Baterias em rack.
    batterySector: 'telecom',
    batteryGroup: 'baterias',
    groups: [
      { key: 'baterias', label: 'Baterias', ids: [] },
      {
        key: 'distribuicao',
        label: 'Distribuição',
        ids: ['patch-panel-poe-gerenciavel', 'patch-panel-poe-giga', 'patch-panel-poe-fast', 'pdu-dc'],
      },
      {
        key: 'energia',
        label: 'Energia',
        ids: [
          'fonte-nobreak',
          'fonte-nobreak-snmp',
          'gerenciador-fonte-redundante',
          'equalizador-balanceador-banco-baterias',
        ],
      },
      { key: 'conversao', label: 'Conversão', ids: ['conversor-dc-dc-step-down-up'] },
      // Os inversores ficam no Telecom (o Black fica no Motorhome).
      {
        key: 'inversores',
        label: 'Inversores',
        ids: ['inversor-senoidal-rack-1000w', 'inversor-senoidal-rack-3000w-5000w'],
      },
    ],
  },
  motorhome: {
    title: 'Energia para quem vive na estrada.',
    groups: [{ key: 'inversores', label: 'Inversores', ids: ['inversor-offgrid-senoidal-black'] }],
  },
  // Solar: só baterias (nenhum inversor): E-Lítio Pro 12,8V e Pro 48V 50Ah.
  solar: {
    title: 'Armazene energia para usar quando precisar.',
    batterySector: 'solar',
    batteryGroup: 'baterias',
    groups: [{ key: 'baterias', label: 'Baterias', ids: [] }],
  },
  nautica: {
    title: 'Energia preparada para ir a bordo.',
    batterySector: 'nautico',
    batteryGroup: 'baterias',
    groups: [{ key: 'baterias', label: 'Baterias', ids: [] }],
  },
};
