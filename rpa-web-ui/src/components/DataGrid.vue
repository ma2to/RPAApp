<template>
  <div class="data-grid" :style="cssVariables">
    <!-- Loading overlay during processing -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="processing-content">
        <div class="processing-spinner"></div>
        <div class="processing-text">Processing {{ store.rows.length }} rows...</div>

        <!-- ✅ RIEŠENIE #4: Progress bar for validation -->
        <div v-if="validationProgress.isValidating" class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar" :style="{ width: validationProgress.percentage + '%' }"></div>
          </div>
          <div class="progress-text">
            {{ validationProgress.current }} / {{ validationProgress.total }} cells validated ({{ validationProgress.percentage }}%)
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ RIEŠENIE #4: Loading overlay during data operations -->
    <div v-if="loadingState.isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingState.operation }}</div>

        <!-- Progress bar if we have total count -->
        <div v-if="loadingState.total > 0" class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar" :style="{ width: loadingState.percentage + '%' }"></div>
          </div>
          <div class="progress-text">
            {{ loadingState.progress }} / {{ loadingState.total }} ({{ loadingState.percentage }}%)
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="grid-toolbar">
      <!-- Auto Row Height toggle -->
      <div class="toolbar-section">
        <button
          class="toolbar-button"
          :class="{ 'toolbar-button--active': store.isAutoRowHeightEnabled }"
          @click="toggleAutoRowHeight"
          :title="store.isAutoRowHeightEnabled ? 'Disable auto row height' : 'Enable auto row height'"
        >
          📏 Auto Height {{ store.isAutoRowHeightEnabled ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <!-- Hidden columns notification -->
    <!-- ✅ RIEŠENIE: Kontroluj enableHideColumn - panel sa zobrazí LEN ak je povolené skrývanie -->
    <div v-if="enableHideColumn !== false && hiddenColumns.length > 0" class="hidden-columns-panel">
      <span class="hidden-columns-label">Hidden columns:</span>
      <button
        v-for="col in hiddenColumns"
        :key="col.name"
        class="show-column-button"
        @click="showColumn(col.name)"
        :title="`Show column: ${col.header}`"
      >
        {{ col.header }}
      </button>
      <button class="show-all-button" @click="showAllColumns" title="Show all columns">
        Show All
      </button>
    </div>

    <div class="grid-container">
      <!-- ✅ Wrapper for horizontal scroll -->
      <div class="table-content">
        <!-- ✅ RIEŠENIE A: Wrapper pre column grouping - header + rows scrollujú spoločne -->
        <div class="table-inner" :style="{ minWidth: minTableWidth ? `${minTableWidth}px` : undefined }">
          <DataGridHeader
            :columns="allColumns"
            :grid-template-columns="gridTemplateColumns"
            :grid-id="instanceId"
            :is-grid-ready="isGridReady"
            :is-processing="isProcessing"
            :show-hidden-columns-panel="showHiddenColumnsPanel"
            :enable-hide-column="enableHideColumn"
            :enable-auto-fit="enableAutoFit"
            @sort="handleSort"
            @resize="handleResize"
            @hideColumn="handleHideColumn"
            @autoFitColumn="handleAutoFitColumn"
            @show-filter="handleShowFilter"
          />

          <div ref="scrollerRef" class="scroller">
            <LazyRow
              v-for="item in visibleRows"
              :key="item.rowId"
              :row="item"
              :columns="allColumns"
              :grid-template-columns="gridTemplateColumns"
              :grid-id="instanceId"
              @cell-edit-complete="handleCellEditComplete"
              @cell-input="handleCellInput"
              @checkbox-change="handleCheckboxChange"
              @delete-row="handleDeleteRow"
              @insert-row="handleInsertRow"
              @insert-above="handleInsertAbove"
              @insert-below="handleInsertBelow"
            />
          </div>
        </div>
      </div>
    </div>

    <PaginationControl
      :page-size="store.pageSize"
      :page-size-options="store.config.pageSizeOptions"
      :total-rows="store.totalRows"
      :current-page="store.currentPage"
      @page-change="store.goToPage"
      @page-size-change="store.setPageSize"
    />

    <FilterFlyout
      :visible="filterFlyout.visible"
      :column-name="filterFlyout.columnName"
      :position="filterFlyout.position"
      :unique-values="filterFlyout.uniqueValues"
      :current-mode="filterFlyout.mode"
      :current-pattern="filterFlyout.pattern"
      @close="closeFilterFlyout"
      @apply-checkbox="handleApplyCheckboxFilter"
      @apply-regex="handleApplyRegexFilter"
      @clear-filter="handleClearFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, provide, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useDataGridStore, type GridColumn, type GridRow, type GridCell } from '@/stores/dataGridStore'
import { useValidation } from '@/composables/useValidation'
import { useCopyPaste } from '@/composables/useCopyPaste'
import { useImportExport, ImportMode } from '@/composables/useImportExport'
import { useAutoRowHeight, defaultAutoRowHeightConfig } from '@/composables/useAutoRowHeight'
import { useShortcuts, createDefaultShortcuts, ShortcutContext } from '@/composables/useShortcuts'
import { useLogger } from '@/composables/useLogger'
import { gridApi } from '@/services/gridApi'
import { generateDataGridCSSVariables, defaultDataGridTheme } from '@/composables/useTheme'
import type { DataGridTheme } from '@/types/theme'
import { useFiltering, type FilterExpression, type SimpleFilter, type CompositeFilter } from '@/composables/useFiltering'
import DataGridHeader from './DataGridHeader.vue'
import DataGridRow from './DataGridRow.vue'
import LazyRow from './LazyRow.vue'
import PaginationControl from './PaginationControl.vue'
import FilterFlyout from './FilterFlyout.vue'
import type { FilterValue } from './FilterFlyout.vue'

const props = withDefaults(defineProps<{
  config?: any
  columns?: GridColumn[]
  gridId?: string  // Optional unique ID for this grid instance
  theme?: Partial<DataGridTheme>  // Optional theme customization
  minTableWidth?: number  // Minimum table width in pixels - triggers horizontal scroll when container is smaller
  width?: string  // Table width (e.g., "100%", "800px", "50vw") - defaults to "100%"
  height?: string  // Table height (e.g., "600px", "80vh", "auto") - defaults to "600px"
  autoRowHeightEnabled?: boolean  // Optional: Enable AutoRowHeight on initialization (default: false)
  minRows?: number  // Optional: Minimum number of rows to display (default: 5)
  showHiddenColumnsPanel?: boolean  // Optional: Show hidden columns panel (default: true)
  enableHideColumn?: boolean   // ✅ NOVÝ PROP #1 - zapne/vypne Hide v menu + panel
  enableAutoFit?: boolean       // ✅ NOVÝ PROP #2 - zapne/vypne AutoFit v menu
}>(), {
  enableHideColumn: true,  // ✅ DEFAULT: zapnuté
  enableAutoFit: true       // ✅ DEFAULT: zapnuté
})

// Generate unique store ID for this grid instance
const instanceId = props.gridId || `grid-${Math.random().toString(36).substr(2, 9)}`

// Initialize logger for this component
const logger = useLogger(`DataGrid[${instanceId}]`)
logger.info('⚙️ Component initializing', {
  gridId: instanceId,
  hasConfig: !!props.config,
  hasColumns: !!props.columns,
  columnCount: props.columns?.length || 0
})

// Create a unique store instance for this DataGrid
console.log('[DataGrid] Creating store with ID:', instanceId)
const storeFactory = useDataGridStore(instanceId)
console.log('[DataGrid] Store factory created:', typeof storeFactory, storeFactory)

let store: ReturnType<typeof storeFactory>
try {
  store = storeFactory()
  console.log('[DataGrid] Store instance created:', store)
  logger.debug('📦 Store created', { instanceId })
} catch (error) {
  console.error('[DataGrid] FAILED to create store:', error)
  logger.error('❌ Store creation failed', { instanceId, error })
  throw error
}

// Set initial AutoRowHeight state from props (default: false)
if (props.autoRowHeightEnabled !== undefined) {
  store.setAutoRowHeightEnabled(props.autoRowHeightEnabled)
  logger.info(`🔧 AutoRowHeight initialized to: ${props.autoRowHeightEnabled}`)
}

// Set minimum rows from props (default: 5)
if (props.minRows !== undefined) {
  store.setMinRows(props.minRows)
  logger.info(`🔧 MinRows initialized to: ${props.minRows}`)
}

// Create validation instance for this DataGrid and provide it to child components
const validation = useValidation()
provide('validation', validation)

// ✅ RIEŠENIE #1: Create observer refs BEFORE providing them (fix ReferenceError)
// ✅ RIEŠENIE C: Shared IntersectionObserver for lazy row rendering
// ✅ KAŽDÁ DataGrid inštancia vytvorí SVOJ VLASTNÝ observer
// ✅ Observer je scoped na túto inštanciu cez provide()
// ✅ Iné DataGrid inštancie majú SVOJE observery (úplne oddelené)
const rowVisibility = ref(new Map<string, boolean>())
const sharedObserver = ref<IntersectionObserver | null>(null)

// ✅ RIEŠENIE #2: Wrap provide() in try-catch for better error logging
try {
  // ✅ Provide shared observer to child components (scoped to THIS DataGrid instance)
  // ✅ LazyRow children will inject THESE values (not from other DataGrid instances)
  provide('intersectionObserver', sharedObserver)
  provide('rowVisibility', rowVisibility)
  logger.debug('✅ Observer refs created and provided successfully')
} catch (error) {
  logger.error('❌ Failed to initialize observer:', error)
  console.error('[DataGrid] Setup error:', error)
  throw error  // Re-throw to show in Vue error handler
}

// Create copy/paste instance
const copyPaste = useCopyPaste()

// Create import/export instance
const importExport = useImportExport()

// Create filtering instance
const { filterRows: filterRowsHelper, evaluateFilter } = useFiltering()

// ✅ FIX: Loading flag to prevent race conditions
const isGridReady = ref(false)

// ✅ FIX: Processing flag to prevent interactions during validation/AutoRowHeight
const isProcessing = ref(false)

// ✅ RIEŠENIE #1: Validation guard to prevent concurrent validation runs
const isValidating = ref(false)

// ✅ RIEŠENIE #4: Progress tracking for validation
const validationProgress = ref({
  isValidating: false,
  current: 0,
  total: 0,
  percentage: 0
})

// ✅ RIEŠENIE #5: Cancellation token for validation
let validationCancelled = false

// Create auto row height instance with dynamic maxHeight based on container height
const containerHeight = ref(800)  // Default container height (will be measured dynamically)

// Compute maxHeight as 70% of container height, minimum 32px
const computedMaxHeight = computed(() => {
  const maxHeight = Math.max(32, Math.floor(containerHeight.value * 0.7))
  console.log(`[AutoRowHeight] Computed maxHeight: ${maxHeight}px (container: ${containerHeight.value}px)`)
  return maxHeight
})

// Initialize with dynamic config
const autoRowHeight = useAutoRowHeight({
  minHeight: 32,
  maxHeight: computedMaxHeight.value,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,
  enableWrapping: true,
  padding: 16
})

// Watch for container height changes and update maxHeight
watch(computedMaxHeight, async (newMaxHeight) => {
  console.log(`[AutoRowHeight] maxHeight changed to: ${newMaxHeight}px`)
  autoRowHeight.updateMaxHeight(newMaxHeight)

  // If AutoRowHeight is enabled, recalculate all row heights with new maxHeight
  if (store.isAutoRowHeightEnabled && store.rows.length > 0) {
    console.log('[AutoRowHeight] maxHeight changed - recalculating all row heights...')
    await applyAutoRowHeightToAll()
  }
})

// Measure container height function (defined at top level for cleanup)
const measureContainerHeight = () => {
  // CRITICAL FIX: Guard against undefined $el
  if (!scrollerRef.value) {
    console.log('[AutoRowHeight] Cannot measure: scrollerRef is null')
    return
  }

  const height = scrollerRef.value.clientHeight
  if (height > 0) {
    containerHeight.value = height
    console.log(`[AutoRowHeight] Container height measured: ${height}px`)
  } else {
    console.log('[AutoRowHeight] Container height is 0, keeping default')
  }
}

// ✅ RIEŠENIE C: Single async onMounted - ensures proper initialization sequence
onMounted(async () => {
  logger.info('========== ✅ Component mounted - START initialization ==========', {
    gridId: props.gridId,
    autoRowHeight: store.isAutoRowHeightEnabled,
    rowCount: store.rows.length,
    columnCount: store.columns.length
  })

  // 1. Register event listeners FIRST
  document.addEventListener('mouseup', handleDocumentMouseUp)
  document.addEventListener('keydown', handleKeyboardShortcuts)
  logger.debug('🎯 Event listeners registered (mouseup, keydown)')

  // 2. Auto-initialize: If columns are provided but no rows exist, initialize empty rows
  if (props.columns && props.columns.length > 0 && store.rows.length === 0) {
    logger.info('🔧 Auto-initializing empty rows from provided columns', {
      columnCount: props.columns.length
    })
    try {
      store.setColumns(props.columns)
      store.initializeEmptyRows()
      logger.info(`✅ Auto-initialized ${store.rows.length} empty rows`)
    } catch (error) {
      logger.error('❌ Failed to set columns:', error)
      alert(`Column configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // 3. Check backend connection (async)
  checkBackendConnection()

  // 4. Wait for DOM to be ready
  await nextTick()
  logger.debug('⏰ DOM ready after nextTick')

  // 5. Measure container height
  measureContainerHeight()

  // 6. Apply AutoRowHeight if enabled (async operation)
  if (store.isAutoRowHeightEnabled && store.rows.length > 0) {
    logger.info('📏 AutoRowHeight enabled - applying heights...')
    await nextTick()
    try {
      await applyAutoRowHeightToAll()
      logger.info('✅ AutoRowHeight applied successfully on mount')
    } catch (error) {
      logger.error('❌ AutoRowHeight ERROR on mount:', error)
    }
  } else {
    logger.debug(`⏭️ Skipping AutoRowHeight: enabled=${store.isAutoRowHeightEnabled}, rowCount=${store.rows.length}`)
  }

  // 7. Create shared IntersectionObserver for lazy row rendering
  // ✅ FIX: Create AFTER nextTick so scrollerRef.value is available
  // ✅ FIX: Use scrollerRef.value as root (not viewport) for proper horizontal scroll detection
  await nextTick()  // Ensure scrollerRef is populated

  if (!scrollerRef.value) {
    logger.error('❌ scrollerRef not available for IntersectionObserver!')
  } else {
    sharedObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rowId = (entry.target as HTMLElement).dataset.rowId
          if (rowId) {
            // ✅ Updates rowVisibility for THIS DataGrid instance only
            rowVisibility.value.set(rowId, entry.isIntersecting)
          }
        })
      },
      {
        root: scrollerRef.value,  // ✅ FIX: Watch .scroller container, not viewport
        rootMargin: '100px',  // Preload 100px before visible
        threshold: 0
      }
    )
    logger.info('👁️ IntersectionObserver created with root: .scroller for instance:', instanceId)
  }

  // 8. Register resize listener
  window.addEventListener('resize', measureContainerHeight)
  logger.debug('🎯 Resize listener registered')

  // 9. ✅ FIX: Wheel handler ON .scroller for vertical scroll
  // ✅ NO horizontal scroll sync needed - header and rows both in .table-content scroll context
  if (scrollerRef.value) {
    // Wheel handler for vertical scroll boundary control
    const handleWheel = (event: WheelEvent) => {
      if (!scrollerRef.value) return

      const isVerticalScroll = Math.abs(event.deltaY) > Math.abs(event.deltaX)

      if (isVerticalScroll) {
        const maxScroll = scrollerRef.value.scrollHeight - scrollerRef.value.clientHeight
        const currentScroll = scrollerRef.value.scrollTop

        // Only prevent default AT boundaries to avoid page scroll
        if ((event.deltaY < 0 && currentScroll <= 0) ||
            (event.deltaY > 0 && currentScroll >= maxScroll)) {
          event.preventDefault()
        }
        // Within bounds - browser handles scroll naturally
      }
    }

    // ✅ FIX: Register on SCROLLER, not tableContent
    scrollerRef.value.addEventListener('wheel', handleWheel, { passive: false })
    logger.debug('🎯 Wheel event handler registered on .scroller')

    // Cleanup v onBeforeUnmount
    ;(window as any).__dataGridScrollCleanup = (window as any).__dataGridScrollCleanup || []
    ;(window as any).__dataGridScrollCleanup.push(() => {
      scrollerRef.value?.removeEventListener('wheel', handleWheel)
    })
  }

  // 10. ONLY NOW mark grid as ready (after ALL async operations complete)
  await nextTick()
  isGridReady.value = true
  logger.info('========== ✅ Grid marked as READY for user interaction ==========')

  // 🔍 RIEŠENIE B: DIAGNOSTIC LOGS - Column grouping debug
  await nextTick()
  const tableContent = document.querySelector('.table-content') as HTMLElement | null
  const tableInner = document.querySelector('.table-inner') as HTMLElement | null
  const headerEl = document.querySelector('.grid-header') as HTMLElement | null
  const scrollerEl = scrollerRef.value
  const firstRow = document.querySelector('.grid-row') as HTMLElement | null

  console.group('🔍 HORIZONTAL SCROLL DIAGNOSTIC')

  console.log('📊 .table-content:', {
    offsetWidth: tableContent?.offsetWidth,
    scrollWidth: tableContent?.scrollWidth,
    'overflow-x (CSS)': 'auto',
    'overflow-x (computed)': tableContent ? getComputedStyle(tableContent).overflowX : null,
    hasHorizontalScroll: (tableContent?.scrollWidth || 0) > (tableContent?.offsetWidth || 0)
  })

  console.log('📊 .table-inner (NOVÝ WRAPPER):', {
    offsetWidth: tableInner?.offsetWidth,
    scrollWidth: tableInner?.scrollWidth,
    minWidth: tableInner?.style.minWidth,
    'width (CSS)': 'fit-content',
    'width (computed)': tableInner ? getComputedStyle(tableInner).width : null
  })

  console.log('📊 .grid-header:', {
    offsetWidth: headerEl?.offsetWidth,
    scrollWidth: headerEl?.scrollWidth,
    gridTemplateColumns: headerEl?.style.gridTemplateColumns,
    'minWidth removed': '✅'
  })

  console.log('📊 .scroller:', {
    offsetWidth: scrollerEl?.offsetWidth,
    scrollWidth: scrollerEl?.scrollWidth,
    'overflow-x (CSS)': 'hidden',
    'overflow-x (computed)': scrollerEl ? getComputedStyle(scrollerEl).overflowX : null,
    'overflow-y (computed)': scrollerEl ? getComputedStyle(scrollerEl).overflowY : null,
    hasHorizontalScroll: (scrollerEl?.scrollWidth || 0) > (scrollerEl?.offsetWidth || 0)
  })

  console.log('📊 .grid-row (first):', {
    offsetWidth: firstRow?.offsetWidth,
    scrollWidth: firstRow?.scrollWidth,
    gridTemplateColumns: firstRow?.style.gridTemplateColumns,
    'minWidth removed': '✅'
  })

  console.log('🎯 COLUMN GROUPING CHECK:')
  console.log('  .table-inner width === .grid-header width?',
    tableInner?.offsetWidth === headerEl?.offsetWidth ? '✅' : '❌',
    `(${tableInner?.offsetWidth} vs ${headerEl?.offsetWidth})`
  )
  console.log('  .table-inner width === .scroller width?',
    tableInner?.offsetWidth === scrollerEl?.offsetWidth ? '✅' : '❌',
    `(${tableInner?.offsetWidth} vs ${scrollerEl?.offsetWidth})`
  )
  console.log('  Header width === Row width?',
    headerEl?.offsetWidth === firstRow?.offsetWidth ? '✅' : '❌',
    `(${headerEl?.offsetWidth} vs ${firstRow?.offsetWidth})`
  )
  console.log('  Scroller has horizontal scroll?',
    (scrollerEl?.scrollWidth || 0) > (scrollerEl?.offsetWidth || 0) ? '❌ PROBLÉM!' : '✅ OK'
  )

  console.log('⚠️ CSS SPEC VIOLATION CHECK:')
  if (scrollerEl) {
    const computed = getComputedStyle(scrollerEl)
    const overflowX = computed.overflowX
    const overflowY = computed.overflowY
    console.log(`  overflow-x: ${overflowX}, overflow-y: ${overflowY}`)
    if (overflowX === 'auto' && overflowY === 'auto') {
      console.log('  ❌ PROBLÉM: overflow-x konvertované z "visible" na "auto"!')
      console.log('  → Toto vytvára DRUHÝ horizontal scrollbar!')
    } else if (overflowX === 'hidden' && overflowY === 'auto') {
      console.log('  ✅ OK: overflow-x je "hidden", overflow-y je "auto"')
      console.log('  → Žiadny vnútorný horizontal scroll v .scroller!')
    }
  }

  console.groupEnd()

  // 🔍 RIEŠENIE C: Event listener na scroll (debug)
  if (tableContent && scrollerEl) {
    let lastScrollLeft = 0

    const handleTableContentScroll = () => {
      const scrollLeft = tableContent.scrollLeft
      const scrollDelta = scrollLeft - lastScrollLeft
      lastScrollLeft = scrollLeft

      const currentHeaderLeft = headerEl?.getBoundingClientRect().left || 0
      const currentRowLeft = firstRow?.getBoundingClientRect().left || 0
      const misalignment = Math.abs(currentHeaderLeft - currentRowLeft)

      console.log('🔄 .table-content scroll:', {
        scrollLeft,
        scrollDelta,
        headerOffsetLeft: currentHeaderLeft,
        rowOffsetLeft: currentRowLeft,
        misalignment: misalignment.toFixed(2) + 'px',
        status: misalignment < 1 ? '✅ ALIGNED' : '❌ MISALIGNED'
      })
    }

    const handleScrollerScroll = () => {
      if (scrollerEl.scrollLeft !== 0) {
        console.warn('⚠️ .scroller horizontal scroll DETECTED:', {
          scrollLeft: scrollerEl.scrollLeft,
          message: 'This should NOT happen! Rows should not scroll horizontally inside .scroller',
          solution: 'Check if .scroller has overflow-x: hidden (not visible or auto)'
        })
      }
    }

    tableContent.addEventListener('scroll', handleTableContentScroll, { passive: true })
    scrollerEl.addEventListener('scroll', handleScrollerScroll, { passive: true })
    console.log('🎯 Scroll event listeners registered for debugging')

    // Cleanup
    ;(window as any).__dataGridScrollCleanup = (window as any).__dataGridScrollCleanup || []
    ;(window as any).__dataGridScrollCleanup.push(() => {
      tableContent?.removeEventListener('scroll', handleTableContentScroll)
      scrollerEl?.removeEventListener('scroll', handleScrollerScroll)
    })
  }
})

// ✅ RIEŠENIE #3: Watch props.columns a syncni ich do store
// Toto zabezpečí, že keď parent (App.vue) zmení props.columns,
// zmeny sa prejavia aj v tabuľke
watch(
  () => props.columns,
  (newColumns) => {
    // ✅ RIEŠENIE: Guard - wait until store is ready and columns exist
    if (!store || !newColumns || newColumns.length === 0) {
      return
    }

    logger.info('[DataGrid] props.columns changed, syncing to store', {
      columnCount: newColumns.length
    })

    // Update store.columns to match props.columns
    // But preserve column states (isVisible, width) if they were changed by user
    newColumns.forEach((propCol: GridColumn) => {
        const existingCol = store.columns.find((c: GridColumn) => c.name === propCol.name)

        if (existingCol) {
          // Column already exists in store
          // Update header, dataType, etc. from props, but keep user changes (isVisible, width)
          // Keep user's isVisible if it was changed, otherwise use prop
          // Keep user's width if it was changed, otherwise use prop
          store.updateColumn(propCol.name, {
            header: propCol.header,
            dataType: propCol.dataType
          })
        } else {
          // New column from props - add it to store
          store.addColumn(propCol)
        }
      })
  },
  { deep: true, immediate: true }  // immediate: true = run on mount
)

// Cleanup on unmount (must be at top level, NOT inside onMounted)
onBeforeUnmount(() => {
  window.removeEventListener('resize', measureContainerHeight)
  document.removeEventListener('mouseup', handleDocumentMouseUp)
  document.removeEventListener('keydown', handleKeyboardShortcuts)

  // ✅ RIEŠENIE: Cleanup scroll event handlers
  if ((window as any).__dataGridScrollCleanup) {
    ;(window as any).__dataGridScrollCleanup.forEach((cleanup: () => void) => cleanup())
    ;(window as any).__dataGridScrollCleanup = []
  }

  logger.info('🧹 Cleanup: All event listeners removed')
})

// Use store.isAutoRowHeightEnabled instead of local ref

// Backend API connection status
const isBackendConnected = ref(false)
const isLoadingFromBackend = ref(false)
const isSavingToBackend = ref(false)

// ✅ RIEŠENIE #4: Detailed loading state with progress
const loadingState = ref({
  isLoading: false,
  operation: '',
  progress: 0,
  total: 0,
  percentage: 0
})

// Scroller div ref for measurements
const scrollerRef = ref<HTMLDivElement>()

// Get selected rows for copy/paste operations
const getSelectedRows = () => {
  const selectedCells = Array.from(store.selectedCells) as string[]
  if (selectedCells.length === 0) return []

  // Get unique row IDs from selected cells
  const rowIds = new Set(selectedCells.map((cellId) => cellId.split(':')[0]))
  return store.rows.filter((row: GridRow) => rowIds.has(row.rowId))
}

// Get column names (excluding special columns)
const getDataColumnNames = () => {
  return dataColumns.value
    .filter((col: GridColumn) => !col.specialType)
    .map((col: GridColumn) => col.name)
}

// Copy handler - copies ONLY selected cells with position preservation
const handleCopy = async () => {
  console.log('[DataGrid] handleCopy called, selectedCells:', store.selectedCells.size)

  if (store.selectedCells.size === 0) {
    console.warn('[DataGrid] No cells selected for copy')
    return
  }

  // ✅ RIEŠENIE #1: Use copySelectedCells instead of copyToClipboard
  // This copies ONLY selected cells (not full rows) and preserves their positions
  const result = await copyPaste.copySelectedCells(
    store.selectedCells,
    store.rows,
    dataColumns.value
  )

  if (result.success) {
    console.log('[DataGrid] Copy successful:', result.message)
  } else {
    console.error('[DataGrid] Copy failed:', result.message)
  }
}

// Paste handler
const handlePaste = async () => {
  const result = await copyPaste.pasteFromClipboard()

  if (result.success && result.rows && result.rows.length > 0) {
    // Find the target position (first selected cell or append to end)
    const selectedCells = Array.from(store.selectedCells)
    let targetRowIndex = store.rows.length

    if (selectedCells.length > 0) {
      // Get first selected cell position
      const firstCellId = selectedCells[0] as string
      const rowId = firstCellId.split(':')[0]
      const rowIndex = store.rows.findIndex((r: GridRow) => r.rowId === rowId)
      if (rowIndex >= 0) {
        targetRowIndex = rowIndex
      }
    }

    // Add pasted rows to the store
    result.rows.forEach((rowData: any, index: number) => {
      if (targetRowIndex + index < store.rows.length) {
        // Overwrite existing row
        const targetRow = store.rows[targetRowIndex + index]
        Object.keys(rowData).forEach((key: string) => {
          if (dataColumns.value.some((col: GridColumn) => col.name === key)) {
            store.updateCell(targetRow.rowId, key, rowData[key])
          }
        })
      } else {
        // Append new row - insert empty row at end and populate with data
        const lastRowId = store.rows[store.rows.length - 1]?.rowId
        if (lastRowId) {
          store.insertRow(lastRowId)
          // Get the newly created row and update its cells with data
          const newRow = store.rows[store.rows.length - 1]
          Object.keys(rowData).forEach((key: string) => {
            if (dataColumns.value.some((col: GridColumn) => col.name === key)) {
              store.updateCell(newRow.rowId, key, rowData[key])
            }
          })
        }
      }
    })

    console.log(result.message)
  } else {
    console.error(result.message)
  }
}

// Cut handler (copy + delete)
const handleCut = async () => {
  await handleCopy()

  // Delete selected cells content
  const selectedCells = Array.from(store.selectedCells) as string[]
  selectedCells.forEach((cellId) => {
    const [rowId, columnName] = cellId.split(':')
    if (!dataColumns.value.find((col: GridColumn) => col.name === columnName)?.isReadOnly) {
      store.updateCell(rowId, columnName, null)
    }
  })
}

// Delete handler
const handleDelete = () => {
  const selectedCells = Array.from(store.selectedCells) as string[]
  selectedCells.forEach((cellId) => {
    const [rowId, columnName] = cellId.split(':')
    if (!dataColumns.value.find((col: GridColumn) => col.name === columnName)?.isReadOnly) {
      store.updateCell(rowId, columnName, null)
    }
  })
}

// Select All handler
const handleSelectAll = () => {
  // Select all cells in all rows
  store.rows.forEach((row: GridRow) => {
    dataColumns.value.forEach((col: GridColumn) => {
      if (!col.specialType) { // Only select data columns
        store.selectCell(row.rowId, col.name, true) // true for Ctrl to add to selection
      }
    })
  })
}

// Register keyboard shortcuts
const shortcuts = useShortcuts({ enabled: true, context: ShortcutContext.Normal })

shortcuts.registerShortcuts(createDefaultShortcuts({
  onCopy: handleCopy,
  onPaste: handlePaste,
  onCut: handleCut,
  onDelete: handleDelete,
  onSelectAll: handleSelectAll,
  onFind: () => console.log('Find not implemented yet')
}))

const visibleRows = computed(() => store.visibleRows)

// Use provided columns or default to store columns WITH DEFAULTS
// ✅ RIEŠENIE #2: VŽDY používaj store.columns (nie props.columns)
// Props.columns sa používajú len na inicializáciu v watcheri nižšie
const dataColumns = computed(() => {
  const cols = store.columns

  // Apply defaults to DATA columns (not special columns)
  return cols.map((col: GridColumn) => {
    // Skip special columns - they have their own defaults
    if (col.specialType) {
      return col
    }

    // Apply defaults for DATA columns only
    return {
      ...col,
      minWidth: col.minWidth ?? 50,           // Default: 50
      maxWidth: col.maxWidth ?? 200,          // Default: 200
      isSortable: col.isSortable ?? false,    // Default: false
      isFilterable: col.isFilterable ?? false, // Default: false
      visibleForGrid: col.visibleForGrid ?? true  // ✅ RIEŠENIE #6: EXPLICIT DEFAULT
    }
  })
})

// Keyboard handler for Ctrl+C / Ctrl+V
function handleKeyboardShortcuts(event: KeyboardEvent) {
  // Only handle if Ctrl (or Cmd on Mac) is pressed
  if (!event.ctrlKey && !event.metaKey) return

  // Ctrl+C - Copy selected cells
  if (event.key === 'c' || event.key === 'C') {
    event.preventDefault()
    console.log('[DataGrid] Ctrl+C pressed - copying selected cells')
    handleCopySelectedCells()
  }

  // Ctrl+V - Paste from clipboard
  if (event.key === 'v' || event.key === 'V') {
    event.preventDefault()
    console.log('[DataGrid] Ctrl+V pressed - pasting from clipboard')
    handlePasteSelectedCells()
  }
}

// Copy selected cells (new implementation with position preservation)
async function handleCopySelectedCells() {
  if (store.selectedCells.size === 0) {
    console.warn('[DataGrid] No cells selected for copy')
    return
  }

  console.log('[DataGrid] Copying selected cells:', {
    selectedCount: store.selectedCells.size,
    selectedCells: Array.from(store.selectedCells)
  })

  // Use new copySelectedCells method that preserves positions
  const result = await copyPaste.copySelectedCells(
    store.selectedCells,
    store.rows,
    allColumns.value
  )

  if (result.success) {
    console.log('[DataGrid] Copy successful:', result.message)
  } else {
    console.error('[DataGrid] Copy failed:', result.message)
  }
}

// Paste from clipboard to selected cells
async function handlePasteSelectedCells() {
  const result = await copyPaste.pasteFromClipboard()

  if (result.success && result.rows && result.rows.length > 0) {
    console.log('[DataGrid] Paste successful:', {
      rowCount: result.rows.length,
      headers: result.headers
    })

    // ✅ FIX: Filter data columns first (before calculating targetColIndex)
    const dataColumnsOnly = allColumns.value.filter((col: GridColumn) => !col.specialType)

    // Find the target position (first selected cell or top-left)
    let targetRowIndex = 0
    let targetColIndex = 0

    if (store.selectedCells.size > 0) {
      // Get first selected cell as paste target
      const firstCellKey = Array.from(store.selectedCells)[0] as string
      const [firstRowId, firstColName] = firstCellKey.split(':')
      const firstRow = store.rows.find((r: GridRow) => r.rowId === firstRowId)

      // ✅ FIX: Find index in dataColumnsOnly instead of allColumns
      const firstColIdx = dataColumnsOnly.findIndex((c: GridColumn) => c.name === firstColName)

      if (firstRow) {
        targetRowIndex = firstRow.rowIndex
        // ✅ FIX: If target is special column (findIndex = -1), use first data column
        targetColIndex = firstColIdx !== -1 ? firstColIdx : 0
      }

      console.log('[DataGrid] Pasting at position:', {
        targetRowIndex,
        targetColIndex,
        firstColName,
        isSpecialColumn: targetColIndex === 0 && firstColIdx === -1,
        dataColumnsCount: dataColumnsOnly.length
      })
    } else {
      console.log('[DataGrid] Pasting at position (no selection):', {
        targetRowIndex,
        targetColIndex,
        dataColumnsCount: dataColumnsOnly.length
      })
    }

    // Paste data row by row, column by column
    result.rows.forEach((rowData: any, rowOffset: number) => {
      const pasteRowIndex = targetRowIndex + rowOffset

      if (pasteRowIndex >= store.rows.length) {
        console.warn('[DataGrid] Paste row out of bounds:', { pasteRowIndex, maxRows: store.rows.length })
        return
      }

      const targetRow = store.rows[pasteRowIndex]

      // ✅ FIX: Use headers array instead of Object.keys to preserve correct column order
      // Object.keys may return keys in unexpected order, headers array is always in correct order
      if (!result.headers) {
        console.warn('[DataGrid] No headers in paste result, skipping row')
        return
      }

      result.headers.forEach((columnKey: string, colOffset: number) => {
        const pasteColIndex = targetColIndex + colOffset

        if (pasteColIndex >= dataColumnsOnly.length) {
          console.warn('[DataGrid] Paste column out of bounds:', { pasteColIndex, maxCols: dataColumnsOnly.length })
          return
        }

        const targetColumn = dataColumnsOnly[pasteColIndex]
        const value = rowData[columnKey] ?? null  // Use nullish coalescing for undefined values

        // Update cell value
        store.updateCell(targetRow.rowId, targetColumn.name, value)

        console.log('[DataGrid] Pasted cell:', {
          row: pasteRowIndex,
          col: pasteColIndex,
          columnName: targetColumn.name,
          columnKey,
          value
        })
      })
    })

    console.log('[DataGrid] Paste complete')

    // ✅ FIX: Trigger validation after paste if autoValidate is enabled
    if (store.config.autoValidate && store.config.enableValidation && validation) {
      const rulesCount = validation?.validationRules?.value?.size || 0

      if (rulesCount > 0) {
        console.log('[DataGrid] Paste complete - triggering auto-validation...')

        // Wait for UI to update
        await nextTick()

        // Validate only changed cells (cells affected by paste)
        await validateAllCellsInBatches()

        console.log('[DataGrid] Paste validation complete')
      }
    }
  } else {
    console.error('[DataGrid] Paste failed:', result.message)
  }
}

// Lifecycle: Before mount
onBeforeMount(() => {
  logger.info('🔄 Component before mount')
})

// ✅ RIEŠENIE C: Second onMounted REMOVED - merged into single async onMounted above

// Lifecycle: Before unmount
// ✅ RIEŠENIE #3: Cleanup on unmount to prevent memory leaks
onBeforeUnmount(() => {
  logger.info('🔄 Component before unmount - starting cleanup')

  // Cleanup shared observer
  if (sharedObserver.value) {
    console.log('[DataGrid] Disconnecting SharedIntersectionObserver...')
    sharedObserver.value.disconnect()
    sharedObserver.value = null
  }
  rowVisibility.value.clear()
  console.log('[DataGrid] SharedIntersectionObserver destroyed for instance:', instanceId)

  // Clear validation state
  if (validation) {
    console.log('[DataGrid] Clearing validation state...')
    validation.clearValidationErrors()
    validation.validationRules.value.clear()
  }

  // Clear store data
  console.log('[DataGrid] Clearing store data...')
  store.clearAllData()

  logger.info('✅ Component cleanup complete')
})

// Lifecycle: Unmounted - cleanup event listeners
onUnmounted(() => {
  logger.info('🗑️ Component unmounted - final cleanup')
  logger.info('👋 Component cleanup complete')
})

// Batch validation - validates cells in batches to avoid UI freeze
// Solution B + C: Only validate unvalidated cells, process asynchronously in batches
// SOLUTION 2: Enhanced logging to debug validation issues
// ✅ RIEŠENIE #7: Calculate optimal batch size based on total cells
// Adaptive batch sizing to balance memory usage and performance
function calculateOptimalBatchSize(totalCells: number): number {
  if (totalCells < 1000) {
    return 25   // Small dataset: smaller batches for responsiveness
  } else if (totalCells < 5000) {
    return 50   // Medium dataset: moderate batch size
  } else if (totalCells < 15000) {
    return 100  // Large dataset: bigger batches
  } else {
    return 200  // Very large dataset: maximum batch size
  }
}

async function validateAllCellsInBatches() {
  // ✅ RIEŠENIE #5: If validation is running, cancel it and wait for completion
  if (isValidating.value) {
    validationCancelled = true

    // ✅ FIX: Async polling s OPRAVENOU deadlock detection
    const waitForValidation = async (maxWaitMs: number = 5000): Promise<boolean> => {
      const startWait = Date.now()
      let iterations = 0

      while (isValidating.value && Date.now() - startWait < maxWaitMs) {
        iterations++
        // Yield to UI thread
        await nextTick()
        await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 100))
      }

      // ✅ CRITICAL FIX: Check AFTER loop exits (not inside loop!)
      // Loop exits when: (1) isValidating becomes false, OR (2) timeout reached
      // If timeout reached but isValidating is STILL true → DEADLOCK!
      if (isValidating.value) {
        // Loop exited due to timeout, but isValidating is STILL true → DEADLOCK DETECTED!
        console.error('═══════════════════════════════════════════════════')
        console.error(`[waitForValidation] ❌ DEADLOCK DETECTED after ${Date.now() - startWait}ms`)
        console.error(`  Iterations: ${iterations}`)
        console.error(`  isValidating was NEVER reset to false`)
        console.error(`  This indicates validation hung or crashed without cleanup`)
        console.error('═══════════════════════════════════════════════════')

        // ✅ FORCE RESET to break deadlock
        isValidating.value = false
        console.error('[waitForValidation] Forced isValidating=false to break deadlock')

        // ✅ Log to C# backend for diagnostics
        try {
          if ((window as any).chrome?.webview) {
            (window as any).chrome.webview.postMessage(JSON.stringify({
              type: 'error',
              source: 'DataGrid.waitForValidation',
              error: 'Validation deadlock detected - isValidating was never reset',
              iterations: iterations,
              elapsedMs: Date.now() - startWait,
              timestamp: new Date().toISOString()
            }))
          }
        } catch { }

        return false  // Validation NOT ready
      }

      return true  // Validation ready
    }

    const validationReady = await waitForValidation(5000)

    if (!validationReady) {
      console.error('[validateAllCellsInBatches] ❌ WAIT FAILED - aborting')
      return
    }
  }

  // ✅ RIEŠENIE #1: Set flag before starting
  isValidating.value = true
  // ✅ RIEŠENIE #5: Reset cancellation flag
  validationCancelled = false

  try {
    // 📊 LOG: Validation START
    console.info('═══════════════════════════════════════════════════')
    console.info('🔍 VALIDATION START')
    console.info(`   Rows: ${store?.rows?.length ?? 0}, Columns: ${store?.columns?.length ?? 0}`)
    console.info('═══════════════════════════════════════════════════')

    // ✅ FIX: Comprehensive validation checks
    if (!store || !store.config || !store.rows || !validation) {
      return
    }

    if (!store.config.enableValidation) {
      return
    }

    // ✅ RIEŠENIE #3: Extract columns with validation rules
    const columnsWithRules = new Set<string>()

    for (const [columnName, rules] of validation.validationRules.value.entries()) {
      if (rules.length > 0) {
        columnsWithRules.add(columnName)
      }
    }

    // ✅ RIEŠENIE #1: EARLY EXIT if no validation rules at all
    if (columnsWithRules.size === 0) {
      return  // ← EXIT - žiadna validácia!
    }

    // ✅ RIEŠENIE #3: Pass columnsWithRules to filter out columns without rules
    // ✅ FIX C: Only pass columnsWithRules if it has items (avoid empty Set issue)
    // ✅ Now safe to pass columnsWithRules (guaranteed non-empty by check above)
    // Solution B: Get only cells that need validation (changed or unvalidated)
    // Pass forceValidateAll=true to validate ALL cells, including those in currently empty rows
    const cellsToValidate = store.getCellsNeedingValidation(true, columnsWithRules)

    if (cellsToValidate.length === 0) {
      return
    }

    // ✅ RIEŠENIE #4: Initialize progress tracking
    validationProgress.value = {
      isValidating: true,
      current: 0,
      total: cellsToValidate.length,
      percentage: 0
    }

    // ✅ RIEŠENIE #7: Dynamic batch size based on total cells
    const PARALLEL_BATCH_SIZE = calculateOptimalBatchSize(cellsToValidate.length)
    let validatedCount = 0

    // Process in batches - validate ALL cells in batch SIMULTANEOUSLY
    for (let i = 0; i < cellsToValidate.length; i += PARALLEL_BATCH_SIZE) {
      // ✅ RIEŠENIE #5: Check cancellation before each batch
      if (validationCancelled) {
        console.log('[validateAllCellsInBatches] ⚠️ CANCELLED by user')
        return
      }

      const batch = cellsToValidate.slice(i, i + PARALLEL_BATCH_SIZE)
      const batchNumber = Math.floor(i / PARALLEL_BATCH_SIZE) + 1

      // ✅ Create array of validation promises - ALL cells validate in parallel
      const validationPromises = batch.map(({ rowId, columnName }: { rowId: string; columnName: string }) => {
        // ✅ RIEŠENIE #3: Use O(1) Map.get() instead of O(n) array.find()
        const row = store.getRow(rowId)
        if (!row || !row.cells) {
          console.warn('[validateAllCellsInBatches] ⚠️ Row not found or has no cells:', rowId)
          return Promise.resolve()
        }

        const cell = row.cells.find((c: GridCell) => c.columnName === columnName)
        if (!cell) {
          console.warn('[validateAllCellsInBatches] ⚠️ Cell not found:', { rowId, columnName })
          return Promise.resolve()
        }

        const rowCells = row.cells.map((c: GridCell) => ({ columnName: c.columnName, value: c.value }))

        // ✅ RIEŠENIE #2: Use validateCellDirect with skipErrorCountUpdate=true for bulk validation
        return validation.validateCellDirect(rowId, columnName, cell.value, rowCells, true)
          .then(() => {
            store.markCellValidated(rowId, columnName)
            validatedCount++
          })
          .catch((err: any) => {
            console.error('[validateAllCellsInBatches] ❌ Validation error:', { rowId, columnName, err })
          })
      })

      // ✅ Wait for ALL cells in batch to complete (parallel execution)
      await Promise.all(validationPromises)

      // ✅ RIEŠENIE #4: Update progress after each batch
      validationProgress.value.current = validatedCount
      validationProgress.value.percentage = Math.round((validatedCount / cellsToValidate.length) * 100)

      // Yield to UI after each batch to prevent freeze
      await nextTick()
    }

    // ✅ RIEŠENIE #2: Update error count ONCE at the end of batch validation
    validation.updateErrorCount()

    // 📊 LOG: Validation SUCCESS
    console.info('═══════════════════════════════════════════════════')
    console.info(`✅ VALIDATION SUCCESS - ${validatedCount} cells validated`)
    const errorCount = validation?.validationErrors?.value?.length ?? 0
    console.info(`   Total errors: ${errorCount}`)
    console.info('═══════════════════════════════════════════════════')
  } catch (error) {
    // 📊 LOG: Validation ERROR
    console.error('═══════════════════════════════════════════════════')
    console.error('❌ VALIDATION ERROR:', error)
    console.error('═══════════════════════════════════════════════════')
    throw error
  } finally {
    // ✅ RIEŠENIE #1: Always reset flag, even if error occurs
    isValidating.value = false

    // ✅ RIEŠENIE #4: Reset progress tracking
    validationProgress.value.isValidating = false
  }
}

// Watch for autoValidate toggle - validate all cells when enabled
watch(() => store.config.autoValidate, async (enabled, wasEnabled) => {
  if (enabled && !wasEnabled && store.config.enableValidation) {
    await validateAllCellsInBatches()
  }
})

function handleDocumentMouseUp() {
  if (store.isDragging || store.pressedCell) {
    store.endDragSelection()
  }
}

// Create special columns based on config
const specialColumns = computed(() => {
  const cols: GridColumn[] = []
  const config = store.config

  if (config.showRowNumber) {
    cols.push({
      name: '__rowNumber',
      header: '#',
      width: 50,
      minWidth: 40,
      maxWidth: 80,
      isVisible: true,
      isReadOnly: true,
      isSortable: false,
      isFilterable: false,
      specialType: 'RowNumber'
    })
  }

  if (config.showCheckbox) {
    cols.push({
      name: '__checkbox',
      header: '☑',
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      isVisible: true,
      isReadOnly: true,
      isSortable: false,
      isFilterable: true,  // ✅ FIX: Povoliť filtrovanie pre Checkbox stĺpec
      specialType: 'Checkbox'
    })
  }

  return cols
})

// Validation column (goes after data columns, before action columns)
// ✅ FIX: Uses fixed width (NOT autoWidth) to prevent collapsing on horizontal scroll
// Width can be overridden from backend config like other columns
const validationColumn = computed(() => {
  const cols: GridColumn[] = []
  const config = store.config

  if (config.showValidationAlerts) {
    cols.push({
      name: '__validationAlerts',
      header: '⚠ Validation',
      width: 150,        // ✅ FIX: Default fixed width (configurable from backend)
      minWidth: 100,     // ✅ FIX: Minimum width (configurable from backend)
      maxWidth: 300,     // ✅ FIX: Maximum width (configurable from backend)
      autoWidth: false,  // ✅ FIX: NO autoWidth - funguje ako ostatné stĺpce
      isVisible: true,
      isReadOnly: true,
      isSortable: false,
      isFilterable: false,
      specialType: 'ValidationAlerts'
    })
  }

  return cols
})

// Create action columns (at the end)
// Order: Insert first, then Delete (as per original WinUI component)
const actionColumns = computed(() => {
  const cols: GridColumn[] = []
  const config = store.config

  // Insert button first
  if (config.showInsertButton) {
    cols.push({
      name: '__insertRow',
      header: 'Insert',
      width: 60,
      minWidth: 50,
      maxWidth: 80,
      isVisible: true,
      isReadOnly: true,
      isSortable: false,
      isFilterable: false,
      specialType: 'InsertRow'
    })
  }

  // Delete button second
  if (config.showDeleteButton) {
    cols.push({
      name: '__deleteRow',
      header: 'Delete',
      width: 60,
      minWidth: 50,
      maxWidth: 80,
      isVisible: true,
      isReadOnly: true,
      isSortable: false,
      isFilterable: false,
      specialType: 'DeleteRow'
    })
  }

  return cols
})

// Combine columns in correct order:
// 1. RowNumber, Checkbox (specialColumns)
// 2. Data columns (only visible ones with visibleForGrid !== false)
// 3. ValidationAlerts (validationColumn)
// 4. Insert, Delete (actionColumns)
const allColumns = computed(() => [
  ...specialColumns.value,
  ...dataColumns.value.filter((col: GridColumn) => !col.specialType && col.isVisible && col.visibleForGrid !== false), // Only visible non-special columns that are shown in grid
  ...validationColumn.value,
  ...actionColumns.value
])

// Generate CSS Grid template columns
// Example: "50px 150px 200px 1fr 50px" for fixed and auto-width columns
const gridTemplateColumns = computed(() => {
  const template = allColumns.value.map((col: GridColumn) => {
    if (col.autoWidth) {
      return '1fr'  // Auto-width columns use fractional unit
    }
    return `${col.width}px`  // Fixed-width columns use pixels
  }).join(' ')

  // Debug: Log grid template and columns
  console.log('[GridTemplate] All Columns:', allColumns.value.map((c: GridColumn) => ({
    name: c.name,
    header: c.header,
    width: c.width,
    autoWidth: c.autoWidth,
    specialType: c.specialType
  })))
  console.log('[GridTemplate] Generated Template:', template)

  return template
})

// ✅ RIEŠENIE #3B: Debug watch to verify gridTemplateColumns recalculates after AutoFit
watch(gridTemplateColumns, (newVal) => {
  console.log('[DataGrid] ✅ gridTemplateColumns CHANGED:', newVal)
}, { immediate: false })

// Calculate minimum table width as sum of all visible column widths
// This enables horizontal scroll when table is wider than container
const minTableWidth = computed(() => {
  const totalWidth = allColumns.value.reduce((sum: number, col: GridColumn) => {
    // Only count visible columns (visibleForGrid !== false)
    // This includes special columns if they are shown
    if (col.visibleForGrid === false) {
      return sum
    }
    // ✅ Skip autoWidth columns (1fr) - they should fill remaining space, not force min-width
    if (col.autoWidth) {
      return sum
    }
    return sum + col.width
  }, 0)

  console.log('[GridTemplate] Min Table Width (fixed columns only):', totalWidth, 'px')
  return totalWidth
})

// Watch for config changes from props
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    store.setConfig(newConfig)
  }
}, { immediate: true, deep: true })

// Watch for columns changes from props
watch(() => props.columns, (newColumns) => {
  console.log('[DataGrid] Columns watch triggered:', {
    hasColumns: newColumns?.length,
    rowsLength: store.rows.length,
    willInitialize: newColumns && newColumns.length > 0 && store.rows.length === 0
  })

  if (newColumns && newColumns.length > 0) {
    try {
      store.setColumns(newColumns)
      console.log('[DataGrid] After setColumns, rowsLength:', store.rows.length)

      // Initialize empty rows if store is empty
      if (store.rows.length === 0) {
        console.log('[DataGrid] Calling initializeEmptyRows...')
        store.initializeEmptyRows()
        console.log('[DataGrid] After initializeEmptyRows, rowsLength:', store.rows.length)
      } else {
        console.log('[DataGrid] SKIPPED initializeEmptyRows - rows already exist!')
      }
    } catch (error) {
      console.error('[DataGrid] Failed to set columns:', error)
      alert(`Column configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}, { immediate: true, deep: true })

// Watch validation rules - trigger auto-validation when rules are added after data exists
// FIXED: Watch ruleCount (reactive counter) instead of validationRules.value (Map.set doesn't trigger reactivity)
watch(() => validation?.ruleCount?.value ?? 0, async (newCount, oldCount) => {
  const rulesSize = validation?.validationRules?.value?.size || 0

  // ✅ FIX: Pridať guard check pre store existenciu
  if (!store || !store.rows) {
    console.warn('[WATCHER] Store not initialized yet, skipping validation')
    return
  }

  // Only auto-validate if:
  // 1. Rules exist
  // 2. Data already exists
  // 3. Auto-validation is enabled in config
  if (rulesSize === 0 || store.rows.length === 0 || !store.config.autoValidate) {
    return
  }

  // Clear validation tracking before re-validating with new rules
  store.clearValidationTracking()

  try {
    // FIXED: Double nextTick to ensure UI is stable before validation
    await nextTick()
    await nextTick()

    await validateAllCellsInBatches()
  } catch (error) {
    console.error('[WATCHER] VALIDATION RULES CHANGED - FAILED')
    console.error(`  Error: ${error}`)

    // ✅ RIEŠENIE #3: CRITICAL - Force reset isValidating to prevent permanent deadlock
    isValidating.value = false
    console.error('[WATCHER] Forced isValidating=false after error')

    // ✅ Show error to user
    alert(`Auto-validation failed: ${error instanceof Error ? error.message : String(error)}`)

    // ✅ Log to C# backend for crash diagnostics
    try {
      if ((window as any).chrome?.webview) {
        (window as any).chrome.webview.postMessage(JSON.stringify({
          type: 'error',
          source: 'DataGrid.ruleCount.watcher',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        }))
      }
    } catch { }
  }
})

// ✅ RIEŠENIE #4: Deep watch REMOVED - validácia je explicitne volaná v loadDataFromBackend() a v ruleCount watch

// SOLUTION A: Watch errorCount ref from useValidation (reactive counter)
watch(() => validation?.errorCount?.value ?? 0, async (errorCount, oldErrorCount) => {
  const newErrors = validation?.validationErrors

  // FIXED: ALWAYS update validationErrorCount, even when errorCount = 0
  // This ensures stale values are cleared when errors are resolved
  store.rows.forEach((row: GridRow) => {
    // If no errors object or no errors for this row, set to 0
    const count = (newErrors && newErrors[row.rowId]) ? newErrors[row.rowId].length : 0
    row.validationErrorCount = count
  })

  // If no errors, we're done - no need to recalculate heights
  if (!newErrors || errorCount === 0) {
    return
  }

  // Wait for Vue to finish current render cycle
  await nextTick()

  if (store.isAutoRowHeightEnabled) {
    // If AutoRowHeight is ON, recalculate with validation text included
    await applyAutoRowHeightToAll()
  } else {
    // If AutoRowHeight is OFF, reset all rows to default height
    await resetAllRowHeights()
  }
})

function handleSort(columnName: string, direction: 'asc' | 'desc') {
  // Check if column exists and is sortable
  const column = store.columns.find((c: GridColumn) => c.name === columnName)
  if (!column) {
    console.error(`[handleSort] Column not found: ${columnName}`)
    return
  }

  if (!column.isSortable) {
    console.warn(`[handleSort] Column '${columnName}' is not sortable`)
    return
  }

  // Check if column has visibleForGrid=false (should not be sorted)
  if (column.visibleForGrid === false) {
    console.warn(`[handleSort] Column '${columnName}' has visibleForGrid=false, sorting not allowed`)
    return
  }

  store.addSort(columnName, direction, false)
}

function handleResize(columnName: string, newWidth: number) {
  const col = store.columns.find((c: GridColumn) => c.name === columnName)
  if (col) {
    col.width = newWidth
  }
}

async function handleCellEditComplete(rowId: string, columnName: string, value: any) {
  store.updateCell(rowId, columnName, value)

  // ✅ RIEŠENIE #4: Early exit checks for validation
  const column = store.columns.find((c: GridColumn) => c.name === columnName)
  if (!column) {
    console.warn('[DataGrid] handleCellEditComplete: Column not found:', columnName)
    return
  }

  // ✅ RIEŠENIE #4: Skip validation for hidden columns
  if (column.visibleForGrid === false) {
    // Continue to row height recalculation (don't return yet)
  }
  // CRITICAL: Validate cell immediately after edit if auto-validate is enabled
  else if (store.config.autoValidate && store.config.enableValidation && validation) {
    // ✅ RIEŠENIE #4: Skip validation if column has no rules
    const hasRules = validation.validationRules.value.has(columnName) &&
                     validation.validationRules.value.get(columnName)!.length > 0

    if (!hasRules) {
      // Continue to row height recalculation (don't return yet)
    } else {
      // ✅ NOW validate (only if visible AND has rules)
      const row = store.rows.find((r: GridRow) => r.rowId === rowId)
      const rowCells = row?.cells.map((c: GridCell) => ({ columnName: c.columnName, value: c.value }))
      await validation.validateCellThrottled(rowId, columnName, value, rowCells)
    }
  }

  // Recalculate row height if auto row height is enabled
  if (store.isAutoRowHeightEnabled) {
    await recalculateRowHeightAfterEdit(rowId)
    await nextTick()
  }
  // ✅ FIX: When AutoRowHeight is OFF, ALWAYS recalculate height based on current row values
  // This handles both:
  // 1. Adding newlines (Shift+Enter) → increases height
  // 2. Cancel edit (ESC) with previous newlines → restores original height
  else {
    await recalculateRowHeightForNewlines(rowId)
  }
}

async function handleCellInput(rowId: string, columnName: string, value: any) {

  // Update cell value in store (needed for real-time validation and AutoRowHeight)
  // cancelEdit() will restore original value if user cancels
  store.updateCell(rowId, columnName, value)

  // Recalculate row height in real-time if AutoRowHeight is enabled
  if (store.isAutoRowHeightEnabled) {
    await recalculateRowHeightAfterEdit(rowId)
    await nextTick()
  }
  // Special case: if value contains newlines but AutoRowHeight is OFF, still recalculate
  else if (value != null && String(value).includes('\n')) {
    await recalculateRowHeightForNewlines(rowId)
  }
}

function handleCheckboxChange(rowId: string, checked: boolean) {
  store.toggleCheckbox(rowId, checked)
}

function handleDeleteRow(rowId: string) {
  store.deleteRow(rowId)
}

function handleInsertRow(afterRowId: string) {
  store.insertRow(afterRowId)
}

function handleInsertAbove(rowId: string, count: number) {
  store.insertMultipleRows(rowId, count, 'above')
}

function handleInsertBelow(rowId: string, count: number) {
  store.insertMultipleRows(rowId, count, 'below')
}

// Hidden columns management
const hiddenColumns = computed(() => {
  return dataColumns.value.filter((col: GridColumn) => !col.isVisible && !col.specialType && col.visibleForGrid !== false)
})

function handleHideColumn(columnName: string) {
  console.log('[DataGrid] ✅ handleHideColumn CALLED with:', columnName)

  const col = store.columns.find((c: GridColumn) => c.name === columnName)
  console.log('[DataGrid] Found column:', col ? { name: col.name, specialType: col.specialType, isVisible: col.isVisible } : 'NOT FOUND')

  if (col && !col.specialType) {
    store.updateColumn(columnName, { isVisible: false })
    console.log(`[DataGrid] ✅ Hidden column: ${columnName}`)
  } else {
    console.warn(`[DataGrid] ❌ Cannot hide column: ${columnName} (specialType: ${col?.specialType})`)
  }
}

function showColumn(columnName: string) {
  store.updateColumn(columnName, { isVisible: true })
  console.log(`Shown column: ${columnName}`)
}

function showAllColumns() {
  store.columns.forEach((col: GridColumn) => {
    if (!col.specialType) {
      store.updateColumn(col.name, { isVisible: true })
    }
  })
  console.log('Shown all columns')
}

function handleAutoFitColumn(columnName: string) {
  console.log('[DataGrid] ✅ handleAutoFitColumn CALLED with:', columnName)

  const col = store.columns.find((c: GridColumn) => c.name === columnName)
  if (!col) {
    console.warn('[DataGrid] ❌ Column not found:', columnName)
    return
  }

  console.log('[DataGrid] Found column:', { name: col.name, currentWidth: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth })

  // Create a temporary canvas to measure text width
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    console.error('[DataGrid] ❌ Canvas context not available')
    return
  }

  // Set font to match grid cell font
  context.font = '14px system-ui, -apple-system, sans-serif'

  let maxWidth = 0

  // Measure header text
  const headerWidth = context.measureText(col.header).width
  maxWidth = Math.max(maxWidth, headerWidth + 40) // Add padding for sort icon, etc.
  console.log('[DataGrid] Header width:', headerWidth, '→ with padding:', headerWidth + 40)

  // Measure all cell values in this column
  store.rows.forEach((row: GridRow) => {
    const cell = row.cells.find((c: GridCell) => c.columnName === columnName)
    const value = cell?.value
    const textValue = value?.toString() ?? ''
    if (textValue) {
      const textWidth = context.measureText(textValue).width
      maxWidth = Math.max(maxWidth, textWidth + 24) // Add padding for cell content
    }
  })

  console.log('[DataGrid] Max measured width (with padding):', Math.ceil(maxWidth))

  // Apply constraints (min/max width)
  const newWidth = Math.max(
    col.minWidth,
    Math.min(col.maxWidth, Math.ceil(maxWidth))
  )

  console.log('[DataGrid] Calculated new width:', newWidth, '(min:', col.minWidth, 'max:', col.maxWidth, ')')

  store.updateColumn(columnName, { width: newWidth })
  console.log(`[DataGrid] ✅ Auto-fit column ${columnName}: ${newWidth}px (measured: ${Math.ceil(maxWidth)}px)`)
}

// Filter Flyout state
const filterFlyout = ref<{
  visible: boolean
  columnName: string
  position: { x: number; y: number }
  uniqueValues: FilterValue[]
  mode: 'checkbox' | 'regex'
  pattern: string
}>({
  visible: false,
  columnName: '',
  position: { x: 0, y: 0 },
  uniqueValues: [],
  mode: 'checkbox',
  pattern: ''
})

// ✅ HELPER: Extract all filters EXCEPT filters for specific column
function extractFiltersExceptColumn(filter: FilterExpression | null | undefined, excludeColumnName: string): FilterExpression | null {
  // ✅ FIX: Handle undefined filter expression (early initialization)
  if (filter === null || filter === undefined) return null

  if (filter.type === 'simple') {
    const simpleFilter = filter as SimpleFilter
    // If this filter is for the excluded column, remove it
    return simpleFilter.columnName === excludeColumnName ? null : filter
  }

  // Composite filter - recursively process left and right
  const compositeFilter = filter as CompositeFilter

  // ✅ FIX: Defensive check for null/undefined children
  if (!compositeFilter.left || !compositeFilter.right) {
    console.error('[extractFiltersExceptColumn] Invalid composite filter - missing children:', compositeFilter)
    return null
  }

  const leftFiltered = extractFiltersExceptColumn(compositeFilter.left, excludeColumnName)
  const rightFiltered = extractFiltersExceptColumn(compositeFilter.right, excludeColumnName)

  // Rebuild composite filter
  if (!leftFiltered && !rightFiltered) return null
  if (!leftFiltered) return rightFiltered
  if (!rightFiltered) return leftFiltered

  return {
    type: 'composite',
    left: leftFiltered,
    right: rightFiltered,
    operator: compositeFilter.operator
  } as CompositeFilter
}

// ✅ HELPER: Extract currently selected values for a column from filter expression
function extractSelectedValuesForColumn(filter: FilterExpression | null | undefined, columnName: string): Set<string> {
  const selectedValues = new Set<string>()

  // ✅ FIX: Handle undefined filter expression (early initialization)
  if (filter === null || filter === undefined) return selectedValues

  function traverse(expr: FilterExpression) {
    if (expr.type === 'simple') {
      const simpleFilter = expr as SimpleFilter
      if (simpleFilter.columnName === columnName && simpleFilter.operator === 'Equals') {
        selectedValues.add(String(simpleFilter.value))
      }
    } else {
      const compositeFilter = expr as CompositeFilter
      // ✅ FIX: Prechádzaj VŠETKY vetvy (AND aj OR)
      // Pre checkbox filter: hodnoty pre jeden stĺpec sú spojené OR
      // Rôzne stĺpce sú spojené AND
      // Musíme prejsť cez AND, aby sme našli OR vetvy pre náš stĺpec
      traverse(compositeFilter.left)
      traverse(compositeFilter.right)
    }
  }

  traverse(filter)
  return selectedValues
}

// Get unique values for a column with counts
// ✅ VARIANTA 3 FIX: Shows ALL unique values (with filters applied EXCEPT filter for this column)
// REASON: User should see all possible values, not just currently filtered ones
// EXAMPLE: If "Status" filtered to ["Active"], flyout should show [Active✓, Pending, Completed], not just [Active✓]
function getUniqueValues(columnName: string): FilterValue[] {
  try {
    // ✅ FIX: Wrap in try-catch for error handling and debugging
    console.log(`[getUniqueValues] Starting for column: ${columnName}`)

    // ✅ FIX: Early return if store or rows are not initialized
    if (!store || !store.rows) {
      console.warn(`[getUniqueValues] Store or rows not initialized yet, returning empty array`)
      return []
    }

    // ✅ FIX: Special handling for Checkbox column
    if (columnName === '__checkbox') {
      // Checkbox column - return true/false options
      // Apply filters from other columns to count correctly
      const filtersExceptThisColumn = extractFiltersExceptColumn(store.filterExpression, columnName)
      console.log(`[getUniqueValues] Checkbox - Has filters to apply: ${!!filtersExceptThisColumn}`)

      const allRows = store.rows
      console.log(`[getUniqueValues] Checkbox - Total rows before filtering: ${allRows.length}`)

      // ✅ FIX: Pass store to filterRowsHelper so it can access checkbox state
      const filteredRows = filtersExceptThisColumn ? filterRowsHelper(allRows, filtersExceptThisColumn, store) : allRows
      console.log(`[getUniqueValues] Checkbox - Total rows after filtering: ${filteredRows.length}`)

      // ✅ DEBUG: Log first few rows to see checkbox values
      const sampleSize = Math.min(3, filteredRows.length)
      for (let i = 0; i < sampleSize; i++) {
        const cell = filteredRows[i].cells.find((c: GridCell) => c.columnName === '__checkbox')
        console.log(`[getUniqueValues] Checkbox - Row ${i}: cell=${!!cell}, value=${cell?.value}, type=${typeof cell?.value}`)
      }

      const trueCount = filteredRows.filter((row: GridRow) => {
        // ✅ FIX: Checkbox state je v store.checkedRows, NIE v row.cells
        return store.isRowChecked(row.rowId)
      }).length

      const falseCount = filteredRows.length - trueCount

      const currentlySelectedValues = extractSelectedValuesForColumn(store.filterExpression, columnName)

      console.log(`[getUniqueValues] Checkbox column: true=${trueCount}, false=${falseCount}, selected=${Array.from(currentlySelectedValues)}`)

      return [
        {
          value: 'true',
          isSelected: currentlySelectedValues.has('true'),
          count: trueCount,
          displayText: `☑ Checked (${trueCount})`
        },
        {
          value: 'false',
          isSelected: currentlySelectedValues.has('false'),
          count: falseCount,
          displayText: `☐ Unchecked (${falseCount})`
        }
      ]
    }

    // ✅ Normal columns processing
    const valueMap = new Map<string, number>()

    // ✅ VARIANTA 3 FIX: Extract filters EXCEPT filter for this column
    const filtersExceptThisColumn = extractFiltersExceptColumn(store.filterExpression, columnName)
    console.log(`[getUniqueValues] Has filters to apply for '${columnName}': ${!!filtersExceptThisColumn}`)

    // ✅ VARIANTA 3 FIX: Load ALL rows (without any filtering)
    const allRows = store.rows

    // ✅ VARIANTA 3 FIX: Apply filters manually (all EXCEPT this column's filter)
    // ✅ FIX: Pass store to filterRowsHelper so it can access checkbox state
    const filteredRows = filtersExceptThisColumn ? filterRowsHelper(allRows, filtersExceptThisColumn, store) : allRows

    console.log(`[getUniqueValues] Column=${columnName}, AllRows=${allRows.length}, FilteredRows=${filteredRows.length}`)

    // Extract unique values from filtered rows
    filteredRows.forEach((row: GridRow) => {
      const cell = row.cells.find((c: GridCell) => c.columnName === columnName)
      const value = cell?.value?.toString() ?? ''
      valueMap.set(value, (valueMap.get(value) || 0) + 1)
    })

    // Get currently selected values for this column (to mark checkboxes as checked)
    const currentlySelectedValues = extractSelectedValuesForColumn(store.filterExpression, columnName)

    console.log(`[getUniqueValues] Column=${columnName}, UniqueValues=${valueMap.size}, SelectedValues=${currentlySelectedValues.size}`)

    const result = Array.from(valueMap.entries())
      .map(([value, count]: [string, number]) => {
        // Display empty values as "(Empty)"
        const displayValue = value === '' ? '(Empty)' : value
        return {
          value,
          isSelected: currentlySelectedValues.has(value), // ✅ Mark checkbox based on current filter
          count,
          displayText: `${displayValue} (${count})`
        }
      })
      .sort((a: FilterValue, b: FilterValue) => {
        // Sort empty values to bottom
        if (a.value === '' && b.value !== '') return 1
        if (a.value !== '' && b.value === '') return -1
        return a.value.localeCompare(b.value)
      })

    console.log(`[getUniqueValues] Returning ${result.length} unique values`)
    return result
  } catch (error) {
    console.error(`[getUniqueValues] ERROR for column '${columnName}':`, error)
    console.error(`[getUniqueValues] Filter expression at time of error:`, store.filterExpression)
    console.error(`[getUniqueValues] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace')
    // Return empty array to prevent UI crash
    return []
  }
}

function handleShowFilter(columnName: string) {
  try {
    console.log(`[handleShowFilter] START for column: ${columnName}`)

    // ✅ Check if grid is ready
    if (!isGridReady.value) {
      console.error(`[handleShowFilter] Grid not ready yet`)
      alert('Please wait for the grid to finish loading before opening filters.')
      return
    }

    // ✅ Check if processing (validation/AutoRowHeight)
    if (isProcessing.value) {
      console.error(`[handleShowFilter] Grid is currently processing data`)
      alert('Please wait while data is being processed...')
      return
    }

    // ✅ Check if column exists and is filterable
    const column = dataColumns.value.find((c: GridColumn) => c.name === columnName)
    if (!column) {
      console.error(`[handleShowFilter] Column not found: ${columnName}`)
      return
    }

    if (!column.isFilterable) {
      console.warn(`[handleShowFilter] Column '${columnName}' is not filterable`)
      return
    }

    // ✅ Check if column has visibleForGrid=false (should not be filtered)
    if (column.visibleForGrid === false) {
      console.warn(`[handleShowFilter] Column '${columnName}' has visibleForGrid=false, filtering not allowed`)
      return
    }

    // ✅ Check if store is initialized
    if (!store || !store.rows || store.rows.length === 0) {
      console.error(`[handleShowFilter] Store not initialized or no data`)
      alert('Please load data before opening filters.')
      return
    }

    // Get unique values for the column
    const uniqueValues = getUniqueValues(columnName)
    console.log(`[handleShowFilter] Got ${uniqueValues.length} unique values`)

    // Calculate position (centered on screen for now)
    const position = {
      x: window.innerWidth / 2 - 200, // 200 is roughly half the flyout width
      y: window.innerHeight / 2 - 300 // 300 is roughly half the flyout height
    }

    filterFlyout.value = {
      visible: true,
      columnName,
      position,
      uniqueValues,
      mode: 'checkbox',
      pattern: ''
    }

    console.log(`[handleShowFilter] Filter flyout opened successfully`)
  } catch (error) {
    console.error(`[handleShowFilter] CRITICAL ERROR for column '${columnName}':`, error)
    console.error(`[handleShowFilter] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace')
    alert(`Error opening filter for column '${columnName}': ${error instanceof Error ? error.message : String(error)}`)
  }
}

function closeFilterFlyout() {
  filterFlyout.value.visible = false
}

// Helper: Extract filters grouped by column from a filter expression tree
// Returns a Map where key is columnName and value is the filter expression for that column
function extractColumnFilters(filter: FilterExpression | null): Map<string, FilterExpression> {
  const columnFilters = new Map<string, FilterExpression>()

  function traverse(expr: FilterExpression, isAndContext: boolean): string | null {
    if (expr.type === 'simple') {
      const simple = expr as SimpleFilter
      // In AND context at top level, this is a separate column filter
      if (isAndContext) {
        columnFilters.set(simple.columnName, expr)
      }
      return simple.columnName
    } else {
      const composite = expr as CompositeFilter

      if (composite.operator === 'AND') {
        // AND operator separates different columns
        traverse(composite.left, true)
        traverse(composite.right, true)
        return null
      } else {
        // OR operator keeps same column together
        const leftCol: string | null = traverse(composite.left, false)
        const rightCol: string | null = traverse(composite.right, false)

        // Both sides should be same column in OR
        const columnName: string | null = leftCol || rightCol
        if (columnName && isAndContext) {
          columnFilters.set(columnName, expr)
        }
        return columnName
      }
    }
  }

  if (filter) {
    traverse(filter, true)
  }

  return columnFilters
}

// Helper: Combine multiple filters with AND operator
function combineFiltersWithAnd(filters: FilterExpression[]): FilterExpression | null {
  // ✅ FIX: Filter out null/undefined values to prevent corrupted filter structures
  const validFilters = filters.filter((f: FilterExpression | null) => f != null)

  if (validFilters.length === 0) return null
  if (validFilters.length === 1) return validFilters[0]

  let result = validFilters[0]
  for (let i = 1; i < validFilters.length; i++) {
    result = {
      type: 'composite',
      left: result,
      right: validFilters[i],
      operator: 'AND'
    } as CompositeFilter
  }

  return result
}

// Helper: Combine a new filter with existing filters (per-column replacement + cumulative)
function combineWithExistingFilters(newColumnFilter: FilterExpression, columnName: string): FilterExpression {
  // Get current filter expression
  const currentFilter = store.filterExpression

  // Extract filters grouped by column
  const columnFilters = extractColumnFilters(currentFilter)

  // Replace or add the filter for this column
  columnFilters.set(columnName, newColumnFilter)

  // Combine all column filters with AND
  const allFilters = Array.from(columnFilters.values())
  return combineFiltersWithAnd(allFilters) || newColumnFilter
}

function handleApplyCheckboxFilter(selectedValues: string[]) {
  const columnName = filterFlyout.value.columnName

  if (selectedValues.length === 0) {
    // No values selected = remove filter for this column only
    const columnFilters = extractColumnFilters(store.filterExpression)
    columnFilters.delete(columnName)

    if (columnFilters.size === 0) {
      store.clearFilter()
    } else {
      const allFilters = Array.from(columnFilters.values())
      const combinedFilter = combineFiltersWithAnd(allFilters)
      store.setFilter(combinedFilter)
    }
  } else {
    // ✅ FIX: Convert string values to boolean for Checkbox column
    const filterValues = columnName === '__checkbox'
      ? selectedValues.map((v: string) => v === 'true')
      : selectedValues

    // Build new filter for this column
    let newColumnFilter: FilterExpression

    if (filterValues.length === 1) {
      // Single value - use simple filter
      newColumnFilter = {
        type: 'simple',
        columnName,
        operator: 'Equals',
        value: filterValues[0]
      } as SimpleFilter
    } else {
      // Multiple values - build composite OR filter
      newColumnFilter = {
        type: 'simple',
        columnName,
        operator: 'Equals',
        value: filterValues[0]
      } as SimpleFilter

      for (let i = 1; i < filterValues.length; i++) {
        newColumnFilter = {
          type: 'composite',
          left: newColumnFilter,
          right: {
            type: 'simple',
            columnName,
            operator: 'Equals',
            value: filterValues[i]
          } as SimpleFilter,
          operator: 'OR'
        } as CompositeFilter
      }
    }

    // Combine with existing filters from other columns
    const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName)
    store.setFilter(combinedFilter)
  }

  console.log(`Applied checkbox filter to ${columnName}:`, selectedValues, 'Final filter:', store.filterExpression)
}

function handleApplyRegexFilter(pattern: string) {
  const columnName = filterFlyout.value.columnName

  if (!pattern) {
    // Empty pattern = remove filter for this column only
    const columnFilters = extractColumnFilters(store.filterExpression)
    columnFilters.delete(columnName)

    if (columnFilters.size === 0) {
      store.clearFilter()
    } else {
      const allFilters = Array.from(columnFilters.values())
      const combinedFilter = combineFiltersWithAnd(allFilters)
      store.setFilter(combinedFilter)
    }
    return
  }

  // Note: Full regex support is not available in the declarative filter system
  // Using 'Contains' operator as a simplified pattern match
  // For more complex patterns, a custom filter operator would need to be added
  const newColumnFilter: SimpleFilter = {
    type: 'simple',
    columnName,
    operator: 'Contains',
    value: pattern
  }

  // Combine with existing filters from other columns
  const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName)
  store.setFilter(combinedFilter)

  console.log(`Applied text contains filter to ${columnName}:`, pattern, 'Final filter:', store.filterExpression)
}

function handleClearFilter() {
  const columnName = filterFlyout.value.columnName

  // Remove filter for this column only
  const columnFilters = extractColumnFilters(store.filterExpression)
  columnFilters.delete(columnName)

  if (columnFilters.size === 0) {
    store.clearFilter()
  } else {
    const allFilters = Array.from(columnFilters.values())
    const combinedFilter = combineFiltersWithAnd(allFilters)
    store.setFilter(combinedFilter)
  }

  console.log(`Cleared filter for ${columnName}`, 'Final filter:', store.filterExpression)
}

// Auto Row Height handlers
async function toggleAutoRowHeight() {
  try {
    console.log('[toggleAutoRowHeight] ========== FUNCTION CALLED ==========')
    console.log(`[toggleAutoRowHeight] Current state: ${store.isAutoRowHeightEnabled}`)
    console.log('[toggleAutoRowHeight] Rows BEFORE:', store.rows.slice(0, 5).map((r: GridRow) => ({ id: r.rowId, height: r.height })))

    const newValue = !store.isAutoRowHeightEnabled
    console.log(`[toggleAutoRowHeight] New state will be: ${newValue}`)

    store.setAutoRowHeightEnabled(newValue)
    console.log('[toggleAutoRowHeight] Store updated')

    if (newValue) {
      // Apply heights immediately to all existing rows
      console.log('[toggleAutoRowHeight] Enabled - applying heights to all rows...')
      await applyAutoRowHeightToAll()
      console.log('[toggleAutoRowHeight] Heights applied successfully')
    } else {
      // Reset all rows to default height when disabling
      console.log('[toggleAutoRowHeight] Disabled - resetting all row heights...')
      await resetAllRowHeights()
      console.log('[toggleAutoRowHeight] Heights reset successfully')
    }

    console.log('[toggleAutoRowHeight] Rows AFTER:', store.rows.slice(0, 5).map((r: GridRow) => ({ id: r.rowId, height: r.height })))
    console.log('[toggleAutoRowHeight] ========== FUNCTION COMPLETED ==========')
  } catch (error) {
    console.log(`[toggleAutoRowHeight] ❌ ERROR: ${error}`)
    console.log(`[toggleAutoRowHeight] Error stack: ${error instanceof Error ? error.stack : 'N/A'}`)
  }
}

async function applyAutoRowHeightToAll() {
  // Pass ALL columns but skip ValidationAlerts to avoid inflated heights
  // ValidationAlerts uses ellipsis, doesn't need measurement
  const columnsForMeasurement = allColumns.value
    .filter((col: GridColumn) => !col.specialType || col.specialType !== 'ValidationAlerts')
    .map((col: GridColumn) => ({
      name: col.name,
      width: col.width,
      specialType: col.specialType
    }))

  console.log('[applyAutoRowHeightToAll] ========== START ==========')
  console.log('[applyAutoRowHeightToAll] AutoRowHeight is ON')

  // Log ALL row heights BEFORE changes
  const heightsBefore = store.rows.map((r: GridRow) => ({ rowId: r.rowId, heightBefore: r.height }))
  console.log('[applyAutoRowHeightToAll] BEFORE - All row heights:', heightsBefore.slice(0, 10))

  console.log('[applyAutoRowHeightToAll] Measuring columns:', columnsForMeasurement.map((c: { name: string; width: number; specialType?: string }) => `${c.name} (${c.width}px, special: ${c.specialType || 'none'})`).join(', '))

  const result = await autoRowHeight.applyAutoRowHeight(store.rows, columnsForMeasurement)

  // Log ALL row heights AFTER changes and compare
  const heightsAfter = store.rows.map((r: GridRow, i: number) => ({
    rowId: r.rowId,
    heightBefore: heightsBefore[i].heightBefore,
    heightAfter: r.height,
    changed: heightsBefore[i].heightBefore !== r.height
  }))

  console.log('[applyAutoRowHeightToAll] AFTER - All row heights (first 10):', heightsAfter.slice(0, 10))
  console.log('[applyAutoRowHeightToAll] Changed rows:', heightsAfter.filter((h: { rowId: string; heightBefore: number; heightAfter: number; changed: boolean }) => h.changed).length)
  console.log(`[applyAutoRowHeightToAll] Summary: ${result.totalRowsUpdated} rows updated, average height: ${result.averageHeight.toFixed(1)}px`)

  // CRITICAL: Wait for Vue to update DOM before forcing scroller update
  await nextTick()
  console.log('[applyAutoRowHeightToAll] First nextTick complete')

  // Double nextTick to ensure all reactive updates complete
  await nextTick()
  console.log('[applyAutoRowHeightToAll] Second nextTick complete')

  // Triple nextTick for good measure
  await nextTick()
  console.log('[applyAutoRowHeightToAll] Third nextTick complete')

  // Small delay to ensure rendering completes
  await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 50))
  console.log('[applyAutoRowHeightToAll] Delay complete')

  console.log('[applyAutoRowHeightToAll] ========== COMPLETE ==========')
}

async function resetAllRowHeights() {
  console.log('[resetAllRowHeights] START - AutoRowHeight is OFF, resetting heights based on newlines')

  let rowsProcessed = 0
  let rowsWithNewlines = 0
  const defaultHeight = 32  // Default pre bunky bez newlines

  // ✅ FIX: Prepočítať výšku pre KAŽDÝ riadok na základe newlines
  for (const row of store.rows) {
    let maxLines = 1

    // Check all data cells for newlines
    for (const cell of row.cells) {
      if (cell.value == null) continue

      const textValue = String(cell.value)
      if (textValue.includes('\n')) {
        // Count lines (split by \n)
        const lines = textValue.split('\n').length
        maxLines = Math.max(maxLines, lines)
      }
    }

    // Calculate height: lineHeight (21px) * lines + vertical padding (10px)
    if (maxLines > 1) {
      const lineHeight = 21  // 14px font-size * 1.5 line-height
      const verticalPadding = 10  // 5px top + 5px bottom
      row.height = maxLines * lineHeight + verticalPadding
      rowsWithNewlines++
    } else {
      // No newlines - use default height
      row.height = defaultHeight
    }

    rowsProcessed++
  }

  console.log('[resetAllRowHeights] Summary:', {
    totalRows: rowsProcessed,
    rowsWithNewlines: rowsWithNewlines,
    rowsWithDefaultHeight: rowsProcessed - rowsWithNewlines,
    defaultHeight: defaultHeight,
    note: 'Rows with newlines have calculated height'
  })

  console.log('[resetAllRowHeights] All row heights calculated based on content')

  // CRITICAL: Wait for Vue to update DOM before forcing scroller update
  await nextTick()
  console.log('[resetAllRowHeights] First nextTick complete')

  // Double nextTick to ensure all reactive updates complete
  await nextTick()
  console.log('[resetAllRowHeights] Second nextTick complete')

  // Triple nextTick for good measure
  await nextTick()
  console.log('[resetAllRowHeights] Third nextTick complete')

  // Small delay to ensure rendering completes
  await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 50))
  console.log('[resetAllRowHeights] Delay complete')

  console.log('[resetAllRowHeights] COMPLETE')
}

