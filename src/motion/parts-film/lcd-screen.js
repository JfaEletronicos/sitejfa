/**
 * Tela de LCD acesa, desenhada no shader (nenhuma imagem): fundo azul do display, dígitos de
 * sete segmentos com os segmentos apagados levemente visíveis (como num LCD real), barra de
 * status e indicador de carga. A tela emite luz; o vidro continua refletindo o estúdio.
 *
 * A posição na tela vem da posição no mundo (sem UV): `rect` = retângulo da tela no modelo,
 * em milímetros (x de `x0` a `x1`; a "frente" do texto em `zFront` e o topo em `zBack`), e
 * `unit` = milímetros por unidade de cena.
 */

const LCD_GLSL = /* glsl */ `
uniform vec4 uLcdRect;
uniform float uLcdUnit, uLcdGlow;
varying vec3 vLcdW;
float lcdSeg(vec2 p, vec2 a, vec2 b, float t) {
  vec2 pa = p - a, ba = b - a;
  float k = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float d = length(pa - ba * k) - t * 0.5;
  float fw = max(fwidth(d), 1e-4);
  return 1.0 - smoothstep(-fw, fw, d);
}
// Dígito (ou letra) de sete segmentos numa célula w × h com traço t; bits a..g = 1..64.
vec2 lcdDigit(vec2 p, float w, float h, float t, int mask) {
  float g = t * 0.42;
  float x0 = t * 0.5, x1 = w - t * 0.5, y0 = t * 0.5, y1 = h - t * 0.5, ym = h * 0.5;
  float s[7];
  s[0] = lcdSeg(p, vec2(x0 + g, y1), vec2(x1 - g, y1), t);
  s[1] = lcdSeg(p, vec2(x1, ym + g), vec2(x1, y1 - g), t);
  s[2] = lcdSeg(p, vec2(x1, y0 + g), vec2(x1, ym - g), t);
  s[3] = lcdSeg(p, vec2(x0 + g, y0), vec2(x1 - g, y0), t);
  s[4] = lcdSeg(p, vec2(x0, y0 + g), vec2(x0, ym - g), t);
  s[5] = lcdSeg(p, vec2(x0, ym + g), vec2(x0, y1 - g), t);
  s[6] = lcdSeg(p, vec2(x0 + g, ym), vec2(x1 - g, ym), t);
  float on = 0.0, ghost = 0.0;
  for (int i = 0; i < 7; i++) {
    ghost = max(ghost, s[i]);
    if (((mask >> i) & 1) == 1) on = max(on, s[i]);
  }
  return vec2(on, ghost);
}
float lcdBox(vec2 p, vec2 a, vec2 b) {
  vec2 c = (a + b) * 0.5, hs = (b - a) * 0.5;
  vec2 q = abs(p - c) - hs;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  float fw = max(fwidth(d), 1e-4);
  return 1.0 - smoothstep(-fw, fw, d);
}
vec3 lcdScreen(vec2 p) {
  // Fundo azul (mais claro em cima, como a luz de fundo do display).
  vec3 col = mix(vec3(0.020, 0.016, 0.26), vec3(0.045, 0.040, 0.62), smoothstep(0.0, 22.0, p.y));
  vec3 ink = vec3(0.92, 0.94, 1.0);
  float on = 0.0, ghost = 0.0;
  // Linha de status no alto.
  on = max(on, lcdBox(p, vec2(2.0, 19.7), vec2(27.0, 20.1)));
  // "12.8" grande + "V"; "155" + "A".
  int big1[4] = int[4](6, 91, 127, 0);
  float w = 4.1, h = 7.6, t = 0.95;
  for (int i = 0; i < 3; i++) {
    vec2 r = lcdDigit(p - vec2(1.8 + float(i) * 5.2 + (i == 2 ? 0.9 : 0.0), 10.6), w, h, t, big1[i]);
    on = max(on, r.x); ghost = max(ghost, r.y);
  }
  on = max(on, 1.0 - smoothstep(0.42, 0.58, length(p - vec2(12.1, 11.05))));
  // V (duas hastes) depois do número.
  on = max(on, lcdSeg(p, vec2(19.6, 14.6), vec2(20.9, 10.9), 0.75));
  on = max(on, lcdSeg(p, vec2(20.9, 10.9), vec2(22.2, 14.6), 0.75));
  int big2[3] = int[3](6, 109, 109);
  for (int i = 0; i < 3; i++) {
    vec2 r = lcdDigit(p - vec2(1.8 + float(i) * 5.2, 1.4), w, h, t, big2[i]);
    on = max(on, r.x); ghost = max(ghost, r.y);
  }
  vec2 ra = lcdDigit(p - vec2(17.6, 1.4), 2.6, 4.0, 0.65, 119);
  on = max(on, ra.x); ghost = max(ghost, ra.y);
  // Carga: contorno da bateria com cinco barras, e linhas pequenas de informação.
  float outline = lcdBox(p, vec2(28.6, 11.2), vec2(39.6, 17.4)) - lcdBox(p, vec2(29.1, 11.7), vec2(39.1, 16.9));
  on = max(on, max(outline, lcdBox(p, vec2(39.6, 13.1), vec2(40.3, 15.5))));
  for (int i = 0; i < 5; i++) {
    float x = 29.6 + float(i) * 1.9;
    on = max(on, lcdBox(p, vec2(x, 12.2), vec2(x + 1.4, 16.4)));
  }
  for (int i = 0; i < 3; i++) {
    float y = 2.2 + float(i) * 2.6;
    on = max(on, lcdBox(p, vec2(28.6, y), vec2(28.6 + (i == 1 ? 7.5 : 10.5), y + 0.7)));
  }
  col += ink * 0.06 * ghost;
  return mix(col, ink, on);
}
`;

/**
 * Liga a tela acesa num material (MeshStandard/MeshPhysical). `rect` em mm:
 * { x0, x1, zFront, zBack }; `glow` = intensidade da luz da tela.
 */
export function lcdScreen(mat, { rect, unit = 1, glow = 1.6 }) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uLcdRect: { value: [rect.x0, rect.x1, rect.zFront, rect.zBack] },
      uLcdUnit: { value: unit },
      uLcdGlow: { value: glow },
    });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLcdW;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvLcdW = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n${LCD_GLSL}`)
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
vec3 lcdMM = vLcdW * uLcdUnit;
vec2 lcdP = vec2(lcdMM.x - uLcdRect.x, uLcdRect.z - lcdMM.z);
totalEmissiveRadiance = lcdScreen(lcdP) * uLcdGlow;
diffuseColor.rgb *= 0.15;`,
      );
  };
  // uLcdRect como vec4 (x0, x1, zFront, zBack): .x = x0, .z = zFront.
  mat.customProgramCacheKey = () => 'lcd-screen';
  mat.needsUpdate = true;
  return mat;
}

/** Tela do display da E-LÍTIO PRO (retângulo da tela no CAD, em mm). */
export const ELITIO_PRO_SCREENS = [
  [/^Display tela/, { rect: { x0: -34, x1: 8.4, zFront: -28.5, zBack: -50.6 }, glow: 1.6 }],
];
