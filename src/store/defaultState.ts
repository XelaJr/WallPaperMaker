import type { WallpaperState } from './types';

// "Aurora" — replica la imagen de referencia: 8 cápsulas verticales
// con degradado horizontal azul intenso → blanco hueso sobre fondo oscuro.
export const AURORA_STATE: WallpaperState = {
  shape: {
    id: 'capsule',
    count: 8,
    widthRatio: 0.65,
    heightRatio: 0.62,
    gap: 0.18,
    cornerRadius: 1,
    heightVariation: { enabled: false, intensity: 0.2 },
    rotation: { enabled: false, angle: 0 },
  },
  colors: {
    mode: 'linear',
    stops: [
      { id: 's1', color: '#0d47ff', position: 0 },
      { id: 's2', color: '#2f6dff', position: 18 },
      { id: 's3', color: '#5e8eff', position: 38 },
      { id: 's4', color: '#9bb8ff', position: 58 },
      { id: 's5', color: '#d3e0ff', position: 78 },
      { id: 's6', color: '#f3eee2', position: 100 },
    ],
    angle: 90,
    center: { x: 50, y: 50 },
    opacity: 1,
    perBar: false,
    manualColors: [],
  },
  background: {
    mode: 'solid',
    color: '#0a0d14',
    gradient: {
      stops: [
        { id: 'b1', color: '#0a0d14', position: 0 },
        { id: 'b2', color: '#11151f', position: 100 },
      ],
      angle: 180,
    },
    vignette: 0,
  },
  composition: {
    paddingX: 0.16,
    align: 'center',
    rotation: 0,
    scale: 1,
  },
  export: {
    width: 1920,
    height: 1080,
    format: 'png',
    quality: 0.95,
  },
};
