# Referência do roteiro (scores/*.js)

Arquivos: motor `src/motion/parts-film/social/kinetic.js` · kit do roteiro `social/kit.js`
(`word`, `fontCycle`, `stack`, `pose`, `PLACA`, `cutCues`) · controles `social/config.js` ·
distorções `social/distortion.js` · transições `social/transitions.js` · estiramento
`social/slices.js` · gráficos `social/eyes.js`, `social/trace.js` · palco 3D `stage.js` ·
registro de variantes `main.js`. Exemplo completo: `scores/em-tudo.js`; ponto de partida:
`scores/modelo.js`.

Unidades: tempo em segundos sobre `META.duration`; posições em % do quadro (x da esquerda, y
de cima; fora de 0–100 corta pela borda de propósito); letras em px numa tela de 390 de
largura (ou `'huge' | 'large' | 'medium'`).

## Exportações do roteiro (o `default` junta todas)

### META

`{ id, title, duration, stillTime, format }` — `id` é o `?variant=`; `title` vai para leitores de
tela; `stillTime` é o quadro parado de "reduzir movimento"; `format` `'9x16'` (padrão).

### SCENES

`[{ id, label, start, end }]` — régua do modo `?debug`.

### Estúdio branco, vista explodida e motion blur (filme da bateria)

- Entrada em `VARIANTS` com `studio: 'white'` (estúdio branco) ou `'cinema'` (estúdio
  escuro de fotografia: ciclorama grafite e ambiente quase preto, com só a softbox
  desenhada): ciclorama 3D iluminado pela luz do set, presa ao mundo (a câmera anda, a luz
  não). `keyLux`/`keyAz`/`keyEl` são uma softbox grande (RectAreaLight) mais um sol fraco
  só para a sombra macia, na mesma direção do mundo, mirando o centro do produto. Campos de
  luz extras: `wash` (luz de fundo no chão e na parede atrás), `contact` (sombra de
  contato), `floorReflect` (reflexo no chão), `rimAz` (direção do contraluz, em graus no
  mundo), `edge` (dois recortes finos atrás do produto, que desenham as arestas). No estúdio
  escuro a softbox fica mais perto e menor (a luz cai rápido e o fundo fica escuro).
- `detail` na entrada: acabamento fino no shader por nome de material (`surface-detail.js`):
  `[[regex, { wear, scratch, peel, wave, swirl, dust, smudge, coatDirect }]]` (intensidades;
  `peel` casca de laranja, `wave` ondulação larga, `swirl` arcos de polimento, `coatDirect: 0`
  tira do verniz o reflexo direto das luzes e deixa só o do ambiente).
- `look` na entrada: ajustes de material por nome só para o filme (`[[regex, { color,
roughness, specularIntensity, clearcoat, clearcoatRoughness, envMapIntensity, ... }]]`).
- `mirrors` na entrada: faces planas espelhadas (`[{ layer, material, dir }]`; `layer` = grupo
  da vista explodida, o plano é o maior plano do material voltado para `dir`). Cada face
  voltada para a câmera e dentro do quadro ganha um passe com a câmera espelhada (só o
  produto, cortado no plano) que entra no reflexo do verniz no lugar do ambiente.
- Estúdio escuro (`'cinema'`): o ambiente que o produto reflete é um set de produto preto
  (difusor no teto, quatro rebatedores em degradê nas diagonais, softbox na direção da luz do
  set, vazamento fraco nas paredes), desenhado em código, 1024 por face. `grain` e `vignette`
  no estúdio do roteiro: grão de sensor e vinheta na composição.
- `meta.shutter` (s): motion blur de câmera real (soma de instantes dentro do obturador; cada
  instante é arrastado na tela até os vizinhos pela profundidade, então o rastro sai contínuo
  com poucas amostras). `shutter` nas marcações de luz do plano abre mais o obturador num
  trecho (ex.: 1/10 s nos deslocamentos entre takes). O rastro é medido projetando o alvo, o
  plano de foco em volta e o fundo pelas câmeras do começo e do fim do obturador; nítido
  abaixo de ~14 px (num quadro de 1920), abrindo aos poucos até ~36 px. Nunca atravessa um
  corte. Máximo de amostras em `CAMERA.blurSamples` (número ímpar, a do meio no quadro).
- Plano em voo livre (`flight: true` no SHOT): marcações `{ t, pos, look, roll, lens, shift }`
  (posição e ponto de olhar independentes, 6DoF), com inclinação de curva automática pela
  aceleração lateral (`bankK`, `maxBank`). FORMA e RITMO separados: o caminho passa pelos
  pontos numa curva sem laços (`arcPath`, Catmull-Rom centrípeta) e a velocidade de cada
  trecho (distância ÷ tempo entre marcações) é suavizada no tempo (`flightPace`, gaussiana de
  `pace` s, padrão 0,3): nunca volta nem passa do ponto. Olhar/lente/enquadramento sem
  ultrapassagem e suavizados (`aimSmooth`, padrão 0,22 s). `stop: true` numa marcação assenta
  a câmera ali (use quando ela muda de sentido); `rest: true` no fim. Para um take lento,
  ponha marcações de desaceleração antes e de aceleração depois (a suavização espalha a
  velocidade dos trechos vizinhos uns 0,6 s). Confira velocidade, aceleração e giro da vista
  por amostragem (meta: aceleração ≲ 10 un/s², giro ≲ 80°/s nos trechos rápidos e ≲ 15°/s nos
  takes de detalhe) e que a câmera não entra no produto.
