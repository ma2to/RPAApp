import { ref, reactive, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { clog, cinfo, cerror, cwarn } from './useConditionalLogging'

export interface ValidationRule {
  columnName: string
  ruleType: 'Required' | 'Regex' | 'Range' | 'Custom'
  errorMessage: string
  regexPattern?: string
  minValue?: any
  maxValue?: any
  severity: 'Info' | 'Warning' | 'Error' | 'Critical'
  customValidator?: (value: any) => boolean
}

export interface ValidationError {
  rowId: string
  columnName: string
  message: string
  severity: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  severity?: string
}

export function useValidation() {
  // Each instance has its own validation state
  const validationRules = ref<Map<string, ValidationRule[]>>(new Map())
  // Use reactive object instead of ref<Map> for proper Vue reactivity
  const validationErrors = reactive<Record<string, ValidationError[]>>({})
  // SOLUTION A: Reactive counter to trigger watch in DataGrid when validation errors change
  const errorCount = ref(0)
  // SOLUTION B: Reactive counter to trigger watch when validation rules change (Map.set() doesn't trigger reactivity)
  const ruleCount = ref(0)

  // Helper function to update errorCount whenever validationErrors changes
  function updateErrorCount() {
    errorCount.value = Object.keys(validationErrors).length
  }

  function addValidationRule(rule: ValidationRule) {
    const rules = validationRules.value.get(rule.columnName) || []
    rules.push(rule)
    validationRules.value.set(rule.columnName, rules)

    console.log('[useValidation] addValidationRule:', {
      columnName: rule.columnName,
      ruleType: rule.ruleType,
      severity: rule.severity,
      totalRulesForColumn: rules.length
    })
    ruleCount.value++
  }

  function validateCell(rowId: string, columnName: string, value: any): ValidationResult {
    const rules = validationRules.value.get(columnName) || []

    console.log('[useValidation] validateCell:', {
      rowId,
      columnName,
      value,
      ruleCount: rules.length,
      isEmpty: value == null || value === ''
    })

    // Check if value is empty
    const isEmpty = value == null || value === ''

    for (const rule of rules) {
      // Required validation
      if (rule.ruleType === 'Required') {
        if (isEmpty) {
          console.log('[useValidation] validateCell FAILED: Required', {
            rowId,
            columnName,
            error: rule.errorMessage,
            severity: rule.severity
          })
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          }
        }
      }

      // Skip other validations if value is empty (only validate non-empty values)
      if (isEmpty) continue

      // Regex validation
      if (rule.ruleType === 'Regex' && rule.regexPattern) {
        const regex = new RegExp(rule.regexPattern)
        if (!regex.test(String(value))) {
          console.log('[useValidation] validateCell FAILED: Regex', {
            rowId,
            columnName,
            value,
            pattern: rule.regexPattern,
            error: rule.errorMessage
          })
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          }
        }
      }

      // Range validation
      if (rule.ruleType === 'Range') {
        const numValue = Number(value)
        if (isNaN(numValue)) {
          console.log('[useValidation] validateCell FAILED: Range (not a number)', {
            rowId,
            columnName,
            value
          })
          return {
            isValid: false,
            error: 'Value must be a number',
            severity: rule.severity
          }
        }

        if (rule.minValue != null && numValue < rule.minValue) {
          console.log('[useValidation] validateCell FAILED: Range (below min)', {
            rowId,
            columnName,
            value: numValue,
            minValue: rule.minValue
          })
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          }
        }

        if (rule.maxValue != null && numValue > rule.maxValue) {
          console.log('[useValidation] validateCell FAILED: Range (above max)', {
            rowId,
            columnName,
            value: numValue,
            maxValue: rule.maxValue
          })
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          }
        }
      }

      // Custom validation
      if (rule.ruleType === 'Custom' && rule.customValidator) {
        if (!rule.customValidator(value)) {
          console.log('[useValidation] validateCell FAILED: Custom', {
            rowId,
            columnName,
            value,
            error: rule.errorMessage
          })
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          }
        }
      }
    }

    console.log('[useValidation] validateCell PASSED', {
      rowId,
      columnName,
      value
    })
    return { isValid: true }
  }

  // Helper: Check if entire row is empty (all data columns have no value)
  function isRowCompletelyEmpty(rowCells: Array<{ columnName: string; value: any }>): boolean {
    return rowCells.every(cell => cell.value == null || cell.value === '')
  }

  // ✅ RIEŠENIE #2: Direct validation (no debounce) for bulk operations
  // ✅ RIEŠENIE #2: Added skipErrorCountUpdate parameter for batch operations
  function validateCellDirect(
    rowId: string,
    columnName: string,
    value: any,
    rowCells?: Array<{ columnName: string; value: any }>,
    skipErrorCountUpdate = false  // ✅ New parameter - skip updateErrorCount in batch mode
  ): Promise<void> {
    console.log('[useValidation] validateCellDirect:', {
      rowId,
      columnName,
      value,
      hasRowCells: !!rowCells,
      rowCellsCount: rowCells?.length,
      skipErrorCountUpdate
    })

    // If row cells provided, check if entire row is empty
    if (rowCells && isRowCompletelyEmpty(rowCells)) {
      console.log('[useValidation] validateCellDirect: Row is completely empty, clearing errors', {
        rowId
      })
      // Entire row is empty - clear ALL validation errors for this row
      delete validationErrors[rowId]

      // ✅ Only update error count if not in batch mode
      if (!skipErrorCountUpdate) {
        updateErrorCount()
      }
      return Promise.resolve()
    }

    const result = validateCell(rowId, columnName, value)

    // Update errors map
    const rowErrors = validationErrors[rowId] || []

    if (!result.isValid) {
      // Add/update error
      const existingErrorIdx = rowErrors.findIndex(e => e.columnName === columnName)
      const error: ValidationError = {
        rowId,
        columnName,
        message: result.error!,
        severity: result.severity!
      }

      if (existingErrorIdx >= 0) {
        rowErrors[existingErrorIdx] = error
        console.log('[useValidation] validateCellDirect: Updated existing error', {
          rowId,
          columnName,
          error: error.message
        })
      } else {
        rowErrors.push(error)
        console.log('[useValidation] validateCellDirect: Added new error', {
          rowId,
          columnName,
          error: error.message
        })
      }

      validationErrors[rowId] = rowErrors
    } else {
      // Clear error for this column
      const filteredErrors = rowErrors.filter(e => e.columnName !== columnName)
      if (filteredErrors.length > 0) {
        validationErrors[rowId] = filteredErrors
        console.log('[useValidation] validateCellDirect: Cleared error for column, other errors remain', {
          rowId,
          columnName,
          remainingErrors: filteredErrors.length
        })
      } else {
        delete validationErrors[rowId]
        console.log('[useValidation] validateCellDirect: Cleared all errors for row', {
          rowId
        })
      }
    }

    // ✅ RIEŠENIE #2: Only update error count if not in batch mode
    if (!skipErrorCountUpdate) {
      updateErrorCount()
    }

    return Promise.resolve()
  }

  // Throttled validation (300ms) for user input - wraps validateCellDirect
  const validateCellThrottled = useDebounceFn(
    validateCellDirect,
    300
  )

  async function validateAll(rows: any[]) {
    console.log('[useValidation] validateAll START:', {
      rowCount: rows.length
    })

    // Clear all errors
    Object.keys(validationErrors).forEach(key => delete validationErrors[key])
    let totalErrors = 0
    let rowIndex = 0

    // ✅ FIX: Batch processing with UI yielding
    const BATCH_SIZE = 50  // Process 50 rows at a time
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE)

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE
      const batchEnd = Math.min(batchStart + BATCH_SIZE, rows.length)
      const batch = rows.slice(batchStart, batchEnd)

      console.log(`[useValidation] Processing batch ${batchIndex + 1}/${totalBatches} (rows ${batchStart}-${batchEnd - 1})`)

      for (const row of batch) {
        // DEBUG: Log first 3 rows to see what data we have (use counter instead of indexOf)
        if (rowIndex < 3) {
          console.log('[useValidation] validateAll: Examining row', {
            rowId: row.rowId,
            rowIndex,
            cellCount: row.cells?.length || 0
          })
        }
        rowIndex++

        // Skip rows without cells array
        if (!row.cells || !Array.isArray(row.cells)) {
          console.log('[useValidation] validateAll: Skipping row without cells', {
            rowId: row.rowId,
            hasCells: !!row.cells,
            isArray: Array.isArray(row.cells)
          })
          continue
        }

        // Skip empty rows - only validate rows with at least one non-empty cell
        if (isRowCompletelyEmpty(row.cells)) {
          console.log('[useValidation] validateAll: Skipping empty row', {
            rowId: row.rowId,
            cellCount: row.cells?.length || 0
          })
          continue
        }

        for (const cell of row.cells) {
          const result = validateCell(row.rowId, cell.columnName, cell.value)
          if (!result.isValid) {
            const rowErrors = validationErrors[row.rowId] || []
            rowErrors.push({
              rowId: row.rowId,
              columnName: cell.columnName,
              message: result.error!,
              severity: result.severity!
            })
            validationErrors[row.rowId] = rowErrors
            totalErrors++
          }
        }
      }

      // ✅ KĽÚČ: Yield UI po každom batchi
      await nextTick()
    }

    console.log('[useValidation] validateAll - loop FINISHED, processed', rowIndex, 'rows')
    console.log('[useValidation] validateAll - totalErrors:', totalErrors)

    // SIMPLIFIED: Avoid complex operations on reactive validationErrors object
    const rowsWithErrorsCount = Object.keys(validationErrors).length
    console.log('[useValidation] validateAll - rowsWithErrors:', rowsWithErrorsCount)

    console.log('[useValidation] validateAll complete - SUCCESS')

    console.log('[useValidation] validateAll - calling updateErrorCount...')
    updateErrorCount()
    console.log('[useValidation] validateAll - updateErrorCount DONE')

    // SIMPLIFIED: Build errors array without Object.values().flat() on reactive object
    console.log('[useValidation] validateAll - building errors array...')
    const allErrors: ValidationError[] = []
    for (const rowId in validationErrors) {
      const rowErrors = validationErrors[rowId]
      if (rowErrors && Array.isArray(rowErrors)) {
        allErrors.push(...rowErrors)
      }
    }
    console.log('[useValidation] validateAll - errors array built, count:', allErrors.length)

    console.log('[useValidation] validateAll - returning result...')
    return {
      isValid: totalErrors === 0,
      totalErrors,
      errors: allErrors
    }
  }

  function getValidationErrors(rowId: string): ValidationError[] {
    return validationErrors[rowId] || []
  }

  function clearValidationErrors() {
    const clearedCount = Object.keys(validationErrors).length
    console.log('[useValidation] clearValidationErrors:', {
      clearedCount
    })
    Object.keys(validationErrors).forEach(key => delete validationErrors[key])
    updateErrorCount()
  }

  return {
    validationRules,
    validationErrors,
    errorCount,
    ruleCount,
    addValidationRule,
    validateCell,
    validateCellDirect,      // ✅ Direct validation for bulk operations (no debounce)
    validateCellThrottled,   // Throttled validation for user input (300ms debounce)
    validateAll,
    getValidationErrors,
    clearValidationErrors,
    updateErrorCount         // ✅ RIEŠENIE #2: Export for manual call after batch validation
  }
}
