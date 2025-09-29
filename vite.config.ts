import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  console.log(command, mode)
  return {
    // 区分开发环境和生产环境的base路径
    base: mode === 'production' ? '/bilibilih5/dist/' : '/',
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      ElementPlus({}),
      // UnifiedViteWeappTailwindcssPlugin({
      //   // 移除不支持的enabled属性
      //   // rem2rpx: true,
      //   tailwindcss: {
      //     // 显示声明用的是 tailwindcss v4
      //     version: 4,
      //     v4: {
      //       cssEntries: [
      //         // style.css 的路径
      //         fileURLToPath(new URL('./src/style.css', import.meta.url)),
      //       ],
      //     },
      //   },
      // }),
      // AutoImport({
      //   resolvers: [ElementPlusResolver()],
      // }),
      // Components({
      //   resolvers: [ElementPlusResolver()],
      // }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://apilive.lemonuni.cn',
          // target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
