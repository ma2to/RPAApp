<template>
  <teleport to="body">
    <div v-if="visible" class="filter-flyout-overlay" @click.self="handleClose">
      <div class="filter-flyout" :style="{ top: position.y + 'px', left: position.x + 'px' }">
        <!-- Header -->
        <div class="filter-header">
          <h3 class="filter-title">Filter: {{ columnName }}</h3>
          <button class="close-button" @click="handleClose">✕</button>
        </div>

        <!-- Mode selector -->
        <div class="filter-mode">
          <label>
            <input
              type="radio"
              :value="'checkbox'"
              v-model="filterMode"
              name="filterMode"
            />
            <span>Checkbox</span>
          </label>
          <label>
            <input
              type="radio"
              :value="'regex'"
              v-model="filterMode"
              name="filterMode"
            />
            <span>Regex</span>
          </label>
        </div>

        <!-- Checkbox mode content -->
        <div v-if="filterMode === 'checkbox'" class="filter-content">
          <!-- Search box for filtering values -->
          <input
            v-model="searchText"
            type="text"
            class="filter-search"
            placeholder="Search values..."
          />

          <!-- Select All / Deselect All buttons -->
          <div class="filter-actions">
            <button class="action-button" @click="selectAll">Select All</button>
            <button class="action-button" @click="deselectAll">Deselect All</button>
          </div>

          <!-- Values list with checkboxes -->
          <div class="filter-values">
            <label
              v-for="item in filteredValues"
              :key="item.value"
              class="value-item"
              :class="{ 'value-item--selected': item.isSelected }"
            >
              <input
                type="checkbox"
                v-model="item.isSelected"
                class="value-checkbox"
              />
              <span class="value-text">{{ item.displayText || displayText(item) }}</span>
            </label>

            <div v-if="filteredValues.length === 0" class="no-values">
              No values found
            </div>
          </div>
        </div>

        <!-- Regex mode content -->
        <div v-else class="filter-content">
          <label class="regex-label">
            <span>Regex Pattern:</span>
            <input
              v-model="regexPattern"
              type="text"
              class="regex-input"
              placeholder="^test.*|.*example$"
            />
          </label>

          <div class="regex-help">
            <details>
              <summary>Regex Examples</summary>
              <ul>
                <li><code>^test</code> - Starts with "test"</li>
                <li><code>example$</code> - Ends with "example"</li>
                <li><code>^test.*example$</code> - Starts with "test" and ends with "example"</li>
                <li><code>test|example</code> - Contains "test" OR "example"</li>
                <li><code>\d{3}</code> - Contains exactly 3 digits</li>
              </ul>
            </details>
          </div>
        </div>

        <!-- Footer buttons -->
        <div class="filter-footer">
          <button class="footer-button footer-button--apply" @click="handleApply">
            Apply Filter
          </button>
          <button class="footer-button footer-button--clear" @click="handleClear">
            Clear Filter
          </button>
          <button class="footer-button footer-button--cancel" @click="handleClose">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface FilterValue {
  value: string
  isSelected: boolean
  count: number
  displayText?: string
}

const props = defineProps<{
  visible: boolean
  columnName: string
  position: { x: number; y: number }
  uniqueValues: FilterValue[]
  currentMode?: 'checkbox' | 'regex'
  currentPattern?: string
}>()

const emit = defineEmits<{
  close: []
  applyCheckbox: [selectedValues: string[]]
  applyRegex: [pattern: string]
  clearFilter: []
}>()

// Local state
const filterMode = ref<'checkbox' | 'regex'>(props.currentMode || 'checkbox')
const searchText = ref('')
const regexPattern = ref(props.currentPattern || '')
const values = ref<FilterValue[]>([])

// Watch for prop changes
watch(() => props.uniqueValues, (newValues) => {
  values.value = newValues.map(v => ({ ...v }))
}, { immediate: true, deep: true })

watch(() => props.currentPattern, (newPattern) => {
  if (newPattern) {
    regexPattern.value = newPattern
  }
}, { immediate: true })

// Computed: filtered values based on search text
const filteredValues = computed(() => {
  if (!searchText.value) {
    return values.value
  }

  const search = searchText.value.toLowerCase()
  return values.value.filter(item =>
    item.value.toLowerCase().includes(search)
  )
})

// Computed: display text with count
const displayText = (item: FilterValue) => {
  return item.count > 0 ? `${item.value} (${item.count})` : item.value
}

// Methods
function selectAll() {
  filteredValues.value.forEach(item => {
    item.isSelected = true
  })
}

function deselectAll() {
  filteredValues.value.forEach(item => {
    item.isSelected = false
  })
}

function handleApply() {
  if (filterMode.value === 'checkbox') {
    const selectedValues = values.value
      .filter(item => item.isSelected)
      .map(item => item.value)

    emit('applyCheckbox', selectedValues)
  } else {
    emit('applyRegex', regexPattern.value)
  }

  handleClose()
}