- `glass` no roteiro: cards Liquid Glass no espaço 3D do palco (`glass-cards.js`): vidro
  escuro de verdade (transmissão com desfoque do que está atrás, pouco reflexo), borda fina e
  texto desenhado em canvas com as fontes do site. Presos ao mundo e sempre de frente para a
  câmera (paralelos à tela), ganham motion blur e saem no vídeo exportado.
  `{ id, t: [entra, sai], pos, w, h, radius?, depth?, rise?,
inDur?, outDur?, lines: [{ x, y, align?, parts: [{ text, font, weight, italic, size,
alpha, tracking, gap, sub }] }] }` (x, y e size em frações da altura do card; a linha
  diminui sozinha se não couber).
- `titles` no roteiro: títulos em 2D por cima da imagem (`titles.js`, cena de sobreposição do
  palco, desenhados no canvas, então saem no vídeo exportado; sem motion blur, foco ou tom do
  palco). `{ id, t: [entra, sai], x?, y (% do quadro, centro), align?, parts: [{ text, font,
weight, italic, size (fração da altura do quadro), alpha, tracking, gap, color }] | image
(arquivo do cliente) + size, pill?, inDur?, outDur?, rise?, blur? }`. Entram com fusão,
  subida curta e desfoque que se resolve; saem com fusão.
- `callouts` no roteiro: nomes das peças na explodida, na sobreposição 2D: `{ id, t: [entra,
sai], layer (camada do explode que o ponto acompanha), anchor (ponto da peça fechada),
side: 'left' | 'right', text }`. Um ponto na peça, uma linha fina que se desenha até a
  coluna do lado (20% / 80% do quadro) e o nome depois dela; o nome nunca sai do quadro.
- Títulos com contador: parte com `roll: ['1', '2', '3']` e `rollAt: [t, dur]` no título.
- `explode: { <camada>: [[t, deslocamento, curva]] }`: camadas `EXPLODE_<nome>` do GLB sobem
  na vertical (unidades de cena).

### Exportar em vídeo (4K)

`npm run motion:render -- --variant <id>` (com o `npm run dev` rodando e ffmpeg instalado) grava o
filme quadro a quadro em 2160×3840 (4K vertical) com o motion blur real e gera
`.motion-render/<id>-2160x3840.mp4`. Opções: `--size 3840x2160 --format 16x9`, `--fps 30`,
`--range a-b`, `--out arquivo.mp4`. A página aceita `?quality=max` (resolução cheia, sem teto de
pixels). Numa máquina com placa de vídeo leva minutos; no ambiente de nuvem (sem GPU) cerca de 7
min por quadro, então rode localmente.

### SPACES

`{ <id>: { yaw } }` — ângulo (graus) dos planos de texto de cada cena em volta da placa. A
câmera virtual em `yaw` igual vê a cena de frente; planos de costas somem. Palavras e gráficos
escolhem o espaço com `space` (padrão `1`).

### SHOTS (placa)

`[{ t: [início, fim], ... }]`, um ativo por vez:

- **contínuo** (`keys`): `[{ t, target, az, el, dist, roll, lens, shift: [x, y], rot: [yaw, pitch, roll], rest }]`
  — spline com velocidade contínua; use para cenas ligadas pela câmera.
- **de/para** (`cam: [pose(...), pose(...)]`, `ease`): com `board: [{ rot }, { rot }]`,
  `shift: [[x, y], [x, y]]`, `pan`, `sweep: [a, b]`, `aperture`, `blur`, `hidden`.
- `target` em pontos do modelo (`PLACA.CENTER`, `PLACA.ENCODER`, `PLACA.CHIP`); `shift` move a
  placa no quadro (fração; +x direita, +y cima).
- `light`: preset `'punch' | 'macro' | 'onColor' | 'feature' | 'hero'` ou
  `{ base, keys: [[t, { keyLux, keyAngle, keyAz, keyEl, keyLead, rimLux, fill, env, bloom, exposure, sweep, aperture, shutter }]] }`.
  Placa revelada do preto: comece com `keyLux: 0, env: 0, fill: 0, rimLux` baixo e suba.

### CAMERA_RIG (câmera virtual: placa + planos de texto)

`[{ t, yaw, pitch, dolly, truck: [x, y], rest }]` — órbita em graus nos eixos da tela, `dolly`
aproxima (fração), `truck` desloca. Spline contínua: confira que a velocidade cai ao assentar
(sem passar do ponto e voltar). Passagem lateral entre cenas: ~25° → ~45° em 0,5 s com um
`dolly` maior no meio, assentando no `yaw` do espaço da cena seguinte.

