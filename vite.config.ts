import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',
        collector: 'src/content/collector.ts',
        popup: 'src/ui/popup.ts'
      }
    }
  }
});
