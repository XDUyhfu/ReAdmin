import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import stylelint from 'vite-plugin-stylelint';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { alias, server, tailwind } from '../../../vite.common.config.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        stylelint({
            exclude: ['node_modules'],
            cache: false
        }),
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],
    resolve: {
        alias
    },
    server,
    css: {
        postcss: {
            plugins: [tailwind, autoprefixer]
        }
    }
});
