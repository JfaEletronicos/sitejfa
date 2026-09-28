/**
 * Detalhes dos produtos do setor Automotivo (página #/setores/automotivo/:id).
 * Conteúdo e fotos vindos do site automotivo.jfaeletronicos.com (fotos convertidas
 * para WebP em public/images/produtos). As chaves são os ids de `products.js`.
 * `blocks`: p = parágrafo, h = subtítulo, ul = lista (HTML só com <strong>).
 */
export const PRODUCT_DETAILS = {
  'fonte-storm-lithium': {
    images: [
      '/images/produtos/fonte-storm-lithium-1.webp',
      '/images/produtos/fonte-storm-lithium-2.webp',
      '/images/produtos/fonte-storm-lithium-3.webp',
      '/images/produtos/fonte-storm-lithium-4.webp',
      '/images/produtos/fonte-storm-lithium-5.webp',
      '/images/produtos/fonte-storm-lithium-6.webp',
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
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/01/FONTES-STORM-LITHIUM-MANUAL-RV07-1.pdf',
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
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2025/10/MANUAL-FONTE-STORM-TRUCK.pdf',
      },
    ],
  },
  'sr5-evolution': {
    images: [
      '/images/produtos/sr5-evolution-1.webp',
      '/images/produtos/sr5-evolution-2.webp',
      '/images/produtos/sr5-evolution-3.webp',
    ],
    summary:
      'O SR5 Evolution da JFA foi projetado para proporcionar segurança, praticidade e desempenho, redefinindo o padrão de qualidade em gerenciamento de áudio com suas seis…',
    blocks: [
      {
        t: 'p',
        h: 'O SR5 Evolution da JFA foi projetado para proporcionar segurança, praticidade e desempenho, redefinindo o padrão de qualidade em gerenciamento de áudio com suas seis saídas de comando remoto e funcionalidades avançadas. Com tecnologia de ponta e a confiança da JFA Eletrônicos, o SR5 é a escolha perfeita para quem busca qualidade e inovação em sistemas de som.',
      },
      {
        t: 'h',
        h: 'Diferenciais do SR5 Evolution',
      },
      {
        t: 'ul',
        items: [
          'Ativação sequencial de equipamentos, liga amplificadores e outros dispositivos de forma progressiva, eliminando os “estalos” de áudio e prevenindo danos ao sistema.',
          'Proteção contra baixa tensão, desliga automaticamente o sistema quando a tensão do banco de baterias está abaixo de 10V, preservando a vida útil dos componentes.',
          'Monitoramento em tempo real, o voltímetro integrado exibe a tensão da bateria diretamente no display, permitindo o acompanhamento preciso do desempenho.',
          'Personalização avançada, possibilidade de exibir mensagens personalizadas no display de matriz de pontos, com até 40 caracteres.',
          'Modos de exibição versáteis, alternância entre voltímetro, bargraph, texto e modos combinados, adaptando-se a diferentes preferências de uso.',
        ],
      },
      {
        t: 'p',
        h: 'O SR5 Evolution combina tecnologia de ponta com a confiança da JFA Eletrônicos, sendo ideal para entusiastas que exigem qualidade e inovação no gerenciamento de seus sistemas de som.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/12/Manual-SR5-Evolution-03_compressed.pdf',
      },
    ],
  },
  ap800x4: {
    images: ['/images/produtos/ap800wx4-1.webp'],
    summary:
      'O AP800Wx4 foi projetado para elevar a experiência sonora a um nível nunca antes alcançado, garantindo uma posição de destaque no mercado brasileiro e trazendo inovação…',
    blocks: [
      {
        t: 'p',
        h: 'O AP800Wx4 foi projetado para elevar a experiência sonora a um nível nunca antes alcançado, garantindo uma posição de destaque no mercado brasileiro e trazendo inovação e tecnologia com suas características incomparáveis.',
      },
      {
        t: 'h',
        h: 'Diferenciais do AP800Wx4',
      },
      {
        t: 'ul',
        items: [
          '<strong>Potência incomparável e pureza sonora,</strong> com 800W distribuídos por 4 canais, oferecendo volume e qualidade sonora impecáveis.',
          '<strong>Bass Boost Dinâmico</strong>, tecnologia que redefine frequências graves, proporcionando poder e profundidade mesmo em volumes baixos.',
          '<strong>Crossover avançado com DSP</strong>, ajustes precisos de frequência de 20Hz a 20kHz, garantindo a experiência auditiva ideal.',
          '<strong>Refrigeração líquida opcional</strong>, que permite a instalação mesmo nos ambientes mais desafiadores, sem comprometer a performance. O calor é eficientemente dissipado, garantindo operação em capacidade máxima sem risco de superaquecimento.',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/11/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-2111.pdf',
      },
    ],
  },
  ap400x4: {
    images: ['/images/produtos/ap400wx4-1.webp', '/images/produtos/ap400wx4-2.webp'],
    summary:
      'O AP400Wx4 foi projetado para elevar a experiência sonora a um nível nunca antes alcançado, garantindo uma posição de destaque no mercado brasileiro e trazendo inovação…',
    blocks: [
      {
        t: 'p',
        h: 'O AP400Wx4 foi projetado para elevar a experiência sonora a um nível nunca antes alcançado, garantindo uma posição de destaque no mercado brasileiro e trazendo inovação e tecnologia com suas características incomparáveis.',
      },
      {
        t: 'h',
        h: 'Diferenciais do AP400Wx4',
      },
      {
        t: 'ul',
        items: [
          '<strong>Potência incomparável e pureza sonora,</strong> com 400W distribuídos por 4 canais, oferecendo volume e qualidade sonora impecáveis.',
          '<strong>Bass Boost Dinâmico</strong>, tecnologia que redefine frequências graves, proporcionando poder e profundidade mesmo em volumes baixos.',
          '<strong>Crossover avançado com DSP</strong>, ajustes precisos de frequência de 20Hz a 20kHz, garantindo a experiência auditiva ideal.',
          '<strong>Refrigeração líquida opcional</strong>, que permite a instalação mesmo nos ambientes mais desafiadores, sem comprometer a performance. O calor é eficientemente dissipado, garantindo operação em capacidade máxima sem risco de superaquecimento.',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/11/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-2111.pdf',
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
  'fonte-carregador-redline': {
    images: ['/images/produtos/fonte-redline-1.webp'],
    summary:
      'A Fonte e Carregador Redline é uma fonte de alimentação de alta potência que pode ser usada para alimentar e carregar baterias automotivas.',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Fonte e Carregador Redline</strong> é uma fonte de alimentação de alta potência que pode ser usada para alimentar e carregar baterias automotivas. Faz parte de uma linha que leva a inovação e o desempenho a sério, operando em 3 modos:',
      },
      {
        t: 'ul',
        items: [
          'Modo Carga Lenta: carrega as baterias em fases graduais: elevação, absorção e equalização. O Modo Carga Lenta da Fonte Redline é ideal para recarregar baterias com pouca energia, obtendo assim a máxima eficiência no carregamento, sem gerar desgastes e aumentando a vida útil das baterias',
          'Modo Auto SCI: use-o quando o sistema estiver ligado ou quando precisar dar uma carga rápida na bateria. O Modo Auto SCI da Fonte Redline consegue manter a máxima potência na saída (14,4V) e entrar no sistema pulsado SCI somente com a bateria carregada, permanecendo em flutuação',
          'Modo Tensão de Saída: Possibilita escolher digitalmente entre 8 valores de tensão na saída da Fonte Redline: 12,6V / 12,8V / 13V / 13,2V / 13,8V / 14V / 14,2V e 14,4V',
        ],
      },
      {
        t: 'p',
        h: 'As fontes Redline podem ser encontradas nas amperagens: 60A, 120A e 200A.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-redline-RV01.pdf',
      },
    ],
  },
  'fontes-carregadores-sci': {
    images: ['/images/produtos/fonte-carregador-sci-1.webp'],
    summary:
      'A Fonte e Carregador SCI é uma fonte de alimentação de alta potência, que possibilita alimentar e carregar baterias automotivas com 14,4 volts ou Auto SCI.',
    blocks: [
      {
        t: 'p',
        h: 'A <strong>Fonte e Carregador SCI</strong> é uma fonte de alimentação de alta potência, que possibilita alimentar e carregar baterias automotivas com 14,4 volts ou Auto SCI.',
      },
      {
        t: 'p',
        h: 'Desenvolvida para proporcionar máxima eficiência na alimentação e carga das baterias no sistema de 12 volts, sem danificá-las, possui o exclusivo Sistema de Carga Inteligente (SCI) da JFA, que aumenta a eficiência na capacidade de acúmulo de carga da bateria e também sua vida útil, impedindo o aquecimento de suas placas, além de obter assim o máximo rendimento dos amplificadores do som automotivo.',
      },
      {
        t: 'p',
        h: 'Com a tecnologia PWM a Fonte e Carregador SCI dispõe de:',
      },
      {
        t: 'ul',
        items: [
          'Display e leds para monitorar tensão e corrente de saída',
          'Indicador de bateria carregada',
          'Bi-volt automático 110/220Vac',
        ],
      },
      {
        t: 'p',
        h: 'Elas estão disponíveis nas amperagens: 10A, 36A, 50A, 60A, 70A, 100A, 120A 150A, 200A e 200A monovolt.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-SCI-36-a-200-mono.pdf',
      },
      {
        label: 'Manual da versão 10A',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-fontes-10A-manual.pdf',
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
  'processador-audio-j4-redline': {
    images: ['/images/produtos/processador-j4-redline-1.webp'],
    summary:
      'A principal inovação do Processador J4 RedLine é a leitura dos níveis de áudio de entrada e saída no display gráfico, possibilitando o ajuste dos ganhos dos amplificadores.',
    blocks: [
      {
        t: 'p',
        h: 'A principal inovação do <strong>Processador J4 RedLine</strong> é a leitura dos níveis de áudio de entrada e saída no display gráfico, possibilitando o ajuste dos ganhos dos amplificadores. Além disso, simula o uso de um osciloscópio.',
      },
      {
        t: 'ul',
        items: [
          'Atualização de tela simultânea à variação do áudio',
          'Armazenamento dos picos (picos hold)',
          'Facilidade para ajustar a função limiter',
          'Telas interativas',
          'Equalizador master semiparamétrico de 15 bandas',
          'Equalizador paramétrico individual em cada via',
          'Função Osciloscópio',
          'Voltímetro na tela gráfica',
          'Texto customizável pelo cliente',
          'Ajuste do limite máximo do áudio de entrada',
          'Indicação de excesso de nível de entrada',
          '15 Vpp de saída',
        ],
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2023/01/manual-jfa-processador-redline-j4-trilingue.pdf',
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
  'carregador-portatil-redline': {
    images: ['/images/produtos/carregador-portatil-redline-1.webp'],
    summary:
      'O Carregador Portátil Redline F60 é versátil e possui características inéditas de funcionalidade e performance, além de poder ser usado como fonte de alimentação ou…',
    blocks: [
      {
        t: 'p',
        h: 'O <strong>Carregador Portátil Redline F60</strong> é versátil e possui características inéditas de funcionalidade e performance, além de poder ser usado como fonte de alimentação ou carregador de sua(s) bateria(s). Confira alguns exemplos de aplicações:',
      },
      {
        t: 'ul',
        items: [
          'Alimentar equipamentos com tomadas 12V (calibradores de pneu, aspirador de pó, carregador de celular e outros)',
          'Dar partidas em carros',
          'Carregar e recuperar baterias desgastadas',
        ],
      },
      {
        t: 'p',
        h: 'Possui <strong>painel multifuncional</strong>, através do qual consegue executar todas as funções do <strong>Carregador Portátil Redline F60 JFA</strong>',
      },
      {
        t: 'h',
        h: 'Modos e aplicação',
      },
      {
        t: 'p',
        h: '<strong>Carga lenta:</strong> Recuperar baterias; Aumentar a vida útil das baterias.',
      },
      {
        t: 'p',
        h: '<strong>Auto SCI:</strong> Dar partida rápida no carro; Fazer uma carga rápida.',
      },
      {
        t: 'p',
        h: '<strong>Tensão de saída:</strong> Operar como fonte com a opção de escolher digitalmente 8 níveis de tensão na saída de 12,6 a 14,4VLigar dispositivos em tomadas 12V.',
      },
    ],
    docs: [
      {
        label: 'Manual do produto',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2021/07/jfa-manual-carregador-60A-portatil-redline-manual-rv01.pdf',
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
        url: 'https://www.jfaeletronicos.com/qr-code/PBS.pdf',
      },
      {
        label: 'Sistema 240V: 5 baterias 48V/100A em série',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/07/SISTEMA-DE-CONEXAO-EM-SERIE-DE-5-BATERIAS-48V100A.pdf',
      },
      {
        label: 'Sistema 280V: 22 baterias 12,8V/100A em série',
        url: 'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2026/07/SISTEMA-DE-CONEXAO-EM-SERIE-DE-22-BATERIAS-128V100A-1.pdf',
      },
    ],
  },
};
