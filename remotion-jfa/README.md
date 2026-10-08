# JFA — Energia que vira som (Remotion)

Filme de 30 s, vertical 9:16 (1080×1920, 30 fps). A cena 3D é Three.js e fica em
`src/film/` (`film.js`, `spirit.js`, `timeline.js`). O Remotion chama `renderAt(t)` a cada
quadro, então cada quadro é determinístico.

```bash
npm install
npm start          # Remotion Studio (pré-visualização)
npm run render     # out/jfa-energia-que-vira-som.mp4
```

- **0–19 s:** 3D.
- **19–27 s:** filmagem real. Coloque o vídeo em `public/footage/real.mp4` e mude
  `USE_REAL_FOOTAGE` para `true` em `src/Film.tsx`.
- **27–30 s:** encerramento "JFA — Energia que vira som.".

O render usa WebGL. Se o Chromium do Remotion não tiver GPU, troque em
`remotion.config.ts` para `Config.setChromiumOpenGlRenderer('swangle')`.

A direção criativa, a linha do tempo e o briefing da filmagem real estão em `BRIEFING.md`.
Fontes: Bebas Neue, Playfair Display e Space Grotesk (SIL OFL); StretchPro é a fonte da marca.
