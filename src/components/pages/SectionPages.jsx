import StateMapSection from '../shared/StateMapSection';
import { SUPPORT_WHATSAPP_URL } from '../../data/links';

/**
 * Páginas #/representantes e #/manuais: recebem as próprias seções da Home
 * (o roteador move a seção para cá ao abrir a página e devolve ao voltar),
 * então tudo funciona igual, com o mesmo fundo escuro.
 */
function DarkSlotPage({ id, slot }) {
  return (
    <div className="page-view dark-page" id={id} hidden>
      <div className="dark-experience">
        <div className="dark-experience-bg" aria-hidden="true" />
        <div className="dark-page-slot" data-page-slot={slot} />
      </div>
    </div>
  );
}

export function RepresentativesPage() {
  return <DarkSlotPage id="representantesView" slot="reps" />;
}

export function ManualsPage() {
  return <DarkSlotPage id="manuaisView" slot="manuals" />;
}

/** Página #/suporte: mesmo mapa de Representantes, com as assistências técnicas de cada estado. */
export function SupportPage() {
  return (
    <div className="page-view dark-page" id="suporteView" hidden>
      <div className="dark-experience">
        <div className="dark-experience-bg" aria-hidden="true" />
        <StateMapSection
          prefix="sup"
          anchorId="suporte"
          title="Encontre o suporte técnico JFA."
          sub="Escolha seu estado e encontre uma assistência técnica autorizada JFA perto de você."
          placeholder="Digite seu estado ou cidade"
        >
          <div className="reps-intl-wrap sup-actions">
            <a
              className="reps-intl"
              id="supWhatsapp"
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="reps-intl-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>{' '}
              <span>Suporte pelo WhatsApp</span>{' '}
              <svg className="reps-intl-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <button
              className="reps-intl"
              id="supIntlToggle"
              type="button"
              aria-expanded="false"
              aria-controls="supIntlPanel"
            >
              <svg className="reps-intl-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="3.6" ry="8.4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.6 12h16.8" stroke="currentColor" strokeWidth="1.5" />
              </svg>{' '}
              <span>Assistência internacional</span>{' '}
              <svg className="reps-intl-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="reps-intl-panel" id="supIntlPanel" />
          </div>
        </StateMapSection>
      </div>
    </div>
  );
}
