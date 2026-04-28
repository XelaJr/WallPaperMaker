import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import type { WallpaperState } from '@/store/types';
import { WallpaperCanvas } from '@/components/canvas/WallpaperCanvas';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgString(state: WallpaperState): string {
  const markup = renderToStaticMarkup(
    createElement(WallpaperCanvas, { state, preview: false }),
  );
  // Garantizamos namespace explícito para apps externas que renderizan el SVG.
  if (markup.includes('xmlns=')) return markup;
  return markup.replace('<svg', `<svg xmlns="${SVG_NS}"`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadWallpaper(state: WallpaperState): Promise<void> {
  const { width, height, format, quality } = state.export;
  const svg = svgString(state);

  if (format === 'svg') {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, `wallpaper-${width}x${height}.svg`);
    return;
  }

  const blob = await rasterize(svg, width, height, format, quality, state.background.mode === 'transparent');
  triggerDownload(blob, `wallpaper-${width}x${height}.${format}`);
}

async function rasterize(
  svg: string,
  width: number,
  height: number,
  format: 'png' | 'jpg' | 'webp',
  quality: number,
  bgTransparent: boolean,
): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const img = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas context');
    if (format === 'jpg' && bgTransparent) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);
    const mime = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob falló'))),
        mime,
        format === 'png' ? undefined : quality,
      );
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
