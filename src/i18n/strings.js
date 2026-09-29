/**
 * Textos do site por idioma. `pt` é o site completo (Brasil); `en` e `es` são
 * a visualização de exportação. Textos que só existem no site em português
 * continuam direto nos componentes.
 */
export const STRINGS = {
  'meta.description': {
    pt: '',
    en: 'JFA Eletrônicos: car audio amplifiers, power supplies, chargers and remote controls made in Brazil, available for export.',
    es: 'JFA Eletrônicos: amplificadores, fuentes, cargadores y controles remotos de audio automotriz fabricados en Brasil, disponibles para exportación.',
  },
  // Header
  'nav.home': { pt: 'JFA -- voltar ao início', en: 'JFA -- back to top', es: 'JFA -- volver al inicio' },
  'nav.main': { pt: 'Navegação principal', en: 'Main navigation', es: 'Navegación principal' },
  'nav.right': { pt: 'Suporte e compra', en: 'Manuals and contact', es: 'Manuales y contacto' },
  'nav.categories': { pt: 'Categorias', en: 'Products', es: 'Productos' },
  'nav.manuals': { pt: 'Manuais', en: 'Manuals', es: 'Manuales' },
  'nav.contact': { pt: 'Contato', en: 'International sales', es: 'Ventas internacionales' },
  'nav.language': { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  'theme.toggle': {
    pt: 'Alternar modo claro e escuro',
    en: 'Switch between light and dark mode',
    es: 'Cambiar entre modo claro y oscuro',
  },
  'theme.toDark': { pt: 'Mudar para o modo escuro', en: 'Switch to dark mode', es: 'Cambiar al modo oscuro' },
  'theme.toLight': { pt: 'Mudar para o modo claro', en: 'Switch to light mode', es: 'Cambiar al modo claro' },

  // Hero (cada linha é uma lista de palavras; *palavra* fica em destaque)
  'hero.lines': {
    pt: [
      ['*Energia*', 'é', 'o'],
      ['que', 'nos', 'move'],
      ['desde', 'o', 'começo.'],
    ],
    en: [
      ['*Energy*', 'is', 'what'],
      ['has', 'moved', 'us'],
      ['from', 'the', 'start.'],
    ],
    es: [
      ['*Energía*', 'es', 'lo'],
      ['que', 'nos', 'mueve'],
      ['desde', 'el', 'comienzo.'],
    ],
  },
  'hero.sub': {
    pt: 'Há <strong>mais de duas décadas</strong>, desenvolvemos soluções para energia, movimento e eletrônica, com tecnologia, suporte e certificações aplicáveis a diferentes categorias.',
    en: 'For <strong>more than two decades</strong>, we have been developing car audio and power solutions in Brazil, with our own technology and support for distributors around the world.',
    es: 'Hace <strong>más de dos décadas</strong> desarrollamos soluciones de audio automotriz y energía en Brasil, con tecnología propia y soporte para distribuidores de todo el mundo.',
  },
  'hero.ctaProducts': { pt: 'Explorar produtos', en: 'Explore products', es: 'Ver productos' },
  'hero.ctaManual': { pt: 'Encontrar um manual', en: 'Find a manual', es: 'Buscar un manual' },
  'hero.ctaBuy': { pt: 'Onde comprar', en: 'International sales', es: 'Ventas internacionales' },

  // Acesso rápido
  'qa.title': { pt: 'O que você procura?', en: 'What are you looking for?', es: '¿Qué está buscando?' },
  'qa.products': { pt: 'Produtos', en: 'Products', es: 'Productos' },
  'qa.productsSub': {
    pt: 'Encontre por linha ou aplicação',
    en: 'Browse our export lines',
    es: 'Vea nuestras líneas de exportación',
  },
  'qa.manuals': { pt: 'Manuais', en: 'Manuals', es: 'Manuales' },
  'qa.manualsSub': {
    pt: 'Busque por nome, modelo ou código',
    en: 'Search by name or model',
    es: 'Busque por nombre o modelo',
  },
  'qa.talk': { pt: 'Falar com a JFA', en: 'Talk to JFA', es: 'Hablar con JFA' },
  'qa.talkSub': {
    pt: 'Atendimento pelo WhatsApp',
    en: 'International sales on WhatsApp',
    es: 'Ventas internacionales por WhatsApp',
  },

  // Frentes (exportação)
  'fronts.eyebrow': {
    pt: '{n} frentes. {n} caminhos. Uma só JFA.',
    en: '{n} lines. {n} paths. One JFA.',
    es: '{n} líneas. {n} caminos. Una sola JFA.',
  },
  'fronts.title': { pt: 'Conheça as áreas da', en: 'Discover the areas of', es: 'Conozca las áreas de' },
  'fronts.sub': {
    pt: 'Cada frente segue seu próprio caminho.',
    en: 'Each line brings JFA technology and know-how to a different part of your car audio project.',
    es: 'Cada línea lleva la tecnología JFA a una parte distinta de su proyecto de audio automotriz.',
  },
  'fronts.cta': { pt: 'Conheça a linha', en: 'See the line', es: 'Ver la línea' },
  'fronts.prev': { pt: 'Frente anterior', en: 'Previous line', es: 'Línea anterior' },
  'fronts.next': { pt: 'Próxima frente', en: 'Next line', es: 'Línea siguiente' },
  'fronts.nav': { pt: 'Navegação entre frentes JFA', en: 'JFA lines', es: 'Líneas JFA' },

  // Descubra as soluções (exportação)
  // Título: [antes] JFA [depois]
  'products.titleA': { pt: 'Descubra as soluções', en: 'Discover', es: 'Descubra las soluciones' },
  'products.titleB': { pt: '', en: ' solutions', es: '' },
  'products.sub': {
    pt: '',
    en: 'Amplifiers, power supplies, remote controls and accessories developed by JFA for car audio projects around the world.',
    es: 'Amplificadores, fuentes, controles remotos y accesorios desarrollados por JFA para proyectos de audio automotriz en todo el mundo.',
  },
  'products.endcap': {
    pt: 'Encontrou o que procura?',
    en: 'Found what you need?',
    es: '¿Encontró lo que busca?',
  },
  'products.endcapLink': {
    pt: 'Veja onde comprar',
    en: 'Talk to our export team',
    es: 'Hable con exportación',
  },

  // Manuais
  'manuals.eyebrow': { pt: 'Manuais', en: 'Manuals', es: 'Manuales' },
  'manuals.title': {
    pt: 'Encontre o manual que precisa.',
    en: 'Find the manual you need.',
    es: 'Encuentre el manual que necesita.',
  },
  'manuals.sub': {
    pt: 'Escolha uma área e vá direto ao produto, ou pesquise pelo nome, modelo ou linha a qualquer momento.',
    en: 'Choose a line and go straight to the product, or search by name or model at any time.',
    es: 'Elija una línea y vaya directo al producto, o busque por nombre o modelo en cualquier momento.',
  },
  'manuals.searchLabel': {
    pt: 'Buscar manual por produto, modelo ou linha',
    en: 'Search manuals by product or model',
    es: 'Buscar manuales por producto o modelo',
  },
  'manuals.placeholder': {
    pt: 'Qual produto você procura?',
    en: 'Which product are you looking for?',
    es: '¿Qué producto busca?',
  },
  'manuals.hint': {
    pt: 'Pesquise por nome, modelo ou linha: a busca funciona independente da linha selecionada abaixo.',
    en: 'Search by name or model: the search works regardless of the line selected below.',
    es: 'Busque por nombre o modelo: la búsqueda funciona sin importar la línea seleccionada abajo.',
  },
  'manuals.tabsAria': {
    pt: 'Navegar manuais por linha',
    en: 'Browse manuals by line',
    es: 'Ver manuales por línea',
  },
  'manuals.categoryAria': {
    pt: 'Filtrar por categoria',
    en: 'Filter by category',
    es: 'Filtrar por categoría',
  },
  'manuals.prompt': {
    pt: 'Escolha uma área acima para ver os manuais disponíveis.',
    en: 'Choose a line above to see the available manuals.',
    es: 'Elija una línea arriba para ver los manuales disponibles.',
  },
  'manuals.pickCategory': {
    pt: 'Escolha uma categoria acima para ver os manuais disponíveis.',
    en: 'Choose a category above to see the available manuals.',
    es: 'Elija una categoría arriba para ver los manuales disponibles.',
  },
  'manuals.results': { pt: 'Resultados', en: 'Results', es: 'Resultados' },
  'manuals.resultsAria': { pt: 'Resultados de manuais', en: 'Manual results', es: 'Resultados de manuales' },
  'manuals.empty1': {
    pt: 'Nenhum manual encontrado.',
    en: 'No manual found.',
    es: 'No se encontró ningún manual.',
  },
  'manuals.empty2': {
    pt: 'Tente pesquisar por outro nome ou modelo.',
    en: 'Try searching for another name or model.',
    es: 'Intente buscar otro nombre o modelo.',
  },
  'manuals.showMore': {
    pt: 'Mostrar todos os resultados →',
    en: 'Show all results →',
    es: 'Mostrar todos los resultados →',
  },
  'manuals.download': { pt: 'Baixar manual', en: 'Download manual', es: 'Descargar manual' },
  'manuals.downloadAria': { pt: 'Baixar manual', en: 'Download manual', es: 'Descargar manual' },
  'manuals.started': {
    pt: 'Download de {name} iniciado.',
    en: '{name} download started.',
    es: 'Descarga de {name} iniciada.',
  },
  'manuals.startedShort': { pt: 'Download iniciado', en: 'Download started', es: 'Descarga iniciada' },
  'manuals.discontinued': { pt: 'Fora de linha', en: 'Discontinued', es: 'Descontinuado' },
  'manuals.allCategories': { pt: 'Todas', en: 'All', es: 'Todas' },
  'manuals.soon': {
    pt: 'Novos manuais serão disponibilizados em breve.',
    en: 'New manuals will be available soon.',
    es: 'Pronto habrá nuevos manuales disponibles.',
  },

  // Home de exportação
  'export.catalogTitle': {
    pt: 'Tecnologia para o seu projeto automotivo.',
    en: 'Technology for your car audio project.',
    es: 'Tecnología para su proyecto de audio automotriz.',
  },
  'export.whatsappText': {
    pt: 'Olá! Vim pelo site da JFA e quero falar sobre vendas internacionais.',
    en: 'Hello! I found JFA on the website and would like to talk about international sales.',
    es: '¡Hola! Encontré JFA en el sitio web y quiero hablar sobre ventas internacionales.',
  },

  // Catálogo e página de produto
  'catalog.all': { pt: 'Todos', en: 'All', es: 'Todos' },
  'catalog.filter': {
    pt: 'Filtrar produtos por linha',
    en: 'Filter products by line',
    es: 'Filtrar productos por línea',
  },
  'catalog.more': { pt: 'Conhecer produto', en: 'See product', es: 'Ver producto' },
  'catalog.manual': { pt: 'Ver manual', en: 'See manual', es: 'Ver manual' },
  'product.breadcrumb': { pt: 'Você está aqui', en: 'You are here', es: 'Usted está aquí' },
  'product.eyebrow': { pt: 'Produtos JFA', en: 'JFA products', es: 'Productos JFA' },
  'product.photos': { pt: 'Fotos do produto', en: 'Product photos', es: 'Fotos del producto' },
  'product.photoOf': {
    pt: 'Ver foto {n} de {name}',
    en: 'See photo {n} of {name}',
    es: 'Ver foto {n} de {name}',
  },
  'product.fallback': {
    pt: 'Consulte disponibilidade.',
    en: 'Check availability.',
    es: 'Consulte disponibilidad.',
  },
  'product.whereToBuy': {
    pt: 'Encontrar onde comprar',
    en: 'Talk to our export team',
    es: 'Hablar con exportación',
  },
  'product.microcopy': {
    pt: 'Compra pelos canais oficiais JFA.',
    en: 'Sales through official JFA channels.',
    es: 'Venta por los canales oficiales de JFA.',
  },
  'product.techLabel': { pt: 'Tecnologia', en: 'Technology', es: 'Tecnología' },
  'product.techTitle': {
    pt: 'Recursos que fazem a diferença.',
    en: 'Features that make a difference.',
    es: 'Recursos que marcan la diferencia.',
  },
  'product.techSub': {
    pt: 'Os principais diferenciais deste produto JFA.',
    en: 'The main differentials of this JFA product.',
    es: 'Los principales diferenciales de este producto JFA.',
  },
  'product.whyLabel': { pt: 'Por que escolher', en: 'Why choose it', es: 'Por qué elegirlo' },
  'product.whyTitle': {
    pt: 'A escolha certa para o seu projeto.',
    en: 'The right choice for your project.',
    es: 'La elección correcta para su proyecto.',
  },
  'product.specsLabel': {
    pt: 'Características técnicas',
    en: 'Technical features',
    es: 'Características técnicas',
  },
  'product.specsTitle': { pt: 'Ficha técnica.', en: 'Specifications.', es: 'Ficha técnica.' },
  'product.supportLabel': { pt: 'Suporte técnico', en: 'Technical support', es: 'Soporte técnico' },
  'product.supportTitle': {
    pt: 'Informação para instalar e utilizar com confiança.',
    en: 'Information to install and use with confidence.',
    es: 'Información para instalar y usar con confianza.',
  },
  'product.supportSub': {
    pt: 'Encontre os documentos técnicos disponíveis para este produto.',
    en: 'Find the technical documents available for this product.',
    es: 'Encuentre los documentos técnicos disponibles para este producto.',
  },
  'product.help': {
    pt: 'Precisa de ajuda para escolher seu produto?',
    en: 'Need help choosing your product?',
    es: '¿Necesita ayuda para elegir su producto?',
  },
  'product.talk': { pt: 'Falar com a JFA', en: 'Talk to JFA', es: 'Hablar con JFA' },
  'product.others': { pt: 'Outros produtos', en: 'Other products', es: 'Otros productos' },
  'product.moreIn': { pt: 'Mais em {group}', en: 'More in {group}', es: 'Más en {group}' },
  'product.seeAll': { pt: 'Ver todos', en: 'See all', es: 'Ver todos' },
  'product.manual': { pt: 'Manual técnico', en: 'Technical manual', es: 'Manual técnico' },
  'product.manualText': {
    pt: 'Informações de instalação, operação e cuidados.',
    en: 'Installation, operation and care information.',
    es: 'Información de instalación, operación y cuidados.',
  },
  'product.docText': {
    pt: 'Documento técnico em PDF.',
    en: 'Technical document (PDF).',
    es: 'Documento técnico (PDF).',
  },
  'product.downloadManual': { pt: 'Baixar manual', en: 'Download manual', es: 'Descargar manual' },
  'product.downloadDoc': { pt: 'Baixar', en: 'Download', es: 'Descargar' },
  'product.manualsHub': { pt: 'Central de manuais', en: 'All manuals', es: 'Todos los manuales' },
  'product.manualsHubText': {
    pt: 'Manuais organizados por categoria na seção de Manuais do site.',
    en: 'Manuals for every export product in one place.',
    es: 'Los manuales de todos los productos de exportación en un solo lugar.',
  },
  'product.seeManuals': { pt: 'Ver manuais', en: 'See manuals', es: 'Ver manuales' },
  'product.whatsappText': {
    pt: 'Olá, quero saber mais sobre o {name}!',
    en: 'Hello, I would like to know more about the {name}!',
    es: '¡Hola! Quiero saber más sobre el {name}.',
  },

  // Como usar (vídeo vertical)
  'howto.label': { pt: 'Como usar', en: 'How to use', es: 'Cómo usar' },
  'howto.title': {
    pt: 'Aprenda a usar o seu produto.',
    en: 'Learn how to use your product.',
    es: 'Aprenda a usar su producto.',
  },
  'howto.text': {
    pt: 'Veja no vídeo, passo a passo, como instalar e usar o {name} com segurança.',
    en: 'Watch the video to see, step by step, how to install and use the {name} safely.',
    es: 'Vea en el video, paso a paso, cómo instalar y usar el {name} con seguridad.',
  },
  'howto.step1': {
    pt: 'Confira o conteúdo da embalagem.',
    en: 'Check the contents of the package.',
    es: 'Verifique el contenido del embalaje.',
  },
  'howto.step2': {
    pt: 'Siga a instalação mostrada no vídeo.',
    en: 'Follow the installation shown in the video.',
    es: 'Siga la instalación que muestra el video.',
  },
  'howto.step3': {
    pt: 'Em caso de dúvida, consulte o manual ou fale com a JFA.',
    en: 'If in doubt, check the manual or talk to JFA.',
    es: 'Si tiene dudas, consulte el manual o hable con JFA.',
  },
  'howto.download': { pt: 'Baixar vídeo', en: 'Download video', es: 'Descargar video' },
  'howto.soon': { pt: 'Vídeo em breve', en: 'Video coming soon', es: 'Video próximamente' },
  'howto.soonButton': {
    pt: 'Download do vídeo (em breve)',
    en: 'Video download (coming soon)',
    es: 'Descarga del video (próximamente)',
  },
  'howto.videoOf': {
    pt: 'Vídeo: como usar o {name}',
    en: 'Video: how to use the {name}',
    es: 'Video: cómo usar el {name}',
  },

  // Fotos para download
  'photos.title': { pt: 'Fotos do produto', en: 'Product photos', es: 'Fotos del producto' },
  'photos.text': {
    pt: 'Imagens em alta qualidade, sem fundo, para baixar e divulgar.',
    en: 'High-quality images with no background, to download and share.',
    es: 'Imágenes de alta calidad, sin fondo, para descargar y compartir.',
  },
  'photos.all': { pt: 'Baixar todas', en: 'Download all', es: 'Descargar todas' },
  'photos.one': { pt: 'Baixar', en: 'Download', es: 'Descargar' },
  'photos.aria': {
    pt: 'Baixar foto {n} de {name}',
    en: 'Download photo {n} of {name}',
    es: 'Descargar foto {n} de {name}',
  },

  // Rodapé
  'footer.tagline': {
    pt: 'Tecnologia feita por nós.',
    en: 'Technology made by us.',
    es: 'Tecnología hecha por nosotros.',
  },
  'footer.links': { pt: 'Links do rodapé', en: 'Footer links', es: 'Enlaces del pie de página' },
  'footer.products': { pt: 'Produtos', en: 'Products', es: 'Productos' },
  'footer.jfa': { pt: 'JFA', en: 'JFA', es: 'JFA' },
  'footer.about': { pt: 'Sobre nós', en: 'About us', es: 'Sobre nosotros' },
  'footer.support': { pt: 'Suporte', en: 'Support', es: 'Soporte' },
  'footer.social': { pt: 'Redes sociais da JFA', en: 'JFA on social media', es: 'JFA en redes sociales' },
  'footer.instagram': { pt: 'Instagram da JFA', en: 'JFA on Instagram', es: 'JFA en Instagram' },
  'footer.youtube': { pt: 'Canal da JFA no YouTube', en: 'JFA on YouTube', es: 'JFA en YouTube' },
  'footer.follow': { pt: 'Siga as nossas redes', en: 'Follow us', es: 'Síganos' },
  'footer.instagramLabel': { pt: 'JFA Instagram', en: 'JFA Instagram', es: 'JFA Instagram' },
  'footer.youtubeLabel': { pt: 'JFA YouTube', en: 'JFA YouTube', es: 'JFA YouTube' },
  'footer.toTop': { pt: 'Voltar ao topo', en: 'Back to top', es: 'Volver arriba' },
  'footer.automotive': { pt: 'Automotivo', en: 'Car audio and power', es: 'Audio automotriz y energía' },

  // WhatsApp flutuante
  'whats.aria': {
    pt: 'Falar com a JFA pelo WhatsApp',
    en: 'Talk to JFA on WhatsApp',
    es: 'Hablar con JFA por WhatsApp',
  },
  'whats.label': { pt: 'Fale conosco', en: 'Contact us', es: 'Contáctenos' },
};
