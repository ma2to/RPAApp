// Grid types for copy/paste and other features
export interface GridRow {
  rowId: string
  rowIndex: number
  height: number
  cells: GridCell[]
}

export interface GridCell {
  rowId: string
  columnName: string
  value: any
  isSelected: boolean
  isValidationError: boolean
  validationMessage?: string
}

export interface GridColumn {
  name: string
  header: string
  width: number
  isVisible: boolean
  specialType?: 'RowNumber' | 'Checkbox' | 'Actions'
}
