import path from 'path';
import tailwindcss from 'tailwindcss';

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

export const tailwind = tailwindcss({
    config: path.resolve(__dirname, './tailwind.config.js')
});