async function recalculateRowHeightAfterEdit(rowId: string) {
  if (!store.isAutoRowHeightEnabled) return

  // Skip ValidationAlerts column from measurement - validation messages use ellipsis
  const columnsForMeasurement = allColumns.value
    .filter((col: GridColumn) => !col.specialType || col.specialType !== 'ValidationAlerts')
    .map((col: GridColumn) => ({
      name: col.name,
      width: col.width,
      specialType: col.specialType
    }))

  const row = store.rows.find((r: GridRow) => r.rowId === rowId)
  if (!row) return

  const updatedCount = autoRowHeight.recalculateRows(store.rows, [rowId], columnsForMeasurement)

  if (updatedCount > 0 && row) {
    // CRITICAL: Force Vue reactivity by reassigning through store
    store.updateRowHeight(rowId, row.height)

    await nextTick()
  }
}

/**
 * Calculates row height based on newlines when AutoRowHeight is OFF
 * Only counts explicit newlines (\n), doesn't wrap by spaces
 */
async function recalculateRowHeightForNewlines(rowId: string) {
  const row = store.rows.find((r: GridRow) => r.rowId === rowId)
  if (!row) return

  let maxLines = 1

  // Check all data cells for newlines
  for (const cell of row.cells) {
    if (cell.value == null) continue

    const textValue = String(cell.value)
    if (textValue.includes('\n')) {
      // Count lines (split by \n)
      const lines = textValue.split('\n').length
      maxLines = Math.max(maxLines, lines)
    }
  }

  // Calculate height: lineHeight (21px) * lines + vertical padding (10px)
  const lineHeight = 21  // 14px font-size * 1.5 line-height
  const verticalPadding = 10  // 5px top + 5px bottom
  const calculatedHeight = maxLines * lineHeight + verticalPadding

  // Update row height
  store.updateRowHeight(rowId, calculatedHeight)
  await nextTick()
}

