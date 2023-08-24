import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import stylelint from 'vite-plugin-stylelint';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { alias } from '../../../vite.common.config.ts';
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
    server: {
        open: true,
        host: '0.0.0.0'
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss({
                    config: '../../../tailwind.config.js'
                }),
                autoprefixer
            ]
        }
    }
});
