import { MOOV_STORE_URL, MOOV_EMAIL, MOOV_WHATSAPP_URL, MOOV_WHATSAPP_LABEL } from '../../data/links';

const Icon = ({ d, children }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {d ? (
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      children
    )}
  </svg>
);

const ICONS = {
  truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.6 1.6 0 1 0 0-.01M17 19a1.6 1.6 0 1 0 0-.01',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h4',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2',
  globe:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21M12 3C9.5 5.6 8.3 8.6 8.3 12s1.2 6.4 3.7 9',
  chat: 'M4 19l1.4-4A8 8 0 1 1 9 18.6L4 19z',
  shield: 'M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6zM9 12l2 2 4-4',
  store: 'M4 9l1.5-5h13L20 9M4 9h16v11H4zM9 20v-6h6v6',
  bike: 'M5.5 17.5a3.5 3.5 0 1 0 0-.01M18.5 17.5a3.5 3.5 0 1 0 0-.01M5.5 17.5 9 10.5h6l3.5 7M9 10.5l3 7h-1M8 7.5h3M15 10.5l-1-3h2.5',
};

const ArrowIcon = () => <Icon d="M5 12h13M13 6l6 6-6 6" />;

/**
 * Página #/setores/moov: landing page da JFA Moov (bicicletas elétricas).
 * Texto da página de vendas enviado pela JFA; as entradas animadas ficam em
 * behaviors/assemble.js (PAGE_VIEWS.moov).
 */
