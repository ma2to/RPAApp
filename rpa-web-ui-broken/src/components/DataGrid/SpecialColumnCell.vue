<template>
  <div
    class="special-cell"
    :class="specialCellClasses"
    :style="cellStyle"
    @mousedown.stop
    @mouseenter.stop
  >
    <!-- Row Number Column -->
    <span v-if="specialType === 'RowNumber'" class="row-number">
      {{ rowNumber }}
    </span>

    <!-- Checkbox Column -->
    <input
      v-else-if="specialType === 'Checkbox'"
      type="checkbox"
      class="checkbox-input"
      :checked="isChecked"
      @change="handleCheckboxChange"
    />

    <!-- Validation Alerts Column -->
    <div
      v-else-if="specialType === 'ValidationAlerts'"
      class="validation-alerts"
      :class="{ 'has-errors': hasValidationErrors || hasValidationWarnings }"
      :title="validationMessage"
    >
      <span class="validation-message">
        {{ validationMessage }}
      </span>
    </div>

    <!-- Delete Row Button -->
    <button
      v-else-if="specialType === 'DeleteRow'"
      class="delete-button"
      :disabled="isDeleting"
      @click="handleDelete"
      title="Delete row"
    >
      🗑️
    </button>

    <!-- Insert Row Button -->
    <button
      v-else-if="specialType === 'InsertRow'"
      class="insert-button"
      @click="handleInsert"
      title="Insert new row"
    >
      ➕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import type { GridColumn } from '@/stores/dataGridStore'

export type SpecialColumnType = 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow'

const props = defineProps<{
  specialType: SpecialColumnType
  rowId: string
  rowIndex: number
  column: GridColumn
  isChecked?: boolean
}>()

const emit = defineEmits<{
  checkboxChange: [rowId: string, checked: boolean]
  deleteRow: [rowId: string]
  insertRow: [afterRowId: string]
}>()

// Debug: Watch isChecked prop changes
watch(() => props.isChecked, (newVal, oldVal) => {
  if (props.specialType === 'Checkbox') {
    console.log('[SpecialColumnCell] isChecked prop changed:', { rowId: props.rowId, newVal, oldVal })
  }
}, { immediate: true })

// Inject validation from parent DataGrid component
const validation = inject('validation', null) as ReturnType<typeof import('@/composables/useValidation').useValidation> | null
// validationErrors is now reactive<Record<>> instead of ref<Map<>>
const validationErrors = validation?.validationErrors || {}

const isDeleting = ref(false)
const lastDeleteClick = ref(0)
const DELETE_DEBOUNCE_MS = 300

const rowNumber = computed(() => props.rowIndex + 1)

const validationErrorsForRow = computed(() => {
  return validationErrors[props.rowId] || []
})

const hasValidationErrors = computed(() => {
  return validationErrorsForRow.value.some((e: any) => e.severity === 'Error' || e.severity === 'Critical')
})

const hasValidationWarnings = computed(() => {
  return validationErrorsForRow.value.some((e: any) => e.severity === 'Warning')
})

// Format validation messages like in original component: "columnName: message; columnName2: message2"
const validationMessage = computed(() => {
  const allErrors = validationErrorsForRow.value
  if (allErrors.length === 0) return ''

  // Join all errors with semicolon (like original component)
  return allErrors
    .map((e: any) => `${e.columnName}: ${e.message}`)
    .join('; ')
})

const specialCellClasses = computed(() => ({
  'special-cell--row-number': props.specialType === 'RowNumber',
  'special-cell--checkbox': props.specialType === 'Checkbox',
  'special-cell--validation': props.specialType === 'ValidationAlerts',
  'special-cell--delete': props.specialType === 'DeleteRow',
  'special-cell--insert': props.specialType === 'InsertRow',
}))

const cellStyle = computed(() => {
  // CSS Grid handles column widths via grid-template-columns
  // No need for flexbox properties
  return {}
})

function handleCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  console.log('[SpecialColumnCell] Checkbox change:', { rowId: props.rowId, checked: target.checked, currentProp: props.isChecked })
  emit('checkboxChange', props.rowId, target.checked)
}

function handleDelete() {
  // Debounce protection - prevent rapid clicks
  const now = Date.now()
  if (now - lastDeleteClick.value < DELETE_DEBOUNCE_MS) {
    return
  }
  lastDeleteClick.value = now

  if (confirm('Are you sure you want to delete this row?')) {
    isDeleting.value = true
    emit('deleteRow', props.rowId)

    // Reset deleting state after 1 second
    setTimeout(() => {
      isDeleting.value = false
    }, 1000)
  }
}

function handleInsert() {
  emit('insertRow', props.rowId)
}
</script>

