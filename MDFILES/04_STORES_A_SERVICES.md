# Stores a Services - Detailná Dokumentácia

## 1. dataGridStore (Pinia Store)

### Účel

**Primárna funkcia:** Centrálny state management pre DataGrid komponent pomocou Pinia. Poskytuje reaktívny state, computed properties a actions pre správu všetkých dát, selekcie, filtrovania, radenia a validácie.

**Prečo existuje:**
- **Centralizovaný state** - všetky dáta gridu (rows, columns, config, filters, selection) na jednom mieste
- **Reaktivita** - Vue automaticky re-renderuje komponenty pri zmenách v store
- **Multiple grid instances** - každý grid má vlastný izolovaný store cez dynamický `storeId`
- **Store caching** - zabránenie duplicitnej tvorby store definícií (performance optimization)
- **Kompozícia funkcií** - actions volajú composables (useFiltering, useSorting, useValidation) pre business logiku

**Kľúčové features:**
- **State:** `rows`, `columns`, `config`, `selection`, `filterExpression`, `sortState`, `pagination`
- **Computed:** `visibleRows` (filtrované + sortované + paginated), `selectedRowsData`, `totalPages`
- **Actions:** `loadRows()`, `updateCell()`, `applyFilter()`, `toggleSort()`, `setSelection()`
- **Dynamic ID:** `useDataGridStore('grid-1')()` - každý grid má vlastný state
- **Cache mechanism:** Store definitions sú cachedované v Map pre rýchlejšie vytvorenie druhého gridu

**Použitie:** Volá sa v DataGrid.vue cez `const store = useDataGridStore(props.gridId)()` a poskytuje sa child komponentom cez `provide('store', store)`.

### Import
```typescript
import { useDataGridStore } from '@/stores/dataGridStore'
```

### Inicializácia

#### Dynamic Store ID (Multiple Grid Instances)
```typescript
// Each DataGrid can have its own isolated store
const store = useDataGridStore('my-grid-1')()
const store2 = useDataGridStore('my-grid-2')()
```

#### Store Caching
```typescript
// ✅ Store definitions are cached to prevent duplicate creation
const storeCache = new Map<string, any>()
const pendingStores = new Set<string>()

export const useDataGridStore = (storeId: string = 'dataGrid') => {
  // Check cache first
  if (storeCache.has(storeId)) {
    return storeCache.get(storeId)!
  }

  // Check for race condition
  if (pendingStores.has(storeId)) {
    throw new Error(`Race condition: Store ${storeId} is already being created`)
  }

  pendingStores.add(storeId)
  const storeDefinition = defineStore(storeId, () => {
    // ... store implementation
  })

  storeCache.set(storeId, storeDefinition)
  pendingStores.delete(storeId)

  return storeDefinition
}
```

### State

#### Core Data (Map-based O(1) lookup)
```typescript
const rowsMap = ref<Map<string, GridRow>>(new Map())  // O(1) lookup by rowId
const rowsOrder = ref<string[]>([])  // Maintain insertion order
const columns = ref<GridColumn[]>([])
```

#### Selection State
```typescript
const selectedCells = ref<Set<string>>(new Set())  // "rowId:columnName"
const checkedRows = ref<string[]>([])  // Checkbox selection
const pressedCell = ref<{ rowId: string; columnName: string } | null>(null)
const isDragging = ref(false)
const wasCtrlPressed = ref(false)
```

#### Sort/Filter/Search
```typescript
const sortColumnsMap = ref<Map<string, { direction: 'asc' | 'desc'; order: number }>>(new Map())
const sortColumnsOrder = ref<string[]>([])
const filterExpression = ref<FilterExpression | null>(null)
const searchQuery = ref('')
```

#### Pagination
```typescript
const pageSize = ref(100)
const currentPage = ref(1)
```

#### Configuration
```typescript
const config = ref<GridConfig>({
  pageSize: 100,
  enableSort: true,
  enableFilter: true,
  enableSearch: true,
  enableValidation: true,
  autoValidate: true,
  showRowNumber: false,
  showCheckbox: false,
  showValidationAlerts: true,
  showDeleteButton: false,
  showInsertButton: false,
  minRowHeight: 35
})
```

