// DbAdm/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: 'wwwroot',
        emptyOutDir: false,
        sourcemap: true,
        minify: "esbuild",
        //minify: false,
        target: "es2022",
        //moduleResolution: "nodenext",
        rollupOptions: {
            input: {
                // 從 BaseTs ts -> js
                jsLib: resolve(__dirname, '../Base/BaseTs/jsLib.ts'),
                jsBase: resolve(__dirname, '../Base/BaseTs/jsBase.ts'),
                zhTW: resolve(__dirname, "../Base/BaseTs/zh-TW.ts"),
                zhCN: resolve(__dirname, "../Base/BaseTs/zh-CN.ts"),
                enUS: resolve(__dirname, "../Base/BaseTs/en-US.ts")
            },
            output: {
                entryFileNames: (chunk) => {
                    if (chunk.name === "jsLib")
                        return "lib.min.js";
                    if (chunk.name === "jsBase")
                        return "base.min.js";
                    if (chunk.name === "zhTW")
                        return "locale/zh-TW.min.js";
                    if (chunk.name === "zhCN")
                        return "locale/zh-CN.min.js";
                    if (chunk.name === "enUS")
                        return "locale/en-US.min.js";

                    return "[name].min.js";
                }
            }
            //external: ['/wwwroot/lib.min.js', '/wwwroot/base.min.js'],
        }
    },
    resolve: {
        alias: {
            // 建立別名，讓你在程式碼中可以寫 import { ... } from '@base/...'
            '@base': resolve(__dirname, '../Base/BaseTs')
        }
    },
    plugins: [
        dts({
            entryRoot: '../Base/BaseTs',
            outDir: 'wwwroot/types'
        })
    ]
});