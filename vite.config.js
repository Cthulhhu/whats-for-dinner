import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize bundle size
    minify: 'terser',
    cssMinify: true,
    // Generate source maps for better debugging
    sourcemap: true,
    // Improve chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons'],
        }
      }
    },
    // Ensure we don't exceed size limits
    chunkSizeWarningLimit: 1000
  },
  // Optimize for production
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-icons']
  },
  // Handle CORS for API requests
  server: {
    proxy: {
      '/api': {
        target: 'https://api.edamam.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});