<style scoped>
.special-cell {
  position: relative;
  padding: 4px 8px;
  border-right: 1px solid var(--dg-border-cell, #e0e0e0);
  display: flex;
  align-items: flex-start; /* Changed from center to flex-start for multi-line content */
  justify-content: center;
  background-color: var(--dg-special-rownumber-bg, #f5f5f5);
  height: 100%;
  min-height: 100%;
  width: 100%; /* CRITICAL: Fill grid track width */
  max-width: 100%; /* CRITICAL: Never exceed grid track width */
  box-sizing: border-box;
  overflow: hidden; /* CRITICAL: Hide all overflow */
  overflow-x: hidden !important; /* Prevent horizontal overflow */
  overflow-y: hidden !important; /* Hide scrollbars */
  /* Remove all scrollbars - all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* Hide scrollbars for webkit browsers */
.special-cell::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* Remove all webkit scrollbar parts */
.special-cell::-webkit-scrollbar-button,
.special-cell::-webkit-scrollbar-track,
.special-cell::-webkit-scrollbar-thumb,
.special-cell::-webkit-scrollbar-corner {
  display: none !important;
}

/* Remove Mozilla scrollbar buttons */
.special-cell::-moz-scrollbar-button {
  display: none !important;
}

.special-cell--row-number {
  color: var(--dg-special-rownumber-fg, #666);
  font-weight: 500;
  user-select: none;
}

.special-cell--checkbox {
  cursor: pointer;
  background-color: var(--dg-special-checkbox-bg, #ffffff);
}

.checkbox-input {
  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid var(--dg-special-checkbox-border, #ced4da);
}

.special-cell--validation {
  padding: 0;
}

.validation-alerts {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%; /* CRITICAL: Never exceed parent width */
  height: 100%;
  padding: 4px 8px;
  overflow: hidden; /* CRITICAL: Clip content that exceeds bounds */
  box-sizing: border-box; /* Include padding in width calculation */
}

.validation-alerts.has-errors {
  background-color: var(--dg-special-validation-error-bg, #ffebee);
}

.validation-message {
  font-size: 11px;
  color: var(--dg-special-validation-error-fg, #c62828);
  /* CHANGED: Allow text wrapping instead of ellipsis for AutoRowHeight support */
  white-space: pre-wrap; /* Wrap text and preserve spaces */
  word-wrap: break-word; /* Break long words */
  overflow-wrap: break-word; /* Modern CSS property for word breaking */
  display: block;
  width: 100%;
  max-width: 100%; /* CRITICAL: Never exceed parent width */
  min-width: 0; /* CRITICAL: Allow flex item to shrink below content size */
  line-height: 1.5; /* Match DataGridCell line-height */
  box-sizing: border-box;
}

.validation-icon {
  font-size: 18px;
  cursor: help;
}

.validation-icon.error {
  color: var(--dg-validation-error-fg, #ff4444);
}

.validation-icon.warning {
  color: var(--dg-validation-warning-fg, #ff9800);
}

.delete-button,
.insert-button {
  border: none;
  background: var(--dg-special-delete-bg, transparent);
  color: var(--dg-special-delete-fg, #dc3545);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 4px;
  transition: transform 0.1s, background-color 0.1s;
  /* Remove browser default styling and controls */
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  outline: none;
  /* Remove all scrollbars and arrows */
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Remove webkit scrollbar and all related controls from buttons */
.delete-button::-webkit-scrollbar,
.insert-button::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.delete-button::-webkit-scrollbar-button,
.delete-button::-webkit-scrollbar-track,
.delete-button::-webkit-scrollbar-thumb,
.delete-button::-webkit-scrollbar-corner,
.insert-button::-webkit-scrollbar-button,
.insert-button::-webkit-scrollbar-track,
.insert-button::-webkit-scrollbar-thumb,
.insert-button::-webkit-scrollbar-corner {
  display: none !important;
}

/* Remove webkit number input spinners (just in case) */
.delete-button::-webkit-outer-spin-button,
.delete-button::-webkit-inner-spin-button,
.insert-button::-webkit-outer-spin-button,
.insert-button::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
  display: none !important;
}

/* Remove Mozilla scrollbar buttons */
.delete-button::-moz-scrollbar-button,
.insert-button::-moz-scrollbar-button {
  display: none !important;
}

.delete-button:hover:not(:disabled) {
  transform: scale(1.2);
  background-color: var(--dg-special-delete-hover-bg, #ffebee);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.insert-button {
  background: var(--dg-special-insert-bg, transparent);
  color: var(--dg-special-insert-fg, #28a745);
}

.insert-button:hover {
  transform: scale(1.2);
  background-color: var(--dg-special-insert-hover-bg, #e8f5e9);
  color: var(--dg-special-insert-hover-fg, #1b5e20);
}

.insert-button:active,
.delete-button:active {
  transform: scale(0.95);
}
</style>
