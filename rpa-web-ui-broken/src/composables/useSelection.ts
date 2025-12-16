// composables/useSelection.ts
import { ref } from 'vue'
import type { GridRow, GridColumn } from '@/stores/dataGridStore'

export interface CellAddress {
  rowId: string
  columnName: string
}

export function useSelection() {
  const selectedCells = ref<Set<string>>(new Set())
  const anchorCell = ref<CellAddress | null>(null)

  function selectCell(rowId: string, columnName: string, mode: 'replace' | 'add' | 'toggle' = 'replace') {
    const cellKey = `${rowId}:${columnName}`

    if (mode === 'replace') {
      selectedCells.value.clear()
      selectedCells.value.add(cellKey)
      anchorCell.value = { rowId, columnName }
    } else if (mode === 'add') {
      selectedCells.value.add(cellKey)
    } else if (mode === 'toggle') {
      if (selectedCells.value.has(cellKey)) {
        selectedCells.value.delete(cellKey)
      } else {
        selectedCells.value.add(cellKey)
      }
    }
  }

  function selectRange(startCell: CellAddress, endCell: CellAddress, rows: GridRow[], columns: GridColumn[]) {
    selectedCells.value.clear()

    const startRowIdx = rows.findIndex(r => r.rowId === startCell.rowId)
    const endRowIdx = rows.findIndex(r => r.rowId === endCell.rowId)
    const startColIdx = columns.findIndex(c => c.name === startCell.columnName)
    const endColIdx = columns.findIndex(c => c.name === endCell.columnName)

    if (startRowIdx === -1 || endRowIdx === -1 || startColIdx === -1 || endColIdx === -1) {
      return
    }

    const minRow = Math.min(startRowIdx, endRowIdx)
    const maxRow = Math.max(startRowIdx, endRowIdx)
    const minCol = Math.min(startColIdx, endColIdx)
    const maxCol = Math.max(startColIdx, endColIdx)

    for (let r = minRow; r <= maxRow; r++) {
      const row = rows[r]
      for (let c = minCol; c <= maxCol; c++) {
        const column = columns[c]
        if (row && column) {
          selectedCells.value.add(`${row.rowId}:${column.name}`)
        }
      }
    }
  }

  function selectRow(rowId: string, columns: GridColumn[]) {
    for (const column of columns) {
      selectedCells.value.add(`${rowId}:${column.name}`)
    }
  }

  function selectColumn(columnName: string, rows: GridRow[]) {
    for (const row of rows) {
      selectedCells.value.add(`${row.rowId}:${columnName}`)
    }
  }

  function selectAll(rows: GridRow[], columns: GridColumn[]) {
    selectedCells.value.clear()
    for (const row of rows) {
      for (const column of columns) {
        selectedCells.value.add(`${row.rowId}:${column.name}`)
      }
    }
  }

  function clearSelection() {
    selectedCells.value.clear()
    anchorCell.value = null
  }

  function getSelectedCells(): CellAddress[] {
    return Array.from(selectedCells.value).map(key => {
      const [rowId, columnName] = key.split(':')
      return { rowId, columnName }
    })
  }

  function isCellSelected(rowId: string, columnName: string): boolean {
    return selectedCells.value.has(`${rowId}:${columnName}`)
  }

  return {
    selectedCells,
    anchorCell,
    selectCell,
    selectRange,
    selectRow,
    selectColumn,
    selectAll,
    clearSelection,
    getSelectedCells,
    isCellSelected
  }
}
