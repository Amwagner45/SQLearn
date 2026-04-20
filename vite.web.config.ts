import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: '.',
    base: './',
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@renderer': path.resolve(__dirname, 'src/renderer'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.web.html'),
        },
    },
    assetsInclude: ['**/*.db'],
});
