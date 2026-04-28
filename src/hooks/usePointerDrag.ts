import { useEffect, useRef } from 'react';

export interface DragOffset { x: number; y: number; }

export function usePointerDrag(
  handleRef: React.RefObject<HTMLElement>,
  onDelta: (delta: DragOffset) => void,
): void {
  const startRef = useRef<DragOffset | null>(null);
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;
    function onDown(e: PointerEvent) {
      if (e.button !== 0) return;
      startRef.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!startRef.current) return;
      onDelta({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
      startRef.current = { x: e.clientX, y: e.clientY };
    }
    function onUp() { startRef.current = null; }
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [handleRef, onDelta]);
}
