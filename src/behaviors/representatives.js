/**
 * Representantes: mapa interativo do Brasil, busca por estado e painel de contato.
 * @param {import('./context').BehaviorContext} ctx
 */
export function initRepresentatives(ctx) {
  const { root, on, cleanups } = ctx;
  (() => {
    const repsSection = root.getElementById('repsSection');
    if (!repsSection) return;
    const repsTop = repsSection.querySelector('.reps-top');
    const repsStageEntranceEl = root.getElementById('repsStage');
    if ('IntersectionObserver' in window) {
      const repsHeadObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (repsTop) repsTop.classList.add('is-visible');
              if (repsStageEntranceEl) repsStageEntranceEl.classList.add('is-visible');
              repsHeadObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      repsHeadObs.observe(repsSection);
      cleanups.push(() => repsHeadObs.disconnect());
    } else {
      if (repsTop) repsTop.classList.add('is-visible');
      if (repsStageEntranceEl) repsStageEntranceEl.classList.add('is-visible');
    }
    const representatives = [
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
        address:
          'Avenida Bar\xE3o Homem de Melo, 4386, sala 1304, Estoril, Belo Horizonte/MG, CEP 30.494-270',
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
    const stateToRepresentative = {
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
    const getRepIdsForUf = (uf) => {
      const v = stateToRepresentative[uf];
      if (!v) return [];
      return Array.isArray(v) ? v : [v];
    };
    const brazilStates = [
      { uf: 'AC', name: 'Acre' },
      { uf: 'AL', name: 'Alagoas' },
      { uf: 'AP', name: 'Amap\xE1' },
      { uf: 'AM', name: 'Amazonas' },
      { uf: 'BA', name: 'Bahia' },
      { uf: 'CE', name: 'Cear\xE1' },
      { uf: 'DF', name: 'Distrito Federal' },
      { uf: 'ES', name: 'Esp\xEDrito Santo' },
      { uf: 'GO', name: 'Goi\xE1s' },
      { uf: 'MA', name: 'Maranh\xE3o' },
      { uf: 'MT', name: 'Mato Grosso' },
      { uf: 'MS', name: 'Mato Grosso do Sul' },
      { uf: 'MG', name: 'Minas Gerais' },
      { uf: 'PA', name: 'Par\xE1' },
      { uf: 'PB', name: 'Para\xEDba' },
      { uf: 'PR', name: 'Paran\xE1' },
      { uf: 'PE', name: 'Pernambuco' },
      { uf: 'PI', name: 'Piau\xED' },
      { uf: 'RJ', name: 'Rio de Janeiro' },
      { uf: 'RN', name: 'Rio Grande do Norte' },
      { uf: 'RS', name: 'Rio Grande do Sul' },
      { uf: 'RO', name: 'Rond\xF4nia' },
      { uf: 'RR', name: 'Roraima' },
      { uf: 'SC', name: 'Santa Catarina' },
      { uf: 'SP', name: 'S\xE3o Paulo' },
      { uf: 'SE', name: 'Sergipe' },
      { uf: 'TO', name: 'Tocantins' },
    ];
    const internationalSales = {
      name: 'Venda Internacional | International Sales',
      regions: ['Am\xE9rica do Norte', 'Am\xE9rica Latina', 'Europa', '\xC1sia'],
      contacts: [
        { name: 'BAC Representa\xE7\xF5es', phone: '+55 47 99668-3447' },
        { name: 'Cristiano Rodrigues', phone: '+55 31 98421-0991' },
      ],
    };
    const MAP_DATA = {
      viewBox: '22.00 1.00 357.00 371.00',
      paths: {
        RR: 'M157.12,6.38 L142.25,5.88 L136.50,11.75 L133.38,11.88 L128.00,14.88 L106.88,14.88 L106.88,29.62 L109.75,32.50 L109.88,35.38 L120.62,36.12 L122.00,35.12 L128.50,35.25 L137.38,40.12 L141.38,44.12 L151.38,42.38 L158.12,36.62 L159.12,31.75 L161.12,28.75 L161.12,15.38 L160.12,12.50 L157.12,10.25 Z',
        AP: 'M234.12,13.88 L220.38,13.88 L213.75,21.50 L211.88,28.25 L209.50,30.75 L204.00,30.88 L202.12,29.50 L199.88,33.25 L199.12,38.88 L207.50,43.25 L210.75,46.50 L216.88,60.62 L222.00,65.75 L223.25,61.50 L228.50,55.25 L232.12,54.38 L235.50,49.25 L239.88,50.12 L246.12,47.00 L245.12,46.12 L245.12,36.38 L241.50,35.75 L238.12,32.25 L235.12,23.38 Z',
        AM: 'M60.88,37.75 L60.88,45.25 L58.88,46.62 L58.88,63.62 L63.88,68.75 L61.00,85.88 L45.50,89.75 L37.75,93.62 L32.88,101.25 L32.75,106.50 L27.75,110.75 L27.12,116.38 L37.62,118.25 L46.38,122.25 L63.50,125.25 L74.00,131.50 L92.75,139.00 L97.00,137.12 L103.75,137.12 L109.50,133.25 L113.50,133.12 L121.00,124.12 L128.50,124.25 L135.38,131.12 L164.38,130.00 L167.00,120.12 L164.12,116.25 L164.12,112.75 L167.12,109.62 L167.12,106.75 L175.25,92.50 L180.88,76.38 L170.62,70.88 L161.25,62.50 L160.00,56.12 L153.38,47.62 L150.75,45.88 L140.50,46.75 L130.50,38.75 L125.38,37.00 L121.12,38.88 L109.25,37.88 L103.62,40.75 L98.00,40.88 L93.50,33.88 L78.25,33.88 L73.00,36.88 Z',
        PA: 'M152.88,43.62 L162.62,55.25 L163.88,61.62 L171.62,68.38 L183.88,75.75 L183.88,79.25 L166.88,113.12 L166.88,115.75 L173.88,126.75 L173.88,130.62 L180.75,136.25 L234.50,141.12 L244.12,127.75 L244.25,116.50 L252.12,109.62 L252.25,99.50 L261.38,92.38 L267.25,82.50 L273.88,60.25 L270.75,57.88 L262.50,57.75 L258.50,53.75 L252.50,52.75 L248.75,48.12 L242.50,51.75 L236.50,51.88 L233.50,56.75 L228.50,58.88 L224.25,66.88 L220.50,67.75 L214.25,61.50 L208.38,47.75 L197.25,40.50 L197.12,32.75 L199.38,28.88 L181.62,28.88 L179.38,33.75 L169.12,33.88 L160.50,37.75 Z',
        AC: 'M26.88,119.00 L26.88,130.75 L33.75,139.50 L33.88,142.62 L38.50,144.25 L42.88,149.12 L53.50,149.25 L54.88,150.75 L55.38,157.12 L85.62,157.12 L87.50,155.25 L95.38,151.88 L96.00,149.00 L93.12,141.50 L88.50,140.75 L74.88,133.88 L72.50,133.75 L62.75,127.88 L41.50,123.75 L36.75,120.88 Z',
        RO: 'M95.88,141.38 L97.88,145.75 L97.88,151.38 L99.88,152.75 L99.88,161.62 L108.38,170.12 L114.50,170.25 L122.38,175.12 L125.50,175.25 L129.38,179.12 L136.88,179.12 L138.50,180.88 L140.25,176.50 L145.50,171.25 L147.62,171.12 L150.12,168.62 L150.12,165.75 L152.12,163.62 L150.12,159.25 L150.88,153.88 L148.62,152.88 L140.50,152.75 L138.25,150.50 L138.12,133.88 L134.50,133.75 L127.62,126.88 L121.50,126.88 L114.50,135.75 L110.38,135.88 L107.50,138.75 L97.38,139.88 Z',
        MT: 'M140.75,133.88 L140.00,137.12 L140.88,138.75 L140.88,149.25 L152.50,151.25 L153.88,152.75 L153.00,158.88 L154.88,161.75 L152.75,169.50 L148.50,173.75 L146.50,173.88 L141.00,181.12 L142.88,188.62 L143.88,203.62 L157.38,204.25 L159.75,213.25 L162.88,214.12 L172.38,210.25 L175.62,210.12 L180.00,206.12 L188.12,206.12 L194.25,209.12 L200.25,208.12 L204.25,209.12 L206.50,212.12 L208.25,212.12 L210.12,203.75 L213.25,200.50 L214.25,197.50 L217.50,194.25 L219.62,194.12 L222.25,188.50 L224.50,186.25 L226.50,186.12 L228.12,183.75 L229.12,175.62 L232.12,169.75 L231.12,152.50 L234.12,143.75 L179.50,138.75 L171.25,131.50 L171.12,127.25 L168.62,122.25 L167.88,129.25 L164.50,133.75 Z',
        MA: 'M277.88,60.88 L275.88,61.38 L272.88,76.25 L269.88,80.25 L268.75,85.50 L265.88,88.38 L263.88,93.38 L258.38,98.88 L255.25,100.38 L259.50,102.25 L261.88,105.75 L262.88,112.38 L260.88,117.12 L260.88,120.62 L264.88,125.12 L267.50,125.25 L268.88,126.75 L268.88,129.25 L266.75,131.50 L266.00,134.88 L269.00,139.00 L270.75,145.12 L273.12,144.62 L273.12,131.75 L276.12,126.75 L276.25,124.50 L279.50,121.25 L283.75,120.12 L291.50,114.25 L297.75,115.00 L299.00,113.75 L298.12,104.75 L300.88,101.88 L299.12,98.38 L299.12,94.75 L301.25,88.62 L308.12,83.62 L309.12,80.62 L309.12,74.50 L305.88,72.88 L296.00,72.88 L292.62,71.75 L290.12,66.50 L285.50,65.75 L282.50,62.75 Z',
        PI: 'M313.12,75.88 L311.88,75.88 L310.75,84.50 L306.50,88.75 L303.88,89.62 L301.88,95.12 L302.88,103.25 L300.00,107.12 L301.88,110.75 L301.75,114.50 L298.50,117.75 L292.38,116.88 L284.75,122.62 L280.50,123.75 L275.88,132.25 L275.88,144.12 L277.50,144.25 L281.88,149.88 L285.50,147.25 L288.62,147.12 L291.12,144.62 L291.12,138.75 L293.50,136.25 L299.00,136.12 L301.38,137.88 L304.50,136.25 L307.88,136.12 L311.50,132.25 L315.12,131.38 L320.75,125.00 L320.12,117.38 L317.12,114.25 L316.12,103.38 L314.12,101.25 Z',
        CE: 'M315.88,75.88 L316.25,98.00 L318.88,102.75 L319.88,113.62 L322.88,116.75 L322.00,120.25 L322.75,123.38 L328.00,123.12 L331.25,125.12 L336.62,125.12 L338.50,123.25 L340.38,123.12 L344.88,116.88 L344.12,111.38 L342.12,109.25 L342.12,104.62 L351.25,95.50 L352.88,92.12 L345.38,84.62 L338.62,79.88 L336.50,79.75 L333.62,76.88 L329.62,75.88 Z',
        RN: 'M344.88,105.38 L344.88,108.62 L346.88,110.75 L346.88,114.12 L354.00,109.12 L358.50,109.25 L360.38,111.12 L364.38,112.12 L373.88,110.12 L372.12,108.25 L372.12,100.50 L369.25,98.50 L369.12,96.88 L361.00,96.88 L354.50,94.38 L353.75,96.50 Z',
        PB: 'M348.75,116.50 L353.38,121.12 L359.00,123.00 L364.12,122.12 L370.25,125.12 L374.12,125.12 L374.12,112.88 L371.25,112.88 L368.00,114.88 L359.50,113.75 L357.62,111.88 L354.25,111.88 Z',
        PE: 'M370.12,137.75 L370.12,127.62 L363.75,124.88 L356.00,124.88 L352.50,123.75 L347.62,118.88 L344.75,120.50 L341.50,125.75 L339.38,125.88 L337.50,127.75 L331.00,127.88 L327.75,125.88 L323.38,125.88 L318.12,131.12 L320.38,133.12 L326.62,133.12 L328.50,131.25 L331.00,131.12 L334.25,133.12 L346.62,134.25 L352.25,137.12 L356.12,137.12 L359.50,134.25 L364.00,134.12 L365.88,135.75 L365.88,138.25 L364.12,140.12 L367.88,140.12 Z',
        AL: 'M342.88,136.88 L344.88,140.12 L350.50,142.25 L354.38,146.12 L363.12,137.62 L360.38,136.88 L357.50,139.75 L352.00,139.88 L345.75,136.88 Z',
        SE: 'M343.88,142.88 L344.88,150.25 L343.50,151.75 L340.88,152.12 L344.88,156.88 L348.25,151.50 L352.88,148.12 L349.50,144.88 Z',
        TO: 'M254.75,103.50 L254.75,110.50 L246.88,117.62 L245.88,121.38 L246.88,128.25 L236.88,142.38 L236.88,146.25 L234.88,148.38 L234.88,152.25 L233.88,153.38 L233.88,164.50 L241.75,169.88 L244.50,167.25 L248.00,167.12 L251.50,170.25 L257.62,171.12 L268.38,168.12 L269.12,166.75 L268.12,163.25 L268.88,158.12 L267.12,156.25 L267.12,152.75 L269.12,150.62 L269.12,147.25 L266.12,139.38 L264.12,137.25 L264.12,130.75 L267.12,127.12 L263.50,127.75 L258.25,121.50 L258.12,116.75 L260.00,109.25 L258.25,104.62 Z',
        BA: 'M271.88,147.62 L271.88,151.25 L269.25,155.00 L270.88,156.75 L270.88,162.62 L271.88,163.75 L271.00,168.88 L272.88,171.75 L272.00,176.88 L273.88,179.75 L273.25,186.00 L274.25,186.88 L285.50,180.25 L289.88,180.12 L292.50,184.12 L299.50,184.25 L305.25,188.12 L309.50,188.25 L314.62,193.25 L322.50,194.25 L324.88,196.75 L324.88,200.25 L320.75,205.50 L320.00,208.88 L324.62,215.38 L334.75,220.75 L336.12,218.75 L337.12,207.62 L339.12,203.75 L339.12,179.50 L340.00,176.00 L341.50,174.25 L346.50,174.12 L351.12,167.75 L351.12,154.38 L350.38,153.62 L346.50,158.75 L343.00,158.88 L338.12,153.12 L339.12,149.75 L342.12,149.12 L342.12,145.38 L341.12,144.25 L341.88,140.38 L340.12,139.12 L340.12,136.75 L333.50,135.75 L330.75,133.88 L327.00,135.88 L320.00,135.88 L317.00,134.00 L312.62,134.75 L310.50,137.75 L304.12,139.88 L294.38,138.88 L293.00,140.25 L293.75,145.50 L289.50,149.75 L286.25,149.88 L283.50,151.75 L279.50,151.75 L277.25,149.50 L276.38,146.12 Z',
        GO: 'M269.38,170.88 L255.00,173.88 L250.50,172.75 L247.62,169.88 L245.38,169.88 L243.00,171.88 L239.50,171.75 L234.88,168.00 L229.75,186.50 L227.50,188.75 L224.75,189.50 L223.75,193.50 L220.50,196.75 L218.38,196.88 L211.12,208.12 L211.25,213.00 L213.88,216.50 L224.25,223.12 L227.50,223.25 L228.88,224.62 L234.50,218.25 L239.62,218.12 L246.00,216.12 L256.00,216.75 L259.00,213.75 L258.12,206.75 L260.12,203.38 L258.12,200.88 L251.00,200.88 L249.25,199.50 L249.12,183.75 L251.00,182.12 L266.00,182.12 L271.00,184.75 Z',
        MG: 'M321.38,196.75 L313.50,195.75 L308.62,190.88 L304.50,190.75 L298.75,186.88 L291.50,186.75 L289.12,182.88 L286.25,182.88 L276.00,188.88 L272.50,188.75 L268.25,186.88 L265.88,188.50 L265.75,194.50 L263.50,196.75 L260.88,196.88 L260.88,200.62 L262.88,202.75 L262.88,205.25 L260.25,208.75 L261.88,210.75 L261.75,214.50 L257.00,218.88 L246.00,218.88 L240.12,220.88 L235.38,220.88 L231.00,226.12 L230.88,229.62 L242.62,230.25 L246.12,233.62 L248.00,232.12 L260.50,231.25 L263.88,236.75 L263.88,242.50 L266.75,244.50 L267.88,247.62 L267.00,251.88 L270.50,257.12 L273.88,255.12 L282.50,253.25 L287.50,250.25 L303.50,248.25 L306.50,246.12 L305.12,242.50 L307.00,235.00 L310.50,233.12 L313.88,227.25 L314.12,220.75 L317.12,217.62 L317.12,215.75 L319.75,212.12 L317.12,209.25 L317.12,206.75 L322.88,199.00 Z',
        ES: 'M321.00,215.25 L316.00,223.12 L316.88,227.25 L311.50,235.75 L308.88,236.38 L308.00,241.25 L308.75,245.38 L313.38,249.12 L321.38,249.12 L328.12,236.75 L328.25,231.50 L331.12,230.12 L331.12,223.88 L333.12,222.50 L323.50,217.75 Z',
        RJ: 'M312.12,251.50 L308.75,248.88 L306.38,248.88 L304.50,250.75 L288.25,252.88 L285.50,254.25 L285.88,264.75 L287.12,266.62 L289.00,265.12 L311.12,264.12 L312.12,261.62 Z',
        SP: 'M216.88,251.50 L219.62,254.25 L238.50,258.25 L241.88,261.75 L244.62,271.38 L251.75,276.50 L252.75,280.50 L256.38,284.12 L259.62,284.12 L271.50,275.25 L277.50,272.25 L281.12,272.12 L285.00,269.00 L283.12,265.38 L283.38,255.88 L274.38,257.88 L272.00,259.88 L269.50,259.75 L266.25,256.50 L265.12,248.38 L261.12,243.25 L261.12,237.38 L259.12,233.88 L245.00,235.88 L241.88,232.88 L230.50,231.88 L224.88,237.50 L224.75,240.50 L221.75,242.62 L220.75,248.50 Z',
        MS: 'M185.12,208.12 L180.38,208.88 L176.50,212.75 L173.12,212.88 L164.88,216.62 L162.88,221.25 L163.88,255.38 L167.25,257.12 L177.00,257.12 L180.50,258.25 L183.88,261.75 L184.88,271.62 L186.38,273.12 L192.12,273.75 L202.12,265.62 L202.12,263.75 L205.12,260.62 L205.62,258.12 L211.50,253.25 L214.12,252.62 L214.25,250.50 L218.25,247.12 L219.25,241.50 L223.12,238.50 L223.25,235.50 L228.12,230.75 L228.12,227.38 L214.50,220.75 L209.50,214.88 L205.50,214.75 L203.12,210.88 L193.88,211.88 Z',
        PR: 'M192.88,276.38 L192.88,287.62 L196.50,288.25 L198.00,289.75 L203.00,288.12 L211.00,288.12 L212.38,289.12 L219.50,289.25 L221.50,292.12 L223.50,292.25 L227.50,288.25 L232.00,286.12 L241.75,287.12 L244.50,285.25 L247.00,285.12 L249.38,287.12 L254.38,288.12 L255.00,286.25 L250.25,281.50 L249.25,277.62 L246.50,276.75 L242.12,272.38 L240.12,268.38 L239.12,262.38 L237.50,260.75 L218.50,256.75 L216.75,255.00 L212.62,255.75 L211.38,257.88 L208.00,259.50 L207.75,261.50 L204.88,264.38 L204.75,266.50 Z',
        SC: 'M254.12,313.75 L254.12,290.50 L248.50,289.75 L246.62,287.88 L242.00,289.88 L232.25,288.88 L224.00,294.88 L220.50,294.75 L218.12,291.88 L212.00,291.88 L210.62,290.88 L200.75,291.88 L207.25,295.12 L214.50,295.25 L216.50,297.25 L225.50,301.25 L233.50,309.12 L236.50,309.25 L238.75,311.50 L239.50,317.25 L247.88,320.88 L252.25,317.50 Z',
        RS: 'M196.25,292.88 L184.50,299.75 L178.62,305.62 L172.88,314.38 L168.62,317.62 L167.88,333.12 L174.50,333.25 L180.50,341.12 L184.50,341.25 L191.50,345.25 L199.75,353.50 L200.88,355.75 L200.88,367.12 L215.62,367.12 L220.25,362.38 L221.12,357.75 L224.12,353.62 L224.12,347.75 L226.12,344.62 L233.75,344.12 L236.38,342.38 L245.75,322.50 L238.50,319.75 L236.12,317.25 L236.75,312.38 L232.50,311.75 L224.50,303.75 L215.50,299.75 L213.62,297.88 L206.50,297.75 Z',
        DF: 'M265.62,184.88 L251.88,184.88 L251.88,198.12 L258.12,198.12 L258.12,195.75 L259.50,194.25 L262.62,194.12 L263.12,187.88 Z',
      },
    };
    const repsById = {};
    representatives.forEach((r) => {
      repsById[r.id] = r;
    });
    const stateByUf = {};
    brazilStates.forEach((s) => {
      stateByUf[s.uf] = s;
    });
    const mapSvg = root.getElementById('repsMapSvg');
    const mapWrap = root.getElementById('repsMapWrap');
    const stage = root.getElementById('repsStage');
    const panel = root.getElementById('repsPanel');
    const tooltip = root.getElementById('repsTooltip');
    const searchInput = root.getElementById('repsSearchInput');
    const suggestEl = root.getElementById('repsSuggest');
    const intlToggle = root.getElementById('repsIntlToggle');
    const intlPanel = root.getElementById('repsIntlPanel');
    if (!mapSvg || !stage || !panel) return;
    mapSvg.setAttribute('viewBox', MAP_DATA.viewBox);
    const svgNS = 'http://www.w3.org/2000/svg';
    const statePaths = {};
    Object.keys(MAP_DATA.paths).forEach((uf) => {
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', MAP_DATA.paths[uf]);
      p.setAttribute('class', 'reps-state');
      p.setAttribute('data-uf', uf);
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      const st = stateByUf[uf];
      p.setAttribute('aria-label', st ? st.name : uf);
      mapSvg.appendChild(p);
      statePaths[uf] = p;
    });
    let selectedUf = null;
    const normalize = (s) =>
      (s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    const joinPt = (arr) => {
      if (arr.length <= 1) return arr.join('');
      if (arr.length === 2) return arr.join(' e ');
      return arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1];
    };
    const telHref = (raw) => {
      const digits = raw.replace(/[^\d]/g, '');
      return 'tel:+55' + digits;
    };
    const clearHighlight = () => {
      Object.values(statePaths).forEach((p) =>
        p.classList.remove('is-selected', 'is-secondary', 'is-empty-selected'),
      );
    };
    const showTooltip = (uf, evt) => {
      const st = stateByUf[uf];
      if (!st || !tooltip || !mapWrap) return;
      tooltip.textContent = st.name;
      const wrapRect = mapWrap.getBoundingClientRect();
      tooltip.style.left = evt.clientX - wrapRect.left + 'px';
      tooltip.style.top = evt.clientY - wrapRect.top + 'px';
      tooltip.classList.add('is-visible');
    };
    const hideTooltip = () => {
      if (tooltip) tooltip.classList.remove('is-visible');
    };
    const hideSuggestions = () => {
      if (!suggestEl) return;
      suggestEl.innerHTML = '';
      activeSuggestIndex = -1;
      currentMatches = [];
      if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
    };
    const buildRepBlock = (rep) => {
      let html = '<p class="reps-panel-rep">' + rep.name + '</p>';
      html += '<p class="reps-panel-served">Atendimento em: <b>' + joinPt(rep.stateNames) + '</b></p>';
      if (rep.phones && rep.phones.length) {
        html +=
          '<ul class="reps-panel-phones">' +
          rep.phones
            .map(
              (ph) =>
                '<li><a class="reps-panel-phone" href="' +
                telHref(ph) +
                '"><svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.5.57a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.57 3.5a1 1 0 01-.25 1l-2.2 2.3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path></svg>' +
                ph +
                '</a></li>',
            )
            .join('') +
          '</ul>';
      }
      if (rep.address) html += '<p class="reps-panel-address">' + rep.address + '</p>';
      if (rep.email)
        html += '<p class="reps-panel-address"><a href="mailto:' + rep.email + '">' + rep.email + '</a></p>';
      if (rep.phones && rep.phones.length) {
        html +=
          '<a class="reps-panel-cta" href="' +
          telHref(rep.phones[0]) +
          '">Entrar em contato<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>';
      } else if (!rep.phones || !rep.phones.length) {
        html +=
          '<a class="reps-panel-cta" href="#jfaHeader" data-generic-contact="1">Entrar em contato com a JFA<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>';
      }
      return html;
    };
    const renderPanel = (uf) => {
      const st = stateByUf[uf];
      const repIds = getRepIdsForUf(uf);
      const reps = repIds.map((id) => repsById[id]).filter(Boolean);
      const stateName = st ? st.name : uf;
      let html = '';
      html +=
        '<button class="reps-panel-back" type="button" id="repsPanelBack"><svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Ver mapa completo</button>';
      html += '<span class="reps-panel-uf">' + uf + '</span>';
      html += '<h3 class="reps-panel-state">' + stateName + '</h3>';
      if (reps.length === 1) {
        html += buildRepBlock(reps[0]);
      } else if (reps.length > 1) {
        html += reps
          .map((rep) => '<div class="reps-panel-rep-group">' + buildRepBlock(rep) + '</div>')
          .join('');
      } else {
        html +=
          '<p class="reps-panel-empty">Ainda n\xE3o encontramos um representante cadastrado para esta regi\xE3o.</p>';
        html +=
          '<a class="reps-panel-cta" href="#jfaHeader" id="repsGenericContact">Entrar em contato com a JFA<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>';
      }
      panel.innerHTML = html;
      Array.from(panel.querySelectorAll('[data-generic-contact]')).forEach((a) => {
        on(a, 'click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: ctx.reduceMotion ? 'auto' : 'smooth' });
        });
      });
      const backBtn = root.getElementById('repsPanelBack');
      if (backBtn) on(backBtn, 'click', () => deselectState());
      const genericContact = root.getElementById('repsGenericContact');
      if (genericContact) {
        on(genericContact, 'click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: ctx.reduceMotion ? 'auto' : 'smooth' });
        });
      }
    };
    const selectState = (uf) => {
      if (!statePaths[uf]) return;
      selectedUf = uf;
      clearHighlight();
      const repIds = getRepIdsForUf(uf);
      const reps = repIds.map((id) => repsById[id]).filter(Boolean);
      if (reps.length) {
        const servedUfs = /* @__PURE__ */ new Set();
        reps.forEach((rep) => rep.states.forEach((s) => servedUfs.add(s)));
        servedUfs.forEach((s) => {
          if (statePaths[s]) statePaths[s].classList.add(s === uf ? 'is-selected' : 'is-secondary');
        });
      } else {
        statePaths[uf].classList.add('is-empty-selected');
      }
      if (stage) stage.classList.add('has-selection');
      renderPanel(uf);
      hideSuggestions();
      hideTooltip();
      const st = stateByUf[uf];
      if (searchInput && st) searchInput.value = st.name;
      const heading = panel.querySelector('.reps-panel-state');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    };
    const deselectState = () => {
      selectedUf = null;
      clearHighlight();
      if (stage) stage.classList.remove('has-selection');
      if (searchInput) searchInput.value = '';
      hideSuggestions();
    };
    Object.keys(statePaths).forEach((uf) => {
      const p = statePaths[uf];
      on(p, 'mouseenter', (e) => {
        p.classList.add('is-hover');
        showTooltip(uf, e);
      });
      on(p, 'mousemove', (e) => showTooltip(uf, e));
      on(p, 'mouseleave', () => {
        p.classList.remove('is-hover');
        hideTooltip();
      });
      on(p, 'click', () => {
        if (selectedUf === uf) deselectState();
        else selectState(uf);
      });
      on(p, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectState(uf);
        }
      });
    });
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && selectedUf) deselectState();
    });
    let activeSuggestIndex = -1;
    let currentMatches = [];
    const updateActiveSuggestion = () => {
      if (!suggestEl) return;
      Array.from(suggestEl.children).forEach((el, i) =>
        el.classList.toggle('is-active', i === activeSuggestIndex),
      );
    };
    const renderSuggestions = (matches) => {
      currentMatches = matches;
      activeSuggestIndex = -1;
      if (!suggestEl || !searchInput) return;
      if (!matches.length) {
        suggestEl.innerHTML = '';
        searchInput.setAttribute('aria-expanded', 'false');
        return;
      }
      suggestEl.innerHTML = matches
        .map(
          (s, i) =>
            '<div class="reps-suggest-item" data-idx="' +
            i +
            '" role="option"><span class="uf">' +
            s.uf +
            '</span>' +
            s.name +
            '</div>',
        )
        .join('');
      searchInput.setAttribute('aria-expanded', 'true');
      Array.from(suggestEl.querySelectorAll('.reps-suggest-item')).forEach((el, i) => {
        on(el, 'mousedown', (e) => {
          e.preventDefault();
          selectState(matches[i].uf);
        });
      });
    };
    const matchStates = (query) => {
      const q = normalize(query);
      if (!q) return [];
      const exactUf = brazilStates.find((s) => s.uf.toLowerCase() === q);
      if (exactUf) return [exactUf];
      const starts = brazilStates.filter((s) => normalize(s.name).startsWith(q));
      const contains = brazilStates.filter((s) => starts.indexOf(s) === -1 && normalize(s.name).includes(q));
      return starts.concat(contains).slice(0, 8);
    };
    if (searchInput) {
      on(searchInput, 'input', () => {
        renderSuggestions(matchStates(searchInput.value));
      });
      on(searchInput, 'keydown', (e) => {
        if (!currentMatches.length) {
          if (e.key === 'Enter') {
            const q = normalize(searchInput.value);
            const exact = brazilStates.find((s) => normalize(s.name) === q || s.uf.toLowerCase() === q);
            if (exact) selectState(exact.uf);
          }
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeSuggestIndex = Math.min(activeSuggestIndex + 1, currentMatches.length - 1);
          updateActiveSuggestion();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeSuggestIndex = Math.max(activeSuggestIndex - 1, 0);
          updateActiveSuggestion();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          selectState(currentMatches[activeSuggestIndex >= 0 ? activeSuggestIndex : 0].uf);
        } else if (e.key === 'Escape') {
          hideSuggestions();
        }
      });
    }
    on(document, 'click', (e) => {
      if (!repsSection.contains(e.target)) return;
      if (!e.target.closest('.reps-search')) hideSuggestions();
    });
    let intlBuilt = false;
    if (intlToggle && intlPanel) {
      on(intlToggle, 'click', () => {
        const isOpen = intlPanel.classList.contains('is-open');
        if (isOpen) {
          intlPanel.classList.remove('is-open');
          intlToggle.setAttribute('aria-expanded', 'false');
          return;
        }
        if (!intlBuilt) {
          intlPanel.innerHTML =
            '<p class="reps-intl-regions">' +
            internationalSales.name +
            ', atendemos: ' +
            internationalSales.regions.join(', ') +
            '.</p><ul class="reps-intl-contacts">' +
            internationalSales.contacts
              .map(
                (c) =>
                  '<li>' +
                  c.name +
                  ': <a href="tel:' +
                  c.phone.replace(/[^\d+]/g, '') +
                  '">' +
                  c.phone +
                  '</a></li>',
              )
              .join('') +
            '</ul>';
          intlBuilt = true;
        }
        intlPanel.classList.add('is-open');
        intlToggle.setAttribute('aria-expanded', 'true');
      });
    }
  })();
}
