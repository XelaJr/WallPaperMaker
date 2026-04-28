import { Save, Trash2, Pencil, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { encodeStateToHash } from '@/lib/share';
import { toast } from 'sonner';

export function SavedConfigs() {
  const saved = useWallpaperStore((s) => s.saved);
  const saveConfig = useWallpaperStore((s) => s.saveConfig);
  const loadConfig = useWallpaperStore((s) => s.loadConfig);
  const deleteConfig = useWallpaperStore((s) => s.deleteConfig);
  const renameConfig = useWallpaperStore((s) => s.renameConfig);
  const current = useWallpaperStore((s) => s.current);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  function onSave() {
    const n = name.trim() || `Config ${saved.length + 1}`;
    saveConfig(n);
    setName('');
    toast.success(`Guardado "${n}"`);
  }

  async function onShare() {
    const url = encodeStateToHash(current);
    await navigator.clipboard.writeText(url);
    toast.success('URL copiada al portapapeles');
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nombre del preset…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
        />
        <Button onClick={onSave} size="sm"><Save className="mr-1 h-4 w-4" /> Guardar</Button>
        <Button onClick={onShare} size="sm" variant="outline"><Copy className="mr-1 h-4 w-4" /> Compartir</Button>
      </div>
      {saved.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tienes presets guardados.</p>
      ) : (
        <ul className="space-y-1">
          {saved.map((s) => (
            <li key={s.id} className="flex items-center gap-2 rounded-md border border-border/40 px-2 py-1">
              {editing === s.id ? (
                <Input
                  autoFocus
                  defaultValue={s.name}
                  onBlur={(e) => { renameConfig(s.id, e.target.value || s.name); setEditing(null); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { renameConfig(s.id, (e.target as HTMLInputElement).value || s.name); setEditing(null); }
                    if (e.key === 'Escape') setEditing(null);
                  }}
                  className="h-7"
                />
              ) : (
                <button onClick={() => loadConfig(s.id)} className="flex-1 text-left text-sm hover:underline">
                  {s.name}
                </button>
              )}
              <Button size="icon" variant="ghost" onClick={() => setEditing(s.id)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => deleteConfig(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
