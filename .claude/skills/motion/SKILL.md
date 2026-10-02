---
name: motion
description: Cria e ajusta motions da JFA Parts no modelo aprovado — vídeos/animações de produto e peças para redes sociais (9:16, tipografia cinética, câmera 3D) com o modelo 3D real da placa, em parts-filme.html. Use sempre que pedirem um motion, vídeo, animação, reels/stories, peça animada, cena nova, ou ajustes de texto/fundo/câmera/transição em um motion existente.
---

# Motion JFA Parts

Todo motion novo segue o modelo construído e aprovado na variante `social-kinetic`
("Você não vê, mas ela está em tudo"). Um motion = um **roteiro** em
`src/motion/parts-film/social/scores/<id>.js` rodando no **motor** de tipografia cinética
(`social/kinetic.js`) sobre o **palco 3D** com o modelo real (`stage.js` + GLB em
`public/models`). Comece sempre de `scores/modelo.js`. A referência de cada campo do roteiro
está em [referencia.md](referencia.md).

## Regras invioláveis

- **Nada de imagem gerada**: não criar imagens, renders falsos, fotos, fundos ou texturas
  rasterizadas, stock, elementos de IA, componentes eletrônicos fictícios. O produto é sempre
  o modelo 3D real; tudo o mais é HTML, CSS, SVG e WebGL desenhados em código.
- Referências (Apple etc.) valem só como **linguagem**; não copiar identidade, composição,
  tipografia ou assets.
- Não mexer no site (outras páginas, componentes, assets) sem necessidade. Não destruir
  variantes existentes: motion novo é roteiro novo; o filme `premium` é outro estilo.
- **Deploy nunca direto na Vercel** (sem CLI, sem upload). A prévia sai do push no branch de
  trabalho: `https://sitejfa-git-<branch com / trocado por ->-jfa2.vercel.app/parts-filme.html?variant=<id>&range=<início>-<fim>`
  (protegida pelo login da Vercel). Não renderize vídeo a menos que peçam.
- Não abrir PR sem pedido. Commits sem identificador de modelo.

## Linguagem aprovada (checklist de toda cena)

1. **Produto é o foco**: placa grande e centralizada, nunca no canto. Luz e câmera servem a ela.
2. **Animação contida**, nunca exagerada ou amadora: entradas por máscara (a linha sobe de
   dentro dela mesma), fusões longas, overshoot mínimo.
3. **Fontes variadas** no mesmo bloco: Poppins (Light, ExtraBold itálico, Black), Stretch Pro,
   Anton, Instrument Serif itálico. Nunca uma fonte só.
4. **Texto em bloco colado**, alinhado à esquerda (x ≈ 9%), perto da placa. Nada espalhado.
5. **Sem ponto final** nas frases. Ponte entre cenas em serifada itálica minúscula ("mas...",
   "e..."), entrando cedo o bastante para dar tempo de leitura.
6. **Uma animação-assinatura de texto por cena**, escolhida de uma lista de 15 possíveis para a
   cena, repetindo o mínimo entre cenas (já usadas: troca de fonte em ritmo, letra que estica).
7. **Sem esperar uma coisa acabar** para a outra começar: entradas sobrepostas e fusões, sem
   pausas mortas, nenhum quadro vazio nas passagens.
8. **Fundo nunca vazio**: um elemento de composição por cena, escolhido de uma lista de 10
   (palavra-chave gigante cobrindo a tela inteira, texto que estica de cima para baixo durante a
   cena, trilha de circuito revelada por máscara...). Um texto de fundo por cena.
9. **Letra esticada sempre que o texto for só estético**: ligadura da Stretch Pro (letra dobrada:
   `TUUDO`, `INVISSÍVEL`) ou estiramento por fatias (`stretchY`, `stretchLetter`). Nunca o
   esticamento bruto (escala) da palavra inteira.
10. **Câmera 3D móvel** que move tudo (placa e planos de texto). Troca de cena = a câmera gira de
    lado e entra entre os planos 3D (um universo só); depois o fundo muda devagar (escuro → claro).
11. **Ilustrações em SVG próprio** quando reforçam o texto (olhos, trilha de circuito), junto do
    bloco de texto, com animação contida (ex.: pupilas trocam de lado uma vez, devagar).
12. **Camadas**: `far` (fundo) → `back` → placa → `front`. "Abaixo da placa" = `back`.
13. **Formato** 9:16, 1080×1920 (redes sociais), salvo pedido diferente.

## Fluxo de trabalho

1. **Briefing**: produto (GLB), formato, duração, narrativa/copy, referências. Pergunte só o que
   faltar e mudar o resultado; o resto segue este modelo.
2. **Copy e mapa de cenas** (tempos), sem pontos finais. Mostre a copy se pedirem.
3. **Antes de animar cada cena**: liste 15 animações de texto e escolha a assinatura; liste 10
   elementos de composição de fundo e diga como cada um funcionaria; escolha. Evite repetir
   entre cenas.
4. **Uma cena por vez**: copie `scores/modelo.js` para `scores/<id>.js`, troque `META`, registre
   em `VARIANTS` (`src/motion/parts-film/main.js`) e monte a cena 1. Só passe para a próxima
   depois da aprovação.
