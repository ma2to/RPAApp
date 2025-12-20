<template>
  <div
    ref="placeholderRef"
    class="lazy-row-placeholder"
    :style="{ height: row.height + 'px' }"
  >
    <DataGridRow
      v-if="isVisible"
      :row="row"
      :columns="columns"
      :grid-template-columns="gridTemplateColumns"
      :min-table-width="minTableWidth"
      :grid-id="gridId"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, type Ref } from 'vue'
import DataGridRow from './DataGridRow.vue'
import type { GridRow, GridColumn } from '@/stores/dataGridStore'

const props = defineProps<{
  row: GridRow
  columns: GridColumn[]
  gridTemplateColumns: string
  minTableWidth?: number
  gridId?: string
}>()

defineOptions({
  inheritAttrs: false  // Forward attrs to DataGridRow
})

const placeholderRef = ref<HTMLDivElement | null>(null)

// ✅ RIEŠENIE #1A: Inject shared observer and visibility map as Refs from parent DataGrid
// ✅ KAŽDÁ DataGrid inštancia poskytuje SVOJ observer cez provide()
// ✅ LazyRow injektuje z NAJBLIŽŠIEHO parenta (svojho DataGrid)
// ✅ NEMÔŽE dôjsť k cross-contamination medzi inštanciami
const observer = inject<Ref<IntersectionObserver | null>>('intersectionObserver')
const rowVisibility = inject<Ref<Map<string, boolean>>>('rowVisibility')

// ✅ RIEŠENIE #2: Enhanced error handling with defensive checks
// ✅ RIEŠENIE #1C: Empty rows always visible (no lazy rendering needed)
// Compute visibility from shared map using .value to access the Ref
const isVisible = computed(() => {
  // ✅ RIEŠENIE #1C: Check if row is empty (all cells null/empty)
  const isEmpty = props.row.cells.every(cell =>
    cell.value === null || cell.value === undefined || cell.value === ''
  )

  // Empty rows always visible - no lazy rendering needed for empty rows
  if (isEmpty) {
    return true
  }

  // Defensive check for null/undefined
  if (!rowVisibility || !rowVisibility.value) {
    console.warn('[LazyRow] rowVisibility not available, rendering by default for row:', props.row.rowId)
    return true  // Fallback: render by default if map not available
  }

  // ✅ RIEŠENIE #1C: Default to true for non-empty rows (visible until proven invisible)
  const visibility = rowVisibility.value.get(props.row.rowId) ?? true
  return visibility
})

onMounted(() => {
  // ✅ Use observer.value to access the IntersectionObserver
  if (!observer || !observer.value || !placeholderRef.value) return

  // Set rowId as data attribute for observer callback
  placeholderRef.value.dataset.rowId = props.row.rowId

  // Register with shared observer
  observer.value.observe(placeholderRef.value)
})

onUnmounted(() => {
  // ✅ Use observer.value and rowVisibility.value
  if (!observer || !observer.value || !placeholderRef.value) return

  // Unregister from shared observer
  observer.value.unobserve(placeholderRef.value)

  // Clean up visibility map
  if (rowVisibility && rowVisibility.value) {
    rowVisibility.value.delete(props.row.rowId)
  }
})
</script>

<style scoped>
.lazy-row-placeholder {
  /* Placeholder preserves space for unrendered row */
  width: 100%;
}
</style>
