# Arquitetura

## Visão geral

A Home e as páginas internas ficam num único documento; o roteador por hash (`behaviors/router.js`) mostra/esconde as views `#homeView`, `#bateriasView`, `#bateriaView`, `#setorCatalogView`, `#setorInstView`, `#suporteView`, `#representantesView` e `#manuaisView`. A **marcação** é declarada em componentes React (`src/components`) e a **interatividade** fica em módulos de comportamento (`src/behaviors`), ligados uma única vez depois da montagem:

```jsx
// src/App.jsx
useEffect(() => initPageBehaviors(), []);
```

`initPageBehaviors()` (`src/behaviors/index.js`) cria um **contexto compartilhado**, inicializa cada módulo na ordem certa e devolve uma função de limpeza que remove todos os listeners, observers, timers e loops de `requestAnimationFrame`.

### Por que comportamentos imperativos em vez de estado React?

As animações (intro da Hero, carrosséis com inércia, faixa tipográfica, campo de energia em canvas, parallax) atualizam `transform` e variáveis CSS a cada frame. Fazer isso por `setState` causaria re-render a 60fps e poderia alterar o visual e o timing. Os módulos preservam exatamente a lógica original e usam refs de DOM, `requestAnimationFrame` e `IntersectionObserver`, que é o padrão recomendado para animações de alta frequência.

### Setores

O botão **Categorias** do header (`behaviors/header.js`) abre um menu em leque com Automotivo, Telecom, Motorhome, Solar e Náutica (`SECTOR_MENU` em `data/sectors.js`; JFA Parts e Moov entram no menu quando `data/visibility.js` liberar). Não há mais item de Baterias: `#/baterias` volta para a Home com o menu aberto, e o caminho (breadcrumb) da página de bateria aponta para a categoria dela. As categorias abrem `#setorCatalogView`, no mesmo layout de `#/baterias`: `behaviors/sectorPages.js` monta os cards a partir de `SECTOR_CATALOGS` (grupos = abas do filtro, ids de `data/products.js`; as baterias do setor vêm do catálogo de baterias). Cada produto com detalhes em `data/productDetails.js` tem página própria (`#produtoView`, `#/setores/:setor/:id`) com a mesma estrutura da página de bateria: Hero (galeria, headline, onde comprar), especificações rápidas (`data/productSpecs.js`), Tecnologia (a lista de diferenciais vira cards), Por que escolher (descrição e aplicações), ficha técnica (quando há tabela), suporte técnico (com as fotos do produto para download, `behaviors/photoDownloads.js`, também usado na página de bateria) e outros produtos da mesma linha. As fotos de todos os produtos, das bicicletas da Moov inclusive, são PNG/WebP sem fundo (fundo removido com rembg), como as das baterias. Os textos, fotos e tabelas técnicas vieram dos sites automotivo.jfaeletronicos.com e energia.jfaeletronicos.com (fotos em WebP em `public/images/produtos/`); variações sem id em `products.js` (Patch Panel GIGA/FAST/Gerenciável, Fonte Nobreak SNMP) trazem `name` e `category` no próprio `productDetails.js`. A Moov abre `#moovView`, uma landing page fixa (`components/pages/MoovPage.jsx`, estilos em `styles/moov.css`, fotos em `public/images/moov/`) cujos botões levam à categoria de bicicletas elétricas da loja oficial (`MOOV_STORE_URL` em `data/links.js`). A Parts abre `#partsView`, outra landing page fixa (`components/pages/PartsPage.jsx`, `behaviors/partsPage.js`, `styles/parts-page.css`): buscador de placas com sugestões e identificação animada, carrossel de placas, diferenciais, história e CTA final. As placas e os sócios ficam em `data/partsBoards.js` (compatibilidade só quando cadastrada; placa sem foto usa uma ilustração com o código; sócio só aparece com depoimento). O filtro animado, a entrada dos cards e o parallax ficam em `behaviors/catalogGrid.js`, compartilhado com a página de baterias.

### Idiomas

`src/i18n/index.js` define o idioma uma vez, antes da primeira renderização (`?lang=`, `localStorage` "jfa-lang" ou idioma do navegador), e expõe `t(chave)`, `tf(chave, vars)`, `pick({ en, es })` e `IS_EXPORT`. Trocar de idioma salva a escolha e recarrega a página, porque os comportamentos são montados uma vez só. Em português o site continua igual; em inglês e espanhol (`IS_EXPORT`) o `App` monta a visualização de exportação com os mesmos componentes da Home (`Hero`, `QuickAccess`, `Fronts`, `Products` e a parte de Manuais de `DarkExperience`), cada um com a sua variante de exportação: linhas e produtos de `data/exportProducts.js`, textos de `i18n/strings.js` e contato de `data/exportContact.js` (WhatsApp de vendas internacionais); header e rodapé próprios, e as páginas de catálogo/produto (`#/setores/automotivo[/:id]`) alimentadas por `data/exportProducts.js` em `behaviors/sectorPages.js`. A busca, as lojas brasileiras (Shopee/Mercado Livre) e os mapas não aparecem na exportação.

