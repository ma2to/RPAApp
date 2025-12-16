<template>
  <div class="pagination">
    <button @click="emit('pageChange', 1)" :disabled="currentPage === 1">
      First
    </button>
    <button @click="emit('pageChange', currentPage - 1)" :disabled="currentPage === 1">
      Previous
    </button>

    <!-- Individual page number buttons -->
    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="{ 'page-number': true, 'active': page === currentPage }"
        @click="emit('pageChange', page)"
      >
        {{ page }}
      </button>
    </div>

    <button @click="emit('pageChange', currentPage + 1)" :disabled="currentPage === totalPages">
      Next
    </button>
    <button @click="emit('pageChange', totalPages)" :disabled="currentPage === totalPages">
      Last
    </button>

    <span class="page-info">
      ({{ totalRows }} rows)
    </span>

    <select :value="pageSize" @change="handlePageSizeChange">
      <option v-for="size in sortedPageSizeOptions" :key="size" :value="size">{{ size }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  currentPage: number
  pageSize: number
  totalRows: number
  pageSizeOptions?: number[]
}>(), {
  pageSizeOptions: () => [50, 100, 200, 500]
})

const emit = defineEmits<{
  pageChange: [page: number]
  pageSizeChange: [size: number]
}>()

// Sort options from smallest to largest for display
// If current pageSize is not in the options, include it (but only while it's the current value)
const sortedPageSizeOptions = computed(() => {
  const options = [...props.pageSizeOptions]

  // Add current pageSize if not in options (will be removed from list once user changes to another value)
  if (!options.includes(props.pageSize)) {
    options.push(props.pageSize)
  }

  return options.sort((a, b) => a - b)
})

const totalPages = computed(() => Math.ceil(props.totalRows / props.pageSize))

// Generate visible page numbers - intelligently distribute max 20 pages across range
// If total <= 20: show all pages (1 2 3 4 ... 20)
// If total > 20: distribute evenly (1 6 11 16 21 26 ... 96)
// Always include: first, last, and current page
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  const maxVisible = 20

  if (total <= maxVisible) {
    // Show all pages if 20 or fewer
    const pages: number[] = []
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
    return pages
  }

  // Calculate step size to show ~20 pages distributed across range
  const step = Math.ceil(total / maxVisible)
  const pages = new Set<number>()

  // Always add first and last page
  pages.add(1)
  pages.add(total)

  // Always add current page and neighbors
  pages.add(current)
  if (current > 1) pages.add(current - 1)
  if (current < total) pages.add(current + 1)

  // Add evenly distributed pages
  for (let i = 1; i <= total; i += step) {
    pages.add(i)
  }

  // Convert to sorted array
  return Array.from(pages).sort((a, b) => a - b)
})

function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('pageSizeChange', Number(target.value))
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: var(--dg-ui-pagination-bg, #f5f5f5);
  color: var(--dg-ui-pagination-fg, #212529);
  border-top: 1px solid var(--dg-ui-pagination-border, #ccc);
}

button {
  padding: 6px 12px;
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: var(--dg-ui-pagination-button-hover-bg, #1976d2);
}

button:disabled {
  background-color: var(--dg-cell-disabled-bg, #ccc);
  color: var(--dg-cell-disabled-fg, #6c757d);
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto; /* Allow horizontal scroll if many pages */
  max-width: 600px; /* Limit width, will scroll if more pages */
  padding: 2px 0; /* Padding for scrollbar */
}

.page-number {
  min-width: 36px;
  padding: 6px 8px;
  background-color: var(--dg-ui-pagination-bg, #ffffff);
  color: var(--dg-ui-pagination-fg, #212529);
  border: 1px solid var(--dg-ui-pagination-border, #ccc);
  border-radius: 4px;
}

.page-number:hover:not(:disabled):not(.active) {
  background-color: var(--dg-ui-pagination-button-hover-bg, #e3f2fd);
  color: var(--dg-header-sort-indicator, #2196f3);
}

.page-number.active {
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  font-weight: bold;
  border-color: var(--dg-header-sort-indicator, #2196f3);
}

.page-info {
  margin: 0 8px;
  font-size: 14px;
  color: var(--dg-ui-pagination-fg, #666);
}

select {
  padding: 6px 8px;
  border: 1px solid var(--dg-ui-pagination-border, #ccc);
  background-color: var(--dg-ui-pagination-bg, #ffffff);
  color: var(--dg-ui-pagination-fg, #212529);
  border-radius: 4px;
  font-size: 14px;
}
</style>