// Backend API handlers
async function checkBackendConnection() {
  logger.debug('🔌 Checking backend connection...')

  try {
    isBackendConnected.value = await gridApi.healthCheck()

    if (isBackendConnected.value) {
      logger.info('✅ Backend connected')
    } else {
      logger.warn('⚠️ Backend disconnected')
    }
  } catch (error: any) {
    logger.error('❌ Backend connection check failed', {
      error: error?.message || error?.toString() || 'Unknown error',
      stack: error?.stack
    })
    isBackendConnected.value = false
  }
}

// ✅ RIEŠENIE #6: Original function (to be wrapped with debounce)
async function loadDataFromBackendOriginal() {
  // ✅ RIEŠENIE #7: Guard - prevent concurrent data loads
  if (isProcessing.value) {
    return
  }

  isLoadingFromBackend.value = true
  isProcessing.value = true

  // ✅ RIEŠENIE #4: Set loading state
  loadingState.value = {
    isLoading: true,
    operation: 'Loading data from backend...',
    progress: 0,
    total: 0,
    percentage: 0
  }

  // 📊 LOG: Data loading START
  console.info('═══════════════════════════════════════════════════')
  console.info('📥 DATA LOADING START')
  console.info('═══════════════════════════════════════════════════')

  try {
    const response = await gridApi.getData()

    if (response.success && response.data) {
      // ✅ RIEŠENIE #4: Update loading state
      loadingState.value.operation = 'Processing data...'
      loadingState.value.total = response.data.length

      // Convert backend data format to store format
      // Backend returns: { RowId, RowHeight, Checkbox, Data: { name, email, ... } }
      // Store expects: { __rowId, __rowHeight, __checkbox, name, email, ... }
      const rows = response.data.map((row: any, index: number) => ({
        __rowId: row.RowId || `row-${Date.now()}-${index}`,
        __rowHeight: row.RowHeight || 40,
        __checkbox: row.Checkbox,
        ...row.Data  // Spread Data dictionary to root level
      }))

      // ✅ RIEŠENIE #4: Update progress
      loadingState.value.progress = rows.length
      loadingState.value.percentage = 100

      // Clear validation tracking before loading new data (bulk load)
      store.clearValidationTracking()

      store.loadRows(rows)

      // ✅ RIEŠENIE #4: Update operation
      loadingState.value.operation = 'Data loaded successfully'

      // 📊 LOG: Data loading SUCCESS
      console.info('═══════════════════════════════════════════════════')
      console.info(`✅ DATA LOADING SUCCESS - ${rows.length} rows loaded`)
      console.info('═══════════════════════════════════════════════════')

      // ✅ RIEŠENIE #4B: Explicit validation call after data load (replaces deep watch on rows)
      // Validate all cells after loading data if auto-validation is enabled
      if (store.config.autoValidate && store.config.enableValidation) {
        const rulesCount = validation?.validationRules?.value?.size || 0

        if (rulesCount > 0) {
          // ✅ RIEŠENIE #4B: Wait for DOM to stabilize before validating
          await nextTick()
          await nextTick()

          // ✅ RIEŠENIE #4B: Additional small delay for stability
          await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 50))

          await validateAllCellsInBatches()
        }
      }
    } else {
      // 📊 LOG: Data loading ERROR (API failed)
      console.error('═══════════════════════════════════════════════════')
      console.error('❌ DATA LOADING ERROR:', response.error)
      console.error('═══════════════════════════════════════════════════')
      alert(`Failed to load data: ${response.error}`)
    }
  } catch (error) {
    // 📊 LOG: Data loading FATAL (Exception)
    console.error('═══════════════════════════════════════════════════')
    console.error('💥 DATA LOADING FATAL EXCEPTION:', error)
    console.error('═══════════════════════════════════════════════════')
    alert(`Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    isLoadingFromBackend.value = false
    isProcessing.value = false

    // ✅ RIEŠENIE #4: Reset loading state
    loadingState.value.isLoading = false
  }
}

// ✅ RIEŠENIE #6: Debounced wrapper (1 second debounce, max 2 seconds wait)
const loadDataFromBackend = useDebounceFn(loadDataFromBackendOriginal, 1000, {
  maxWait: 2000
})

async function saveDataToBackend() {
  isSavingToBackend.value = true

  try {
    // ✅ RIEŠENIE #5: Get visible data columns (for empty check)
    const visibleDataColumns = dataColumns.value.filter((col: GridColumn) =>
      !col.specialType && col.visibleForGrid !== false
    )

    // ✅ RIEŠENIE #5: Filter and extract data
    const data: Record<string, any>[] = []
    let skippedEmptyRows = 0

    for (const row of store.rows) {
      // ✅ RIEŠENIE #5: Check if row has visible data
      const hasVisibleData = visibleDataColumns.some((col: GridColumn) => {
        const cell = row.cells.find((c: GridCell) => c.columnName === col.name)
        const value = cell?.value
        return value !== null && value !== undefined && value !== ''
      })

      if (!hasVisibleData) {
        skippedEmptyRows++
        continue  // ✅ SKIP - row has no visible data
      }

      // ✅ RIEŠENIE #5: Extract ALL columns (including hidden)
      // Backend gets complete data for rows with visible content
      const rowData: Record<string, any> = {}

      dataColumns.value.forEach((col: GridColumn) => {
        if (!col.specialType) {
          const cell = row.cells.find((c: GridCell) => c.columnName === col.name)
          if (cell) {
            rowData[col.name] = cell.value
          }
        }
      })

      data.push(rowData)
    }

    console.log('[saveDataToBackend] 📦 Data prepared:', {
      totalRows: store.rows.length,
      savedRows: data.length,
      skippedEmptyRows,
      filterRate: `${Math.round((skippedEmptyRows / store.rows.length) * 100)}%`
    })

    const response = await gridApi.importData(data)

    if (response.success) {
      console.log(`✅ Saved ${data.length} rows to backend`)
    } else {
      console.error('❌ Failed to save data to backend:', response.error)
      alert(`Failed to save data: ${response.error}`)
    }
  } catch (error) {
    console.error('Error saving data to backend:', error)
    alert(`Error saving data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    isSavingToBackend.value = false
  }
}

