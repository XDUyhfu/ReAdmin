import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import stylelint from 'vite-plugin-stylelint';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig(({ command }) => ({
    plugins: [
        react(),
        replace({
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
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
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
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            name: 'ReFormFilter',
            fileName: 're-form-filter'
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'antd'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    antd: 'antd'
                }
            }
        }
    }
}));
