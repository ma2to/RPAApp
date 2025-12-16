<template>
  <div class="grid-header" :style="{ gridTemplateColumns }">
    <div
      v-for="column in columns"
      :key="column.name"
      class="header-cell"
      :class="{ 'header-cell--auto-width': column.autoWidth }"
      @click="handleHeaderClick($event, column)"
      @contextmenu.prevent="showHeaderContextMenu($event, column)"
    >
      <!-- Custom tri-state checkbox (not native input) -->
      <div
        v-if="column.specialType === 'Checkbox'"
        class="custom-checkbox"
        :class="{
          'checkbox-none': store.checkboxState === 'none',
          'checkbox-some': store.checkboxState === 'some',
          'checkbox-all': store.checkboxState === 'all'
        }"
        @click.stop="handleCheckboxHeaderClick"
        title="Toggle all checkboxes"
      >
        <!-- Checkmark for 'all' state -->
        <span v-if="store.checkboxState === 'all'" class="checkbox-icon">✓</span>
        <!-- Dash for 'some' state -->
        <span v-else-if="store.checkboxState === 'some'" class="checkbox-icon">−</span>
      </div>

      <span v-else class="header-text">{{ column.header }}</span>

      <!-- Multi-column sort indicator -->
      <span
        v-if="column.isSortable && getSortInfo(column.name)"
        class="sort-icon"
        :class="getSortInfo(column.name)?.isPrimary ? 'sort-icon--primary' : 'sort-icon--secondary'"
      >
        {{ getSortInfo(column.name)?.direction === 'asc' ? '▲' : '▼' }}
        <span v-if="getSortInfo(column.name)?.order && getSortInfo(column.name)!.order > 1" class="sort-order">
          {{ getSortInfo(column.name)?.order }}
        </span>
      </span>

      <!-- Resize grip -->
      <div
        class="resize-grip"
        @mousedown.stop="startResize(column, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataGridStore, type GridColumn } from '@/stores/dataGridStore'
import ContextMenu from '@imengyu/vue3-context-menu'

const props = defineProps<{
  columns: GridColumn[]
  gridTemplateColumns: string
  gridId?: string
  isGridReady?: boolean
  isProcessing?: boolean  // ✅ RIEŠENIE A: Processing flag
  showHiddenColumnsPanel?: boolean  // Optional: Show hidden columns panel (default: true)
}>()

const emit = defineEmits<{
  sort: [columnName: string, direction: 'asc' | 'desc']
  resize: [columnName: string, newWidth: number]
  hideColumn: [columnName: string]
  autoFitColumn: [columnName: string]
  showFilter: [columnName: string]
}>()

const store = useDataGridStore(props.gridId)()

// No longer need ref or watch - custom checkbox is controlled by Vue reactivity

const resizingColumn = ref<GridColumn | null>(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)

/**
 * ✅ RIEŠENIE B: Computed sortInfoMap - cache sort info for all columns
 * Only recalculates when store.sortColumns changes (1× access instead of 6× per column)
 */
const sortInfoMap = computed(() => {
  const map = new Map<string, { direction: 'asc' | 'desc'; order: number; isPrimary: boolean }>()

  store.sortColumns.forEach((sortCol, index) => {
    map.set(sortCol.columnName, {
      direction: sortCol.direction,
      order: index + 1,
      isPrimary: index === 0
    })
  })

  return map
})

/**
 * ✅ RIEŠENIE E + B: Gets sort information using computed Map (O(1) lookup)
 * Returns null if column is not sorted
 */
function getSortInfo(columnName: string): { direction: 'asc' | 'desc'; order: number; isPrimary: boolean } | null {
  return sortInfoMap.value.get(columnName) ?? null
}

function handleHeaderClick(event: MouseEvent, column: GridColumn) {
  // For checkbox column, do nothing (checkbox handles its own click)
  if (column.specialType === 'Checkbox') {
    return
  }

  // For sortable columns with Shift key, toggle sort
  if (column.isSortable && event.shiftKey) {
    handleSort(column, true) // multi-sort mode
    return
  }

  // For other columns, show context menu
  showHeaderContextMenu(event, column)
}

