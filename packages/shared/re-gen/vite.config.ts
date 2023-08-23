import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        replace({
            preventAssignment: true,
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
            name: 'ReGen',
            fileName: 're-gen'
        }
    }
});
