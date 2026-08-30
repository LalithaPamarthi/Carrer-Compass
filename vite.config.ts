import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact()
  ],
});
git add vite.config.ts
git commit -m "fix: remove redundant nitro plugin from vite config"
git push origin main
