import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import ViteComponents from 'vite-plugin-components';
import viteSvgIcons from 'vite-plugin-svg-icons';

import generateModifyVars from './config/theme/generateModifyVars';

const pathResolve = (dir) => {
  return resolve(process.cwd(), '.', dir);
};

export default ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  console.log(env, 'env');

  return defineConfig({
    resolve: {
      alias: {
        '~': pathResolve('./'),
        '@': pathResolve('src'),
        assets: pathResolve('./src/assets'),
        components: pathResolve('./src/components'),
      },
    },

    plugins: [
      createVuePlugin(),
      ViteComponents({ transformer: 'vue2' }),
      // 生成svg，参考https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [pathResolve('src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],

    base: './',

    server: {
      hmr: {
        overlay: false,
      },
      port: 8080,
      open: true,
      cors: true,
      // proxy: {
      //   '/api': {
      //     target: '',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, '')
      //   }
      // }
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        // 'vue',
        // 'vue-router',
        // 'vuex'
      ],
    },

    // 参考https://www.pipipi.net/vite/config/#build-options
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      sourcemap: false,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: true,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 1500,
    },
  });
};
