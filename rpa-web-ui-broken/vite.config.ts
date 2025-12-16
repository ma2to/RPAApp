import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      rollupTypes: true,
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RpaWebUI',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'rpa-web-ui.js' : 'rpa-web-ui.umd.js'
    },
    rollupOptions: {
      external: ['vue', 'pinia'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
