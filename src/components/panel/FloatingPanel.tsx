import { useRef, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, GripHorizontal, Sun, Moon, Shuffle, Undo2, Redo2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 16 });
  const [collapsed, setCollapsed] = useState(false);

  const replace = useWallpaperStore((s) => s.replace);
  const undo = useWallpaperStore((s) => s.undo);
  const redo = useWallpaperStore((s) => s.redo);
  const togglePanel = useWallpaperStore((s) => s.togglePanel);
  const toggleTheme = useWallpaperStore((s) => s.toggleTheme);
  const theme = useWallpaperStore((s) => s.theme);
  const past = useWallpaperStore((s) => s.past.length);
  const future = useWallpaperStore((s) => s.future.length);

  const onDelta = useCallback((d: { x: number; y: number }) => {
    setPos((p) => ({ x: p.x + d.x, y: p.y + d.y }));
  }, []);
  usePointerDrag(handleRef, onDelta);

  return (
    <div
      className="absolute left-1/2 top-0 z-30 -translate-x-1/2"
      style={{ transform: `translate(calc(-50% + ${pos.x}px), ${pos.y}px)` }}
    >
      <div className="glass w-[min(640px,calc(100vw-2rem))] rounded-2xl border border-border/50 shadow-2xl">
        <div
          ref={handleRef}
          className="flex cursor-grab items-center gap-2 border-b border-border/40 px-3 py-2 active:cursor-grabbing"
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold tracking-wide">Wallpaper Maker</span>
          <div className="ml-auto flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => replace(randomState())} title="Aleatorio (R)">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={undo} disabled={past === 0} title="Deshacer (Ctrl+Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={redo} disabled={future === 0} title="Rehacer (Ctrl+Y)">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={toggleTheme} title="Tema">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setCollapsed((c) => !c)} title="Plegar">
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={togglePanel} title="Ocultar (H)">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className={cn('overflow-hidden transition-all', collapsed ? 'max-h-0' : 'max-h-[80vh]')}>
          <div className="max-h-[80vh] overflow-y-auto px-3 py-3">
            <Tabs defaultValue="shapes">
              <TabsList className="w-full justify-stretch">
                <TabsTrigger value="shapes" className="flex-1">Formas</TabsTrigger>
                <TabsTrigger value="colors" className="flex-1">Colores</TabsTrigger>
                <TabsTrigger value="background" className="flex-1">Fondo</TabsTrigger>
                <TabsTrigger value="composition" className="flex-1">Composición</TabsTrigger>
                <TabsTrigger value="export" className="flex-1">Exportar</TabsTrigger>
                <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
              </TabsList>
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
