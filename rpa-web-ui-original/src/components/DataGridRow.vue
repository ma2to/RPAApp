<template>
  <div class="grid-row" :style="{ height: row.height + 'px', gridTemplateColumns }">
    <template v-for="column in columns" :key="`${row.rowId}:${column.name}`">
      <!-- Special Column Cell -->
      <SpecialColumnCell
        v-if="column.specialType"
        :special-type="column.specialType"
        :row-id="row.rowId"
        :row-index="row.rowIndex"
        :column="column"
        :is-checked="column.specialType === 'Checkbox' ? isRowCheckedComputed : undefined"
        @checkbox-change="handleCheckboxChange"
        @delete-row="handleDeleteRow"
        @insert-row="handleInsertRow"
      />

      <!-- Regular Data Cell -->
      <DataGridCell
        v-else
        :cell="getCellForColumn(column.name)"
        :column="column"
        :is-selected="store.isCellSelected(row.rowId, column.name)"
        :grid-id="gridId"
        @edit-complete="handleEditComplete"
        @cell-input="handleCellInput"
        @insert-above="handleInsertAbove"
        @insert-below="handleInsertBelow"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataGridCell from './DataGridCell.vue'
import SpecialColumnCell from './SpecialColumnCell.vue'
import { useDataGridStore, type GridRow, type GridColumn, type GridCell } from '@/stores/dataGridStore'

const props = defineProps<{
  row: GridRow
  columns: GridColumn[]
  gridTemplateColumns: string
  gridId?: string
}>()

const emit = defineEmits<{
  cellEditComplete: [rowId: string, columnName: string, value: any]
  cellInput: [rowId: string, columnName: string, value: any]
  checkboxChange: [rowId: string, checked: boolean]
  deleteRow: [rowId: string]
  insertRow: [afterRowId: string]
  insertAbove: [rowId: string, count: number]
  insertBelow: [rowId: string, count: number]
}>()

const store = useDataGridStore(props.gridId)

// Log checkbox state for debugging
const isRowCheckedComputed = computed(() => {
  const checked = store.isRowChecked(props.row.rowId)
  console.log('[DataGridRow] Row checked state:', { rowId: props.row.rowId, checked })
  return checked
})

function getCellForColumn(columnName: string): GridCell {
  const cell = props.row.cells.find(c => c.columnName === columnName)

  // If cell doesn't exist for this column, return a placeholder
  if (!cell) {
    return {
      rowId: props.row.rowId,
      columnName: columnName,
      value: null,
      isSelected: false,
      isValidationError: false
    }
  }

  return cell
}

function handleEditComplete(rowId: string, columnName: string, value: any) {
  emit('cellEditComplete', rowId, columnName, value)
}

function handleCellInput(rowId: string, columnName: string, value: any) {
  emit('cellInput', rowId, columnName, value)
}

function handleCheckboxChange(rowId: string, checked: boolean) {
  emit('checkboxChange', rowId, checked)
}

function handleDeleteRow(rowId: string) {
  emit('deleteRow', rowId)
}

function handleInsertRow(afterRowId: string) {
  emit('insertRow', afterRowId)
}

function handleInsertAbove(rowId: string, count: number) {
  emit('insertAbove', rowId, count)
}

function handleInsertBelow(rowId: string, count: number) {
  emit('insertBelow', rowId, count)
}
</script>

<style scoped>
.grid-row {
  display: grid; /* Changed from flex to grid for perfect column alignment */
  /* grid-template-columns applied via inline style from parent */
  border-bottom: 1px solid #e0e0e0;
  width: 100%; /* CRITICAL: Always fill container width */
  max-width: 100%; /* CRITICAL: Never exceed container width */
  /* REMOVED min-width: fit-content - this was causing each row to calculate 1fr differently! */
  /* All rows MUST have identical width for 1fr to resolve to same pixels */
}

.grid-row:hover {
  background-color: #fafafa;
}
</style>
