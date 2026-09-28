import { t } from '../../i18n';

/**
 * "Como usar": texto à esquerda e vídeo vertical (9:16) à direita, com botão
 * para baixar o vídeo. Preenchida por behaviors/howTo.js; sem vídeo cadastrado,
 * mostra o espaço reservado com "Vídeo em breve".
 * @param {{ prefix: string, reveal?: boolean }} props prefixo dos ids (produto/bateria)
 */
export default function HowToSection({ prefix, reveal = false }) {
  return (
    <section
      className="bateria-section howto-section is-visible"
      id={prefix + 'HowTo'}
      {...(reveal ? { 'data-reveal': '' } : {})}
    >
      <div className="bateria-section-inner">
        <div className="howto">
          <div className="howto-copy">
            <span className="bateria-label">{t('howto.label')}</span>
            <h2 className="bateria-block-title">{t('howto.title')}</h2>
            <p className="howto-text" id={prefix + 'HowToText'} />
            <ol className="howto-steps">
              <li>{t('howto.step1')}</li>
              <li>{t('howto.step2')}</li>
              <li>{t('howto.step3')}</li>
            </ol>
            <a className="hero-cta hero-cta-primary howto-download" id={prefix + 'HowToDownload'} download>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t('howto.download')}</span>
            </a>
          </div>
          <div className="howto-media">
            <div className="howto-video" id={prefix + 'HowToVideo'} />
          </div>
        </div>
      </div>
    </section>
  );
}
