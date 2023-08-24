import path from 'path';

export const alias = {
    '@re-utils': path.resolve(__dirname, './packages/shared/re-utils/src'),
    '@re-hooks': path.resolve(__dirname, './packages/shared/re-hooks/src'),
    '@re-gen': path.resolve(__dirname, './packages/shared/re-gen/src'),
    '@re-form-filter': path.resolve(
        __dirname,
        './packages/components/re-form-filter/src'
    ),
    '@re-backend': path.resolve(__dirname, './packages/projects/re-backend/src')
};
