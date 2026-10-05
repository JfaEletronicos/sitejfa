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
 * color }]` com `size` em unidades de cena (altura da fonte). Devolve a textura e o tamanho do
 * plano em unidades.
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
  let x = pad;
  spec.parts.forEach((p) => {
    ctx.font = fontOf(p);
    ctx.globalAlpha = p.alpha ?? 1;
    ctx.fillStyle = p.color || '#fff';
    const tr = (p.tracking || 0) * p.size * PX;
    if (tr) {
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
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { tex, w: W / PX, h: H / PX };
}

/** Cria a linha (`spec` como em drawLine). Devolve `{ mesh, set({ reveal, out, opacity }) }`. */
export function createTypeLine(spec) {
  const { tex, w, h } = drawLine(spec);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: tex },
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
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.renderOrder = 4;
  const set = ({ reveal, out, opacity }) => {
    material.uniforms.uReveal.value = reveal;
    material.uniforms.uOut.value = out;
    material.uniforms.uOpacity.value = opacity;
    mesh.visible = opacity > 0.002 && reveal > 0.001 && out < 0.999;
  };
  set({ reveal: 0, out: 0, opacity: 0 });
  return { mesh, set };
}
