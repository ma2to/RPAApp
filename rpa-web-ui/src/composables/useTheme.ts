import { computed, inject, provide, ref, type Ref } from 'vue'
import type {
  DataGridTheme,
  ListBoxTheme,
  ThemeConfig,
  ComprehensiveDataGridTheme,
  ComprehensiveListBoxTheme
} from '@/types/theme'

// ============================================================================
// Default Theme: Light
// ============================================================================

export const defaultDataGridTheme: DataGridTheme = {
  cellColors: {
    defaultBackground: '#ffffff',
    defaultForeground: '#212529',
    hoverBackground: '#f8f9fa',
    hoverForeground: '#212529',
    focusedBackground: '#e3f2fd',
    focusedForeground: '#0d6efd',
    disabledBackground: '#e9ecef',
    disabledForeground: '#6c757d',
    readOnlyBackground: '#f8f9fa',
    readOnlyForeground: '#495057'
  },
  rowColors: {
    evenRowBackground: '#ffffff',
    oddRowBackground: '#f8f9fa',
    hoverBackground: '#e3f2fd',
    selectedBackground: '#0d6efd',
    selectedForeground: '#ffffff',
    selectedInactiveBackground: '#e9ecef',
    selectedInactiveForeground: '#495057'
  },
  headerColors: {
    background: '#f1f3f5',
    foreground: '#212529',
    hoverBackground: '#e9ecef',
    pressedBackground: '#dee2e6',
    sortIndicatorColor: '#0d6efd'
  },
  validationColors: {
    errorBackground: '#ffebee',
    errorForeground: '#c62828',
    errorBorder: '#ef5350',
    warningBackground: '#fff3e0',
    warningForeground: '#e65100',
    warningBorder: '#ff9800',
    infoBackground: '#e3f2fd',
    infoForeground: '#1565c0',
    infoBorder: '#2196f3'
  },
  selectionColors: {
    selectionBorder: '#0d6efd',
    selectionFill: 'rgba(13, 110, 253, 0.1)',
    multiSelectionBackground: '#bbdefb',
    multiSelectionForeground: '#0d6efd'
  },
  borderColors: {
    cellBorder: '#e0e0e0',
    rowBorder: '#e0e0e0',
    columnBorder: '#dee2e6',
    gridBorder: '#ced4da',
    focusedCellBorder: '#0d6efd'
  },
  specialColumnColors: {
    rowNumberBackground: '#f5f5f5',
    rowNumberForeground: '#666666',
    checkboxBorder: '#ced4da',
    checkboxBackground: '#ffffff',
    checkboxForeground: '#212529',
    deleteRowBackground: 'transparent',
    deleteRowForeground: '#dc3545',
    deleteRowHoverBackground: '#ffebee',
    insertRowBackground: 'transparent',
    insertRowForeground: '#28a745',
    insertRowBorder: 'transparent',
    insertRowHoverBackground: '#e8f5e9',
    insertRowHoverForeground: '#1b5e20',
    validationAlertsErrorBackground: '#ffebee',
    validationAlertsErrorForeground: '#c62828'
  },
  uiControlColors: {
    resizeGripColor: '#adb5bd',
    menuBackground: '#ffffff',
    menuForeground: '#212529',
    menuHoverBackground: '#f8f9fa',
    dialogBackground: '#ffffff',
    dialogForeground: '#212529',
    dialogBorder: '#dee2e6',
    placeholderColor: '#6c757d',
    searchPanelBackground: '#f8f9fa',
    searchPanelForeground: '#212529',
    searchPanelBorder: '#ced4da',
    filterRowBackground: '#f8f9fa',
    filterRowForeground: '#212529',
    filterRowBorder: '#dee2e6',
    paginationBackground: '#ffffff',
    paginationForeground: '#212529',
    paginationBorder: '#dee2e6',
    paginationButtonHoverBackground: '#e9ecef'
  }
}

