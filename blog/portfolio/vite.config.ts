import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served by the Hexo site at /portfolio/. The build lands in the site's
// source tree, which _config.yml's skip_render copies through untouched.
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  build: {
    outDir: '../source/portfolio',
    emptyOutDir: true,
    assetsDir: 'assets'
  }
});
