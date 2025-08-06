import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { cp } from 'fs/promises';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle: async () => {
        await cp(
          path.resolve(__dirname, 'dist/index.html'),
          path.resolve(__dirname, 'dist/404.html')
        )
      }
    }
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer', 'process']
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
  publicDir: 'public',
});