export const defaultListBoxTheme: ListBoxTheme = {
  itemColors: {
    defaultBackground: '#ffffff',
    defaultForeground: '#212529',
    hoverBackground: '#f8f9fa',
    hoverForeground: '#212529',
    selectedBackground: '#e3f2fd',
    selectedForeground: '#0d6efd',
    selectedHoverBackground: '#bbdefb',
    selectedHoverForeground: '#0d6efd',
    disabledBackground: '#e9ecef',
    disabledForeground: '#6c757d'
  },
  containerColors: {
    background: '#ffffff',
    border: '#ced4da',
    focusedBorder: '#0d6efd',
    titleForeground: '#212529'
  },
  checkboxColors: {
    border: '#ced4da',
    background: '#ffffff',
    checkedBackground: '#0d6efd',
    checkedBorder: '#0d6efd',
    hoverBorder: '#adb5bd'
  },
  scrollbarColors: {
    trackBackground: '#f1f1f1',
    thumbBackground: '#c1c1c1',
    thumbHoverBackground: '#a8a8a8'
  }
}

// ============================================================================
// Dark Theme
// ============================================================================

export const darkDataGridTheme: DataGridTheme = {
  cellColors: {
    defaultBackground: '#1e1e1e',
    defaultForeground: '#e0e0e0',
    hoverBackground: '#2d2d2d',
    hoverForeground: '#e0e0e0',
    focusedBackground: '#1e3a5f',
    focusedForeground: '#64b5f6',
    disabledBackground: '#2a2a2a',
    disabledForeground: '#808080',
    readOnlyBackground: '#252525',
    readOnlyForeground: '#b0b0b0'
  },
  rowColors: {
    evenRowBackground: '#1e1e1e',
    oddRowBackground: '#252525',
    hoverBackground: '#2d2d2d',
    selectedBackground: '#1976d2',
    selectedForeground: '#ffffff',
    selectedInactiveBackground: '#3a3a3a',
    selectedInactiveForeground: '#b0b0b0'
  },
  headerColors: {
    background: '#2a2a2a',
    foreground: '#e0e0e0',
    hoverBackground: '#333333',
    pressedBackground: '#3a3a3a',
    sortIndicatorColor: '#64b5f6'
  },
  validationColors: {
    errorBackground: '#3d1a1a',
    errorForeground: '#ef5350',
    errorBorder: '#c62828',
    warningBackground: '#3d2e1a',
    warningForeground: '#ffb74d',
    warningBorder: '#f57c00',
    infoBackground: '#1a2a3d',
    infoForeground: '#64b5f6',
    infoBorder: '#1976d2'
  },
  selectionColors: {
    selectionBorder: '#1976d2',
    selectionFill: 'rgba(25, 118, 210, 0.2)',
    multiSelectionBackground: '#1e3a5f',
    multiSelectionForeground: '#64b5f6'
  },
  borderColors: {
    cellBorder: '#3a3a3a',
    rowBorder: '#3a3a3a',
    columnBorder: '#3a3a3a',
    gridBorder: '#4a4a4a',
    focusedCellBorder: '#1976d2'
  },
  specialColumnColors: {
    rowNumberBackground: '#252525',
    rowNumberForeground: '#b0b0b0',
    checkboxBorder: '#4a4a4a',
    checkboxBackground: '#2a2a2a',
    checkboxForeground: '#e0e0e0',
    deleteRowBackground: 'transparent',
    deleteRowForeground: '#ef5350',
    deleteRowHoverBackground: '#3d1a1a',
    insertRowBackground: 'transparent',
    insertRowForeground: '#66bb6a',
    insertRowBorder: 'transparent',
    insertRowHoverBackground: '#1a3d1a',
    insertRowHoverForeground: '#81c784',
    validationAlertsErrorBackground: '#3d1a1a',
    validationAlertsErrorForeground: '#ef5350'
  },
  uiControlColors: {
    resizeGripColor: '#5a5a5a',
    menuBackground: '#2a2a2a',
    menuForeground: '#e0e0e0',
    menuHoverBackground: '#333333',
    dialogBackground: '#2a2a2a',
    dialogForeground: '#e0e0e0',
    dialogBorder: '#4a4a4a',
    placeholderColor: '#808080',
    searchPanelBackground: '#252525',
    searchPanelForeground: '#e0e0e0',
    searchPanelBorder: '#4a4a4a',
    filterRowBackground: '#252525',
    filterRowForeground: '#e0e0e0',
    filterRowBorder: '#4a4a4a',
    paginationBackground: '#2a2a2a',
    paginationForeground: '#e0e0e0',
    paginationBorder: '#4a4a4a',
    paginationButtonHoverBackground: '#333333'
  }
}