### Páginas de Suporte, Representantes e Manuais

`#/representantes` e `#/manuais` usam a **mesma** seção da Home: ao abrir a página, o roteador move `#repsSection` ou `#manualsSection` para o `[data-page-slot]` da view (`components/pages/SectionPages.jsx`) e devolve para o lugar original ao voltar para a Home. Assim não há código nem ids duplicados, e busca, abas, mapa e animações continuam iguais.

`#/suporte` tem uma seção própria com o mesmo componente de mapa (`components/shared/StateMapSection.jsx`, prefixo de ids `sup`). A interatividade dos dois mapas vem de `behaviors/stateMap.js`; os dados ficam em `data/representatives.js` e `data/support.js`, gerados das planilhas `representante_JFA.csv` e `assistencias_JFA.csv`. No Suporte, o painel lista as assistências do estado com filtro por cidade, a busca aceita estado ou cidade, e estado sem assistência cai no suporte central da JFA.

O `<StrictMode>` fica desligado de propósito, porque os comportamentos devem ser montados uma única vez.

### Filme da JFA Parts

`parts-filme.html` é uma segunda entrada do Vite (`vite.config.js`), independente do `App`: não monta React, header, rodapé nem os comportamentos do site. O módulo fica em `src/motion/parts-film/`:

| Arquivo                                  | Papel                                                                                                                                                                                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `main.js`                                | Página: registro de variantes (`VARIANTS`: como carregar e qual GLB usar), baixa o modelo em paralelo com o three.js, proporção do quadro, controles, qualidade adaptativa, "reduzir movimento", fallback sem WebGL, régua `?debug` e `?range=a-b`                                               |
| `film.js`                                | Relógio genérico: play/pausa/seek, laço, eventos `time`/`cue` (as variantes só desenham cada instante)                                                                                                                                                                                           |
| `stage.js`                               | three.js: carrega o GLB real (as malhas só são agrupadas por material, sem mudar geometria nem materiais), estúdio procedural para os reflexos (PMREM), spot com sombra, contraluz, preenchimento e um shader de composição (profundidade de campo, bloom discreto, fundo radial, vinheta, fade) |
| `tracks.js`                              | Curvas cubic-bezier, trilhas por marcação e spline de Hermite com nós no tempo (velocidade contínua, sem "freadas" nas marcações)                                                                                                                                                                |
| `premium.js`                             | Variante padrão (filme de produto "Tudo começa por dentro."): estado de cada instante e textos em DOM                                                                                                                                                                                            |
| `timeline.js`                            | A "partitura" do filme premium: duração, atos, textos, marcações de som, câmera, luzes, reflexos, fundo, desfoque e rotação da placa                                                                                                                                                             |
| `social/kinetic.js`                      | Motor de tipografia cinética (9:16): `createKineticVariant(roteiro)`; planos de texto em 3D em volta da placa, câmera virtual única, palavras, gráficos, fundo, transições e distorções                                                                                                          |
| `social/scores/*.js`                     | Roteiros, um por motion (`em-tudo.js` = `?variant=social-kinetic`; `modelo.js` = ponto de partida de motions novos)                                                                                                                                                                              |
| `social/kit.js`                          | O que os roteiros usam: `word`, `fontCycle`, `stack`, `pose`, pontos da placa e marcações de som                                                                                                                                                                                                 |
| `social/config.js`                       | Controles do motor (intensidades, tipografia, câmera, cores), também pela URL e pelo `?debug`                                                                                                                                                                                                    |
| `social/slices.js`                       | Letra esticada "à moda da Stretch Pro" (fatias, sem escalar a letra inteira)                                                                                                                                                                                                                     |
| `social/eyes.js`, `trace.js`             | Gráficos em SVG (olhos, trilha de circuito)                                                                                                                                                                                                                                                      |
| `social/distortion.js`, `transitions.js` | Distorções (8 presets) e transições (13 tipos)                                                                                                                                                                                                                                                   |

Motions novos no mesmo modelo seguem a skill `.claude/skills/motion/` (regras de estilo, fluxo de trabalho e referência do roteiro) e são conferidos com `tools/motion/frames.mjs` (quadros e segunda rodagem) e `tools/motion/glyph-cuts.mjs` (onde cortar uma letra para esticar).

