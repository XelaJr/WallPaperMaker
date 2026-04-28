import { Plus, Trash2 } from 'lucide-react';
import type { ColorStop } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ColorPickerPopover } from './ColorPickerPopover';
import { uid } from '@/lib/utils';

export function ColorStopsEditor({
  stops,
  onChange,
}: {
  stops: ColorStop[];
  onChange: (next: ColorStop[]) => void;
}) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-2">
      {sorted.map((stop) => (
        <div key={stop.id} className="flex items-center gap-2">
          <ColorPickerPopover
            value={stop.color}
            onChange={(c) => onChange(stops.map((s) => (s.id === stop.id ? { ...s, color: c } : s)))}
          />
          <Slider
            className="flex-1"
            min={0}
            max={100}
            step={1}
            value={[stop.position]}
            onValueChange={(v) => onChange(stops.map((s) => (s.id === stop.id ? { ...s, position: v[0] } : s)))}
          />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{stop.position}%</span>
          <Button
            size="icon"
            variant="ghost"
            disabled={stops.length <= 2}
            onClick={() => onChange(stops.filter((s) => s.id !== stop.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onChange([
            ...stops,
            { id: uid(), color: stops[stops.length - 1]?.color ?? '#ffffff', position: 50 },
          ])
        }
      >
        <Plus className="mr-1 h-3 w-3" /> Añadir parada
      </Button>
    </div>
  );
}
