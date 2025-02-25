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
            return `${fileName}`;
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
