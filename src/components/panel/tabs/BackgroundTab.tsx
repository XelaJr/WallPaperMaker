import { useWallpaperStore } from '@/store/wallpaperStore';
import { Field, FieldSlider } from '../Field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColorPickerPopover } from '../ColorPickerPopover';
import { ColorStopsEditor } from '../ColorStops';
import type { BackgroundMode } from '@/store/types';

export function BackgroundTab() {
  const bg = useWallpaperStore((s) => s.current.background);
  const setStore = useWallpaperStore((s) => s.set);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Modo">
        <Select value={bg.mode} onValueChange={(v) => setStore({ background: { mode: v as BackgroundMode } })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólido</SelectItem>
            <SelectItem value="gradient">Degradado</SelectItem>
            <SelectItem value="transparent">Transparente</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {bg.mode === 'solid' && (
        <Field label="Color">
          <ColorPickerPopover value={bg.color} onChange={(c) => setStore({ background: { color: c } })} />
        </Field>
      )}
      {bg.mode === 'gradient' && (
        <>
          <FieldSlider
            label="Ángulo"
            min={0}
            max={360}
            step={1}
            value={bg.gradient.angle}
            onChange={(v) => setStore({ background: { gradient: { angle: v } } })}
            format={(v) => `${v}°`}
          />
          <div className="md:col-span-2">
            <Field label="Color stops">
              <ColorStopsEditor
                stops={bg.gradient.stops}
                onChange={(stops) => setStore({ background: { gradient: { stops } } })}
              />
            </Field>
          </div>
        </>
      )}
      <FieldSlider
        label="Vignette"
        min={0}
        max={1}
        step={0.01}
        value={bg.vignette}
        onChange={(v) => setStore({ background: { vignette: v } })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
    </div>
  );
}
