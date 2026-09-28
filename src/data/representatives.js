/** Representantes comerciais por estado (mapa da Home e da página #/representantes). */
export const REPRESENTATIVES = [
  {
    /* AGN Representações: nome/estados confirmados pelo pedido do
       usuário ("Verified state mapping to use as baseline"); telefone/
       e-mail/endereço NÃO foram fornecidos e não foram inventados --
       ver renderPanel() abaixo, que já lida com phones/address
       ausentes (mesmo padrão de "comercial-jfa", que também não tem
       address). BA é atendido tanto por AGN quanto por Comercial JFA
       ao mesmo tempo -- ver stateToRepresentative.BA (array) logo
       abaixo, pedido explícito: "Preserve the official relationship
       rather than arbitrarily removing one." */
    id: 'agn-representacoes',
    name: 'AGN Representa\xE7\xF5es',
    states: ['BA', 'SE'],
    stateNames: ['Bahia', 'Sergipe'],
    phones: [],
    address: null,
  },
  {
    id: 'al-representacoes',
    name: 'AL Representa\xE7\xF5es de Pe\xE7as e Acess\xF3rios para Ve\xEDculos Automotores',
    states: ['AL', 'PB', 'PE', 'RN'],
    stateNames: ['Alagoas', 'Para\xEDba', 'Pernambuco', 'Rio Grande do Norte'],
    phones: ['(81) 99740-8996', '(81) 98747-7445', '(81) 99218-1452'],
    address:
      'Rua Evaristo da Veiga, 217 sala 107, Ed. Torque Empresarial, Casa Amarela, Recife/PE, CEP 52070-100',
  },
  {
    id: 'bac-representacoes',
    name: 'BAC Representa\xE7\xF5es',
    states: ['AC', 'AP', 'AM', 'MT', 'MS', 'PA', 'PR', 'RS', 'RO', 'RR', 'SC'],
    stateNames: [
      'Acre',
      'Amap\xE1',
      'Amazonas',
      'Mato Grosso',
      'Mato Grosso do Sul',
      'Par\xE1',
      'Paran\xE1',
      'Rio Grande do Sul',
      'Rond\xF4nia',
      'Roraima',
      'Santa Catarina',
    ],
    phones: ['(47) 99668-3447', '(51) 99167-7754'],
    address: 'Rua Governador Jorge Lacerda, 1131, 2\xBA andar, Velha, Blumenau/SC, CEP 89.045-000',
  },
  {
    id: 'comercial-jfa',
    name: 'Comercial JFA',
    states: ['BA', 'SP'],
    stateNames: ['Bahia', 'S\xE3o Paulo'],
    phones: ['(31) 98389-5799'],
    address: null,
  },
  {
    id: 'gyn-representacoes',
    name: 'GYN Representa\xE7\xF5es',
    states: ['DF', 'GO', 'TO'],
    stateNames: ['Distrito Federal', 'Goi\xE1s', 'Tocantins'],
    phones: ['(62) 98108-8746', '(62) 98415-0653'],
    address: 'Rua 11, Quadra 25, Lote 15, n\xBA 213, Vila Santa Helena, Goi\xE2nia/GO, CEP 74555-230',
  },
  {
    id: 'jhs-representacoes',
    name: 'JHS Representa\xE7\xF5es',
    states: ['RJ'],
    stateNames: ['Rio de Janeiro'],
    phones: ['(24) 99934-4467'],
    address: 'Rua da Limeira, 6, Parque Mambucaba, Angra dos Reis/RJ, CEP conforme cadastro atual',
  },
  {
    id: 'jla-representacoes',
    name: 'JLA Representa\xE7\xF5es',
    states: ['ES', 'MG'],
    stateNames: ['Esp\xEDrito Santo', 'Minas Gerais'],
    phones: ['(31) 36540-300', '(31) 99167-5767'],
    address: 'Avenida Bar\xE3o Homem de Melo, 4386, sala 1304, Estoril, Belo Horizonte/MG, CEP 30.494-270',
  },
  {
    id: 'm-almeida-representacoes',
    name: 'M. ALMEIDA REPRESENTACOES',
    states: ['CE'],
    stateNames: ['Cear\xE1'],
    phones: ['(85) 98881-4264'],
    address: 'Rua Mario Studart, 453, Monte Castelo',
  },
  {
    id: 'maxsound-representacoes',
    name: 'MaxSound Representa\xE7\xF5es',
    states: ['MA', 'PI'],
    stateNames: ['Maranh\xE3o', 'Piau\xED'],
    phones: ['(86) 99448-2237'],
    address: 'Teresina/PI, CEP 64019-160',
  },
];
export const STATE_TO_REPRESENTATIVE = {
  AC: 'bac-representacoes',
  AL: 'al-representacoes',
  AP: 'bac-representacoes',
  AM: 'bac-representacoes',
  BA: ['agn-representacoes', 'comercial-jfa'],
  CE: 'm-almeida-representacoes',
  DF: 'gyn-representacoes',
  ES: 'jla-representacoes',
  GO: 'gyn-representacoes',
  MA: 'maxsound-representacoes',
  MT: 'bac-representacoes',
  MS: 'bac-representacoes',
  MG: 'jla-representacoes',
  PA: 'bac-representacoes',
  PB: 'al-representacoes',
  PR: 'bac-representacoes',
  PE: 'al-representacoes',
  PI: 'maxsound-representacoes',
  RJ: 'jhs-representacoes',
  RN: 'al-representacoes',
  RS: 'bac-representacoes',
  RO: 'bac-representacoes',
  RR: 'bac-representacoes',
  SC: 'bac-representacoes',
  SP: 'comercial-jfa',
  SE: 'agn-representacoes',
  TO: 'gyn-representacoes',
};

export const INTERNATIONAL_SALES = {
  name: 'Venda Internacional | International Sales',
  regions: ['Am\xE9rica do Norte', 'Am\xE9rica Latina', 'Europa', '\xC1sia'],
  contacts: [
    { name: 'BAC Representa\xE7\xF5es', phone: '+55 47 99668-3447' },
    { name: 'Cristiano Rodrigues', phone: '+55 31 98421-0991' },
  ],
};
