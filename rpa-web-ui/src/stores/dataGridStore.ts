import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFiltering, type FilterExpression } from '@/composables/useFiltering'
import { useSearch } from '@/composables/useSearch'

export interface GridCell {
  rowId: string
  columnName: string
  value: any
  isSelected: boolean
  isValidationError: boolean
  validationMessage?: string
}

export interface GridRow {
  rowId: string
  rowIndex: number
  height: number
  cells: GridCell[]
  validationErrorCount?: number  // Track validation errors for DynamicScroller size-dependencies
}

export interface GridColumn {
  name: string
  header: string
  width: number
  minWidth: number
  maxWidth: number
  isVisible: boolean
  isReadOnly: boolean
  isSortable: boolean
  isFilterable: boolean
  autoWidth?: boolean  // Star sizing - column expands to fill remaining space
  specialType?: 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow'
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time'  // Data type for validation and formatting
  visibleForGrid?: boolean  // Default: true. If false, column holds data but is not shown in UI, validation, filter, or sort
}

export interface GridConfig {
  pageSize: number
  pageSizeOptions?: number[]
  enableSort: boolean
  enableFilter: boolean
  enableSearch: boolean
  enableValidation: boolean
  autoValidate: boolean  // true = validate on every change, false = validate only on manual request
  showRowNumber: boolean
  showCheckbox: boolean
  showValidationAlerts: boolean
  showDeleteButton: boolean
  showInsertButton: boolean
  minRowHeight?: number  // Minimum row height in pixels (default: 35)  ✅ RIEŠENIE #2B
}

// ✅ RIEŠENIE #2: Cache store definitions to prevent duplicate creation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeCache = new Map<string, any>()
const pendingStores = new Set<string>()  // ✅ RIEŠENIE #2: Track stores being created right now

