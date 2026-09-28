/**
 * Especificações rápidas dos produtos de setor (faixa logo abaixo da Hero, como na
 * página de bateria). Só dados que estão no texto/tabela de cada produto.
 * Formato: id → lista de [rótulo, valor].
 */
export const PRODUCT_QUICK_SPECS = {
  // Automotivo · Fontes e carregadores
  'fonte-storm-lithium': [
    ['Tensão de saída', '12V a 16V'],
    ['Modos inteligentes', '10'],
    ['Carga lenta', '4 fases'],
    ['Amperagens', '70A | 120A'],
  ],
  'fonte-storm-220a': [
    ['Corrente', '220A'],
    ['Tensão de saída', '12,5V a 14,5V'],
    ['Modos inteligentes', '10'],
    ['Função Storm', 'até 15V'],
  ],
  'fonte-storm-truck': [
    ['Sistema', '24V'],
    ['Função Storm', '31V por 30s'],
    ['Carga lenta', '3 fases'],
    ['Versões', '35A | 70A | 100A'],
  ],
  'fonte-carregador-storm': [
    ['Função Storm', '15V'],
    ['Diagnóstico CCA', '10 segundos'],
    ['Carga lenta', '3 fases'],
    ['Amperagens', '40A a 200A'],
  ],
  'fonte-carregador-storm-lite': [
    ['Saída ajustável', '12V a 15,2V'],
    ['Ventilação', 'Smart cooler'],
    ['Versões', '50A a 200A'],
  ],
  'fonte-carregador-bob-storm': [
    ['Função Storm', '15,2V'],
    ['Uso', 'Sem bateria'],
    ['Amperagens', '60A a 200A'],
  ],
  'fonte-carregador-redline': [
    ['Modos', '3'],
    ['Tensões de saída', '8 níveis'],
    ['Amperagens', '60A | 120A | 200A'],
  ],
  'fontes-carregadores-sci': [
    ['Saída', '14,4V ou Auto SCI'],
    ['Alimentação', 'Bivolt 110/220Vac'],
    ['Amperagens', '10A a 200A'],
  ],
  'carregador-portatil-redline': [
    ['Modos', '3'],
    ['Tensão de saída', '12,6V a 14,4V'],
    ['Saída', 'Tomada 12V'],
  ],
  // Automotivo · Áudio
  ap800x4: [
    ['Potência', '800W'],
    ['Canais', '4'],
    ['Crossover DSP', '20Hz a 20kHz'],
    ['Refrigeração', 'Líquida opcional'],
  ],
  ap400x4: [
    ['Potência', '400W'],
    ['Canais', '4'],
    ['Crossover DSP', '20Hz a 20kHz'],
    ['Refrigeração', 'Líquida opcional'],
  ],
  'processador-audio-j4-redline': [
    ['Equalizador master', '15 bandas'],
    ['Saída', '15 Vpp'],
    ['Display', 'Gráfico'],
  ],
  'conversor-rca-slim': [
    ['Entrada', 'Alto-falante'],
    ['Saída', 'RCA'],
    ['Comando remoto', 'Sim'],
  ],
  'filtro-rca-antirruido': [
    ['Entradas RCA', '2'],
    ['Saídas RCA', '2'],
    ['Filtro', 'Eletromagnético'],
  ],
  // Automotivo · Controles
  'controle-redline': [
    ['Alcance', '1.200 m'],
    ['Interfaces', 'WR e SWC'],
    ['Central', 'Slim'],
  ],
  'controle-acqua-1200': [
    ['Alcance', '1.200 m'],
    ['Resistência', 'À água'],
    ['Modos', '2'],
  ],
  'controle-k1200-universal': [
    ['Alcance', '1.200 m'],
    ['Cores', '6'],
    ['Modos', '2'],
  ],
  'controle-k600-universal': [
    ['Alcance', '600 m'],
    ['Cores', '4'],
    ['Modos', '2'],
  ],
  'controle-k600': [
    ['Alcance', '600 m'],
    ['Cores', '5'],
    ['Memória', '+220 aparelhos'],
  ],
  // Automotivo · Acessórios
  'sr5-evolution': [
    ['Saídas remotas', '6'],
    ['Corte por baixa tensão', '10V'],
    ['Mensagens', 'até 40 caracteres'],
  ],
  'voltimetro-sequenciador-vs5hi': [
    ['Funções', '3 em 1'],
    ['Corte por baixa tensão', '9,5V'],
  ],
  'pbs-protetor-baterias-serie': [
    ['Aplicação', 'Lítio em série'],
    ['Comando remoto', 'Interno'],
    ['Proteção', 'BMS'],
  ],
  // Telecom
  'patch-panel-poe-giga': [
    ['Portas', '5 | 10 | 12'],
    ['Tensão', '10,8 a 52,8 Vdc'],
    ['Velocidade', '10/100/1000 Mbps'],
    ['Corrente por porta', '1A'],
  ],
  'patch-panel-poe-fast': [
    ['Portas', '5 | 10'],
    ['Tensão', '10,8 a 52,8 Vdc'],
    ['Velocidade', '10/100 Mbps'],
    ['Corrente por porta', '1A'],
  ],
  'patch-panel-poe-gerenciavel': [
    ['Equipamentos', 'até 10'],
    ['Gerenciamento', 'SNMP'],
    ['Monitoramento', 'Interface Web'],
  ],
  'fonte-nobreak': [
    ['Versões', '12V 8A | 24V 6A'],
    ['Rede AC', '127V / 220V'],
    ['Carga', 'Inteligente (SCI)'],
  ],
  'fonte-nobreak-snmp': [
    ['Tensões', '24V | 48V'],
    ['Gerenciamento', 'SNMP'],
    ['Funcionamento', 'On-line'],
  ],
  'gerenciador-fonte-redundante': [
    ['Modos', '2'],
    ['Gerenciamento', 'SNMP e Web'],
    ['Sensor', 'Porta aberta'],
  ],
  'equalizador-balanceador-banco-baterias': [
    ['Baterias por equalizador', '2'],
    ['Sistemas', '24V | 48V'],
    ['Display', 'LEDs'],
  ],
  'conversor-dc-dc-step-down-up': [
    ['Modelos', 'E4824 | E2448'],
    ['Processador', 'ARM 32 bits'],
    ['Display', 'Tensão e corrente'],
  ],
  'pdu-dc': [
    ['Saídas', '4'],
    ['Entrada DC', '10V a 60V'],
    ['Formato', '1U rack 19"'],
  ],
};