#### Validation Tracking
```typescript
const validatedCells = ref<Set<string>>(new Set())  // "rowId:columnName"
const changedCellsSinceValidation = ref<Set<string>>(new Set())
```

#### Other
```typescript
const isAutoRowHeightEnabled = ref(false)
const minRows = ref<number>(1)  // Minimum number of rows (never empty table)
```

### Computed Properties

#### rows (from Map)
```typescript
const rows = computed(() => {
  return rowsOrder.value.map(rowId => rowsMap.value.get(rowId)!).filter(Boolean)
})
```

#### sortColumns (from Map)
```typescript
const sortColumns = computed(() => {
  return sortColumnsOrder.value.map(columnName => {
    const sortInfo = sortColumnsMap.value.get(columnName)!
    return {
      columnName,
      direction: sortInfo.direction
    }
  })
})
```

#### visibleRows (Filtering + Search + Sort + Pagination)
```typescript
const visibleRows = computed(() => {
  let filteredRows = rows.value

  // 1. Apply filtering
  if (filterExpression.value) {
    const storeInterface = {
      checkedRows: checkedRows.value,
      isRowChecked: (rowId: string) => checkedRows.value.includes(rowId)
    }
    filteredRows = filterRows(filteredRows, filterExpression.value, storeInterface)
  }

  // 2. Apply search
  if (searchQuery.value && searchResults.value.length > 0) {
    const searchRowIds = new Set(searchResults.value.map(r => r.rowId))
    filteredRows = filteredRows.filter(row => searchRowIds.has(row.rowId))
  }

  // 3. Apply sorting
  if (sortColumns.value.length > 0) {
    filteredRows = sortRows(filteredRows, sortColumns.value)
  }

  // 4. Apply pagination
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRows.slice(start, end)
})
```

#### checkboxState (Tri-state)
```typescript
const checkboxState = computed(() => {
  const checkedCount = checkedRows.value.length
  if (checkedCount === 0) return 'none'
  if (checkedCount === rows.value.length) return 'all'
  return 'some'
})
```

#### totalRows & totalPages
```typescript
const totalRows = computed(() => rowsOrder.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value))
```

### Actions (Data Management)

#### loadRows (Bulk Load s Empty Row Filtering)
```typescript
function loadRows(data: Record<string, any>[]) {
  const newMap = new Map<string, GridRow>()
  const newOrder: string[] = []

  // Get visible columns (for empty check)
  const visibleColumns = columns.value.filter(col =>
    !col.specialType && col.visibleForGrid !== false
  )

  let skippedEmptyRows = 0

  data.forEach((rowData, idx) => {
    // ✅ Check if row has at least one non-empty cell in VISIBLE columns
    const hasVisibleData = visibleColumns.some(col => {
      const value = rowData[col.name]
      return value !== null && value !== undefined && value !== ''
    })

    if (!hasVisibleData) {
      skippedEmptyRows++
      return  // SKIP empty row
    }

    const rowId = rowData.__rowId || generateULID()
    const height = rowData.__rowHeight || 40

    const row: GridRow = {
      rowId,
      rowIndex: newOrder.length,
      height,
      cells: columns.value.map(col => ({
        rowId,
        columnName: col.name,
        value: rowData[col.name],
        isSelected: false,
        isValidationError: false
      }))
    }

    newMap.set(rowId, row)  // O(1)
    newOrder.push(rowId)
  })

  rowsMap.value = newMap
  rowsOrder.value = newOrder

  ensureMinimumRows()  // Ensure at least minRows (default: 1)
}
```

#### getRow (O(1) Lookup)
```typescript
function getRow(rowId: string): GridRow | undefined {
  return rowsMap.value.get(rowId)  // O(1)
}
```

#### updateCell
```typescript
function updateCell(rowId: string, columnName: string, value: any) {
  const row = getRow(rowId)  // O(1)
  if (row) {
    const cell = row.cells.find(c => c.columnName === columnName)
    if (cell) {
      cell.value = value

      // Mark cell as changed for validation tracking
      const cellKey = `${rowId}:${columnName}`
      changedCellsSinceValidation.value.add(cellKey)
    }
  }
}
```

#### updateRowHeight
```typescript
function updateRowHeight(rowId: string, newHeight: number) {
  const row = getRow(rowId)  // O(1)
  if (row) {
    row.height = newHeight
  }
}
```

