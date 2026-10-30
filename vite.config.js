import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Duas páginas: o site da JFA (/) e a landing page do AutoPainel (/autopainel/).
      input: {
        main: resolve(__dirname, 'index.html'),
        autopainel: resolve(__dirname, 'autopainel/index.html'),
      },
    },
  },
});
