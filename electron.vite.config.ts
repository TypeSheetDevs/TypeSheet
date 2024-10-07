import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        root: 'src/',
        build: {
            rollupOptions: {
                input: 'src/index.html',
            },
        },
        resolve: {
            alias: {
                '@renderer': resolve('src'),
                '@assets': resolve('src/assets'),
                '@components': resolve('src/components'),
                '@context': resolve('src/context'),
                '@data': resolve('src/data'),
                '@hooks': resolve('src/hooks'),
                '@layouts': resolve('src/layouts'),
                '@utils': resolve('src/utils'),
            },
        },
        plugins: [react()],
    },
});
