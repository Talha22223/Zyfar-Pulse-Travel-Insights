import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fix Recharts + Lodash issue
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      lodash: 'lodash-es'
    }
  },
  optimizeDeps: {
    include: ['recharts', 'lodash-es']
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
