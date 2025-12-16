/**
 * Import/Export Composable
 *
 * Provides JSON import/export functionality for grid data
 */

export enum ImportMode {
  Append = 'append',    // Add to existing data
  Replace = 'replace',  // Clear and replace all data
  Merge = 'merge'       // Merge with existing data (by rowId)
}

export interface ImportOptions {
  mode: ImportMode
  validateSchema?: boolean
}

export interface ExportOptions {
  includeHiddenColumns?: boolean
  includeSpecialColumns?: boolean
  onlySelectedRows?: boolean
  prettify?: boolean
}

export interface ImportResult {
  success: boolean
  rowsImported: number
  rowsSkipped: number
  errors: string[]
  message: string
  rows?: Record<string, any>[]  // The processed rows ready to load
}

export interface ExportResult {
  success: boolean
  rowsExported: number
  message: string
}

export function useImportExport() {
  /**
   * Exports grid data to JSON format
   */
  function exportToJson(
    rows: Record<string, any>[],
    columns: string[],
    options: ExportOptions = {}
  ): ExportResult {
    try {
      const {
        includeHiddenColumns = false,
        includeSpecialColumns = false,
        onlySelectedRows = false,
        prettify = true
      } = options

      // Filter rows if needed
      let dataToExport = rows

      if (onlySelectedRows) {
        // Filter would be done by caller passing selected rows
        dataToExport = rows
      }

      // Filter columns if needed
      const filteredData = dataToExport.map(row => {
        const filteredRow: Record<string, any> = {}

        for (const key of Object.keys(row)) {
          // Skip internal properties
          if (key.startsWith('__')) {
            continue
          }

          // Include all data columns by default
          if (columns.includes(key)) {
            filteredRow[key] = row[key]
          }
        }

        return filteredRow
      })

      // Create JSON string
      const jsonString = prettify
        ? JSON.stringify(filteredData, null, 2)
        : JSON.stringify(filteredData)

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `grid-export-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        rowsExported: filteredData.length,
        message: `Successfully exported ${filteredData.length} rows to JSON`
      }
    } catch (error) {
      console.error('Export to JSON failed:', error)
      return {
        success: false,
        rowsExported: 0,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Imports grid data from JSON file
   */
  async function importFromJson(
    file: File,
    existingRows: Record<string, any>[],
    columns: string[],
    options: ImportOptions = { mode: ImportMode.Append }
  ): Promise<ImportResult> {
    try {
      // Read file
      const text = await file.text()

      // Parse JSON
      let parsedData: any
      try {
        parsedData = JSON.parse(text)
      } catch (parseError) {
        return {
          success: false,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ['Invalid JSON format'],
          message: 'Failed to parse JSON file'
        }
      }

      // Validate structure
      if (!Array.isArray(parsedData)) {
        return {
          success: false,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ['JSON must be an array of objects'],
          message: 'Invalid JSON structure'
        }
      }

      // Validate schema if requested
      const errors: string[] = []
      let rowsSkipped = 0

      if (options.validateSchema && parsedData.length > 0) {
        const firstRow = parsedData[0]
        const importKeys = Object.keys(firstRow)
        const missingColumns = columns.filter(col => !importKeys.includes(col))

        if (missingColumns.length > 0) {
          errors.push(`Missing columns in import data: ${missingColumns.join(', ')}`)
        }
      }

      // Process rows based on mode
      let resultRows: Record<string, any>[] = []

      switch (options.mode) {
        case ImportMode.Replace:
          // Clear existing and use imported data
          resultRows = parsedData.map((row, index) => ({
            ...row,
            __rowId: row.__rowId || `imported-${Date.now()}-${index}`,
            __rowIndex: index
          }))
          break

        case ImportMode.Append:
          // Add to end of existing data
          resultRows = [
            ...existingRows,
            ...parsedData.map((row, index) => ({
              ...row,
              __rowId: row.__rowId || `imported-${Date.now()}-${index}`,
              __rowIndex: existingRows.length + index
            }))
          ]
          break

        case ImportMode.Merge:
          // Merge by rowId
          const existingRowsMap = new Map(
            existingRows.map(row => [row.__rowId, row])
          )

          parsedData.forEach((importRow, index) => {
            const rowId = importRow.__rowId || `imported-${Date.now()}-${index}`

            if (existingRowsMap.has(rowId)) {
              // Update existing row
              const existingRow = existingRowsMap.get(rowId)!
              Object.assign(existingRow, importRow, { __rowId: rowId })
            } else {
              // Add new row
              existingRowsMap.set(rowId, {
                ...importRow,
                __rowId: rowId,
                __rowIndex: existingRowsMap.size
              })
            }
          })

          resultRows = Array.from(existingRowsMap.values())
          break
      }

      // Reindex rows
      resultRows.forEach((row, index) => {
        row.__rowIndex = index
      })

      return {
        success: true,
        rowsImported: parsedData.length,
        rowsSkipped,
        errors,
        message: `Successfully imported ${parsedData.length} rows using ${options.mode} mode`,
        rows: resultRows
      }
    } catch (error) {
      console.error('Import from JSON failed:', error)
      return {
        success: false,
        rowsImported: 0,
        rowsSkipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        message: 'Import failed'
      }
    }
  }

  /**
   * Opens file picker and imports JSON
   */
  function openImportDialog(
    existingRows: Record<string, any>[],
    columns: string[],
    options: ImportOptions = { mode: ImportMode.Append }
  ): Promise<ImportResult> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,application/json'

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve({
            success: false,
            rowsImported: 0,
            rowsSkipped: 0,
            errors: ['No file selected'],
            message: 'Import cancelled'
          })
          return
        }

        const result = await importFromJson(file, existingRows, columns, options)
        resolve(result)
      }

      input.oncancel = () => {
        resolve({
          success: false,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ['User cancelled'],
          message: 'Import cancelled'
        })
      }

      input.click()
    })
  }

  return {
    exportToJson,
    importFromJson,
    openImportDialog,
    ImportMode
  }
}
