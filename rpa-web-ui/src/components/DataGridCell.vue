<template>
  <div
    ref="cellRef"
    class="grid-cell"
    :class="cellClasses"
    :style="cellStyle"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @dblclick="handleDoubleClick"
    @keydown="handleCellKeyDown"
    @contextmenu="handleContextMenu"
    tabindex="0"
  >
    <!-- Display mode -->
    <div v-if="!isEditing" class="cell-text" v-html="highlightedValue"></div>

    <!-- Edit mode -->
    <textarea
      v-else
      ref="inputRef"
      v-model="editValue"
      class="cell-input"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    ></textarea>

    <!-- Validation error tooltip - Teleported to body to avoid overflow:hidden issues -->
    <Teleport to="body">
      <div
        v-if="validationError && (isHovered || isSelected) && tooltipPosition"
        class="validation-tooltip"
        :class="{
          'validation-tooltip--error': validationError.severity === 'Error' || validationError.severity === 'Critical',
          'validation-tooltip--warning': validationError.severity === 'Warning' || validationError.severity === 'Info'
        }"
        :style="{
          position: 'fixed',
          left: tooltipPosition.left + 'px',
          top: tooltipPosition.top + 'px'
        }"
      >
        {{ validationError.message }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, inject } from 'vue'
import { useDataGridStore, type GridCell, type GridColumn, type GridRow } from '@/stores/dataGridStore'
import ContextMenu from '@imengyu/vue3-context-menu'

const props = defineProps<{
  cell: GridCell
  column: GridColumn
  isSelected: boolean
  gridId?: string
}>()

const emit = defineEmits<{
  editComplete: [rowId: string, columnName: string, value: any]
  cellInput: [rowId: string, columnName: string, value: any]
  copy: []
  cut: []
  paste: []
  delete: []
  insertAbove: [rowId: string, count: number]
  insertBelow: [rowId: string, count: number]
}>()

const store = useDataGridStore(props.gridId)()

// Inject validation from parent DataGrid component
const validation = inject('validation', null) as ReturnType<typeof import('@/composables/useValidation').useValidation> | null
// FIXED: Don't destructure getValidationErrors - access validationErrors directly to preserve reactivity
const validateCellThrottled = validation?.validateCellThrottled || (() => {})
const validationErrors = validation?.validationErrors || {}

const cellRef = ref<HTMLElement>()
const inputRef = ref<HTMLTextAreaElement>()
const isEditing = ref(false)
const editValue = ref(props.cell.value)
const originalValue = ref<any>(null)  // Store original value before editing for cancel support
const isHovered = ref(false)  // Track hover state for validation tooltip
const tooltipPosition = ref<{ left: number; top: number } | null>(null)  // Tooltip position for Teleport
const isConfirming = ref(false)  // Track if we're in the process of confirming edit (prevents handleBlur race condition)

const displayValue = computed(() => {
  if (props.cell.value == null) return ''
  return String(props.cell.value)
})

// Check if cell value contains newlines (from Shift+Enter)
const hasNewlines = computed(() => {
  return displayValue.value.includes('\n')
})

// Highlighted value with search matches
const highlightedValue = computed(() => {
  const text = displayValue.value
  const searchQuery = store.searchQuery

  if (!searchQuery || !text) {
    return escapeHtml(text)
  }

  try {
    // Escape special regex characters from search query for safety
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')

    return escapeHtml(text).replace(
      regex,
      '<mark class="search-highlight">$1</mark>'
    )
  } catch (error) {
    // If regex fails, return plain text
    return escapeHtml(text)
  }
})

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Check for validation errors - access validationErrors directly for reactivity
const validationError = computed(() => {
  const errors = validationErrors[props.cell.rowId] || []
  return errors.find((e: { columnName: string; message: string; severity: string }) => e.columnName === props.cell.columnName)
})

