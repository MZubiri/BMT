import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/habbo': {
        target: 'https://www.habbo.es/api/public',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/habbo/, ''),
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
