import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Base path configuration for GitHub Pages deployment
  // Repository name: aluverse93
  base: process.env.NODE_ENV === 'production' ? '/aluverse93/' : '/',
});
