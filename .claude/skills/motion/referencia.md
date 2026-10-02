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

- Entrada em `VARIANTS` com `studio: 'white'`: ciclorama 3D iluminado pelas luzes do set, luz
  e reflexos presos ao mundo (a câmera anda, a luz não). Campos de luz extras: `wash` (luz de
  fundo no chão e na parede atrás), `contact` (sombra de contato), `rimAz` (direção do
  contraluz, em graus no mundo); `keyAz`/`keyEl` também ficam no mundo.
- `detail` na entrada: acabamento fino no shader por nome de material (`surface-detail.js`).
- `meta.shutter` (s): motion blur de câmera real (soma de instantes dentro do obturador),
  só quando a imagem anda rápido; nunca atravessa um corte. Máximo em `CAMERA.blurSamples`.
- Plano em voo livre (`flight: true` no SHOT): marcações `{ t, pos, look, roll, lens, shift }`
  (posição e ponto de olhar independentes, 6DoF) numa spline de curvatura contínua
  (`smoothSpline` em tracks.js), com inclinação de curva automática pela aceleração lateral
  (`bankK`, `maxBank`). A curva pode passar um pouco das marcações: confira por amostragem
  que a câmera não entra no produto.
- `explode: { <camada>: [[t, deslocamento, curva]] }`: camadas `EXPLODE_<nome>` do GLB sobem
  na vertical (unidades de cena).

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
  `{ base, keys: [[t, { keyLux, keyAngle, keyAz, keyEl, keyLead, rimLux, fill, env, bloom, exposure, sweep, aperture }]] }`.
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
