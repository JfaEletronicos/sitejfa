/**
 * Catálogo de produtos/manuais usado pela busca global do header e pela
 * seção Manuais. `lines` indica as linhas (automotivo/energia) do produto,
 * `aliases` alimenta a busca e `status: 'discontinued'` marca itens fora de linha.
 */
const A = 'automotivo';
const E = 'energia';
export const PRODUCTS = [
  {
    id: 'bateria-litio-12v-50a',
    name: 'Bateria de Lítio 12.8V 50A',
    lines: [A, E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 12V 50A', 'E-Lítio Pro 12.8V 50A', 'Bateria 50A', 'LiFePO4 50A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/E-LITIO-PRO-12V50A-MANUAL-RV02-25-11-25.pdf',
  },
  {
    id: 'bateria-litio-12v-100a',
    name: 'Bateria de Lítio 12.8V 100A',
    lines: [A, E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 12V 100A', 'E-Lítio Pro 12.8V 100A', 'Bateria 100A', 'LiFePO4 100A'],
    status: 'current',
    manualUrl: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/L12V100A.pdf',
  },
  {
    id: 'bateria-litio-25v-100a',
    name: 'Bateria de Lítio 25.6V 100A',
    lines: [E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 25V 100A', 'E-Lítio Pro 25.6V 100A', '25V100A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/E-LITIO-PRO-25V100A-MANUAL-RV02-24-11-25.pdf',
  },
  {
    id: 'bateria-litio-48v-50a',
    name: 'Bateria de Lítio 48V 50A',
    lines: [E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 48V 50A', '48V50A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/E-LITIO-PRO-48V50A-PACK-INM-Guia-Rapido-sem-SNMP.pdf',
  },
  {
    id: 'bateria-litio-48v-100a',
    name: 'Bateria de Lítio 48V 100A',
    lines: [E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 48V 100A', '48V100A'],
    status: 'current',
    manualUrl: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/L48V100A.pdf',
  },
  {
    id: 'bateria-litio-nautica-25v-100a',
    name: 'Bateria de Lítio Náutica 25.6V 100A',
    lines: [E],
    category: 'Baterias',
    aliases: [
      'E-Lítio Náutica',
      'E-Lítio Pro Náutica',
      'Bateria Náutica',
      'Náutica 25V',
      'Náutica 25.6V 100A',
    ],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/E-LITIO-NAUTICA-25V100A-MANUAL-RV02-25-11-25.pdf',
  },
  {
    id: 'bateria-litio-51v-280a',
    name: 'Bateria de Lítio 51.6V 280A',
    lines: [E],
    category: 'Baterias',
    aliases: ['E-Lítio Pro 51V 280A', '51.6V280A', 'Rack 280A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/07/E-LITIO-PRO-51V-280A-RACK-INM-MANUAL-RV03-080626.pdf',
  },
  {
    id: 'ap400x4',
    name: 'AP400Wx4',
    lines: [A],
    category: 'Amplificadores',
    aliases: ['AP400x4', 'AP400', 'Amplificador AP400'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/11/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-2111.pdf',
  },
  {
    id: 'ap800x4',
    name: 'AP800Wx4',
    lines: [A],
    category: 'Amplificadores',
    aliases: ['AP800x4', 'AP800', 'Amplificador AP800'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/11/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-2111.pdf',
  },
  {
    id: 'controle-acqua-1200',
    name: 'Controle Acqua 1200',
    lines: [A],
    category: 'Controles',
    aliases: ['Acqua', 'Acqua 1200', 'Controle Acqua', 'Acqua Universal'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-ACQUA-Manual-RV09.pdf',
  },
  {
    id: 'controle-k600',
    name: 'Controle K600',
    lines: [A],
    category: 'Controles',
    aliases: ['K600', 'Controle 600'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K600-Manual-RV09.pdf',
  },
  {
    id: 'controle-k600-universal',
    name: 'Controle K600 Universal',
    lines: [A],
    category: 'Controles',
    aliases: ['K600 Universal', 'Controle Universal K600'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K600-Manual-RV09.pdf',
  },
  {
    id: 'controle-k1200-universal',
    name: 'Controle K1200 Universal',
    lines: [A],
    category: 'Controles',
    aliases: ['K1200', 'K1200 Universal', 'Controle K1200', 'Controle Universal K1200'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K1200-Manual-RV09.pdf',
  },
  {
    id: 'controle-redline',
    name: 'Controle RedLine',
    lines: [A],
    category: 'Controles',
    aliases: ['Redline', 'Controle Redline', 'K1200 Redline'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-REDLINE-WR-SWC-Manual-RV09.pdf',
  },
  {
    id: 'fonte-carregador-storm-lite',
    name: 'Fonte e Carregador Storm Lite',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Storm Lite', 'Fonte Storm Lite', 'Carregador Storm Lite'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/Fontes-STORM-Lite-Manual.pdf',
  },
  {
    id: 'fonte-carregador-bob-storm',
    name: 'Fonte e Carregador Bob Storm',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Bob Storm', 'Fonte Bob', 'Fonte Bob Storm'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/FONTES-BOB-MANUAL-RV02-27-03-25.pdf',
  },
  {
    id: 'fonte-carregador-storm',
    name: 'Fonte e Carregador Storm',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Storm', 'Fonte Storm', 'Fonte e Carregador Storm'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/07/FONTES-STORM-MANUAL-RV03-11-07-25.pdf',
  },
  {
    id: 'fonte-storm-220a',
    name: 'Fonte Storm 220A',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Storm 220', 'Storm 220A', 'Fonte 220A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/05/MANUAL-FONTE-STORM-220-1.pdf',
  },
  {
    id: 'fonte-carregador-redline',
    name: 'Fonte e Carregador RedLine',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Fonte Redline', 'Redline', 'Carregador Redline'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-redline-RV01.pdf',
  },
  {
    id: 'carregador-portatil-redline',
    name: 'Carregador Portátil RedLine',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Carregador Redline Portátil', 'Redline portátil', 'F60A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-carregador-60A-portatil-redline-manual-rv01.pdf',
  },
  {
    id: 'fonte-carregador-sci-10a',
    name: 'Fonte e Carregador SCI 10A',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['SCI 10', 'SCI 10A', 'Fonte 10A'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-10A-manual.pdf',
  },
  {
    id: 'fontes-carregadores-sci',
    name: 'Fontes e Carregadores SCI',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: [
      'Fonte SCI',
      'SCI',
      'Fonte 36A',
      'Fonte 50A',
      'Fonte 60A',
      'Fonte 70A',
      'Fonte 100A',
      'Fonte 120A',
      'Fonte 150A',
      'Fonte 200A',
    ],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-SCI-36-a-200-mono.pdf',
  },
  {
    id: 'fonte-storm-truck',
    name: 'Fonte Storm Truck',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['Storm Truck', 'Fonte Truck'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/04/MANUAL-FONTE-STORM-TRUCK.pdf',
  },
  {
    id: 'fonte-m120a',
    name: 'Fonte M120A',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: ['M120', 'M120A', 'Fonte 120A M'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/08/MANUAL-FONTE-M120A-1.pdf',
  },
  {
    id: 'fonte-storm-lithium',
    name: 'Fonte Storm Lithium',
    lines: [A],
    category: 'Fontes e carregadores',
    aliases: [
      'Storm Lithium',
      'Fonte Lithium',
      'Carregador Lithium',
      'Storm Lítio',
      'Storm 70A Lithium',
      'Storm 120A Lithium',
    ],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/FONTES-STORM-LITHIUM-MANUAL-RV07.pdf',
  },
  {
    id: 'pbs-protetor-baterias-serie',
    name: 'Protetor de Baterias em Série (PBS)',
    lines: [A],
    category: 'Proteção',
    aliases: ['PBS', 'Protetor de bateria', 'Protetor de baterias em série'],
    status: 'current',
    manualUrl: 'https://www.jfaeletronicos.com/qr-code/PBS.pdf',
  },
  {
    id: 'conversor-rca-slim',
    name: 'Conversor RCA Slim',
    lines: [A],
    category: 'Conversores',
    aliases: ['RCA Slim', 'Conversor RCA', 'Conversor remoto RCA'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-conversor-rca-slim.pdf',
  },
  {
    id: 'filtro-rca-antirruido',
    name: 'Filtro RCA Antirruído',
    lines: [A],
    category: 'Filtros',
    aliases: ['Filtro RCA', 'Filtro antirruído', 'Anti ruído RCA'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-filtro-anti-ruido.pdf',
  },
  {
    id: 'processador-audio-j4-redline',
    name: 'Processador de Áudio J4 Redline',
    lines: [A],
    category: 'Processadores',
    aliases: ['J4', 'J4 Redline', 'Processador J4', 'Processador Redline'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/manual-jfa-processador-redline-j4-trilingue.pdf',
  },
  {
    id: 'voltimetro-sequenciador-vs5hi',
    name: 'Voltímetro e Sequenciador VS5HI',
    lines: [A],
    category: 'Voltímetros e sequenciadores',
    aliases: ['VS5HI', 'Voltímetro', 'Sequenciador'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/manual-voltimetro-sequenciador-vs5hi-trilingue.pdf',
  },
  {
    id: 'sr5-evolution',
    name: 'SR5 Evolution',
    lines: [A],
    category: 'Eletrônica automotiva',
    aliases: ['SR5', 'SR5 Evolution', 'Computador de bordo SR5'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/12/Manual-SR5-Evolution-03_compressed.pdf',
  },
  {
    id: 'equalizador-balanceador-banco-baterias',
    name: 'Equalizador Balanceador para Banco de Baterias',
    lines: [E],
    category: 'Gerenciamento de energia',
    aliases: ['Equalizador de baterias', 'Balanceador de baterias', 'Equalizador banco', 'Balanceador banco'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2022/08/manual-jfa-equalizador-balanceador-para-banco-de-baterias.pdf',
  },
  {
    id: 'conversor-dc-dc-step-down-up',
    name: 'Conversor DC DC Step Down / Step Up',
    lines: [E],
    category: 'Conversores DC-DC',
    aliases: ['Conversor DC DC', 'DC-DC', 'Step Down', 'Step Up', 'Conversor isolado'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2021/07/manual-jfa-conversor-dc-dc-step-down-E48.24S-step-up-24.48S-isolado.pdf',
  },
  {
    id: 'fonte-nobreak',
    name: 'Fonte Nobreak',
    lines: [E],
    category: 'Fontes Nobreak',
    aliases: ['Nobreak', 'Fonte retificadora', 'Fonte Nobreak retificadora'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2022/08/manual-jfa-fonte-nobreak-246A128A.pdf',
  },
  {
    id: 'gerenciador-fonte-redundante',
    name: 'Gerenciador de Fonte Redundante',
    lines: [E],
    category: 'Gerenciamento de energia',
    aliases: ['GFR', 'Gerenciador de fonte', 'Fonte redundante', 'Gerenciador redundante', 'Nobreak'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2021/11/manual-jfa-gerenciador-de-fonte-redundante.pdf',
  },
  {
    id: 'patch-panel-regua-poe',
    name: 'Patch Panel Régua PoE',
    lines: [E],
    category: 'Telecom',
    aliases: ['Patch Panel', 'Régua PoE', 'PoE', 'Patch Panel Giga', 'Patch Panel Fast'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2021/07/manual-jfa-patch-panel-POE-10P-gerenciavel-RV03-1.pdf',
  },
  {
    id: 'pdu-dc',
    name: 'Unidade de Divisão de Energia (PDU DC)',
    lines: [E],
    category: 'Distribuição de energia',
    aliases: ['PDU', 'PDU DC', 'Unidade PDU', 'Distribuição DC'],
    status: 'current',
    manualUrl: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2021/12/manual-jfa-qdcc.pdf',
  },
  {
    id: 'inversor-senoidal-rack-1000w',
    name: 'Inversor Senoidal Rack 1000W 48V/220V',
    lines: [E],
    category: 'Inversores',
    aliases: ['Inversor 1000W', 'Rack 1000', 'Inversor Rack'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2023/11/INVERSOR-OFF-GRID-SENOIDAL-PURA-1000w-Manual-RV01-final-16-11.pdf',
  },
  {
    id: 'inversor-senoidal-rack-3000w-5000w',
    name: 'Inversor Senoidal Rack 3000W e 5000W 48V/220V',
    lines: [E],
    category: 'Inversores',
    aliases: ['Inversor 3000W', 'Inversor 5000W', 'Rack 3000', 'Rack 5000'],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/3/2024/10/Inversor-Senoidal-3000W-e-5000W-Manual-RV02-compactado.pdf',
  },
  {
    id: 'inversor-offgrid-senoidal-black',
    name: 'Inversor Off-Grid Senoidal Pura Black 1500W a 5000W',
    lines: [E],
    category: 'Inversores',
    aliases: [
      'Inversor Black',
      'Off Grid',
      'Off-Grid',
      'Senoidal Black',
      'Inversor 1500W',
      'Inversor 2000W',
      'Inversor 3000W',
      'Inversor 5000W',
    ],
    status: 'current',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/4/2024/07/INVERSOR-OFF-GRID-SENOIDAL-PURA-BLACK-1500W-2000W-3000W-5000W.pdf',
  },
  {
    id: 'air-control',
    name: 'Air Control',
    lines: [A],
    category: 'Fora de linha',
    aliases: ['AirControl', 'Controle suspensão', 'Controle pneumático'],
    status: 'discontinued',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-controle-air-control.pdf',
  },
  {
    id: 'combo-slim-k1200',
    name: 'Combo | Controle Slim + K1200',
    lines: [A],
    category: 'Fora de linha',
    aliases: ['Combo Slim', 'Slim K1200', 'Controle volante K1200'],
    status: 'discontinued',
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/10/jfa-manual-combo-slim-k1200.pdf',
  },
];
