/**
 * Tipografia no espaço 3D do palco: uma linha de texto desenhada em código num canvas (fontes
 * do site) sobre um plano preso ao mundo. Fica atrás ou na frente do produto de verdade (a
 * bateria cobre o texto que está atrás dela), acompanha a câmera com parallax, ganha motion
 * blur e sai no vídeo exportado. Entrada por máscara: a linha sobe de dentro dela mesma;
 * saída por máscara, descendo. Nenhuma imagem é usada.
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
 * color, roll }]` com `size` em unidades de cena (altura da fonte). Uma parte com `roll`
 * (lista de textos, o último é o final) vai para uma faixa à parte, uma linha por valor, que o
 * shader rola como um contador. Devolve as texturas, o tamanho do plano em unidades e a faixa
 * horizontal (uv) da parte que rola.
 */
function drawLine(spec) {
  const ctx0 = document.createElement('canvas').getContext('2d');
  const fontOf = (p) =>
    `${p.italic ? 'italic ' : ''}${p.weight || 400} ${Math.round(p.size * PX)}px ${FONTS[p.font || 'sans']}`;
  const widthOf = (p) => {
    ctx0.font = fontOf(p);
    const tr = (p.tracking || 0) * p.size * PX;
    return ctx0.measureText(p.text).width + tr * Math.max(p.text.length - 1, 0) + (p.gap || 0) * PX;
  };
  const maxSize = Math.max(...spec.parts.map((p) => p.size));
  const pad = maxSize * 0.18 * PX;
  const W = Math.ceil(spec.parts.reduce((m, p) => m + widthOf(p), 0) + pad * 2);
  // Caixa da linha: das ascendentes (acentos) às descendentes, com folga.
  const H = Math.ceil(maxSize * 1.42 * PX);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  const base = H * 0.76;
  const rollPart = spec.parts.find((p) => p.roll);
  const rows = rollPart ? rollPart.roll.length : 1;
  const strip = document.createElement('canvas');
  strip.width = rollPart ? W : 1;
  strip.height = rollPart ? H * rows : 1;
  const sctx = strip.getContext('2d');
  let rollRange = [2, 2];
  let x = pad;
  spec.parts.forEach((p) => {
    ctx.font = fontOf(p);
    ctx.globalAlpha = p.alpha ?? 1;
    ctx.fillStyle = p.color || '#fff';
    const tr = (p.tracking || 0) * p.size * PX;
    if (p.roll) {
      // Cada valor numa linha da faixa, alinhado pela direita do texto final.
      sctx.font = fontOf(p);
      sctx.fillStyle = p.color || '#fff';
      sctx.textBaseline = 'alphabetic';
      const wFinal = ctx.measureText(p.text).width;
      p.roll.forEach((v, k) => {
        const wv = sctx.measureText(v).width;
        sctx.fillText(v, x + wFinal - wv, H * k + base);
      });
      rollRange = [(x - pad * 0.5) / W, (x + wFinal + pad * 0.5) / W];
      x += wFinal;
    } else if (tr) {
      [...p.text].forEach((ch, i, all) => {
        ctx.fillText(ch, x, base);
        x += ctx.measureText(ch).width + (i < all.length - 1 ? tr : 0);
      });
    } else {
      ctx.fillText(p.text, x, base);
      x += ctx.measureText(p.text).width;
    }
    x += (p.gap || 0) * PX;
  });
  const texOf = (c) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return { tex: texOf(canvas), strip: texOf(strip), rows, rollRange, w: W / PX, h: H / PX };
}

/**
 * Cria a linha (`spec` como em drawLine). Devolve `{ mesh, set({ reveal, out, opacity, roll,
 * sheen }) }`: `roll` = posição do contador (0 = primeiro valor), `sheen` = posição do brilho
 * que atravessa as letras (-0,3 a 1,3; fora disso, sem brilho).
 */
export function createTypeLine(spec) {
  const { tex, strip, rows, rollRange, w, h } = drawLine(spec);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: tex },
      strip: { value: strip },
      uRows: { value: rows },
      uRange: { value: new THREE.Vector2(...rollRange) },
      uRoll: { value: 0 },
      uSheen: { value: -1 },
      uAspect: { value: w / h },
      uReveal: { value: 0 },
      uOut: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform sampler2D strip;
      uniform float uRows;
      uniform vec2 uRange;
      uniform float uRoll;
      uniform float uSheen;
      uniform float uAspect;
      uniform float uReveal;
      uniform float uOut;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        // Máscara na caixa da linha: o texto entra subindo de dentro dela (vem de baixo,
        // cortado na borda de baixo) e sai descendo.
        vec2 st = vec2(vUv.x, vUv.y + (1.0 - uReveal) + uOut);
        if (st.y < 0.0 || st.y > 1.0) discard;
        vec4 c = texture2D(map, st);
        // Contador: a parte que rola mostra a faixa de valores, o próximo vindo de baixo.
        // (só na janela das maiúsculas, para não invadir as linhas de cima e de baixo).
        if (vUv.x >= uRange.x && vUv.x <= uRange.y && vUv.y > 0.2 && vUv.y < 0.8) {
          float v = 1.0 - (uRoll + 1.0 - st.y) / uRows;
          c += texture2D(strip, vec2(st.x, v));
        }
        // Brilho que atravessa as letras em diagonal (o branco fica mais quente onde passa).
        float d = (st.x * uAspect + st.y * 0.6) / (uAspect + 0.6) - uSheen;
        float glow = exp(-d * d / 0.006);
        c.rgb *= 0.8 + 2.6 * glow;
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.renderOrder = 4;
  const set = ({ reveal, out, opacity, roll = rows - 1, sheen = -1 }) => {
    material.uniforms.uReveal.value = reveal;
    material.uniforms.uOut.value = out;
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uRoll.value = roll;
    material.uniforms.uSheen.value = sheen;
    mesh.visible = opacity > 0.002 && reveal > 0.001 && out < 0.999;
  };
  set({ reveal: 0, out: 0, opacity: 0 });
  return { mesh, set };
}