// Import/Export handlers
// async function handleExportToJson() {
//   const rows = store.rows.map(row => {
//     const rowData: Record<string, any> = {}

//     // Extract data columns only (exclude special columns)
//     dataColumns.value.forEach(col => {
//       if (!col.specialType) {
//         const cell = row.cells.find(c => c.columnName === col.name)
//         if (cell) {
//           rowData[col.name] = cell.value
//         }
//       }
//     })

//     return rowData
//   })

//   const columnNames = getDataColumnNames()
//   const result = importExport.exportToJson(rows, columnNames, {
//     prettify: true,
//     includeHiddenColumns: false,
//     includeSpecialComponents: false
//   })

//   console.log(result.message)
// }

async function handleImportFromJson(mode: ImportMode = ImportMode.Append) {
  const currentRows = store.rows.map((row: GridRow) => {
    const rowData: Record<string, any> = { __rowId: row.rowId, __rowIndex: row.rowIndex }

    row.cells.forEach((cell: GridCell) => {
      rowData[cell.columnName] = cell.value
    })

    return rowData
  })

  const columnNames = getDataColumnNames()
  const result = await importExport.openImportDialog(currentRows, columnNames, {
    mode,
    validateSchema: true
  })

  if (result.success && result.rows) {
    console.log(result.message)

    // Load the imported rows into the store
    store.loadRows(result.rows)

    console.log(`Successfully imported ${result.rowsImported} rows into grid`)
  } else {
    console.error('Import failed:', result.errors)
    alert(`Import failed: ${result.message}\n${result.errors.join('\n')}`)
  }
}

