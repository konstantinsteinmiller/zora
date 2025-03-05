import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { fileURLToPath, URL } from 'node:url'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    glsl(),
    ReactivityTransform(),
    vueI18n({
      runtimeOnly: false,
      include: fileURLToPath(new URL('./src/i18n/**', import.meta.url)),
      defaultSFCLang: 'yaml',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
  server: {
    headers: {
      'Permissions-Policy': '',
    },
  },
})
