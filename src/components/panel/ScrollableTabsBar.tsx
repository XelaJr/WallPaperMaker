import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * Wrapper de TabsList con scroll horizontal que muestra fades + flechas
 * en los bordes cuando hay contenido oculto. Soluciona la falta de pista
 * visual de "hay más tabs, deslizá" en móvil.
 */
export function ScrollableTabsBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      setCanLeft(el.scrollLeft > 2);
      setCanRight(el.scrollLeft < max - 2);
    }
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  function scrollBy(delta: number) {
    ref.current?.scrollBy({ left: delta, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <TabsList
        ref={ref}
        className="flex h-9 w-full justify-start gap-0.5 overflow-x-auto whitespace-nowrap p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </TabsList>
      {/* Fade + chevron izquierdo */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-start rounded-l-lg bg-gradient-to-r from-popover via-popover/80 to-transparent transition-opacity',
          canLeft ? 'opacity-100' : 'opacity-0',
        )}
      >
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-120)}
          className="pointer-events-auto ml-0.5 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      {/* Fade + chevron derecho */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-end rounded-r-lg bg-gradient-to-l from-popover via-popover/80 to-transparent transition-opacity',
          canRight ? 'opacity-100' : 'opacity-0',
        )}
      >
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollBy(120)}
          className="pointer-events-auto mr-0.5 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
