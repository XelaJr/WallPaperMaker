import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedConfig, WallpaperState } from './types';
import { AURORA_STATE } from './defaultState';
import { uid } from '@/lib/utils';

const HISTORY_LIMIT = 30;

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

interface Store {
  current: WallpaperState;
  past: WallpaperState[];
  future: WallpaperState[];
  saved: SavedConfig[];
  panelHidden: boolean;
  theme: 'dark' | 'light';

  set: (patch: DeepPartial<WallpaperState>) => void;
  replace: (state: WallpaperState) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;

  saveConfig: (name: string) => void;
  loadConfig: (id: string) => void;
  renameConfig: (id: string, name: string) => void;
  deleteConfig: (id: string) => void;

  togglePanel: () => void;
  toggleTheme: () => void;
}

function deepMerge<T>(target: T, patch: DeepPartial<T>): T {
  if (patch === null || patch === undefined) return target;
  if (typeof target !== 'object' || target === null || Array.isArray(target)) {
    return (patch as T) ?? target;
  }
  const result: Record<string, unknown> = { ...(target as Record<string, unknown>) };
  for (const key of Object.keys(patch)) {
    const tv = (target as Record<string, unknown>)[key];
    const pv = (patch as Record<string, unknown>)[key];
    if (
      pv !== null &&
      typeof pv === 'object' &&
      !Array.isArray(pv) &&
      tv !== null &&
      typeof tv === 'object' &&
      !Array.isArray(tv)
    ) {
      result[key] = deepMerge(tv, pv as DeepPartial<typeof tv>);
    } else {
      result[key] = pv;
    }
  }
  return result as T;
}

function pushHistory(past: WallpaperState[], snap: WallpaperState): WallpaperState[] {
  const next = [...past, snap];
  if (next.length > HISTORY_LIMIT) next.shift();
  return next;
}

export const useWallpaperStore = create<Store>()(
  persist(
    (setState, get) => ({
      current: AURORA_STATE,
      past: [],
      future: [],
      saved: [],
      panelHidden: false,
      theme: 'dark',

      set: (patch) => {
        const { current, past } = get();
        const next = deepMerge(current, patch);
        setState({ current: next, past: pushHistory(past, current), future: [] });
      },

      replace: (state) => {
        const { current, past } = get();
        setState({ current: state, past: pushHistory(past, current), future: [] });
      },

      reset: () => {
        const { current, past } = get();
        setState({
          current: AURORA_STATE,
          past: pushHistory(past, current),
          future: [],
        });
      },

      undo: () => {
        const { past, current, future } = get();
        if (past.length === 0) return;
        const prev = past[past.length - 1];
        setState({
          current: prev,
          past: past.slice(0, -1),
          future: [current, ...future].slice(0, HISTORY_LIMIT),
        });
      },

      redo: () => {
        const { future, current, past } = get();
        if (future.length === 0) return;
        const next = future[0];
        setState({
          current: next,
          past: pushHistory(past, current),
          future: future.slice(1),
        });
      },

      saveConfig: (name) => {
        const { saved, current } = get();
        const entry: SavedConfig = {
          id: uid(),
          name,
          createdAt: Date.now(),
          state: current,
        };
        setState({ saved: [entry, ...saved] });
      },

      loadConfig: (id) => {
        const entry = get().saved.find((s) => s.id === id);
        if (entry) get().replace(entry.state);
      },

      renameConfig: (id, name) => {
        setState({
          saved: get().saved.map((s) => (s.id === id ? { ...s, name } : s)),
        });
      },

      deleteConfig: (id) => {
        setState({ saved: get().saved.filter((s) => s.id !== id) });
      },

      togglePanel: () => setState({ panelHidden: !get().panelHidden }),
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        document.documentElement.classList.toggle('light', next === 'light');
        setState({ theme: next });
      },
    }),
    {
      name: 'wallpaper-v1',
      partialize: (s) => ({ current: s.current, saved: s.saved, theme: s.theme }),
    },
  ),
);