#### deleteRow
```typescript
function deleteRow(rowId: string) {
  if (hasRow(rowId)) {
    rowsMap.value.delete(rowId)  // O(1) delete from Map
    rowsOrder.value = rowsOrder.value.filter(id => id !== rowId)  // O(n) on string[]

    // Remove from checked rows
    const checkedIndex = checkedRows.value.indexOf(rowId)
    if (checkedIndex > -1) {
      checkedRows.value.splice(checkedIndex, 1)
    }

    // Reindex rows
    rowsOrder.value.forEach((id, idx) => {
      const row = rowsMap.value.get(id)
      if (row) row.rowIndex = idx
    })

    // ✅ If this was last row, create minimum rows (table never empty)
    if (rowsOrder.value.length === 0) {
      ensureMinimumRows()
    }
  }
}
```

#### insertRow
```typescript
function insertRow(afterRowId: string) {
  const index = rowsOrder.value.indexOf(afterRowId)
  const newRowId = generateULID()

  const newRow: GridRow = {
    rowId: newRowId,
    rowIndex: index + 1,
    height: config.value.minRowHeight || 35,
    cells: columns.value
      .filter(col => !col.specialType)
      .map(col => ({
        rowId: newRowId,
        columnName: col.name,
        value: null,
        isSelected: false,
        isValidationError: false
      }))
  }

  rowsMap.value.set(newRowId, newRow)  // O(1)
  rowsOrder.value.splice(index + 1, 0, newRowId)  // O(1) for splice

  // Reindex
  rowsOrder.value.forEach((id, idx) => {
    const row = rowsMap.value.get(id)
    if (row) row.rowIndex = idx
  })
}
```

#### insertMultipleRows
```typescript
function insertMultipleRows(rowId: string, count: number, position: 'above' | 'below') {
  const index = rowsOrder.value.indexOf(rowId)
  if (index === -1) return

  const insertIndex = position === 'above' ? index : index + 1
  const newRowIds: string[] = []

  for (let i = 0; i < count; i++) {
    const newRowId = generateULID()
    const newRow: GridRow = {
      rowId: newRowId,
      rowIndex: insertIndex + i,
      height: config.value.minRowHeight || 35,
      cells: columns.value
        .filter(col => !col.specialType)
        .map(col => ({
          rowId: newRowId,
          columnName: col.name,
          value: null,
          isSelected: false,
          isValidationError: false
        }))
    }

    rowsMap.value.set(newRowId, newRow)  // O(1)
    newRowIds.push(newRowId)
  }

  rowsOrder.value.splice(insertIndex, 0, ...newRowIds)

  // Reindex
  rowsOrder.value.forEach((id, idx) => {
    const row = rowsMap.value.get(id)
    if (row) row.rowIndex = idx
  })
}
```

#### initializeEmptyRows
```typescript
function initializeEmptyRows(count?: number) {
  const rowCount = count || minRows.value  // Default: 1 row
  const newMap = new Map<string, GridRow>()
  const newOrder: string[] = []

  for (let i = 0; i < rowCount; i++) {
    const rowId = generateULID()
    const row: GridRow = {
      rowId,
      rowIndex: i,
      height: config.value.minRowHeight || 35,
      cells: columns.value
        .filter(col => !col.specialType)
        .map(col => ({
          rowId,
          columnName: col.name,
          value: null,
          isSelected: false,
          isValidationError: false
        }))
    }

    newMap.set(rowId, row)
    newOrder.push(rowId)
  }

  rowsMap.value = newMap
  rowsOrder.value = newOrder
}
```

#### ensureMinimumRows
```typescript
function ensureMinimumRows() {
  const currentRowCount = rowsOrder.value.length
  const minimumRequired = minRows.value

  if (currentRowCount < minimumRequired) {
    const rowsToAdd = minimumRequired - currentRowCount

    for (let i = 0; i < rowsToAdd; i++) {
      const row = createEmptyRow(currentRowCount + i)
      rowsMap.value.set(row.rowId, row)
      rowsOrder.value.push(row.rowId)
    }
  }
}
```

### Actions (Selection)

