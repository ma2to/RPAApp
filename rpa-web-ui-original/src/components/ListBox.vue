<template>
  <div class="listbox-container">
    <div v-if="title" class="listbox-title">{{ title }}</div>
    <div
      class="listbox"
      :class="{ 'listbox--multi': multiSelect }"
      :style="listboxStyle"
    >
      <div
        v-for="item in items"
        :key="item.value"
        class="listbox-item"
        :class="{
          'listbox-item--selected': isSelected(item.value),
          'listbox-item--hover': hoveredValue === item.value
        }"
        @click="handleItemClick(item)"
        @mouseenter="hoveredValue = item.value"
        @mouseleave="hoveredValue = null"
      >
        <input
          v-if="multiSelect"
          type="checkbox"
          :checked="isSelected(item.value)"
          class="listbox-checkbox"
          @click.stop="handleItemClick(item)"
        />
        <span class="listbox-item-text">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { generateListBoxCSSVariables, defaultListBoxTheme } from '@/composables/useTheme'
import type { ListBoxTheme } from '@/types/theme'

export interface ListBoxItem {
  name: string
  value: string
}

const props = withDefaults(defineProps<{
  items: ListBoxItem[]
  title?: string
  multiSelect?: boolean
  preSelected?: string[]
  height?: number
  width?: number
  theme?: Partial<ListBoxTheme>  // Optional theme customization
}>(), {
  title: '',
  multiSelect: false,
  preSelected: () => [],
  height: 200,
  width: 250
})

const emit = defineEmits<{
  selectionChange: [selectedValues: string[]]
}>()

const selectedValues = ref<Set<string>>(new Set())
const hoveredValue = ref<string | null>(null)

// Initialize with pre-selected items
watch(() => props.preSelected, (newPreSelected) => {
  selectedValues.value = new Set(newPreSelected)
}, { immediate: true })

// Merge theme with defaults
const mergedTheme = computed(() => {
  return {
    ...defaultListBoxTheme,
    itemColors: { ...defaultListBoxTheme.itemColors, ...(props.theme?.itemColors || {}) },
    containerColors: { ...defaultListBoxTheme.containerColors, ...(props.theme?.containerColors || {}) },
    checkboxColors: { ...defaultListBoxTheme.checkboxColors, ...(props.theme?.checkboxColors || {}) },
    scrollbarColors: { ...defaultListBoxTheme.scrollbarColors, ...(props.theme?.scrollbarColors || {}) }
  }
})

// Generate CSS variables from theme
const cssVariables = computed(() => generateListBoxCSSVariables(mergedTheme.value))

const listboxStyle = computed(() => ({
  height: `${props.height}px`,
  width: `${props.width}px`,
  ...cssVariables.value
}))

function isSelected(value: string): boolean {
  return selectedValues.value.has(value)
}

function handleItemClick(item: ListBoxItem) {
  if (props.multiSelect) {
    // Multi-select: toggle selection
    if (selectedValues.value.has(item.value)) {
      selectedValues.value.delete(item.value)
    } else {
      selectedValues.value.add(item.value)
    }
  } else {
    // Single-select: clear previous and select this one
    selectedValues.value.clear()
    selectedValues.value.add(item.value)
  }

  // Emit selection change
  emit('selectionChange', Array.from(selectedValues.value))
}

// Expose selected values for programmatic access
defineExpose({
  getSelectedValues: () => Array.from(selectedValues.value),
  clearSelection: () => {
    selectedValues.value.clear()
    emit('selectionChange', [])
  },
  selectValue: (value: string) => {
    if (props.multiSelect) {
      selectedValues.value.add(value)
    } else {
      selectedValues.value.clear()
      selectedValues.value.add(value)
    }
    emit('selectionChange', Array.from(selectedValues.value))
  }
})
</script>

<style scoped>
.listbox-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.listbox-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--lb-title-fg, #212529);
  padding-bottom: 4px;
}

.listbox {
  border: 1px solid var(--lb-container-border, #ced4da);
  border-radius: 4px;
  overflow-y: auto;
  overflow-x: auto; /* Enable horizontal scroll when content is wider than container */
  background-color: var(--lb-container-bg, white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.listbox:focus-within {
  border-color: var(--lb-container-focused-border, #0d6efd);
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.listbox-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid var(--lb-container-border, #f0f0f0);
  background-color: var(--lb-item-bg, #ffffff);
  color: var(--lb-item-fg, #212529);
}

.listbox-item:last-child {
  border-bottom: none;
}

.listbox-item--hover {
  background-color: var(--lb-item-hover-bg, #f8f9fa);
  color: var(--lb-item-hover-fg, #212529);
}

.listbox-item--selected {
  background-color: var(--lb-item-selected-bg, #e3f2fd);
  color: var(--lb-item-selected-fg, #0d6efd);
  border-left: 3px solid var(--lb-container-focused-border, #2196f3);
  padding-left: 9px;
}

.listbox-item--selected.listbox-item--hover {
  background-color: var(--lb-item-selected-hover-bg, #bbdefb);
  color: var(--lb-item-selected-hover-fg, #0d6efd);
}

.listbox-checkbox {
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid var(--lb-checkbox-border, #ced4da);
  background-color: var(--lb-checkbox-bg, #ffffff);
}

.listbox-checkbox:checked {
  background-color: var(--lb-checkbox-checked-bg, #0d6efd);
  border-color: var(--lb-checkbox-checked-border, #0d6efd);
}

.listbox-checkbox:hover {
  border-color: var(--lb-checkbox-hover-border, #adb5bd);
}

.listbox-item-text {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.listbox-item--selected .listbox-item-text {
  font-weight: 500;
}

/* Scrollbar styling */
.listbox::-webkit-scrollbar {
  width: 8px;
  height: 8px; /* Height for horizontal scrollbar */
}

.listbox::-webkit-scrollbar-track {
  background: var(--lb-scrollbar-track-bg, #f1f1f1);
  border-radius: 4px;
}

.listbox::-webkit-scrollbar-thumb {
  background: var(--lb-scrollbar-thumb-bg, #c1c1c1);
  border-radius: 4px;
}

.listbox::-webkit-scrollbar-thumb:hover {
  background: var(--lb-scrollbar-thumb-hover-bg, #a8a8a8);
}
</style>
