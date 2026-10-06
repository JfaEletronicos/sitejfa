/**
 * Detalhes dos produtos dos setores (página #/setores/:setor/:id).
 * Conteúdo e fotos vindos dos sites automotivo.jfaeletronicos.com e energia.jfaeletronicos.com
 * (fotos convertidas para WebP em public/images/produtos). As chaves são os ids de `products.js`;
 * produtos que não existem lá (variações com página própria no site) trazem `name` e `category`.
 * `blocks`: p = parágrafo, h = subtítulo, ul = lista, table = tabela técnica (HTML só com <strong> e tags de tabela).
 */
export const PRODUCT_DETAILS = {
  'fonte-storm-lithium': {
    images: [
      '/images/produtos/fonte-storm-lithium-1.webp',
      '/images/produtos/fonte-storm-lithium-2.webp',
      '/images/produtos/fonte-storm-lithium-3.webp',
    ],
    summary:
      'A Storm Lithium chega para expandir as possibilidades da linha Storm, oferecendo ainda mais tecnologia, inteligência e versatilidade.',
    blocks: [
      {
        t: 'p',
        h: '<strong>A Storm Lithium chega para expandir as possibilidades da linha Storm, oferecendo ainda mais tecnologia, inteligência e versatilidade.</strong>',
      },
      {
        t: 'p',
        h: 'Desenvolvida com recursos avançados e funções inteligentes, é a solução ideal para carregar, alimentar e monitorar sistemas com baterias, contando com Modo de Carga Lithium dedicado e total compatibilidade com baterias de lítio e chumbo-ácido.',
      },
      {
        t: 'p',
        h: 'Equipada com display gráfico interativo, tecnologia de ponta e funções exclusivas da linha Storm, a Storm Lithium integra modos inteligentes de carga, diagnóstico e performance, garantindo eficiência, segurança e alto desempenho em diferentes aplicações e cenários de uso.',
      },
      {
        t: 'h',
        h: 'Diferenciais da Fonte e Carregador Storm Lithium',
      },
      {
        t: 'ul',
        items: [
          'Modo de Carga Lithium dedicado, com compatibilidade total com baterias de lítio, ampliando as possibilidades de aplicação em sistemas modernos e inteligentes',
          'Display gráfico interativo e sistema intuitivo de seleção e ajuste de funções, permitindo acesso rápido às configurações e monitoramento em tempo real de tensão, corrente e potência',
          'Tensão de saída ajustável entre 12 V e 16 V, atendendo a diferentes necessidades operacionais',
          '10 modos inteligentes de funcionamento, incluindo SCI, carga lenta, carga Lithium, teste de CCA, entre outras opções adaptáveis a diversos tipos de baterias e situações de uso',
          'Carga lenta em quatro fases, garantindo recarga profunda e maior preservação da vida útil da bateria',
          'Smart Cooler, sistema de ventilação inteligente com controle dinâmico por PWM, que proporciona melhor eficiência térmica e menor nível de ruído',
        ],
      },
      {
        t: 'h',
        h: 'Disponibilidade',
      },
      {
        t: 'p',
        h: 'As fontes Storm Lithium estão disponíveis nas amperagens: 70 A e 120 A',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://jfaeletronicos.com/qr-code/STORMLITIO.pdf',
      },
    ],
  },
  'fonte-storm-220a': {
    images: ['/images/produtos/fonte-storm-220a-1.webp'],
    summary: 'A Storm 220A chegou para redefinir o padrão de fontes automotivas.',
    blocks: [
      {
        t: 'p',
        h: 'A Storm 220A chegou para redefinir o padrão de fontes automotivas. Projetada para quem exige o máximo em performance, controle e segurança, ela entrega muito mais que potência: entrega inteligência.',
      },
      {
        t: 'p',
        h: 'Com visual marcante, display moderno e fácil de operar, a Storm 220A é equipada com <strong>funções exclusivas que colocam você no comando</strong>. São <strong>10 modos inteligentes</strong>, incluindo opções para <strong>geradores</strong>, <strong>baterias de lítio</strong>, <strong>carga lenta</strong>, <strong>equalização</strong>, <strong>teste de CCA</strong> e muito mais.',
      },
      {
        t: 'p',
        h: 'E o melhor: configurar tudo isso é intuitivo. Basta girar o botão para navegar pelas funções e acompanhar cada etapa diretamente no display iluminado.',
      },
      {
        t: 'p',
        h: 'Com tecnologia de ponta e construção robusta, a Storm 220A garante <strong>estabilidade energética</strong>, <strong>proteção avançada contra falhas</strong>, e compatibilidade total com baterias automotivas, estacionárias e de lítio.',
      },
      {
        t: 'h',
        h: 'Diferenciais da Fonte e Carregador Storm 220',
      },
      {
        t: 'ul',
        items: [
          '<strong>Display gráfico completo e interativo</strong>, que facilita o acompanhamento em tempo real de todas as funções e parâmetros da fonte',
          '<strong>10 modos inteligentes de operação</strong>, incluindo SCI, carga lenta, lithium, teste de CCA e outras opções que se adaptam a diferentes tipos de bateria e situações de uso',
          '<strong>Compatível com baterias de lítio e geradores</strong>, ampliando as possibilidades de aplicação em sistemas modernos e exigentes',
          '<strong>Tensão de saída ajustável entre 12,5V e 14,5V</strong>, para personalizar o carregamento conforme a necessidade do sistema',
          '<strong>Função STORM</strong>, que eleva a tensão para até 15V por 30 segundos, extraindo o máximo desempenho dos seus amplificadores nos momentos mais exigentes',
          '<strong>Sistema de Carga Inteligente (SCI)</strong>, que analisa automaticamente o estado da bateria e adapta o carregamento para maior eficiência e segurança',
          '<strong>Carga lenta em três fases</strong>, garantindo recarga profunda e protegendo a vida útil da bateria',
          '<strong>Sistema de ventilação com controle PWM</strong>, que melhora a dissipação térmica e reduz o ruído durante o funcionamento',
          '<strong>Display digital com informações de tensão e corrente</strong>, oferecendo controle preciso do sistema',
          '<strong>Proteções contra subtensão, sobretensão, sobrecorrente e sobretemperatura</strong>, assegurando operação segura em qualquer condição',
          '<strong>Design moderno e resistente</strong>, ideal para quem exige robustez no uso diário.',
        ],
      },
      {
        t: 'p',
        h: 'A Storm 220 é sinônimo de tecnologia de ponta, alto desempenho e confiabilidade para quem leva som automotivo a sério.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/05/MANUAL-FONTE-STORM-220-1.pdf',
      },
    ],
  },
  'fonte-storm-truck': {
    images: ['/images/produtos/fonte-storm-truck-1.webp'],
    summary:
      'A Fonte e Carregador Storm Truck é a escolha definitiva para quem precisa de alta performance, robustez e segurança em aplicações de 24V.',
    blocks: [
      {
        t: 'p',
        h: 'A Fonte e Carregador Storm Truck é a escolha definitiva para quem precisa de alta performance, robustez e segurança em aplicações de 24V. Com tecnologia exclusiva da JFA Eletrônicos, ela foi especialmente desenvolvida para alimentar sistemas e carregar bancos de baterias de grande capacidade em caminhões, ônibus, motorhomes e outras aplicações pesadas.',
      },
      {
        t: 'p',
        h: 'Aliando tecnologia de ponta em carregamento inteligente e avançados sistemas de proteção, a Storm Truck garante máxima eficiência, confiabilidade e durabilidade. Seu projeto robusto e moderno é ideal tanto para o carregamento de baterias automotivas e estacionárias quanto para o fornecimento de alimentação direta a equipamentos que operam em 24V.',
      },
      {
        t: 'h',
        h: 'Diferenciais da Fonte e Carregador Storm Truck',
      },
      {
        t: 'ul',
        items: [
          'Tensão de saída selecionável para os modelos STORM TRUCK é de 25,2V / 26,0V / 26;8V / 27,6V / 28,0V / 28,8V',
          'Função Storm, que eleva a tensão para 31V por 30s, garantindo a máxima performance dos amplificadores',
          'Sistema de Carga Inteligente (SCI) que analisa e adapta a carga conforme o estado da bateria',
          'Carga lenta em três fases, promovendo carregamento eficiente e aumento da vida útil das baterias',
          'Sistema de diagnóstico da bateria integrado, permitindo avaliação rápida do estado de saúde do banco de baterias',
          'Ventilação inteligente com controle dinâmico via PWM, proporcionando maior eficiência térmica e menor ruído',
          'Design robusto e moderno, desenvolvido para suportar as exigências do uso pesado',
          'Proteções contra subtensão, sobretensão, sobrecorrente e sobretemperatura, garantindo máxima segurança em todas as condições de uso.',
        ],
      },
      {
        t: 'p',
        h: 'As fontes Storm Truck podem ser encontradas nas versões: 35A, 70A, 100A',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://jfaeletronicos.com/qr-code/TRUCK24V.pdf',
      },
    ],
  },
  'controle-k600-universal': {
    images: ['/images/produtos/controle-k600-universal-1.webp'],
    summary:
      'O Controle K600 Universal da JFA possui um dos melhores alcances do mercado, até 600m em área aberta, o que faz toda diferença em eventos de som automotivo, já que…',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Controle K600 Universal da JFA</strong> possui um dos melhores alcances do mercado, até 600m em área aberta, o que faz toda diferença em eventos de som automotivo, já que vários controles são usados simultaneamente. Veja suas características:',
      },
      {
        t: 'ul',
        items: [
          'Alcance de até 600 metros em área aberta',
          'Central slim com receptor ultrassensível',
          'Teclas de silicone com alta resistência, gravadas em baixo relevo',
          'Design e ergonomia que facilitam o uso',
          '4 combinações de cores',
        ],
      },
      {
        t: 'p',
        h: 'Além disso, o <strong>Controle K600 Universal</strong> pode ser configurado em dois modos de funcionamento:',
      },
      {
        t: 'ul',
        items: [
          '<strong>MODO CLONAR OU APRENDER:</strong> copia e codifica as funções a partir do controle IR original, com a tecnologia do infravermelho',
          '<strong>MODO MEMÓRIA:</strong> tem cadastrado em sua memória as configurações dos principais aparelhos de som e vídeo do mercado',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K600-Manual-RV09.pdf',
      },
    ],
  },
  'fonte-carregador-storm-lite': {
    images: ['/images/produtos/fonte-storm-lite-1.webp'],
    summary:
      'A Fonte e Carregador Storm Lite JFA é a melhor opção para alimentação com ótimo custo benefício.',
    blocks: [
      {
        t: 'p',
        h: 'A Fonte e Carregador Storm Lite JFA é a melhor opção para alimentação com ótimo custo benefício. Seu diferencial é possuir a voltagem de até 15.2V, com a tensão para equalização dos vasos internos da bateria, única do mercado.',
      },
      {
        t: 'h',
        h: 'Diferenciais da Fonte e Carregador Storm Lite',
      },
      {
        t: 'ul',
        items: [
          'Saída ajustável, 12V até 15,2V – tensão para equalização dos vasos internos da bateria',
          'Indicador de tensão, com voltagem de até 15.2V',
          'Smart cooler – sistema de ventilação inteligente com controle dinâmico por PWM',
          'Slim – design arrojado e compacto',
        ],
      },
      {
        t: 'p',
        h: 'As Fontes e Carregadores Storm Lite têm as versões: 50A, 60A, 70A, 120A e 200A.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/Fontes-STORM-Lite-Manual.pdf',
      },
    ],
  },
  'fonte-carregador-bob-storm': {
    images: ['/images/produtos/fonte-bob-storm-1.webp'],
    summary:
      'A fonte Bob Storm foi desenvolvida para a alimentação de caixas residenciais, comumente conhecidas como Caixas Bob.',
    blocks: [
      {
        t: 'p',
        h: 'A fonte Bob Storm foi desenvolvida para a alimentação de caixas residenciais, comumente conhecidas como Caixas Bob.',
      },
      {
        t: 'p',
        h: 'Foi pensando nisso que a JFA criou a Bob Storm, uma fonte específica para você que quer, sobretudo, simplificar o seu projeto de caixas residenciais.',
      },
      {
        t: 'p',
        h: 'Seu principal diferencial é ser utilizada sem a necessidade de uma bateria. Veja suas características:',
      },
      {
        t: 'ul',
        items: [
          'Função Storm que indica que a fonte está operando em seu mais alto potencial com tensão de saída para 15,2V.',
          'Smart cooler – sistema de ventilação inteligente com controle dinâmico por PWM',
          'Design harmônico que permite a adaptação da Bob Storm em projetos de forma compacta.',
        ],
      },
      {
        t: 'p',
        h: 'As fontes Bob Storm estão disponíveis nas amperagens:',
      },
      {
        t: 'ul',
        items: [
          'Fonte 200A mantém até 3.800W rms;*',
          'Fonte 120A mantém até 2.300W rms;*',
          'Fonte 90A mantém até 1.700W rms.*',
          'Fonte 60A mantém até 680 WRMS rms.*',
        ],
      },
      {
        t: 'p',
        h: '*com utilização de bateria.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/FONTES-BOB-MANUAL-RV02-27-03-25.pdf',
      },
    ],
  },
  'fonte-carregador-storm': {
    images: ['/images/produtos/fonte-storm-1.webp'],
    summary: 'A Fonte e Carregador Storm é mais que uma fonte.',
    blocks: [
      {
        t: 'p',
        h: 'A Fonte e Carregador Storm é mais que uma fonte. Ela é a revolução de tudo o que a JFA já produziu. Equipada com a mais alta tecnologia, compacta e com funções exclusivas, a Fonte Storm é a melhor escolha para carregar, alimentar e também monitorar o funcionamento de baterias automotivas.',
      },
      {
        t: 'p',
        h: 'Ela reúne as principais características das linhas SCI e Redline e inaugura um novo conceito de Fonte Inteligente.',
      },
      {
        t: 'h',
        h: 'Diferenciais da Fonte e Carregador Storm',
      },
      {
        t: 'ul',
        items: [
          'Função Storm que eleva, por curto tempo, a tensão de saída para 15V, dando a máxima performance ao amplificador',
          'Sistema de Carga Inteligente (SCI) e Sistema de Carga lenta em três fases',
          'Exclusiva função de diagnóstico da bateria, em apenas 10 segundos, através do medidor de CCA e análise real da capacidade de acúmulo de carga',
          'Smart cooler – sistema de ventilação inteligente com controle dinâmico por PWM',
          'Design compacto, menor que as linhas anteriores, e harmônico, ideal para qualquer projeto',
        ],
      },
      {
        t: 'p',
        h: 'As fontes Storm podem ser encontradas nas amperagens: 40A, 60A, 70A, 100A,120A, 200A e 200A monovolt.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/07/FONTES-STORM-MANUAL-RV03-11-07-25.pdf',
      },
    ],
  },
  'controle-acqua-1200': {
    images: ['/images/produtos/controle-acqua-1200-1.webp'],
    summary:
      'O Controle Acqua 1200 Universal é um controle de som automotivo de longa distância com resistência à água, desenvolvido para proporcionar uma experiência única ao…',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Controle Acqua 1200 Universal</strong> é um controle de som automotivo de longa distância com resistência à água, desenvolvido para proporcionar uma experiência única ao usuário nos eventos e no dia a dia.',
      },
      {
        t: 'p',
        h: 'Uma característica do <strong>Controle Acqua 1200 Universal</strong> é que, além de ser resistente à água, ele pode comandar players a uma distância de até 1200 metros em área aberta, sendo o maior alcance do mercado.',
      },
      {
        t: 'p',
        h: 'Outro ponto é que ele tem dois modos de funcionamento: o modo memória, que compreende aparelhos pré-cadastrados; e o modo aprender, que permite que ele seja codificado a partir do controle infravermelho (IR) original do player.',
      },
      {
        t: 'p',
        h: 'Além disso, possui:',
      },
      {
        t: 'ul',
        items: [
          'Teclas em silicone com alta resistência, gravadas em baixo relevo',
          'Design ergonômico',
          'Central slim e receptor ultrassensível',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-ACQUA-Manual-RV09.pdf',
      },
    ],
  },
  'conversor-rca-slim': {
    images: ['/images/produtos/conversor-rca-slim-1.webp'],
    summary:
      'O Conversor RCA Slim transforma a saída de alto-falantes do player original do sistema de som em saída RCA, adequando o nível de áudio.',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Conversor RCA Slim</strong> transforma a saída de alto-falantes do player original do sistema de som em saída RCA, adequando o nível de áudio. Também possui <strong>saída de comando remoto</strong>, recurso útil para players de fábrica que não possuem este sistema.',
      },
      {
        t: 'p',
        h: 'O <strong>Conversor RCA Slim da JFA</strong> dispõe de:',
      },
      {
        t: 'ul',
        items: [
          'Conversor de nível de sinal alto (alto-falante) para nível de sinal RCA',
          'Saída de comando remoto para acionamento dos amplificadores',
          'Proteção contra excesso de corrente e curto-circuito com o fio terra',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-conversor-rca-slim.pdf',
      },
    ],
  },
  'filtro-rca-antirruido': {
    images: ['/images/produtos/filtro-rca-antirruido-1.webp'],
    summary:
      'O Filtro RCA Antirruído JFA isola os fios terra do player e do amplificador, eliminando os ruídos gerados por “loop” de terra e evitando a queima de trilhas internas no player.',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Filtro RCA Antirruído JFA</strong> isola os fios terra do player e do amplificador, eliminando os ruídos gerados por “loop” de terra e evitando a queima de trilhas internas no player. Além disso, o equipamento dispõe de:',
      },
      {
        t: 'ul',
        items: ['2 entradas RCA', '2 saídas RCA', 'Filtro eletromagnético'],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-filtro-anti-ruido.pdf',
      },
    ],
  },
  'voltimetro-sequenciador-vs5hi': {
    images: ['/images/produtos/voltimetro-sequenciador-vs5hi-1.webp'],
    summary:
      'O Voltímetro e Sequenciador VS5HI destaca-se por desempenhar 3 funções em um mesmo equipamento:',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Voltímetro e Sequenciador VS5HI</strong> destaca-se por desempenhar 3 funções em um mesmo equipamento:',
      },
      {
        t: 'ul',
        items: ['Voltímetro de alta tensão', 'Voltímetro de baixa tensão', 'Sequenciador de comando remoto'],
      },
      {
        t: 'p',
        h: 'O <strong>Voltímetro e Sequenciador VS5H</strong> da JFA foi desenvolvido com tecnologia de ponta e design arrojado, além de possuir proteção contra baixa tensão, desativando a saída remota se o sistema atingir uma tensão menor do que 9,5 volts.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/manual-voltimetro-sequenciador-vs5hi-trilingue.pdf',
      },
    ],
  },
  'controle-k1200-universal': {
    images: ['/images/produtos/controle-k1200-universal-1.webp'],
    summary:
      'O Controle K1200 Universal da JFA tem o melhor alcance em área aberta do mercado, o que faz toda a diferença durante os eventos de som automotivo.',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Controle K1200 Universal da JFA</strong> tem o <strong>melhor alcance em área aberta do mercado</strong>, o que faz toda a diferença durante os eventos de som automotivo.',
      },
      {
        t: 'ul',
        items: [
          'Alcance de até 1.200 metros em área aberta',
          'Teclas de silicone com alta resistência, gravadas em baixo relevo',
          'Design e ergonomia que facilitam o uso',
          '6 combinações de cores',
          'Central slim com receptor ultrassensível',
        ],
      },
      {
        t: 'p',
        h: 'Além disso, o <strong>Controle K1200</strong> tem dois modos de funcionamento:',
      },
      {
        t: 'ul',
        items: [
          '<strong>Modo memória:</strong> tem já cadastradas em sua memória as configurações dos principais aparelhos de som e vídeo do mercado',
          '<strong>Modo aprender:</strong> copia e codifica as funções a partir do controle IR original',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K1200-Manual-RV09.pdf',
      },
    ],
  },
  'controle-k600': {
    images: ['/images/produtos/controle-k600-1.webp'],
    summary:
      'O Controle K600 da JFA tem um dos melhores alcances em área aberta do mercado, o que faz toda a diferença durante os eventos de som automotivo, quando vários controles…',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Controle K600 da JFA</strong> tem um dos <strong>melhores alcances em área aberta do mercado</strong>, o que faz toda a diferença durante os eventos de som automotivo, quando vários controles são usados simultaneamente.',
      },
      {
        t: 'ul',
        items: [
          'Alcance de até 600 metros em área aberta',
          'Teclas de silicone com alta resistência, gravadas em baixo relevo',
          'Design e ergonomia que facilitam o uso',
          '05 combinações de cores',
          'Memória com mais de 220 aparelhos já cadastrados para áudio e vídeo',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-K600-Manual-RV09.pdf',
      },
    ],
  },
  'controle-redline': {
    images: ['/images/produtos/controle-redline-1.webp'],
    summary:
      'O Controle Redline JFA é o único do mercado que permite controlar o player através das interfaces WR e SWC, eliminando a necessidade de ter um sensor infravermelho.',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Controle Redline JFA</strong> é o único do mercado que permite <strong>controlar o player através das interfaces WR e SWC</strong>, eliminando a necessidade de ter um sensor infravermelho. Dessa forma, garante uma perfeita comunicação entre o receptor e o player. Além disso, o <strong>controle Redline</strong> possui o maior alcance em área aberta do mercado e alta precisão ao acionar as teclas.',
      },
      {
        t: 'h',
        h: 'Conheça os outros benefícios',
      },
      {
        t: 'ul',
        items: [
          'Alcance de 1.200 metros (áreas abertas)',
          'Agilidade de uso durante eventos de som automotivo (comandos rápidos devido a interface “wire”)',
          'Design anatômico com excelente ergonomia',
          'Teclas de silicone com alta resistência. gravadas em baixo relevo',
          'Central slim com receptor ultrassensível',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/CONTROLE-REDLINE-WR-SWC-Manual-RV09.pdf',
      },
    ],
  },
  'pbs-protetor-baterias-serie': {
    images: ['/images/produtos/pbs-protetor-baterias-serie-1.webp'],
    summary:
      'A solução da JFA para usar baterias de lítio em série com segurança, protegendo a BMS durante a operação.',
    blocks: [
      {
        t: 'p',
        h: 'O PBS (Protetor de Baterias em Série) é a solução desenvolvida pela JFA para permitir a utilização de baterias de lítio em série com segurança, protegendo a BMS durante a operação.',
      },
      {
        t: 'p',
        h: 'Projetado para aplicações de alta voltagem, o PBS amplia as possibilidades de montagem do sistema, oferecendo mais confiabilidade e praticidade para o seu projeto.',
      },
      {
        t: 'h',
        h: 'Principais benefícios',
      },
      {
        t: 'ul',
        items: [
          'Com comando remoto interno',
          'Permite a utilização de baterias de lítio em série',
          'Protege a BMS durante a operação',
          'Ideal para sistemas de alta voltagem',
          'Instalação prática e segura',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://jfaeletronicos.com/qr-code/PBS.pdf',
      },
      {
        label: 'Sistema 240V: 5 baterias 48V/100A em série',
        url: 'https://jfaeletronicos.com/qr-code/PBS/SCS5B48V100A.pdf',
      },
      {
        label: 'Sistema 280V: 22 baterias 12,8V/100A em série',
        url: 'https://jfaeletronicos.com/qr-code/PBS/SCS22B12V100A.pdf',
      },
    ],
  },
  'patch-panel-poe-giga': {
    images: ['/images/produtos/patch-panel-poe-giga-1.webp'],
    summary:
      'O Patch Panel Régua PoE GIGA JFA permite que você controle equipamentos, com tráfego de dados e de energia no mesmo cabo UTP (PoE).',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Patch Panel Régua PoE GIGA JFA</strong> permite que você <strong>controle equipamentos, com tráfego de dados e de energia</strong> no mesmo cabo UTP (PoE). Dessa forma, a quantidade de cabos usados na instalação é reduzida, facilitando a <strong>organização do espaço.</strong>',
      },
      {
        t: 'p',
        h: 'Use o <strong>Patch Panel Régua PoE GIGA</strong> para alimentar aparelhos com tensão entre 10,8 Vdc e 52,8 Vdc — também é possível utilizar uma Fonte Nobreak em conjunto, garantindo assim o fornecimento contínuo de energia.',
      },
      {
        t: 'p',
        h: 'Elas podem ser encontradas com 5, 10 e 12 portas.',
      },
      {
        t: 'p',
        h: 'O sistema do Patch Panel JFA tem proteção individual e conectores RJ4 blindados.',
      },
      {
        t: 'h',
        h: 'Aplicações',
      },
      {
        t: 'ul',
        items: [
          'Equipamentos de telecomunicações',
          'Pontos de acesso sem fio',
          'Equipamentos de CFTV',
          'Telefonia sobre IP (VOIP)',
          'Redes industriais',
        ],
      },
      {
        t: 'h',
        h: 'Características técnicas',
      },
      {
        t: 'table',
        html: '<table> <thead> <tr> <td></td><th>FAST 5 PORTAS</th><th>GIGA 5 PORTAS</th><th>FAST 10 PORTAS</th><th>GIGA 10 PORTAS</th><th>GIGA 12 PORTAS</th> </tr> </thead> <tbody> <tr> <td>Entrada Vdc</td><td colspan="5">10,8V ~ 52,8V</td> </tr> <tr> <td>Saída Vdc</td><td colspan="5">10,8V ~ 52,8V</td> </tr> <tr> <td>Portas LAN</td><td colspan="2">5</td><td colspan="2">10</td><td>12</td> </tr> <tr> <td>Portas POE</td><td colspan="2">5</td><td colspan="2">10</td><td>12</td> </tr> <tr> <td>Conexão RJ45</td><td colspan="5">Blindado</td> </tr> <tr> <td>Corrente por porta</td><td colspan="5">1A</td> </tr> <tr> <td>Proteção</td><td colspan="5">Curto circuito e sobrecarga</td> </tr> <tr> <td>Velocidade</td><td>10/100Mbps</td><td>10/100/1000Mbps</td><td>10/100Mbps</td><td>10/100/1000Mbps</td><td>10/100/1000Mbps</td> </tr> <tr> <td>Peso em gramas</td><td>226</td><td>252</td><td>725</td><td>776</td><td>856</td> </tr> <tr> <td>Dimensões (LxAxP)</td><td>195x31x42mm</td><td>195x31x42mm</td><td>Rack 19U" 1U</td><td>Rack 19U" 1U</td><td>Rack 19" 1U</td> </tr> </tbody> </table>',
      },
    ],
    docs: [],
    name: 'Patch Panel Régua PoE GIGA',
    category: 'Telecom',
  },
  'fonte-nobreak-snmp': {
    images: [
      '/images/produtos/fonte-nobreak-snmp-1.webp',
      '/images/produtos/fonte-nobreak-snmp-2.webp',
      '/images/produtos/fonte-nobreak-snmp-3.webp',
    ],
    summary:
      'A Fonte Nobreak JFA é ideal para alimentar equipamentos que necessitam de fluxos de energia contínuos e sem variações, demanda muito comum no mercado de provedores.',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Fonte Nobreak JFA</strong> é ideal para alimentar equipamentos que necessitam de <strong>fluxos de energia contínuos e sem variações</strong>, demanda muito comum no mercado de provedores.',
      },
      {
        t: 'p',
        h: 'Além disso, a Fonte Nobreak protege os equipamentos contra os danos ocasionados por falta da tensão ou oscilações da rede elétrica.',
      },
      {
        t: 'p',
        h: 'Outro ponto positivo da Fonte Nobreak da JFA é a funcionalidade de concentrar o fornecimento de energia para vários equipamentos do sistema, facilitando a conexão em apenas um ponto, o que permite a otimização e a melhor organização do espaço.',
      },
      {
        t: 'ul',
        items: [
          'Teste Remoto de Autonomia do Banco de Baterias',
          'Gerenciamento Via Protocolo SNMP (ambiente ZABBIX)',
          'Sistema de Carga Inteligente (SCI) para a otimização da carga e prolongamento da vida útil das baterias',
          'Funcionamento on-line (sem comutação)',
        ],
      },
      {
        t: 'p',
        h: 'Elas podem ser encontradas nas tensões: 24V e 48V.',
      },
      {
        t: 'h',
        h: 'Características técnicas',
      },
      {
        t: 'table',
        html: '<table> <thead> <tr> <th>MODELO </th><th>TENSÃO DE SAÍDA</th><th>CORRENTE DE SAÍDA</th><th>CAR. INTELIGENTE CARGA/FLUTUAÇÃO</th><th>CORRENTE DE CARGA</th><th>POTÊNCIA TOTAL</th> </tr> </thead> <tbody> <tr> <td>24V. 20A. 20A</td><td>24V</td><td>20A</td><td>28,8/27,6V</td><td>20A</td><td>1056W</td> </tr> <tr> <td>-48V. 15A. 15A</td><td>-48V</td><td>15A</td><td>57,6/55,2V</td><td>15A</td><td>1584W</td> </tr> <tr> <td>-48V. 30A. 15A</td><td>-48V</td><td>30A</td><td>57,6/55,2V</td><td>15A</td><td>2304W</td> </tr> <tr> <td>-48V. 40A. 10A</td><td>-48V</td><td>40A</td><td>57,6/55,2V</td><td>10A</td><td>2496W</td> </tr> <tr> <td>+48V. 15A. 15A</td><td>+48V</td><td>15A</td><td>57,6/55,2V</td><td>15A</td><td>1584W</td> </tr> <tr> <td>+48V. 30A. 15A</td><td>+48V</td><td>30A</td><td>57,6/55,2V</td><td>15A</td><td>2304W</td> </tr> <tr> <td>+48V. 40A. 10A</td><td>+48V</td><td>40A</td><td>57,6/55,2V</td><td>10A</td><td>2496W</td> </tr> </tbody> </table>',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://jfaeletronicos.com/qr-code/NOBREAK-48ALL-COMUNIC.pdf',
      },
    ],
    name: 'Fonte Nobreak 24V e 48V (SNMP)',
    category: 'Fontes Nobreak',
  },
  'fonte-nobreak': {
    images: ['/images/produtos/fonte-nobreak-1.webp'],
    summary:
      'A Fonte Nobreak da JFA garante energia ininterrupta para os equipamentos e os mantém ligados quando há falta de rede AC (rede elétrica 127V/220V).',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Fonte Nobreak da JFA</strong> garante energia ininterrupta para os equipamentos e os mantém ligados quando há falta de rede AC (rede elétrica 127V/220V). Além disso, protege contra possíveis danos oriundos da rede elétrica.',
      },
      {
        t: 'p',
        h: 'A <strong>Fonte Nobreak</strong> possui conector para ligação a um banco de baterias, que são <strong>carregadas continuamente com carga inteligente,</strong> além de um <strong>display para monitoramento da tensão e corrente</strong>.',
      },
      {
        t: 'h',
        h: 'Aplicações',
      },
      {
        t: 'ul',
        items: [
          'Rádios Wireless',
          'Antenas de transmissão e recepção de internet',
          'Controle de alarmes',
          'Sistemas de emergência e segurança (CFTV)',
          'Switch',
          'Roteadores',
        ],
      },
      {
        t: 'p',
        h: 'O <strong>Sistema de Carga Inteligente da Fonte Nobreak da JFA</strong> garante recargas mais eficientes, prolongando a vida útil das baterias.',
      },
      {
        t: 'p',
        h: 'Elas podem ser encontradas nas tensões: 12V 8A e 24V 6A.',
      },
      {
        t: 'h',
        h: 'Características técnicas',
      },
      {
        t: 'table',
        html: '<table> <thead> <tr> <th>MODELO</th><th>12V . 8A </th><th>24V . 6A</th> </tr> </thead> <tbody> <tr> <td>Entrada de rede</td><td colspan="2">86 a 240Vac</td> </tr> <tr> <td>Frequência de entrada</td><td colspan="2">50/60Hz</td> </tr> <tr> <td>Saída principal</td><td>12V</td><td>24V</td> </tr> <tr> <td>Potência</td><td>107W</td><td>160W</td> </tr> <tr> <td>Saída carregador</td><td>13,8 / 14,4V - (Carregador inteligente)</td><td>27,6 / 28,8V - (Carregador inteligente)</td> </tr> <tr> <td>Corrente máxima</td><td>8A (Compartilhada principal / carregador)</td><td>6A (Compartilhada principal / carregador)</td> </tr> <tr> <td>Rendimento</td><td colspan="2">>87%</td> </tr> <tr> <td>Comutação rede/bateria</td><td colspan="2">Funcionamento online (Sem comutação)</td> </tr> <tr> <td rowspan="3">Proteções</td><td colspan="2">Curto e excesso de carga nas saídas principais e carregamento</td> </tr> <tr> <td colspan="2">Surtos de tensão e fusível interno 5A de entrada</td> </tr> <tr> <td colspan="2">Subteção no modo bateria com desligamento em 10,5V</td> </tr> <tr> <td rowspan="3">Painel de medidas</td><td colspan="2">Tensão de saída</td> </tr> <tr> <td colspan="2">Tensão de bateria</td> </tr> <tr> <td colspan="2">Corrente total (Carregador + Principal)</td> </tr> <tr> <td>MTBF</td><td colspan="2">>60.000 horas (estimado)</td> </tr> <tr> <td>Ventilação</td><td colspan="2">Forçada</td> </tr> <tr> <td rowspan="2">Dimensões adaptáveis</td><td colspan="2">Rack - 19\'\' 1U</td> </tr> <tr> <td colspan="2">Bancada - 220X140X44(mm) com fixação por parafuso</td> </tr> <tr> <td>Peso</td><td colspan="2">1,120kg</td> </tr> </tbody> </table>',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://jfaeletronicos.com/qr-code/NB482412.pdf',
      },
    ],
    name: 'Fonte Nobreak 12V e 24V',
    category: 'Fontes Nobreak',
  },
  'conversor-dc-dc-step-down-up': {
    images: ['/images/produtos/conversor-dc-dc-step-down-up-1.webp'],
    summary:
      'O Conversor DC DC Isolado alimenta equipamentos com referenciais de terra invertidos e que estejam instalados em um mesmo gabinete, possibilitando o uso de apenas um…',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Conversor DC DC Isolado</strong> alimenta equipamentos com referenciais de terra invertidos e que estejam instalados em um mesmo gabinete, possibilitando o uso de apenas um banco de baterias para todo o sistema.',
      },
      {
        t: 'p',
        h: 'Outra aplicação do <strong>Conversor DC DC Isolado</strong> é reduzir (<strong>E4824</strong>) ou elevar (<strong>E2448</strong>) as tensões de saída.',
      },
      {
        t: 'p',
        h: 'O <strong>Conversor DC DC Isolado</strong> possui processador ARM 32 bits, proporcionando:',
      },
      {
        t: 'ul',
        items: [
          'Proteção contra excesso de temperatura e corrente de saída',
          'Desligamento automático por baixa tensão na entrada (descargas profundas)',
          'Display com mostrador de tensão e corrente',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://energia.jfaeletronicos.com/wp-content/uploads/sites/3/2021/07/manual-jfa-conversor-dc-dc-step-down-E48.24S-step-up-24.48S-isolado.pdf',
      },
    ],
  },
  'patch-panel-poe-fast': {
    images: ['/images/produtos/patch-panel-poe-fast-1.webp'],
    summary:
      'A Patch Panel Régua PoE Fast JFA permite que você controle equipamentos, com tráfego de dados e de energia no mesmo cabo UTP (PoE).',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Patch Panel Régua PoE Fast JFA</strong> permite que você <strong>controle equipamentos, com tráfego de dados e de energia</strong> no mesmo cabo UTP (PoE). Dessa forma, a quantidade de cabos usados na instalação é reduzida, facilitando a <strong>organização do espaço.</strong>',
      },
      {
        t: 'p',
        h: 'Use o <strong>Patch Panel Régua PoE Fast</strong> para alimentar aparelhos com tensão entre 10,8 Vdc e 52,8 Vdc — também é possível utilizar uma Fonte Nobreak em conjunto, garantindo assim o fornecimento contínuo de energia.',
      },
      {
        t: 'p',
        h: 'O sistema do Patch Panel JFA tem proteção individual e conectores RJ4 blindados.',
      },
      {
        t: 'h',
        h: 'Aplicações',
      },
      {
        t: 'ul',
        items: [
          'Equipamentos de telecomunicações',
          'Pontos de acesso sem fio',
          'Equipamentos de CFTV',
          'Telefonia sobre IP (VOIP)',
          'Redes industriais',
        ],
      },
      {
        t: 'p',
        h: 'Elas podem ser encontradas com 5 ou 10 portas.',
      },
      {
        t: 'h',
        h: 'Características técnicas',
      },
      {
        t: 'table',
        html: '<table> <thead> <tr> <td></td><th>FAST 5 PORTAS</th><th>GIGA 5 PORTAS</th><th>FAST 10 PORTAS</th><th>GIGA 10 PORTAS</th><th>GIGA 12 PORTAS</th> </tr> </thead> <tbody> <tr> <td>Entrada Vdc</td><td colspan="5">10,8V ~ 52,8V</td> </tr> <tr> <td>Saída Vdc</td><td colspan="5">10,8V ~ 52,8V</td> </tr> <tr> <td>Portas LAN</td><td colspan="2">5</td><td colspan="2">10</td><td>12</td> </tr> <tr> <td>Portas POE</td><td colspan="2">5</td><td colspan="2">10</td><td>12</td> </tr> <tr> <td>Conexão RJ45</td><td colspan="5">Blindado</td> </tr> <tr> <td>Corrente por porta</td><td colspan="5">1A</td> </tr> <tr> <td>Proteção</td><td colspan="5">Curto circuito e sobrecarga</td> </tr> <tr> <td>Velocidade</td><td>10/100Mbps</td><td>10/100/1000Mbps</td><td>10/100Mbps</td><td>10/100/1000Mbps</td><td>10/100/1000Mbps</td> </tr> <tr> <td>Peso em gramas</td><td>226</td><td>252</td><td>725</td><td>776</td><td>856</td> </tr> <tr> <td>Dimensões (LxAxP)</td><td>195x31x42mm</td><td>195x31x42mm</td><td>Rack 19U" 1U</td><td>Rack 19U" 1U</td><td>Rack 19" 1U</td> </tr> </tbody> </table>',
      },
    ],
    docs: [],
    name: 'Patch Panel Régua PoE FAST',
    category: 'Telecom',
  },
  'patch-panel-poe-gerenciavel': {
    images: ['/images/produtos/patch-panel-poe-gerenciavel-1.webp'],
    summary:
      'O Patch Panel Régua PoE Gerenciável JFA permite que você controle até 10 equipamentos on-line, com tráfego de dados e de energia no mesmo cabo UTP (PoE).',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Patch Panel Régua PoE Gerenciável JFA</strong> permite que você <strong>controle até 10 equipamentos on-line</strong>, com <strong>tráfego de dados e de energia</strong> no mesmo cabo UTP (PoE). Essa característica reduz a quantidade de cabos na instalação, facilitando a <strong>organização do espaço</strong> e a gestão dos equipamentos.',
      },
      {
        t: 'p',
        h: 'O <strong>Patch Panel Régua PoE Gerenciável JFA</strong> utiliza o protocolo SNMP e pode ser conectado a alguns softwares de gerenciamento de rede (OpManager e Zabbix – não inclusos). <strong>Sua interface WEB permite o monitoramento de todas as funcionalidades em tempo real.</strong>',
      },
      {
        t: 'h',
        h: 'Aplicações',
      },
      {
        t: 'ul',
        items: [
          'Equipamentos de telecomunicações',
          'Pontos de acesso sem fio',
          'Equipamentos de CFTV',
          'Telefonia sobre IP (VOIP)',
          'Redes industriais',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://energia.jfaeletronicos.com/wp-content/uploads/sites/3/2021/07/manual-jfa-patch-panel-POE-10P-gerenciavel-RV03-1.pdf',
      },
    ],
    name: 'Patch Panel Régua PoE Gerenciável',
    category: 'Telecom',
  },
  'pdu-dc': {
    images: ['/images/produtos/pdu-dc-1.webp'],
    summary:
      'A Unidade de Divisão de Energia PDU DC é um equipamento com a qualidade JFA pensado para a distribuição em painéis elétricos e racks DC.',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Unidade de Divisão de Energia PDU DC</strong> é um equipamento com a qualidade <strong>JFA</strong> pensado para a distribuição em painéis elétricos e racks DC.',
      },
      {
        t: 'p',
        h: 'Permitindo que uma entrada de tensão contínua possa ser distribuída através de quatro saídas, acionadas através de quatro disjuntores individuais, com proteção de corrente.',
      },
      {
        t: 'p',
        h: 'Com design compacto, nas dimensões de 1U (uma unidade de rack 19”), o produto oferece segurança e agilidade no seccionamento e operação dos equipamentos.',
      },
      {
        t: 'p',
        h: 'Outra característica da <strong>Unidade de Divisão de Energia PDU DC</strong> é que ele pode ser ligado a qualquer nível de tensão DC entre 10V e 60V e possui três leds indicadores de entrada DC, sendo 12V (entre 9 e 16V), 24V (entre 17 e 36V) e 48V (entre 37 e 60V).',
      },
      {
        t: 'p',
        h: 'Por fim, também há um LED indicativo de polo invertido e cada saída, ao ser acionada pelo disjuntor, acende outro LED informando que está energizada.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://energia.jfaeletronicos.com/wp-content/uploads/sites/3/2021/12/manual-jfa-qdcc.pdf',
      },
    ],
  },
  'gerenciador-fonte-redundante': {
    images: ['/images/produtos/gerenciador-fonte-redundante-1.webp'],
    summary:
      'O Gerenciador de Fontes Redundante da JFA é uma solução moderna para a operação de fontes nobreak com a utilização de apenas um banco de baterias e a possibilidade de…',
    blocks: [
      {
        t: 'p',
        h: 'O Gerenciador de Fontes Redundante da JFA é uma solução moderna para a operação de fontes nobreak com a utilização de apenas um banco de baterias e a possibilidade de utilização em dois modos: 2 fontes ligadas em paralelo ou 1 fonte ligada e a outra em redundância. Tudo com máxima segurança e eficiência para o seu provedor.',
      },
      {
        t: 'p',
        h: 'Ele possui dois modos de funcionamento e é programado para ser também gerenciado remotamente, via protocolo SNMP (Simple Network Management Protocol), em conjunto com softwares como o OpManager e o Zabbix (não inclusos).',
      },
      {
        t: 'p',
        h: 'Além disso, o GFR conta com a tecnologia exclusiva “sensor de porta aberta”, que permite saber se pessoas não autorizadas tiveram acesso ao rack.',
      },
      {
        t: 'h',
        h: 'Diferenciais',
      },
      {
        t: 'ul',
        items: [
          'Gerenciável à distância, via protocolo SNMP e Web',
          'Funcionamento ininterrupto, sem comutação',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://energia.jfaeletronicos.com/wp-content/uploads/sites/3/2021/11/manual-jfa-gerenciador-de-fonte-redundante.pdf',
      },
    ],
  },
  'equalizador-balanceador-banco-baterias': {
    images: ['/images/produtos/equalizador-balanceador-banco-baterias-1.webp'],
    summary:
      'O Equalizador Balanceador para Banco de Baterias da JFA Eletrônicos é utilizado para controlar a tensão de cada bateria durante seu carregamento.',
    blocks: [
      {
        t: 'p',
        h: 'O Equalizador Balanceador para Banco de Baterias da JFA Eletrônicos é utilizado para controlar a tensão de cada bateria durante seu carregamento.',
      },
      {
        t: 'p',
        h: 'Isso permite que todas as suas baterias sejam carregadas em uma mesma tensão. Consequentemente, a sua vida útil será mais longa.',
      },
      {
        t: 'p',
        h: 'A finalidade de um balanceador para banco de baterias é equalizar a diferença na tensão que ocorre durante os processos de carga e descarga de suas baterias.',
      },
      {
        t: 'p',
        h: 'Veja suas principais características:',
      },
      {
        t: 'ul',
        items: [
          '1 equalizador para cada 2 baterias',
          'Conexão para 48V (4 baterias de 12V em série)',
          'Conexão para 24V (2 baterias de 12V em série)',
          'Display de LEDs com indicadores de fluxo de corrente',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://energia.jfaeletronicos.com/wp-content/uploads/sites/3/2022/08/manual-jfa-equalizador-balanceador-para-banco-de-baterias.pdf',
      },
    ],
  },
};
