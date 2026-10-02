# JFA Eletrônicos — Site institucional

Site institucional da **JFA Eletrônicos**, migrado de uma página HTML única (≈9.400 linhas de HTML, CSS e JS inline) para **React 18 + Vite**, mantendo o visual e o comportamento **idênticos** ao original.

## Stack

| Camada           | Tecnologia                                                 |
| ---------------- | ---------------------------------------------------------- |
| UI               | React 18 (componentes funcionais)                          |
| Build/dev server | Vite 5                                                     |
| Estilos          | CSS puro, dividido por seção (ordem da cascata preservada) |
| Qualidade        | ESLint 9 + Prettier 3                                      |
| Hospedagem       | Vercel                                                     |

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # serve o build localmente
npm run lint      # ESLint
```

Requer Node.js 18 ou superior.

## Estrutura

```
index.html                 # HTML base (fontes, meta tags, #root)
public/
  images/                  # fotos de produtos, frentes, selos e logo (.webp)
  media/hero-bateria.mp4   # vídeo de fundo da Hero (loop, sem áudio)
  fonts/StretchPro.woff    # fonte display dos títulos
  favicon.ico
src/
  main.jsx                 # ponto de entrada
  App.jsx                  # monta as seções e liga os comportamentos
  components/
    layout/                # Header e Footer (comuns a todas as páginas)
    home/                  # seções da Home
    pages/                 # páginas internas (Baterias, detalhe, Setores, detalhe)
  behaviors/               # interatividade de cada seção (um módulo por seção)
  data/                    # catálogo de produtos/manuais, campanhas e setores
  lib/                     # busca (search.js) e analytics (analytics.js)
  styles/                  # CSS por seção + index.css (ordem de import)
docs/ARQUITETURA.md        # detalhes de arquitetura e funcionalidades
```

## Seções e funcionalidades

- **Header fixo**: efeito de vidro ao rolar, navegação suave entre seções e **busca global** (produtos, manuais, categorias, JFA Parts, Energia, suporte).
- **Hero**: vídeo de fundo em loop, headline animada palavra a palavra (intro de 2s) e CTAs.
- **Acesso rápido**: atalhos para Produtos, Manuais, Representantes e WhatsApp.
- **Frentes JFA** (Moov, Energia, Parts, Automotivo): carrossel com arraste, setas, navegação numerada e uma demonstração automática.
- **Soluções/Produtos**: selos INMETRO/ANATEL, filtro por linha e carrossel infinito com arraste, inércia, autoplay e seleção de card.
- **Faixa tipográfica**: move na horizontal conforme o scroll vertical.
- **Onde comprar**: cards da Shopee e do Mercado Livre (identificados pelos logos), com parallax e luz no hover.
- **JFA Parts**: texto institucional, placas e linhas atendidas (oculta por enquanto, ver abaixo).
- **Manuais**: busca por nome/modelo/código, abas por linha e categoria, e download dos PDFs.
- **Representantes**: mapa interativo do Brasil, busca por estado, painel de contato e vendas internacionais.
- **Carrossel de campanhas**: banners com loop infinito, arraste, setas, paginação e autoplay (desktop e mobile).

### Páginas internas (roteamento por hash)

| URL                                                                | Página                                                                                                                 |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `#/baterias`                                                       | Não é mais uma página: volta para a Home com o menu de Categorias aberto                                               |
| `#/baterias/:slug`                                                 | Detalhe da bateria: especificações, manual, relacionados e suporte por WhatsApp                                        |
| `#/setores/automotivo`, `telecom`, `motorhome`, `solar`, `nautica` | Catálogo da categoria no layout da antiga página de baterias (produtos e baterias de `src/data/sectors.js`)            |
| `#/setores/:setor/:produto`                                        | Página do produto (fotos, descrição e documentos de `src/data/productDetails.js`)                                      |
| `#/setores/moov`                                                   | Landing page da JFA Moov (bicicletas elétricas), em `components/pages/MoovPage.jsx`                                    |
| `#/setores/parts`                                                  | Landing page da JFA Parts (buscador de placas, catálogo, diferenciais e história), em `components/pages/PartsPage.jsx` |
| `#/suporte`                                                        | Suporte técnico: mesmo mapa de Representantes, com os contatos de suporte (`src/data/support.js`)                      |
| `#/representantes`                                                 | A seção de Representantes da Home, sozinha numa página                                                                 |
| `#/manuais`                                                        | A seção de Manuais da Home, sozinha numa página                                                                        |

O botão **Categorias** do header abre um menu com Automotivo, Telecom, Motorhome, Solar e Náutica (as baterias ficam dentro de cada categoria: todas, menos as náuticas, também no Automotivo; as em rack no Telecom; no Solar só a Pro 12,8V e a Pro 48V 50Ah. Os inversores rack ficam no Telecom e o Black no Motorhome); `#/setores` sozinho volta para a Home com esse menu aberto. Nas categorias, os produtos aparecem em grade (2 por linha no celular) ou em lista, com a escolha salva no navegador. As páginas de produto e de bateria têm **fotos para download** (uma a uma ou todas).

