import { PRESETS } from '@/lib/presets';
import { WallpaperCanvas } from '@/components/canvas/WallpaperCanvas';
import { useWallpaperStore } from '@/store/wallpaperStore';

export function PresetGallery() {
  const replace = useWallpaperStore((s) => s.replace);
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Presets</div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => replace(p.state)}
            className="group relative overflow-hidden rounded-md border border-border/50 transition hover:border-primary/60"
            title={p.name}
          >
            <div className="aspect-[16/9] w-full">
              <WallpaperCanvas state={p.state} />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1 text-left text-[11px] font-medium text-white">
              {p.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
