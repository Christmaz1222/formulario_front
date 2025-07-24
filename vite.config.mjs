// vite.config.mjs

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Helpers para resolver rutas en archivos de Módulo ES
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      // Configuración de alias '@' para que apunte a la carpeta 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})