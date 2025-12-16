/**
 * Auto Row Height Composable
 *
 * Calculates row heights based on cell content and text wrapping
 */

export interface AutoRowHeightConfig {
  minHeight: number
  maxHeight: number
  fontFamily: string
  fontSize: number
  enableWrapping: boolean
  padding: number
}

export interface RowHeightResult {
  rowId: string
  calculatedHeight: number
  isSuccess: boolean
}

export const defaultAutoRowHeightConfig: AutoRowHeightConfig = {
  minHeight: 32, // 32px default row height (matches default in store)
  maxHeight: 400, // Default fallback (will be overridden by 70% of container height)
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,  // MUST match CSS font-size in .grid-cell
  enableWrapping: true,
  padding: 16 // 8px left + 8px right (horizontal padding for width calculation)
}

export function useAutoRowHeight(config: AutoRowHeightConfig = defaultAutoRowHeightConfig) {
  // Create a canvas for text measurement (reused for all calculations)
  let canvas: HTMLCanvasElement | null = null
  let context: CanvasRenderingContext2D | null = null

  /**
   * Gets the canvas context for text measurement
   */
  function getContext(): CanvasRenderingContext2D {
    if (!canvas) {
      canvas = document.createElement('canvas')
      context = canvas.getContext('2d')
    }

    if (!context) {
      throw new Error('Failed to get canvas context')
    }

    // Set font for measurement
    context.font = `${config.fontSize}px ${config.fontFamily}`

    return context
  }

  /**
   * Measures the height required for text in a given width
   * IMPORTANT: Handles explicit newlines (\n) from Shift+Enter
   */
  function measureTextHeight(text: string, width: number): number {
    if (!text) return config.minHeight

    const ctx = getContext()

    if (!config.enableWrapping) {
      // Single line - just return min height
      return config.minHeight
    }

    // Split by newline characters FIRST to respect explicit line breaks (Shift+Enter)
    const explicitLines = text.toString().split('\n')

    let lineHeight = config.fontSize * 1.5 // Line height is typically 1.5x font size
    let totalLines = 0

    // For each explicit line, calculate how many visual lines it needs (accounting for wrapping)
    for (const line of explicitLines) {
      if (!line || line.trim() === '') {
        // Empty line still counts as one line
        totalLines++
        continue
      }

      // Split this line into words and calculate wrapping
      const words = line.split(' ')
      let currentLine = ''
      let linesInThisSegment = 1

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = ctx.measureText(testLine)

        if (metrics.width > width - config.padding) {
          // Line is too long, wrap to next line
          if (currentLine) {
            linesInThisSegment++
            currentLine = word
          } else {
            // Single word is too long, force it on one line
            currentLine = word
          }
        } else {
          currentLine = testLine
        }
      }

      totalLines += linesInThisSegment
    }

    // Calculate total height
    // Add vertical padding (10px from CSS: 5px top + 5px bottom = 10px total)
    const verticalPadding = 10  // Must match CSS padding in .grid-cell (5px + 5px)
    const totalHeight = totalLines * lineHeight + verticalPadding

    // Apply min/max constraints
    return Math.max(config.minHeight, Math.min(config.maxHeight, Math.ceil(totalHeight)))
  }

  /**
   * Calculates the height for a single row based on all cell contents
   */
  function calculateRowHeight(
    row: Record<string, any>,
    columns: Array<{ name: string; width: number; specialType?: string }>
  ): RowHeightResult {
    try {
      let maxHeight = config.minHeight

      // Measure each cell in the row
      for (const column of columns) {
        // Skip special columns EXCEPT ValidationAlerts
        // ValidationAlerts should be measured because it contains important validation messages
        // that need proper row height calculation for wrapping
        if (column.specialType && column.specialType !== 'ValidationAlerts') {
          continue
        }

        // Access cell value from cells array structure
        let cellValue = null
        if (row.cells && Array.isArray(row.cells)) {
          // GridRow structure with cells array
          const cell = row.cells.find((c: any) => c.columnName === column.name)
          cellValue = cell?.value
        } else {
          // Fallback to direct property access for backwards compatibility
          cellValue = row[column.name]
        }

        if (cellValue == null) continue

        const textValue = String(cellValue)
        const cellHeight = measureTextHeight(textValue, column.width)

        maxHeight = Math.max(maxHeight, cellHeight)
      }

      return {
        rowId: row.__rowId || row.rowId,
        calculatedHeight: maxHeight,
        isSuccess: true
      }
    } catch (error) {
      console.error('Row height calculation failed:', error)
      return {
        rowId: row.__rowId || row.rowId,
        calculatedHeight: config.minHeight,
        isSuccess: false
      }
    }
  }

  /**
   * Calculates heights for multiple rows (batch operation)
   */
  function calculateRowHeights(
    rows: Record<string, any>[],
    columns: Array<{ name: string; width: number; specialType?: string }>
  ): RowHeightResult[] {
    return rows.map(row => calculateRowHeight(row, columns))
  }

  /**
   * Calculates heights for all rows and updates them in place
   * ✅ FIX: Async with batching to prevent UI freeze
   */
  async function applyAutoRowHeight(
    rows: Array<{ rowId: string; height: number; [key: string]: any }>,
    columns: Array<{ name: string; width: number; specialType?: string }>
  ): Promise<{ totalRowsUpdated: number; averageHeight: number }> {
    let totalHeight = 0
    let updatedCount = 0

    // ✅ FIX: Batch processing with UI yielding
    const BATCH_SIZE = 50  // Process 50 rows at a time
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE)

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE
      const batchEnd = Math.min(batchStart + BATCH_SIZE, rows.length)
      const batch = rows.slice(batchStart, batchEnd)

      console.log(`[AutoRowHeight] Processing batch ${batchIndex + 1}/${totalBatches} (rows ${batchStart}-${batchEnd - 1})`)

      for (const row of batch) {
        const result = calculateRowHeight(row, columns)

        if (result.isSuccess) {
          row.height = result.calculatedHeight
          totalHeight += result.calculatedHeight
          updatedCount++
        }
      }

      // ✅ KĽÚČ: Yield UI po každom batchi
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    return {
      totalRowsUpdated: updatedCount,
      averageHeight: updatedCount > 0 ? totalHeight / updatedCount : config.minHeight
    }
  }

  /**
   * Recalculates heights for specific rows (e.g., after editing)
   */
  function recalculateRows(
    rows: Array<{ rowId: string; height: number; [key: string]: any }>,
    rowIds: string[],
    columns: Array<{ name: string; width: number; specialType?: string }>
  ): number {
    let updatedCount = 0

    for (const row of rows) {
      if (rowIds.includes(row.rowId)) {
        const result = calculateRowHeight(row, columns)

        if (result.isSuccess) {
          row.height = result.calculatedHeight
          updatedCount++
        }
      }
    }

    return updatedCount
  }

  /**
   * Updates the maxHeight config value dynamically
   * Used when container height changes
   */
  function updateMaxHeight(newMaxHeight: number) {
    config.maxHeight = newMaxHeight
    console.log(`[useAutoRowHeight] maxHeight updated to: ${newMaxHeight}px`)
  }

  return {
    calculateRowHeight,
    calculateRowHeights,
    applyAutoRowHeight,
    recalculateRows,
    measureTextHeight,
    updateMaxHeight  // NEW: Allow dynamic maxHeight updates
  }
}