export const useDataGridStore = (storeId: string = 'dataGrid') => {
  if (!storeId || typeof storeId !== 'string') {
    console.error('[useDataGridStore] Invalid storeId:', storeId)
    throw new Error(`Invalid storeId: ${storeId}`)
  }

  // ✅ RIEŠENIE #2: Check cache first - already created
  if (storeCache.has(storeId)) {
    console.log('[useDataGridStore] Using CACHED store definition for:', storeId)
    return storeCache.get(storeId)!
  }

  // ✅ RIEŠENIE #2: Check if another call is creating this store RIGHT NOW
  if (pendingStores.has(storeId)) {
    console.error('[useDataGridStore] ⚠️ RACE CONDITION DETECTED! Store is being created by another component:', storeId)
    throw new Error(`[useDataGridStore] Race condition: Store ${storeId} is already being created. This indicates a timing issue.`)
  }

  // ✅ RIEŠENIE #2: Mark as "being created" IMMEDIATELY before starting
  pendingStores.add(storeId)
  console.log('[useDataGridStore] Creating NEW store definition for:', storeId)
  const storeDefinition = defineStore(storeId, () => {
  // State
  // ✅ RIEŠENIE E: Map-based storage for O(1) lookup and thread-safety
  const rowsMap = ref<Map<string, GridRow>>(new Map())  // O(1) lookup by rowId
  const rowsOrder = ref<string[]>([])  // Maintain insertion order for rendering

  const columns = ref<GridColumn[]>([])
  const selectedCells = ref<Set<string>>(new Set())
  const checkedRows = ref<string[]>([])
  const pageSize = ref(100)
  const currentPage = ref(1)

  // ✅ RIEŠENIE E: Map-based storage for sortColumns (O(1) lookup)
  const sortColumnsMap = ref<Map<string, { direction: 'asc' | 'desc'; order: number }>>(new Map())
  const sortColumnsOrder = ref<string[]>([])  // Maintain sort order

  const filterExpression = ref<FilterExpression | null>(null)
  const searchQuery = ref('')
  const config = ref<GridConfig>({
    pageSize: 100,
    enableSort: true,
    enableFilter: true,
    enableSearch: true,
    enableValidation: true,
    autoValidate: true,  // Default: validate automatically on every change
    showRowNumber: false,
    showCheckbox: false,
    showValidationAlerts: true,
    showDeleteButton: false,
    showInsertButton: false,
    minRowHeight: 35  // ✅ RIEŠENIE #2C: Explicit default (32 + 3 = 35)
  })

  // Selection state (based on WinUI3 patterns)
  const pressedCell = ref<{ rowId: string; columnName: string } | null>(null)
  const isDragging = ref(false)
  const wasCtrlPressed = ref(false)

  // Auto row height state
  const isAutoRowHeightEnabled = ref(false)

  // Validation tracking state (for optimized validation)
  const validatedCells = ref<Set<string>>(new Set())  // Cells that have been validated: "rowId:columnName"
  const changedCellsSinceValidation = ref<Set<string>>(new Set())  // Cells changed since last validation

  // Minimum rows configuration (ensures table always has visible rows)
  // ✅ RIEŠENIE #1A: Default changed to 1 (tabuľka nikdy nie je úplne prázdna)
  const minRows = ref<number>(1)  // Default minimum: 1 empty row

  // ✅ RIEŠENIE E: Computed properties - convert Map to Array for rendering
  const rows = computed(() => {
    return rowsOrder.value.map(rowId => rowsMap.value.get(rowId)!).filter(Boolean)
  })

  const sortColumns = computed(() => {
    return sortColumnsOrder.value.map(columnName => {
      const sortInfo = sortColumnsMap.value.get(columnName)!
      return {
        columnName,
        direction: sortInfo.direction
      }
    })
  })

  // ✅ RIEŠENIE E: Helper functions for O(1) access
  function getRow(rowId: string): GridRow | undefined {
    return rowsMap.value.get(rowId)
  }

  function hasRow(rowId: string): boolean {
    return rowsMap.value.has(rowId)
  }

  function getSortInfo(columnName: string) {
    return sortColumnsMap.value.get(columnName) ?? null
  }

  // Composables
  const { filterRows, evaluateFilter } = useFiltering()
  const { searchResults, isSearchMatch } = useSearch(rows)

  // Computed
  const totalRows = computed(() => rowsOrder.value.length)
  const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value))

  const visibleRows = computed(() => {
    console.log('[visibleRows] 🔍 START')
    let filteredRows = rows.value
    console.log('[visibleRows] Total rows:', filteredRows.length)

    // Apply filtering
    if (filterExpression.value) {
      const before = filteredRows.length
      // ✅ FIX: Pass store interface so filterRows can access checkbox state
      const storeInterface = {
        checkedRows: checkedRows.value,
        isRowChecked: (rowId: string) => checkedRows.value.includes(rowId)
      }
      filteredRows = filterRows(filteredRows, filterExpression.value, storeInterface)
      console.log('[visibleRows] After filter:', filteredRows.length, '(filtered:', before - filteredRows.length, ')')
    }

    // Apply search filtering
    if (searchQuery.value && searchResults.value.length > 0) {
      const before = filteredRows.length
      const searchRowIds = new Set(searchResults.value.map(r => r.rowId))
      filteredRows = filteredRows.filter(row => searchRowIds.has(row.rowId))
      console.log('[visibleRows] After search:', filteredRows.length, '(filtered:', before - filteredRows.length, ')')
    }

    // Apply sorting
    if (sortColumns.value.length > 0) {
      filteredRows = sortRows(filteredRows, sortColumns.value)
      console.log('[visibleRows] Sorted by:', sortColumns.value.map((s: { columnName: string; direction: string }) => `${s.columnName} ${s.direction}`).join(', '))
    }

    // Apply pagination
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    console.log('[visibleRows] Pagination:', { currentPage: currentPage.value, pageSize: pageSize.value, start, end, total: filteredRows.length })

    const result = filteredRows.slice(start, end)
    console.log('[visibleRows] ✅ RETURNING:', result.length, 'rows')

    return result
  })

  // Helper: Create empty row with all columns
  function createEmptyRow(rowIndex: number): GridRow {
    const rowId = `empty-${generateULID()}`
    return {
      rowId,
      rowIndex,
      height: config.value.minRowHeight || 35,  // ✅ RIEŠENIE #2B: 25 → 35
      cells: columns.value.map(col => ({
        rowId,
        columnName: col.name,
        value: null,
        isSelected: false,
        isValidationError: false
      }))
    }
  }

  // Helper: Ensure minimum number of rows
  function ensureMinimumRows() {
    const currentRowCount = rowsOrder.value.length
    const minimumRequired = minRows.value

    if (currentRowCount < minimumRequired) {
      const rowsToAdd = minimumRequired - currentRowCount
      console.log(`[dataGridStore] ensureMinimumRows: Adding ${rowsToAdd} empty rows (current: ${currentRowCount}, min: ${minimumRequired})`)

      for (let i = 0; i < rowsToAdd; i++) {
        const row = createEmptyRow(currentRowCount + i)
        rowsMap.value.set(row.rowId, row)
        rowsOrder.value.push(row.rowId)
      }
    }
  }

  // Actions
  // ✅ RIEŠENIE E: loadRows using Map structure
  // ✅ RIEŠENIE #1: Filter empty rows (rows without data in visible columns)
  function loadRows(data: Record<string, any>[]) {
    console.log('[dataGridStore] loadRows:', {
      originalRowCount: data.length,
      columnCount: columns.value.length,
      autoValidate: config.value.autoValidate
    })

    const newMap = new Map<string, GridRow>()
    const newOrder: string[] = []

    // ✅ RIEŠENIE #1: Get visible columns (for empty check)
    const visibleColumns = columns.value.filter(col =>
      !col.specialType && col.visibleForGrid !== false
    )

    let skippedEmptyRows = 0

    data.forEach((rowData, idx) => {
      // ✅ RIEŠENIE #1: Check if row has at least one non-empty cell in VISIBLE columns
      const hasVisibleData = visibleColumns.some(col => {
        const value = rowData[col.name]
        return value !== null && value !== undefined && value !== ''
      })

      if (!hasVisibleData) {
        skippedEmptyRows++
        return  // ✅ SKIP - row has no visible data
      }

      const rowId = rowData.__rowId || generateULID()
      const height = rowData.__rowHeight || 40

      const row: GridRow = {
        rowId,
        rowIndex: newOrder.length,  // ✅ Actual index after filtering
        height,
        cells: columns.value.map(col => ({
          rowId,
          columnName: col.name,
          value: rowData[col.name],
          isSelected: false,
          isValidationError: false
        }))
      }

      newMap.set(rowId, row)  // ✅ O(1) insert
      newOrder.push(rowId)
    })

    rowsMap.value = newMap
    rowsOrder.value = newOrder

    // Ensure minimum rows after loading
    ensureMinimumRows()

    console.log('[dataGridStore] loadRows complete:', {
      originalRows: data.length,
      loadedRows: rowsOrder.value.length,
      skippedEmptyRows,
      filterRate: `${Math.round((skippedEmptyRows / data.length) * 100)}%`,
      minRowsRequired: minRows.value,
      firstRowId: rowsOrder.value[0],
      firstRowCells: newMap.get(rowsOrder.value[0])?.cells.length
    })
  }

  // ✅ RIEŠENIE E: updateCell using O(1) Map.get()
  function updateCell(rowId: string, columnName: string, value: any) {
    const row = getRow(rowId)  // ✅ O(1) instead of O(n)
    if (row) {
      const cell = row.cells.find(c => c.columnName === columnName)
      if (cell) {
        const oldValue = cell.value
        cell.value = value

        console.log('[dataGridStore] updateCell:', {
          rowId,
          columnName,
          oldValue,
          newValue: value,
          autoValidate: config.value.autoValidate
        })

        // Mark cell as changed for validation tracking
        const cellKey = `${rowId}:${columnName}`
        changedCellsSinceValidation.value.add(cellKey)
      } else {
        console.warn('[dataGridStore] updateCell: cell not found', { rowId, columnName })
      }
    } else {
      console.warn('[dataGridStore] updateCell: row not found', { rowId })
    }
  }

  // ✅ RIEŠENIE E: updateRowHeight using O(1) Map.get()
  function updateRowHeight(rowId: string, newHeight: number) {
    const row = getRow(rowId)  // ✅ O(1) instead of O(n)
    if (row) {
      const oldHeight = row.height
      row.height = newHeight

      console.log('[dataGridStore] updateRowHeight:', {
        rowId,
        oldHeight,
        newHeight,
        autoRowHeightEnabled: isAutoRowHeightEnabled.value
      })
    } else {
      console.warn('[dataGridStore] updateRowHeight: row not found', { rowId })
    }
  }

  function setAutoRowHeightEnabled(enabled: boolean) {
    console.log(`[dataGridStore] setAutoRowHeightEnabled: oldValue=${isAutoRowHeightEnabled.value}, newValue=${enabled}`)
    isAutoRowHeightEnabled.value = enabled
  }

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

  // ✅ RIEŠENIE E: addSort using Map - O(1) lookup instead of O(n) findIndex
  function addSort(columnName: string, direction: 'asc' | 'desc', multiSort = false) {
    if (!multiSort) {
      // Single sort - clear all and add new
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

  function clearSort() {
    sortColumnsMap.value.clear()
    sortColumnsOrder.value = []
  }

  function setSortColumns(sorts: { columnName: string; direction: 'asc' | 'desc' }[]) {
    sortColumnsMap.value.clear()
    sortColumnsOrder.value = []
    sorts.forEach((sort, index) => {
      sortColumnsMap.value.set(sort.columnName, { direction: sort.direction, order: index + 1 })
      sortColumnsOrder.value.push(sort.columnName)
    })
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1 // Reset to first page
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function generateULID(): string {
    // Simple ULID-like generator
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // ✅ RIEŠENIE E: deleteRow using Map.delete() - O(1)
  function deleteRow(rowId: string) {
    if (hasRow(rowId)) {
      console.log('[dataGridStore] deleteRow:', {
        rowId,
        rowsBefore: rowsOrder.value.length,
        wasChecked: checkedRows.value.includes(rowId)
      })

      rowsMap.value.delete(rowId)  // ✅ O(1) delete from Map
      rowsOrder.value = rowsOrder.value.filter(id => id !== rowId)  // ✅ O(n) but only on string[]

      // Remove from checked rows
      const checkedIndex = checkedRows.value.indexOf(rowId)
      if (checkedIndex > -1) {
        checkedRows.value.splice(checkedIndex, 1)
      }

      // Reindex rows (update rowIndex in remaining rows)
      rowsOrder.value.forEach((id, idx) => {
        const row = rowsMap.value.get(id)
        if (row) {
          row.rowIndex = idx
        }
      })

      console.log('[dataGridStore] deleteRow complete:', {
        rowsAfter: rowsOrder.value.length
      })

      // ✅ RIEŠENIE #2: Ak bol toto posledný riadok, vytvor nový prázdny
      // Tabuľka NIKDY nie je úplne prázdna
      if (rowsOrder.value.length === 0) {
        console.log('[dataGridStore] deleteRow: Table is empty after deletion, creating minimum rows')
        ensureMinimumRows()  // Vytvorí minRows prázdnych riadkov (default: 1)
      }
    } else {
      console.warn('[dataGridStore] deleteRow: row not found', { rowId })
    }
  }

  // ✅ RIEŠENIE E: insertRow using Map - O(n) only for indexOf on string[]
  function insertRow(afterRowId: string) {
    const index = rowsOrder.value.indexOf(afterRowId)  // ✅ O(n) but on string[] (fast)
    const newRowId = generateULID()

    console.log('[dataGridStore] insertRow:', {
      afterRowId,
      index,
      newRowId,
      rowsBefore: rowsOrder.value.length
    })

    const newRow: GridRow = {
      rowId: newRowId,
      rowIndex: index + 1,
      height: config.value.minRowHeight || 35,  // ✅ RIEŠENIE #2B: 32 → 35
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

    rowsMap.value.set(newRowId, newRow)  // ✅ O(1) insert into Map
    rowsOrder.value.splice(index + 1, 0, newRowId)  // ✅ O(1) insert into order array

    // Reindex rows
    rowsOrder.value.forEach((id, idx) => {
      const row = rowsMap.value.get(id)
      if (row) {
        row.rowIndex = idx
      }
    })

    console.log('[dataGridStore] insertRow complete:', {
      rowsAfter: rowsOrder.value.length
    })
  }

  // ✅ RIEŠENIE E: insertMultipleRows using Map
  function insertMultipleRows(rowId: string, count: number, position: 'above' | 'below') {
    const index = rowsOrder.value.indexOf(rowId)
    if (index === -1) {
      console.warn('[dataGridStore] insertMultipleRows: row not found', { rowId })
      return
    }

    console.log('[dataGridStore] insertMultipleRows:', {
      rowId,
      count,
      position,
      index,
      rowsBefore: rowsOrder.value.length
    })

    const insertIndex = position === 'above' ? index : index + 1
    const newRowIds: string[] = []

    for (let i = 0; i < count; i++) {
      const newRowId = generateULID()
      const newRow: GridRow = {
        rowId: newRowId,
        rowIndex: insertIndex + i,
        height: config.value.minRowHeight || 35,  // ✅ RIEŠENIE #2B: 32 → 35
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

      rowsMap.value.set(newRowId, newRow)  // ✅ O(1) per row
      newRowIds.push(newRowId)
    }

    rowsOrder.value.splice(insertIndex, 0, ...newRowIds)  // ✅ O(n) splice on string[]

    // Reindex rows
    rowsOrder.value.forEach((id, idx) => {
      const row = rowsMap.value.get(id)
      if (row) {
        row.rowIndex = idx
      }
    })

    console.log('[dataGridStore] insertMultipleRows complete:', {
      rowsAfter: rowsOrder.value.length,
      newRowIds
    })
  }

  function toggleCheckbox(rowId: string, checked: boolean) {
    console.log('[toggleCheckbox] Called:', { rowId, checked, currentCount: checkedRows.value.length })
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
    console.log('[toggleCheckbox] After:', { count: checkedRows.value.length, checkboxState: checkboxState.value })
  }

  function isRowChecked(rowId: string): boolean {
    return checkedRows.value.includes(rowId)
  }

  function toggleAllCheckboxes() {
    const currentCount = checkedRows.value.length
    const totalCount = rows.value.length
    console.log('[toggleAllCheckboxes] BEFORE:', { currentCount, totalCount, checkboxState: checkboxState.value })

    if (checkedRows.value.length === rows.value.length) {
      // All checked -> uncheck all
      console.log('[toggleAllCheckboxes] ACTION: Unchecking all (was all checked)')
      checkedRows.value = []
    } else {
      // Not all checked -> check all
      console.log('[toggleAllCheckboxes] ACTION: Checking all (was not all checked)')
      checkedRows.value = rows.value.map(r => r.rowId)
    }

    const newCount = checkedRows.value.length
    const newState = checkboxState.value
    console.log('[toggleAllCheckboxes] AFTER:', { newCount, totalCount, newState })
  }

  // Computed for better reactivity tracking
  const checkboxState = computed(() => {
    const checkedCount = checkedRows.value.length
    if (checkedCount === 0) return 'none'
    if (checkedCount === rows.value.length) return 'all'
    return 'some'
  })

  function setConfig(newConfig: Partial<GridConfig>) {
    console.log('[dataGridStore] setConfig:', {
      newConfig,
      oldAutoValidate: config.value.autoValidate,
      newAutoValidate: newConfig.autoValidate
    })

    config.value = { ...config.value, ...newConfig }
    if (newConfig.pageSize) {
      pageSize.value = newConfig.pageSize
    }

    console.log('[dataGridStore] setConfig complete:', {
      autoValidate: config.value.autoValidate,
      enableValidation: config.value.enableValidation
    })
  }

  function initializeEmptyRows(count?: number) {
    const rowCount = count || minRows.value  // ✅ RIEŠENIE #1B: Use minRows (default: 1) instead of pageSize
    console.log('[dataGridStore] initializeEmptyRows:', {
      requestedCount: count,
      rowCount,
      minRowsValue: minRows.value,
      pageSizeValue: pageSize.value,
      currentRowsLength: rows.value.length,
      columnsLength: columns.value.length
    })

    // ✅ Use Map-based storage like loadRows()
    const newMap = new Map<string, GridRow>()
    const newOrder: string[] = []

    for (let i = 0; i < rowCount; i++) {
      const rowId = generateULID()
      const row: GridRow = {
        rowId,
        rowIndex: i,
        height: config.value.minRowHeight || 35,  // ✅ RIEŠENIE #2B: 32 → 35
        cells: columns.value
          .filter(col => !col.specialType) // Don't create cells for special columns
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

    // ✅ CORRECT: Update rowsMap and rowsOrder (not the computed property 'rows')
    rowsMap.value = newMap
    rowsOrder.value = newOrder

    console.log('[dataGridStore] initializeEmptyRows complete:', {
      newRowsLength: rows.value.length,
      firstRowCellsCount: rows.value[0]?.cells?.length
    })
  }

  function setFilter(filter: FilterExpression | null) {
    console.log('[dataGridStore] setFilter:', { filter })
    filterExpression.value = filter
  }

  function clearFilter() {
    console.log('[dataGridStore] clearFilter')
    filterExpression.value = null
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearSearch() {
    searchQuery.value = ''
  }

  // Selection methods (based on WinUI3 patterns)
  function selectCell(rowId: string, columnName: string, isCtrlPressed: boolean) {
    const cellKey = `${rowId}:${columnName}`

    console.log('[dataGridStore] selectCell:', {
      rowId,
      columnName,
      isCtrlPressed,
      wasSelected: selectedCells.value.has(cellKey),
      currentSelectionCount: selectedCells.value.size
    })

    if (isCtrlPressed) {
      // Ctrl+Click: Toggle selection
      wasCtrlPressed.value = true
      pressedCell.value = null // Disable drag for Ctrl+Click
      isDragging.value = false

      if (selectedCells.value.has(cellKey)) {
        selectedCells.value.delete(cellKey)
        console.log('[dataGridStore] selectCell: toggled OFF', { cellKey })
      } else {
        selectedCells.value.add(cellKey)
        console.log('[dataGridStore] selectCell: toggled ON', { cellKey })
      }
    } else {
      // Normal Click: Clear previous selection and select this cell
      wasCtrlPressed.value = false
      pressedCell.value = { rowId, columnName } // Enable drag selection
      isDragging.value = false

      selectedCells.value.clear()
      selectedCells.value.add(cellKey)
      console.log('[dataGridStore] selectCell: single select', { cellKey })
    }

    console.log('[dataGridStore] selectCell complete:', {
      newSelectionCount: selectedCells.value.size
    })
  }

  function startDragSelection(rowId: string, columnName: string) {
    if (!pressedCell.value) return

    isDragging.value = true

    // Clear previous selection and select range from pressedCell to current cell
    selectedCells.value.clear()
    expandDragSelection(rowId, columnName)
  }

  function expandDragSelection(currentRowId: string, currentColumnName: string) {
    if (!pressedCell.value || !isDragging.value) return

    console.log('[dataGridStore] expandDragSelection:', {
      pressedCell: pressedCell.value,
      currentRowId,
      currentColumnName
    })

    const pressedRowIndex = rows.value.findIndex(r => r.rowId === pressedCell.value!.rowId)
    const currentRowIndex = rows.value.findIndex(r => r.rowId === currentRowId)

    if (pressedRowIndex === -1 || currentRowIndex === -1) return

    // Get selectable column names (data columns + validation, excluding insert/delete/checkbox/rownumber)
    const selectableColumns = columns.value.filter(col =>
      !col.specialType || col.specialType === 'ValidationAlerts'
    ).map(col => col.name)

    console.log('[dataGridStore] expandDragSelection: selectableColumns', {
      total: selectableColumns.length,
      columns: selectableColumns
    })

    const pressedColIndex = selectableColumns.indexOf(pressedCell.value.columnName)
    const currentColIndex = selectableColumns.indexOf(currentColumnName)

    if (pressedColIndex === -1 || currentColIndex === -1) {
      console.warn('[dataGridStore] expandDragSelection: column not found in selectableColumns', {
        pressedColumn: pressedCell.value.columnName,
        currentColumn: currentColumnName,
        pressedColIndex,
        currentColIndex
      })
      return
    }

    // Calculate rectangular selection bounds
    const startRowIndex = Math.min(pressedRowIndex, currentRowIndex)
    const endRowIndex = Math.max(pressedRowIndex, currentRowIndex)
    const startColIndex = Math.min(pressedColIndex, currentColIndex)
    const endColIndex = Math.max(pressedColIndex, currentColIndex)

    console.log('[dataGridStore] expandDragSelection: bounds', {
      rowRange: [startRowIndex, endRowIndex],
      colRange: [startColIndex, endColIndex],
      cellsToSelect: (endRowIndex - startRowIndex + 1) * (endColIndex - startColIndex + 1)
    })

    // Clear and select all cells in the rectangular range
    selectedCells.value.clear()
    for (let rowIdx = startRowIndex; rowIdx <= endRowIndex; rowIdx++) {
      const rowId = rows.value[rowIdx].rowId
      for (let colIdx = startColIndex; colIdx <= endColIndex; colIdx++) {
        const columnName = selectableColumns[colIdx]
        const cellKey = `${rowId}:${columnName}`
        selectedCells.value.add(cellKey)
      }
    }

    console.log('[dataGridStore] expandDragSelection complete:', {
      selectedCellsCount: selectedCells.value.size
    })
  }

  function endDragSelection() {
    pressedCell.value = null
    isDragging.value = false
  }

  function isCellSelected(rowId: string, columnName: string): boolean {
    const cellKey = `${rowId}:${columnName}`
    return selectedCells.value.has(cellKey)
  }

  /**
   * Reserved special column names that cannot be used for data columns
   */
  const SPECIAL_COLUMN_NAMES = [
    '__rowNumber',
    '__checkbox',
    '__validationAlerts',
    '__deleteRow',
    '__insertRow'
  ]

  /**
   * Sets columns with validation and duplicate name handling
   * @throws Error if any column name conflicts with special column names
   */
  function setColumns(inputColumns: GridColumn[]) {
    // Check for conflicts with special column names
    const conflicts = inputColumns
      .filter(col => !col.specialType) // Only check data columns
      .filter(col => SPECIAL_COLUMN_NAMES.includes(col.name))
      .map(col => col.name)

    if (conflicts.length > 0) {
      throw new Error(
        `Column name conflict: The following column names are reserved for special columns and cannot be used: ${conflicts.join(', ')}. ` +
        `Reserved names: ${SPECIAL_COLUMN_NAMES.join(', ')}`
      )
    }

    // Ensure unique column names (rename duplicates)
    const uniqueColumns = ensureUniqueColumnNames(inputColumns)
    columns.value = uniqueColumns

    console.log('[dataGridStore] setColumns:', {
      originalCount: inputColumns.length,
      uniqueCount: uniqueColumns.length,
      columnNames: uniqueColumns.map(c => c.name)
    })
  }

  /**
   * Ensures all column names are unique by appending _1, _2, _3 etc. to duplicates
   * Example: [priezvisko, meno, priezvisko, mesto, priezvisko]
   *       -> [priezvisko_1, meno, priezvisko_2, mesto, priezvisko_3]
   */
  function ensureUniqueColumnNames(inputColumns: GridColumn[]): GridColumn[] {
    const nameCounts = new Map<string, number>()

    return inputColumns.map(col => {
      const originalName = col.name
      const count = nameCounts.get(originalName) || 0
      nameCounts.set(originalName, count + 1)

      if (count > 0) {
        // This is a duplicate - append _N
        return {
          ...col,
          name: `${originalName}_${count + 1}`
        }
      }

      // First occurrence - keep original name but mark it as _1 if there will be duplicates
      return col
    }).map((col, index, arr) => {
      const originalName = col.name.replace(/_\d+$/, '') // Remove any _N suffix
      const duplicateCount = arr.filter(c =>
        c.name === originalName || c.name.startsWith(`${originalName}_`)
      ).length

      if (duplicateCount > 1 && col.name === originalName) {
        // First occurrence of a duplicate - rename to _1
        return { ...col, name: `${originalName}_1` }
      }

      return col
    })
  }

  /**
   * Checks if all non-empty rows have valid cells (no validation errors)
   * A row is considered empty if ALL its cells are null/empty
   * Returns true if all non-empty rows are valid
   */
  function areNonEmptyRowsValid(): boolean {
    for (const row of rows.value) {
      // Check if row is empty (all cells null/empty)
      const isEmpty = row.cells.every(cell =>
        cell.value === null ||
        cell.value === undefined ||
        cell.value === ''
      )

      if (isEmpty) {
        continue // Skip empty rows
      }

      // Row is not empty - check if any cell has validation error
      const hasError = row.cells.some(cell => cell.isValidationError)

      if (hasError) {
        return false // Found a non-empty row with validation error
      }
    }

    return true // All non-empty rows are valid
  }

  /**
   * Marks a cell as validated
   */
  function markCellValidated(rowId: string, columnName: string) {
    const cellKey = `${rowId}:${columnName}`
    console.log('[dataGridStore] markCellValidated:', {
      rowId,
      columnName,
      cellKey,
      validatedCount: validatedCells.value.size
    })
    validatedCells.value.add(cellKey)
    changedCellsSinceValidation.value.delete(cellKey)
  }

  /**
   * Clears all validation tracking (e.g., when loading new data)
   */
  function clearValidationTracking() {
    console.log('[dataGridStore] clearValidationTracking:', {
      clearedValidatedCount: validatedCells.value.size,
      clearedChangedCount: changedCellsSinceValidation.value.size
    })
    validatedCells.value.clear()
    changedCellsSinceValidation.value.clear()
  }

  /**
   * Gets cells that need validation (unvalidated or changed since last validation)
   * SOLUTION 2: Enhanced logging to debug validation tracking
   * ✅ RIEŠENIE #3: Filter columns WITHOUT validation rules (CRITICAL optimization)
   */
  function getCellsNeedingValidation(
    forceValidateAll: boolean = false,
    columnsWithRules?: Set<string>  // ✅ RIEŠENIE #3: Optional parameter for columns with rules
  ): { rowId: string; columnName: string }[] {
    console.log('[getCellsNeedingValidation] 🔍 START', {
      totalRows: rows.value.length,
      validatedCellsCount: validatedCells.value.size,
      changedCellsCount: changedCellsSinceValidation.value.size,
      forceValidateAll,
      hasColumnsWithRules: !!columnsWithRules
    })

    // ✅ RIEŠENIE #3: Get visible columns
    const visibleColumns = new Set(
      columns.value
        .filter(col => col.visibleForGrid !== false)
        .map(col => col.name)
    )

    // ✅ RIEŠENIE #3: If columnsWithRules provided AND not empty, intersect with visible columns
    // Otherwise, validate ALL visible columns (backward compatible)
    // ✅ FIX C: Check both existence AND size to avoid empty Set issue
    const columnsToValidate = (columnsWithRules && columnsWithRules.size > 0)
      ? new Set([...visibleColumns].filter(col => columnsWithRules.has(col)))
      : visibleColumns

    console.log('[getCellsNeedingValidation] 🔍 Column filtering:', {
      totalColumns: columns.value.length,
      visibleColumns: visibleColumns.size,
      columnsWithRules: columnsWithRules?.size ?? 'N/A',
      columnsToValidate: columnsToValidate.size,
      skippedColumns: visibleColumns.size - columnsToValidate.size,
      filterRate: columnsWithRules
        ? `${Math.round((1 - columnsToValidate.size / visibleColumns.size) * 100)}% skipped`
        : 'N/A (no filter)'
    })

    const cellsToValidate: { rowId: string; columnName: string }[] = []
    let emptyRowsSkipped = 0
    let alreadyValidatedCells = 0
    let changedCells = 0
    let neverValidatedCells = 0
    let skippedInvisibleCells = 0
    let skippedNoRulesCells = 0  // ✅ RIEŠENIE #3: Track cells skipped due to no rules

    for (const row of rows.value) {
      // ✅ RIEŠENIE #2: Check if row is empty (only in VISIBLE columns)
      const visibleCells = row.cells.filter(cell => columnsToValidate.has(cell.columnName))
      const isEmpty = visibleCells.every(cell =>
        cell.value === null ||
        cell.value === undefined ||
        cell.value === ''
      )

      if (isEmpty) {
        emptyRowsSkipped++
        continue  // Skip empty rows unconditionally
      }

      for (const cell of row.cells) {
        // ✅ RIEŠENIE #3: Track different skip reasons
        const isVisible = visibleColumns.has(cell.columnName)
        const hasRules = columnsWithRules ? columnsWithRules.has(cell.columnName) : true

        // Skip invisible columns
        if (!isVisible) {
          skippedInvisibleCells++
          continue
        }

        // ✅ RIEŠENIE #3: Skip visible columns WITHOUT rules (if columnsWithRules provided)
        if (columnsWithRules && !hasRules) {
          skippedNoRulesCells++
          continue
        }

        const cellKey = `${cell.rowId}:${cell.columnName}`
        const isValidated = validatedCells.value.has(cellKey)
        const isChanged = changedCellsSinceValidation.value.has(cellKey)

        // With forceValidateAll=true: validate ALL cells (even if already validated and unchanged)
        // With forceValidateAll=false: only validate unvalidated or changed cells
        if (forceValidateAll || !isValidated || isChanged) {
          cellsToValidate.push({
            rowId: cell.rowId,
            columnName: cell.columnName
          })

          // Track reason for validation
          if (!isValidated) {
            neverValidatedCells++
          } else if (isChanged) {
            changedCells++
          }
        } else {
          alreadyValidatedCells++
        }
      }
    }

    console.log('[getCellsNeedingValidation] 📊 RESULT:', {
      cellsToValidate: cellsToValidate.length,
      neverValidated: neverValidatedCells,
      changedSinceValidation: changedCells,
      alreadyValidated: alreadyValidatedCells,
      emptyRowsSkipped: emptyRowsSkipped,
      skippedInvisibleCells: skippedInvisibleCells,
      skippedNoRulesCells: skippedNoRulesCells,  // ✅ RIEŠENIE #3: CRITICAL METRIC!
      sampleCells: cellsToValidate.slice(0, 3).map(c => `${c.rowId}:${c.columnName}`)
    })

    return cellsToValidate
  }

  // Set minimum rows configuration
  function setMinRows(newMinRows: number) {
    if (newMinRows < 0) {
      console.warn('[dataGridStore] setMinRows: Invalid value, must be >= 0:', newMinRows)
      return
    }
    minRows.value = newMinRows
    ensureMinimumRows()  // Immediately apply if current rows below new minimum
    console.log(`[dataGridStore] setMinRows: ${newMinRows}`)
  }

  // ✅ RIEŠENIE #3: Cleanup method to clear all data and prevent memory leaks
  function clearAllData() {
    console.log('[dataGridStore] clearAllData called - clearing all state')

    // Clear row data
    rowsMap.value.clear()
    rowsOrder.value = []

    // Clear selection state
    selectedCells.value.clear()
    checkedRows.value = []
    pressedCell.value = null
    isDragging.value = false
    wasCtrlPressed.value = false

    // Clear validation tracking
    validatedCells.value.clear()
    changedCellsSinceValidation.value.clear()

    // Clear sort/filter state
    sortColumnsMap.value.clear()
    sortColumnsOrder.value = []
    filterExpression.value = null
    searchQuery.value = ''

    // Reset pagination
    currentPage.value = 1

    console.log('[dataGridStore] All data cleared successfully')
  }

  /**
   * Updates a specific column with new properties (reactive)
   * ✅ RIEŠENIE #3A: Force reactivity by replacing entire column object
   * @param columnName - Name of the column to update
   * @param updates - Partial column object with properties to update
   */
  function updateColumn(columnName: string, updates: Partial<GridColumn>) {
    const colIndex = columns.value.findIndex(c => c.name === columnName)
    if (colIndex !== -1) {
      const oldColumn = columns.value[colIndex]

      // ✅ RIEŠENIE #3A: Replace entire object instead of mutating
      columns.value[colIndex] = {
        ...oldColumn,
        ...updates
      }

      // ✅ RIEŠENIE #3A: CRITICAL - Trigger array reactivity by creating new array
      columns.value = [...columns.value]

      console.log(`[dataGridStore] updateColumn: ${columnName}`, {
        oldWidth: oldColumn.width,
        newWidth: updates.width,
        updates
      })
    } else {
      console.warn(`[dataGridStore] updateColumn: Column not found: ${columnName}`)
    }
  }

  return {
    // State
    rows,
    columns,
    selectedCells,
    checkedRows,
    pageSize,
    currentPage,
    sortColumns,
    filterExpression,
    searchQuery,
    searchResults,
    config,
    pressedCell,
    isDragging,
    wasCtrlPressed,
    isAutoRowHeightEnabled,
    minRows,

    // Computed
    visibleRows,
    totalRows,
    totalPages,
    checkboxState,

    // Actions
    getRow,          // ✅ RIEŠENIE #3: O(1) row lookup
    loadRows,
    updateCell,
    updateRowHeight,
    setAutoRowHeightEnabled,
    addSort,
    clearSort,
    setSortColumns,
    setPageSize,
    goToPage,
    deleteRow,
    insertRow,
    insertMultipleRows,
    toggleCheckbox,
    isRowChecked,
    toggleAllCheckboxes,
    setConfig,
    initializeEmptyRows,
    setFilter,
    clearFilter,
    setSearchQuery,
    clearSearch,
    selectCell,
    startDragSelection,
    expandDragSelection,
    endDragSelection,
    isCellSelected,
    setColumns,
    updateColumn,    // ✅ RIEŠENIE #1: Reactive column updates
    ensureUniqueColumnNames,
    areNonEmptyRowsValid,
    markCellValidated,
    clearValidationTracking,
    getCellsNeedingValidation,
    setMinRows,
    clearAllData  // ✅ RIEŠENIE #3: Export cleanup method
  }
  })

  // ✅ RIEŠENIE #2: Cache the store definition before returning
  storeCache.set(storeId, storeDefinition)

  // ✅ RIEŠENIE #2: Remove from pending - creation complete
  pendingStores.delete(storeId)

  console.log('[useDataGridStore] Store definition cached for:', storeId)

  // Return StoreDefinition - let component call it
  return storeDefinition
}
