import { createApp } from 'vue'
import { createPinia, gridApi } from 'rpa-web-ui'  // ✅ RIEŠENIE #3: Import gridApi
import App from './App.vue'
import 'rpa-web-ui/dist/style.css'  // ✅ Fixed: Use package export for CSS
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App)
app.use(createPinia())
app.use(ContextMenu)
app.mount('#app')

// ✅ RIEŠENIE #1: Library gridApi používa injected window.gridApi z C#
// NEPREPISUJ window.gridApi - C# ho injektuje pre Host Objects mode
// ;(window as any).gridApi = gridApi  // ← ZAKOMENTOVANÉ - nesmie prepisovať injected gridApi!
console.log('[main.ts] Using injected window.gridApi from C# backend')
console.log('[main.ts] gridApi mode:', (window as any).gridApi ? 'Host Objects' : 'HTTP')
