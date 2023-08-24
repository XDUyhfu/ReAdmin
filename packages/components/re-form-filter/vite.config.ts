import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import stylelint from 'vite-plugin-stylelint';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import autoprefixer from 'autoprefixer';
import {
    alias,
    getLib,
    rollupOptions,
    server,
    tailwind
} from '../../../vite.common.config.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ command }) => ({
    plugins: [
        react(),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(
                command === 'build' ? 'production' : 'development'
            )
        }),
        eslint(),
        stylelint({
            cache: false,
            fix: true
        }),
        cssInjectedByJsPlugin(),
        dts({
            exclude: 'vite.config.ts',
            rollupTypes: true
        })
    ],
    resolve: { alias },
    server,
    css: {
        postcss: {
            plugins: [tailwind, autoprefixer]
        }
    },
    build: {
        lib: getLib('ReFormFilter', 're-form-filter'),
        rollupOptions
    }
}));
