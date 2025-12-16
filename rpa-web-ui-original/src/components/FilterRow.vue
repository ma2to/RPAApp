<template>
  <div class="filter-row">
    <div class="filter-row__header">
      <button
        class="filter-row__toggle"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Expand filters' : 'Collapse filters'"
      >
        {{ isCollapsed ? '▶' : '▼' }}
      </button>
      <span class="filter-row__title">Filters</span>
      <span v-if="activeFiltersCount > 0" class="filter-row__count">
        {{ activeFiltersCount }} active
      </span>
      <button
        v-if="activeFiltersCount > 0"
        class="filter-row__clear-all"
        @click="clearAllFilters"
        title="Clear all filters"
      >
        Clear All
      </button>
    </div>

    <div v-if="!isCollapsed" class="filter-row__content">
      <!-- Filter Builder -->
      <div class="filter-row__filters">
        <div
          v-for="(filter, index) in columnFilters"
          :key="index"
          class="filter-row__filter-item"
        >
          <!-- Column Selector -->
          <select
            v-model="filter.columnName"
            class="filter-row__column-select"
            @change="updateFilters"
          >
            <option value="">Select column...</option>
            <option
              v-for="col in dataColumns"
              :key="col.name"
              :value="col.name"
            >
              {{ col.header }}
            </option>
          </select>

          <!-- Operator Selector -->
          <select
            v-model="filter.operator"
            class="filter-row__operator-select"
            @change="updateFilters"
          >
            <option value="Equals">Equals</option>
            <option value="NotEquals">Not Equals</option>
            <option value="Contains">Contains</option>
            <option value="StartsWith">Starts With</option>
            <option value="EndsWith">Ends With</option>
            <option value="GreaterThan">Greater Than</option>
            <option value="LessThan">Less Than</option>
            <option value="GreaterThanOrEquals">≥</option>
            <option value="LessThanOrEquals">≤</option>
            <option value="IsEmpty">Is Empty</option>
            <option value="IsNotEmpty">Is Not Empty</option>
          </select>

          <!-- Value Input (hide for IsEmpty/IsNotEmpty) -->
          <input
            v-if="!['IsEmpty', 'IsNotEmpty'].includes(filter.operator)"
            v-model="filter.value"
            type="text"
            class="filter-row__value-input"
            placeholder="Filter value..."
            @input="updateFilters"
          />

          <!-- Logic Operator (for next filter) -->
          <select
            v-if="index < columnFilters.length - 1"
            v-model="filter.logicOperator"
            class="filter-row__logic-select"
            @change="updateFilters"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>

          <!-- Remove Filter Button -->
          <button
            class="filter-row__remove-btn"
            @click="removeFilter(index)"
            title="Remove filter"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Add Filter Button -->
      <button
        class="filter-row__add-btn"
        @click="addFilter"
      >
        + Add Filter
      </button>

      <!-- Quick Filters (if any active) -->
      <div v-if="activeFiltersCount > 0" class="filter-row__active">
        <div class="filter-row__active-title">Active filters:</div>
        <div class="filter-row__active-list">
          <span
            v-for="(filter, index) in activeColumnFilters"
            :key="index"
            class="filter-row__active-chip"
          >
            {{ getColumnHeader(filter.columnName) }}
            <strong>{{ filter.operator }}</strong>
            <span v-if="filter.value">"{{ filter.value }}"</span>
            <button
              class="filter-row__chip-remove"
              @click="removeFilter(columnFilters.indexOf(filter))"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataGridStore } from '@/stores/dataGridStore'
import { type FilterOperator, type SimpleFilter } from '@/composables/useFiltering'

const props = defineProps<{
  gridId?: string
}>()

const store = useDataGridStore(props.gridId || 'dataGrid')

const isCollapsed = ref(false)

interface ColumnFilter {
  columnName: string
  operator: FilterOperator
  value: string
  logicOperator: 'AND' | 'OR'
}

const columnFilters = ref<ColumnFilter[]>([
  {
    columnName: '',
    operator: 'Contains',
    value: '',
    logicOperator: 'AND'
  }
])

const dataColumns = computed(() => {
  return store.columns.filter(col => !col.specialType)
})

const activeColumnFilters = computed(() => {
  return columnFilters.value.filter(f => f.columnName && (f.value || ['IsEmpty', 'IsNotEmpty'].includes(f.operator)))
})

