import type { FC } from 'react';
import type { ColorStop, ColorsConfig } from '@/store/types';

interface Props {
  id: string; // id del gradiente principal del row
  colors: ColorsConfig;
  // bbox de la fila completa (en coords del viewBox)
  rowX: number;
  rowY: number;
  rowWidth: number;
  rowHeight: number;
}

function sortStops(stops: ColorStop[]): ColorStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

export const GradientDefs: FC<Props> = ({ id, colors, rowX, rowY, rowWidth, rowHeight }) => {
  const stops = sortStops(colors.stops);
  if (colors.mode === 'linear') {
    // Gradiente lineal en el eje del ángulo, anclado a la fila.
    const a = (colors.angle * Math.PI) / 180;
    const cx = rowX + rowWidth / 2;
    const cy = rowY + rowHeight / 2;
    const half = Math.max(rowWidth, rowHeight) / 2;
    const dx = Math.cos(a) * half;
    const dy = Math.sin(a) * half;
    return (
      <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={cx - dx}
        y1={cy - dy}
        x2={cx + dx}
        y2={cy + dy}
      >
        {stops.map((s) => (
          <stop key={s.id} offset={`${s.position}%`} stopColor={s.color} />
        ))}
      </linearGradient>
    );
  }
  if (colors.mode === 'radial') {
    const cx = rowX + (colors.center.x / 100) * rowWidth;
    const cy = rowY + (colors.center.y / 100) * rowHeight;
    const r = Math.max(rowWidth, rowHeight) / 2;
    return (
      <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r}>
        {stops.map((s) => (
          <stop key={s.id} offset={`${s.position}%`} stopColor={s.color} />
        ))}
      </radialGradient>
    );
  }
  // conic: SVG2 no es universal — emulamos con linear como fallback de defs.
  // El renderizado real usa <foreignObject> con CSS conic-gradient en BackgroundLayer/ShapesLayer.
  return null;
};
