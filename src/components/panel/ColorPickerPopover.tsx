import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function ColorPickerPopover({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-7 w-7 rounded border border-border/60 shadow-inner"
          style={{ backgroundColor: value }}
          aria-label="Elegir color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <HexColorPicker color={value} onChange={onChange} />
        <div className="mt-2 text-center text-xs tabular-nums text-muted-foreground">{value.toUpperCase()}</div>
      </PopoverContent>
    </Popover>
  );
}