**Moov e JFA Parts estão ocultas até segunda ordem**: as flags `SHOW_MOOV` e `SHOW_PARTS` de `src/data/visibility.js` controlam todos os pontos (menu, Frentes, seção da Home, abas de Manuais, busca, rodapé e rotas). Para voltar, basta trocá-las para `true`; os trechos estão marcados com o comentário `OCULTO: Moov/Parts`.

**Baterias fora do Automotivo (temporário)**: a flag `SHOW_BATERIAS_AUTOMOTIVO` de `src/data/visibility.js` tira as baterias da categoria Automotivo (catálogo, aba Automotivo dos Manuais, filtro Automotivo do carrossel da Home e botões de aplicação das páginas das baterias). Nada foi apagado: para voltar, troque para `true`; enquanto isso, a E-Lítio Pro 48V 50Ah (que só era Automotivo) aparece em Telecom. os trechos estão marcados com `OCULTO: baterias Automotivo`.

**Amplificadores ocultos (temporário)**: a flag `SHOW_AMPLIFICADORES` de `src/data/visibility.js` tira o AP400X4 e o AP800X4 do catálogo Automotivo e das páginas de produto; os manuais continuam na seção Manuais. A exportação (EN/ES) não muda. Para voltar, troque para `true` (trechos marcados com `OCULTO: amplificadores`).

Como o roteamento é por hash (`#/...`), não é preciso configurar rewrites no servidor.

- **Rodapé**: categorias, links internos, "Siga as nossas redes" (JFA Instagram e JFA YouTube, com os ícones nas cores de cada rede) e "voltar ao topo".

**Idiomas** (seletor PT / EN / ES no header): o português é o site completo; inglês e espanhol mostram a **visualização de exportação**, com as mesmas seções do site em português (Hero, acesso rápido, áreas da JFA, "Descubra as soluções" e Manuais), só com os produtos de exportação, página de cada produto e o WhatsApp de vendas internacionais. O idioma vem de `?lang=`, da escolha salva do visitante ou do idioma do navegador (pt → PT, es → ES, outros → EN). Textos em `src/i18n/strings.js`; produtos de exportação (inglês e espanhol) em `src/data/exportProducts.js`, a partir do site de exportação da JFA (automotivo.jfaeletronicos.com/en).

Modo claro/escuro: botão de sol/lua no header. O escuro é o padrão e a escolha fica salva no navegador do visitante. As cores do modo claro são geradas no build por `tools/postcss-light-theme.js` a partir do CSS escuro; ajustes manuais ficam em `src/styles/theme-light.css`, e áreas com `data-theme-keep` mantêm as cores originais.
Acessibilidade: todas as animações respeitam `prefers-reduced-motion`, inclusive se a preferência mudar com a página aberta.
Analytics: a tag do Google (GA4, `G-MHE0NRXPLR`) fica no `<head>` do `index.html`, uma vez só, e vale para todas as páginas. Os eventos de conversão passam por `src/lib/analytics.js`, que envia para o `gtag`.

## Tarefas comuns

- **Adicionar/editar um produto ou manual**: `src/data/products.js`.
- **Campanhas (banners)**: `src/data/campaigns.js`, com imagens em `public/images/`.
- **Setores**: `src/data/sectors.js`.
- **Baterias (páginas internas)**: dados no topo de `src/behaviors/router.js`.
- **Vídeo "Como usar" (páginas de produto e de bateria)**: coloque o vídeo vertical (9:16, .mp4) em `public/media/produtos/` e informe o caminho no campo `video` do produto (`src/data/productDetails.js`, `src/data/exportProducts.js` ou, nas baterias, no catálogo do topo de `src/behaviors/router.js`). Sem vídeo, a seção mostra "Vídeo em breve"; com vídeo, aparece o player e o botão "Baixar vídeo".
- **Trocar imagens**: substitua o arquivo em `public/images/`, mantendo o mesmo nome.
- **Representantes**: dados em `src/behaviors/representatives.js`.

## Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. A Vercel detecta Vite automaticamente (`vercel.json` já define `npm run build` e `dist/`).
3. Clique em **Deploy**. A branch `master` vira produção e a `dev` ganha uma URL de preview própria para testes.

## Branches

- `dev`: integração e testes (preview na Vercel).
- `master`: produção.

### Regra de deploy

**Nunca publique direto na Vercel** (sem `vercel deploy`, sem CLI, sem upload manual). Todo deploy acontece só por push no GitHub:

- push na `dev` → a Vercel publica automaticamente em https://sitejfa-git-dev-jfa2.vercel.app
- push na `master` (após aprovação) → a Vercel publica automaticamente em produção