function handleCheckboxHeaderClick() {
  store.toggleAllCheckboxes()
}

function handleSort(column: GridColumn, multiSort = false) {
  if (!column.isSortable) return

  const currentSort = getSortInfo(column.name)

  if (currentSort) {
    // Column is already sorted - toggle direction
    const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc'
    store.addSort(column.name, newDirection, multiSort)
  } else {
    // Column is not sorted - add ascending sort
    store.addSort(column.name, 'asc', multiSort)
  }

  // Emit for compatibility (even though store handles it)
  const sortInfo = getSortInfo(column.name)
  if (sortInfo) {
    emit('sort', column.name, sortInfo.direction)
  }
}

function startResize(column: GridColumn, event: MouseEvent) {
  resizingColumn.value = column
  resizeStartX.value = event.clientX
  resizeStartWidth.value = column.width

  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(event: MouseEvent) {
  if (!resizingColumn.value) return

  const delta = event.clientX - resizeStartX.value
  const newWidth = Math.max(
    resizingColumn.value.minWidth,
    Math.min(resizingColumn.value.maxWidth, resizeStartWidth.value + delta)
  )

  emit('resize', resizingColumn.value.name, newWidth)
}

function onResizeEnd() {
  resizingColumn.value = null
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
}

function showHeaderContextMenu(event: MouseEvent, column: GridColumn) {
  // ✅ FIX: Early return if grid is not ready
  if (props.isGridReady === false) {
    console.error('[showHeaderContextMenu] Grid not ready yet')
    return
  }

  // ✅ FIX: Early return if store is not initialized
  if (!store) {
    console.error('[showHeaderContextMenu] Store not initialized yet')
    return
  }

  // ✅ RIEŠENIE A: Check processing flag
  if (props.isProcessing) {
    console.error('[showHeaderContextMenu] Grid is currently processing data')
    return  // Silent return - no alert needed
  }

  // ✅ RIEŠENIE D: Defensive copy of reactive data
  const sortColumnsCopy = [...store.sortColumns]
  const filterExpressionCopy = store.filterExpression

  const menuItems = []

  // Sort options
  if (column.isSortable) {
    const currentSort = getSortInfo(column.name)
    const hasOtherSorts = sortColumnsCopy.length > 0  // ✅ Use copy

    menuItems.push(
      {
        label: 'Sort Ascending',
        icon: '▲',
        onClick: () => {
          store.addSort(column.name, 'asc', false)
          emit('sort', column.name, 'asc')
        }
      },
      {
        label: 'Sort Descending',
        icon: '▼',
        onClick: () => {
          store.addSort(column.name, 'desc', false)
          emit('sort', column.name, 'desc')
        }
      }
    )

    // Multi-sort options
    if (hasOtherSorts) {
      menuItems.push(
        { divided: true },
        {
          label: 'Add to Sort (Asc)',
          icon: '▲+',
          onClick: () => {
            store.addSort(column.name, 'asc', true)
          }
        },
        {
          label: 'Add to Sort (Desc)',
          icon: '▼+',
          onClick: () => {
            store.addSort(column.name, 'desc', true)
          }
        }
      )
    }

    // Remove from sort if already sorted
    if (currentSort) {
      menuItems.push(
        { divided: true },
        {
          label: `Remove from Sort (Order ${currentSort.order})`,
          icon: '✖',
          onClick: () => {
            const newSorts = sortColumnsCopy.filter(s => s.columnName !== column.name)  // ✅ Use copy
            store.setSortColumns(newSorts)
          }
        }
      )
    }

    // Clear all sorts
    if (hasOtherSorts) {
      menuItems.push(
        {
          label: 'Clear All Sorts',
          icon: '🗑',
          onClick: () => {
            store.clearSort()
          }
        }
      )
    }

    menuItems.push({ divided: true })
  }

  // Filter option
  if (column.isFilterable) {
    menuItems.push(
      {
        label: 'Filter...',
        icon: '🔍',
        onClick: () => emit('showFilter', column.name)
      }
    )

    // Clear all filters option (show only if filters exist)
    if (filterExpressionCopy !== null) {  // ✅ Use copy
      menuItems.push(
        {
          label: 'Clear All Filters',
          icon: '🗑',
          onClick: () => {
            store.clearFilter()
          }
        }
      )
    }

    menuItems.push({ divided: true })
  }

  // Column management options (only for non-special columns)
  if (!column.specialType) {
    menuItems.push({
      label: 'Auto-fit Column',
      icon: '↔️',
      onClick: () => emit('autoFitColumn', column.name)
    })

    // Hide option only if showHiddenColumnsPanel is not explicitly false
    if (props.showHiddenColumnsPanel !== false) {
      menuItems.push({
        label: 'Hide Column',
        icon: '👁️',
        onClick: () => emit('hideColumn', column.name)
      })
    }
  }

  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    items: menuItems
  })
}
</script>

