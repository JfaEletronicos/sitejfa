/**
 * Catálogo de exportação: o que o site mostra em inglês e em espanhol.
 *
 * É a mesma lista de produtos do site de exportação da JFA
 * (automotivo.jfaeletronicos.com/en/products), com os textos em inglês de lá e a
 * versão em espanhol traduzida deles. Fotos: as mesmas do site em português
 * (sem fundo). Manuais: os de exportação (inglês/espanhol) quando existem.
 *
 * Cada produto: `id` (usado na URL #/setores/automotivo/:id), `group` (aba do
 * filtro), `images`, `manualUrl` e, por idioma, `name`, `summary` e `blocks`
 * (mesmo formato de productDetails.js: p / h / ul).
 */

const P = (en, es) => ({ en, es });

/** Abas do catálogo de exportação, na ordem em que aparecem. */
export const EXPORT_GROUPS = [
  { key: 'amplifiers', label: P('Amplifiers', 'Amplificadores') },
  { key: 'power', label: P('Power supplies and chargers', 'Fuentes y cargadores') },
  { key: 'controls', label: P('Remote controls', 'Controles remotos') },
  { key: 'accessories', label: P('Accessories', 'Accesorios') },
];

export const EXPORT_PRODUCTS = [
  {
    id: 'ap400x4',
    group: 'amplifiers',
    images: ['/images/produtos/ap400wx4-1.webp', '/images/produtos/ap400wx4-2.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-Exportacao-Ingles-e-Espanhol-2111-1.pdf',
    name: P('AP400Wx4', 'AP400Wx4'),
    category: P('Amplifier', 'Amplificador'),
    summary: P(
      'Designed to elevate the sound experience to an unprecedented level, with innovation and technology.',
      'Diseñado para llevar la experiencia sonora a un nivel sin precedentes, con innovación y tecnología.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The AP400Wx4 is designed to elevate the sound experience to an unprecedented level, bringing innovation and technology with its unparalleled features.',
        },
        { t: 'h', h: 'Key features of the AP400Wx4' },
        {
          t: 'ul',
          items: [
            '<strong>Unmatched power and sound purity,</strong> with 400W distributed across 4 channels, delivering impeccable volume and sound quality.',
            '<strong>Dynamic Bass Boost</strong>, a technology that redefines low frequencies, providing power and depth even at low volumes.',
            '<strong>Advanced crossover with DSP</strong>, offering precise frequency adjustments from 20Hz to 20kHz, ensuring the ideal listening experience.',
            '<strong>Optional liquid cooling</strong>, allowing installation even in the most challenging environments without compromising performance.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El AP400Wx4 fue diseñado para llevar la experiencia sonora a un nivel sin precedentes, con la innovación y la tecnología de sus características incomparables.',
        },
        { t: 'h', h: 'Características principales del AP400Wx4' },
        {
          t: 'ul',
          items: [
            '<strong>Potencia incomparable y pureza sonora,</strong> con 400W distribuidos en 4 canales, que ofrecen volumen y calidad de sonido impecables.',
            '<strong>Bass Boost dinámico</strong>, tecnología que redefine las frecuencias graves y aporta potencia y profundidad incluso a bajo volumen.',
            '<strong>Crossover avanzado con DSP</strong>, con ajustes de frecuencia precisos de 20Hz a 20kHz para una experiencia auditiva ideal.',
            '<strong>Refrigeración líquida opcional</strong>, que permite la instalación incluso en los ambientes más exigentes sin comprometer el rendimiento.',
          ],
        },
      ],
    ),
  },
  {
    id: 'ap800x4',
    group: 'amplifiers',
    images: ['/images/produtos/ap800wx4-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2024/08/Amplificador-de-audio-da-JFA-DSP400-e-DSP800-Exportacao-Ingles-e-Espanhol-2111-1.pdf',
    name: P('AP800Wx4', 'AP800Wx4'),
    category: P('Amplifier', 'Amplificador'),
    summary: P(
      'Twice the power of the AP line: 800W across 4 channels with DSP and Dynamic Bass Boost.',
      'El doble de potencia de la línea AP: 800W en 4 canales, con DSP y Bass Boost dinámico.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The AP800Wx4 takes the AP line to its highest power, with the same innovation, technology and sound purity of the AP400Wx4.',
        },
        { t: 'h', h: 'Key features of the AP800Wx4' },
        {
          t: 'ul',
          items: [
            '<strong>800W distributed across 4 channels,</strong> delivering volume and sound quality for demanding projects.',
            '<strong>Dynamic Bass Boost</strong>, providing power and depth in the low frequencies even at low volumes.',
            '<strong>Advanced crossover with DSP</strong>, with precise frequency adjustments from 20Hz to 20kHz.',
            '<strong>Optional liquid cooling</strong>, for installation in challenging environments without losing performance.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El AP800Wx4 lleva la línea AP a su mayor potencia, con la misma innovación, tecnología y pureza sonora del AP400Wx4.',
        },
        { t: 'h', h: 'Características principales del AP800Wx4' },
        {
          t: 'ul',
          items: [
            '<strong>800W distribuidos en 4 canales,</strong> con volumen y calidad de sonido para proyectos exigentes.',
            '<strong>Bass Boost dinámico</strong>, que aporta potencia y profundidad a los graves incluso a bajo volumen.',
            '<strong>Crossover avanzado con DSP</strong>, con ajustes de frecuencia precisos de 20Hz a 20kHz.',
            '<strong>Refrigeración líquida opcional</strong>, para instalar en ambientes exigentes sin perder rendimiento.',
          ],
        },
      ],
    ),
  },
  {
    id: 'fonte-carregador-storm',
    group: 'power',
    // Foto do modelo de exportação (X-Line vermelha), sem fundo.
    images: ['/images/produtos/fonte-xline-export-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/10/jfa-product-manual-xline-power-pupply-and-charger-spanish-english.pdf',
    name: P('X-Line Power Supply and Charger', 'Fuente y Cargador X-Line'),
    category: P('Power supply and charger', 'Fuente y cargador'),
    summary: P(
      'More than a power supply: charges, powers and monitors automotive batteries.',
      'Más que una fuente: carga, alimenta y monitorea baterías automotrices.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The X-Line Power Supply and Charger is more than a power supply. Equipped with the highest technology, compact and with exclusive functions, it is the best choice to charge, power and monitor automotive batteries. It gathers the main features of the SCI and Redline lines and inaugurates a new concept of intelligent power supply.',
        },
        { t: 'h', h: 'X-Line differentials' },
        {
          t: 'ul',
          items: [
            '<strong>Super-X function</strong>, which raises the output voltage to 15V for a short time, giving maximum performance to the amplifier.',
            '<strong>Intelligent Charge System (ICS)</strong> and three-phase slow charge system.',
            '<strong>Exclusive battery diagnosis</strong> in just 10 seconds, with a CCA meter and real analysis of the charge capacity.',
            '<strong>Intelligent ventilation</strong> with dynamic PWM control.',
            '<strong>Compact, harmonic design</strong>, smaller than the previous lines and ideal for any project.',
          ],
        },
        { t: 'p', h: 'Available in <strong>40A, 60A, 70A, 120A and 200A</strong>.' },
      ],
      [
        {
          t: 'p',
          h: 'La Fuente y Cargador X-Line es más que una fuente. Con la más alta tecnología, compacta y con funciones exclusivas, es la mejor opción para cargar, alimentar y monitorear baterías automotrices. Reúne las principales características de las líneas SCI y Redline e inaugura un nuevo concepto de fuente inteligente.',
        },
        { t: 'h', h: 'Diferenciales de la X-Line' },
        {
          t: 'ul',
          items: [
            '<strong>Función Super-X</strong>, que eleva por un corto tiempo la tensión de salida a 15V para el máximo rendimiento del amplificador.',
            '<strong>Sistema de Carga Inteligente (ICS)</strong> y sistema de carga lenta trifásico.',
            '<strong>Diagnóstico exclusivo de la batería</strong> en solo 10 segundos, con medidor CCA y análisis real de la capacidad de carga.',
            '<strong>Ventilación inteligente</strong> con control PWM dinámico.',
            '<strong>Diseño compacto y armónico</strong>, más pequeño que las líneas anteriores e ideal para cualquier proyecto.',
          ],
        },
        { t: 'p', h: 'Disponible en <strong>40A, 60A, 70A, 120A y 200A</strong>.' },
      ],
    ),
  },
  {
    id: 'fonte-carregador-bob-storm',
    group: 'power',
    // Foto do modelo de exportação (Bob X-Line vermelha), sem fundo.
    images: ['/images/produtos/fonte-bob-xline-export-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/10/MANUAL-X-LINE-compactado.pdf',
    name: P('Bob X-Line', 'Bob X-Line'),
    category: P('Power supply', 'Fuente'),
    summary: P(
      'A dedicated power supply to simplify bob box projects, with no battery needed.',
      'Una fuente dedicada para simplificar proyectos de bob box, sin necesidad de batería.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'Bob X-Line is a power supply for projects that do not require a high number of functions, as is the case with bob boxes. Its main differential is that it eliminates the need for a battery, maintaining the same performance.',
        },
        {
          t: 'ul',
          items: [
            '<strong>Storm function</strong>, indicating that the power supply is operating at its highest potential, with an output voltage of 15V.',
            '<strong>Harmonic design</strong>, for a compact installation in the project.',
            '<strong>200A</strong> keeps up to 3,800 WRMS of sound playing.',
            '<strong>120A</strong> keeps up to 2,300 WRMS of sound playing.',
            '<strong>90A</strong> keeps up to 1,700 WRMS of sound playing.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'La Bob X-Line es una fuente para proyectos que no necesitan tantas funciones, como las bob boxes. Su principal diferencial es que elimina la necesidad de batería y mantiene el mismo rendimiento.',
        },
        {
          t: 'ul',
          items: [
            '<strong>Función Storm</strong>, que indica que la fuente trabaja a su máximo potencial, con tensión de salida de 15V.',
            '<strong>Diseño armónico</strong>, para una instalación compacta en el proyecto.',
            '<strong>200A</strong> mantiene hasta 3.800 WRMS de sonido.',
            '<strong>120A</strong> mantiene hasta 2.300 WRMS de sonido.',
            '<strong>90A</strong> mantiene hasta 1.700 WRMS de sonido.',
          ],
        },
      ],
    ),
  },
  {
    id: 'controle-acqua-1200',
    group: 'controls',
    images: ['/images/produtos/controle-acqua-1200-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/04/jfa-manual-remote-control-acqua-1200.pdf',
    name: P('Acqua 1200 Control', 'Control Acqua 1200'),
    category: P('Remote control', 'Control remoto'),
    summary: P(
      'Water-resistant (IP67) long-range car audio control: up to 1,200 meters in open areas.',
      'Control de audio automotriz resistente al agua (IP67) y de largo alcance: hasta 1.200 metros en área abierta.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The Acqua 1200 is a water-resistant (IP67) long-range car audio control, designed for a unique experience at events and in everyday life. It commands players from up to 1,200 meters in an open area, the longest range on the market.',
        },
        {
          t: 'ul',
          items: [
            '<strong>Two operating modes:</strong> memory mode, with pre-registered devices, and learn mode, which copies the player’s original infrared (IR) control.',
            'Highly resistant silicone keys, engraved in low relief.',
            'Ergonomic design.',
            'Slim central unit with ultra-sensitive receiver.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El Acqua 1200 es un control de audio automotriz resistente al agua (IP67) y de largo alcance, pensado para una experiencia única en eventos y en el día a día. Comanda reproductores a hasta 1.200 metros en área abierta, el mayor alcance del mercado.',
        },
        {
          t: 'ul',
          items: [
            '<strong>Dos modos de operación:</strong> modo memoria, con dispositivos pregrabados, y modo aprendizaje, que copia el control infrarrojo (IR) original del reproductor.',
            'Teclas de silicona de alta resistencia, grabadas en bajo relieve.',
            'Diseño ergonómico.',
            'Central slim con receptor ultrasensible.',
          ],
        },
      ],
    ),
  },
  {
    id: 'controle-k1200-universal',
    group: 'controls',
    images: ['/images/produtos/controle-k1200-universal-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/jfa-product-manual-control-k1200.pdf',
    name: P('K1200 Control', 'Control K1200'),
    category: P('Remote control', 'Control remoto'),
    summary: P(
      'The best open-area reach on the market: up to 1,200 meters.',
      'El mejor alcance en área abierta del mercado: hasta 1.200 metros.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The <strong>JFA K1200 Control</strong> has the <strong>best open-area reach on the market</strong>, which makes all the difference at car sound events.',
        },
        {
          t: 'ul',
          items: [
            'Reach of up to 1,200 meters in an open area.',
            'Highly resistant silicone keys, engraved in low relief.',
            'Design and ergonomics that make it easy to use.',
            '3 color combinations.',
            'Slim panel with ultra-sensitive receiver.',
            '<strong>Memory mode:</strong> settings of the main sound and video devices on the market already registered.',
            '<strong>Learn mode:</strong> copies and encodes the functions of the original IR control.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Control K1200 de JFA</strong> tiene el <strong>mejor alcance en área abierta del mercado</strong>, lo que marca la diferencia en los eventos de sonido automotriz.',
        },
        {
          t: 'ul',
          items: [
            'Alcance de hasta 1.200 metros en área abierta.',
            'Teclas de silicona de alta resistencia, grabadas en bajo relieve.',
            'Diseño y ergonomía que facilitan el uso.',
            '3 combinaciones de colores.',
            'Panel slim con receptor ultrasensible.',
            '<strong>Modo memoria:</strong> configuraciones de los principales equipos de sonido y video del mercado ya registradas.',
            '<strong>Modo aprendizaje:</strong> copia y codifica las funciones del control IR original.',
          ],
        },
      ],
    ),
  },
  {
    id: 'controle-k600',
    group: 'controls',
    images: ['/images/produtos/controle-k600-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/jfa-product-manual-control-k600.pdf',
    name: P('K600 Control', 'Control K600'),
    category: P('Remote control', 'Control remoto'),
    summary: P(
      'One of the best open-area reaches on the market: up to 600 meters.',
      'Uno de los mejores alcances en área abierta del mercado: hasta 600 metros.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The JFA <strong>K600 Control</strong> has one of the best open-area reaches on the market, which makes all the difference at car sound events, when several controls are used at the same time.',
        },
        {
          t: 'ul',
          items: [
            'Reach of up to 600 meters in an open area.',
            'Highly resistant silicone keys, engraved in low relief.',
            'Design and ergonomics that make it easy to use.',
            '5 color combinations.',
            'Memory with more than 220 audio and video devices already registered.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Control K600</strong> de JFA tiene uno de los mejores alcances en área abierta del mercado, lo que marca la diferencia en los eventos de sonido automotriz, cuando se usan varios controles al mismo tiempo.',
        },
        {
          t: 'ul',
          items: [
            'Alcance de hasta 600 metros en área abierta.',
            'Teclas de silicona de alta resistencia, grabadas en bajo relieve.',
            'Diseño y ergonomía que facilitan el uso.',
            '5 combinaciones de colores.',
            'Memoria con más de 220 equipos de audio y video ya registrados.',
          ],
        },
      ],
    ),
  },
  {
    id: 'controle-redline',
    group: 'controls',
    images: ['/images/produtos/controle-redline-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/jfa-product-manual-redline-control.pdf',
    name: P('Redline Control', 'Control Redline'),
    category: P('Remote control', 'Control remoto'),
    summary: P(
      'The only control that commands the player through the WR wired interface.',
      'El único control que comanda el reproductor por la interfaz cableada WR.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The <strong>JFA Redline Control</strong> is the only one on the market that <strong>controls the player through the WR interface</strong>, eliminating the need for an infrared sensor and ensuring perfect communication between receiver and player. It also has the <strong>greatest open-area reach on the market and high accuracy when pressing the keys</strong>.',
        },
        {
          t: 'ul',
          items: [
            'Reach of 1,200 meters in open areas.',
            'Quick commands at car sound events, thanks to the wired interface.',
            'Anatomical design with excellent ergonomics.',
            'Highly resistant silicone keys, engraved in low relief.',
            'Slim panel with ultra-sensitive receiver.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Control Redline de JFA</strong> es el único del mercado que <strong>comanda el reproductor por la interfaz WR</strong>, sin necesidad de sensor infrarrojo y con una comunicación perfecta entre receptor y reproductor. También tiene el <strong>mayor alcance en área abierta del mercado y alta precisión al pulsar las teclas</strong>.',
        },
        {
          t: 'ul',
          items: [
            'Alcance de 1.200 metros en áreas abiertas.',
            'Comandos rápidos en eventos de sonido automotriz, gracias a la interfaz cableada.',
            'Diseño anatómico con excelente ergonomía.',
            'Teclas de silicona de alta resistencia, grabadas en bajo relieve.',
            'Panel slim con receptor ultrasensible.',
          ],
        },
      ],
    ),
  },
  {
    id: 'conversor-rca-slim',
    group: 'accessories',
    images: ['/images/produtos/conversor-rca-slim-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/jfa-product-manual-slim-remore-rca-converter.pdf',
    name: P('RCA Remote Slim Converter', 'Convertidor RCA Remote Slim'),
    category: P('Converter', 'Convertidor'),
    summary: P(
      'Turns the speaker output of the original player into an RCA output, with remote output.',
      'Convierte la salida de parlantes del reproductor original en salida RCA, con salida remota.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The <strong>RCA Remote Slim Converter</strong> turns the speaker output of the sound system’s original player into an RCA output, adapting the audio level. It also has a remote control output, useful for factory players that do not have this feature.',
        },
        {
          t: 'ul',
          items: [
            'Converts the high (speaker) signal level to the RCA signal level.',
            'Remote output to turn on the amplifiers.',
            'Protection against overcurrent and short circuit to ground.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Convertidor RCA Remote Slim</strong> convierte la salida de parlantes del reproductor original del sistema de sonido en salida RCA, adaptando el nivel de audio. También tiene salida de control remoto, útil para reproductores de fábrica que no cuentan con esta función.',
        },
        {
          t: 'ul',
          items: [
            'Convierte el nivel de señal alto (parlante) en nivel de señal RCA.',
            'Salida remota para encender los amplificadores.',
            'Protección contra sobrecorriente y cortocircuito a tierra.',
          ],
        },
      ],
    ),
  },
  {
    id: 'filtro-rca-antirruido',
    group: 'accessories',
    images: ['/images/produtos/filtro-rca-antirruido-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/03/jfa-product-manual-filter-converter-rca-remote.pdf',
    name: P('Active Noise Control Filter', 'Filtro Activo Antirruido'),
    category: P('Filter', 'Filtro'),
    summary: P(
      'Eliminates ground-loop noise and protects the player’s internal tracks.',
      'Elimina el ruido del lazo de tierra y protege las pistas internas del reproductor.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The <strong>JFA Active Noise Control Filter</strong> isolates the ground wires of the player and the amplifier, eliminating the noise generated by the ground loop and preventing the burning of the player’s internal tracks.',
        },
        {
          t: 'ul',
          items: [
            '2 active noise control inputs.',
            '2 active noise control outputs.',
            'Electromagnetic filter.',
          ],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Filtro Activo Antirruido de JFA</strong> aísla los cables de tierra del reproductor y del amplificador, eliminando el ruido generado por el lazo de tierra y evitando que se quemen las pistas internas del reproductor.',
        },
        {
          t: 'ul',
          items: [
            '2 entradas con control activo de ruido.',
            '2 salidas con control activo de ruido.',
            'Filtro electromagnético.',
          ],
        },
      ],
    ),
  },
  {
    id: 'voltimetro-sequenciador-vs5hi',
    group: 'accessories',
    images: ['/images/produtos/voltimetro-sequenciador-vs5hi-1.webp'],
    manualUrl:
      'https://automotivo.jfaeletronicos.com/wp-content/uploads/sites/2/2022/08/jfa-product-manual-voltmeter-and-sequencer-vs5hi.pdf',
    name: P('VS5HI Voltmeter and Sequencer', 'Voltímetro y Secuenciador VS5HI'),
    category: P('Voltmeter and sequencer', 'Voltímetro y secuenciador'),
    summary: P(
      'Three functions in a single device: high and low voltage voltmeter and remote sequencer.',
      'Tres funciones en un solo equipo: voltímetro de alta y baja tensión y secuenciador remoto.',
    ),
    blocks: P(
      [
        {
          t: 'p',
          h: 'The <strong>VS5HI Voltmeter and Sequencer</strong> performs 3 major functions in a single device, with advanced technology and a bold design. It also protects against low voltage, turning off the remote output if the system drops below 9.5 volts.',
        },
        {
          t: 'ul',
          items: ['High voltage voltmeter.', 'Low voltage voltmeter.', 'Remote command sequencer.'],
        },
      ],
      [
        {
          t: 'p',
          h: 'El <strong>Voltímetro y Secuenciador VS5HI</strong> cumple 3 grandes funciones en un solo equipo, con tecnología avanzada y diseño audaz. Además, protege contra baja tensión y desactiva la salida remota si el sistema baja de 9,5 voltios.',
        },
        {
          t: 'ul',
          items: [
            'Voltímetro de alta tensión.',
            'Voltímetro de baja tensión.',
            'Secuenciador de comando remoto.',
          ],
        },
      ],
    ),
  },
];
