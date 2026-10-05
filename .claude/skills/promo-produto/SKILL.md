---
name: promo-produto
description: Cria vídeos promocionais de produto 3D da JFA no padrão aprovado do filme E-LÍTIO PRO — estúdio escuro de fotografia, produto 3D real em destaque com material fotográfico, câmera em voo livre fluida, takes médios, títulos 2D em Poppins, com ou sem cortes. Use quando pedirem vídeo promocional, lançamento, reels/stories ou filme de um produto (bateria, placa, peça) mostrado em 3D.
---

# Vídeo promocional de produto 3D

Padrão construído e aprovado no filme da bateria E-LÍTIO PRO (`?variant=elitio-pro`). Um vídeo
novo é um **roteiro** em `src/motion/parts-film/social/scores/<id>.js`, copiado de
`scores/produto-modelo.js` (`?variant=produto-modelo`), registrado em `VARIANTS`
(`src/motion/parts-film/main.js`). Motor, palco e ferramentas são os da skill `motion`. Valem
as regras invioláveis, o fluxo de prévia e a verificação descritos lá. Os campos do roteiro
estão em `.claude/skills/motion/referencia.md`.

## Identidade (sempre)

1. **Estúdio escuro de fotografia** (`studio: 'cinema'` na variante): fundo e chão quase
   pretos, reflexo leve no chão, luz fixa de estúdio (`STUDIO` do modelo). Nenhuma luz anda,
   acende ou apaga; só a câmera se move. O produto se destaca do fundo.
2. **Produto 3D em destaque**, sempre o modelo real (CAD/GLB). Nunca imagem gerada. O
   material tem de parecer foto, não animação:
   - `look`: plástico brilhante quase preto, sem brilho na camada de baixo; verniz espelhado;
     metal liso com menos ambiente.
   - `detail`: casca de laranja, ondulação, poeira rara, riscos quase invisíveis, e
     `coatDirect: 0` no verniz.
   - `mirrors`: as faces planas grandes refletem o próprio produto.
   - Câmera com `grain` e `vignette`.
     Use como base `ELITIO_PRO_LOOK`, `ELITIO_PRO_DETAIL` e `ELITIO_PRO_MIRRORS`
     (`surface-detail.js`) e crie as listas do produto novo pelos nomes de material do GLB.
3. **Tipografia**: títulos 2D por cima da imagem (`TITLES`), centrados, em **Poppins**:
   - linha principal semibold (600, tamanho ~0,046);
   - secundária light (300, ~0,024) em cinza claro `#b8bcc5`;
   - pílula de contorno para a chamada.
     Entrada com fusão, subida curta e desfoque que se resolve; saída com fusão. Sem ponto
     final. Nada de texto em 3D, nem efeitos grosseiros.
4. **Câmera fluida e orgânica**: voo livre (`flight: true`), como um pássaro: posição e olhar
   independentes, curvas suaves e inclinadas, sem tremida, sem laços, sem ir e voltar. A
   velocidade muda aos poucos. Contraste entre takes lentos e deslocamentos rápidos com rastro
   (`RUSH`, obturador 1/12). Profundidade de campo nos closes (`MACRO`).
5. **Takes médios**: ~1,6–2,2 s de deslize lento em cada detalhe (logotipo, adesivos,
   display, conectores); deslocamentos de ~0,4–0,5 s. Abertura curta (a ação começa em ~2 s).
6. **Linguagem Apple como referência só de linguagem**: clean, elegante, pouco texto, muito
   espaço.
7. **Fecho padrão**: hero com a frase principal, final com nome, especificações e chamada; a
   cena some no preto e o logo da JFA (`/images/jfa_logo_white.webp`) aparece no centro.
8. Formato 9:16, 1080×1920, 30 fps.

## Com ou sem cortes (escolha do usuário)

Pergunte no briefing. No roteiro, `SEM_CORTES` define o modo:

- **`true` (um plano só)**: a câmera voa de um take ao outro. O `az` em volta do produto só
  cresce (gira sempre para o mesmo lado). Os deslocamentos entre takes têm rastro de
  velocidade (`rushKeys`).
- **`false` (com cortes)**: cada take vira um plano próprio, e a troca é um corte seco. Cada
  plano começa e termina andando (`untilCut` estende o movimento até o corte). Planos
  seguidos precisam mudar bem de ângulo ou de tamanho (fechado ↔ aberto, frente ↔ cima),
  senão o corte parece um pulo. O rastro nunca atravessa um corte.

## Estrutura do roteiro (`produto-modelo.js`)

- `TAKES`: lista ordenada `{ id, t: [início, fim], macro, keys }`. As marcações (`keys`) são
  as do voo (`{ t, pos, look, lens, shift, rest }`), em unidades do modelo. `macro` liga a
  profundidade de campo do take.
- Pontos do produto (`P`): centro e cada detalhe que um take vai ler.
- `SHOTS` é montado a partir de `TAKES` conforme `SEM_CORTES`; não edite à mão.
- Cenas opcionais do filme da bateria, para reaproveitar quando fizer sentido:
  - cards Liquid Glass com especificações (`GLASS`);
  - vista explodida com nomes das peças (`EXPLODE`, `CALLOUTS`; o GLB precisa de nós
    `EXPLODE_<nome>`);
  - contador no número do hero (`rollAt`).

## Fluxo

1. **Briefing**: produto (GLB/CAD), duração, com ou sem cortes, detalhes a mostrar, frase
   principal, especificações, chamada. Pergunte só o que faltar.
2. Copie o modelo, registre a variante com `studio: 'cinema'` e `look`/`detail`/`mirrors` do
   produto, e ajuste os pontos e takes.
3. Uma cena por vez: envie a prévia com `&range=` e espere a aprovação.
4. **Material**: confira quadros em 1080×1920 a 100% (folha de recortes) antes de enviar.
   Corpo cinza liso é "plástico velho"; metal estourado e retângulo chapado de luz denunciam
   CG.
5. Verifique (skill `motion`): quadros, eslint, prettier, build. Faça commit e push, e mande o
   link da prévia.
6. **Exportar** (só quando pedirem): `node tools/motion/render.mjs --variant <id>` (Full HD;
   `--resume` retoma). Numa máquina com placa de vídeo, acrescente `--gpu`. Na nuvem (sem
   GPU), um quadro com rastro leva ~1 min em Full HD e ~5 min em 4K: avise o tempo antes.
   As fontes vão em `tools/motion/fonts`.
7. Pedido do usuário que valer dali em diante vira regra nesta skill, no mesmo commit.