const cellClasses = computed(() => {
  return {
    'cell--selected': props.isSelected,
    'cell--editing': isEditing.value,
    'cell--validation-error': validationError.value?.severity === 'Error' || validationError.value?.severity === 'Critical',
    'cell--validation-warning': validationError.value?.severity === 'Warning' || validationError.value?.severity === 'Info',
    'cell--readonly': props.column.isReadOnly,
    'cell--auto-height': store.isAutoRowHeightEnabled,
    // Special case: has newlines but AutoRowHeight is OFF - still wrap by newlines only
    'cell--has-newlines': hasNewlines.value && !store.isAutoRowHeightEnabled
  }
})

const cellStyle = computed(() => {
  // CSS Grid handles column widths via grid-template-columns
  // No need for flexbox properties (flexGrow, flexShrink, flexBasis)
  return {}
})

function handleMouseDown(event: MouseEvent) {
  // Only handle left mouse button
  if (event.button !== 0) return

  const isCtrlPressed = event.ctrlKey

  console.log('[DataGridCell] MouseDown:', { rowId: props.cell.rowId, columnName: props.cell.columnName, isEditing: isEditing.value })

  // Call store's selectCell method
  store.selectCell(props.cell.rowId, props.cell.columnName, isCtrlPressed)
}

function handleMouseEnter(event: MouseEvent) {
  // Track hover state for validation tooltip
  isHovered.value = true

  // Calculate tooltip position (above the cell)
  if (cellRef.value) {
    const rect = cellRef.value.getBoundingClientRect()
    tooltipPosition.value = {
      left: rect.left,
      top: rect.top - 4  // 4px above the cell
    }
  }

  // Block drag selection if Ctrl is currently pressed (real-time check)
  // This matches the original WinUI component behavior
  if (event.ctrlKey || store.wasCtrlPressed) {
    return
  }

  // Check if left button is still pressed (dragging)
  const isLeftButtonPressed = event.buttons === 1

  // If we have a pressed cell and left button is still pressed
  if (store.pressedCell && !store.isDragging && isLeftButtonPressed) {
    // Check if entering the SAME cell - ignore to prevent premature drag
    if (
      props.cell.rowId === store.pressedCell.rowId &&
      props.cell.columnName === store.pressedCell.columnName
    ) {
      return
    }

    // Different cell - start drag selection
    store.startDragSelection(props.cell.rowId, props.cell.columnName)
  } else if (store.isDragging && isLeftButtonPressed) {
    // Already dragging - expand selection
    store.expandDragSelection(props.cell.rowId, props.cell.columnName)
  }
}

function handleMouseLeave() {
  // Clear hover state for validation tooltip
  isHovered.value = false
  tooltipPosition.value = null
}

function handleCellKeyDown(event: KeyboardEvent) {
  // When cell is selected but NOT editing, Enter key enters edit mode
  if (!isEditing.value && props.isSelected && event.key === 'Enter' && !props.column.isReadOnly) {
    event.preventDefault()
    enterEditMode()
  }
}

async function enterEditMode() {
  if (props.column.isReadOnly) return

  console.log('[DataGridCell] enterEditMode:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    currentCellValue: props.cell.value,
    storingAsOriginal: props.cell.value
  })

  // CRITICAL FIX: Store original value BEFORE editing starts
  originalValue.value = props.cell.value

  isEditing.value = true
  editValue.value = props.cell.value

  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

async function handleDoubleClick() {
  console.log('[DataGridCell] handleDoubleClick:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    currentValue: props.cell.value
  })
  enterEditMode()
}

// Get all cells from the current row (for empty row check)
function getRowCells() {
  const row = store.rows.find((r: GridRow) => r.rowId === props.cell.rowId)
  if (!row) return undefined

  // Return array of { columnName, value } for all cells
  return row.cells.map((c: GridCell) => ({ columnName: c.columnName, value: c.value }))
}

function handleInput() {
  console.log('[DataGridCell] handleInput:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    newValue: editValue.value,
    autoValidate: store.config.autoValidate
  })

  // Throttled validation (300ms) with row cells for empty check - only if autoValidate is enabled
  if (store.config.autoValidate && store.config.enableValidation) {
    const rowCells = getRowCells()
    validateCellThrottled(props.cell.rowId, props.cell.columnName, editValue.value, rowCells)
  }

  // Emit input event for AutoRowHeight real-time adjustment
  emit('cellInput', props.cell.rowId, props.cell.columnName, editValue.value)
}

