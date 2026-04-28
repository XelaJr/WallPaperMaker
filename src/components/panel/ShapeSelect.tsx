import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SHAPE_LIST, ShapePreview } from '@/lib/shapes';
import type { ShapeId } from '@/store/types';

export function ShapeSelect({ value, onChange }: { value: ShapeId; onChange: (v: ShapeId) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ShapeId)}>
      <SelectTrigger>
        <div className="flex items-center gap-2">
          <ShapePreview id={value} size={18} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {SHAPE_LIST.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            <div className="flex items-center gap-2">
              <ShapePreview id={s.id} size={18} />
              <span>{s.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
