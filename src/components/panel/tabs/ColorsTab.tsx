import { useWallpaperStore } from '@/store/wallpaperStore';
import { Field, FieldSlider } from '../Field';
import { ColorStopsEditor } from '../ColorStops';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { GradientMode } from '@/store/types';
import { ColorPickerPopover } from '../ColorPickerPopover';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function ColorsTab() {
  const colors = useWallpaperStore((s) => s.current.colors);
  const count = useWallpaperStore((s) => s.current.shape.count);
  const setStore = useWallpaperStore((s) => s.set);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Modo">
        <Select value={colors.mode} onValueChange={(v) => setStore({ colors: { mode: v as GradientMode } })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Lineal</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
            <SelectItem value="conic">Cónico (1 color por barra)</SelectItem>
            <SelectItem value="manual">Manual por barra</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <FieldSlider
        label="Opacidad"
        min={0}
        max={1}
        step={0.01}
        value={colors.opacity}
        onChange={(v) => setStore({ colors: { opacity: v } })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      {colors.mode === 'linear' && (
        <FieldSlider
          label="Ángulo"
          min={0}
          max={360}
          step={1}
          value={colors.angle}
          onChange={(v) => setStore({ colors: { angle: v } })}
          format={(v) => `${v}°`}
        />
      )}
      {colors.mode === 'radial' && (
        <>
          <FieldSlider
            label="Centro X"
            min={0}
            max={100}
            step={1}
            value={colors.center.x}
            onChange={(v) => setStore({ colors: { center: { x: v } } })}
            format={(v) => `${v}%`}
          />
          <FieldSlider
            label="Centro Y"
            min={0}
            max={100}
            step={1}
            value={colors.center.y}
            onChange={(v) => setStore({ colors: { center: { y: v } } })}
            format={(v) => `${v}%`}
          />
        </>
      )}
      {colors.mode !== 'manual' && (
        <div className="md:col-span-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Gradiente por barra
          </span>
          <Switch
            checked={colors.perBar}
            onCheckedChange={(v) => setStore({ colors: { perBar: v } })}
          />
        </div>
      )}
      {colors.mode !== 'manual' && (
        <div className="md:col-span-2">
          <Field label="Color stops">
            <ColorStopsEditor
              stops={colors.stops}
              onChange={(stops) => setStore({ colors: { stops } })}
            />
          </Field>
        </div>
      )}
      {colors.mode === 'manual' && (
        <div className="md:col-span-2 space-y-2">
          <Field label={`Colores (${count})`}>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: count }).map((_, i) => {
                const c = colors.manualColors[i] ?? '#ffffff';
                return (
                  <ColorPickerPopover
                    key={i}
                    value={c}
                    onChange={(v) => {
                      const next = [...colors.manualColors];
                      while (next.length < count) next.push('#ffffff');
                      next[i] = v;
                      setStore({ colors: { manualColors: next.slice(0, count) } });
                    }}
                  />
                );
              })}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setStore({ colors: { manualColors: [...colors.manualColors, '#ffffff'] } })}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {colors.manualColors.length > 0 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setStore({ colors: { manualColors: colors.manualColors.slice(0, -1) } })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}
