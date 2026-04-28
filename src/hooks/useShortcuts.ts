import { useEffect } from 'react';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { randomState } from '@/lib/random';
import { downloadWallpaper } from '@/lib/export';
import { toast } from 'sonner';

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export function useShortcuts(): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping(e.target)) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        useWallpaperStore.getState().undo();
        return;
      }
      if (ctrl && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        useWallpaperStore.getState().redo();
        return;
      }
      if (ctrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const name = `Config ${useWallpaperStore.getState().saved.length + 1}`;
        useWallpaperStore.getState().saveConfig(name);
        toast.success(`Guardado "${name}"`);
        return;
      }
      if (ctrl) return;
      switch (e.key.toLowerCase()) {
        case 'r':
          useWallpaperStore.getState().replace(randomState());
          break;
        case 'h':
          useWallpaperStore.getState().togglePanel();
          break;
        case 'd':
          downloadWallpaper(useWallpaperStore.getState().current).catch(() => {});
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