// Merge theme with defaults
const mergedTheme = computed(() => {
  return {
    ...defaultDataGridTheme,
    cellColors: { ...defaultDataGridTheme.cellColors, ...(props.theme?.cellColors || {}) },
    rowColors: { ...defaultDataGridTheme.rowColors, ...(props.theme?.rowColors || {}) },
    headerColors: { ...defaultDataGridTheme.headerColors, ...(props.theme?.headerColors || {}) },
    validationColors: { ...defaultDataGridTheme.validationColors, ...(props.theme?.validationColors || {}) },
    selectionColors: { ...defaultDataGridTheme.selectionColors, ...(props.theme?.selectionColors || {}) },
    borderColors: { ...defaultDataGridTheme.borderColors, ...(props.theme?.borderColors || {}) },
    specialColumnColors: { ...defaultDataGridTheme.specialColumnColors, ...(props.theme?.specialColumnColors || {}) },
    uiControlColors: { ...defaultDataGridTheme.uiControlColors, ...(props.theme?.uiControlColors || {}) }
  }
})

// Generate CSS variables from theme and add minTableWidth, width, height
const cssVariables = computed(() => {
  const themeVars = generateDataGridCSSVariables(mergedTheme.value)
  return {
    ...themeVars,
    '--dg-min-table-width': `${minTableWidth.value}px`,  // ✅ Use computed minTableWidth (fixed columns only)
    width: props.width || '100%',
    height: props.height || '800px'  // ✅ Zvýšená default výška pre pagination a scrolling
  }
})

