import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteComponents from 'vite-plugin-components';
import viteSvgIcons from 'vite-plugin-svg-icons';
import { resolve } from 'path';

const pathResolve = (dir) => {
  return resolve(process.cwd(), '.', dir);
};

const config = defineConfig({
  resolve: {
    alias: {
      '~': pathResolve('./'),
      '@': pathResolve('src'),
      assets: pathResolve('./src/assets'),
      components: pathResolve('./src/components'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },

  plugins: [
    createVuePlugin(),
    vueJsx(),
    ViteComponents({ transformer: 'vue2' }),
    // 生成svg，参考https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        pathResolve('src/assets/icons'),
        pathResolve('src/components/form-generator/icons'),
      ],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],

  base: './',

  server: {
    port: 8083,
    open: true,
    cors: true,
    // proxy: {
    //   '/api': {
    //     target: '',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '')
    //   }
    // }
    hmr: { overlay: false },
  },

  css: {
    preprocessorOptions: {},
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
    sourcemap: true,
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

export default config;
