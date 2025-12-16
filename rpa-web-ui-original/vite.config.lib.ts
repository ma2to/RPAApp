import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/index.ts', 'src/components/**/*', 'src/composables/**/*', 'src/stores/**/*'],
      exclude: ['src/main.ts', 'src/App.vue'],
      skipDiagnostics: true,
      staticImport: true,
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RpaAdvancedTable',
      // File name for the output bundles
      fileName: (format) => `rpa-advanced-table.${format}.js`
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['vue', 'pinia', '@vueuse/core', '@imengyu/vue3-context-menu'],
      output: {
        exports: 'named',
        // Global variables to use in UMD build for externalized deps
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          '@vueuse/core': 'VueUse',
          '@imengyu/vue3-context-menu': 'ContextMenu'
        },
        // Preserve CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'rpa-advanced-table.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    // Optimize bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  }
})
