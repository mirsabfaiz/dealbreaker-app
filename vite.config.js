import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
// Same short hash style as scripts/stamp-sw.js so the in-app build tag
// matches the cache key. Easy correlation when a tester reports a bug.
const buildHash = Date.now().toString(36)

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
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD__: JSON.stringify(buildHash),
    // Set to "false" for production releases. Today we're in beta, so the
    // BETA pill + feedback prompts surface by default.
    __IS_BETA__: JSON.stringify(true),
  },
})
