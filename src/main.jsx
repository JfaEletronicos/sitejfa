import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { LANG, LANGS, t } from './i18n';

// Idioma da página (leitores de tela, tradutor do navegador) e descrição.
document.documentElement.lang = (LANGS.find((l) => l.code === LANG) || LANGS[0]).html;
if (LANG !== 'pt') {
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t('meta.description'));
}

// Sem <StrictMode>: os comportamentos manipulam o DOM diretamente
// (animações, carrosséis, conteúdo gerado) e devem ser montados uma única vez.
createRoot(document.getElementById('root')).render(<App />);
