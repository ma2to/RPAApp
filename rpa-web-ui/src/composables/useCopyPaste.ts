/**
 * Copy/Paste Composable with Excel-like TSV Format
 *
 * EXCEL TSV FORMAT:
 * - Normal cells: separated by \t (no quotes)
 * - Multiline cells: wrapped in quotes "Multi\nLine\nCell"
 * - Cells with tabs: wrapped in quotes "Cell\tWith\tTabs"
 * - Cells with quotes: quotes doubled AND wrapped "Cell with ""quote"""
 *
 * CRITICAL: Before copying, values are ESCAPED (quotes added if needed)
 * CRITICAL: After pasting, values are UNESCAPED (quotes removed)
 */

import { ref } from 'vue'
import type { GridRow } from '@/types/grid'

export interface CopyPasteOptions {
  includeHeaders?: boolean
}

export interface CopyPasteResult {
  success: boolean
  message?: string
  processedRows?: number
}

export function useCopyPaste() {
  const clipboardData = ref<string>('')

  /**
   * Escapes TSV value for Excel compatibility
   *
   * ESCAPING RULES:
   * 1. If value contains tab, newline, carriage return, or quote → wrap in quotes
   * 2. If wrapping in quotes, double any existing quotes (" → "")
   * 3. Otherwise, return value as-is (no quotes needed)
   *
   * EXAMPLES:
   * - "NormalText" → NormalText (no special chars, no quotes)
   * - "Multi\nLine" → "Multi\nLine" (newline → quoted)
   * - "Cell\tWith\tTab" → "Cell\tWith\tTab" (tabs → quoted)
   * - 'Cell with "quote"' → "Cell with ""quote""" (quote → doubled AND quoted)
   * - "" → "" (empty string stays empty)
   */
  function escapeTsvValue(value: string): string {
    if (!value) return value

    // Check if quoting is needed
    const needsQuoting = value.includes('\t') ||
                        value.includes('\n') ||
                        value.includes('\r') ||
                        value.includes('"')

    if (!needsQuoting) {
      // Normal value - no escaping needed
      return value
    }

    // Escape quotes by doubling them, then wrap entire value in quotes
    // Example: Cell with "quote" → Cell with ""quote"" → "Cell with ""quote"""
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }

  /**
   * Formats rows as Tab-Separated Values with Excel escaping
   *
   * EXAMPLE OUTPUT:
   * Column1\tColumn2\tColumn3\n
   * Cell1\t"Multi\nLine\nCell"\tCell3\n
   * Cell1\t"Cell\tWith\tTabs"\tCell3\n
   * Cell1\t"Cell with ""quote"""\tCell3\n
   */
  function formatAsTabSeparated(
    rows: GridRow[],
    columnNames: string[],
    options: CopyPasteOptions = {}
  ): string {
    const lines: string[] = []

    // Add headers if requested
    if (options.includeHeaders) {
      // Escape header values too (in case column names contain special chars)
      lines.push(columnNames.map(escapeTsvValue).join('\t'))
    }

    // Add data rows
    for (const row of rows) {
      // Escape all cell values before joining with tabs
      // This ensures multiline/tab content is properly quoted for Excel
      const values = columnNames.map(col => {
        const cell = row.cells.find(c => c.columnName === col)
        const value = cell?.value
        return escapeTsvValue(value?.toString() ?? '')
      })
      lines.push(values.join('\t'))
    }

    return lines.join('\n')
  }

  /**
   * Parses Tab-Separated Values with Excel multiline/tab support
   *
   * EXCEL TSV FORMAT:
   * - Normal cells: separated by \t
   * - Multiline cells: wrapped in quotes "Multi\nLine\nCell"
   * - Cells with tabs: wrapped in quotes "Cell\tWith\tTabs"
   * - Escaped quotes: doubled "" inside quoted values "Cell with ""quote"""
   *
   * CRITICAL: Uses character-by-character parsing instead of Split() to handle embedded delimiters
   *
   * EXAMPLE INPUT:
   * Column1\tColumn2\tColumn3\n
   * Cell1\t"Multi\nLine\nCell"\tCell3\n
   * Cell1\t"Cell\tWith\tTabs"\tCell3\n
   * Cell1\t"Cell with ""quote"""\tCell3\n
   *
   * EXAMPLE OUTPUT (unescaped):
   * Column2 value: "Multi\nLine\nCell" (3 lines, NO quotes in final value)
   */
  function parseTabSeparated(clipboardText: string): { headers: string[], rows: Record<string, any>[] } {
    const result: Record<string, any>[] = []
    const currentRow: string[] = []
    let currentCell = ''
    let inQuotes = false
    let isFirstRow = true
    let headers: string[] = []

    // ✅ FIX: Detekcia single-cell copy (neobsahuje tab ani newline, alebo len trailing newline)
    const trimmedText = clipboardText.trim()
    const isSingleCell = !trimmedText.includes('\t') && !trimmedText.includes('\n')

    for (let i = 0; i < clipboardText.length; i++) {
      const c = clipboardText[i]
      const next = i + 1 < clipboardText.length ? clipboardText[i + 1] : null

      if (c === '"') {
        if (inQuotes && next === '"') {
          // Escaped quote ("") → append single quote to cell content
          // Example: "Cell with ""quote""" → Cell with "quote"
          currentCell += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote mode (start or end of quoted value)
          // CRITICAL: Quotes themselves are NOT added to cell content
          inQuotes = !inQuotes
        }
      } else if (c === '\t' && !inQuotes) {
        // Tab outside quotes = end of cell
        currentRow.push(currentCell)
        currentCell = ''
      } else if ((c === '\n' || c === '\r') && !inQuotes) {
        // Newline outside quotes = end of row
        if (c === '\r' && next === '\n') {
          i++ // Skip \n after \r (handle Windows CRLF)
        }

        if (currentCell.length > 0 || currentRow.length > 0) {
          currentRow.push(currentCell)
          currentCell = ''

          if (isFirstRow) {
            // First row = headers (or auto-generate if not header-like)
            // ✅ FIX: Poskytnúť isSingleCell flag
            if (isHeaderRow(currentRow, isSingleCell)) {
              headers = [...currentRow]
            } else {
              // First row is data - generate column names
              headers = currentRow.map((_, idx) => `Column${idx + 1}`)

              // Add first row as data
              const firstDataRow: Record<string, any> = {}
              for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
                firstDataRow[headers[j]] = currentRow[j] || null
              }
              result.push(firstDataRow)
            }

            isFirstRow = false
          } else {
            // Build data row dictionary
            const dataRow: Record<string, any> = {}
            for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
              // CRITICAL: Values are UNESCAPED (quotes removed, "" → ")
              dataRow[headers[j]] = currentRow[j] || null
            }
            result.push(dataRow)
          }

          currentRow.length = 0
        }
      } else {
        // Regular character - add to current cell
        // Tabs and newlines inside quotes are preserved as-is
        currentCell += c
      }
    }

    // Handle last row if no trailing newline
    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell)

      if (isFirstRow && headers.length === 0) {
        // Only one row total - treat as headers or generate column names
        // ✅ FIX: Poskytnúť isSingleCell flag
        if (isHeaderRow(currentRow, isSingleCell)) {
          headers = [...currentRow]
        } else {
          headers = currentRow.map((_, idx) => `Column${idx + 1}`)
          const dataRow: Record<string, any> = {}
          for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
            dataRow[headers[j]] = currentRow[j] || null
          }
          result.push(dataRow)
        }
      } else if (headers.length > 0) {
        // Last data row
        const dataRow: Record<string, any> = {}
        for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
          dataRow[headers[j]] = currentRow[j] || null
        }
        result.push(dataRow)
      }
    }

    return { headers, rows: result }
  }

  /**
   * Checks if row contains headers
   * ✅ FIX: Použiť heuristiku namiesto jednoduchého isNaN check
   * - Ak je to single-cell copy, NIKDY to nie je header
   * - Ak má všetky bunky číselné hodnoty, NIE je to header
   * - Ak má mix textu a čísel, ALE clipboard neobsahuje tab (single column), NIE je to header
   */
  function isHeaderRow(values: string[], isSingleCell: boolean = false): boolean {
    // ✅ FIX: Single cell copy NIKDY nie je header
    if (isSingleCell || values.length === 1) {
      return false
    }

    // Ak všetky hodnoty sú čísla → nie je header
    const allNumeric = values.every(v => !v || !isNaN(Number(v)))
    if (allNumeric) {
      return false
    }

    // Ak obsahuje ASPOŇ jednu hodnotu, ktorá vyzerá ako typický column header
    // (obsahuje veľké písmená na začiatku, nemá veľa čísel, atď.)
    const hasTypicalHeader = values.some(v => {
      if (!v) return false

      // Typický header: začína veľkým písmenom, krátky (< 30 znakov), bez špeciálnych znakov
      const startsWithCapital = /^[A-Z]/.test(v)
      const isShort = v.length < 30
      const hasNoSpecialChars = !/[@#$%^&*()]/.test(v)

      return startsWithCapital && isShort && hasNoSpecialChars && isNaN(Number(v))
    })

    return hasTypicalHeader
  }

  /**
   * Copies selected CELLS (not full rows) to clipboard with position preservation
   *
   * POSITION PRESERVATION:
   * - Calculates min/max row and column indices from selected cells
   * - Creates rectangular range including EMPTY cells to preserve positions
   * - Example: If cells (2,3) and (4,5) are selected, copies a 3x3 grid:
   *   Row 2: empty, empty, Cell(2,3), empty, empty
   *   Row 3: empty, empty, empty,     empty, empty
   *   Row 4: empty, empty, empty,     empty, Cell(4,5)
   */
  async function copySelectedCells(
    selectedCells: Set<string>,
    allRows: GridRow[],
    allColumns: { name: string }[]
  ): Promise<CopyPasteResult> {
    try {
      if (selectedCells.size === 0) {
        return {
          success: false,
          message: 'No cells selected for copy'
        }
      }

      console.log('[useCopyPaste] copySelectedCells:', {
        selectedCount: selectedCells.size,
        selectedCells: Array.from(selectedCells)
      })

      // Parse selected cells to get row/column indices
      const cellPositions: Array<{ rowId: string; rowIndex: number; columnName: string; columnIndex: number; value: any }> = []

      selectedCells.forEach(cellKey => {
        const [rowId, columnName] = cellKey.split(':')
        const row = allRows.find(r => r.rowId === rowId)
        if (!row) return

        const columnIndex = allColumns.findIndex(c => c.name === columnName)
        if (columnIndex === -1) return

        const cell = row.cells.find(c => c.columnName === columnName)
        cellPositions.push({
          rowId,
          rowIndex: row.rowIndex,
          columnName,
          columnIndex,
          value: cell?.value
        })
      })

      if (cellPositions.length === 0) {
        return {
          success: false,
          message: 'No valid cells to copy'
        }
      }

      // Calculate rectangular bounds
      const minRowIndex = Math.min(...cellPositions.map(c => c.rowIndex))
      const maxRowIndex = Math.max(...cellPositions.map(c => c.rowIndex))
      const minColIndex = Math.min(...cellPositions.map(c => c.columnIndex))
      const maxColIndex = Math.max(...cellPositions.map(c => c.columnIndex))

      console.log('[useCopyPaste] copySelectedCells bounds:', {
        minRowIndex,
        maxRowIndex,
        minColIndex,
        maxColIndex,
        rows: maxRowIndex - minRowIndex + 1,
        cols: maxColIndex - minColIndex + 1
      })

      // Build TSV with position preservation (include empty cells)
      const lines: string[] = []

      for (let rowIdx = minRowIndex; rowIdx <= maxRowIndex; rowIdx++) {
        const rowCells: string[] = []

        for (let colIdx = minColIndex; colIdx <= maxColIndex; colIdx++) {
          // Find if this cell is selected
          const cellPos = cellPositions.find(c => c.rowIndex === rowIdx && c.columnIndex === colIdx)

          if (cellPos) {
            // Cell is selected - add its value
            const value = cellPos.value?.toString() ?? ''
            rowCells.push(escapeTsvValue(value))
          } else {
            // Cell is not selected - add empty placeholder to preserve position
            rowCells.push('')
          }
        }

        lines.push(rowCells.join('\t'))
      }

      const tsvData = lines.join('\n')

      console.log('[useCopyPaste] copySelectedCells TSV:', {
        lineCount: lines.length,
        preview: tsvData.substring(0, 200)
      })

      // Copy to system clipboard
      await navigator.clipboard.writeText(tsvData)

      // Store internally for fallback
      clipboardData.value = tsvData

      return {
        success: true,
        message: `Copied ${cellPositions.length} cells to clipboard`,
        processedRows: cellPositions.length
      }
    } catch (error) {
      console.error('[useCopyPaste] Copy failed:', error)
      return {
        success: false,
        message: `Copy failed: ${error}`
      }
    }
  }

  /**
   * Copies selected rows to clipboard (legacy method for full row copy)
   */
  async function copyToClipboard(
    rows: GridRow[],
    columnNames: string[],
    options: CopyPasteOptions = {}
  ): Promise<CopyPasteResult> {
    try {
      if (rows.length === 0) {
        return {
          success: false,
          message: 'No data selected for copy'
        }
      }

      // Format data as TSV with Excel escaping
      const tsvData = formatAsTabSeparated(rows, columnNames, options)

      // Copy to system clipboard
      await navigator.clipboard.writeText(tsvData)

      // Store internally for fallback
      clipboardData.value = tsvData

      return {
        success: true,
        message: `Copied ${rows.length} rows to clipboard`,
        processedRows: rows.length
      }
    } catch (error) {
      console.error('Copy failed:', error)
      return {
        success: false,
        message: `Copy failed: ${error}`
      }
    }
  }

  /**
   * Pastes from clipboard and returns parsed rows
   */
  async function pasteFromClipboard(): Promise<CopyPasteResult & { rows?: Record<string, any>[], headers?: string[] }> {
    try {
      // Try to read from system clipboard
      let tsvData = ''
      try {
        tsvData = await navigator.clipboard.readText()
      } catch {
        // Fallback to internal clipboard if system clipboard fails
        tsvData = clipboardData.value
      }

      if (!tsvData) {
        return {
          success: false,
          message: 'No data available in clipboard'
        }
      }

      // Parse TSV data with Excel multiline support
      const { headers, rows } = parseTabSeparated(tsvData)

      return {
        success: true,
        message: `Pasted ${rows.length} rows from clipboard`,
        processedRows: rows.length,
        rows,
        headers
      }
    } catch (error) {
      console.error('Paste failed:', error)
      return {
        success: false,
        message: `Paste failed: ${error}`
      }
    }
  }

  /**
   * Checks if paste is possible
   */
  function canPaste(): boolean {
    return !!clipboardData.value
  }

  /**
   * Clears internal clipboard
   */
  function clearClipboard(): void {
    clipboardData.value = ''
  }

  return {
    copyToClipboard,
    copySelectedCells,
    pasteFromClipboard,
    canPaste,
    clearClipboard
  }
}