function confirmEdit() {
  console.log('[DataGridCell] confirmEdit:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    confirmedValue: editValue.value,
    originalWas: originalValue.value
  })

  // CRITICAL FIX: Set flag to prevent handleBlur from canceling during confirm
  isConfirming.value = true

  // Re-validate immediately before confirming (ensures empty values are properly validated) - only if autoValidate is enabled
  if (store.config.autoValidate && store.config.enableValidation) {
    const rowCells = getRowCells()
    validateCellThrottled(props.cell.rowId, props.cell.columnName, editValue.value, rowCells)
  }

  // Always commit edit, even if there's a validation error
  // Validation errors will be shown but won't block input
  emit('editComplete', props.cell.rowId, props.cell.columnName, editValue.value)
  isEditing.value = false

  // Clear stored original value after successful commit
  originalValue.value = null

  // Restore focus to the cell so pressing Enter again will re-enter edit mode
  nextTick(() => {
    try {
      console.log(`[DataGridCell] confirmEdit - Attempting to restore focus to cell: rowId=${props.cell.rowId}, column=${props.cell.columnName}`)
      if (cellRef.value) {
        cellRef.value.focus()
        console.log('[DataGridCell] confirmEdit - Focus restored successfully')
      } else {
        console.log('[DataGridCell] confirmEdit - WARNING: cellRef.value is null/undefined')
      }
    } catch (error) {
      console.log(`[DataGridCell] confirmEdit - ERROR restoring focus: ${error}`)
    }
  })

  // Reset confirming flag after a delay to ensure blur doesn't cancel
  setTimeout(() => {
    isConfirming.value = false
  }, 100)
}

function handleKeyDown(event: KeyboardEvent) {
  console.log('[DataGridCell] handleKeyDown:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    key: event.key,
    shift: event.shiftKey,
    ctrl: event.ctrlKey
  })

  // ESC = cancel edit and restore original value
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()  // CRITICAL FIX: Prevent event from bubbling to parent div
    cancelEdit()
    return
  }

  // Enter without Shift = confirm edit
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    event.stopPropagation()  // CRITICAL FIX: Prevent event from bubbling to parent div handleCellKeyDown
    confirmEdit()
    return
  }

  // Shift+Enter = new line (default textarea behavior, just allow it)
  // Tab = insert tab character (prevent default tab navigation)
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    // Insert tab character at cursor position
    editValue.value = editValue.value.substring(0, start) + '\t' + editValue.value.substring(end)

    // Move cursor after the tab
    nextTick(() => {
      target.selectionStart = target.selectionEnd = start + 1
    })
  }
}

function cancelEdit() {
  console.log('[DataGridCell] cancelEdit:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    originalValue: originalValue.value,
    currentEditValue: editValue.value
  })

  // CRITICAL FIX: Restore original value from BEFORE editing started
  editValue.value = originalValue.value
  isEditing.value = false

  // CRITICAL FIX: Emit editComplete with original value to restore it in the store
  emit('editComplete', props.cell.rowId, props.cell.columnName, originalValue.value)

  // Re-validate with original value - only if autoValidate is enabled
  if (store.config.autoValidate && store.config.enableValidation) {
    const rowCells = getRowCells()
    validateCellThrottled(props.cell.rowId, props.cell.columnName, originalValue.value, rowCells)
  }

  // Clear stored original value
  originalValue.value = null

  // Restore focus to the cell so pressing Enter again will re-enter edit mode
  nextTick(() => {
    try {
      console.log(`[DataGridCell] cancelEdit - Attempting to restore focus to cell: rowId=${props.cell.rowId}, column=${props.cell.columnName}`)
      if (cellRef.value) {
        cellRef.value.focus()
        console.log('[DataGridCell] cancelEdit - Focus restored successfully')
      } else {
        console.log('[DataGridCell] cancelEdit - WARNING: cellRef.value is null/undefined')
      }
    } catch (error) {
      console.log(`[DataGridCell] cancelEdit - ERROR restoring focus: ${error}`)
    }
  })
}

