import {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Trecho real (takes 14–16, 19–27 s): coloque o vídeo em public/footage/real.mp4 e mude para true.
const USE_REAL_FOOTAGE = false;
const REAL_START = 19;
const REAL_END = 27;

const css = `
@font-face { font-family: 'StretchPro'; src: url('${staticFile('fonts/StretchPro.woff')}') format('woff'); }
@font-face { font-family: 'Bebas Neue'; src: url('${staticFile('fonts/bebas-neue-latin-400-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Playfair Display'; font-style: italic; src: url('${staticFile('fonts/playfair-display-latin-400-italic.woff2')}') format('woff2'); }
@font-face { font-family: 'Space Grotesk'; font-weight: 300; src: url('${staticFile('fonts/space-grotesk-latin-300-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Space Grotesk'; font-weight: 500; src: url('${staticFile('fonts/space-grotesk-latin-500-normal.woff2')}') format('woff2'); }
#stage { position: relative; width: 1080px; height: 1920px; background: #000; overflow: hidden; }
#stage canvas { display: block; }
#end { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #000; color: #fff; opacity: 0; font-family: 'StretchPro', sans-serif; }
#end .logo { font-size: 190px; letter-spacing: 0.06em; }
#end .tag { margin-top: 36px; font-family: system-ui, sans-serif; font-weight: 300; font-size: 46px; letter-spacing: 0.08em; color: #cfd8e6; }
#end .tag b { font-weight: 500; color: #4d95ff; }
`;

declare global {
  interface Window {
    __JFA_EMBED?: boolean;
    __film?: {renderAt: (t: number) => void};
  }
}

// A cena (src/film/film.js) é determinística: cada quadro é renderAt(t), t em segundos.
export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [boot] = useState(() => delayRender('carregando a cena 3D'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.__JFA_EMBED = true; // desliga o loop de pré-visualização do film.js
    import('./film/film.js').then(async () => {
      while (!window.__film) await new Promise((r) => setTimeout(r, 30));
      setReady(true);
      continueRender(boot);
    });
  }, [boot]);

  useEffect(() => {
    if (!ready) return;
    const h = delayRender(`quadro ${frame}`);
    window.__film!.renderAt(frame / fps);
    requestAnimationFrame(() => continueRender(h));
  }, [frame, fps, ready]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <style>{css}</style>
      <div id="stage">
        <div id="end">
          <div className="logo">JFA</div>
          <div className="tag">
            Energia que vira <b>som</b>.
          </div>
        </div>
      </div>
      <Sequence from={REAL_START * fps} durationInFrames={(REAL_END - REAL_START) * fps}>
        {USE_REAL_FOOTAGE ? (
          <OffthreadVideo src={staticFile('footage/real.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <AbsoluteFill style={{backgroundColor: '#05070b', color: '#9fb3cc', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui', fontSize: 40, textAlign: 'center', padding: 80}}>
            TAKES 14–16 — FILMAGEM REAL (vertical)
            <br />
            public/footage/real.mp4
          </AbsoluteFill>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
