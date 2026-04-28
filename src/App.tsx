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

  const bgFill =
    current.background.mode === 'solid'
      ? current.background.color
      : current.background.mode === 'gradient'
        ? current.background.gradient.stops[0]?.color ?? '#000'
        : '#000';

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: bgFill }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <WallpaperCanvas state={current} />
      </div>
      {panelHidden ? <HiddenHint /> : <FloatingPanel />}
      <a
        href="https://github.com/XelaJr"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 left-3 z-30 text-[11px] text-white/60 mix-blend-difference transition-colors hover:text-white"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        Made by <span className="font-semibold underline decoration-dotted">@XelaJr</span>
      </a>
      <Toaster position="bottom-right" theme={theme} richColors />
    </div>
  );
}
