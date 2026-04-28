import { useEffect } from 'react';
import { decodeStateFromHash } from '@/lib/share';
import { useWallpaperStore } from '@/store/wallpaperStore';

export function useHashSync(): void {
  useEffect(() => {
    const state = decodeStateFromHash(window.location.hash);
    if (state) {
      useWallpaperStore.getState().replace(state);
      // Limpiar el hash para no re-aplicar al recargar.
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
}
