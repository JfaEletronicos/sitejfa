import { Fragment } from 'react';
import { t, IS_EXPORT } from '../../i18n';
import { exportWhatsappUrl } from '../../data/exportContact';

/** Hero com vídeo de fundo, headline animada e CTAs. */
export default function Hero() {
  return (
    <>
      <div className="scene-side scene-left" id="sceneLeft" aria-hidden="true" />
      <div className="scene-side scene-right" id="sceneRight" aria-hidden="true" />
      <div className="hero-pin-space" id="heroPinSpace">
        <div className="hero-shell" id="heroShell" data-theme-keep>
          {/* MP4 (H.264) para quase todos; WebM (VP9) para navegadores sem H.264. */}
          <video
            className="hero-bg-video"
            id="heroBgVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            poster="/media/hero-bateria-poster.webp"
          >
            <source src="/media/hero-bateria.mp4" type='video/mp4; codecs="avc1.640028"' />
            <source src="/media/hero-bateria.webm" type='video/webm; codecs="vp9"' />
          </video>
          <div className="hero-vignette" id="heroVignette" aria-hidden="true" />
          <div className="jfa-header-spacer" id="headerSpacer" aria-hidden="true" />
          <section className="hero" id="heroSection">
            <span className="jfa-anchor" id="home" aria-hidden="true" />
            <div className="hero-inner" id="heroInner">
              <div className="hero-copy" id="heroCopy">
                <h1 className="hero-title">
                  {t('hero.lines').map((line, li) => (
                    <Fragment key={li}>
                      {li > 0 ? ' ' : null}
                      <span className="line">
                        {line.map((w, wi) => (
                          <Fragment key={wi}>
                            {wi > 0 ? ' ' : null}
                            <span className="word">{w.startsWith('*') ? <em>{w.slice(1, -1)}</em> : w}</span>
                          </Fragment>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </h1>
                <p className="hero-sub" id="heroSub" dangerouslySetInnerHTML={{ __html: t('hero.sub') }} />
                <div className="hero-cta-row" id="heroCtaRow">
                  <a href="#solucoes" className="hero-cta hero-cta-primary" data-open-categories>
                    {t('hero.ctaProducts')}
                  </a>{' '}
                  <a href="#manuais" className="hero-cta">
                    {t('hero.ctaManual')}
                  </a>{' '}
                  <a
                    href={IS_EXPORT ? exportWhatsappUrl() : '#loja'}
                    className="hero-cta hero-cta-tertiary"
                    {...(IS_EXPORT ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {t('hero.ctaBuy')}{' '}
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h13M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <div className="hero-tail" id="heroTail" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
