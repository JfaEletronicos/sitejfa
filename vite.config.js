import { defineConfig, createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Depois do build: um index.html por endereço (título, descrição e canônico próprios
// para o Google), o 404.html e o sitemap.xml, gerados por src/seo/build.js.
const seoPages = () => {
  let root = '';
  let outDir = '';
  return {
    name: 'jfa-seo-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const server = await createServer({
        root,
        configFile: false,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, watch: null },
      });
      try {
        const { renderSite } = await server.ssrLoadModule('/src/seo/build.js');
        const template = readFileSync(join(outDir, 'index.html'), 'utf8');
        const { pages, notFound, sitemap } = renderSite(template);
        pages.forEach(({ path, html }) => {
          const dir = join(outDir, path);
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, 'index.html'), html);
        });
        writeFileSync(join(outDir, '404.html'), notFound);
        writeFileSync(join(outDir, 'sitemap.xml'), sitemap);
        console.log('jfa-seo-pages: ' + pages.length + ' páginas, 404.html e sitemap.xml');
      } finally {
        await server.close();
      }
    },
  };
};

export default defineConfig({
  plugins: [react(), seoPages()],
});
