import { trackEvent } from '../lib/analytics';

const DOWNLOAD_ICON =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Fotos para download nas páginas de produto e de bateria: miniaturas das fotos
 * (sem fundo) com botão de baixar cada uma, e "Baixar todas".
 * @param {HTMLElement} container elemento `.product-photos` da página
 * @param {string[]} images caminhos das fotos
 * @param {string} name nome do produto (vira o nome dos arquivos)
 * @param {object} track dados extras do evento de analytics
 */
export function renderPhotoDownloads(container, images, name, track = {}) {
  if (!container) return;
  const list = Array.from(new Set((images || []).filter(Boolean)));
  container.hidden = !list.length;
  const grid = container.querySelector('.product-photos-grid');
  const all = container.querySelector('.product-photos-all');
  if (!grid) return;
  grid.innerHTML = '';
  const base = slugify(name) || 'produto-jfa';
  const fileName = (src, i) => {
    const m = src.split('?')[0].match(/\.(\w+)$/);
    const ext = m ? m[1] : 'webp';
    return base + (list.length > 1 ? '-' + (i + 1) : '') + '.' + ext;
  };
  list.forEach((src, i) => {
    const a = document.createElement('a');
    a.className = 'product-photo';
    a.href = src;
    a.download = fileName(src, i);
    a.setAttribute('aria-label', 'Baixar foto ' + (i + 1) + ' de ' + name);
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    a.appendChild(img);
    const tag = document.createElement('span');
    tag.className = 'product-photo-tag';
    tag.innerHTML = DOWNLOAD_ICON + '<span>Baixar</span>';
    a.appendChild(tag);
    a.onclick = () => trackEvent('photo_download', { ...track, photo: i + 1 });
    grid.appendChild(a);
  });
  if (all) {
    all.hidden = list.length < 2;
    // Uma foto por vez, com um pequeno intervalo (o navegador pode pedir permissão
    // para baixar vários arquivos na primeira vez).
    all.onclick = () => {
      trackEvent('photo_download', { ...track, photo: 'todas' });
      list.forEach((src, i) =>
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = src;
          a.download = fileName(src, i);
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, i * 350),
      );
    };
  }
}
