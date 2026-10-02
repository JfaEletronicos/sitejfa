/**
 * KIT DE ROTEIRO do motor de tipografia cinética: o que todo roteiro (scores/*.js) usa
 * para montar cenas. Referência completa e regras de estilo em
 * .claude/skills/motion/ (SKILL.md e referencia.md).
 *
 * Unidades: tempo em segundos (sobre meta.duration); posições em % do quadro (x da
 * esquerda, y de cima; fora de 0–100 corta pela borda de propósito); tamanhos de letra
 * em px numa tela de 390 de largura ou 'huge' | 'large' | 'medium' (config.js).
 */

/**
 * Uma palavra ou linha. Opções (todas opcionais):
 *   space        espaço da cena (chave de spaces); planos girados em volta da placa
 *   layer        'far' (fundo) | 'back' (atrás da placa) | 'front' (na frente da placa)
 *   font         'sans' (Poppins) | 'wide' (Stretch Pro) | 'condensed' (Anton) | 'serif' (Instrument Serif)
 *   weight, italic, outline, color ('white' | 'black' | 'jfaBlue' | 'electricBlue' | 'deepBlue')
 *   liga         liga as ligaduras da Stretch Pro: letra dobrada vira uma letra esticada (UU, SS)
 *   lower        mantém minúsculas (o padrão é tudo em maiúsculas)
 *   tracking     espaçamento entre letras (px a 390)
 *   parts        [{ text, font, weight, italic, color, outline, liga, delay, gap, scale }]
 *                várias fontes na mesma linha, na mesma linha de base
 *   size, x, y, align ('left' | 'center' | 'right'), rotate, opacity
 *   fit          largura alvo (fração do quadro); fitMode 'stretch' (só a largura) | 'uniform'
 *   fitY         altura alvo (fração do quadro); fitMode 'uniformY' escala a palavra inteira
 *   origin       [x%, y%] da própria palavra; originY 'cap' = topo das maiúsculas
 *   in           { type, dur }: 'mask' (sobe de dentro da linha) | 'rise' | 'cut' | 'zoom'
 *                | 'explode' | 'stretch' | 'squeeze' | 'slideLeft|Right|Up|Down' | 'none'
 *   out          { type, dur }: 'fade' | 'mask' | 'slideLeft|Right|Up|Down' | 'cut'
 *   fade         [entrada, saída] em s: fusões que sobrepõem uma coisa à outra
 *   drift        [x, y] deriva ao longo da vida (% do quadro) · grow: crescimento
 *   stretchY     { at, keys }: estica o texto na altura "à moda da Stretch Pro" (slices.js);
 *                at = corte(s) na altura das maiúsculas (0 topo, 1 base) onde só há hastes;
 *                keys [[tempo local, altura das maiúsculas em fração do quadro, curva]]
 *                (0 = altura natural)
 *   stretchLetter { index, at, keys }: estica só uma letra na largura; at = coluna(s) onde só
 *                há traços horizontais; keys [[tempo local, largura extra em em, curva]]
 *   fx           [{ preset, at, dur, amount }] distorções da própria palavra (distortion.js)
 *   split        letra a letra (para distorções por letra)
 */
export const word = (text, t, o = {}) => ({
  text,
  t,
  layer: 'back',
  size: 'huge',
  font: 'sans',
  weight: null,
  color: 'white',
  outline: false,
  x: 50,
  y: 50,
  align: 'center',
  rotate: 0,
  fit: null,
  sy: 1,
  in: { type: 'cut' },
  out: { type: 'cut' },
  drift: [0, 0],
  grow: 0,
  fx: [],
  split: false,
  ...o,
});

/**
 * Troca de fonte: a mesma palavra em vários estilos, no mesmo lugar, em fusão rápida
 * (`crossfade` s) a cada troca. Ritmo em ciclos entre `from` e `lock`; antes e depois
 * fica o primeiro estilo da lista.
 */
