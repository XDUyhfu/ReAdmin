import { defineConfig } from 'vite';
import { alias, getLib, libPlugin } from '../../../vite.common.config.ts';

export default defineConfig(({ command }) => ({
    plugins: [libPlugin(command)],
    resolve: {
        alias
    },

    build: {
        lib: getLib('ReGen', 're-gen')
    }
}));