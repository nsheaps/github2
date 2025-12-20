import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/github-rate-limit-viewer/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
