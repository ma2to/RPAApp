// composables/useFiltering.ts
import { ref } from 'vue'
import type { GridRow } from '@/stores/dataGridStore'

// ✅ FIX: Store interface for accessing checkbox state
interface DataGridStoreInterface {
  checkedRows: string[]
  isRowChecked(rowId: string): boolean
}

export type FilterOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'StartsWith'
  | 'EndsWith'
  | 'GreaterThan'
  | 'LessThan'
  | 'GreaterThanOrEquals'
  | 'LessThanOrEquals'
  | 'IsEmpty'
  | 'IsNotEmpty'

export interface FilterExpression {
  type: 'simple' | 'composite'
}

export interface SimpleFilter extends FilterExpression {
  type: 'simple'
  columnName: string
  operator: FilterOperator
  value: any
}

export interface CompositeFilter extends FilterExpression {
  type: 'composite'
  left: FilterExpression
  right: FilterExpression
  operator: 'AND' | 'OR'
}

export function useFiltering() {
  const currentFilter = ref<FilterExpression | null>(null)

  function evaluateFilter(row: GridRow, filter: FilterExpression, store?: DataGridStoreInterface): boolean {
    if (filter.type === 'simple') {
      return evaluateSimpleFilter(row, filter as SimpleFilter, store)
    } else {
      return evaluateCompositeFilter(row, filter as CompositeFilter, store)
    }
  }

  function evaluateSimpleFilter(row: GridRow, filter: SimpleFilter, store?: DataGridStoreInterface): boolean {
    // ✅ FIX: Special handling for checkbox column (__checkbox)
    // Checkbox values are stored in store.checkedRows, NOT in row.cells
    let cellValue: any

    if (filter.columnName === '__checkbox' && store) {
      // Get checkbox state from store.checkedRows
      cellValue = store.isRowChecked(row.rowId)
    } else {
      // Normal columns - get value from row.cells
      const cell = row.cells.find(c => c.columnName === filter.columnName)
      cellValue = cell?.value
    }

    const filterValue = filter.value

    switch (filter.operator) {
      case 'Equals':
        return cellValue === filterValue

      case 'NotEquals':
        return cellValue !== filterValue

      case 'GreaterThan':
        return Number(cellValue) > Number(filterValue)

      case 'LessThan':
        return Number(cellValue) < Number(filterValue)

      case 'GreaterThanOrEquals':
        return Number(cellValue) >= Number(filterValue)

      case 'LessThanOrEquals':
        return Number(cellValue) <= Number(filterValue)

      case 'Contains':
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())

      case 'StartsWith':
        return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase())

      case 'EndsWith':
        return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase())

      case 'IsEmpty':
        return cellValue == null || String(cellValue).trim() === ''

      case 'IsNotEmpty':
        return cellValue != null && String(cellValue).trim() !== ''

      default:
        return true
    }
  }

  function evaluateCompositeFilter(row: GridRow, filter: CompositeFilter, store?: DataGridStoreInterface): boolean {
    // ✅ FIX: Defensive check for null/undefined children
    if (!filter.left || !filter.right) {
      console.error('[evaluateCompositeFilter] Invalid filter structure - missing children:', filter)
      return true // Return true to not filter out rows when filter is corrupted
    }

    const leftResult = evaluateFilter(row, filter.left, store)

    // Short-circuit evaluation
    if (filter.operator === 'AND' && !leftResult) {
      return false // No need to evaluate right if left is false
    }
    if (filter.operator === 'OR' && leftResult) {
      return true // No need to evaluate right if left is true
    }

    const rightResult = evaluateFilter(row, filter.right, store)

    return filter.operator === 'AND' ? leftResult && rightResult : leftResult || rightResult
  }

  function filterRows(rows: GridRow[], filter: FilterExpression | null, store?: DataGridStoreInterface): GridRow[] {
    if (!filter) return rows
    return rows.filter(row => evaluateFilter(row, filter, store))
  }

  function setFilter(filter: FilterExpression | null) {
    currentFilter.value = filter
  }

  function clearFilter() {
    currentFilter.value = null
  }

  return {
    currentFilter,
    filterRows,
    setFilter,
    clearFilter,
    evaluateFilter
  }
}