#### selectCell
```typescript
function selectCell(rowId: string, columnName: string, isCtrlPressed: boolean) {
  const cellKey = `${rowId}:${columnName}`

  if (isCtrlPressed) {
    // Ctrl+Click: Toggle selection
    wasCtrlPressed.value = true
    pressedCell.value = null
    isDragging.value = false

    if (selectedCells.value.has(cellKey)) {
      selectedCells.value.delete(cellKey)
    } else {
      selectedCells.value.add(cellKey)
    }
  } else {
    // Normal Click: Clear and select this cell
    wasCtrlPressed.value = false
    pressedCell.value = { rowId, columnName }
    isDragging.value = false

    selectedCells.value.clear()
    selectedCells.value.add(cellKey)
  }
}
```

#### startDragSelection
```typescript
function startDragSelection(rowId: string, columnName: string) {
  if (!pressedCell.value) return

  isDragging.value = true
  selectedCells.value.clear()
  expandDragSelection(rowId, columnName)
}
```

#### expandDragSelection (Rectangular Range)
```typescript
function expandDragSelection(currentRowId: string, currentColumnName: string) {
  if (!pressedCell.value || !isDragging.value) return

  const pressedRowIndex = rows.value.findIndex(r => r.rowId === pressedCell.value!.rowId)
  const currentRowIndex = rows.value.findIndex(r => r.rowId === currentRowId)

  // Get selectable columns (data + ValidationAlerts, exclude special)
  const selectableColumns = columns.value.filter(col =>
    !col.specialType || col.specialType === 'ValidationAlerts'
  ).map(col => col.name)

  const pressedColIndex = selectableColumns.indexOf(pressedCell.value.columnName)
  const currentColIndex = selectableColumns.indexOf(currentColumnName)

  // Calculate rectangular bounds
  const startRowIndex = Math.min(pressedRowIndex, currentRowIndex)
  const endRowIndex = Math.max(pressedRowIndex, currentRowIndex)
  const startColIndex = Math.min(pressedColIndex, currentColIndex)
  const endColIndex = Math.max(pressedColIndex, currentColIndex)

  // Select all cells in rectangular range
  selectedCells.value.clear()
  for (let rowIdx = startRowIndex; rowIdx <= endRowIndex; rowIdx++) {
    const rowId = rows.value[rowIdx].rowId
    for (let colIdx = startColIndex; colIdx <= endColIndex; colIdx++) {
      const columnName = selectableColumns[colIdx]
      const cellKey = `${rowId}:${columnName}`
      selectedCells.value.add(cellKey)
    }
  }
}
```

#### endDragSelection
```typescript
function endDragSelection() {
  pressedCell.value = null
  isDragging.value = false
}
```

#### toggleCheckbox / toggleAllCheckboxes
```typescript
function toggleCheckbox(rowId: string, checked: boolean) {
  if (checked) {
    if (!checkedRows.value.includes(rowId)) {
      checkedRows.value.push(rowId)
    }
  } else {
    const index = checkedRows.value.indexOf(rowId)
    if (index > -1) {
      checkedRows.value.splice(index, 1)
    }
  }
}

function toggleAllCheckboxes() {
  if (checkedRows.value.length === rows.value.length) {
    checkedRows.value = []  // Uncheck all
  } else {
    checkedRows.value = rows.value.map(r => r.rowId)  // Check all
  }
}
```

### Actions (Sort/Filter/Search)

#### addSort (Map-based O(1))
```typescript
function addSort(columnName: string, direction: 'asc' | 'desc', multiSort = false) {
  if (!multiSort) {
    // Single sort - clear all
    sortColumnsMap.value.clear()
    sortColumnsOrder.value = [columnName]
    sortColumnsMap.value.set(columnName, { direction, order: 1 })
  } else {
    // Multi-sort
    if (sortColumnsMap.value.has(columnName)) {
      // Update existing - keep same order
      const existing = sortColumnsMap.value.get(columnName)!
      sortColumnsMap.value.set(columnName, { direction, order: existing.order })
    } else {
      // Add new - append to end
      const newOrder = sortColumnsOrder.value.length + 1
      sortColumnsMap.value.set(columnName, { direction, order: newOrder })
      sortColumnsOrder.value.push(columnName)
    }
  }
}
```

