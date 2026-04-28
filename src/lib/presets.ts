import type { WallpaperState } from '@/store/types';
import { AURORA_STATE } from '@/store/defaultState';

export interface Preset {
  id: string;
  name: string;
  state: WallpaperState;
}

function withColors(stops: { color: string; position: number }[]): WallpaperState['colors'] {
  return {
    mode: 'linear',
    stops: stops.map((s, i) => ({ id: `s${i}`, color: s.color, position: s.position })),
    angle: 90,
    center: { x: 50, y: 50 },
    opacity: 1,
    perBar: false,
    manualColors: [],
  };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function base(overrides: DeepPartial<WallpaperState>): WallpaperState {
  return {
    shape: { ...AURORA_STATE.shape, ...(overrides.shape ?? {}) } as WallpaperState['shape'],
    colors: { ...AURORA_STATE.colors, ...(overrides.colors ?? {}) } as WallpaperState['colors'],
    background: { ...AURORA_STATE.background, ...(overrides.background ?? {}) } as WallpaperState['background'],
    composition: { ...AURORA_STATE.composition, ...(overrides.composition ?? {}) } as WallpaperState['composition'],
    export: { ...AURORA_STATE.export, ...(overrides.export ?? {}) } as WallpaperState['export'],
  };
}

export const PRESETS: Preset[] = [
  { id: 'aurora', name: 'Aurora', state: AURORA_STATE },
  {
    id: 'sunset',
    name: 'Sunset',
    state: base({
      shape: { id: 'capsule', count: 9, widthRatio: 0.6 },
      colors: withColors([
        { color: '#1b0033', position: 0 },
        { color: '#5b1a6e', position: 25 },
        { color: '#c2185b', position: 55 },
        { color: '#ff7043', position: 80 },
        { color: '#ffd180', position: 100 },
      ]),
      background: { mode: 'solid', color: '#0d0118', vignette: 0.25, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'neon',
    name: 'Neon',
    state: base({
      shape: { id: 'rectangle', count: 12, widthRatio: 0.55, gap: 0.25 },
      colors: withColors([
        { color: '#00f5d4', position: 0 },
        { color: '#00bbf9', position: 30 },
        { color: '#9b5de5', position: 65 },
        { color: '#f15bb5', position: 100 },
      ]),
      background: { mode: 'solid', color: '#05060a', vignette: 0.4, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'mono',
    name: 'Monocromo',
    state: base({
      shape: { id: 'capsule', count: 10 },
      colors: withColors([
        { color: '#1a1a1a', position: 0 },
        { color: '#f5f5f5', position: 100 },
      ]),
      background: { mode: 'solid', color: '#0a0a0a', vignette: 0, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'pastel',
    name: 'Pastel',
    state: base({
      shape: { id: 'roundedRectangle', count: 8, cornerRadius: 0.6 },
      colors: withColors([
        { color: '#ffd6e8', position: 0 },
        { color: '#d6f0ff', position: 33 },
        { color: '#e8d6ff', position: 66 },
        { color: '#fff5d6', position: 100 },
      ]),
      background: { mode: 'solid', color: '#fafafa', vignette: 0, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'ocean',
    name: 'Ocean',
    state: base({
      shape: { id: 'wave', count: 7, widthRatio: 0.7 },
      colors: withColors([
        { color: '#001233', position: 0 },
        { color: '#0466c8', position: 50 },
        { color: '#7ee8fa', position: 100 },
      ]),
      background: { mode: 'gradient', color: '#001020', vignette: 0.2,
        gradient: { angle: 180,
          stops: [
            { id: 'b1', color: '#001020', position: 0 },
            { id: 'b2', color: '#04263a', position: 100 },
          ]} }
    }),
  },
  {
    id: 'forest',
    name: 'Forest',
    state: base({
      shape: { id: 'triangle', count: 9, widthRatio: 0.85, gap: 0 },
      colors: withColors([
        { color: '#1b4332', position: 0 },
        { color: '#2d6a4f', position: 33 },
        { color: '#52b788', position: 66 },
        { color: '#d8f3dc', position: 100 },
      ]),
      background: { mode: 'solid', color: '#08130c', vignette: 0.3, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'fire',
    name: 'Fire',
    state: base({
      shape: { id: 'capsule', count: 8, heightVariation: { enabled: true, intensity: 0.4 }, rotation: { enabled: false, angle: 0 } },
      colors: withColors([
        { color: '#03071e', position: 0 },
        { color: '#9d0208', position: 30 },
        { color: '#dc2f02', position: 55 },
        { color: '#f48c06', position: 78 },
        { color: '#ffba08', position: 100 },
      ]),
      background: { mode: 'solid', color: '#0c0309', vignette: 0.45, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'mint',
    name: 'Mint',
    state: base({
      shape: { id: 'capsule', count: 8 },
      colors: withColors([
        { color: '#003322', position: 0 },
        { color: '#1aaa6e', position: 50 },
        { color: '#e8fff5', position: 100 },
      ]),
      background: { mode: 'solid', color: '#021410', vignette: 0.15, gradient: AURORA_STATE.background.gradient },
    }),
  },
  {
    id: 'dusk',
    name: 'Dusk',
    state: base({
      shape: { id: 'roundedRectangle', count: 10, cornerRadius: 0.4 },
      colors: withColors([
        { color: '#22223b', position: 0 },
        { color: '#4a4e69', position: 35 },
        { color: '#9a8c98', position: 70 },
        { color: '#f2e9e4', position: 100 },
      ]),
      background: { mode: 'gradient', color: '#0e0e1a', vignette: 0.2,
        gradient: { angle: 200,
          stops: [
            { id: 'b1', color: '#0e0e1a', position: 0 },
            { id: 'b2', color: '#1d1c2c', position: 100 },
          ]} }
    }),
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    state: base({
      shape: { id: 'star', count: 7, widthRatio: 0.75, heightVariation: { enabled: true, intensity: 0.35 }, rotation: { enabled: false, angle: 0 } },
      colors: withColors([
        { color: '#240046', position: 0 },
        { color: '#5a189a', position: 30 },
        { color: '#9d4edd', position: 60 },
        { color: '#e0aaff', position: 90 },
        { color: '#fff7ff', position: 100 },
      ]),
      background: { mode: 'solid', color: '#0a0014', vignette: 0.5, gradient: AURORA_STATE.background.gradient },
    }),
  },
];
