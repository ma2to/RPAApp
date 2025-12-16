import type { App } from 'vue'
import { createPinia } from 'pinia'
import AdvancedTable from './components/DataGrid/DataGrid.vue'
import ListBox from './components/ListBox/ListBox.vue'

export default {
  install(app: App) {
    // Register Pinia
    app.use(createPinia())

    // Register components globally
    app.component('AdvancedTable', AdvancedTable)
    app.component('DataGrid', AdvancedTable)
    app.component('ListBox', ListBox)
  }
}
