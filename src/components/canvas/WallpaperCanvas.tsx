import { forwardRef } from 'react';
import type { WallpaperState } from '@/store/types';
import { BackgroundLayer, Vignette } from './BackgroundLayer';
import { ShapesLayer } from './ShapesLayer';

interface Props {
  state: WallpaperState;
  // Si true, renderiza con tamaños CSS para preview (responsive).
  preview?: boolean;
}

export const WallpaperCanvas = forwardRef<SVGSVGElement, Props>(function WallpaperCanvas(
  { state, preview = true },
  ref,
) {
  const { width, height } = state.export;
  const props = preview
    ? {
        width: '100%' as const,
        height: '100%' as const,
        preserveAspectRatio: 'xMidYMid meet' as const,
      }
    : { width, height };
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <BackgroundLayer bg={state.background} width={width} height={height} />
      <ShapesLayer state={state} width={width} height={height} />
      <Vignette amount={state.background.vignette} width={width} height={height} />
    </svg>
  );
});
