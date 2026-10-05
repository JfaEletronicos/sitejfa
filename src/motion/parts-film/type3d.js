/**
 * Tipografia no espaço 3D do palco: cada linha é um objeto independente, desenhado em código
 * num canvas (fontes do site) sobre um plano preso ao mundo, com volume opcional (camadas
 * atrás da face, mais escuras, que aparecem quando a câmera vê a linha de lado). Fica atrás
 * ou na frente do produto de verdade (a bateria cobre o texto que está atrás dela), muda de
 * perspectiva com a câmera, ganha motion blur e sai no vídeo exportado. Entrada por máscara:
 * a linha sobe de dentro dela mesma; saída por máscara, descendo. Nenhuma imagem é usada.
 *
 * Animações por linha: contador (uma parte com `roll` rola de valor em valor), carga (`charge`:
 * a linha nasce em contorno e se preenche da esquerda para a direita, com a borda brilhando),
 * itálico (uma parte com `toItalic` se inclina até virar a itálica de verdade) e um brilho em
 * diagonal que atravessa as letras.
 */
import * as THREE from 'three';

const FONTS = {
  sans: 'Poppins',
  wide: '"Stretch Pro"',
  condensed: 'Anton',
  serif: '"Instrument Serif"',
};
const PX = 256; // pixels do canvas por unidade de cena (por 1 de `size`)

/**
 * Desenha a linha. `spec.parts`: `[{ text, font, weight, italic, size, alpha, tracking, gap,
 * color, roll, toItalic }]` com `size` em unidades de cena (altura da fonte); `spec.charge`
 * desenha o contorno na face e o preenchimento à parte.
 */
