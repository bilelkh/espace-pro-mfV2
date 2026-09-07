import { fileURLToPath, URL } from 'url';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Lecture du package.json compatible ESM
const pjsonPath = resolve(process.cwd(), 'package.json');
const pjson = JSON.parse(readFileSync(pjsonPath, 'utf-8'));
const name = pjson.name.replace('@sofinco/', '');
const version = pjson.version;

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/modules/espacepro-common/' : '',
    server: {
      origin: 'http://localhost:8090',
      port: 8090,
      open: true,
      cors: {
        allowedHeaders: '*'
      }
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // @ts-ignore - api option is supported in Vite 5.4+
          api: 'modern-compiler',
          loadPaths: [fileURLToPath(new URL('./', import.meta.url))]
        }
      }
    },
    build: {
      target: ['es2020'],
      cssTarget: ['chrome80', 'safari11'],
      rollupOptions: {
        output: {
          entryFileNames: `javascript/${name}.min.${version}.js`,
          chunkFileNames: `javascript/[name]-[hash].min.js`,
          assetFileNames: (assetInfo: any) => {
            if (assetInfo.name == 'index.css') {
              return `css/${name}.min.css`;
            }
            const extType = assetInfo.name.split('.').at(1);
            const typesDir: { [key: string]: RegExp } = {
              fonts: /ttf|woff|woff2/i,
              css: /css/i,
              images: /png|jpe?g|svg|gif|tiff|bmp|ico/i
            };

            for (const dir in typesDir) {
              if (typesDir[dir].test(extType)) {
                if (dir === 'css') {
                  return `${dir}/[name]-[hash].min[extname]`;
                } else {
                  return `${dir}/[name][extname]`;
                }
              }
            }

            return `assets/[name].[ext]`;
          }
        }
      }
    }
  };
});
