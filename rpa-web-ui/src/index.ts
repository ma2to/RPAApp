/**
 * RPA Advanced Table - Vue 3 Component Library
 * Exports DataGrid and ListBox components for TypeScript and JavaScript
 */

import type { App } from 'vue'
import DataGrid from './components/DataGrid.vue'
import ListBox from './components/ListBox.vue'
import SearchPanel from './components/SearchPanel.vue'
import FilterRow from './components/FilterRow.vue'

// Export components individually
export { DataGrid, ListBox, SearchPanel, FilterRow }

// Export AdvancedTable as alias for DataGrid (for backwards compatibility)
export { DataGrid as AdvancedTable }

// Export composables
export { useValidation } from './composables/useValidation'
export { useAutoRowHeight } from './composables/useAutoRowHeight'
export { useFiltering } from './composables/useFiltering'
export { useSearch } from './composables/useSearch'
export { useShortcuts } from './composables/useShortcuts'

// Export stores
export { useDataGridStore } from './stores/dataGridStore'

// Export Pinia (for apps using this library)
export { createPinia, setActivePinia, getActivePinia } from 'pinia'
export type { Pinia } from 'pinia'

// Export services
export { gridApi } from './services/gridApi'

// Export types
export type { ListBoxItem } from './components/ListBox.vue'
export type {
  GridCell,
  GridRow,
  GridColumn,
  GridConfig
} from './stores/dataGridStore'

export type {
  ValidationRule,
  ValidationError,
  ValidationResult
} from './composables/useValidation'

export type {
  AutoRowHeightConfig,
  RowHeightResult
} from './composables/useAutoRowHeight'

export type {
  FilterExpression,
  SimpleFilter,
  CompositeFilter,
  FilterOperator
} from './composables/useFiltering'

// Plugin install function
export function install(app: App) {
  app.component('DataGrid', DataGrid)
  app.component('ListBox', ListBox)
  app.component('SearchPanel', SearchPanel)
  app.component('FilterRow', FilterRow)
}

// Default export for Vue.use()
export default {
  install
}
