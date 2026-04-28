import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Cambiar a `/<TU-REPO>/` para tu propio fork. Ver README.
export default defineConfig({
  base: '/WallPaperMaker/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
