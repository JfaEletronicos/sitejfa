# JFA Eletrônicos — Site institucional

Site institucional da **JFA Eletrônicos**, migrado de uma página HTML única (≈9.400 linhas de HTML, CSS e JS inline) para **React 18 + Vite**, mantendo o visual e o comportamento **idênticos** ao original.

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
- **Onde comprar**: cards da Loja Oficial e do Mercado Livre, com parallax e luz no hover.
- **JFA Parts**: carrossel automático de fotos.
- **Manuais**: busca por nome/modelo/código, abas por linha e categoria, e download dos PDFs.
- **Representantes**: mapa interativo do Brasil, busca por estado, painel de contato e vendas internacionais.
- **Carrossel de campanhas**: banners com loop infinito, arraste, setas, paginação e autoplay (desktop e mobile).

### Páginas internas (roteamento por hash)

| URL | Página |
| --- | --- |
| `#/baterias` | Abertura curta e catálogo de baterias e-Lítio, com filtro animado por aplicação |
| `#/baterias/:slug` | Detalhe da bateria: especificações, manual, relacionados e suporte por WhatsApp |
| `#/setores` | Setores atendidos (Automotivo, Motorhome, Náutica, Telecom, Moov, Parts) |
| `#/setores/:slug` | Página de um setor, com CTA de WhatsApp |

Como o roteamento é por hash (`#/...`), não é preciso configurar rewrites no servidor.
- **Rodapé**: links internos e "voltar ao topo".

Acessibilidade: todas as animações respeitam `prefers-reduced-motion`, inclusive se a preferência mudar com a página aberta.
Analytics: os eventos de conversão passam por `src/lib/analytics.js`, que envia para `gtag` (GA4) ou `dataLayer` (GTM) quando existirem.

## Tarefas comuns

- **Adicionar/editar um produto ou manual**: `src/data/products.js`.
- **Campanhas (banners)**: `src/data/campaigns.js`, com imagens em `public/images/`.
- **Setores**: `src/data/sectors.js`.
- **Baterias (páginas internas)**: dados no topo de `src/behaviors/router.js`.
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
