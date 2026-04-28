import { useWallpaperStore } from '@/store/wallpaperStore';
import { Field, FieldSlider } from '../Field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VerticalAlign } from '@/store/types';

export function CompositionTab() {
  const c = useWallpaperStore((s) => s.current.composition);
  const setStore = useWallpaperStore((s) => s.set);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FieldSlider
        label="Padding horizontal"
        min={0}
        max={0.45}
        step={0.01}
        value={c.paddingX}
        onChange={(v) => setStore({ composition: { paddingX: v } })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      <Field label="Alineación">
        <Select value={c.align} onValueChange={(v) => setStore({ composition: { align: v as VerticalAlign } })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Arriba</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="bottom">Abajo</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <FieldSlider
        label="Rotación global"
        min={-45}
        max={45}
        step={1}
        value={c.rotation}
        onChange={(v) => setStore({ composition: { rotation: v } })}
        format={(v) => `${v}°`}
      />
      <FieldSlider
        label="Escala"
        min={0.5}
        max={1.5}
        step={0.01}
        value={c.scale}
        onChange={(v) => setStore({ composition: { scale: v } })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
    </div>
  );
}
