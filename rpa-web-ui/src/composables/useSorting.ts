// composables/useSorting.ts
import { ref } from 'vue'
import type { GridRow } from '@/stores/dataGridStore'

export interface SortColumn {
  columnName: string
  direction: 'asc' | 'desc'
}

export function useSorting() {
  const sortColumns = ref<SortColumn[]>([])

  function sortRows(rows: GridRow[], sorts: SortColumn[]): GridRow[] {
    if (sorts.length === 0) return rows

    return rows.slice().sort((a, b) => {
      for (const { columnName, direction } of sorts) {
        // Get cell values for comparison
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
    // Null handling
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1

    // Number comparison
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b
    }

    // Date comparison
    const aDate = new Date(a)
    const bDate = new Date(b)
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return aDate.getTime() - bDate.getTime()
    }

    // String comparison
    const aStr = String(a).toLowerCase()
    const bStr = String(b).toLowerCase()
    return aStr.localeCompare(bStr)
  }

  function addSort(columnName: string, direction: 'asc' | 'desc', multiSort = false) {
    if (!multiSort) {
      // Single sort - replace all
      sortColumns.value = [{ columnName, direction }]
    } else {
      // Multi sort - add or update
      const existingIdx = sortColumns.value.findIndex(s => s.columnName === columnName)
      if (existingIdx >= 0) {
        // Toggle direction if same column
        sortColumns.value[existingIdx].direction = direction
      } else {
        // Add new sort column
        sortColumns.value.push({ columnName, direction })
      }
    }
  }

  function removeSort(columnName: string) {
    sortColumns.value = sortColumns.value.filter(s => s.columnName !== columnName)
  }

  function clearSort() {
    sortColumns.value = []
  }

  return {
    sortColumns,
    sortRows,
    addSort,
    removeSort,
    clearSort
  }
}