export const darkListBoxTheme: ListBoxTheme = {
  itemColors: {
    defaultBackground: '#1e1e1e',
    defaultForeground: '#e0e0e0',
    hoverBackground: '#2d2d2d',
    hoverForeground: '#e0e0e0',
    selectedBackground: '#1e3a5f',
    selectedForeground: '#64b5f6',
    selectedHoverBackground: '#2d4a6f',
    selectedHoverForeground: '#64b5f6',
    disabledBackground: '#2a2a2a',
    disabledForeground: '#808080'
  },
  containerColors: {
    background: '#1e1e1e',
    border: '#4a4a4a',
    focusedBorder: '#1976d2',
    titleForeground: '#e0e0e0'
  },
  checkboxColors: {
    border: '#4a4a4a',
    background: '#2a2a2a',
    checkedBackground: '#1976d2',
    checkedBorder: '#1976d2',
    hoverBorder: '#5a5a5a'
  },
  scrollbarColors: {
    trackBackground: '#2a2a2a',
    thumbBackground: '#4a4a4a',
    thumbHoverBackground: '#5a5a5a'
  }
}

// ============================================================================
// High Contrast Theme
// ============================================================================

export const highContrastDataGridTheme: DataGridTheme = {
  cellColors: {
    defaultBackground: '#000000',
    defaultForeground: '#ffffff',
    hoverBackground: '#1a1a1a',
    hoverForeground: '#ffff00',
    focusedBackground: '#000080',
    focusedForeground: '#ffffff',
    disabledBackground: '#333333',
    disabledForeground: '#808080',
    readOnlyBackground: '#1a1a1a',
    readOnlyForeground: '#c0c0c0'
  },
  rowColors: {
    evenRowBackground: '#000000',
    oddRowBackground: '#0d0d0d',
    hoverBackground: '#1a1a1a',
    selectedBackground: '#000080',
    selectedForeground: '#ffffff',
    selectedInactiveBackground: '#333333',
    selectedInactiveForeground: '#c0c0c0'
  },
  headerColors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    hoverBackground: '#333333',
    pressedBackground: '#4d4d4d',
    sortIndicatorColor: '#00ff00'
  },
  validationColors: {
    errorBackground: '#330000',
    errorForeground: '#ff0000',
    errorBorder: '#ff0000',
    warningBackground: '#332200',
    warningForeground: '#ffff00',
    warningBorder: '#ffff00',
    infoBackground: '#003333',
    infoForeground: '#00ffff',
    infoBorder: '#00ffff'
  },
  selectionColors: {
    selectionBorder: '#00ff00',
    selectionFill: 'rgba(0, 255, 0, 0.2)',
    multiSelectionBackground: '#000080',
    multiSelectionForeground: '#ffffff'
  },
  borderColors: {
    cellBorder: '#808080',
    rowBorder: '#808080',
    columnBorder: '#808080',
    gridBorder: '#ffffff',
    focusedCellBorder: '#00ff00'
  },
  specialColumnColors: {
    rowNumberBackground: '#1a1a1a',
    rowNumberForeground: '#ffffff',
    checkboxBorder: '#ffffff',
    checkboxBackground: '#000000',
    checkboxForeground: '#ffffff',
    deleteRowBackground: 'transparent',
    deleteRowForeground: '#ff0000',
    deleteRowHoverBackground: '#330000',
    insertRowBackground: 'transparent',
    insertRowForeground: '#00ff00',
    insertRowBorder: 'transparent',
    insertRowHoverBackground: '#003300',
    insertRowHoverForeground: '#00ff00',
    validationAlertsErrorBackground: '#330000',
    validationAlertsErrorForeground: '#ff0000'
  },
  uiControlColors: {
    resizeGripColor: '#ffffff',
    menuBackground: '#000000',
    menuForeground: '#ffffff',
    menuHoverBackground: '#1a1a1a',
    dialogBackground: '#000000',
    dialogForeground: '#ffffff',
    dialogBorder: '#ffffff',
    placeholderColor: '#808080',
    searchPanelBackground: '#1a1a1a',
    searchPanelForeground: '#ffffff',
    searchPanelBorder: '#ffffff',
    filterRowBackground: '#1a1a1a',
    filterRowForeground: '#ffffff',
    filterRowBorder: '#ffffff',
    paginationBackground: '#000000',
    paginationForeground: '#ffffff',
    paginationBorder: '#ffffff',
    paginationButtonHoverBackground: '#333333'
  }
}

