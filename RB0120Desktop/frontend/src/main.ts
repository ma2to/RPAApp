import { createApp } from 'vue'
import { createPinia } from 'rpa-web-ui'  // Import Pinia from library to ensure single instance
import App from './App.vue'
import 'rpa-web-ui/dist/style.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App)
app.use(createPinia())
app.use(ContextMenu)
app.mount('#app')
