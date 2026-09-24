# JFA Eletrônicos — Site institucional

Site institucional da **JFA Eletrônicos**, migrado de uma página HTML única (≈9.400 linhas de HTML + CSS + JS inline) para **React 18 + Vite**, mantendo o visual e o comportamento **idênticos** ao original.

## Stack

| Camada | Tecnologia |
| --- | --- |
| UI | React 18 (componentes funcionais) |
| Build/dev server | Vite 5 |
| Estilos | CSS puro, dividido por seção (ordem da cascata preservada) |
| Qualidade | ESLint 9 + Prettier 3 |
| Hospedagem | Vercel |

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
  media/hero.mp4           # vídeo de fundo da Hero
  fonts/StretchPro.woff    # fonte display dos títulos
  favicon.ico
src/
  main.jsx                 # ponto de entrada
  App.jsx                  # monta as seções e liga os comportamentos
  components/              # uma seção da página por componente (JSX)
  behaviors/               # interatividade de cada seção (um módulo por seção)
  data/products.js         # catálogo de produtos/manuais
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
- **Onde comprar**: cards da Loja Oficial e do Mercado Livre, com parallax e luz no hover.
- **JFA Parts**: carrossel automático de fotos.
- **Manuais**: busca por nome/modelo/código, abas por linha e categoria, e download dos PDFs.
- **Representantes**: mapa interativo do Brasil, busca por estado, painel de contato e vendas internacionais.
- **Oferta em destaque**: preço, contagem regressiva e parallax da imagem.
- **Rodapé**: links internos e "voltar ao topo".

Acessibilidade: todas as animações respeitam `prefers-reduced-motion`, inclusive se a preferência mudar com a página aberta.
Analytics: os eventos de conversão passam por `src/lib/analytics.js`, que envia para `gtag` (GA4) ou `dataLayer` (GTM) quando existirem.

## Tarefas comuns

- **Adicionar/editar um produto ou manual**: `src/data/products.js`.
- **Alterar o prazo da oferta**: `OFFER_END_AT` em `src/behaviors/offer.js`.
- **Trocar imagens**: substitua o arquivo em `public/images/`, mantendo o mesmo nome.
- **Representantes**: dados em `src/behaviors/representatives.js`.

## Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. A Vercel detecta Vite automaticamente (`vercel.json` já define `npm run build` e `dist/`).
3. Clique em **Deploy**. Cada push na branch principal gera um novo deploy.
