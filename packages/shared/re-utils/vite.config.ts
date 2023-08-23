import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        eslint(),
        dts({
            exclude: 'vite.config.ts',
            rollupTypes: true
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ReUtils',
            fileName: 're-utils'
        }
    }
});