// Enhanced validation API with tracking and auto-validate support
const enhancedValidation = {
  ...validation,

  /**
   * Validates only cells that need validation (changed or unvalidated)
   * Returns true if all non-empty cells are valid
   * Respects autoValidate config
   */
  async validateRequired(): Promise<boolean> {
    if (!store.config.enableValidation) {
      return true
    }

    const cellsToValidate = store.getCellsNeedingValidation()

    if (cellsToValidate.length === 0) {
      // Nothing to validate - return current validation state
      return store.areNonEmptyRowsValid()
    }

    // Validate each cell that needs validation
    for (const { rowId, columnName } of cellsToValidate) {
      const row = store.rows.find((r: GridRow) => r.rowId === rowId)
      if (!row) continue

      const cell = row.cells.find((c: GridCell) => c.columnName === columnName)
      if (!cell) continue

      // Validate the cell using existing validation rules
      await validation.validateCell(rowId, columnName, cell.value)

      // Mark as validated
      store.markCellValidated(rowId, columnName)
    }

    return store.areNonEmptyRowsValid()
  },

  /**
   * Checks if all non-empty rows are valid (without running validation)
   * Returns true if valid, false if there are errors
   */
  isAllValid(): boolean {
    return store.areNonEmptyRowsValid()
  },

  /**
   * Forces validation of all cells regardless of tracking
   * Returns true if all non-empty cells are valid
   */
  async validateAll(rows?: any[]): Promise<{ isValid: boolean; totalErrors: number }> {
    if (!store.config.enableValidation) {
      return { isValid: true, totalErrors: 0 }
    }

    // Use original validateAll method
    const result = await validation.validateAll(rows || store.rows)

    // Clear tracking and mark all cells as validated
    store.clearValidationTracking()

    for (const row of store.rows) {
      for (const cell of row.cells) {
        store.markCellValidated(cell.rowId, cell.columnName)
      }
    }

    return result
  }
}

