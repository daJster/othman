import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
  server: {
    port: 8080,
    proxy: {
        '/cdn': {
          target: 'https://cdn.kuttab-othman.workers.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cdn/, ''),
        },
      },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
