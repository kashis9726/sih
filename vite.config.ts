import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Base path configuration - use '/' for local development and most deployments
  // For GitHub Pages with repository name, use '/REPO_NAME/'
  base: '/',
});
