# Decisiones de diseño

Decisiones tomadas durante la primera implementación cuando el spec era ambiguo.

## Stack

- **Vite 5 + React 18 + TypeScript estricto**, sin Next.js (incompatible con GH Pages estático).
- **Tailwind v3 + shadcn/ui** copiando manualmente solo los primitivos que se usan (button, slider, tabs, select, switch, popover, input, label). Evita arrastrar el catálogo entero.
- **Toasts:** `sonner` en vez de `@radix-ui/react-toast` por ser más liviano.
- **Drag del panel:** hook propio basado en `pointer events` y `setPointerCapture`. No se añade `@dnd-kit` para un solo panel.
- **Hash routing:** lectura/escritura directa de `location.hash`, sin `react-router`.
- **Animaciones:** transiciones CSS y `tailwindcss-animate`. No se incluye Framer Motion.
- **Compresión URL:** `lz-string` con `compressToEncodedURIComponent`.

## Estado y persistencia

- **Zustand + middleware `persist`** con clave `wallpaper-v1` en `localStorage`.
- **Historial undo/redo:** propio dentro del store, array circular limitado a 30 entradas. No se usó `zundo` para mantener el bundle pequeño.
- El historial **no** se persiste; al recargar empiezas con historial vacío para evitar saltos extraños.

## Render y formas

- Cada forma es un componente SVG en `src/components/canvas/shapes.tsx` con la misma firma `{ x, y, width, height, fill, opacity, cornerRadius?, rotation? }`. Esto permite intercambiarlas sin cambios en el `ShapesLayer`.
- `SHAPE_REGISTRY` en `src/lib/shapes.tsx` centraliza nombre, componente, soporte de esquinas y proporción fija. El dropdown del UI lo recorre — añadir una forma nueva consiste en agregar un componente y un entry en el registry.
- Las formas con proporción fija (Círculo, Cuadrado) ignoran el slider de altura.
- **Wave**: implementada como `<path>` con bordes laterales sinusoidales (no `<rect>`).
- Triángulos / hexágono / pentágono / estrella / rombo: `<polygon>` con puntos calculados.

## Gradientes

- **Linear y Radial** se generan con `<linearGradient>` / `<radialGradient>` SVG en coords `userSpaceOnUse`, ancladas a la bounding box de la fila completa o de cada barra (modo `perBar`).
- **Conic:** SVG2 no es universalmente soportado, así que en modo cónico se renderiza interpolando los stops y asignando un color por barra (efecto similar al ecualizador). Más portable y fiel al export.
- **Manual:** un color por barra editable individualmente; se rellena con blanco para barras sin color asignado.

## Export

- **SVG**: serialización con `renderToStaticMarkup` del componente `WallpaperCanvas` con `preview=false` (usa `width`/`height` en píxels). Vite empaqueta `react-dom/server` para browser, sin dependencias extra.
- **PNG/JPG/WebP**: serializar SVG → `Blob` → `Image` → dibujar en `<canvas>` con `width/height` exactos (sin DPR ni escalados). `canvas.toBlob` con MIME y calidad.
- **JPG con fondo transparente**: se rellena el canvas con blanco antes de dibujar y se muestra un toast de aviso.
- Antialiasing: `shapeRendering="geometricPrecision"` en el SVG raíz.

## Despliegue en GitHub Pages

- `vite.config.ts` con `base: '/WallPaperMaker/'`. README explica cómo cambiarlo en forks.
- `public/404.html` redirige cualquier ruta a `/<base>/` preservando el hash (técnica spa-github-pages). Si cambias el `base`, también edítalo aquí.
- Workflow `.github/workflows/deploy.yml` usa `actions/deploy-pages@v4` con setup-node 20.

## UX

- Panel inicia centrado arriba con `top: 16px`. Al ocultar (atajo `H`) se muestra un botón flotante "Mostrar panel" arriba a la derecha.
- `Ctrl+S` guarda con un nombre auto-generado (`Config N`); para nombrarlo manualmente usa la pestaña Presets.
- Atajos: `R` random, `D` descargar, `H` ocultar, `Ctrl+Z`/`Ctrl+Y` o `Ctrl+Shift+Z` undo/redo, `Ctrl+S` guardar.
- Tema dark por defecto, toggle en el header del panel.

## Preset por defecto ("Aurora")

- 8 cápsulas, gradiente lineal horizontal: `#0d47ff → #2f6dff → #5e8eff → #9bb8ff → #d3e0ff → #f3eee2`.
- Fondo sólido `#0a0d14`. Padding horizontal 16%, ancho/alto de cápsula 65%/62%, gap 18%.
- Coincide visualmente con la imagen de referencia del usuario.
