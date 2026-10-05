/**
 * Títulos do filme em 2D, por cima da imagem (linguagem de filme de produto: tipografia
 * limpa, centrada, sem volume nem perspectiva). Cada título é uma linha desenhada em código
 * num canvas (fontes do site) ou uma imagem do cliente (logo), num plano da cena de
 * sobreposição do palco (câmera ortográfica, coordenadas do quadro). Entram com fusão, uma
 * subida curta e um desfoque que se resolve; saem com fusão. Saem no vídeo exportado (são
 * desenhados no canvas do palco). Nenhuma imagem é gerada.
 */
import * as THREE from 'three';

const FONTS = {
  sans: 'Poppins',
  wide: '"Stretch Pro"',
  condensed: 'Anton',
  serif: '"Instrument Serif"',
};
// Pixels do canvas por altura de quadro (desenho com folga para 4K).
const RES = 2400;

/**
 * Desenha o título. `spec.parts`: `[{ text, font, weight, italic, size, alpha, tracking,
 * gap, color, roll }]` com `size` em fração da altura do quadro; `spec.image` + `spec.imageEl`
 * (logo) com `spec.size` = altura; `spec.pill` desenha uma pílula de contorno fino em volta.
 * Uma parte com `roll` (lista de valores, o último é o final) vai para uma faixa à parte que
 * o shader rola como um contador. Devolve as texturas e o tamanho do plano em alturas de quadro.
 */
function drawTitle(spec) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const strip = document.createElement('canvas');
  strip.width = 1;
  strip.height = 1;
  let rows = 1;
  let rollRange = [2, 2];
  if (spec.imageEl) {
    const img = spec.imageEl;
    const h = Math.round(spec.size * RES);
    const w = Math.round((h * img.naturalWidth) / img.naturalHeight);
    const pad = Math.round(h * 0.2);
    canvas.width = w + pad * 2;
    canvas.height = h + pad * 2;
    ctx.globalAlpha = spec.alpha ?? 1;
    ctx.drawImage(img, pad, pad, w, h);
  } else {
    const fontOf = (p) =>
      `${p.italic ? 'italic ' : ''}${p.weight || 400} ${Math.round(p.size * RES)}px ${FONTS[p.font || 'sans']}`;
    const advance = (p) => {
      ctx.font = fontOf(p);
      const tr = (p.tracking || 0) * p.size * RES;
      return ctx.measureText(p.text).width + tr * Math.max(p.text.length - 1, 0);
    };
    const maxSize = Math.max(...spec.parts.map((p) => p.size));
    const textW = spec.parts.reduce((m, p) => m + advance(p) + (p.gap || 0) * RES, 0);
    const padX = Math.round(maxSize * RES * (spec.pill ? 1.1 : 0.3));
    const H = Math.round(maxSize * RES * (spec.pill ? 2.3 : 1.5));
    canvas.width = Math.ceil(textW + padX * 2);
    canvas.height = H;
    const base = spec.pill ? H * 0.5 + maxSize * RES * 0.36 : H * 0.74;
    if (spec.pill) {
      const lw = Math.max(2, maxSize * RES * 0.06);
      const r = H / 2 - lw;
      ctx.globalAlpha = spec.pillAlpha ?? 0.45;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.roundRect(lw, lw, canvas.width - lw * 2, H - lw * 2, r);
      ctx.stroke();
    }
    ctx.textBaseline = 'alphabetic';
    const rollPart = spec.parts.find((p) => p.roll);
    if (rollPart) {
      rows = rollPart.roll.length;
      strip.width = canvas.width;
      strip.height = H * rows;
    }
    const sctx = strip.getContext('2d');
    let x = padX;
    spec.parts.forEach((p) => {
      ctx.font = fontOf(p);
      ctx.globalAlpha = p.alpha ?? 1;
      ctx.fillStyle = p.color || '#fff';
      const tr = (p.tracking || 0) * p.size * RES;
      if (p.roll) {
        // Cada valor numa linha da faixa, alinhado pela direita do valor final.
        const wFinal = ctx.measureText(p.text).width;
        sctx.font = fontOf(p);
        sctx.fillStyle = p.color || '#fff';
        sctx.textBaseline = 'alphabetic';
        p.roll.forEach((v, k) => sctx.fillText(v, x + wFinal - sctx.measureText(v).width, H * k + base));
        rollRange = [
          (x - maxSize * RES * 0.1) / canvas.width,
          (x + wFinal + maxSize * RES * 0.1) / canvas.width,
        ];
        x += wFinal;
      } else if (tr) {
        [...p.text].forEach((ch) => {
          ctx.fillText(ch, x, base);
          x += ctx.measureText(ch).width + tr;
        });
        x -= tr;
      } else {
        ctx.fillText(p.text, x, base);
        x += ctx.measureText(p.text).width;
      }
      x += (p.gap || 0) * RES;
    });
  }
  const texOf = (c) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return {
    tex: texOf(canvas),
    strip: texOf(strip),
    rows,
    rollRange,
    w: canvas.width / RES,
    h: canvas.height / RES,
  };
}

/**
 * Cria o título. Devolve `{ mesh, set({ opacity, blur, roll }), size }` (`blur` em níveis de
 * mipmap; `roll` = posição do contador, 0 = primeiro valor).
 */
export function createTitle(spec) {
  const { tex, strip, rows, rollRange, w, h } = drawTitle(spec);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      map: { value: tex },
      strip: { value: strip },
      uRows: { value: rows },
      uRange: { value: new THREE.Vector2(...rollRange) },
      uRoll: { value: rows - 1 },
      uOpacity: { value: 0 },
      uBlur: { value: 0 },
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
      uniform float uOpacity;
      uniform float uBlur;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(map, vUv, uBlur);
        // Contador: a parte que rola mostra a faixa de valores (o próximo vem de baixo),
        // recortada na altura das maiúsculas.
        if (vUv.x >= uRange.x && vUv.x <= uRange.y && vUv.y > 0.18 && vUv.y < 0.82) {
          float v = 1.0 - (uRoll + 1.0 - vUv.y) / uRows;
          c += texture2D(strip, vec2(vUv.x, v), uBlur);
        }
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  const set = ({ opacity, blur, roll = rows - 1 }) => {
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uBlur.value = blur;
    material.uniforms.uRoll.value = roll;
    mesh.visible = opacity > 0.002;
  };
  set({ opacity: 0, blur: 0 });
  return { mesh, set, size: [w, h] };
}