const activeFiltersCount = computed(() => activeColumnFilters.value.length)

function addFilter() {
  columnFilters.value.push({
    columnName: '',
    operator: 'Contains',
    value: '',
    logicOperator: 'AND'
  })
}

function removeFilter(index: number) {
  columnFilters.value.splice(index, 1)

  // Ensure at least one empty filter exists
  if (columnFilters.value.length === 0) {
    addFilter()
  }

  updateFilters()
}

function clearAllFilters() {
  columnFilters.value = [
    {
      columnName: '',
      operator: 'Contains',
      value: '',
      logicOperator: 'AND'
    }
  ]
  store.clearFilter()
}

function updateFilters() {
  const active = activeColumnFilters.value

  if (active.length === 0) {
    store.clearFilter()
    return
  }

  // Build composite filter expression
  if (active.length === 1) {
    // Single filter
    const f = active[0]
    const simpleFilter: SimpleFilter = {
      type: 'simple',
      columnName: f.columnName,
      operator: f.operator,
      value: f.value
    }
    store.setFilter(simpleFilter)
  } else {
    // Multiple filters - build composite expression
    let filterExpression: any = {
      type: 'simple',
      columnName: active[0].columnName,
      operator: active[0].operator,
      value: active[0].value
    }

    for (let i = 1; i < active.length; i++) {
      const currentFilter = active[i]
      const previousLogicOp = active[i - 1].logicOperator

      filterExpression = {
        type: 'composite',
        operator: previousLogicOp,
        left: filterExpression,
        right: {
          type: 'simple',
          columnName: currentFilter.columnName,
          operator: currentFilter.operator,
          value: currentFilter.value
        }
      }
    }

    store.setFilter(filterExpression)
  }
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function getColumnHeader(columnName: string): string {
  const col = store.columns.find(c => c.name === columnName)
  return col?.header || columnName
}
</script>

<style scoped>
.filter-row {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px;
  transition: all 0.2s ease;
}

.filter-row__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-row__toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  color: #6c757d;
  transition: color 0.2s;
}

.filter-row__toggle:hover {
  color: #212529;
}

.filter-row__title {
  font-weight: 600;
  color: #212529;
  font-size: 14px;
}

.filter-row__count {
  margin-left: auto;
  font-size: 12px;
  color: #0d6efd;
  background-color: #e7f1ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.filter-row__clear-all {
  padding: 4px 12px;
  border: 1px solid #dc3545;
  background-color: white;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.filter-row__clear-all:hover {
  background-color: #dc3545;
  color: white;
}

.filter-row__content {
  margin-top: 12px;
}

.filter-row__filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-row__filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-row__column-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
  min-width: 150px;
}

.filter-row__column-select:focus {
  border-color: #0d6efd;
}

.filter-row__operator-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
  min-width: 130px;
}

.filter-row__operator-select:focus {
  border-color: #0d6efd;
}

.filter-row__value-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.filter-row__value-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.filter-row__logic-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  background-color: #e9ecef;
  cursor: pointer;
  outline: none;
  font-weight: 600;
  color: #495057;
  min-width: 80px;
}

.filter-row__logic-select:focus {
  border-color: #0d6efd;
}

.filter-row__remove-btn {
  padding: 8px 12px;
  border: 1px solid #dc3545;
  background-color: white;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-row__remove-btn:hover {
  background-color: #dc3545;
  color: white;
}

.filter-row__add-btn {
  margin-top: 8px;
  padding: 8px 16px;
  border: 1px dashed #0d6efd;
  background-color: white;
  color: #0d6efd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-row__add-btn:hover {
  background-color: #e7f1ff;
}

.filter-row__active {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #dee2e6;
}

.filter-row__active-title {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
  font-weight: 500;
}

.filter-row__active-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-row__active-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: #e7f1ff;
  color: #0d6efd;
  border-radius: 16px;
  font-size: 12px;
}

.filter-row__active-chip strong {
  font-weight: 600;
}

.filter-row__chip-remove {
  border: none;
  background: transparent;
  color: #0d6efd;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
  margin-left: 4px;
  transition: color 0.2s;
}

.filter-row__chip-remove:hover {
  color: #dc3545;
}
</style>
