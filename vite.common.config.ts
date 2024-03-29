import path from 'path';
import react from '@vitejs/plugin-react';
import stylelint from 'vite-plugin-stylelint';
import legacy from '@vitejs/plugin-legacy';
import replace from '@rollup/plugin-replace';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';

const ConfigPathMap = {
    alias: {
        '@re-utils': path.resolve(__dirname, './packages/shared/re-utils/src'),
        '@re-hooks': path.resolve(__dirname, './packages/shared/re-hooks/src'),
        '@re-gen': path.resolve(__dirname, './packages/shared/re-gen/src'),
        '@re-form-filter': path.resolve(
            __dirname,
            './packages/components/re-form-filter/src'
        ),
        '@re-form-field': path.resolve(
            __dirname,
            './packages/components/re-form-field/src'
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
        're-form-field': path.resolve(
            __dirname,
            './packages/components/re-form-field/src/index.ts'
        ),
        're-backend': path.resolve(
            __dirname,
            './packages/projects/re-backend/src/index.ts'
        )
    }
};

export const alias = ConfigPathMap.alias;

export type EntryList = keyof (typeof ConfigPathMap)['lib'];

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

export const projectPlugin = () => [
    react(),
    eslint({ exclude: '**/dist/**' }),
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
    eslint({ exclude: '**/dist/**' }),
    stylelint({
        cache: false,
        fix: true
    }),
    cssInjectedByJsPlugin(),
    dts({
        exclude: 'vite.config.ts',
        rollupTypes: true,
        copyDtsFiles: true
    })
];

export const libPlugin = (command: 'build' | 'serve') => [
    replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
            command === 'build' ? 'production' : 'development'
        )
    }),
    dts({
        exclude: 'vite.config.ts',
        rollupTypes: true,
        copyDtsFiles: true
    }),
    eslint({ exclude: '**/dist/**' })
];

export const DOMTest = {
    globals: true,
    environment: 'jsdom'
};

export const NodeTest = {
    globals: true,
    environment: 'node'
};
