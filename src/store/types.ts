export type ShapeId =
  | 'capsule'
  | 'rectangle'
  | 'roundedRectangle'
  | 'circle'
  | 'square'
  | 'triangle'
  | 'triangleDown'
  | 'hexagon'
  | 'diamond'
  | 'star'
  | 'wave'
  | 'pentagon';

export type GradientMode = 'linear' | 'radial' | 'conic' | 'manual';
export type BackgroundMode = 'solid' | 'gradient' | 'transparent';
export type VerticalAlign = 'top' | 'center' | 'bottom';
export type ExportFormat = 'png' | 'jpg' | 'webp' | 'svg';

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0..100
}

export interface ShapeConfig {
  id: ShapeId;
  count: number;
  widthRatio: number; // 0..1 ancho relativo de cada forma respecto al slot
  heightRatio: number; // 0..1 alto relativo respecto al alto disponible
  gap: number; // espaciado relativo entre formas (0..1 del ancho del slot)
  cornerRadius: number; // 0..1 (1 = cápsula)
  heightVariation: { enabled: boolean; intensity: number }; // 0..1
  rotation: { enabled: boolean; angle: number }; // grados
}

export interface ColorsConfig {
  mode: GradientMode;
  stops: ColorStop[];
  angle: number; // grados (0 = izquierda→derecha)
  center: { x: number; y: number }; // 0..100, para radial/conic
  opacity: number; // 0..1
  perBar: boolean; // aplicar gradiente a cada barra individualmente
  manualColors: string[]; // usado en mode 'manual', longitud == count
}

export interface BackgroundConfig {
  mode: BackgroundMode;
  color: string;
  gradient: { stops: ColorStop[]; angle: number };
  vignette: number; // 0..1
}

export interface CompositionConfig {
  paddingX: number; // 0..0.5 (proporción del ancho)
  align: VerticalAlign;
  rotation: number; // -45..45 grados
  scale: number; // 0.5..1.5
}

export interface ExportConfig {
  width: number;
  height: number;
  format: ExportFormat;
  quality: number; // 0..1 (jpg/webp)
}

export interface WallpaperState {
  shape: ShapeConfig;
  colors: ColorsConfig;
  background: BackgroundConfig;
  composition: CompositionConfig;
  export: ExportConfig;
}

export interface SavedConfig {
  id: string;
  name: string;
  createdAt: number;
  state: WallpaperState;
}
