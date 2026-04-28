# Wallpaper Maker

Made by @XelaJr

Generador estático de wallpapers personalizables (formas + gradientes) que corre 100 % en el navegador. Pensado para desplegar en **GitHub Pages**: sin servidor, sin SSR.

## Stack

- Vite 5 + React 18 + TypeScript estricto
- Tailwind CSS + shadcn/ui (manual, solo los primitivos usados)
- Render: SVG puro (componentes React)
- Export: SVG nativo + rasterización a PNG / JPG / WebP con `<canvas>`
- Estado: Zustand + persist (localStorage) + historial undo/redo de 30
- Compartir: estado serializado a `#config=…` con `lz-string`

## Uso local

```bash
npm install
npm run dev
npm run build      # genera dist/
npm run preview    # sirve dist/ con la base de producción
```

## Atajos

| Tecla        | Acción            |
| ------------ | ----------------- |
| `R`          | Aleatorio         |
| `D`          | Descargar         |
| `H`          | Ocultar / mostrar panel |
| `Ctrl+S`     | Guardar preset    |
| `Ctrl+Z`     | Deshacer          |
| `Ctrl+Y`     | Rehacer           |

## Cómo desplegar en tu GitHub Pages

1. **Forkea o cloná** este repo. Si vas a usarlo bajo otro nombre, hace rename del repo.
2. **Editá `vite.config.ts`**:
   ```ts
   base: '/<TU-REPO>/',
   ```
   (si estás publicando como `<usuario>.github.io` raíz, usa `base: '/'`).
3. **Editá `public/404.html`** — cambia la línea `window.location.replace('/WallPaperMaker/' + …)` por tu `base`.
4. **Subí a `main`**. El workflow `.github/workflows/deploy.yml` corre automáticamente.
5. En GitHub: **Settings → Pages → Source → GitHub Actions**.
6. Tras el primer despliegue, tu sitio queda en `https://<usuario>.github.io/<TU-REPO>/`.

## Estructura

```
src/
  components/canvas/   # SVG raíz, gradientes, formas
  components/panel/    # panel flotante + tabs
  components/ui/       # shadcn primitives
  hooks/               # drag, atajos, hash sync
  lib/                 # shapes registry, export, presets, random, share
  store/               # Zustand + tipos + estado por defecto (Aurora)
```

## Roadmap

- Soporte para imágenes/textura de fondo.
- Más patrones (grid, mosaico, espiral).
- Modo "ecualizador animado" para preview (render estático en export).
- Watermark opcional con fuentes custom.

## Decisiones de diseño

Ver [DECISIONS.md](./DECISIONS.md).
