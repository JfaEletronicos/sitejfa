/**
 * Acabamento fino da superfície, calculado no shader (nenhuma imagem): casca de laranja do
 * verniz (ondula de leve os reflexos), micro-riscos finos que só aparecem quando a luz pega,
 * verniz gasto em algumas quinas e marcas de atrito perto da base. Usado na caixa black piano
 * da E-LÍTIO PRO; vale para qualquer material padrão/físico do three.js.
 *
 * O ruído é procurado no espaço do mundo em milímetros (`unit` = mm por unidade de cena),
 * então a textura não escorrega quando a câmera anda e não depende de UV.
 */

const DETAIL_GLSL = /* glsl */ `
uniform float uWearK, uScratchK, uPeelK, uUnit;
varying vec3 vWP;
varying vec3 vWN;
float sdWear, sdScr;
vec3 sdPert;
float sdHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float sdNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(sdHash(i), sdHash(i + vec3(1, 0, 0)), f.x), mix(sdHash(i + vec3(0, 1, 0)), sdHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(sdHash(i + vec3(0, 0, 1)), sdHash(i + vec3(1, 0, 1)), f.x), mix(sdHash(i + vec3(0, 1, 1)), sdHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float sdFbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * sdNoise(p); p *= 2.03; a *= 0.5; }
  return s;
}
float sdH2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// Riscos: segmentos esparsos (células de 24 mm), de 0,03 a 0,08 mm de largura, com
// antisserrilhado que conserva energia (risco mais fino que o pixel some aos poucos).
float sdScratches(vec2 p) {
  float m = 0.0;
  vec2 c = floor(p / 24.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) for (int k = 0; k < 2; k++) {
    vec2 cell = c + vec2(i, j);
    float fk = float(k);
    if (sdH2(cell * 1.37 + fk * 7.1) > 0.45) continue;
    vec2 a = (cell + vec2(sdH2(cell + fk + 3.1), sdH2(cell + fk + 5.7))) * 24.0;
    float ang = sdH2(cell + fk * 2.3 + 9.2) * 6.2831;
    float len = 5.0 + sdH2(cell + fk + 1.9) * 32.0;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec2 pa = p - a;
    float t = clamp(dot(pa, dir), 0.0, len);
    float d = length(pa - dir * t);
    float w = 0.03 + 0.05 * sdH2(cell + fk + 4.4);
    float fw = max(fwidth(d), 1e-4);
    float cov = (1.0 - smoothstep(w, w + fw * 1.5, d)) * min(1.0, w / fw);
    float taper = smoothstep(0.0, 0.2, t / len) * smoothstep(1.0, 0.8, t / len);
    m = max(m, cov * taper * (0.35 + 0.65 * sdH2(cell + fk + 8.8)));
  }
  return m;
}
`;

const DETAIL_MASKS = /* glsl */ `
vec3 sdMM = vWP * uUnit;
vec3 sdN = normalize(vWN);
vec3 sdA = abs(sdN);
vec2 sdP = sdA.x > sdA.y && sdA.x > sdA.z ? sdMM.zy : (sdA.y > sdA.z ? sdMM.xz : sdMM.xy);
sdScr = sdScratches(sdP) * uScratchK;
// Verniz gasto: só nos arredondamentos (normal "diagonal") e em manchas, mais junto à base.
float sdEdge = smoothstep(0.06, 0.24, 1.0 - max(max(sdA.x, sdA.y), sdA.z));
sdWear = sdEdge * smoothstep(0.42, 0.72, sdFbm(sdMM / 16.0));
sdWear = max(sdWear, (1.0 - smoothstep(1.5, 12.0, sdMM.y)) * (1.0 - sdA.y) * smoothstep(0.4, 0.8, sdFbm(sdMM / 5.0)) * 0.7);
sdWear *= uWearK;
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb + vec3(0.03, 0.031, 0.034), sdWear);
diffuseColor.rgb += vec3(0.016) * sdScr;
// Casca de laranja: gradiente de um ruído suave (5 mm), tangente à superfície.
vec3 sdQ = sdMM / 5.0;
float sdN0 = sdNoise(sdQ);
vec3 sdG = vec3(
  sdNoise(sdQ + vec3(0.35, 0.0, 0.0)) - sdN0,
  sdNoise(sdQ + vec3(0.0, 0.35, 0.0)) - sdN0,
  sdNoise(sdQ + vec3(0.0, 0.0, 0.35)) - sdN0) / 0.35;
sdG -= sdN * dot(sdG, sdN);
sdPert = sdG * 0.0035 * uPeelK;
`;

/**
 * Liga o acabamento num material. `wear`, `scratch` e `peel` são intensidades (0 desliga);
 * `unit` = milímetros por unidade de cena.
 */
export function surfaceDetail(mat, { wear = 1, scratch = 1, peel = 1, unit = 1 } = {}) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uWearK: { value: wear },
      uScratchK: { value: scratch },
      uPeelK: { value: peel },
      uUnit: { value: unit },
    });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWP;\nvarying vec3 vWN;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWN = normalize(mat3(modelMatrix) * objectNormal);',
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n${DETAIL_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${DETAIL_MASKS}`)
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor + sdWear * 0.35 + sdScr * 0.3 + (sdFbm(sdMM / 3.0) - 0.5) * 0.04, 0.02, 1.0);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
normal = normalize(normal + (viewMatrix * vec4(sdPert, 0.0)).xyz);`,
      )
      .replace(
        '#include <clearcoat_normal_fragment_maps>',
        `#include <clearcoat_normal_fragment_maps>
#ifdef USE_CLEARCOAT
clearcoatNormal = normalize(clearcoatNormal + (viewMatrix * vec4(sdPert, 0.0)).xyz);
#endif`,
      )
      .replace(
        '#include <lights_physical_fragment>',
        `#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.0 - sdWear * 0.85;
material.clearcoatRoughness = clamp(material.clearcoatRoughness + sdScr * 0.4 + sdWear * 0.4, 0.0, 1.0);
#endif`,
      );
  };
  mat.customProgramCacheKey = () => `surface-detail-${wear}-${scratch}-${peel}-${unit}`;
  mat.needsUpdate = true;
  return mat;
}

/** Intensidades por material do modelo da E-LÍTIO PRO (nome do material no GLB). */
export const ELITIO_PRO_DETAIL = [
  [/^Caixa black piano$/, { wear: 1, scratch: 1, peel: 1 }],
  [/^Pegador$/, { wear: 1.4, scratch: 1.2, peel: 0.5 }],
  [/^Adesivo /, { wear: 0, scratch: 0.6, peel: 0.6 }],
];

/**
 * Ajustes de material da E-LÍTIO PRO no filme (estúdio escuro): o black piano de verdade é
 * preto quase absoluto e só aparece onde reflete luz (linhas finas e estouradas); aqui ele
 * fica um carvão escuro, com verniz menos espelhado, para o corpo ganhar volume com a luz e os
 * reflexos se espalharem em vez de estourar. Não é realista de propósito: a bateria se
 * destaca do fundo.
 */
export const ELITIO_PRO_LOOK = [
  [/^Caixa black piano$/, { color: 0x383b41, roughness: 0.38, clearcoat: 0.8, clearcoatRoughness: 0.09 }],
  [/^Pegador$/, { color: 0x2e3035, roughness: 0.45 }],
  [/^Display face$/, { color: 0x1d1e22, clearcoatRoughness: 0.06 }],
];