function drawLine(spec) {
  const ctx0 = document.createElement('canvas').getContext('2d');
  const fontOf = (p, italic = p.italic) =>
    `${italic ? 'italic ' : ''}${p.weight || 400} ${Math.round(p.size * PX)}px ${FONTS[p.font || 'sans']}`;
  const widthOf = (p) => {
    ctx0.font = fontOf(p);
    const tr = (p.tracking || 0) * p.size * PX;
    let wv = ctx0.measureText(p.text).width;
    if (p.toItalic) {
      ctx0.font = fontOf(p, true);
      wv = Math.max(wv, ctx0.measureText(p.text).width);
    }
    return wv + tr * Math.max(p.text.length - 1, 0) + (p.gap || 0) * PX;
  };
  const maxSize = Math.max(...spec.parts.map((p) => p.size));
  const pad = maxSize * 0.22 * PX;
  const W = Math.ceil(spec.parts.reduce((m, p) => m + widthOf(p), 0) + pad * 2);
  // Caixa da linha: das ascendentes (acentos) às descendentes, com folga.
  const H = Math.ceil(maxSize * 1.42 * PX);
  const base = H * 0.76;
  const make = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.textBaseline = 'alphabetic';
    return { c, ctx };
  };
  const face = make(W, H);
  const rollPart = spec.parts.find((p) => p.roll);
  const rows = rollPart ? rollPart.roll.length : 1;
  const strip = rollPart ? make(W, H * rows) : make(1, 1);
  const alt = spec.charge || spec.parts.some((p) => p.toItalic) ? make(W, H) : make(1, 1);
  let rollRange = [2, 2];
  let morphRange = [2, 2];
  let x = pad;
  spec.parts.forEach((p) => {
    const color = p.color || '#fff';
    const tr = (p.tracking || 0) * p.size * PX;
    const paint = (ctx, text, px, py, mode = 'fill', italic = p.italic) => {
      ctx.font = fontOf(p, italic);
      ctx.globalAlpha = p.alpha ?? 1;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, p.size * PX * 0.022);
      ctx.lineJoin = 'round';
      if (mode === 'stroke') ctx.strokeText(text, px, py);
      else ctx.fillText(text, px, py);
    };
    face.ctx.font = fontOf(p);
    if (p.roll) {
      // Cada valor numa linha da faixa, alinhado pela direita do texto final.
      const wFinal = face.ctx.measureText(p.text).width;
      p.roll.forEach((v, k) => {
        strip.ctx.font = fontOf(p);
        const wv = strip.ctx.measureText(v).width;
        paint(strip.ctx, v, x + wFinal - wv, H * k + base);
      });
      rollRange = [(x - pad * 0.5) / W, (x + wFinal + pad * 0.5) / W];
      x += wFinal;
    } else if (p.toItalic) {
      // A face tem a romana; a itálica fica à parte, no mesmo lugar.
      paint(face.ctx, p.text, x, base, 'fill', false);
      paint(alt.ctx, p.text, x, base, 'fill', true);
      const wv = widthOf(p) - (p.gap || 0) * PX;
      morphRange = [(x - pad * 0.3) / W, (x + wv + pad * 0.6) / W];
      x += wv;
    } else {
      const chars = tr ? [...p.text] : [p.text];
      chars.forEach((ch, i) => {
        if (spec.charge) {
          paint(face.ctx, ch, x, base, 'stroke');
          paint(alt.ctx, ch, x, base, 'fill');
        } else {
          paint(face.ctx, ch, x, base);
        }
        face.ctx.font = fontOf(p);
        x += face.ctx.measureText(ch).width + (tr && i < chars.length - 1 ? tr : 0);
      });
    }
    x += (p.gap || 0) * PX;
  });
  const texOf = ({ c }) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const mode = spec.charge ? 1 : spec.parts.some((p) => p.toItalic) ? 2 : 0;
  return {
    tex: texOf(face),
    alt: texOf(alt),
    strip: texOf(strip),
    rows,
    rollRange,
    morphRange,
    mode,
    baseV: 1 - base / H,
    w: W / PX,
    h: H / PX,
  };
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D alt;
  uniform sampler2D strip;
  uniform float uRows;
  uniform vec2 uRange;
  uniform float uRoll;
  uniform float uMode;
  uniform float uFill;
  uniform float uMorph;
  uniform vec2 uMorphRange;
  uniform float uBaseV;
  uniform float uSheen;
  uniform float uAspect;
  uniform float uReveal;
  uniform float uOut;
  uniform float uOpacity;
  uniform float uDim;
  varying vec2 vUv;
  void main() {
    // Máscara na caixa da linha: o texto entra subindo de dentro dela (vem de baixo,
    // cortado na borda de baixo) e sai descendo.
    vec2 st = vec2(vUv.x, vUv.y + (1.0 - uReveal) + uOut);
    if (st.y < 0.0 || st.y > 1.0) discard;
    vec4 c = texture2D(map, st);
    // Contador: a parte que rola mostra a faixa de valores, o próximo vindo de baixo (só na
    // janela das maiúsculas, para não invadir as linhas de cima e de baixo).
    if (vUv.x >= uRange.x && vUv.x <= uRange.y && vUv.y > 0.2 && vUv.y < 0.8) {
      float v = 1.0 - (uRoll + 1.0 - st.y) / uRows;
      c += texture2D(strip, vec2(st.x, v));
    }
    // Carga: do contorno ao preenchido, da esquerda para a direita, com a borda acesa.
    if (uMode > 0.5 && uMode < 1.5) {
      vec4 full = texture2D(alt, st);
      float m = 1.0 - smoothstep(uFill - 0.012, uFill + 0.012, st.x);
      c = mix(c, full, m);
      float front = exp(-pow((st.x - uFill) / 0.018, 2.0)) * step(0.002, uFill) * step(uFill, 0.998);
      c.rgb += vec3(1.8 * front * full.a);
      c.a = max(c.a, front * full.a);
    }
    // Itálico: a palavra se inclina (romana cisalhada) e termina na itálica de verdade.
    if (uMode > 1.5 && st.x >= uMorphRange.x && st.x <= uMorphRange.y) {
      float sh = 0.24 * uMorph;
      vec4 a = texture2D(map, vec2(st.x - sh * (st.y - uBaseV) / uAspect, st.y));
      vec4 b = texture2D(alt, st);
      c = mix(a, b, smoothstep(0.55, 1.0, uMorph));
    }
    // Brilho que atravessa as letras em diagonal (o branco fica mais quente onde passa).
    float d = (st.x * uAspect + st.y * 0.6) / (uAspect + 0.6) - uSheen;
    float glow = exp(-d * d / 0.006);
    c.rgb *= (0.8 + 2.6 * glow) * uDim;
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
    #include <colorspace_fragment>
  }`;

/**
 * Cria a linha (`spec` como em drawLine; `depth` e `layers` dão o volume). Devolve `{ group,
 * set({ reveal, out, opacity, roll, fill, morph, sheen }) }`: `roll` = posição do contador (0 =
 * primeiro valor), `fill` = carga (0 a 1), `morph` = itálico (0 a 1), `sheen` = posição do brilho
 * (-0,3 a 1,3; fora disso, sem brilho).
 */
export function createTypeLine(spec) {
  const d = drawLine(spec);
  const base = {
    map: { value: d.tex },
    alt: { value: d.alt },
    strip: { value: d.strip },
    uRows: { value: d.rows },
    uRange: { value: new THREE.Vector2(...d.rollRange) },
    uRoll: { value: 0 },
    uMode: { value: d.mode },
    uFill: { value: 1 },
    uMorph: { value: 0 },
    uMorphRange: { value: new THREE.Vector2(...d.morphRange) },
    uBaseV: { value: d.baseV },
    uSheen: { value: -1 },
    uAspect: { value: d.w / d.h },
    uReveal: { value: 0 },
    uOut: { value: 0 },
    uOpacity: { value: 1 },
  };
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(d.w, d.h);
  const layers = spec.depth ? (spec.layers ?? 8) : 0;
  // Camadas de volume atrás da face (mais escuras quanto mais fundo), depois a face.
  for (let i = layers; i >= 0; i--) {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { ...base, uDim: { value: i === 0 ? 1 : 0.42 - 0.22 * (i / layers) } },
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = i === 0 ? 0 : -(spec.depth * i) / layers;
    mesh.renderOrder = i === 0 ? 4 : 3;
    group.add(mesh);
  }
  const set = ({ reveal, out, opacity, roll = d.rows - 1, fill = 1, morph = 0, sheen = -1 }) => {
    // Os uniformes são compartilhados entre as camadas (mesmos objetos).
    base.uReveal.value = reveal;
    base.uOut.value = out;
    base.uOpacity.value = opacity;
    base.uRoll.value = roll;
    base.uFill.value = fill;
    base.uMorph.value = morph;
    base.uSheen.value = sheen;
    group.visible = opacity > 0.002 && reveal > 0.001 && out < 0.999;
  };
  set({ reveal: 0, out: 0, opacity: 0 });
  return { group, set };
}
