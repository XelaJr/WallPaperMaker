import { WallpaperCanvas } from './components/canvas/WallpaperCanvas';
import { useWallpaperStore } from './store/wallpaperStore';
import { Toaster } from 'sonner';
import { FloatingPanel, HiddenHint } from './components/panel/FloatingPanel';
import { useEffect } from 'react';
import { useShortcuts } from './hooks/useShortcuts';
import { useHashSync } from './hooks/useHashSync';

export default function App() {
  const current = useWallpaperStore((s) => s.current);
  const panelHidden = useWallpaperStore((s) => s.panelHidden);
  const theme = useWallpaperStore((s) => s.theme);

  useShortcuts();
  useHashSync();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <WallpaperCanvas state={current} />
      </div>
      {panelHidden ? <HiddenHint /> : <FloatingPanel />}
      <Toaster position="bottom-right" theme={theme} richColors />
    </div>
  );
}
