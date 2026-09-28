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

/** Página #/suporte: mesmo mapa de Representantes, com os contatos de suporte técnico. */
export function SupportPage() {
  return (
    <div className="page-view dark-page" id="suporteView" hidden>
      <div className="dark-experience">
        <div className="dark-experience-bg" aria-hidden="true" />
        <StateMapSection
          prefix="sup"
          anchorId="suporte"
          title="Encontre o suporte técnico JFA."
          sub="Escolha seu estado e fale com quem pode ajudar com o seu produto JFA."
        >
          <div className="reps-intl-wrap">
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
          </div>
        </StateMapSection>
      </div>
    </div>
  );
}
