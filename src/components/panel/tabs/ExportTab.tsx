import { useWallpaperStore } from '@/store/wallpaperStore';
import { Field, FieldSlider } from '../Field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ExportFormat } from '@/store/types';
import { downloadWallpaper } from '@/lib/export';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const RES_PRESETS: Record<string, { w: number; h: number; label: string }> = {
  '1920x1080': { w: 1920, h: 1080, label: '1920×1080 · Full HD' },
  '2560x1440': { w: 2560, h: 1440, label: '2560×1440 · QHD' },
  '3840x2160': { w: 3840, h: 2160, label: '3840×2160 · 4K' },
  '5120x2880': { w: 5120, h: 2880, label: '5120×2880 · 5K' },
  '7680x4320': { w: 7680, h: 4320, label: '7680×4320 · 8K' },
  '3440x1440': { w: 3440, h: 1440, label: '3440×1440 · Ultrawide' },
  '5120x1440': { w: 5120, h: 1440, label: '5120×1440 · Super Ultrawide' },
  '1290x2796': { w: 1290, h: 2796, label: '1290×2796 · iPhone 15 Pro' },
  '1080x2400': { w: 1080, h: 2400, label: '1080×2400 · Android' },
};

export function ExportTab() {
  const exp = useWallpaperStore((s) => s.current.export);
  const bg = useWallpaperStore((s) => s.current.background);
  const setStore = useWallpaperStore((s) => s.set);
  const state = useWallpaperStore((s) => s.current);
  const [busy, setBusy] = useState(false);

  const presetKey = `${exp.width}x${exp.height}` in RES_PRESETS ? `${exp.width}x${exp.height}` : 'custom';

  function setRes(key: string) {
    if (key === 'custom') return;
    const p = RES_PRESETS[key];
    setStore({ export: { width: p.w, height: p.h } });
  }

  async function onDownload() {
    setBusy(true);
    try {
      if (exp.format === 'jpg' && bg.mode === 'transparent') {
        toast.warning('JPG no soporta transparencia. Se rellenará con blanco.');
      }
      await downloadWallpaper(state);
      toast.success('Descargado');
    } catch (e) {
      toast.error('Error al exportar');
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  const estimateMb = estimateSize(exp.width, exp.height, exp.format, exp.quality);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Resolución">
        <Select value={presetKey} onValueChange={setRes}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(RES_PRESETS).map(([k, p]) => (
              <SelectItem key={k} value={k}>{p.label}</SelectItem>
            ))}
            <SelectItem value="custom">Personalizada</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Formato">
        <Select value={exp.format} onValueChange={(v) => setStore({ export: { format: v as ExportFormat } })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Ancho (px)">
        <Input
          type="number"
          min={16}
          max={16384}
          value={exp.width}
          onChange={(e) => setStore({ export: { width: Math.max(16, Number(e.target.value) || 0) } })}
        />
      </Field>
      <Field label="Alto (px)">
        <Input
          type="number"
          min={16}
          max={16384}
          value={exp.height}
          onChange={(e) => setStore({ export: { height: Math.max(16, Number(e.target.value) || 0) } })}
        />
      </Field>
      {(exp.format === 'jpg' || exp.format === 'webp') && (
        <FieldSlider
          label="Calidad"
          min={0.1}
          max={1}
          step={0.01}
          value={exp.quality}
          onChange={(v) => setStore({ export: { quality: v } })}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      )}
      <div className="md:col-span-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {exp.width}×{exp.height} · estimado ~{estimateMb}
        </span>
        <Button onClick={onDownload} disabled={busy}>
          <Download className="mr-1 h-4 w-4" /> Descargar
        </Button>
      </div>
    </div>
  );
}

function estimateSize(w: number, h: number, fmt: string, q: number): string {
  if (fmt === 'svg') return '< 50 KB';
  const px = w * h;
  let bytes: number;
  if (fmt === 'png') bytes = px * 1.2;
  else if (fmt === 'jpg') bytes = px * 0.25 * q;
  else bytes = px * 0.18 * q;
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