export const highContrastListBoxTheme: ListBoxTheme = {
  itemColors: {
    defaultBackground: '#000000',
    defaultForeground: '#ffffff',
    hoverBackground: '#1a1a1a',
    hoverForeground: '#ffff00',
    selectedBackground: '#000080',
    selectedForeground: '#ffffff',
    selectedHoverBackground: '#0000b0',
    selectedHoverForeground: '#ffffff',
    disabledBackground: '#333333',
    disabledForeground: '#808080'
  },
  containerColors: {
    background: '#000000',
    border: '#ffffff',
    focusedBorder: '#00ff00',
    titleForeground: '#ffffff'
  },
  checkboxColors: {
    border: '#ffffff',
    background: '#000000',
    checkedBackground: '#000080',
    checkedBorder: '#ffffff',
    hoverBorder: '#ffff00'
  },
  scrollbarColors: {
    trackBackground: '#1a1a1a',
    thumbBackground: '#808080',
    thumbHoverBackground: '#c0c0c0'
  }
}

// ============================================================================
// Theme Provider
// ============================================================================

const THEME_KEY = Symbol('theme')

export function useThemeProvider(theme: ThemeConfig = {}) {
  const dataGridTheme = ref<DataGridTheme>(
    mergeDeep(defaultDataGridTheme, theme.dataGrid || {}) as DataGridTheme
  )
  const listBoxTheme = ref<ListBoxTheme>(
    mergeDeep(defaultListBoxTheme, theme.listBox || {}) as ListBoxTheme
  )

  provide(THEME_KEY, {
    dataGridTheme,
    listBoxTheme
  })

  return {
    dataGridTheme,
    listBoxTheme
  }
}

export function useTheme() {
  const theme = inject<{
    dataGridTheme: Ref<DataGridTheme>
    listBoxTheme: Ref<ListBoxTheme>
  }>(THEME_KEY, {
    dataGridTheme: ref(defaultDataGridTheme),
    listBoxTheme: ref(defaultListBoxTheme)
  })

  return theme
}

// ============================================================================
// Utility Functions
// ============================================================================