### WORDS

`word(texto, [início, fim], opções)` — opções documentadas em `kit.js`:
`space`, `layer` (`far | back | front`), `font` (`sans | wide | condensed | serif`), `weight`,
`italic`, `outline`, `color` (`white | black | jfaBlue | electricBlue | deepBlue`), `liga`, `lower`,
`tracking`, `parts` (várias fontes na mesma linha: `{ text, font, weight, italic, color, delay, gap }`),
`size`, `x`, `y`, `align`, `rotate`, `opacity`, `fit`/`fitMode`/`fitY`, `origin`, `originY: 'cap'`,
`in`/`out` (`mask` é o padrão do modelo), `fade: [entrada, saída]`, `drift`, `grow`,
`stretchY: { at, keys }`, `stretchLetter: { index, at, keys }`, `fx`, `split`.

- `fontCycle(texto, t, estilos, { from, lock, rhythm, order, crossfade }, opções)`: troca de
  fonte em ritmo que trava no primeiro estilo em `lock`.
- `stack(texto, t, linhas, opções)`: pilha de linhas que se abre do centro.
- Estiramento: `stretchY.keys` = `[tempo local, altura das maiúsculas em fração do quadro, curva]`
  (0 = natural); `stretchLetter.keys` = `[tempo local, largura extra em em, curva]`; `at` vem de
  `tools/motion/glyph-cuts.mjs` (um corte ou dois: `[0.16, 0.85]` cresce para os dois lados).
- Curvas: `linear | glide | soft | settle | enter | exit | swell | expoOut | expoIn | easeIn`.

### GRAPHICS (SVG)

`{ type, space, layer, t, x, y, width, aspect, rotate, in: { dur } | { type: 'none' }, out: { dur }, ... }`

- `eyes`: `look: [[t, -1..1, duração, curva]]`, `closeAt`, `blinks`.
- `trace`: `reveal: [início, duração, curva]` (trilha de circuito por máscara lateral).
- Gráfico novo: arquivo `social/<nome>.js` com `create() → { node, update(...) }` e uma entrada
  em `GRAPHIC_TYPES` (kinetic.js). Desenhado em SVG, nunca imagem.

### BACKGROUND

`[[início, cor | 'glow' | 'hero' | 'white' | 'void' | 'smoke', fusão (s)]]` — cor de fundo atrás de
tudo. `void` = preto absoluto (produto preto some por completo); `smoke` = halo grafite tênue
atrás do produto (silhueta sobre o preto).

### BLOCKS

`[{ t, color, from: [x, y, w, h], to: [x, y, w, h], dur }]` — blocos de cor em %.

### CUTS (transições, centradas no corte)

`[{ t, type, dur, ... }]` — `hardCut`, `whipLeft`, `whipRight`, `zoomIn`, `zoomOut`,
`verticalWipe`, `horizontalWipe`, `textWipe`, `maskReveal` (`x`, `y`, `color`), `scaleCut`,
`distortionCut` (`dir`), `productPass` (`dir`), `colorFlash` (`colors`). No modelo aprovado,
a passagem preferida é a câmera girando (sem corte).

### FX (distorção global)

`[{ t, dur, preset, amount }]` — `clean`, `stretch`, `squeeze`, `shake`, `warp`, `glitch`,
`impact`, `smear`. Use pouco (o modelo é contido).

### CUES

`[{ t, id, label, until }]` — marcações de som na régua; `...cutCues(CUTS)` gera as das transições.

## Controles (config.js) e URL

`SOCIAL_MOTION_CONFIG` (duration, typography/distortion/transition/camera/product/colorIntensity,
motionBlur, autoplay, loop, debug), `TYPOGRAPHY`, `CAMERA` (fov, zoom, whip, shake, parallax).
Qualquer chave vale pela URL (`&cameraIntensity=0.5`). Parâmetros da página: `?variant=`,
`?range=a-b` (repete o trecho), `?t=`, `?debug` (régua + controles), `?format=16x9|9x16|1x1|4x5`,
`?capture` (não toca sozinho; `window.partsFilm.seek(t)`).

## Outro produto (outro modelo 3D)

GLB em `public/models/`, entrada em `VARIANTS` com `model: '/models/<arquivo>.glb'` e pontos de
interesse próprios no roteiro (o `PLACA` do kit é desta placa). Modelo que já vem em pé (eixo Y
para cima, como a bateria) leva `upAxis: 'y'` na entrada. A bateria E-LÍTIO PRO
(`?variant=elitio-pro`) é montada por `tools/motion/build-elitio-pro.mjs` a partir do CAD
original (`assets/elitio-pro/caixa-cad.glb`) e dos recortes dos adesivos; rode de novo se
mudar algo nela. Não substitua nem "redesenhe" o
modelo: use o arquivo enviado.