function handleClear() {
  emit('clearFilter')
  handleClose()
}

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.filter-flyout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-flyout {
  position: fixed;
  background-color: var(--dg-ui-dialog-bg, white);
  color: var(--dg-ui-dialog-fg, #212529);
  border: 1px solid var(--dg-ui-dialog-border, #ccc);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 480px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dg-border-cell, #e0e0e0);
  background-color: var(--dg-header-bg, #f5f5f5);
}

.filter-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--dg-header-fg, #212529);
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dg-ui-dialog-fg, #666);
  border-radius: 4px;
}

.close-button:hover {
  background-color: var(--dg-cell-hover-bg, #e0e0e0);
  color: var(--dg-ui-dialog-fg, #000);
}

.filter-mode {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dg-border-cell, #e0e0e0);
}

.filter-mode label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.filter-mode input[type="radio"] {
  cursor: pointer;
}

.filter-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 200px;
}

.filter-search {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--dg-ui-filter-border, #ccc);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--dg-ui-filter-bg, white);
  color: var(--dg-ui-filter-fg, #212529);
  margin-bottom: 12px;
}

.filter-search:focus {
  outline: none;
  border-color: var(--dg-border-focused-cell, #2196f3);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.action-button {
  flex: 1;
  padding: 6px 12px;
  background-color: var(--dg-ui-pagination-bg, #f8f9fa);
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: var(--dg-ui-pagination-fg, #212529);
}

.action-button:hover {
  background-color: var(--dg-cell-hover-bg, #e9ecef);
}

.filter-values {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--dg-border-cell, #e0e0e0);
  border-radius: 4px;
  background-color: var(--dg-cell-bg, white);
}

.value-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--dg-border-cell, #f0f0f0);
  font-size: 14px;
}

.value-item:last-child {
  border-bottom: none;
}

.value-item:hover {
  background-color: var(--dg-cell-hover-bg, #f8f9fa);
}

.value-item--selected {
  background-color: var(--lb-item-selected-bg, #e3f2fd);
}

.value-checkbox {
  cursor: pointer;
}

.value-text {
  flex: 1;
}

.no-values {
  text-align: center;
  padding: 24px;
  color: var(--dg-ui-placeholder, #999);
  font-size: 14px;
}

.regex-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.regex-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--dg-ui-filter-border, #ccc);
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  background-color: var(--dg-ui-filter-bg, white);
  color: var(--dg-ui-filter-fg, #212529);
}

.regex-input:focus {
  outline: none;
  border-color: var(--dg-border-focused-cell, #2196f3);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.regex-help {
  margin-top: 16px;
  font-size: 13px;
}

.regex-help details {
  background-color: var(--dg-ui-menu-bg, #f8f9fa);
  border: 1px solid var(--dg-border-cell, #e0e0e0);
  border-radius: 4px;
  padding: 8px;
}

.regex-help summary {
  cursor: pointer;
  font-weight: 500;
  color: var(--dg-header-sort-indicator, #2196f3);
}

.regex-help ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.regex-help li {
  margin: 4px 0;
}

.regex-help code {
  background-color: var(--dg-cell-bg, #e9ecef);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}

.filter-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--dg-border-cell, #e0e0e0);
  background-color: var(--dg-ui-pagination-bg, #f8f9fa);
}

.footer-button {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.footer-button--apply {
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  border-color: var(--dg-header-sort-indicator, #2196f3);
}

.footer-button--apply:hover {
  background-color: #1976d2;
  border-color: #1976d2;
}

.footer-button--clear {
  background-color: var(--dg-validation-warning-bg, #fff3cd);
  color: var(--dg-validation-warning-fg, #856404);
  border-color: var(--dg-validation-warning-border, #ffc107);
}

.footer-button--clear:hover {
  background-color: #ffe69c;
}

.footer-button--cancel {
  background-color: var(--dg-ui-pagination-bg, #f8f9fa);
  color: var(--dg-ui-pagination-fg, #212529);
}

.footer-button--cancel:hover {
  background-color: var(--dg-cell-hover-bg, #e9ecef);
}

/* Scrollbar styling */
.filter-values::-webkit-scrollbar,
.filter-content::-webkit-scrollbar {
  width: 8px;
}

.filter-values::-webkit-scrollbar-track,
.filter-content::-webkit-scrollbar-track {
  background: var(--lb-scrollbar-track-bg, #f1f1f1);
  border-radius: 4px;
}

.filter-values::-webkit-scrollbar-thumb,
.filter-content::-webkit-scrollbar-thumb {
  background: var(--lb-scrollbar-thumb-bg, #c1c1c1);
  border-radius: 4px;
}

.filter-values::-webkit-scrollbar-thumb:hover,
.filter-content::-webkit-scrollbar-thumb:hover {
  background: var(--lb-scrollbar-thumb-hover-bg, #a8a8a8);
}
</style>
