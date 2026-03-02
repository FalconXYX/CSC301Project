/// <reference types="vitest/config" />

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import SvgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/CSC301Project/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/composables/**/*.ts', 'src/stores/**/*.ts', 'src/types/**/*.ts'],
      dts: 'src/auto-imports.d.ts', // generates TypeScript declarations
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    SvgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://csc-301-project.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
  },
}))
