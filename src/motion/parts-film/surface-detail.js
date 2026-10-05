/**
 * Acabamento fino da superfície, calculado no shader (nenhuma imagem): o que faz um plástico
 * brilhante parecer fotografado e não renderizado. Tudo sutil, visível só onde a luz pega:
 * - casca de laranja do verniz (ondula de leve os reflexos de perto);
 * - ondulação larga de peça injetada (as bordas retas das softboxes refletem levemente tortas);
 * - micro-riscos retos e marcas de polimento em arco (linhas finas que acendem no brilho);
 * - poeira finíssima, mais nas faces de cima;
 * - leve variação de brilho do verniz (manchas de manuseio quase invisíveis);
 * - verniz gasto em algumas quinas (bem pouco).
 *
 * - espelho de verdade nas faces planas grandes (`mirrors` do palco): a tampa reflete os
 *   bornes, o display e os adesivos; as laterais, os pegadores. Sem isso o black piano só
 *   reflete o estúdio e parece de computação gráfica.
 *
 * O ruído usa milímetros no espaço da peça girado para o mundo (`unit` = mm por unidade de
 * cena), sem a translação: a textura não escorrega quando a câmera anda nem quando a peça sobe
 * na vista explodida, e não depende de UV.
 */

const DETAIL_GLSL = /* glsl */ `
uniform float uWearK, uScratchK, uPeelK, uWaveK, uSwirlK, uDustK, uSmudgeK, uUnit, uCoatDirect;
varying vec3 vWP;
varying vec3 vWN;
float sdWear, sdScr, sdDust, sdSmudge;
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
// Gradiente tangente de um ruído (para inclinar a normal de leve).
vec3 sdGrad(vec3 q, vec3 n) {
  float n0 = sdNoise(q);
  vec3 g = vec3(
    sdNoise(q + vec3(0.35, 0.0, 0.0)) - n0,
    sdNoise(q + vec3(0.0, 0.35, 0.0)) - n0,
    sdNoise(q + vec3(0.0, 0.0, 0.35)) - n0) / 0.35;
  return g - n * dot(g, n);
}
float sdH2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// Linha antisserrilhada que conserva energia: mais fina que o pixel, some aos poucos.
float sdLine(float d, float w) {
  float fw = max(fwidth(d), 1e-4);
  return (1.0 - smoothstep(w, w + fw * 1.5, d)) * min(1.0, w / fw);
}
// Riscos: segmentos esparsos (células de 24 mm), de 0,03 a 0,08 mm de largura.
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
    float taper = smoothstep(0.0, 0.2, t / len) * smoothstep(1.0, 0.8, t / len);
    m = max(m, sdLine(d, w) * taper * (0.35 + 0.65 * sdH2(cell + fk + 8.8)));
  }
  return m;
}
// Marcas de polimento: arcos finos (pedaços de círculos de 8 a 40 mm), em células de 30 mm.
float sdSwirls(vec2 p) {
  float m = 0.0;
  vec2 c = floor(p / 30.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) for (int k = 0; k < 3; k++) {
    vec2 cell = c + vec2(i, j);
    float fk = float(k);
    if (sdH2(cell * 2.11 + fk * 5.3) > 0.6) continue;
    vec2 ctr = (cell + vec2(sdH2(cell + fk + 11.1), sdH2(cell + fk + 13.7))) * 30.0;
    float r = 8.0 + 32.0 * sdH2(cell + fk + 17.3);
    vec2 pc = p - ctr;
    float ang = atan(pc.y, pc.x);
    float a0 = sdH2(cell + fk + 19.9) * 6.2831;
    float span = 0.6 + 1.8 * sdH2(cell + fk + 23.1);
    float da = mod(ang - a0 + 6.2831, 6.2831);
    if (da > span) continue;
    float d = abs(length(pc) - r);
    float w = 0.012 + 0.025 * sdH2(cell + fk + 29.3);
    float taper = smoothstep(0.0, 0.25, da / span) * smoothstep(1.0, 0.75, da / span);
    m = max(m, sdLine(d, w) * taper * (0.3 + 0.7 * sdH2(cell + fk + 31.7)));
  }
  return m;
}
// Poeira: grãos de 0,04 a 0,14 mm, esparsos (células de 1,6 mm).
float sdDustAt(vec2 p, float density) {
  vec2 c = floor(p / 1.6);
  float m = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 cell = c + vec2(i, j);
    if (sdH2(cell * 3.17) > density) continue;
    vec2 ctr = (cell + vec2(sdH2(cell + 41.3), sdH2(cell + 43.9))) * 1.6;
    float r = 0.015 + 0.03 * sdH2(cell + 47.1);
    m = max(m, sdLine(length(p - ctr), r));
  }
  return m;
}
`;

