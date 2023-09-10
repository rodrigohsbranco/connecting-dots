import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from 'vite-plugin-pages';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': '/src/',
    },
  },
  build: {
    outDir: 'ligar_pontos'
  },
  plugins: [
    vue(),
    Pages({
      pagesDir: 'src/pages',
      extensions: ['vue'],
      exclude: ["**/components/*.vue"],
    }),
  ],
  server: {
    open: 'index.html',
  },

});
