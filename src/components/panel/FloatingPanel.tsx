import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp, GripHorizontal, Sun, Moon, Shuffle, Undo2, Redo2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsBar } from './ScrollableTabsBar';
import { ShapesTab } from './tabs/ShapesTab';
import { ColorsTab } from './tabs/ColorsTab';
import { BackgroundTab } from './tabs/BackgroundTab';
import { CompositionTab } from './tabs/CompositionTab';
import { ExportTab } from './tabs/ExportTab';
import { PresetGallery } from './PresetGallery';
import { SavedConfigs } from './SavedConfigs';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { usePointerDrag } from '@/hooks/usePointerDrag';
import { randomState } from '@/lib/random';
import { cn } from '@/lib/utils';

export function FloatingPanel() {
  const handleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 16 });
  const [collapsed, setCollapsed] = useState(false);

  function clampPos(p: { x: number; y: number }): { x: number; y: number } {
    const panel = panelRef.current;
    if (!panel) return p;
    const rect = panel.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Asegurar que al menos 80px del panel queden dentro por cada borde
    // para que siempre se pueda agarrar el handle.
    const margin = 60;
    // El panel está anchored top-center: translate(-50% + x, y).
    // Por tanto su left = (vw - rect.width)/2 + x; top = y.
    const baseLeft = (vw - rect.width) / 2;
    const minX = -(baseLeft + rect.width - margin); // permite ocultar casi todo a la izquierda dejando margin visible
    const maxX = vw - baseLeft - margin; // idem derecha
    const minY = 0;
    const maxY = vh - margin;
    return {
      x: Math.max(minX, Math.min(maxX, p.x)),
      y: Math.max(minY, Math.min(maxY, p.y)),
    };
  }

  const replace = useWallpaperStore((s) => s.replace);
  const undo = useWallpaperStore((s) => s.undo);
  const redo = useWallpaperStore((s) => s.redo);
  const togglePanel = useWallpaperStore((s) => s.togglePanel);
  const toggleTheme = useWallpaperStore((s) => s.toggleTheme);
  const theme = useWallpaperStore((s) => s.theme);
  const past = useWallpaperStore((s) => s.past.length);
  const future = useWallpaperStore((s) => s.future.length);

  const onDelta = useCallback((d: { x: number; y: number }) => {
    setPos((p) => clampPos({ x: p.x + d.x, y: p.y + d.y }));
  }, []);
  usePointerDrag(handleRef, onDelta);

  // Si la ventana se redimensiona o el panel cambia de tamaño, re-clampar.
  useEffect(() => {
    function onResize() { setPos((p) => clampPos(p)); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      className="absolute left-1/2 top-0 z-30 -translate-x-1/2"
      style={{
        transform: `translate(calc(-50% + ${pos.x}px), calc(env(safe-area-inset-top, 0px) + ${pos.y}px))`,
      }}
    >
      <div ref={panelRef} className="glass w-[min(640px,calc(100vw-0.5rem))] rounded-2xl border border-border/50 shadow-2xl">
        <div
          ref={handleRef}
          className="flex cursor-grab items-center gap-1 border-b border-border/40 px-2 py-1.5 active:cursor-grabbing sm:gap-2 sm:px-3 sm:py-2"
        >
          <GripHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="hidden text-xs font-semibold tracking-wide sm:inline">Wallpaper Maker</span>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Button size="icon" variant="ghost" onClick={() => replace(randomState())} title="Aleatorio (R)" className="h-8 w-8">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={undo} disabled={past === 0} title="Deshacer (Ctrl+Z)" className="h-8 w-8">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={redo} disabled={future === 0} title="Rehacer (Ctrl+Y)" className="h-8 w-8">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={toggleTheme} title="Tema" className="h-8 w-8">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setCollapsed((c) => !c)} title="Plegar" className="h-8 w-8">
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={togglePanel} title="Ocultar (H)" className="h-8 w-8">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className={cn('overflow-hidden transition-all', collapsed ? 'max-h-0' : 'max-h-[78vh]')}>
          <div className="max-h-[78vh] overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
            <Tabs defaultValue="shapes">
              <ScrollableTabsBar>
                <TabsTrigger value="shapes" className="flex-shrink-0">Formas</TabsTrigger>
                <TabsTrigger value="colors" className="flex-shrink-0">Colores</TabsTrigger>
                <TabsTrigger value="background" className="flex-shrink-0">Fondo</TabsTrigger>
                <TabsTrigger value="composition" className="flex-shrink-0">Composición</TabsTrigger>
                <TabsTrigger value="export" className="flex-shrink-0">Exportar</TabsTrigger>
                <TabsTrigger value="presets" className="flex-shrink-0">Presets</TabsTrigger>
              </ScrollableTabsBar>
              <TabsContent value="shapes"><ShapesTab /></TabsContent>
              <TabsContent value="colors"><ColorsTab /></TabsContent>
              <TabsContent value="background"><BackgroundTab /></TabsContent>
              <TabsContent value="composition"><CompositionTab /></TabsContent>
              <TabsContent value="export"><ExportTab /></TabsContent>
              <TabsContent value="presets">
                <PresetGallery />
                <div className="mt-4 border-t border-border/40 pt-3">
                  <SavedConfigs />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HiddenHint() {
  return (
    <div className="absolute right-3 top-3 z-30">
      <Button size="sm" variant="secondary" onClick={() => useWallpaperStore.getState().togglePanel()}>
        <Eye className="mr-1 h-4 w-4" /> Mostrar panel
      </Button>
    </div>
  );
}