// Espelhos planos (até 3): textura renderizada pela câmera espelhada no plano da face; entra
// no lugar do ambiente no reflexo do verniz, onde a face é exatamente aquele plano. A casca de
// laranja entorta o reflexo e riscos, manchas e desgaste o desfocam.
const mirrorUniforms = (i) => /* glsl */ `
uniform sampler2D uMirTex${i};
uniform mat4 uMirMat${i};
uniform vec3 uMirN${i};
uniform float uMirD${i}, uMirOn${i};`;
const mirrorSample = (i) => /* glsl */ `
if (uMirOn${i} > 0.0) {
  float mk = smoothstep(0.985, 0.998, dot(sdN, uMirN${i})) * (1.0 - smoothstep(0.004, 0.01, abs(dot(vWPos, uMirN${i}) - uMirD${i})));
  if (mk > 0.0) {
    vec4 rp = uMirMat${i} * vec4(vWPos, 1.0);
    vec4 rc = textureLod(uMirTex${i}, rp.xy / rp.w + mPert, mLod);
    float mw = mk * uMirOn${i};
    clearcoatRadiance = clearcoatRadiance * (1.0 - rc.a * mw) + rc.rgb * mw;
  }
}`;

const DETAIL_MASKS = /* glsl */ `
vec3 sdMM = vWP * uUnit;
vec3 sdN = normalize(vWN);
vec3 sdA = abs(sdN);
vec2 sdP = sdA.x > sdA.y && sdA.x > sdA.z ? sdMM.zy : (sdA.y > sdA.z ? sdMM.xz : sdMM.xy);
sdScr = max(sdScratches(sdP) * uScratchK, sdSwirls(sdP) * uSwirlK * 0.8);
// Verniz gasto: só nos arredondamentos (normal "diagonal") e em manchas, mais junto à base.
float sdEdge = smoothstep(0.06, 0.24, 1.0 - max(max(sdA.x, sdA.y), sdA.z));
sdWear = sdEdge * smoothstep(0.42, 0.72, sdFbm(sdMM / 16.0));
sdWear = max(sdWear, (1.0 - smoothstep(1.5, 12.0, sdMM.y)) * (1.0 - sdA.y) * smoothstep(0.4, 0.8, sdFbm(sdMM / 5.0)) * 0.7);
sdWear *= uWearK;
// Poeira: bem mais nas faces de cima do que nas laterais.
sdDust = sdDustAt(sdP, 0.002 + 0.01 * smoothstep(0.5, 0.95, sdN.y)) * uDustK;
// Manchas de manuseio: o verniz perde um pouco do brilho em áreas largas e suaves.
sdSmudge = smoothstep(0.52, 0.78, sdFbm(sdMM / 38.0 + 7.0)) * uSmudgeK;
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb + vec3(0.03, 0.031, 0.034), sdWear);
diffuseColor.rgb += vec3(0.016) * sdScr;
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.155, 0.15), sdDust * 0.7);
// Casca de laranja (5 mm) e ondulação larga de peça injetada (70 mm), tangentes à superfície.
sdPert = sdGrad(sdMM / 5.0, sdN) * 0.0035 * uPeelK + sdGrad(sdMM / 70.0 + 3.0, sdN) * 0.0045 * uWaveK;
`;

/**
 * Liga o acabamento num material. `wear`, `scratch`, `peel`, `wave`, `swirl`, `dust` e
 * `smudge` são intensidades (0 desliga); `unit` = milímetros por unidade de cena.
 */