<style scoped>
.grid-header {
  display: grid; /* Changed from flex to grid for perfect column alignment */
  /* grid-template-columns applied via inline style from parent */
  background-color: var(--dg-header-bg, #f5f5f5);
  color: var(--dg-header-fg, #212529);
  border-bottom: 2px solid var(--dg-border-column, #ccc);
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%; /* CRITICAL: Always fill container width */
  max-width: 100%; /* CRITICAL: Never exceed container width */
  /* CRITICAL: Compensate for vertical scrollbar width to align columns with rows */
  /* Reduced to 8px for narrower spacing (user requested), can be customized via CSS variable */
  padding-right: var(--dg-scrollbar-width, 8px);
  box-sizing: border-box;
  /* REMOVED min-width: fit-content - this was causing header to have different width than rows! */
  /* Header MUST have identical width to rows for 1fr to resolve to same pixels */
}

.header-cell {
  position: relative;
  padding: 8px;
  border-right: 1px solid var(--dg-border-cell, #e0e0e0);
  cursor: pointer;
  user-select: none;
  display: flex; /* Keep flex for internal layout (icon + text alignment) */
  align-items: center;
  gap: 4px;
  overflow: hidden; /* Prevent content from breaking grid layout */
}

.header-cell:hover {
  background-color: var(--dg-header-hover-bg, #eeeeee);
}

.header-cell:active {
  background-color: var(--dg-header-pressed-bg, #dee2e6);
}

.header-text {
  flex: 1;
}

.header-cell--auto-width {
  /* Auto-width columns use Star sizing (flex-grow) to fill remaining space */
  flex-shrink: 0;
}

.sort-icon {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: var(--dg-header-sort-indicator, #2196f3);
  font-weight: bold;
}

.sort-icon--primary {
  color: var(--dg-header-sort-indicator, #2196f3);
}

.sort-icon--secondary {
  color: var(--dg-header-sort-secondary, #90caf9);
  font-size: 9px;
}

.sort-order {
  font-size: 9px;
  font-weight: bold;
  color: inherit;
  padding-left: 1px;
}

.resize-grip {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background-color: transparent;
}

.resize-grip:hover {
  background-color: var(--dg-ui-resize-grip, #2196f3);
}

/* Custom tri-state checkbox (not native input) */
.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--dg-header-checkbox-border, var(--dg-header-fg, #212529));
  border-radius: 3px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dg-header-checkbox-bg, white);
  transition: all 0.15s ease;
  user-select: none;
}

.custom-checkbox:hover {
  border-color: var(--dg-header-checkbox-border-hover, var(--dg-header-fg, #212529));
}

/* State: none (empty checkbox) */
.custom-checkbox.checkbox-none {
  background-color: var(--dg-header-checkbox-bg, white) !important;
}

/* State: some (indeterminate - dash) */
.custom-checkbox.checkbox-some {
  background-color: var(--dg-header-checkbox-bg, white) !important;
  border-color: var(--dg-header-checkbox-border-checked, var(--dg-header-fg, #212529));
}

/* State: all (checked - checkmark) */
.custom-checkbox.checkbox-all {
  background-color: var(--dg-header-checkbox-bg, white) !important;
  border-color: var(--dg-header-checkbox-border-checked, var(--dg-header-fg, #212529));
}

/* Icon inside checkbox (checkmark or dash) */
.checkbox-icon {
  color: var(--dg-header-checkbox-icon, var(--dg-header-fg, #212529));
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}
</style>