// Expose validation, copy/paste, shortcuts, and grid state to parent components
defineExpose({
  loadDataFromBackend,
  validation: enhancedValidation,
  copyPaste,
  shortcuts,
  handleCopy,
  handlePaste,
  handleCut,
  isGridReady,  // ✅ RIEŠENIE #3: Expose grid ready state for validation guard
  store,  // ✅ Expose store for advanced use cases
  getColumns: () => store.columns,          // ✅ NOVÁ metóda - vráti aktuálne stĺpce
  setColumns: (columns: GridColumn[]) => {  // ✅ NOVÁ metóda - nastaví stĺpce
    store.setColumns(columns)
  }
})
</script>

<style scoped>
.data-grid {
  display: flex;
  flex-direction: column;
  /* height: 100%; ← REMOVED: Conflict with inline style from props.height */
  /* Inline style from cssVariables (props.height || '800px') takes precedence */
  border: 1px solid var(--dg-border-grid, #ddd);
  background-color: var(--dg-cell-bg, white);
  border-radius: 4px;
  overflow: hidden; /* ✅ Zachová flex layout a umožní správny scrolling */
  position: relative; /* For absolute positioning of overlay */
}

/* Loading overlay during processing */
.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: white;
  padding: 32px 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.processing-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--dg-border-cell, #e0e0e0);
  border-top-color: var(--dg-header-sort-indicator, #2196f3);
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.processing-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--dg-cell-fg, #212529);
  white-space: nowrap;
}

/* ✅ RIEŠENIE #4: Loading overlay styles */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: white;
  padding: 32px 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--dg-border-cell, #e0e0e0);
  border-top-color: var(--dg-header-sort-indicator, #2196f3);
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}

.loading-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--dg-cell-fg, #212529);
  white-space: nowrap;
}

