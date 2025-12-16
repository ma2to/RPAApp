import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import { setupGlobalErrorHandlers, vueErrorHandler, useLogger } from '@/composables/useLogger'

// Initialize global error handlers (unhandled errors, promise rejections)
setupGlobalErrorHandlers()

const logger = useLogger('Main')
logger.info('🚀 Application starting...', {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language
})

const app = createApp(App)

// Set up Vue error handler
app.config.errorHandler = vueErrorHandler

// Global warning handler (for Vue warnings)
app.config.warnHandler = (msg, instance, trace) => {
  logger.warn('Vue Warning', {
    message: msg,
    component: instance?.$options?.name || instance?.$options?.__name || 'Unknown',
    trace
  })
}

app.use(createPinia())
app.use(ContextMenu)

logger.info('📦 Plugins loaded (Pinia, ContextMenu)')

app.mount('#app')

logger.info('✅ Application mounted successfully')
