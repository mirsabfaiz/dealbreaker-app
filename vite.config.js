import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production hardening:
// - No source maps in the built bundle (would expose original React source).
// - Drop all console.* and debugger calls — they're a quiet info leak in
//   production WebViews and APKs that someone reverse-engineers.
// - Inline asset limit kept conservative.
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: 'esbuild',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