function mergeDeep(target: any, source: any): any {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// ============================================================================
// CSS Variable Generation
// ============================================================================

export function generateDataGridCSSVariables(theme: DataGridTheme): Record<string, string> {
  return {
    // Cell Colors
    '--dg-cell-bg': theme.cellColors.defaultBackground,
    '--dg-cell-fg': theme.cellColors.defaultForeground,
    '--dg-cell-hover-bg': theme.cellColors.hoverBackground,
    '--dg-cell-hover-fg': theme.cellColors.hoverForeground,
    '--dg-cell-focused-bg': theme.cellColors.focusedBackground,
    '--dg-cell-focused-fg': theme.cellColors.focusedForeground,
    '--dg-cell-disabled-bg': theme.cellColors.disabledBackground,
    '--dg-cell-disabled-fg': theme.cellColors.disabledForeground,
    '--dg-cell-readonly-bg': theme.cellColors.readOnlyBackground,
    '--dg-cell-readonly-fg': theme.cellColors.readOnlyForeground,

    // Row Colors
    '--dg-row-even-bg': theme.rowColors.evenRowBackground,
    '--dg-row-odd-bg': theme.rowColors.oddRowBackground,
    '--dg-row-hover-bg': theme.rowColors.hoverBackground,
    '--dg-row-selected-bg': theme.rowColors.selectedBackground,
    '--dg-row-selected-fg': theme.rowColors.selectedForeground,
    '--dg-row-selected-inactive-bg': theme.rowColors.selectedInactiveBackground,
    '--dg-row-selected-inactive-fg': theme.rowColors.selectedInactiveForeground,

    // Header Colors
    '--dg-header-bg': theme.headerColors.background,
    '--dg-header-fg': theme.headerColors.foreground,
    '--dg-header-hover-bg': theme.headerColors.hoverBackground,
    '--dg-header-pressed-bg': theme.headerColors.pressedBackground,
    '--dg-header-sort-indicator': theme.headerColors.sortIndicatorColor,

    // Validation Colors
    '--dg-validation-error-bg': theme.validationColors.errorBackground,
    '--dg-validation-error-fg': theme.validationColors.errorForeground,
    '--dg-validation-error-border': theme.validationColors.errorBorder,
    '--dg-validation-warning-bg': theme.validationColors.warningBackground,
    '--dg-validation-warning-fg': theme.validationColors.warningForeground,
    '--dg-validation-warning-border': theme.validationColors.warningBorder,
    '--dg-validation-info-bg': theme.validationColors.infoBackground,
    '--dg-validation-info-fg': theme.validationColors.infoForeground,
    '--dg-validation-info-border': theme.validationColors.infoBorder,

    // Selection Colors
    '--dg-selection-border': theme.selectionColors.selectionBorder,
    '--dg-selection-fill': theme.selectionColors.selectionFill,
    '--dg-multi-selection-bg': theme.selectionColors.multiSelectionBackground,
    '--dg-multi-selection-fg': theme.selectionColors.multiSelectionForeground,

    // Border Colors
    '--dg-border-cell': theme.borderColors.cellBorder,
    '--dg-border-row': theme.borderColors.rowBorder,
    '--dg-border-column': theme.borderColors.columnBorder,
    '--dg-border-grid': theme.borderColors.gridBorder,
    '--dg-border-focused-cell': theme.borderColors.focusedCellBorder,

    // Special Column Colors
    '--dg-special-rownumber-bg': theme.specialColumnColors.rowNumberBackground,
    '--dg-special-rownumber-fg': theme.specialColumnColors.rowNumberForeground,
    '--dg-special-checkbox-border': theme.specialColumnColors.checkboxBorder,
    '--dg-special-checkbox-bg': theme.specialColumnColors.checkboxBackground,
    '--dg-special-checkbox-fg': theme.specialColumnColors.checkboxForeground,
    '--dg-special-delete-bg': theme.specialColumnColors.deleteRowBackground,
    '--dg-special-delete-fg': theme.specialColumnColors.deleteRowForeground,
    '--dg-special-delete-hover-bg': theme.specialColumnColors.deleteRowHoverBackground,
    '--dg-special-insert-bg': theme.specialColumnColors.insertRowBackground,
    '--dg-special-insert-fg': theme.specialColumnColors.insertRowForeground,
    '--dg-special-insert-border': theme.specialColumnColors.insertRowBorder,
    '--dg-special-insert-hover-bg': theme.specialColumnColors.insertRowHoverBackground,
    '--dg-special-insert-hover-fg': theme.specialColumnColors.insertRowHoverForeground,
    '--dg-special-validation-error-bg': theme.specialColumnColors.validationAlertsErrorBackground,
    '--dg-special-validation-error-fg': theme.specialColumnColors.validationAlertsErrorForeground,

    // UI Control Colors
    '--dg-ui-resize-grip': theme.uiControlColors.resizeGripColor,
    '--dg-ui-menu-bg': theme.uiControlColors.menuBackground,
    '--dg-ui-menu-fg': theme.uiControlColors.menuForeground,
    '--dg-ui-menu-hover-bg': theme.uiControlColors.menuHoverBackground,
    '--dg-ui-dialog-bg': theme.uiControlColors.dialogBackground,
    '--dg-ui-dialog-fg': theme.uiControlColors.dialogForeground,
    '--dg-ui-dialog-border': theme.uiControlColors.dialogBorder,
    '--dg-ui-placeholder': theme.uiControlColors.placeholderColor,
    '--dg-ui-search-bg': theme.uiControlColors.searchPanelBackground,
    '--dg-ui-search-fg': theme.uiControlColors.searchPanelForeground,
    '--dg-ui-search-border': theme.uiControlColors.searchPanelBorder,
    '--dg-ui-filter-bg': theme.uiControlColors.filterRowBackground,
    '--dg-ui-filter-fg': theme.uiControlColors.filterRowForeground,
    '--dg-ui-filter-border': theme.uiControlColors.filterRowBorder,
    '--dg-ui-pagination-bg': theme.uiControlColors.paginationBackground,
    '--dg-ui-pagination-fg': theme.uiControlColors.paginationForeground,
    '--dg-ui-pagination-border': theme.uiControlColors.paginationBorder,
    '--dg-ui-pagination-button-hover-bg': theme.uiControlColors.paginationButtonHoverBackground
  }
}

export function generateListBoxCSSVariables(theme: ListBoxTheme): Record<string, string> {
  return {
    // Item Colors
    '--lb-item-bg': theme.itemColors.defaultBackground,
    '--lb-item-fg': theme.itemColors.defaultForeground,
    '--lb-item-hover-bg': theme.itemColors.hoverBackground,
    '--lb-item-hover-fg': theme.itemColors.hoverForeground,
    '--lb-item-selected-bg': theme.itemColors.selectedBackground,
    '--lb-item-selected-fg': theme.itemColors.selectedForeground,
    '--lb-item-selected-hover-bg': theme.itemColors.selectedHoverBackground,
    '--lb-item-selected-hover-fg': theme.itemColors.selectedHoverForeground,
    '--lb-item-disabled-bg': theme.itemColors.disabledBackground,
    '--lb-item-disabled-fg': theme.itemColors.disabledForeground,

    // Container Colors
    '--lb-container-bg': theme.containerColors.background,
    '--lb-container-border': theme.containerColors.border,
    '--lb-container-focused-border': theme.containerColors.focusedBorder,
    '--lb-title-fg': theme.containerColors.titleForeground,

    // Checkbox Colors
    '--lb-checkbox-border': theme.checkboxColors.border,
    '--lb-checkbox-bg': theme.checkboxColors.background,
    '--lb-checkbox-checked-bg': theme.checkboxColors.checkedBackground,
    '--lb-checkbox-checked-border': theme.checkboxColors.checkedBorder,
    '--lb-checkbox-hover-border': theme.checkboxColors.hoverBorder,

    // Scrollbar Colors
    '--lb-scrollbar-track-bg': theme.scrollbarColors.trackBackground,
    '--lb-scrollbar-thumb-bg': theme.scrollbarColors.thumbBackground,
    '--lb-scrollbar-thumb-hover-bg': theme.scrollbarColors.thumbHoverBackground
  }
}
