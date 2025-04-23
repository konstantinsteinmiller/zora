import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
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
      compositionOnly: true, // Enable SFC `<i18n>` block support
      runtimeOnly: false,
      include: fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url)),
      defaultSFCLang: 'yaml',
      fullInstall: true, // Install all Vue I18n components
      forceStringify: true, // Force stringify JSON files
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
    port: 505,
    headers: {
      'Permissions-Policy': '',
    },
  },
})
