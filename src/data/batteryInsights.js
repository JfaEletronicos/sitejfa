/**
 * Dados técnicos lidos nas etiquetas das baterias e textos da seção
 * "Por que escolher" da página de detalhe.
 *
 * LABEL_SPECS: chave = id da bateria, ou "id:variante" para as que têm
 * capacidades (ex.: 'elitio-pro-12-8v:100ah'). Só entra o que está
 * impresso no rótulo do produto.
 *
 * WHY_COPY: chave = id (ou "id:variante") e, dentro, a aplicação
 * (solar/automotivo/nautico). Cada texto tem um título, um parágrafo e
 * três motivos com um valor em destaque.
 */

const CYCLES = '> 5.000 ciclos';
const CYCLES_NOTE = 'de vida útil a 80% de profundidade de descarga (0,3C), conforme o rótulo';
const TEMP = '−5 °C a 50 °C';

export const LABEL_SPECS = {
  'elitio-pro-12-8v:50ah': { energy: '640 Wh', chargeVoltage: '14,4V', cycles: true, temp: true },
  'elitio-pro-12-8v:100ah': { energy: '1,28 kWh', chargeVoltage: '14,4V', cycles: true, temp: true },
  'elitio-pro-solar-48v-100ah-rack': { energy: '4,8 kWh', chargeVoltage: '54V', comms: 'RS485 e CAN' },
  'elitio-pro-48v-50ah': { energy: '2,4 kWh', chargeVoltage: '54V', cycles: true, temp: true },
  'elitio-nautica-12-8v-100ah': { energy: '1,28 kWh', chargeVoltage: '14,4V', cycles: true, temp: true },
  'elitio-pro-25-6v-50ah': { energy: '1,28 kWh', chargeVoltage: '28,8V', cycles: true, temp: true },
  'elitio-pro-25-6v-100ah': { energy: '2,56 kWh', chargeVoltage: '28,8V', cycles: true, temp: true },
  'elitio-nautica-25-6v-100ah': { energy: '2,56 kWh', chargeVoltage: '28,8V', cycles: true, temp: true },
};

const cyclesReason = { value: CYCLES, text: CYCLES_NOTE };
const tempReason = { value: TEMP, text: 'de faixa de temperatura para carga e descarga' };
const bmsReason = {
  value: 'BMS integrado',
  text: 'acompanha a operação e protege os principais parâmetros da bateria',
};

export const WHY_COPY = {
  'elitio-pro-12-8v:100ah': {
    automotivo: {
      title: 'Reserva de energia para um som que não pode parar.',
      text: 'Com 1,28 kWh armazenados em LiFePO₄, a versão 100Ah sustenta o sistema de áudio por mais tempo com o motor desligado e mantém a tensão estável ao longo da descarga, característica da química de lítio-ferro-fosfato.',
      reasons: [
        { value: '1,28 kWh', text: 'de energia armazenada para sessões longas' },
        { value: 'Bluetooth', text: 'para acompanhar informações da bateria em dispositivos compatíveis' },
        cyclesReason,
      ],
    },
    solar: {
      title: 'Mais energia guardada para as horas sem sol.',
      text: 'São 1,28 kWh em uma química feita para ciclos diários: o sistema armazena o que os painéis geram durante o dia e entrega à noite, com o estado da bateria visível pelo Bluetooth.',
      reasons: [
        { value: '1,28 kWh', text: 'de capacidade para ciclos diários de carga e descarga' },
        cyclesReason,
        { value: 'Bluetooth', text: 'para monitorar o armazenamento sem abrir o sistema' },
      ],
    },
  },
  'elitio-pro-12-8v:50ah': {
    automotivo: {
      title: 'Energia de lítio para projetos compactos.',
      text: 'A versão 50Ah leva a estabilidade do LiFePO₄ para projetos de som automotivo que precisam de uma bateria auxiliar confiável em um formato mais compacto, com BMS integrado.',
      reasons: [
        { value: '640 Wh', text: 'de energia para sistemas de menor consumo' },
        bmsReason,
        cyclesReason,
      ],
    },
    solar: {
      title: 'O ponto de partida para armazenar energia solar.',
      text: 'Para sistemas solares menores, os 640 Wh em LiFePO₄ oferecem armazenamento estável e longa vida útil, com o gerenciamento BMS acompanhando cada ciclo.',
      reasons: [
        { value: '640 Wh', text: 'de capacidade para sistemas solares de menor porte' },
        cyclesReason,
        bmsReason,
      ],
    },
  },
  'elitio-pro-solar-48v-100ah-rack': {
    solar: {
      title: 'Capacidade de sobra para sistemas solares de maior porte.',
      text: 'São 4,8 kWh em um módulo de rack 48V, com painel de controle frontal e portas de comunicação para integrar a bateria ao restante do sistema de armazenamento.',
      reasons: [
        { value: '4,8 kWh', text: 'de energia em um único módulo de rack' },
        { value: 'RS485 e CAN', text: 'portas de comunicação no painel frontal' },
        { value: '54V', text: 'de carga máxima, indicada no painel' },
      ],
    },
  },
  'elitio-pro-48v-50ah': {
    solar: {
      title: 'Alta tensão para sistemas que precisam de eficiência.',
      text: 'Em 48V, o sistema trabalha com menos corrente para a mesma potência, o que reduz perdas nos cabos. São 2,4 kWh em LiFePO₄ com BMS e painel de controle integrado.',
      reasons: [{ value: '2,4 kWh', text: 'de energia armazenada em 48V' }, cyclesReason, bmsReason],
    },
  },
  'elitio-nautica-12-8v-100ah': {
    nautico: {
      title: 'Energia confiável para ir a bordo.',
      text: 'São 1,28 kWh em LiFePO₄ para sistemas de 12V de embarcações, com vida útil longa e uma faixa de temperatura de operação ampla, conforme o rótulo.',
      reasons: [
        { value: '1,28 kWh', text: 'de energia para os sistemas de bordo' },
        cyclesReason,
        tempReason,
      ],
    },
  },
  'elitio-pro-25-6v-50ah': {
    solar: {
      title: 'O equilíbrio entre tensão e capacidade.',
      text: 'Em 25,6V, a bateria atende sistemas de 24V com menos corrente que um sistema de 12V equivalente. São 1,28 kWh em LiFePO₄, com BMS acompanhando a operação.',
      reasons: [{ value: '1,28 kWh', text: 'de energia para sistemas de 24V' }, cyclesReason, bmsReason],
    },
  },
  'elitio-pro-25-6v-100ah': {
    solar: {
      title: 'Mais autonomia para sistemas solares de 24V.',
      text: 'Com 2,56 kWh em 25,6V, a bateria guarda mais energia para as horas sem geração, com BMS e química LiFePO₄ feita para ciclos diários.',
      reasons: [{ value: '2,56 kWh', text: 'de energia armazenada em 25,6V' }, cyclesReason, bmsReason],
    },
  },
  'elitio-nautica-25-6v-100ah': {
    nautico: {
      title: 'Mais autonomia para embarcações de 24V.',
      text: 'São 2,56 kWh em LiFePO₄ para sistemas de bordo de 24V que precisam de mais tempo de uso entre recargas, com vida útil longa conforme o rótulo.',
      reasons: [
        { value: '2,56 kWh', text: 'de energia para os sistemas de bordo' },
        cyclesReason,
        tempReason,
      ],
    },
  },
};
