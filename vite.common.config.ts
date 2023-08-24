import path from 'path';
import tailwindcss from 'tailwindcss';
import react from '@vitejs/plugin-react';
import stylelint from 'vite-plugin-stylelint';
import legacy from '@vitejs/plugin-legacy';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import replace from '@rollup/plugin-replace';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

const ConfigPathMap = {
    alias: {
        '@re-utils': path.resolve(__dirname, './packages/shared/re-utils/src'),
        '@re-hooks': path.resolve(__dirname, './packages/shared/re-hooks/src'),
        '@re-gen': path.resolve(__dirname, './packages/shared/re-gen/src'),
        '@re-form-filter': path.resolve(
            __dirname,
            './packages/components/re-form-filter/src'
        ),
        '@re-backend': path.resolve(
            __dirname,
            './packages/projects/re-backend/src'
        )
    },
    lib: {
        're-utils': path.resolve(
            __dirname,
            './packages/shared/re-utils/src/index.ts'
        ),
        're-hooks': path.resolve(
            __dirname,
            './packages/shared/re-hooks/src/index.ts'
        ),
        're-gen': path.resolve(
            __dirname,
            './packages/shared/re-gen/src/index.ts'
        ),
        're-form-filter': path.resolve(
            __dirname,
            './packages/components/re-form-filter/src/index.ts'
        ),
        're-backend': path.resolve(
            __dirname,
            './packages/projects/re-backend/src/index.ts'
        )
    }
};

export const alias = ConfigPathMap.alias;

type EntryList = keyof (typeof ConfigPathMap)['lib'];

export const getLib = (
    name: string,
    fileName: EntryList,
    entry?: string
): {
    entry: string;
    name: string;
    fileName: string;
} => ({
    entry: entry ?? ConfigPathMap['lib'][fileName],
    name,
    fileName
});

export const rollupOptions = {
    external: ['react', 'react-dom', 'antd'],
    output: {
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            antd: 'antd'
        }
    }
};

export const server = {
    open: true,
    host: '0.0.0.0'
};

export const tw = tailwindcss({
    config: path.resolve(__dirname, './tailwind.config.js')
});

export const projectPlugin = () => [
    react(),
    eslint(),
    stylelint({
        exclude: ['node_modules'],
        cache: false
    }),
    legacy({
        targets: ['defaults', 'not IE 11']
    })
];

export const componentPlugin = (command: 'build' | 'serve') => [
    react(),
    replace({
        preventAssignment: true,
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
];

export const libPlugin = (command: 'build' | 'serve') => [
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
];
