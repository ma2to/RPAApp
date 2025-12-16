claude# @rpa/advanced-table

Advanced DataGrid and ListBox components for Vue 3 with full TypeScript support.

## Features

### DataGrid Component
- ✅ Virtual scrolling for large datasets
- ✅ Cell editing with validation
- ✅ Multi-cell selection (Ctrl+Click, drag selection)
- ✅ Copy/Paste support (Ctrl+C, Ctrl+V)
- ✅ Column filtering (checkbox and regex modes)
- ✅ Column sorting (single and multi-column)
- ✅ Auto row height calculation
- ✅ Search with highlighting
- ✅ Insert/Delete rows
- ✅ Context menu operations
- ✅ Special columns (Row Number, Checkbox, Validation Alerts, Delete, Insert)
- ✅ Programmatic Import/Export
- ✅ Full TypeScript support

### ListBox Component
- ✅ Single and multi-select modes
- ✅ Keyboard navigation
- ✅ Custom item rendering
- ✅ TypeScript support

## Installation

```bash
npm install @rpa/advanced-table
```

## Usage

### For TypeScript/ES Modules

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DataGrid, ListBox } from '@rpa/advanced-table'
import '@rpa/advanced-table/dist/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.component('DataGrid', DataGrid)
app.component('ListBox', ListBox)

app.mount('#app')
```

### Or use the plugin:

```typescript
import RpaAdvancedTable from '@rpa/advanced-table'
import '@rpa/advanced-table/dist/style.css'

app.use(RpaAdvancedTable)
```

### DataGrid Example

```vue
<template>
  <DataGrid
    :columns="columns"
    :config="gridConfig"
    store-id="myGrid"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDataGridStore, type GridColumn, type GridConfig } from '@rpa/advanced-table'

const store = useDataGridStore('myGrid')

const columns = ref<GridColumn[]>([
  {
    name: 'id',
    header: 'ID',
    width: 80,
    minWidth: 50,
    maxWidth: 150,
    isVisible: true,
    isReadOnly: true,
    isSortable: true,
    isFilterable: true
  },
  {
    name: 'name',
    header: 'Name',
    width: 200,
    minWidth: 100,
    maxWidth: 400,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  },
  {
    name: 'email',
    header: 'Email',
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  }
])

const gridConfig = ref<GridConfig>({
  pageSize: 100,
  enableSort: true,
  enableFilter: true,
  enableSearch: true,
  enableValidation: true,
  showRowNumber: true,
  showCheckbox: false,
  showValidationAlerts: true,
  showDeleteButton: false,
  showInsertButton: false
})

onMounted(() => {
  // Load sample data
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]

  store.columns = columns.value
  store.setConfig(gridConfig.value)
  store.loadRows(sampleData)
})
</script>
```

### ListBox Example

```vue
<template>
  <ListBox
    :items="items"
    :multi-select="true"
    @selection-change="handleSelection"
  />
</template>

<script setup lang="ts">
const items = ref([
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
])

function handleSelection(selected: string[]) {
  console.log('Selected:', selected)
}
</script>
```

## API

### DataGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `GridColumn[]` | `[]` | Column definitions |
| `config` | `GridConfig` | Required | Grid configuration |
| `storeId` | `string` | `'dataGrid'` | Unique store identifier |

### DataGrid Store Methods

```typescript
const store = useDataGridStore('myGrid')

// Load data
store.loadRows(data)

// Update cell
store.updateCell(rowId, columnName, value)

// Insert row
store.insertRow(afterRowId)

// Delete row
store.deleteRow(rowId)

// Sort
store.addSort(columnName, direction)

// Filter
store.setFilter(filterExpression)

// Search
store.setSearchQuery(query)
```

### Validation

```typescript
import { useValidation } from '@rpa/advanced-table'

const validation = useValidation()

// Add validation rule
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Regex',
  errorMessage: 'Invalid email format',
  regexPattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  severity: 'Error'
})

// Validate all
const result = await validation.validateAll(rows)
```

## Building the Library

To build the library for distribution:

```bash
npm run build:lib
```

This will generate:
- `dist/rpa-advanced-table.es.js` - ES module bundle (166 KB)
- `dist/rpa-advanced-table.umd.js` - UMD bundle (86 KB)
- `dist/rpa-advanced-table.css` - Stylesheet (19 KB)
- `dist/rpa-advanced-table.es.d.ts` - TypeScript declarations (31 KB)
- Source maps for debugging

## Publishing to npm

1. Update version in `package.lib.json`
2. Copy `package.lib.json` to `package.json`:
   ```bash
   cp package.lib.json package.json
   ```
3. Build the library:
   ```bash
   npm run build:lib
   ```
4. Publish to npm:
   ```bash
   npm publish
   ```

## Generated Files Structure

```
dist/
├── rpa-advanced-table.es.js      # ES module
├── rpa-advanced-table.umd.js     # UMD bundle
├── rpa-advanced-table.css        # Styles
├── rpa-advanced-table.es.d.ts    # TypeScript declarations
├── rpa-advanced-table.es.js.map  # ES module source map
└── rpa-advanced-table.umd.js.map # UMD source map
```

## License

MIT
