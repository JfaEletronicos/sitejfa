import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const page = (file) => decodeURIComponent(new URL(file, import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        // Filme da JFA Parts (módulo independente em src/motion/parts-film).
        partsFilme: page('./parts-filme.html'),
      },
    },
  },
});
