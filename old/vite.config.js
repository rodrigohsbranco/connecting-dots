import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    // base: './',
    resolve: {
        alias: {
            '@': '/src/',
        },
    },
    build: {
        outDir: 'ligar_pontos'
    },
    plugins: [vue()],
})
