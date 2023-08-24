import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import {
    alias,
    componentPlugin,
    getLib,
    rollupOptions,
    server,
    tw
} from '../../../vite.common.config.ts';

export default defineConfig(({ command }) => ({
    plugins: [componentPlugin(command)],
    resolve: { alias },
    server,
    css: {
        postcss: {
            plugins: [tw, autoprefixer]
        }
    },
    build: {
        lib: getLib('ReFormFilter', 're-form-filter'),
        rollupOptions
    }
}));
