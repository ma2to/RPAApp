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
      name: 'RpaWebUI',
      // File name for the output bundles
      fileName: (format) => `rpa-web-ui.${format}.js`
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled (REMOVED pinia - library will bundle it)
      external: ['vue', '@vueuse/core', '@imengyu/vue3-context-menu'],
      output: {
        exports: 'named',
        // Global variables to use in UMD build for externalized deps
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
          '@imengyu/vue3-context-menu': 'ContextMenu'
        },
        // Preserve CSS - always output as style.css for package.json exports
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'style.css'
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
