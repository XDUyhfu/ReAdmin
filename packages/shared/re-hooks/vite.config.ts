import { defineConfig } from 'vite';
import {
    alias,
    DOMTest,
    getLib,
    libPlugin,
    rollupOptions
} from '../../../vite.common.config.ts';

export default defineConfig(({ command }) => ({
    plugins: [libPlugin(command)],
    resolve: {
        alias
    },
    build: {
        lib: getLib('ReUtils', 're-utils'),
        rollupOptions
    },
    test: DOMTest
}));