/* ✅ RIEŠENIE #4: Progress bar styles */
.progress-container {
  width: 100%;
  max-width: 400px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: var(--dg-border-cell, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--dg-header-sort-indicator, #2196f3);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 400;
  color: var(--dg-cell-fg, #212529);
  text-align: center;
}

.grid-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: var(--dg-ui-pagination-bg, #f8f9fa);
  border-bottom: 1px solid var(--dg-border-cell, #e0e0e0);
}

.toolbar-section {
  display: flex;
  gap: 8px;
}

.toolbar-button {
  padding: 6px 12px;
  background-color: var(--dg-ui-pagination-bg, white);
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: var(--dg-ui-pagination-fg, #212529);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-button:hover {
  background-color: var(--dg-cell-hover-bg, #e9ecef);
  border-color: var(--dg-header-sort-indicator, #2196f3);
}

.toolbar-button:active {
  transform: translateY(1px);
}

.toolbar-button--active {
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  border-color: var(--dg-header-sort-indicator, #2196f3);
}

.toolbar-button--active:hover {
  background-color: #1976d2;
  border-color: #1976d2;
}

.toolbar-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.connection-status {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  transition: all 0.2s;
}

.connection-status--connected {
  color: var(--dg-header-sort-indicator, #4caf50);
}

.connection-status--disconnected {
  color: var(--dg-validation-error-fg, #f44336);
}

.connection-status:hover {
  background-color: var(--dg-cell-hover-bg, #f0f0f0);
}

.hidden-columns-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--dg-validation-warning-bg, #fff3cd);
  border-bottom: 1px solid var(--dg-validation-warning-border, #ffc107);
  font-size: 13px;
}

.hidden-columns-label {
  font-weight: 500;
  color: var(--dg-validation-warning-fg, #856404);
}

.show-column-button,
.show-all-button {
  padding: 4px 12px;
  background-color: var(--dg-ui-pagination-bg, white);
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: var(--dg-ui-pagination-fg, #212529);
  transition: all 0.2s;
}

.show-column-button:hover,
.show-all-button:hover {
  background-color: var(--dg-cell-hover-bg, #e9ecef);
  border-color: var(--dg-header-sort-indicator, #2196f3);
}

.show-all-button {
  font-weight: 500;
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  border-color: var(--dg-header-sort-indicator, #2196f3);
  margin-left: auto;
}

.show-all-button:hover {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.grid-container {
  flex: 1 1 0; /* ✅ FIX: Allow shrinking to fit pagination */
  display: flex;
  flex-direction: column;
  overflow: visible; /* ✅ FIX: Allow child scrolling (horizontal scroll fix) */
  width: 100%; /* CRITICAL: Fill full width of parent */
  min-width: 0; /* ✅ Allow shrinking below content width */
  min-height: 0; /* ✅ CRITICAL: Allow flex child to be smaller than content - fixes pagination visibility */
}

/* ✅ Table content wrapper - horizontal scroll container */
.table-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0; /* Allow flex item to shrink */
  overflow-x: auto; /* ✅ Horizontal scroll pre celý .table-inner (header + rows) */
  overflow-y: hidden; /* Vertical scroll is on .scroller */
}

/* ✅ RIEŠENIE A: Wrapper pre column grouping - header + rows v jednom scroll contexte */
.table-inner {
  /* minWidth set via inline style from minTableWidth prop */
  width: fit-content; /* Shrink to content ak je menší ako viewport */
  display: flex;
  flex-direction: column;
  flex: 1; /* Fill vertical space */
  min-height: 0; /* Allow flex item to shrink */
}

.scroller {
  flex: 1;
  overflow-y: auto; /* ✅ Vertical scroll pre rows */
  overflow-x: hidden; /* ✅ RIEŠENIE A: HIDDEN (nie visible!) - no horizontal scroll, zdedí width od .table-inner */
  min-width: 0; /* Allow flex item to shrink */
  /* ✅ FIX (Riešenie B): REMOVED min-height - let flex handle height naturally */
}

/* Scrollbar styling - horizontal (on .table-content) */
.table-content::-webkit-scrollbar {
  height: 8px;
}

.table-content::-webkit-scrollbar-track {
  background: var(--dg-ui-pagination-bg, #f1f1f1);
}

.table-content::-webkit-scrollbar-thumb {
  background: var(--dg-border-cell, #c1c1c1);
  border-radius: 4px;
}

.table-content::-webkit-scrollbar-thumb:hover {
  background: var(--dg-ui-resize-grip, #a8a8a8);
}

/* Scrollbar styling - vertical (on .scroller) */
.scroller::-webkit-scrollbar {
  width: 8px;
  /* ✅ FIX: height removed - .scroller has overflow-x: visible, no horizontal scrollbar */
}

.scroller::-webkit-scrollbar-track {
  background: var(--dg-ui-pagination-bg, #f1f1f1);
}

.scroller::-webkit-scrollbar-thumb {
  background: var(--dg-border-cell, #c1c1c1);
  border-radius: 4px;
}

.scroller::-webkit-scrollbar-thumb:hover {
  background: var(--dg-ui-resize-grip, #a8a8a8);
}
</style>