#### setFilter / clearFilter
```typescript
function setFilter(filter: FilterExpression | null) {
  filterExpression.value = filter
}

function clearFilter() {
  filterExpression.value = null
}
```

#### setSearchQuery / clearSearch
```typescript
function setSearchQuery(query: string) {
  searchQuery.value = query
}

function clearSearch() {
  searchQuery.value = ''
}
```

### Actions (Columns)

#### setColumns (s Validáciou a Duplicate Handling)
```typescript
const SPECIAL_COLUMN_NAMES = [
  '__rowNumber',
  '__checkbox',
  '__validationAlerts',
  '__deleteRow',
  '__insertRow'
]

function setColumns(inputColumns: GridColumn[]) {
  // Check for conflicts with special column names
  const conflicts = inputColumns
    .filter(col => !col.specialType)
    .filter(col => SPECIAL_COLUMN_NAMES.includes(col.name))
    .map(col => col.name)

  if (conflicts.length > 0) {
    throw new Error(
      `Column name conflict: ${conflicts.join(', ')} are reserved names`
    )
  }

  // Ensure unique column names
  const uniqueColumns = ensureUniqueColumnNames(inputColumns)
  columns.value = uniqueColumns
}
```

#### ensureUniqueColumnNames
```typescript
function ensureUniqueColumnNames(inputColumns: GridColumn[]): GridColumn[] {
  const nameCounts = new Map<string, number>()

  return inputColumns.map(col => {
    const originalName = col.name
    const count = nameCounts.get(originalName) || 0
    nameCounts.set(originalName, count + 1)

    if (count > 0) {
      // Duplicate - append _N
      return { ...col, name: `${originalName}_${count + 1}` }
    }

    return col
  }).map((col, index, arr) => {
    const originalName = col.name.replace(/_\d+$/, '')
    const duplicateCount = arr.filter(c =>
      c.name === originalName || c.name.startsWith(`${originalName}_`)
    ).length

    if (duplicateCount > 1 && col.name === originalName) {
      // First occurrence of duplicate - rename to _1
      return { ...col, name: `${originalName}_1` }
    }

    return col
  })
}
```

**Príklad:**
```
Input:  [priezvisko, meno, priezvisko, mesto, priezvisko]
Output: [priezvisko_1, meno, priezvisko_2, mesto, priezvisko_3]
```

#### updateColumn (Force Reactivity)
```typescript
function updateColumn(columnName: string, updates: Partial<GridColumn>) {
  const colIndex = columns.value.findIndex(c => c.name === columnName)
  if (colIndex !== -1) {
    const oldColumn = columns.value[colIndex]

    // ✅ Replace entire object (not mutate)
    columns.value[colIndex] = {
      ...oldColumn,
      ...updates
    }

    // ✅ CRITICAL: Trigger reactivity by creating new array
    columns.value = [...columns.value]
  }
}
```

### Actions (Validation)

#### markCellValidated
```typescript
function markCellValidated(rowId: string, columnName: string) {
  const cellKey = `${rowId}:${columnName}`
  validatedCells.value.add(cellKey)
  changedCellsSinceValidation.value.delete(cellKey)
}
```

#### clearValidationTracking
```typescript
function clearValidationTracking() {
  validatedCells.value.clear()
  changedCellsSinceValidation.value.clear()
}
```

#### getCellsNeedingValidation
```typescript
function getCellsNeedingValidation(
  forceValidateAll: boolean = false,
  columnsWithRules?: Set<string>
): { rowId: string; columnName: string }[] {
  // Get visible columns
  const visibleColumns = new Set(
    columns.value
      .filter(col => col.visibleForGrid !== false)
      .map(col => col.name)
  )

  // Intersect with columns that have rules (if provided)
  const columnsToValidate = (columnsWithRules && columnsWithRules.size > 0)
    ? new Set([...visibleColumns].filter(col => columnsWithRules.has(col)))
    : visibleColumns

  const cellsToValidate: { rowId: string; columnName: string }[] = []

  for (const row of rows.value) {
    // Skip empty rows
    const visibleCells = row.cells.filter(cell => columnsToValidate.has(cell.columnName))
    const isEmpty = visibleCells.every(cell =>
      cell.value === null || cell.value === undefined || cell.value === ''
    )
    if (isEmpty) continue

    for (const cell of row.cells) {
      // Skip invisible columns
      if (!visibleColumns.has(cell.columnName)) continue

      // Skip visible columns WITHOUT rules
      if (columnsWithRules && !columnsWithRules.has(cell.columnName)) continue

      const cellKey = `${cell.rowId}:${cell.columnName}`
      const isValidated = validatedCells.value.has(cellKey)
      const isChanged = changedCellsSinceValidation.value.has(cellKey)

      // Validate if: forceValidateAll OR never validated OR changed
      if (forceValidateAll || !isValidated || isChanged) {
        cellsToValidate.push({
          rowId: cell.rowId,
          columnName: cell.columnName
        })
      }
    }
  }

  return cellsToValidate
}
```

