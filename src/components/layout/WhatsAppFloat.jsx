import { WHATSAPP_FLOAT_URL } from '../../data/links';

/** Botão flutuante do WhatsApp, fixo no canto inferior esquerdo em todas as páginas. */
export default function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      id="whatsappFloat"
      href={WHATSAPP_FLOAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a JFA pelo WhatsApp"
      data-theme-keep
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.54 1.74 6.52L3 29l6.65-1.74A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.72c-1.98 0-3.93-.53-5.63-1.54l-.4-.24-3.95 1.03 1.05-3.84-.26-.4A10.66 10.66 0 0 1 5.3 16c0-5.92 4.82-10.73 10.74-10.73S26.74 10.08 26.74 16s-4.8 10.72-10.7 10.72Zm5.88-8.03c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.16-.21.32-.83 1.05-1.01 1.26-.19.21-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.8-2.22-.18-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.06-.4-.02-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.09 1.3 3.3c.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.77.24 1.46.2 2.01.12.61-.09 1.9-.78 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"
        />
      </svg>
      <span className="whatsapp-float-label">Fale conosco</span>
    </a>
  );
}
