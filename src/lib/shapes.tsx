import type { FC } from 'react';
import {
  Capsule,
  Circle,
  Diamond,
  Hexagon,
  Pentagon,
  Rectangle,
  RoundedRectangle,
  Square,
  Star,
  Triangle,
  TriangleDown,
  Wave,
  type ShapeProps,
} from '@/components/canvas/shapes';
import type { ShapeId } from '@/store/types';

export interface ShapeDef {
  id: ShapeId;
  name: string;
  Component: FC<ShapeProps>;
  supportsCornerRadius: boolean;
  // si está definido, la forma fuerza esta proporción ancho/alto (1 = cuadrada)
  fixedAspectRatio?: number;
}

export const SHAPE_REGISTRY: Record<ShapeId, ShapeDef> = {
  capsule: { id: 'capsule', name: 'Cápsula', Component: Capsule, supportsCornerRadius: false },
  rectangle: { id: 'rectangle', name: 'Rectángulo', Component: Rectangle, supportsCornerRadius: false },
  roundedRectangle: {
    id: 'roundedRectangle',
    name: 'Rectángulo redondeado',
    Component: RoundedRectangle,
    supportsCornerRadius: true,
  },
  circle: { id: 'circle', name: 'Círculo', Component: Circle, supportsCornerRadius: false, fixedAspectRatio: 1 },
  square: { id: 'square', name: 'Cuadrado', Component: Square, supportsCornerRadius: true, fixedAspectRatio: 1 },
  triangle: { id: 'triangle', name: 'Triángulo', Component: Triangle, supportsCornerRadius: false },
  triangleDown: {
    id: 'triangleDown',
    name: 'Triángulo invertido',
    Component: TriangleDown,
    supportsCornerRadius: false,
  },
  hexagon: { id: 'hexagon', name: 'Hexágono', Component: Hexagon, supportsCornerRadius: false },
  diamond: { id: 'diamond', name: 'Rombo', Component: Diamond, supportsCornerRadius: false },
  star: { id: 'star', name: 'Estrella', Component: Star, supportsCornerRadius: false },
  wave: { id: 'wave', name: 'Onda', Component: Wave, supportsCornerRadius: false },
  pentagon: { id: 'pentagon', name: 'Pentágono', Component: Pentagon, supportsCornerRadius: false },
};

export const SHAPE_LIST: ShapeDef[] = Object.values(SHAPE_REGISTRY);

// Mini-preview SVG (usado en dropdown).
export function ShapePreview({ id, size = 24 }: { id: ShapeId; size?: number }) {
  const def = SHAPE_REGISTRY[id];
  const Comp = def.Component;
  const pad = size * 0.12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Comp
        x={pad}
        y={pad}
        width={size - pad * 2}
        height={size - pad * 2}
        fill="currentColor"
        cornerRadius={0.3}
      />
    </svg>
  );
}
