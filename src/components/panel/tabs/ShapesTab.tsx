import { useWallpaperStore } from '@/store/wallpaperStore';
import { Field, FieldSlider } from '../Field';
import { ShapeSelect } from '../ShapeSelect';
import { Switch } from '@/components/ui/switch';
import { SHAPE_REGISTRY } from '@/lib/shapes';

export function ShapesTab() {
  const shape = useWallpaperStore((s) => s.current.shape);
  const setStore = useWallpaperStore((s) => s.set);
  const def = SHAPE_REGISTRY[shape.id];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Forma">
          <ShapeSelect value={shape.id} onChange={(id) => setStore({ shape: { id } })} />
        </Field>
      </div>
      <FieldSlider
        label="Cantidad"
        min={1}
        max={50}
        step={1}
        value={shape.count}
        onChange={(v) => setStore({ shape: { count: v } })}
      />
      <FieldSlider
        label="Ancho"
        min={0.1}
        max={1}
        step={0.01}
        value={shape.widthRatio}
        onChange={(v) => setStore({ shape: { widthRatio: v } })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      {!def.fixedAspectRatio && (
        <FieldSlider
          label="Alto"
          min={0.05}
          max={1}
          step={0.01}
          value={shape.heightRatio}
          onChange={(v) => setStore({ shape: { heightRatio: v } })}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      )}
      <FieldSlider
        label="Espaciado"
        min={-0.9}
        max={1.5}
        step={0.01}
        value={shape.gap}
        onChange={(v) => setStore({ shape: { gap: v } })}
        format={(v) => (v < 0 ? `solape ${Math.round(-v * 100)}%` : `${Math.round(v * 100)}%`)}
      />
      {def.supportsCornerRadius && (
        <FieldSlider
          label="Esquinas"
          min={0}
          max={1}
          step={0.01}
          value={shape.cornerRadius}
          onChange={(v) => setStore({ shape: { cornerRadius: v } })}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      )}
      <div className="md:col-span-2 space-y-3 border-t border-border/40 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Variación de altura
          </span>
          <Switch
            checked={shape.heightVariation.enabled}
            onCheckedChange={(v) => setStore({ shape: { heightVariation: { enabled: v } } })}
          />
        </div>
        {shape.heightVariation.enabled && (
          <FieldSlider
            label="Intensidad"
            min={0}
            max={1}
            step={0.01}
            value={shape.heightVariation.intensity}
            onChange={(v) => setStore({ shape: { heightVariation: { intensity: v } } })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Rotación de cada forma
          </span>
          <Switch
            checked={shape.rotation.enabled}
            onCheckedChange={(v) => setStore({ shape: { rotation: { enabled: v } } })}
          />
        </div>
        {shape.rotation.enabled && (
          <FieldSlider
            label="Ángulo"
            min={-180}
            max={180}
            step={1}
            value={shape.rotation.angle}
            onChange={(v) => setStore({ shape: { rotation: { angle: v } } })}
            format={(v) => `${v}°`}
          />
        )}
      </div>
    </div>
  );
}
