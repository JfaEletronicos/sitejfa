# Arquitetura

## Visão geral

O site é uma página única. A **marcação** é declarada em componentes React (`src/components`) e a **interatividade** fica em módulos de comportamento (`src/behaviors`), ligados uma única vez depois da montagem:

```jsx
// src/App.jsx
useEffect(() => initPageBehaviors(), []);
```

`initPageBehaviors()` (`src/behaviors/index.js`) cria um **contexto compartilhado**, inicializa cada módulo na ordem certa e devolve uma função de limpeza que remove todos os listeners, observers, timers e loops de `requestAnimationFrame`.

### Por que comportamentos imperativos em vez de estado React?

As animações (intro da Hero, carrosséis com inércia, faixa tipográfica, campo de energia em canvas, parallax) atualizam `transform` e variáveis CSS a cada frame. Fazer isso por `setState` causaria re-render a 60fps e poderia alterar o visual e o timing. Os módulos preservam exatamente a lógica original e usam refs de DOM, `requestAnimationFrame` e `IntersectionObserver`, que é o padrão recomendado para animações de alta frequência.

O `<StrictMode>` fica desligado de propósito, porque os comportamentos devem ser montados uma única vez.

## Contexto compartilhado (`behaviors/context.js`)

| Campo | Uso |
| --- | --- |
| `root`, `on`, `cleanups` | Consultas de DOM e registro de listeners com remoção automática |
| `reduceMotion` | Estado atual de `prefers-reduced-motion`, atualizado ao vivo |
| `reduceMotionListeners` | Callbacks disparados quando a preferência muda (ex.: pausar o vídeo da Hero) |
| `fineMQ` | Media query de ponteiro fino (mouse) |
| `syncHeaderSpacer` | Exposto pelo header e usado pela Hero |
| `setProductsCategory` | Exposto pelo carrossel e usado pelos links "Conheça a linha" |
| `refreshManualsField` | Exposto pelo campo de energia e usado por Manuais |

## Mapa componente ↔ comportamento ↔ estilo

| Componente | Comportamento | CSS |
| --- | --- | --- |
| `Header` | `header.js`, `globalSearch.js` | `header.css`, `responsive-overrides.css` |
| `Hero` | `hero.js` | `hero.css`, `base.css` |
| `QuickAccess` | `quickAccess.js` | `quick-access.css` |
| `Fronts` | `fronts.js` | `fronts.css` |
| `Products` | `productsCarousel.js` | `products.css`, `section-backgrounds.css` |
| `TechMarquee` | `techMarquee.js` | `tech-marquee.css` |
| `BuySection` | `buySection.js` | `buy.css` |
| `PartsPromo` | `partsPromo.js` | `parts-promo.css` |
| `DarkExperience` (Manuais + Representantes) | `manuals.js`, `representatives.js`, `darkExperience.js` | `manuals.css`, `manuals-panel.css`, `representatives.css`, `ambient.css` |
| `Offer` | `offer.js` | `offer.css` |
| `Footer` | `footer.js` | `footer.css` |
| (canvases de várias seções) | `energyField.js` | `ambient.css` |

## CSS

O CSS original foi dividido em arquivos por seção **sem reordenar regras**. `styles/index.css` importa os arquivos na mesma sequência do original, então a cascata e as especificidades continuam iguais. A fonte Stretch Pro, que estava embutida em base64, virou o arquivo `public/fonts/StretchPro.woff`.

## Fidelidade visual

A migração foi validada com screenshots de página inteira (Playwright/Chromium) do original e da versão React, nas larguras 390, 768, 900, 1200, 1440 e 1600px. As alturas das páginas são iguais e as únicas diferenças de pixel são o relógio da contagem regressiva e variações sub-pixel na decodificação de imagens.
