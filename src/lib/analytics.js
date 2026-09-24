/**
 * Hook único de conversões (whatsapp_click, manual_download, store_official_click,
 * mercado_livre_click, representative_contact, product_search, ...).
 *
 * Envia para o GA4 (`gtag`) ou para o `dataLayer` do GTM quando existirem;
 * caso contrário é um no-op seguro. Telemetria nunca pode quebrar a UI.
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