function handleBlur() {
  console.log('[DataGridCell] handleBlur:', {
    rowId: props.cell.rowId,
    columnName: props.cell.columnName,
    isEditing: isEditing.value,
    isConfirming: isConfirming.value
  })

  // CRITICAL FIX: Don't cancel if we're in the process of confirming (prevents race condition)
  // Cancel edit immediately on blur (clicking away or focus loss) ONLY if not confirming
  if (isEditing.value && !isConfirming.value) {
    cancelEdit()
  }
}

function handleContextMenu(event: MouseEvent) {
  // Only show context menu with Ctrl key pressed
  if (!event.ctrlKey) {
    return
  }

  event.preventDefault()

  // Calculate selected row IDs and indices (like original component)
  const selectedRowData = new Map<string, number>() // rowId -> rowIndex
  store.selectedCells.forEach((cellKey: string) => {
    const [rowId] = cellKey.split(':')
    const row = store.rows.find((r: GridRow) => r.rowId === rowId)
    if (row) {
      selectedRowData.set(rowId, row.rowIndex)
    }
  })

  const selectedRowCount = selectedRowData.size
  const selectedRowIndices = Array.from(selectedRowData.values())

  // Find min/max row indices (like original WinUI component)
  const minRowIndex = selectedRowIndices.length > 0 ? Math.min(...selectedRowIndices) : 0
  const maxRowIndex = selectedRowIndices.length > 0 ? Math.max(...selectedRowIndices) : 0

  // Get rowId for min/max indices
  const minRow = store.rows.find((r: GridRow) => r.rowIndex === minRowIndex)
  const maxRow = store.rows.find((r: GridRow) => r.rowIndex === maxRowIndex)

  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    items: [
      {
        label: 'Copy',
        icon: '📋',
        onClick: () => emit('copy'),
        disabled: !props.isSelected
      },
      {
        label: 'Cut',
        icon: '✂️',
        onClick: () => emit('cut'),
        disabled: !props.isSelected || props.column.isReadOnly
      },
      {
        label: 'Paste',
        icon: '📄',
        onClick: () => emit('paste'),
        disabled: props.column.isReadOnly
      },
      { divided: true },
      {
        label: 'Delete',
        icon: '🗑️',
        onClick: () => emit('delete'),
        disabled: !props.isSelected || props.column.isReadOnly
      },
      { divided: true },
      {
        label: `Insert ${selectedRowCount} row(s) above`,
        icon: '⬆️',
        // Insert above the MINIMUM selected row index
        onClick: () => emit('insertAbove', minRow?.rowId || props.cell.rowId, selectedRowCount || 1),
        disabled: props.column.isReadOnly
      },
      {
        label: `Insert ${selectedRowCount} row(s) below`,
        icon: '⬇️',
        // Insert below the MAXIMUM selected row index
        onClick: () => emit('insertBelow', maxRow?.rowId || props.cell.rowId, selectedRowCount || 1),
        disabled: props.column.isReadOnly
      }
    ]
  })
}
</script>

