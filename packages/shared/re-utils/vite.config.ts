import { defineConfig } from 'vite';
import {
    alias,
    getLib,
    libPlugin,
    NodeTest
} from '../../../vite.common.config.ts';

export default defineConfig(({ command }) => ({
    plugins: [libPlugin(command)],
    resolve: {
        alias
    },
    build: {
        lib: getLib('ReUtils', 're-utils')
    },
    test: NodeTest
}));
