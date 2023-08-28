import { defineConfig } from 'vite';
import type { EntryList } from './vite.common.config.ts';
import {
    alias,
    componentPlugin,
    DOMTest,
    getLib,
    libPlugin,
    NodeTest,
    projectPlugin,
    rollupOptions,
    server,
    tw
} from './vite.common.config.ts';
import MetaConfig from './meta.config.ts';
import autoprefixer from 'autoprefixer';

const getPlugin = (command: 'build' | 'serve', mode: string) =>
    ({
        lib: libPlugin(command),
        project: projectPlugin(),
        component: componentPlugin(command)
    }[mode]);

const getTest = (mode: string) =>
    ({
        lib: NodeTest,
        project: DOMTest,
        component: DOMTest
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
                plugins: [tw(), autoprefixer]
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
                  },
        test: getTest(meta.mode)
    };
});
