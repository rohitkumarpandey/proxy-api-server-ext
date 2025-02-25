import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'index-[hash].js',
        assetFileNames(chunkInfo) {
          for (const fileName of chunkInfo.names) {
            if (fileName.endsWith('.css')) {
              return `${fileName}`
            }
            if (fileName.endsWith('.svg')) {
              return `${fileName}`
            }
            return `${fileName}`
          }
          return ''
        }
      }
    }
  }
})
