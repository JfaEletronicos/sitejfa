import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Sem <StrictMode>: os comportamentos manipulam o DOM diretamente
// (animações, carrosséis, conteúdo gerado) e devem ser montados uma única vez.
createRoot(document.getElementById('root')).render(<App />);