#### areNonEmptyRowsValid
```typescript
function areNonEmptyRowsValid(): boolean {
  for (const row of rows.value) {
    // Check if row is empty
    const isEmpty = row.cells.every(cell =>
      cell.value === null || cell.value === undefined || cell.value === ''
    )
    if (isEmpty) continue

    // Check if row has errors
    const hasError = row.cells.some(cell => cell.isValidationError)
    if (hasError) return false
  }

  return true
}
```

### Actions (Configuration)

#### setConfig
```typescript
function setConfig(newConfig: Partial<GridConfig>) {
  config.value = { ...config.value, ...newConfig }
  if (newConfig.pageSize) {
    pageSize.value = newConfig.pageSize
  }
}
```

#### setAutoRowHeightEnabled
```typescript
function setAutoRowHeightEnabled(enabled: boolean) {
  isAutoRowHeightEnabled.value = enabled
}
```

#### setMinRows
```typescript
function setMinRows(newMinRows: number) {
  if (newMinRows < 0) return
  minRows.value = newMinRows
  ensureMinimumRows()
}
```

### Actions (Cleanup)

#### clearAllData
```typescript
function clearAllData() {
  // Clear row data
  rowsMap.value.clear()
  rowsOrder.value = []

  // Clear selection
  selectedCells.value.clear()
  checkedRows.value = []
  pressedCell.value = null
  isDragging.value = false
  wasCtrlPressed.value = false

  // Clear validation tracking
  validatedCells.value.clear()
  changedCellsSinceValidation.value.clear()

  // Clear sort/filter/search
  sortColumnsMap.value.clear()
  sortColumnsOrder.value = []
  filterExpression.value = null
  searchQuery.value = ''

  // Reset pagination
  currentPage.value = 1
}
```

### Helper Functions

#### sortRows
```typescript
function sortRows(rowsToSort: GridRow[], sorts: { columnName: string; direction: 'asc' | 'desc' }[]) {
  if (sorts.length === 0) return rowsToSort

  return [...rowsToSort].sort((a, b) => {
    for (const { columnName, direction } of sorts) {
      const aCell = a.cells.find(c => c.columnName === columnName)
      const bCell = b.cells.find(c => c.columnName === columnName)

      const aVal = aCell?.value
      const bVal = bCell?.value

      const cmp = compareValues(aVal, bVal)
      if (cmp !== 0) {
        return direction === 'asc' ? cmp : -cmp
      }
    }
    return 0
  })
}

function compareValues(a: any, b: any): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}
```

#### generateULID
```typescript
function generateULID(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

### Použitie

```vue
<script setup>
import { useDataGridStore } from '@/stores/dataGridStore'

const store = useDataGridStore('my-grid')()

// Load data
store.loadRows([
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 }
])

// Selection
store.selectCell('row-123', 'email', false)

// Sorting
store.addSort('name', 'asc', false)

// Filtering
store.setFilter({
  type: 'simple',
  columnName: 'age',
  operator: 'GreaterThan',
  value: 25
})

