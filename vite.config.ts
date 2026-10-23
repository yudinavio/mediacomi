import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend-only прототип: никаких серверных API не используется.
export default defineConfig({
  plugins: [react()],
  base: './', // относительные пути — удобно для статического хостинга
  build: {
    outDir: 'dist',
  },
});
