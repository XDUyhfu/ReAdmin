import { defineConfig } from 'vite';
import type { EntryList } from './vite.common.config.ts';
import {
    alias,
    componentPlugin,
    getLib,
    libPlugin,
    projectPlugin,
    rollupOptions,
    server
} from './vite.common.config.ts';
import MetaConfig from './meta.config.ts';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import path from 'path';

const getPlugin = (command: 'build' | 'serve', mode: string) =>
    ({
        lib: libPlugin(command),
        project: projectPlugin(),
        component: componentPlugin(command)
    }[mode]);

export default defineConfig(({ command, mode }) => {
    const meta = MetaConfig.find((item) => item.name === mode)!;
    return {
        plugins: [getPlugin(command, meta.mode)],
        resolve: {
            alias
        },
        server,
        css: {
            postcss: {
                plugins: [
                    tailwindcss({
                        config: path.resolve(__dirname, './tailwind.config.ts')
                    }),
                    autoprefixer
                ]
            }
        },
        build:
            meta.mode === 'project'
                ? {}
                : {
                      lib: getLib(
                          meta.moduleName,
                          meta.bundleName as EntryList
                      ),
                      rollupOptions
                  }
    };
});