5. **Verifique** (abaixo) e **revise contra o checklist e contra todos os pedidos acumulados**
   antes de enviar.
6. **Commit + push** no branch de trabalho; mande o link da prévia com `&range=` da cena e um
   resumo curto do que mudou e por quê.
7. Pedido do usuário que vale dali em diante vira regra: acrescente em "Preferências
   acumuladas" (abaixo) no mesmo commit.

## Verificação (sempre, antes de enviar)

- `npm run dev` em segundo plano. O servidor cai quando o ambiente reinicia: confira
  (`curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/parts-filme.html`) antes de capturar.
- **Quadros**: `node tools/motion/frames.mjs --variant <id> --times 0.5,1.5,2.4 --sheet` e olhe
  a folha (`.motion-frames/<id>/folha.png`). Detalhe: `--size 1080x1920`. Elementos quase
  apagados: `--levels`.
- **Segunda rodagem**: `--repeat` (vai até o fim e volta); os quadros `repeat-*` têm de ser iguais.
- **Antes de esticar uma letra**: `node tools/motion/glyph-cuts.mjs --font Anton --text E --axis x`
  (ou `--axis y --liga` com o texto inteiro) e use o `at` sugerido.
- **Câmera**: velocidade sempre decrescente ao assentar (nada de passar do ponto e voltar).
- `npx eslint .`, `npx prettier --check src/motion tools/motion .claude`, `npx vite build`.
- Não edite arquivos durante uma captura (o HMR recarrega a página no meio).

## Armadilhas já resolvidas (não repetir)

- `visibility`: use `'inherit'`/`'hidden'`, nunca `'visible'` em filhos — um filho `visible`
  aparece mesmo com o pai escondido (sobras de uma cena em outra na segunda rodagem).
- Recortes (`clip-path`) são arredondados para o pixel: recorte **depois** de ampliar
  (`slices.js` usa janelas), senão abre fresta.
- Esticar só onde a coluna/linha é estável e com pouca cobertura (`glyph-cuts`). Na Anton, U e O
  têm curvas finas que se separam ("TLJDO"); T (dois cortes, a haste fica no meio), E e D
  funcionam. Para esticar na altura, palavras sem diagonais (N, V, X, A, M viram blocos).
- Texto de fundo esticado na altura com Stretch Pro precisa de palavra legível: letras retas.
- Ligaduras da Stretch Pro só onde `liga: true` (o motor desliga ligaduras no resto). Não ligam:
  I, V, X, Y maiúsculas e i, l, v, x minúsculas.
- Acentos com máscara: o recorte já abre espaço em cima; saídas por máscara descem.
- O ângulo do espaço da cena (`spaces`) deve ficar perto do ângulo da câmera durante a cena.

## Preferências acumuladas do usuário

- Revisar cena por cena: terminar a cena, enviar, esperar aprovação, seguir.
- Prévia em página (Vercel do branch), não vídeo renderizado.
- Ritmo maior, sem pausas: fusões maiores entre uma coisa e outra.
- Olhos (cena 1): depois do "VÊ", entre as duas linhas, inclinados, cobrindo um pouco do texto;
  pupilas trocam de lado uma vez, devagar; fecham no fim.
- Troca de fonte não pode ser rápida demais.
- A placa começa preta e a luz a revela aos poucos.
- Fundo de cena cobrindo a tela inteira; na cena 2, um texto só que estica de cima para baixo.
- Linha tecnológica (trilha de circuito) abaixo do texto, gerada por máscara lateral, atrás da placa.
- Produto vem do CAD original quando houver (bateria E-LÍTIO PRO: `assets/elitio-pro`), com
  materiais reais (caixa em plástico rígido black piano) e os adesivos do arquivo de impressão.
- Não usar revisão independente (agentes/workflows) e economizar tokens: poucas capturas,
  uma folha de quadros cobrindo o trecho, sem rodadas repetidas.
- Filme da bateria: base 3D primeiro (cenário, luz, produto e câmera, sem texto); a luz tem
  de parecer luz no espaço (manchas no chão, queda nas paredes, sombras), nunca a imagem
  clareando por igual.
- Filme da bateria: um plano contínuo, sem cortes e sem paradas (só o último quadro assenta;
  `monotone: true` no plano); a câmera gira 360° sempre para o mesmo lado (o `az` só cresce),
  nunca vai e volta. Motion blur só quando a imagem anda rápido.
- Filme da bateria: câmera como um pássaro/mosca voando (6DoF, `flight`), nunca trilho nem
  órbita perfeita; curvas suaves (spline de curvatura contínua) e inclinadas; nada de tremida
  ou oscilação de mão; bateria às vezes fora do centro; contraste forte entre lento e rápido.
- Vista explodida: só movimento 3/4 lento, de fora (sem passar entre as peças).
- Vista explodida: a tampa sobe inteira (display, parafusos e botão juntos); separam-se só as
  peças internas; antes de remontar, a câmera passa entre elas.
- Quando o briefing de um filme contradiz este checklist (ex.: cena sem texto, fundo preto
  vazio, "se pode ser visual, não entra texto"), vale o briefing; anote no roteiro.
