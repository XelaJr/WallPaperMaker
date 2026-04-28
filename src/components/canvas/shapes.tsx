import type { FC } from 'react';

export interface ShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  opacity?: number;
  cornerRadius?: number; // 0..1
  rotation?: number; // grados sobre el centro
}

function transform(x: number, y: number, w: number, h: number, rot?: number): string | undefined {
  if (!rot) return undefined;
  return `rotate(${rot} ${x + w / 2} ${y + h / 2})`;
}

function poly(points: [number, number][]): string {
  return points.map(([px, py]) => `${px},${py}`).join(' ');
}

export const Capsule: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const r = Math.min(width, height) / 2;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={r}
      ry={r}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Rectangle: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}
    opacity={opacity}
    transform={transform(x, y, width, height, rotation)}
  />
);

export const RoundedRectangle: FC<ShapeProps> = ({
  x,
  y,
  width,
  height,
  fill,
  opacity,
  cornerRadius = 0.2,
  rotation,
}) => {
  const r = (Math.min(width, height) / 2) * cornerRadius;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={r}
      ry={r}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Circle: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const r = Math.min(width, height) / 2;
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Square: FC<ShapeProps> = ({
  x,
  y,
  width,
  height,
  fill,
  opacity,
  cornerRadius = 0,
  rotation,
}) => {
  const side = Math.min(width, height);
  const sx = x + (width - side) / 2;
  const sy = y + (height - side) / 2;
  const r = (side / 2) * cornerRadius;
  return (
    <rect
      x={sx}
      y={sy}
      width={side}
      height={side}
      rx={r}
      ry={r}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Triangle: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const points = poly([
    [x + width / 2, y],
    [x + width, y + height],
    [x, y + height],
  ]);
  return (
    <polygon
      points={points}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const TriangleDown: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const points = poly([
    [x, y],
    [x + width, y],
    [x + width / 2, y + height],
  ]);
  return (
    <polygon
      points={points}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Hexagon: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  // Hexágono punta arriba/abajo
  const cx = x + width / 2;
  const cy = y + height / 2;
  const w = width / 2;
  const h = height / 2;
  const points = poly([
    [cx, cy - h],
    [cx + w, cy - h / 2],
    [cx + w, cy + h / 2],
    [cx, cy + h],
    [cx - w, cy + h / 2],
    [cx - w, cy - h / 2],
  ]);
  return (
    <polygon
      points={points}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Diamond: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const points = poly([
    [cx, y],
    [x + width, cy],
    [cx, y + height],
    [x, cy],
  ]);
  return (
    <polygon
      points={points}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Star: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const rOuter = Math.min(width, height) / 2;
  const rInner = rOuter * 0.42;
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return (
    <polygon
      points={poly(pts)}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Wave: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  // Forma vertical sinusoidal: como una cápsula con bordes laterales ondulados.
  const cycles = 3;
  const amp = width * 0.18;
  const segments = 24;
  const right: [number, number][] = [];
  const left: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const py = y + t * height;
    const offset = Math.sin(t * Math.PI * 2 * cycles) * amp;
    right.push([x + width - offset, py]);
    left.push([x + offset, y + height - t * height]);
  }
  const path = `M ${right[0][0]} ${right[0][1]} ` +
    right.slice(1).map((p) => `L ${p[0]} ${p[1]}`).join(' ') +
    ` ` + left.map((p) => `L ${p[0]} ${p[1]}`).join(' ') + ' Z';
  return (
    <path
      d={path}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};

export const Pentagon: FC<ShapeProps> = ({ x, y, width, height, fill, opacity, rotation }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const w = width / 2;
  const h = height / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    pts.push([cx + Math.cos(angle) * w, cy + Math.sin(angle) * h]);
  }
  return (
    <polygon
      points={poly(pts)}
      fill={fill}
      opacity={opacity}
      transform={transform(x, y, width, height, rotation)}
    />
  );
};