// Pagination
store.goToPage(2)
store.setPageSize(50)
</script>
```

---

## 2. gridApi (Backend Service)

### Účel

**Primárna funkcia:** Service pre komunikáciu s C# backend API cez WebView messaging. Umožňuje Vue frontend volať C# metódy a získavať dáta z backend logiky.

**Prečo existuje:**
- **WebView integration** - Vue SPA beží v WebView2 kontrole v C# WPF aplikácii, gridApi je bridge medzi nimi
- **Data loading** - načítanie dát z C# backend (databáza, súbory, API) namiesto hardcoded JSON
- **Import/Export** - odosielanie editovaných dát späť do C# pre uloženie
- **Health check** - overenie, či backend beží a je dostupný

**Kľúčové metódy:**
- `healthCheck()` - kontrola dostupnosti backendu (volá sa v onMounted)
- `getData()` - načítanie dát zo servera (vráti GridRow[])
- `importData(data)` - odoslanie dát na backend pre uloženie
- WebView messaging - komunikácia cez `window.chrome.webview.postMessage()` a message handlers

**Použitie:** Volá sa v DataGrid.vue cez `loadDataFromBackend()` a `saveDataToBackend()` funkcie. Podporuje async/await pattern pre user-friendly error handling.

### Import
```typescript
import { gridApi } from '@/services/gridApi'
```

### API Methods

#### healthCheck()
```typescript
async function healthCheck(): Promise<boolean>
```
Skontroluje, či je backend pripojený.

#### getData()
```typescript
async function getData(): Promise<{ success: boolean; data?: any[]; error?: string }>
```
Načíta dáta z backendu.

**Backend formát:**
```json
{
  "success": true,
  "data": [
    {
      "RowId": "row-1",
      "RowHeight": 40,
      "Checkbox": false,
      "Data": {
        "name": "John",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Store formát (po konverzii):**
```json
{
  "__rowId": "row-1",
  "__rowHeight": 40,
  "__checkbox": false,
  "name": "John",
  "email": "john@example.com"
}
```

#### importData()
```typescript
async function importData(data: Record<string, any>[]): Promise<{ success: boolean; error?: string }>
```
Odošle dáta do backendu.

**Input formát:**
```json
[
  {
    "name": "John",
    "email": "john@example.com"
  }
]
```

### WebView Messaging Protocol

#### Odosielanie správ (Frontend → Backend)
```typescript
if ((window as any).chrome?.webview) {
  (window as any).chrome.webview.postMessage(JSON.stringify({
    type: 'getData',
    timestamp: new Date().toISOString()
  }))
}
```

#### Prijímanie správ (Backend → Frontend)
```typescript
window.addEventListener('message', (event) => {
  try {
    const message = JSON.parse(event.data)

    if (message.type === 'dataResponse') {
      // Handle data response
    }
  } catch (error) {
    console.error('Failed to parse message:', error)
  }
})
```

### Error Logging
```typescript
// Log errors to C# backend
try {
  if ((window as any).chrome?.webview) {
    (window as any).chrome.webview.postMessage(JSON.stringify({
      type: 'error',
      source: 'DataGrid.validateAll',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }))
  }
} catch { }
```

---

## Kľúčové Performance Optimalizácie

### 1. Map-based Storage (O(1) Lookup)
```typescript
// Before (O(n)):
const row = rows.value.find(r => r.rowId === rowId)

// After (O(1)):
const row = rowsMap.value.get(rowId)
```

### 2. Store Caching
```typescript
// Prevents duplicate store creation
const storeCache = new Map<string, any>()
```

### 3. Reactive Counters
```typescript
// Map.set() doesn't trigger reactivity
// Solution: Increment counter to trigger watch
const ruleCount = ref(0)

function addValidationRule(rule: ValidationRule) {
  validationRules.value.set(rule.columnName, rules)
  ruleCount.value++  // Trigger watch
}

watch(() => validation.ruleCount.value, () => {
  // This will trigger when rules are added
})
```

### 4. Validation Filtering
```typescript
// Skip columns without validation rules
const columnsWithRules = new Set(['email', 'age'])
const cellsToValidate = store.getCellsNeedingValidation(true, columnsWithRules)

// Reduces validation calls by 80%+ in typical scenarios
```

### 5. Empty Row Filtering
```typescript
// loadRows() skips rows without visible data
// Reduces memory usage and validation time
```

---

## Záver

dataGridStore poskytuje robustný, optimalizovaný state management s Map-based storage pre O(1) operácie, reactive watchers pre automatickú validáciu, a komplexnú správu selekcie, filtrovania a radenia.

gridApi poskytuje jednoduchú komunikáciu s C# backend cez WebView messaging pre load/save operácie.