export function fontCycle(text, t, styles, { from, lock, rhythm, order, crossfade = 0.06 }, o = {}) {
  const switches = [[t[0], 0]];
  let at = from;
  let i = 0;
  while (at < lock) {
    switches.push([at, order[i % order.length]]);
    at += rhythm[i % rhythm.length];
    i++;
  }
  switches.push([lock, 0]);
  const ramp = (x) => {
    const c = Math.min(Math.max(x, 0), 1);
    return c * c * (3 - 2 * c);
  };
  // Opacidade de um estilo: soma dos trechos em que ele é o ativo, com rampas
  // centradas em cada troca (o estilo que sai e o que entra se cruzam).
  const alphaOf = (k) => (tb) => {
    let a = 0;
    switches.forEach(([start, idx], i) => {
      if (idx !== k) return;
      const end = i + 1 < switches.length ? switches[i + 1][0] : Infinity;
      const enter = i === 0 ? 1 : ramp((tb - start) / crossfade + 0.5);
      const leave = end === Infinity ? 1 : ramp((end - tb) / crossfade + 0.5);
      a = Math.max(a, enter * leave);
    });
    return a;
  };
  return styles.map((style, k) =>
    word(text, t, {
      ...o,
      ...style,
      in: k === 0 ? o.in : { type: 'none' },
      alphaAt: alphaOf(k),
    }),
  );
}

/** Pilha de linhas repetidas que se abre a partir do centro (explosão tipográfica). */
export function stack(text, t, rows, o = {}) {
  const out = [];
  const mid = (rows - 1) / 2;
  for (let i = 0; i < rows; i++) {
    const k = i - mid;
    const ring = Math.abs(k);
    out.push(
      word(text, [t[0] + ring * (o.stagger ?? 0.05), t[1]], {
        ...o,
        y: (o.y ?? 50) + k * (o.gap ?? 11),
        outline: o.solidCenter ? ring > 0 : ring % 2 === 1,
        color: o.accentRing === ring ? 'electricBlue' : o.color || 'white',
        drift: [0, k * (o.spread ?? 0)],
        in: { type: 'explode', dur: 0.22 },
      }),
    );
  }
  return out;
}

/**
 * Pose de câmera para planos de/para (`cam: [pose(...), pose(...)]`): alvo, azimute e
 * elevação (graus), distância, `lens` (× CAMERA.fov) e `roll` (giro do quadro, graus).
 */
export const pose = (target, az, el, dist, extra = {}) => ({
  target,
  az,
  el,
  dist,
  lens: 1,
  roll: 0,
  ...extra,
});

/**
 * Pontos do modelo real da placa (placa_lb1004.glb, cena em unidades de 10 cm, placa
 * deitada, componentes para cima):
 *   encoder com eixo em (-0,01; 0 a 0,27; -0,11) · CI principal em (0,49; 0,02; -0,15)
 *   botões táteis em z≈0,05, x = 0,61 / 0,89 / 1,16 / 1,42 · placa: x ±1,55, z ±0,39
 */
export const PLACA = {
  CENTER: [0, 0, 0],
  ENCODER: [-0.012, 0.13, -0.11],
  CHIP: [0.485, 0.012, -0.151],
};

/** Nome de cada transição na régua de som (modo debug). */
const CUE_LABEL = {
  hardCut: 'Corte seco',
  whipLeft: 'Whoosh',
  whipRight: 'Whoosh',
  zoomIn: 'Impacto + sub',
  zoomOut: 'Impacto curto',
  verticalWipe: 'Swipe',
  horizontalWipe: 'Swipe',
  textWipe: 'Riser + corte',
  maskReveal: 'Respiro + abertura',
  scaleCut: 'Impacto',
  distortionCut: 'Glitch curto',
  productPass: 'Passagem (whoosh grave)',
  colorFlash: 'Impacto + flash',
};

/** Uma marcação de som para cada transição. */
export const cutCues = (cuts) =>
  cuts.map((c) => ({ t: c.t, id: `${c.type}-${c.t}`, label: CUE_LABEL[c.type] }));
