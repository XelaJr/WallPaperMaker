import { useId, type FC } from 'react';
import type { BackgroundConfig } from '@/store/types';

interface Props {
  bg: BackgroundConfig;
  width: number;
  height: number;
}

export const BackgroundLayer: FC<Props> = ({ bg, width, height }) => {
  const rawId = useId();
  const id = `wp-bg-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (bg.mode === 'transparent') return null;
  if (bg.mode === 'solid') {
    return <rect x={0} y={0} width={width} height={height} fill={bg.color} />;
  }
  const { stops, angle } = bg.gradient;
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const a = (angle * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const half = Math.max(width, height) / 2;
  const dx = Math.cos(a) * half;
  const dy = Math.sin(a) * half;
  return (
    <>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={cx - dx}
          y1={cy - dy}
          x2={cx + dx}
          y2={cy + dy}
        >
          {sorted.map((s) => (
            <stop key={s.id} offset={`${s.position}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill={`url(#${id})`} />
    </>
  );
};

export const Vignette: FC<{ amount: number; width: number; height: number }> = ({
  amount,
  width,
  height,
}) => {
  const rawId = useId();
  const id = `wp-vignette-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (amount <= 0) return null;
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={amount} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill={`url(#${id})`} />
    </>
  );
};
