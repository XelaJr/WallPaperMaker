import type { FC } from 'react';
import type { WallpaperState } from '@/store/types';
import { SHAPE_REGISTRY } from '@/lib/shapes';
import { GradientDefs } from './GradientDefs';

interface Props {
  state: WallpaperState;
  width: number;
  height: number;
}

interface SlotGeom {
  x: number;
  y: number;
  width: number;
  height: number;
}

function computeSlots(state: WallpaperState, width: number, height: number): SlotGeom[] {
  const { shape, composition } = state;
  const def = SHAPE_REGISTRY[shape.id];
  const padX = composition.paddingX * width;
  const innerW = (width - padX * 2) * composition.scale;
  const startX = (width - innerW) / 2;

  const count = Math.max(1, shape.count);
  const slotW = innerW / count;
  const itemW = slotW * shape.widthRatio;
  let itemH = height * shape.heightRatio;
  if (def.fixedAspectRatio) itemH = itemW * def.fixedAspectRatio;

  const slots: SlotGeom[] = [];
  for (let i = 0; i < count; i++) {
    const cxSlot = startX + slotW * (i + 0.5);
    let h = itemH;
    if (shape.heightVariation.enabled) {
      // patrón ecualizador: una sinusoidal sobre el índice
      const t = (i / Math.max(1, count - 1)) * Math.PI * 2;
      const factor = 1 - shape.heightVariation.intensity * (1 - (Math.sin(t) + 1) / 2);
      h = itemH * factor;
    }
    let yTop: number;
    switch (composition.align) {
      case 'top': yTop = 0; break;
      case 'bottom': yTop = height - h; break;
      default: yTop = (height - h) / 2; break;
    }
    slots.push({ x: cxSlot - itemW / 2, y: yTop, width: itemW, height: h });
  }
  return slots;
}

export const ShapesLayer: FC<Props> = ({ state, width, height }) => {
  const { shape, colors, composition } = state;
  const def = SHAPE_REGISTRY[shape.id];
  const Comp = def.Component;
  const slots = computeSlots(state, width, height);
  if (slots.length === 0) return null;

  const rowMinX = Math.min(...slots.map((s) => s.x));
  const rowMaxX = Math.max(...slots.map((s) => s.x + s.width));
  const rowMinY = Math.min(...slots.map((s) => s.y));
  const rowMaxY = Math.max(...slots.map((s) => s.y + s.height));
  const rowWidth = rowMaxX - rowMinX;
  const rowHeight = rowMaxY - rowMinY;

  const gradId = 'wp-shape-grad';
  const isLinearOrRadial = colors.mode === 'linear' || colors.mode === 'radial';

  function fillFor(idx: number): string {
    if (colors.mode === 'manual') {
      const c = colors.manualColors[idx % colors.manualColors.length] ?? '#ffffff';
      return c;
    }
    if (colors.mode === 'conic') {
      // fallback: usar un color por barra basado en stops interpolados
      return interpolateStops(colors.stops, (idx + 0.5) / slots.length);
    }
    if (colors.perBar) {
      return `url(#${gradId}-${idx})`;
    }
    return `url(#${gradId})`;
  }

  const groupTransform = composition.rotation
    ? `rotate(${composition.rotation} ${width / 2} ${height / 2})`
    : undefined;

  return (
    <g transform={groupTransform} opacity={colors.opacity}>
      <defs>
        {isLinearOrRadial && !colors.perBar && (
          <GradientDefs
            id={gradId}
            colors={colors}
            rowX={rowMinX}
            rowY={rowMinY}
            rowWidth={rowWidth}
            rowHeight={rowHeight}
          />
        )}
        {isLinearOrRadial &&
          colors.perBar &&
          slots.map((slot, i) => (
            <GradientDefs
              key={i}
              id={`${gradId}-${i}`}
              colors={colors}
              rowX={slot.x}
              rowY={slot.y}
              rowWidth={slot.width}
              rowHeight={slot.height}
            />
          ))}
      </defs>
      {slots.map((slot, i) => (
        <Comp
          key={i}
          x={slot.x}
          y={slot.y}
          width={slot.width}
          height={slot.height}
          fill={fillFor(i)}
          cornerRadius={shape.cornerRadius}
          rotation={shape.rotation.enabled ? shape.rotation.angle : undefined}
        />
      ))}
    </g>
  );
};

function interpolateStops(
  stops: { color: string; position: number }[],
  t: number,
): string {
  if (stops.length === 0) return '#ffffff';
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const target = t * 100;
  if (target <= sorted[0].position) return sorted[0].color;
  if (target >= sorted[sorted.length - 1].position) return sorted[sorted.length - 1].color;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    if (target >= a.position && target <= b.position) {
      const k = (target - a.position) / (b.position - a.position);
      return mixHex(a.color, b.color, k);
    }
  }
  return sorted[0].color;
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseHex(a), pb = parseHex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}
function parseHex(h: string): [number, number, number] {
  const v = h.replace('#', '');
  const n = parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