export default function MoovPage() {
  return (
    <div className="page-view moov-page" id="moovView" hidden>
      {/* 1 · Hero */}
      <section className="moov-hero">
        <div className="moov-hero-bg" aria-hidden="true" />
        <div className="moov-hero-inner">
          <div className="moov-hero-copy">
            <span className="moov-eyebrow">JFA Moov</span>
            <h1 className="moov-title">
              Mobilidade Inteligente, Tecnologia e Variedade para o Seu Dia a Dia.
            </h1>
            <p className="moov-sub">
              Na Moov Store, conectamos você às melhores inovações globais em e-bikes. Compre direto de quem
              importa, com suporte humanizado e garantia de verdade.
            </p>
            <a
              className="moov-cta"
              href={MOOV_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-moov-cta="hero"
            >
              Conhecer Catálogo Oficial <ArrowIcon />
            </a>
            <ul className="moov-badges">
              <li>
                <Icon d={ICONS.truck} /> Frete Seguro para todo o Brasil
              </li>
              <li>
                <Icon d={ICONS.card} /> Até 12x Sem Juros
              </li>
              <li>
                <Icon d={ICONS.lock} /> Site 100% Blindado e Seguro
              </li>
            </ul>
          </div>
          {/* Fotos com fundo branco: ficam num painel claro nos dois temas. */}
          <div className="moov-hero-visual" data-theme-keep>
            <img
              src="/images/moov/adventure.webp"
              alt="Bicicleta elétrica Adventure 3000W"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 2 · Quem somos */}
      <section className="moov-section moov-about">
        <div className="moov-inner moov-narrow">
          <span className="moov-label">Quem somos</span>
          <h2 className="moov-h2">Muito além de um e-commerce: Seu parceiro de inovação</h2>
          <p className="moov-text">
            A Moov Store nasceu com a missão de democratizar o acesso a produtos tecnológicos e soluções de
            mobilidade urbana de alta performance. Sediados em São Paulo, atuamos de forma transparente para
            entregar muito mais do que produtos: entregamos uma experiência de compra segura, do clique à
            entrega na sua porta.
          </p>
        </div>
      </section>

      {/* 3 · Diferenciais */}
      <section className="moov-section">
        <div className="moov-inner">
          <div className="moov-head">
            <span className="moov-label">Diferenciais</span>
            <h2 className="moov-h2">Por Que Comprar na Moov Store?</h2>
          </div>
          <div className="moov-features">
            <article className="moov-feature">
              <span className="moov-feature-icon">
                <Icon d={ICONS.globe} />
              </span>
              <h3>Importação Direta e Rigorosa</h3>
              <p>
                Selecionamos a dedo fabricantes globais de ponta. Você recebe produtos testados e aprovados
                pelos mais rígidos padrões de qualidade.
              </p>
            </article>
            <article className="moov-feature">
              <span className="moov-feature-icon">
                <Icon d={ICONS.chat} />
              </span>
              <h3>Atendimento Humanizado</h3>
              <p>
                Esqueça robôs travados. Nosso time de suporte via WhatsApp acompanha sua jornada de compra e
                resolve suas dúvidas de forma rápida e acolhedora.
              </p>
            </article>
            <article className="moov-feature">
              <span className="moov-feature-icon">
                <Icon d={ICONS.shield} />
              </span>
              <h3>Pós-Venda e Garantia Real</h3>
              <p>
                Todos os nossos produtos possuem garantia por lei e suporte técnico dedicado. Se precisar de
                assistência, nossa central em São Paulo está pronta para te atender.
              </p>
            </article>
            <article className="moov-feature">
              <span className="moov-feature-icon">
                <Icon d={ICONS.store} />
              </span>
              <h3>Presença nos Maiores Marketplaces</h3>
              <p>
                Além do nosso site oficial, somos parceiros oficiais e líderes de vendas no Mercado Livre e
                Shopee. Sua compra está protegida em qualquer canal.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4 · Vitrine */}
      <section className="moov-section">
        <div className="moov-inner">
          <div className="moov-head">
            <span className="moov-label">Vitrine de soluções</span>
            <h2 className="moov-h2">Explore o Universo Moov Store</h2>
          </div>
          <a
            className="moov-showcase"
            href={MOOV_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-moov-cta="vitrine"
          >
            <span className="moov-showcase-media" data-theme-keep>
              <img
                src="/images/moov/urban.webp"
                alt="Bicicleta elétrica Urban 750W"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/images/moov/extreme.webp"
                alt="Bicicleta elétrica Extreme 2500W"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/images/moov/adventure.webp"
                alt="Bicicleta elétrica Adventure 3000W"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="moov-showcase-copy">
              <span className="moov-showcase-icon">
                <Icon d={ICONS.bike} />
              </span>
              <span className="moov-showcase-title">E-Bikes &amp; Mobilidade</span>
              <span className="moov-showcase-text">
                Bicicletas elétricas de alta performance, com tecnologia NFC e autonomia de ponta para
                revolucionar seu trânsito.
              </span>
              <span className="moov-showcase-cta">
                Ver bicicletas <ArrowIcon />
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* 5 · Prova social */}
      <section className="moov-section">
        <div className="moov-inner">
          <div className="moov-head">
            <span className="moov-label">Prova social</span>
            <h2 className="moov-h2">Quem compra, confia!</h2>
          </div>
          <div className="moov-proof">
            <figure className="moov-quote">
              <svg className="moov-quote-mark" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9.5 6C6.5 7.2 4.5 9.7 4.5 13v5h6v-6H7.6c.2-1.9 1.4-3.3 3.1-4.1zM19.5 6c-3 1.2-5 3.7-5 7v5h6v-6h-2.9c.2-1.9 1.4-3.3 3.1-4.1z"
                  fill="currentColor"
                />
              </svg>
              <blockquote>
                “Comprei minha e-bike pelo site e o suporte via WhatsApp foi impecável antes e depois da
                entrega. Chegou super rápido em BH!”
              </blockquote>
              <figcaption>Carlos M., Cliente Moov Store</figcaption>
            </figure>
            <div className="moov-guarantee">
              <span className="moov-guarantee-icon">
                <Icon d={ICONS.shield} />
              </span>
              <h3>Selo de Compra Garantida</h3>
              <p>
                Garantimos a entrega do seu produto ou o seu dinheiro de volta. Processamento de pagamento
                100% criptografado.
              </p>
            </div>
          </div>
          <div className="moov-final-cta">
            <a
              className="moov-cta"
              href={MOOV_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-moov-cta="final"
            >
              Conhecer Catálogo Oficial <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* 6 · Rodapé institucional */}
      <section className="moov-legal">
        <div className="moov-inner">
          <p className="moov-legal-name">Moov Store LTDA</p>
          <p>CNPJ: 66.458.413/0001-22</p>
          <p>Rua Camacam, 249 - Vila Anastácio, São Paulo - SP, CEP 05095-000</p>
          <p className="moov-legal-contacts">
            <a href={`mailto:${MOOV_EMAIL}`}>{MOOV_EMAIL}</a>
            <a
              href={MOOV_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-moov-cta="rodape-whatsapp"
            >
              WhatsApp: {MOOV_WHATSAPP_LABEL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
