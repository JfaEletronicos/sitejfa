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

- **Mecânica das transformações:** cada peça destrava com um recuo mínimo, pausa,
  dispara e assenta com leve overshoot, um tranco de encaixe e uma faísca na junta.
  Cada peça gira no seu próprio eixo. Ao abrir a bateria aparecem parafusos que
  desrosqueiam e barramentos de cobre.
- **Energia como personagem:** um fio de luz azul nasce no polo positivo, contorna a
  bateria e guia as peças até a fonte. Depois sai do borne, corre pelo piso e
  desenha o projeto da caixa (contorno, graves e cornetas) antes de as peças chegarem.
  No grave, esse desenho volta pulsando.
- **Câmera:** plano-sequência na transformação da fonte, inserts curtos de encaixe,
  profundidade de campo nos closes e um respiro (recuo) antes da primeira pancada.
- **Luz e atmosfera:** a iluminação continua fixa, com feixes visíveis na névoa,
  reflexo nítido no piso, bloom em LEDs, voltímetro e energia, e grão de filme.
- **Ritmo:** contemplação longa intercalada com inserts de 0,5 s, e um segundo de
  quietude antes do grave.
- **Ponte com o real:** a última pancada solta uma onda de choque que atravessa a
  tela e estoura em branco. O corte para a filmagem real acontece nesse branco.

## Linha do tempo (`timeline.js`)

| Tempo | Take |
|---|---|
| 0–1,8 | 01 Bateria / revelação |
| 1,8–3,0 | 02 Bateria / ângulo |
| 3,0–4,2 | 03 Bateria / close |
| 4,2–6,6 | 04 Bateria → Fonte (wide + insert das células) |
| 6,6–7,8 | 05 Fonte |
| 7,8–9,6 | 06 Fonte / close + voltímetro (0 → 14,4 V, energia correndo até a saída) |
| 9,6–11,8 | 07 Fonte → estrutura do som (plano-sequência) |
| 11,8–12,4 | 08 Início da montagem (insert de encaixe) |
| 12,4–13,8 | 09 Graves |
| 13,8–15,0 | 10 Cornetas |
| 15,0–16,0 | 11 LEDs |
| 16,0–17,2 | 12 Sistema completo |
| 17,2–19,0 | 13 Grave (1 s de quietude, pancadas, ondas no piso, poeira, tremor, onda de choque) |
| 19,0–27,0 | 14–16 Filmagem real (corte seco no quadro de casamento → evento → drone) |
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
   O sistema real é um trio genérico sem marca: 2 graves, 4 cornetas em cima e
   réguas de LED azul em cima e embaixo. Câmera frontal, na altura do centro dos
   graves, com o mesmo tamanho e a mesma posição na tela. O corte acontece no
   branco da onda de choque. Abra o real saindo do branco, numa pancada de grave.
2. **Take 15, evento:** encontro de som automotivo brasileiro de verdade, com carros,
   porta-malas abertos, público, LEDs e noite. Os controles JFA podem aparecer aqui,
   na mão de alguém ou no painel do carro.
3. **Take 16, drone:** começa colado no sistema e sobe/recua sem parar até revelar o
   evento inteiro, com o sistema ainda visível e integrado ao ambiente.