export function surfaceDetail(
  mat,
  {
    wear = 1,
    scratch = 1,
    peel = 1,
    wave = 0,
    swirl = 0,
    dust = 0,
    smudge = 0,
    coatDirect = 1,
    unit = 1,
  } = {},
) {
  mat.onBeforeCompile = (sh) => {
    const mirrors = mat.userData.mirrors || [];
    mirrors.forEach((m, i) =>
      Object.assign(sh.uniforms, {
        [`uMirTex${i}`]: m.tex,
        [`uMirMat${i}`]: m.mat,
        [`uMirN${i}`]: m.n,
        [`uMirD${i}`]: m.d,
        [`uMirOn${i}`]: m.on,
      }),
    );
    Object.assign(sh.uniforms, {
      uWearK: { value: wear },
      uScratchK: { value: scratch },
      uPeelK: { value: peel },
      uWaveK: { value: wave },
      uSwirlK: { value: swirl },
      uDustK: { value: dust },
      uSmudgeK: { value: smudge },
      uCoatDirect: { value: coatDirect },
      uUnit: { value: unit },
    });
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vWP;\nvarying vec3 vWN;\nvarying vec3 vWPos;',
      )
      .replace(
        '#include <begin_vertex>',
        // Sem a translação: a textura acompanha a peça quando ela sobe na explodida.
        `#include <begin_vertex>
vWP = mat3(modelMatrix) * transformed;
vWN = normalize(mat3(modelMatrix) * objectNormal);
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n${DETAIL_GLSL}\nvarying vec3 vWPos;${mirrors.map((m, i) => mirrorUniforms(i)).join('')}`,
      )
      .replace('#include <color_fragment>', `#include <color_fragment>\n${DETAIL_MASKS}`)
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor + sdWear * 0.35 + sdScr * 0.3 + sdDust * 0.7 + sdSmudge * 0.06 + (sdFbm(sdMM / 3.0) - 0.5) * 0.04, 0.02, 1.0);`,
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
material.clearcoat *= (1.0 - sdWear * 0.85) * (1.0 - sdDust * 0.6);
material.clearcoatRoughness = clamp(material.clearcoatRoughness + sdScr * 0.45 + sdWear * 0.4 + sdSmudge * 0.045, 0.0, 1.0);
#endif`,
      )
      .replace(
        '#include <aomap_fragment>',
        // O verniz espelhado reflete só o estúdio desenhado no ambiente: o reflexo direto das
        // luzes (retângulo chapado da softbox, ponto do sol) é o que parece computação gráfica.
        `#include <aomap_fragment>
#ifdef USE_CLEARCOAT
clearcoatSpecularDirect *= uCoatDirect;
#endif`,
      )
      .replace(
        '#include <lights_fragment_maps>',
        `#include <lights_fragment_maps>
#if defined(USE_CLEARCOAT) && defined(RE_IndirectSpecular)
{
  vec2 mPert = (viewMatrix * vec4(sdPert, 0.0)).xy * 0.25;
  float mLod = 0.35 + sdScr * 3.0 + sdSmudge * 1.2 + sdWear * 4.0 + sdDust * 3.0;
  ${mirrors.map((m, i) => mirrorSample(i)).join('')}
}
#endif`,
      );
  };
  mat.customProgramCacheKey = () =>
    `surface-detail-${wear}-${scratch}-${peel}-${wave}-${swirl}-${dust}-${smudge}-${coatDirect}-${unit}-${mat.userData.mirrors?.length || 0}`;
  mat.needsUpdate = true;
  return mat;
}

/** Intensidades por material do modelo da E-LÍTIO PRO (nome do material no GLB). */
export const ELITIO_PRO_DETAIL = [
  [
    /^Caixa black piano$/,
    { wear: 0.15, scratch: 0.4, peel: 1, wave: 1, swirl: 0.3, dust: 1, smudge: 1, coatDirect: 0 },
  ],
  [/^Pegador$/, { wear: 0.6, scratch: 1, peel: 0.5, wave: 0.6, dust: 0.6, smudge: 1 }],
  [/^Display face$/, { wear: 0, scratch: 0.5, peel: 0.6, swirl: 0.6, dust: 0.7, smudge: 0.6, coatDirect: 0 }],
  [/^Adesivo /, { wear: 0, scratch: 0.6, peel: 0.6, dust: 0.5 }],
];

/**
 * Faces espelhadas da E-LÍTIO PRO: o topo da tampa (bornes, display, adesivos) e as duas
 * laterais dos pegadores. `layer` = grupo da vista explodida; o plano é o maior plano do
 * material voltado para `dir`.
 */
export const ELITIO_PRO_MIRRORS = [
  { layer: 'lid', material: /^Caixa black piano$/, dir: [0, 1, 0] },
  { layer: 'body', material: /^Caixa black piano$/, dir: [1, 0, 0] },
  { layer: 'body', material: /^Caixa black piano$/, dir: [-1, 0, 0] },
];

/**
 * Ajustes de material da E-LÍTIO PRO no filme (estúdio escuro): black piano brilhante, um
 * pouco acima do preto absoluto para o corpo não sumir no fundo, com verniz espelhado (o que
 * desenha a forma são os reflexos do estúdio).
 */
export const ELITIO_PRO_LOOK = [
  [
    /^Caixa black piano$/,
    {
      color: 0x0b0b0c,
      roughness: 0.5,
      specularIntensity: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 3,
    },
  ],
  [/^Pegador$/, { color: 0x1b1b1d, roughness: 0.3 }],
  [/^Display face$/, { color: 0x0b0b0c, specularIntensity: 0, clearcoatRoughness: 0.03, envMapIntensity: 3 }],
  // Alumínio das células: o estúdio de rebatedores grandes estoura o metal liso; menos
  // ambiente e um pouco mais de brilho para o degradê do reflexo aparecer.
  [/^Célula alumínio$/, { roughness: 0.24, envMapIntensity: 0.42 }],
];
