<template>
  <div class="search-panel" :class="{ 'search-panel--collapsed': isCollapsed }">
    <div class="search-panel__header">
      <button
        class="search-panel__toggle"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Expand search' : 'Collapse search'"
      >
        {{ isCollapsed ? '▶' : '▼' }}
      </button>
      <span class="search-panel__title">Search</span>
      <span v-if="store.searchResults?.length > 0" class="search-panel__count">
        {{ store.searchResults.length }} result(s)
      </span>
    </div>

    <div v-if="!isCollapsed" class="search-panel__content">
      <div class="search-panel__row">
        <input
          v-model="searchQuery"
          type="text"
          class="search-panel__input"
          placeholder="Enter search query..."
          @input="handleSearch"
        />

        <select
          v-model="searchMode"
          class="search-panel__mode-select"
          @change="handleSearch"
        >
          <option value="Exact">Exact</option>
          <option value="Contains">Contains</option>
          <option value="StartsWith">Starts With</option>
          <option value="EndsWith">Ends With</option>
          <option value="Regex">Regex</option>
          <option value="Fuzzy">Fuzzy</option>
        </select>

        <button
          class="search-panel__clear-btn"
          @click="handleClearSearch"
          :disabled="!searchQuery"
          title="Clear search"
        >
          ✕
        </button>
      </div>

      <div class="search-panel__options">
        <label class="search-panel__checkbox">
          <input
            v-model="caseSensitive"
            type="checkbox"
            @change="handleSearch"
          />
          <span>Case sensitive</span>
        </label>

        <label v-if="searchMode === 'Fuzzy'" class="search-panel__threshold">
          <span>Threshold: {{ fuzzyThreshold }}</span>
          <input
            v-model.number="fuzzyThreshold"
            type="range"
            min="0"
            max="10"
            step="1"
            class="search-panel__slider"
            @input="handleSearch"
          />
        </label>
      </div>

      <!-- Search Results Summary -->
      <div v-if="searchQuery && store.searchResults?.length > 0" class="search-panel__results">
        <div class="search-panel__navigation">
          <button
            class="search-panel__nav-btn"
            @click="goToPreviousResult"
            :disabled="currentResultIndex <= 0"
            title="Previous result"
          >
            ↑
          </button>
          <span class="search-panel__nav-info">
            {{ currentResultIndex + 1 }} / {{ store.searchResults.length }}
          </span>
          <button
            class="search-panel__nav-btn"
            @click="goToNextResult"
            :disabled="currentResultIndex >= store.searchResults.length - 1"
            title="Next result"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useDataGridStore } from '@/stores/dataGridStore'
import { useSearch, type SearchMode } from '@/composables/useSearch'

const props = defineProps<{
  visible?: boolean
  gridId?: string
}>()

const store = useDataGridStore(props.gridId || 'dataGrid')
const { searchInRows, goToNextResult, goToPreviousResult, currentResultIndex } = useSearch(toRef(store, 'rows'))

const isCollapsed = ref(false)
const searchQuery = ref('')
const searchMode = ref<SearchMode>('Contains')
const caseSensitive = ref(false)
const fuzzyThreshold = ref(3)

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim()) {
    searchInRows(
      searchQuery.value,
      searchMode.value,
      {
        caseSensitive: caseSensitive.value,
        fuzzyThreshold: fuzzyThreshold.value
      }
    )
    store.setSearchQuery(searchQuery.value)
  } else {
    store.clearSearch()
  }
}, 300)

function handleSearch() {
  debouncedSearch()
}

function handleClearSearch() {
  searchQuery.value = ''
  store.clearSearch()
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
</script>

<style scoped>
.search-panel {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px;
  transition: all 0.2s ease;
}

.search-panel--collapsed {
  padding: 8px 12px;
}

.search-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-panel__toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  color: #6c757d;
  transition: color 0.2s;
}

.search-panel__toggle:hover {
  color: #212529;
}

.search-panel__title {
  font-weight: 600;
  color: #212529;
  font-size: 14px;
}

.search-panel__count {
  margin-left: auto;
  font-size: 12px;
  color: #6c757d;
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
}

.search-panel__content {
  margin-top: 12px;
}

.search-panel__row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-panel__input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-panel__input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.search-panel__mode-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
  min-width: 130px;
}

.search-panel__mode-select:focus {
  border-color: #0d6efd;
}

.search-panel__clear-btn {
  padding: 8px 12px;
  border: 1px solid #dc3545;
  background-color: white;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.search-panel__clear-btn:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
}

.search-panel__clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-panel__options {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.search-panel__checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #495057;
  cursor: pointer;
}

.search-panel__checkbox input[type="checkbox"] {
  cursor: pointer;
}

.search-panel__threshold {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #495057;
}

.search-panel__slider {
  width: 120px;
  cursor: pointer;
}

.search-panel__results {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #dee2e6;
}

.search-panel__navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.search-panel__nav-btn {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.search-panel__nav-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #0d6efd;
  color: #0d6efd;
}

.search-panel__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-panel__nav-info {
  font-size: 13px;
  color: #495057;
  min-width: 80px;
  text-align: center;
}
</style>