O loop de `requestAnimationFrame` só roda enquanto o filme toca e para no último quadro. Como cada quadro depende só do tempo, pausar, voltar ou gravar quadro a quadro dá sempre a mesma imagem.

## Contexto compartilhado (`behaviors/context.js`)

| Campo                    | Uso                                                                          |
| ------------------------ | ---------------------------------------------------------------------------- |
| `root`, `on`, `cleanups` | Consultas de DOM e registro de listeners com remoção automática              |
| `reduceMotion`           | Estado atual de `prefers-reduced-motion`, atualizado ao vivo                 |
| `reduceMotionListeners`  | Callbacks disparados quando a preferência muda (ex.: pausar o vídeo da Hero) |
| `fineMQ`                 | Media query de ponteiro fino (mouse)                                         |
| `syncHeaderSpacer`       | Exposto pelo header e usado pela Hero                                        |
| `setProductsCategory`    | Exposto pelo carrossel e usado pelos links "Conheça a linha"                 |
| `refreshManualsField`    | Exposto pelo campo de energia e usado por Manuais                            |

## Mapa componente ↔ comportamento ↔ estilo

| Componente                                  | Comportamento                                           | CSS                                                                      |
| ------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `Header`                                    | `header.js`, `globalSearch.js`                          | `header.css`, `responsive-overrides.css`                                 |
| `Hero`                                      | `hero.js`                                               | `hero.css`, `base.css`                                                   |
| `QuickAccess`                               | `quickAccess.js`                                        | `quick-access.css`                                                       |
| `Fronts`                                    | `fronts.js`                                             | `fronts.css`                                                             |
| `Products`                                  | `productsCarousel.js`                                   | `products.css`, `section-backgrounds.css`                                |
| `TechMarquee`                               | `techMarquee.js`                                        | `tech-marquee.css`                                                       |
| `BuySection`                                | `buySection.js`                                         | `buy.css`                                                                |
| `PartsPromo`                                | —                                                       | `parts-promo.css`                                                        |
| `DarkExperience` (Manuais + Representantes) | `manuals.js`, `representatives.js`, `darkExperience.js` | `manuals.css`, `manuals-panel.css`, `representatives.css`, `ambient.css` |
| `CampaignCarousel`                          | `campaignCarousel.js`                                   | `campaign.css`                                                           |
| `pages/*`                                   | `router.js`                                             | `pages.css`, `battery-detail.css`                                        |
| `Footer`                                    | `footer.js`                                             | `footer.css`                                                             |
| (canvases de várias seções)                 | `energyField.js`                                        | `ambient.css`                                                            |

## CSS

O CSS original foi dividido em arquivos por seção **sem reordenar regras**. `styles/index.css` importa os arquivos na mesma sequência do original, então a cascata e as especificidades continuam iguais. A fonte Stretch Pro, que estava embutida em base64, virou o arquivo `public/fonts/StretchPro.woff`.

## Fidelidade visual

A migração foi validada com screenshots de página inteira (Playwright/Chromium) do original e da versão React, nas larguras 390, 768, 900, 1200, 1440 e 1600px. As alturas das páginas são iguais e as únicas diferenças restantes são variações sub-pixel no desenho das imagens.

O carregamento das imagens dos banners pelo `fetch` + base64 (`resolveCampaignImageSrc`) servia só para o sandbox do editor de design antigo e foi removido; em produção as imagens são carregadas direto de `public/images/`.

## Modo claro

O CSS continua escrito para o modo escuro. No build (e no `npm run dev`), o plugin PostCSS `tools/postcss-light-theme.js` cria, para cada regra com cor, uma cópia com o prefixo `html[data-theme="light"]`: fundos escuros viram claros, textos claros viram azul-marinho e tons médios (azul JFA, verde do WhatsApp) ficam iguais; sombras só ficam mais leves. Com isso, qualquer CSS novo ganha a versão clara sozinho.

- Elementos com o atributo `data-theme-keep` (vídeo da Hero, seção Frentes, card da JFA Parts) e seus filhos mantêm as cores originais.
- Ajustes que o automático não resolve ficam em `src/styles/theme-light.css` (último import de `styles/index.css`).
- O tema é aplicado por um script inline no `index.html` antes da primeira pintura; o botão `#themeToggle` (em `behaviors/header.js`) alterna e salva a escolha em `localStorage` (`jfa-theme`).
- Ao mudar `postcss.config.js` ou o plugin, reinicie o `npm run dev`.
