import LZString from 'lz-string';
import type { WallpaperState } from '@/store/types';

export function encodeStateToHash(state: WallpaperState): string {
  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const url = new URL(window.location.href);
  url.hash = `config=${compressed}`;
  return url.toString();
}

export function decodeStateFromHash(hash: string): WallpaperState | null {
  const m = hash.match(/config=([^&]+)/);
  if (!m) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(m[1]);
    if (!json) return null;
    return JSON.parse(json) as WallpaperState;
  } catch {
    return null;
  }
}
