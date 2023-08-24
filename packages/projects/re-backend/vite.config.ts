import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import {
    alias,
    projectPlugin,
    server,
    tw
} from '../../../vite.common.config.ts';

export default defineConfig({
    plugins: [projectPlugin()],
    resolve: {
        alias
    },
    server,
    css: {
        postcss: {
            plugins: [tw, autoprefixer]
        }
    }
});
