/**
 * Hook único de conversões (whatsapp_click, manual_download, store_official_click,
 * mercado_livre_click, representative_contact, product_search, ...).
 *
 * Envia para o GA4 (`gtag`) ou para o `dataLayer` do GTM quando existirem;
 * caso contrário é um no-op seguro. Telemetria nunca pode quebrar a UI.
 *
 * Não use `source`, `medium`, `campaign`, `campaign_id`, `campaign_name`, `term`
 * ou `content` como parâmetro: o GA4 lê esses nomes como origem da visita e
 * mistura os cliques no relatório de aquisição. Onde o clique aconteceu vai em
 * `placement`.
 */
export const trackEvent = (name, params) => {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
      return;
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...(params || {}) });
    }
  } catch {
    /* telemetria nunca pode quebrar a UI */
  }
};

/**
 * Visualização de página do site (o GA4 não vê a troca de tela por # sozinho).
 * `path` é o endereço limpo da tela (ex.: "/setores/automotivo"), que vira a
 * "página" nos relatórios; o título é o da aba. `group` é o setor da tela
 * (Automotivo, Telecom, Suporte...), enviado como Grupo de conteúdo do GA4.
 */
export const trackPageView = (path, title, group) => {
  try {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_location: window.location.origin + path,
      page_path: path,
      page_title: title,
      content_group: group || '(sem setor)',
    });
  } catch {
    /* telemetria nunca pode quebrar a UI */
  }
};
