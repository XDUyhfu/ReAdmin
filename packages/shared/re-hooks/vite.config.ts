import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import { alias, getLib, rollupOptions } from '../../../vite.common.config.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ command }) => ({
    plugins: [
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(
                command === 'build' ? 'production' : 'development'
            )
        }),
        eslint(),
        dts({
            exclude: 'vite.config.ts',
            rollupTypes: true
        })
    ],
    resolve: {
        alias
    },
    build: {
        lib: getLib('ReUtils', 're-utils'),
        rollupOptions
    }
}));
