/**
 * Theme Types for DataGrid and ListBox Components
 * Based on WinUI3 AdvancedDataGrid theming system
 */

// ============================================================================
// Basic Color Set
// ============================================================================

export interface ColorSet {
  background: string
  foreground: string
  border: string
}

// ============================================================================
// DataGrid Theme - Public API (Simplified)
// ============================================================================

export interface CellColors {
  defaultBackground: string
  defaultForeground: string
  hoverBackground: string
  hoverForeground: string
  focusedBackground: string
  focusedForeground: string
  disabledBackground: string
  disabledForeground: string
  readOnlyBackground: string
  readOnlyForeground: string
}

export interface RowColors {
  evenRowBackground: string
  oddRowBackground: string
  hoverBackground: string
  selectedBackground: string
  selectedForeground: string
  selectedInactiveBackground: string
  selectedInactiveForeground: string
}

export interface HeaderColors {
  background: string
  foreground: string
  hoverBackground: string
  pressedBackground: string
  sortIndicatorColor: string
}

export interface ValidationColors {
  errorBackground: string
  errorForeground: string
  errorBorder: string
  warningBackground: string
  warningForeground: string
  warningBorder: string
  infoBackground: string
  infoForeground: string
  infoBorder: string
}

export interface SelectionColors {
  selectionBorder: string
  selectionFill: string
  multiSelectionBackground: string
  multiSelectionForeground: string
}

export interface BorderColors {
  cellBorder: string
  rowBorder: string
  columnBorder: string
  gridBorder: string
  focusedCellBorder: string
}

export interface SpecialColumnColors {
  rowNumberBackground: string
  rowNumberForeground: string
  checkboxBorder: string
  checkboxBackground: string
  checkboxForeground: string
  deleteRowBackground: string
  deleteRowForeground: string
  deleteRowHoverBackground: string
  insertRowBackground: string
  insertRowForeground: string
  insertRowBorder: string
  insertRowHoverBackground: string
  insertRowHoverForeground: string
  validationAlertsErrorBackground: string
  validationAlertsErrorForeground: string
}

export interface UIControlColors {
  resizeGripColor: string
  menuBackground: string
  menuForeground: string
  menuHoverBackground: string
  dialogBackground: string
  dialogForeground: string
  dialogBorder: string
  placeholderColor: string
  searchPanelBackground: string
  searchPanelForeground: string
  searchPanelBorder: string
  filterRowBackground: string
  filterRowForeground: string
  filterRowBorder: string
  paginationBackground: string
  paginationForeground: string
  paginationBorder: string
  paginationButtonHoverBackground: string
}

export interface DataGridTheme {
  cellColors: CellColors
  rowColors: RowColors
  headerColors: HeaderColors
  validationColors: ValidationColors
  selectionColors: SelectionColors
  borderColors: BorderColors
  specialColumnColors: SpecialColumnColors
  uiControlColors: UIControlColors
}

// ============================================================================
// ListBox Theme - Public API
// ============================================================================

export interface ListBoxItemColors {
  defaultBackground: string
  defaultForeground: string
  hoverBackground: string
  hoverForeground: string
  selectedBackground: string
  selectedForeground: string
  selectedHoverBackground: string
  selectedHoverForeground: string
  disabledBackground: string
  disabledForeground: string
}

export interface ListBoxContainerColors {
  background: string
  border: string
  focusedBorder: string
  titleForeground: string
}

export interface ListBoxCheckboxColors {
  border: string
  background: string
  checkedBackground: string
  checkedBorder: string
  hoverBorder: string
}

export interface ListBoxScrollbarColors {
  trackBackground: string
  thumbBackground: string
  thumbHoverBackground: string
}

export interface ListBoxTheme {
  itemColors: ListBoxItemColors
  containerColors: ListBoxContainerColors
  checkboxColors: ListBoxCheckboxColors
  scrollbarColors: ListBoxScrollbarColors
}

// ============================================================================
// Comprehensive Theme - Advanced API (State-Based)
// ============================================================================

export interface ElementStates {
  normal: ColorSet
  hover: ColorSet
  pressed: ColorSet
  focused: ColorSet
  editing: ColorSet
  error: ColorSet
  warning: ColorSet
  success: ColorSet
  readOnly: ColorSet
  disabled: ColorSet
  selected: ColorSet
  active: ColorSet
  alert: ColorSet
}

export interface HeaderElementColors {
  normal: ColorSet
  hover: ColorSet
  pressed: ColorSet
  focused: ColorSet
  sorted: ColorSet
  filtered: ColorSet
}

export interface CellElementColors {
  normal: ColorSet
  hover: ColorSet
  focused: ColorSet
  editing: ColorSet
  readOnly: ColorSet
  disabled: ColorSet
  selected: ColorSet
  error: ColorSet
  warning: ColorSet
}

export interface ButtonElementColors {
  normal: ColorSet
  hover: ColorSet
  pressed: ColorSet
  disabled: ColorSet
}

export interface RowElementColors {
  even: ColorSet
  odd: ColorSet
  hover: ColorSet
  selected: ColorSet
  selectedInactive: ColorSet
}

export interface GridElementColors {
  container: ColorSet
  border: ColorSet
  scrollbar: {
    track: ColorSet
    thumb: ColorSet
    thumbHover: ColorSet
  }
}

export interface FilterRowElementColors {
  container: ColorSet
  input: ColorSet
  inputFocused: ColorSet
  button: ButtonElementColors
}

export interface SearchPanelElementColors {
  container: ColorSet
  input: ColorSet
  inputFocused: ColorSet
  button: ButtonElementColors
  matchHighlight: ColorSet
}

export interface PaginationElementColors {
  container: ColorSet
  button: ButtonElementColors
  currentPage: ColorSet
  input: ColorSet
}

export interface SpecialColumnElementColors {
  rowNumber: ColorSet
  checkbox: {
    normal: ColorSet
    checked: ColorSet
    hover: ColorSet
  }
  deleteRow: ButtonElementColors
  insertRow: ButtonElementColors
  validationAlerts: {
    normal: ColorSet
    error: ColorSet
    warning: ColorSet
    info: ColorSet
  }
}

export interface ComprehensiveDataGridTheme {
  header: HeaderElementColors
  cell: CellElementColors
  row: RowElementColors
  grid: GridElementColors
  filterRow: FilterRowElementColors
  searchPanel: SearchPanelElementColors
  pagination: PaginationElementColors
  specialColumn: SpecialColumnElementColors
}

export interface ComprehensiveListBoxTheme {
  container: ColorSet
  item: {
    normal: ColorSet
    hover: ColorSet
    selected: ColorSet
    selectedHover: ColorSet
    disabled: ColorSet
  }
  checkbox: {
    normal: ColorSet
    checked: ColorSet
    hover: ColorSet
  }
  scrollbar: {
    track: ColorSet
    thumb: ColorSet
    thumbHover: ColorSet
  }
  title: {
    foreground: string
  }
}

// ============================================================================
// Combined Theme Interface
// ============================================================================

export interface ThemeConfig {
  // Simple API
  dataGrid?: Partial<DataGridTheme>
  listBox?: Partial<ListBoxTheme>

  // Advanced API
  comprehensiveDataGrid?: Partial<ComprehensiveDataGridTheme>
  comprehensiveListBox?: Partial<ComprehensiveListBoxTheme>
}