<style scoped>
.grid-cell {
  position: relative;
  padding: 5px 8px;  /* Increased from 4px to 5px for better spacing */
  border-right: 1px solid var(--dg-border-cell, #e0e0e0);
  display: flex; /* Flex for internal content layout only */
  align-items: flex-start;
  background-color: var(--dg-cell-bg, #ffffff);
  color: var(--dg-cell-fg, #212529);
  font-size: 14px;  /* CRITICAL: Must match useAutoRowHeight config.fontSize */
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  overflow: hidden; /* Prevent content from breaking grid layout */
  /* Prevent browser text selection during drag selection */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.grid-cell:hover {
  background-color: var(--dg-cell-hover-bg, #f8f9fa);
  color: var(--dg-cell-hover-fg, #212529);
}

.cell--selected {
  /* Selection only changes background, not border - border is preserved from validation/other states */
  background-color: var(--dg-cell-focused-bg, #bbdefb);  /* More prominent blue (was #e3f2fd) */
  color: var(--dg-cell-focused-fg, #0d6efd);
  /* No border - let other states (validation, etc.) control border/outline */
}

/* Prevent hover from removing selection background */
.cell--selected:hover {
  background-color: var(--dg-cell-focused-bg, #bbdefb);  /* Keep selection background on hover */
  color: var(--dg-cell-focused-fg, #0d6efd);
}

.cell--editing {
  padding: 0;
}

.cell--validation-error {
  /* Use OUTLINE instead of BORDER to prevent layout shift (outline doesn't affect box model) */
  outline: 2px solid var(--dg-validation-error-border, #ff4444);
  outline-offset: -2px; /* Draw outline inside the cell */
  background-color: var(--dg-validation-error-bg, #ffebee);
  color: var(--dg-validation-error-fg, #c62828);
  border: none;
}

.cell--validation-warning {
  /* Use OUTLINE instead of BORDER to prevent layout shift (outline doesn't affect box model) */
  /* DEFAULT: Red border same as error (user requested unified color) */
  outline: 2px solid var(--dg-validation-warning-border, #ff4444);
  outline-offset: -2px; /* Draw outline inside the cell */
  /* DEFAULT: Red background same as error (user requested unified color) */
  background-color: var(--dg-validation-warning-bg, #ffebee);
  color: var(--dg-validation-warning-fg, #c62828);
  border: none;
}

/* CRITICAL: When cell is BOTH selected AND has validation error, selection background overrides validation background */
/* This makes selection visible on validation cells while keeping the red outline */
.cell--selected.cell--validation-error,
.cell--selected.cell--validation-warning {
  background-color: var(--dg-cell-focused-bg, #bbdefb) !important;  /* More prominent blue */
  /* Keep validation outline and color */
}

/* Prevent hover from removing selection background on validation cells */
.cell--selected.cell--validation-error:hover,
.cell--selected.cell--validation-warning:hover {
  background-color: var(--dg-cell-focused-bg, #bbdefb) !important;  /* Keep selection background on hover */
}

.cell--readonly {
  background-color: var(--dg-cell-readonly-bg, #f5f5f5);
  color: var(--dg-cell-readonly-fg, #495057);
  cursor: not-allowed;
}

.cell-text {
  flex: 1;
  min-width: 0; /* CRITICAL: Allow flex item to shrink below content size for text wrapping */
  line-height: 1.5;
  /* Default: no wrapping, overflow hidden (when AutoRowHeight is OFF) */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Prevent browser text selection */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* When AutoRowHeight is enabled, allow text wrapping */
.cell--auto-height .cell-text {
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

/* When cell has newlines but AutoRowHeight is OFF - wrap ONLY at \n, not at spaces */
.cell--has-newlines .cell-text {
  white-space: pre !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 4px 8px;
  font-family: inherit;
  font-size: inherit;
  background-color: var(--dg-cell-focused-bg, #e3f2fd);
  color: var(--dg-cell-focused-fg, #0d6efd);
  resize: none;
  /* Hide overflow so row expands instead of showing scrollbars */
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  /* CRITICAL: Enable text wrapping */
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  /* Remove scrollbars completely - all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  /* Remove native appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Hide scrollbars for webkit browsers */
.cell-input::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* Remove any browser-specific controls */
.cell-input::-webkit-resizer,
.cell-input::-webkit-scrollbar-corner,
.cell-input::-webkit-scrollbar-track,
.cell-input::-webkit-scrollbar-thumb,
.cell-input::-webkit-scrollbar-button {
  display: none !important;
}

/* Remove Mozilla scrollbar buttons */
.cell-input::-moz-scrollbar-button {
  display: none !important;
}

.validation-tooltip {
  /* position: fixed is set inline via :style */
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10000;  /* Very high z-index since it's in body */
  pointer-events: none;
  max-width: 300px;
  white-space: normal;
  transform: translateY(-100%);  /* Position above the calculated point */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);  /* Add shadow for visibility */
}

.validation-tooltip--error {
  background: var(--dg-validation-error-fg, #ff4444);
}

.validation-tooltip--warning {
  background: var(--dg-validation-warning-fg, #ff9800);
}

/* Search highlighting */
:deep(.search-highlight) {
  background-color: var(--dg-search-highlight-bg, #ffeb3b);
  color: var(--dg-search-highlight-fg, #000);
  font-weight: 500;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
