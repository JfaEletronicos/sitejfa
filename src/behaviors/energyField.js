/**
 * Campo de pontos de energia animado em canvas nas seções de Produtos, Frentes, Manuais, Representantes e Oferta.
 * @param {import('./context').BehaviorContext} ctx
 */
function initEnergyField(ctx) {
  const { root, on, cleanups } = ctx;
  const productsSection = root.getElementById('productsSection');
  (() => {
    const canvasProducts = root.getElementById('productsEnergyCanvas');
    const canvasReps = root.getElementById('repsEnergyCanvas');
    const canvasManuals = root.getElementById('manualsEnergyCanvas');
    const canvasFronts = root.getElementById('frontsEnergyCanvas');
    const repsSectionEl = root.getElementById('repsSection');
    const manualsSectionEl = root.getElementById('manualsSection');
    const canvasCampaign = root.getElementById('campaignEnergyCanvas');
    const campaignSectionEl = root.getElementById('campaignSection');
    const canvasPage = root.getElementById('pageEnergyCanvas');
    if (!canvasProducts && !canvasReps && !canvasManuals && !canvasFronts && !canvasCampaign && !canvasPage)
      return;
    const clamp01f = (v) => Math.max(0, Math.min(1, v));
    const mulberry32f = (seed) => () => {
      seed |= 0;
      seed = (seed + 1831565813) | 0;
      let tt = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      tt = (tt + Math.imul(tt ^ (tt >>> 7), 61 | tt)) ^ tt;
      return ((tt ^ (tt >>> 14)) >>> 0) / 4294967296;
    };
    const hash01f = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233 + 4.1414) * 43758.5453;
      return s - Math.floor(s);
    };
    const smoothCurveF = (rng, n, spanRows, lo, hi) => {
      const cn = Math.max(2, Math.ceil((n - 1) / spanRows) + 1);
      const controls = new Array(cn);
      for (let i = 0; i < cn; i++) controls[i] = lo + rng() * (hi - lo);
      const values = new Array(n);
      for (let r = 0; r < n; r++) {
        const pos = (n > 1 ? r / (n - 1) : 0) * (cn - 1);
        const i0 = Math.floor(pos),
          i1 = Math.min(i0 + 1, cn - 1);
        const frac = pos - i0,
          s = frac * frac * (3 - 2 * frac);
        values[r] = controls[i0] + (controls[i1] - controls[i0]) * s;
      }
      return values;
    };
    const FC_BASE = { r: 8, g: 120, b: 168 };
    const FC_MID = { r: 0, g: 159, b: 227 };
    const FC_HOT = { r: 105, g: 223, b: 255 };
    const lerpChanF = (a, b, tv) => a + (b - a) * tv;
    const colorAtF = (level) => {
      const tv = clamp01f(level);
      const from = tv < 0.5 ? FC_BASE : FC_MID,
        to = tv < 0.5 ? FC_MID : FC_HOT,
        lt = tv < 0.5 ? tv * 2 : (tv - 0.5) * 2;
      return (
        Math.round(lerpChanF(from.r, to.r, lt)) +
        ',' +
        Math.round(lerpChanF(from.g, to.g, lt)) +
        ',' +
        Math.round(lerpChanF(from.b, to.b, lt))
      );
    };
    const FIELD_FLOW_PERIOD_S = 90;
    const FIELD_ROWS = 28,
      FIELD_COLS = 18;
    const createSectionField = (canvas, container, cfg) => {
      if (!canvas || !container) return null;
      const ctx2 = canvas.getContext('2d');
      if (!ctx2) return null;
      const rng = mulberry32f(cfg.seed);
      const rp = {
        width: smoothCurveF(rng, FIELD_ROWS, 5, 0.32, 0.9),
        offsetX: smoothCurveF(rng, FIELD_ROWS, 6, -0.1, 0.1),
        spacingMul: smoothCurveF(rng, FIELD_ROWS, 4, 0.78, 1.22),
        amplitude: smoothCurveF(rng, FIELD_ROWS, 5, 0.5, 1.1),
        freqA: smoothCurveF(rng, FIELD_ROWS, 6, 0.5, 1.4),
        freqB: smoothCurveF(rng, FIELD_ROWS, 6, 1.4, 2.8),
        phaseA: smoothCurveF(rng, FIELD_ROWS, 5, 0, Math.PI * 2),
        phaseB: smoothCurveF(rng, FIELD_ROWS, 5, 0, Math.PI * 2),
        ampA: smoothCurveF(rng, FIELD_ROWS, 6, 3, 9),
        ampB: smoothCurveF(rng, FIELD_ROWS, 6, 1, 3),
        ampNoise: smoothCurveF(rng, FIELD_ROWS, 7, 0.5, 2.5),
        noiseSeed: smoothCurveF(rng, FIELD_ROWS, 5, 0, Math.PI * 2),
        curveBias: smoothCurveF(rng, FIELD_ROWS, 6, -1, 1),
        edgeFalloff: smoothCurveF(rng, FIELD_ROWS, 6, 0.1, 0.18),
        morphPeriodW: smoothCurveF(rng, FIELD_ROWS, 5, 34, 58),
        morphPeriodX: smoothCurveF(rng, FIELD_ROWS, 5, 36, 60),
        morphPeriodA: smoothCurveF(rng, FIELD_ROWS, 5, 32, 54),
        morphPhase: smoothCurveF(rng, FIELD_ROWS, 4, 0, Math.PI * 2),
      };
      let W = 0,
        H = 0,
        dpr = 1,
        totalH = 1;
      let points = [];
      let ambient = [];
      let avoidRects = [];
      let pulses = [];
      let nextPulseAt = null;
      let mouseX = 0,
        mouseY = 0,
        mouseActive = false;
      const computeAvoid = (rect) => {
        avoidRects = (cfg.avoidSelectors || [])
          .map((sel) => {
            const el = container.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.left - rect.left, y: r.top - rect.top, w: r.width, h: r.height };
          })
          .filter(Boolean);
      };
      const avoidFalloff = (x, y) => {
        let factor = 1;
        for (let i = 0; i < avoidRects.length; i++) {
          const r = avoidRects[i];
          const pad = Math.min(r.w, r.h) * 0.16 + 22;
          const dx = Math.max(r.x - pad - x, 0, x - (r.x + r.w + pad));
          const dy = Math.max(r.y - pad - y, 0, y - (r.y + r.h + pad));
          if (dx === 0 && dy === 0) return 0;
          const d = Math.hypot(dx, dy);
          if (d < pad) factor = Math.min(factor, clamp01f(d / pad));
        }
        return factor;
      };
      const buildPoints = () => {
        const rowSpacingBase = Math.max(1, H) / (FIELD_ROWS - 1);
        const rowY = new Array(FIELD_ROWS);
        let cum = 0;
        for (let r = 0; r < FIELD_ROWS; r++) {
          rowY[r] = cum;
          cum += rowSpacingBase * rp.spacingMul[r];
        }
        totalH = Math.max(1, cum);
        const pts = [];
        const minPoints = Math.max(3, Math.round(FIELD_COLS * 0.5));
        const maxPoints = Math.round(FIELD_COLS * 1.15) + 1;
        for (let r = 0; r < FIELD_ROWS; r++) {
          const widthFrac = rp.width[r];
          const rowSpan = W * widthFrac;
          const rowCenterX = W / 2 + rp.offsetX[r] * W;
          const rowLeft = rowCenterX - rowSpan / 2;
          const countFactor = 0.62 + ((widthFrac - 0.32) / 0.58) * 0.5;
          const count = Math.max(
            minPoints,
            Math.min(maxPoints, Math.round(FIELD_COLS * countFactor * cfg.density)),
          );
          if (count < 2) continue;
          const us = new Array(count);
          for (let c = 0; c < count; c++) {
            const u0 = c / (count - 1);
            let u = u0;
            if (c > 0 && c < count - 1) {
              const amt = 0.015 + hash01f(r * 3.1 + cfg.seed * 1e-4 + 1, c * 7.3 + 2) * 0.02;
              const sign = hash01f(r * 5.2 + 2, c * 11.7 + cfg.seed * 1e-4 + 3) * 2 - 1;
              u = clamp01f(u0 + sign * amt);
            }
            us[c] = u;
          }
          for (let c = 0; c < count; c++) {
            const u = us[c];
            const noiseVal =
              Math.sin(u * 17.13 + rp.noiseSeed[r]) * Math.sin(u * 9.7 + rp.noiseSeed[r] * 1.7);
            const curveRaw =
              Math.sin(u * rp.freqA[r] * Math.PI * 2 + rp.phaseA[r]) * rp.ampA[r] +
              Math.sin(u * rp.freqB[r] * Math.PI * 2 + rp.phaseB[r]) * rp.ampB[r] +
              noiseVal * rp.ampNoise[r];
            const skew = rp.curveBias[r] * (u - 0.5) * Math.abs(u - 0.5) * W * 0.08;
            const edgeDist = Math.min(u, 1 - u);
            const rowTaper = clamp01f(edgeDist / rp.edgeFalloff[r]);
            pts.push({
              row: r,
              uNorm: u,
              baseX: rowLeft + u * rowSpan + curveRaw + skew,
              baseYAbs: rowY[r],
              rowCenterX,
              colPhase: (r * 0.7 + c * 1.31) % (Math.PI * 2),
              noiseSeedA: (r * 11.3 + c * 7.1) % (Math.PI * 2),
              noiseSeedB: (r * 17.7 + c * 5.3) % (Math.PI * 2),
              rowVariation: 0.6 + (((r * 7 + c * 3) % 10) / 10) * 0.4,
              rowAmplitude: rp.amplitude[r],
              rowTaperFactor: rowTaper,
              morphPeriodW: rp.morphPeriodW[r],
              morphPeriodX: rp.morphPeriodX[r],
              morphPeriodA: rp.morphPeriodA[r],
              morphPhase: rp.morphPhase[r],
              mox: 0,
              moy: 0,
            });
          }
        }
        points = pts;
      };
      const buildAmbient = () => {
        const arng = mulberry32f(cfg.seed ^ 2654435769);
        ambient = new Array(cfg.ambientCount).fill(0).map(() => ({
          x: arng() * W,
          y: arng() * H,
          cycle: 7 + arng() * 6,
          phase: arng() * Math.PI * 2,
          drift: 6 + arng() * 8,
          driftPhase: arng() * Math.PI * 2,
          radius: 1 + arng() * 0.8,
        }));
      };
      const resize = () => {
        const rect = container.getBoundingClientRect();
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5);
        canvas.width = Math.max(1, Math.round(W * dpr));
        canvas.height = Math.max(1, Math.round(H * dpr));
        ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
        computeAvoid(rect);
        buildPoints();
        buildAmbient();
      };
      const onMove = (e) => {
        const r = container.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
        mouseActive = true;
      };
      const onLeave = () => {
        mouseActive = false;
      };
      if (cfg.allowMouse) {
        container.addEventListener('mousemove', onMove, { passive: true });
        container.addEventListener('mouseleave', onLeave, { passive: true });
      }
      const MOUSE_RADIUS = 170,
        MOUSE_MAX_PX = 7,
        MOUSE_LERP = 0.07;
      const spawnPulse = () => {
        pulses.push({
          rowCenter: Math.random() * FIELD_ROWS,
          uCenter: Math.random(),
          rowRadius: 3.5 + Math.random() * 3,
          uRadius: 0.15 + Math.random() * 0.13,
          startTime: performance.now(),
          duration: 2600 + Math.random() * 1600,
        });
        if (pulses.length > cfg.maxPulses) pulses.shift();
      };
      const draw = (reduced) => {
        if (!W || !H) return;
        ctx2.clearRect(0, 0, W, H);
        if (!points.length && !ambient.length) return;
        const nowMs = performance.now();
        const t = nowMs / 1e3;
        const flowOffset = reduced ? 0 : (t * (totalH / FIELD_FLOW_PERIOD_S)) % totalH;
        if (!reduced) {
          pulses = pulses.filter((p) => nowMs - p.startTime < p.duration);
          if (nextPulseAt === null) nextPulseAt = nowMs + 300 + Math.random() * 700;
          else if (nowMs >= nextPulseAt && pulses.length < cfg.maxPulses) {
            spawnPulse();
            nextPulseAt = nowMs + 1500 / cfg.pulseRate + Math.random() * (1300 / cfg.pulseRate);
          }
        }
        const k1 = (Math.PI * 2 * 5) / totalH,
          k2 = (Math.PI * 2 * 8) / totalH;
        const k3 = (Math.PI * 2 * 13) / totalH,
          k4 = (Math.PI * 2 * 21) / totalH;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          let wrapped = (pt.baseYAbs - flowOffset) % totalH;
          if (wrapped < 0) wrapped += totalH;
          const y0 = wrapped;
          const largeWave = !reduced
            ? Math.sin(wrapped * k1 + pt.colPhase + t * 0.045) * 6 * cfg.waveIntensity
            : 0;
          const mediumWave = !reduced
            ? Math.sin(wrapped * k2 - pt.colPhase * 0.6 + t * 0.03) * 3 * cfg.waveIntensity
            : 0;
          const fineNoise = !reduced
            ? Math.sin(wrapped * k3 + pt.noiseSeedA) *
              Math.sin(wrapped * k4 * 0.5 + pt.noiseSeedB + t * 0.02) *
              4 *
              cfg.waveIntensity
            : 0;
          const morphW = !reduced
            ? 1 + Math.sin((t * Math.PI * 2) / pt.morphPeriodW + pt.morphPhase) * 0.03
            : 1;
          const morphX = !reduced
            ? Math.sin((t * Math.PI * 2) / pt.morphPeriodX + pt.morphPhase * 1.3) * 5
            : 0;
          const morphA = !reduced
            ? 1 + Math.sin((t * Math.PI * 2) / pt.morphPeriodA + pt.morphPhase * 0.7) * 0.08
            : 1;
          const dx = !reduced
            ? (largeWave + mediumWave + fineNoise) * pt.rowAmplitude * morphA +
              (pt.baseX - pt.rowCenterX) * (morphW - 1) +
              morphX
            : Math.sin(pt.colPhase) * 3 * pt.rowAmplitude;
          const dy = !reduced ? Math.sin(wrapped * k1 * 0.5 + pt.colPhase) * 3 * pt.rowAmplitude : 0;
          let x = pt.baseX + dx,
            y = y0 + dy;
          let targetMox = 0,
            targetMoy = 0;
          if (!reduced && mouseActive) {
            const ddx = x - mouseX,
              ddy = y - mouseY;
            const dist = Math.hypot(ddx, ddy);
            if (dist < MOUSE_RADIUS && dist > 1e-3) {
              const push = Math.exp(-(dist * dist) / (MOUSE_RADIUS * MOUSE_RADIUS));
              targetMox = (ddx / dist) * push * MOUSE_MAX_PX;
              targetMoy = (ddy / dist) * push * MOUSE_MAX_PX;
            }
          }
          pt.mox += (targetMox - pt.mox) * MOUSE_LERP;
          pt.moy += (targetMoy - pt.moy) * MOUSE_LERP;
          x += pt.mox;
          y += pt.moy;
          const avoid = avoidFalloff(x, y);
          if (avoid <= 0.02) continue;
          let pulseBoost = 0;
          if (!reduced) {
            for (let p = 0; p < pulses.length; p++) {
              const pu = pulses[p];
              const rowD = Math.abs(pt.row - pu.rowCenter),
                uD = Math.abs(pt.uNorm - pu.uCenter);
              if (rowD > pu.rowRadius || uD > pu.uRadius) continue;
              let spatial = 1 - Math.hypot(rowD / pu.rowRadius, uD / pu.uRadius);
              if (spatial <= 0) continue;
              spatial = spatial * spatial * (3 - 2 * spatial);
              const tt = clamp01f((nowMs - pu.startTime) / pu.duration);
              const envelope = tt < 0.25 ? tt / 0.25 : Math.max(0, 1 - (tt - 0.25) / 0.75);
              pulseBoost = Math.max(pulseBoost, spatial * envelope);
            }
          }
          const mouseLight =
            !reduced && mouseActive
              ? clamp01f(1 - Math.hypot(x - mouseX, y - mouseY) / MOUSE_RADIUS) * 0.08
              : 0;
          const xFalloff = pt.rowTaperFactor * avoid;
          const energyLevel = clamp01f(pulseBoost * 1.6 + mouseLight * 0.6) * xFalloff;
          const base = (0.3 + 0.16 * pt.rowVariation) * xFalloff * cfg.opacity;
          const alpha = clamp01f(Math.min(0.82, base + pulseBoost * cfg.glowStrength + mouseLight));
          if (alpha <= 4e-3) continue;
          const energyForSize = clamp01f(pulseBoost * 1.2 + mouseLight);
          const baseRadius = 0.95 + 0.3 * ((pt.rowVariation - 0.6) / 0.4);
          const radius = Math.min(1.9, baseRadius + energyForSize * 0.5) * cfg.pointScale;
          ctx2.beginPath();
          ctx2.fillStyle = 'rgba(' + colorAtF(energyLevel) + ',' + alpha.toFixed(3) + ')';
          ctx2.arc(x, y, radius, 0, Math.PI * 2);
          ctx2.fill();
        }
        for (let i = 0; i < ambient.length; i++) {
          const a = ambient[i];
          const cyc = reduced ? 0.55 : clamp01f(Math.sin((t / a.cycle) * Math.PI * 2 + a.phase) * 0.5 + 0.5);
          const ax = reduced ? a.x : a.x + Math.sin((t * (Math.PI * 2)) / a.drift + a.driftPhase) * 5;
          const ay = reduced ? a.y : a.y + Math.cos((t * (Math.PI * 2)) / (a.drift * 1.3) + a.driftPhase) * 5;
          const av = avoidFalloff(ax, ay);
          const alpha = cyc * 0.32 * av * cfg.opacity;
          if (alpha <= 0.01) continue;
          ctx2.beginPath();
          ctx2.fillStyle = 'rgba(' + colorAtF(0.12) + ',' + alpha.toFixed(3) + ')';
          ctx2.arc(ax, ay, a.radius, 0, Math.PI * 2);
          ctx2.fill();
        }
      };
      return {
        resize,
        draw,
        destroy() {
          container.removeEventListener('mousemove', onMove);
          container.removeEventListener('mouseleave', onLeave);
        },
      };
    };
    const allowMouse = !ctx.reduceMotion && ctx.fineMQ.matches;
    const UNIFIED_FIELD_CFG = {
      density: 1.05,
      opacity: 0.72,
      glowStrength: 0.5,
      waveIntensity: 1.05,
      maxPulses: 5,
      pulseRate: 1.15,
      ambientCount: 5,
      pointScale: 1.05,
      allowMouse,
    };
    const SECTION_FIELDS = [
      canvasProducts && productsSection
        ? {
            canvas: canvasProducts,
            container: productsSection,
            cfg: {
              seed: 2709274401,
              ...UNIFIED_FIELD_CFG,
              avoidSelectors: ['.products-head'],
            },
          }
        : null,
      canvasReps && repsSectionEl
        ? {
            canvas: canvasReps,
            container: repsSectionEl,
            cfg: {
              seed: 2996657715,
              ...UNIFIED_FIELD_CFG,
              avoidSelectors: ['.reps-stage', '.reps-col2-lower'],
            },
          }
        : null,
      canvasManuals && manualsSectionEl
        ? {
            canvas: canvasManuals,
            container: manualsSectionEl,
            cfg: {
              seed: 3280629573,
              ...UNIFIED_FIELD_CFG,
              avoidSelectors: [
                '.manuals-search-wrap',
                '.manuals-tabs',
                '.manuals-category-tabs',
                '.manuals-tab-panel',
                '.manuals-tab-prompt',
                '.manuals-results-wrap',
              ],
            },
          }
        : null,
      // SECTION_2.MESH_POSITION: intensidade "média/sutil" pedida --
      // opacity/glowStrength reduzidos (~55%/60% do valor unificado das
      // outras 3 seções) e menos pontos ambiente; density/waveIntensity/
      // pulsos/pointScale/mouse iguais (mesma lógica de animação, só mais
      // discreta -- "atmospheric balance, not a focal point"). container
      // é o próprio canvas (ver JS acima) -- já nasce confinado ao seu
      // retângulo no quadrante superior direito, sem precisar de
      // avoidSelectors (nada de conteúdo importante nessa área vazia).
      canvasFronts
        ? {
            canvas: canvasFronts,
            container: canvasFronts,
            cfg: {
              seed: 3588354631,
              ...UNIFIED_FIELD_CFG,
              opacity: UNIFIED_FIELD_CFG.opacity * 0.55,
              glowStrength: UNIFIED_FIELD_CFG.glowStrength * 0.6,
              ambientCount: 3,
              avoidSelectors: [],
            },
          }
        : null,
      // Carrossel de campanhas: mesma família/densidade unificada das
      // outras. Sem avoidSelectors -- o carrossel (.campaign-carousel,
      // z-index:2) é opaco e cobre o próprio retângulo por cima da malha
      // (canvas z-index:0), então os pontos só aparecem naturalmente nas
      // margens acima/abaixo dele; nenhuma avoid-zone extra necessária.
      canvasCampaign && campaignSectionEl
        ? {
            canvas: canvasCampaign,
            container: campaignSectionEl,
            cfg: {
              seed: 4145761635,
              ...UNIFIED_FIELD_CFG,
              avoidSelectors: [],
            },
          }
        : null,
      // Páginas internas: campo fixo atrás do conteúdo, bem mais discreto.
      // Só existe na tela (e só anima) enquanto uma página interna está aberta.
      canvasPage
        ? {
            canvas: canvasPage,
            container: canvasPage,
            cfg: {
              seed: 1597334677,
              ...UNIFIED_FIELD_CFG,
              opacity: UNIFIED_FIELD_CFG.opacity * 0.5,
              glowStrength: UNIFIED_FIELD_CFG.glowStrength * 0.5,
              maxPulses: 3,
              ambientCount: 4,
              allowMouse: false,
              avoidSelectors: [],
            },
          }
        : null,
    ]
      .filter(Boolean)
      .map((entry) => ({ ...entry, field: createSectionField(entry.canvas, entry.container, entry.cfg) }))
      .filter((entry) => entry.field);
    const manualsFieldEntry = SECTION_FIELDS.find((entry) => entry.canvas === canvasManuals);
    if (manualsFieldEntry) {
      ctx.refreshManualsField = () => {
        manualsFieldEntry.field.resize();
        manualsFieldEntry.field.draw(ctx.reduceMotion);
      };
    }
    if (!SECTION_FIELDS.length) return;
    let sharedRaf = null;
    const activeFields = /* @__PURE__ */ new Set();
    const driverTick = () => {
      sharedRaf = null;
      if (!activeFields.size) return;
      activeFields.forEach((f) => f.field.draw(ctx.reduceMotion));
      if (!ctx.reduceMotion) sharedRaf = requestAnimationFrame(driverTick);
    };
    const ensureDriver = () => {
      if (sharedRaf == null && activeFields.size && !ctx.reduceMotion)
        sharedRaf = requestAnimationFrame(driverTick);
    };
    SECTION_FIELDS.forEach((entry) => {
      const activate = () => {
        entry.field.resize();
        entry.field.draw(ctx.reduceMotion);
        if (!ctx.reduceMotion) {
          activeFields.add(entry);
          ensureDriver();
        }
      };
      const deactivate = () => {
        activeFields.delete(entry);
      };
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) activate();
              else deactivate();
            });
          },
          { rootMargin: '200px 0px' },
        );
        obs.observe(entry.container);
        cleanups.push(() => obs.disconnect());
      } else {
        activate();
      }
    });
    let fieldResizeT = null;
    const onFieldResize = () => {
      clearTimeout(fieldResizeT);
      fieldResizeT = setTimeout(() => {
        SECTION_FIELDS.forEach((entry) => {
          entry.field.resize();
          entry.field.draw(ctx.reduceMotion);
        });
      }, 150);
    };
    on(window, 'resize', onFieldResize);
    cleanups.push(() => clearTimeout(fieldResizeT));
    cleanups.push(() => {
      if (sharedRaf) cancelAnimationFrame(sharedRaf);
      SECTION_FIELDS.forEach((entry) => entry.field.destroy());
    });
  })();
}
export { initEnergyField };
