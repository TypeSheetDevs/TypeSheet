import path, { resolve } from 'path';
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
                '@assets': resolve('src/assets'),
                '@components': resolve('src/components'),
                '@context': resolve('src/context'),
                '@data': resolve('src/data'),
                '@hooks': resolve('src/hooks'),
                '@layouts': resolve('src/layouts'),
                '@utils': resolve('src/utils'),
                '@services': resolve('src/services'),
            },
        },
        plugins: [react()],
        css: {
            modules: {
                generateScopedName: (className, filePath, css) => {
                    const classNameIndex = css.indexOf(`.${className}`);
                    const lineNumber = css.substring(0, classNameIndex).split(/\r?\n/).length;
                    const fileName = path.basename(filePath, 'styles.module.css').split('.')[0];
                    const prefix = 'm_';

                    return `${prefix}${fileName}_${className}_${lineNumber}`;
                },
                localsConvention: 'camelCase',
            },
        },
    },
});
