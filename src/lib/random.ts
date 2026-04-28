import type { ShapeId, WallpaperState } from '@/store/types';
import { AURORA_STATE } from '@/store/defaultState';
import { hslToHex } from './colors';
import { uid } from './utils';
import { SHAPE_LIST } from './shapes';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function harmonicHues(base: number, scheme: 'analogous' | 'triad' | 'mono' | 'comp'): number[] {
  switch (scheme) {
    case 'analogous': return [base - 30, base - 15, base, base + 15, base + 30];
    case 'triad': return [base, base + 120, base + 240];
    case 'mono': return [base, base, base, base, base];
    case 'comp': return [base, base + 30, base + 180, base + 210];
  }
}

export function randomState(): WallpaperState {
  const baseHue = rand(0, 360);
  const scheme = pick(['analogous', 'triad', 'mono', 'comp'] as const);
  const hues = harmonicHues(baseHue, scheme);
  const sat = rand(55, 90);
  const stops = hues.map((h, i) => ({
    id: uid(),
    color: hslToHex(h, sat, 30 + (i * 60) / Math.max(1, hues.length - 1)),
    position: Math.round((i / (hues.length - 1)) * 100),
  }));
  const shapeIds: ShapeId[] = SHAPE_LIST.map((s) => s.id);
  const shape = pick(shapeIds);
  const bgL = rand(3, 12);
  return {
    ...AURORA_STATE,
    shape: {
      ...AURORA_STATE.shape,
      id: shape,
      count: Math.floor(rand(5, 16)),
      widthRatio: rand(0.45, 0.85),
      heightRatio: rand(0.4, 0.85),
      gap: rand(0.05, 0.3),
      cornerRadius: rand(0, 1),
      heightVariation: { enabled: Math.random() < 0.4, intensity: rand(0.1, 0.5) },
      rotation: { enabled: false, angle: 0 },
    },
    colors: {
      mode: pick(['linear', 'linear', 'radial', 'manual'] as const),
      stops,
      angle: pick([0, 45, 90, 135, 180]),
      center: { x: rand(20, 80), y: rand(20, 80) },
      opacity: 1,
      perBar: Math.random() < 0.2,
      manualColors: stops.map((s) => s.color),
    },
    background: {
      mode: 'solid',
      color: hslToHex(baseHue, rand(20, 50), bgL),
      gradient: AURORA_STATE.background.gradient,
      vignette: rand(0, 0.35),
    },
  };
}
