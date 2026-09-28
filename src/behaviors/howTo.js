import { trackEvent } from '../lib/analytics';
import { t, tf } from '../i18n';

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor"></path></svg>';

/**
 * Preenche a seção "Como usar" (components/shared/HowToSection.jsx).
 * Vídeo: campo `video` do produto (ex.: '/media/produtos/<id>.mp4', vertical 9:16).
 * @param {string} prefix prefixo dos ids ('produto' ou 'bateria')
 * @param {{ name: string, video?: string, poster?: string, id: string }} item
 */
export function renderHowTo(prefix, item) {
  const byId = (s) => document.getElementById(prefix + s);
  const text = byId('HowToText');
  const box = byId('HowToVideo');
  const download = byId('HowToDownload');
  if (!text || !box || !download) return;
  text.textContent = tf('howto.text', { name: item.name });
  box.innerHTML = '';
  if (item.video) {
    const video = document.createElement('video');
    video.src = item.video;
    if (item.poster) video.poster = item.poster;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', tf('howto.videoOf', { name: item.name }));
    box.appendChild(video);
    box.classList.remove('is-empty');
    download.href = item.video;
    download.setAttribute(
      'download',
      (item.id || 'video-jfa') + '.' + (item.video.split('.').pop() || 'mp4'),
    );
    download.removeAttribute('aria-disabled');
    download.classList.remove('is-disabled');
    download.querySelector('span').textContent = t('howto.download');
    download.onclick = () => trackEvent('howto_video_download', { product_id: item.id });
  } else {
    box.classList.add('is-empty');
    box.innerHTML = PLAY_ICON + '<span class="howto-soon"></span>';
    box.querySelector('.howto-soon').textContent = t('howto.soon');
    download.removeAttribute('href');
    download.setAttribute('aria-disabled', 'true');
    download.classList.add('is-disabled');
    download.querySelector('span').textContent = t('howto.soonButton');
    download.onclick = (e) => e.preventDefault();
  }
}
