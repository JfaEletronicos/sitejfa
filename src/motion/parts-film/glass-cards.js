/**
 * Cards "Liquid Glass" no espaço 3D do palco: vidro de verdade (transmissão com desfoque do
 * que está atrás, reflexo do estúdio e verniz), borda fina clara, um brilho suave em
 * diagonal e o texto desenhado em código num canvas (fontes do site). Ficam presos ao mundo,
 * então acompanham a câmera, ganham motion blur e profundidade de campo e saem no vídeo
 * exportado. Nenhuma imagem é usada.
 */
import * as THREE from 'three';

const FONTS = {
  sans: 'Poppins',
  wide: '"Stretch Pro"',
  condensed: 'Anton',
  serif: '"Instrument Serif"',
};

/** Contorno de retângulo arredondado (centro na origem). */
function roundedRect(shape, w, h, r) {
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/**
 * Desenha as linhas do card. Cada linha: `{ x, y, align, parts: [{ text, font, weight,
 * italic, size, alpha, tracking, sub }] }`, com x/y e size em frações da altura do card
 * (y = linha de base).
 */
function drawText(spec, px) {
  const W = Math.round(px * spec.w);
  const H = Math.round(px * spec.h);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  (spec.lines || []).forEach((line) => {
    let k = 1;
    const fontOf = (p, scale = 1) =>
      `${p.italic ? 'italic ' : ''}${p.weight || 400} ${Math.round(p.size * k * H * scale)}px ${FONTS[p.font || 'sans']}`;
    const widthOf = (p) => {
      ctx.font = fontOf(p, p.sub ? 0.6 : 1);
      const tr = (p.tracking || 0) * p.size * k * H;
      return ctx.measureText(p.text).width + tr * p.text.length + (p.gap || 0) * H;
    };
    // A linha cabe no card (margem igual dos dois lados): se passar, a letra diminui.
    const margin = line.align === 'center' ? 0.12 * H : line.x * H;
    const room = W - 2 * margin;
    const natural = line.parts.reduce((m, p) => m + widthOf(p), 0);
    if (natural > room) k = room / natural;
    const total = line.parts.reduce((m, p) => m + widthOf(p), 0);
    let x = line.align === 'center' ? (W - total) / 2 : line.x * H;
    const y = line.y * H;
    line.parts.forEach((p) => {
      ctx.font = fontOf(p, p.sub ? 0.6 : 1);
      ctx.globalAlpha = p.alpha ?? 1;
      const tr = (p.tracking || 0) * p.size * k * H;
      const py = p.sub ? y + p.size * k * H * 0.12 : y;
      if (tr) {
        for (const ch of p.text) {
          ctx.fillText(ch, x, py);
          x += ctx.measureText(ch).width + tr;
        }
      } else {
        ctx.fillText(p.text, x, py);
        x += ctx.measureText(p.text).width;
      }
      x += (p.gap || 0) * H;
    });
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Brilho em diagonal do vidro (degradê desenhado em código). */
function sheenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, 'rgba(255,255,255,0.08)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.02)');
  g.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Cria um card. `spec`: `{ w, h, depth, radius, lines }` (unidades de cena). Devolve
 * `{ group, setOpacity, glass }`; o grupo olha para +Z (o palco o põe de frente para a câmera).
 */
export function createGlassCard(spec) {
  const w = spec.w;
  const h = spec.h;
  const depth = spec.depth ?? 0.06;
  const r = Math.min(spec.radius ?? 0.18, h / 2 - 0.01);
  const group = new THREE.Group();

  // Corpo do vidro: o retângulo arredondado extrudado, com as quinas chanfradas de leve.
  const body = new THREE.ExtrudeGeometry(roundedRect(new THREE.Shape(), w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.3,
    bevelSize: depth * 0.3,
    bevelSegments: 3,
    curveSegments: 12,
  });
  body.translate(0, 0, -depth / 2);
  const glass = new THREE.Mesh(
    body,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.55,
      transmission: 1,
      thickness: 0.35,
      ior: 1.4,
      clearcoat: 0.12,
      clearcoatRoughness: 0.25,
      specularIntensity: 0.18,
      transparent: true,
      opacity: 1,
    }),
  );
  group.add(glass);

  const face = new THREE.ShapeGeometry(roundedRect(new THREE.Shape(), w, h, r), 12);
  const sheen = new THREE.Mesh(
    face,
    new THREE.MeshBasicMaterial({ map: sheenTexture(), transparent: true, depthWrite: false }),
  );
  sheen.position.z = depth / 2 + depth * 0.3 + 0.002;
  sheen.renderOrder = 10;
  group.add(sheen);

  const ringShape = roundedRect(new THREE.Shape(), w, h, r);
  ringShape.holes.push(roundedRect(new THREE.Path(), w - 0.016, h - 0.016, Math.max(r - 0.008, 0.01)));
  const ring = new THREE.Mesh(
    new THREE.ShapeGeometry(ringShape, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, depthWrite: false }),
  );
  ring.position.z = depth / 2 + depth * 0.3 + 0.003;
  ring.renderOrder = 11;
  group.add(ring);

  const text = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: drawText(spec, 512), transparent: true, depthWrite: false }),
  );
  text.position.z = depth / 2 + depth * 0.3 + 0.004;
  text.renderOrder = 12;
  group.add(text);

  const base = { sheen: 1, ring: 0.28, text: 1 };
  function setOpacity(o) {
    glass.material.opacity = o;
    glass.visible = o > 0.002;
    sheen.material.opacity = base.sheen * o;
    ring.material.opacity = base.ring * o;
    text.material.opacity = base.text * o;
    group.visible = o > 0.002;
  }
  setOpacity(0);
  return { group, setOpacity, glass };
}
