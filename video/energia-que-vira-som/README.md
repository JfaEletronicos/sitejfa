# JFA — Energia que vira som (filme de 30 s)

Filme 3D em Three.js, determinístico: cada quadro depende só do tempo `t`, então o
render quadro a quadro sai idêntico à pré-visualização.

**Conceito:** BATERIA → ENERGIA → FONTE → SISTEMA DE SOM → EXPERIÊNCIA REAL.
Não existe fade entre produtos. As mesmas peças mudam de pose:

| Peça | Bateria | Fonte | Caixa de som |
|---|---|---|---|
| 2 metades do gabinete | casco | corpo | as duas câmaras dos graves |
| tampa | tampa | tampa | plataforma das cornetas |
| fundo | fundo | base | plinto |
| 8 células de lítio | células internas | aletas do dissipador | réguas de LED |
| placa frontal | rótulo (gira 180°) | painel com voltímetro | placa de bornes traseira |
| polos | polos | bornes de saída | bornes traseiros |

Os graves saem de dentro das câmaras e as cornetas sobem da plataforma. O sistema de
som não tem marca. Os controles JFA **não** aparecem no 3D.

## Linguagem criativa

- **O produto é a energia:** bateria (0–6,8 s) e fonte (6,8–12 s) têm o tempo de tela; o
  som é o "tchan" do final (montagem em cascata de pops e o grave).
- **Abertura com queda cartunesca:** a bateria cai do alto, estica na queda, achata no
  impacto ("smack"), quica duas vezes cada vez menos e assenta; cada impacto levanta a
  poeira do piso, solta uma onda no chão e dá um tranco na câmera.
- **Texto:** uma frase só, em reticências, sem nomear produtos — *"A partir da energia
  JFA…"* (depois do pouso) → *"…tudo se transforma…"* (bateria vira fonte) → *"…até virar
  som."* (revelação do som) → assinatura **JFA** / *Energia que vira som.* Uma linha por
  vez, fina, no terço inferior esquerdo; nada sobre as transformações nem sobre o grave.
- **Transformações leves, de desenho animado:** as peças se remodelam no lugar, com
  movimento suave (sem voar nem girar), e o objeto inteiro faz squash & stretch
  (encolhe, estica, quica e assenta). O rótulo vira como uma carta e revela o painel da fonte.
- **Projeto do som:** duas câmaras com graves de 15" (aro de alumínio e anel de LED), painel
  de cornetas integrado com 4 cornetas retangulares de boca larga (moldura de alumínio),
  réguas de LED na junção e na base. Sem marca.
- **Espírito de energia (`spirit.js`):** linha de luz azul-clara com vida própria que ronda
  os objetos em espiral e dispara cada passagem (mergulha no polo e vira o fio de energia;
  entra no borne e vira o traço que desenha a caixa; laça o anel do grave; acende cornetas
  e réguas ao passar; carrega e explode contra a câmera no choque). Faíscas e estrelas de
  brilho a cada toque. Só brilha; a luz de estúdio continua fixa.
- **Fluxo contínuo:** nenhum take começa ou termina parado, e cada animação começa antes
  de a anterior acabar.
- **Câmera:** abertura baixa, tele nos planos de produto, órbita na transformação da
  bateria, perseguição da energia, match cuts no polo (03 → 04) e no anel → grave (08 → 09),
  rack focus, impacto físico do grave e último plano frontal alinhado ao drone.
- **Luz e atmosfera:** iluminação fixa, feixes na névoa, reflexo no piso, bloom e grão.
- **Ponte com o real:** a última pancada solta uma onda de choque que estoura em branco; o
  corte para a filmagem real acontece nesse branco.

## Linha do tempo (`timeline.js`)

| Tempo | Take |
|---|---|
| 0–2,2 | 01 Bateria cai e pousa — *"A partir da energia JFA…"* |
| 2,2–3,4 | 02 Bateria / ângulo |
| 3,4–4,6 | 03 Bateria / close (o espírito mergulha no polo) |
| 4,6–6,8 | 04 Bateria → Fonte (órbita) |
| 6,8–8,6 | 05 Fonte — *"…tudo se transforma…"* |
| 8,6–10,6 | 06 Fonte / close + voltímetro |
| 10,6–13,0 | 07 Energia desenha o projeto → Fonte vira a caixa |
| 13,0–13,4 | 08 Grave salta do anel de energia |
| 13,4–13,9 | 09 Graves |
| 13,9–14,4 | 10 Cornetas |
| 14,4–15,0 | 11 LEDs |
| 15,0–16,2 | 12 Sistema completo — *"…até virar som."* |
| 16,2–19,0 | 13 Grave (carga, pancadas, onda de choque) |
| 19,0–27,0 | 14–16 Filmagem real (corte no branco → evento → drone) |
| 27,0–30,0 | Encerramento: **JFA** / *Energia que vira som.* |

A música entra depois e não comanda os tempos.

## Pré-visualizar

```bash
npm install
npm run dev
# abra http://localhost:5173/video/energia-que-vira-som/   (?t=12 começa no segundo 12)
```

## Renderizar

```bash
node video/energia-que-vira-som/render.mjs            # 1920x1080, 30 fps
node video/energia-que-vira-som/render.mjs --scale 2  # 3840x2160
node video/energia-que-vira-som/render.mjs --only 3d --from 4 --to 7   # só um trecho
```

Saída em `video/energia-que-vira-som/out/`:
- `jfa-energia-que-vira-som.mp4`: o filme completo
- `match-frame.png`: último quadro 3D, que serve de referência para a filmagem real

## Trecho real (takes 14–16)

Coloque o material editado (8 s, sem áudio necessário) em `footage/real.mp4` e
renderize de novo. Até lá, uma claquete provisória ocupa o trecho.

Briefing de captação:
1. **Take 14, casamento:** o primeiro quadro precisa reproduzir o `match-frame.png`.
   O sistema real é um trio genérico sem marca: 2 graves, painel com 4 cornetas
   retangulares em cima e réguas de LED azul. Câmera frontal, na altura do centro dos
   graves, com o mesmo tamanho e a mesma posição na tela. O corte acontece no
   branco da onda de choque. Abra o real saindo do branco, numa pancada de grave.
2. **Take 15, evento:** encontro de som automotivo brasileiro de verdade, com carros,
   porta-malas abertos, público, LEDs e noite. Os controles JFA podem aparecer aqui,
   na mão de alguém ou no painel do carro.
3. **Take 16, drone:** começa colado no sistema e sobe/recua sem parar até revelar o
   evento inteiro, com o sistema ainda visível e integrado ao ambiente.
