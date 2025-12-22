/**
 * Grid API Service for RB0120Desktop
 * WebView2 Host Objects mode only
 */

// Extend Window interface for WebView2 gridApi
declare global {
  interface Window {
    gridApi?: {
      GetData(): Promise<string>
      GetCurrentData(): Promise<string>
      ImportData(jsonData: string): Promise<string>
      ExportData(options: string): Promise<string>
      GetConfig(): Promise<string>
      SetValidationRules(jsonRules: string): Promise<string>
      GetColumns(): Promise<string>
      HealthCheck(): Promise<string>
    }
  }
}

export interface GridRow {
  [key: string]: any
  Checkbox?: boolean
}

export interface GridColumn {
  name: string
  header: string
  width: number
  isVisible: boolean
  specialType?: 'RowNumber' | 'Checkbox' | 'Actions'
}

export interface ValidationRule {
  columnName: string
  ruleType: string
  parameters: Record<string, any>
  errorMessage: string
}

export interface GridConfig {
  pageSize: number
  enableSort: boolean
  enableFilter: boolean
  enableSearch: boolean
  enableValidation: boolean
  showRowNumber: boolean
  showCheckbox: boolean
  showValidationAlerts: boolean
  minRowHeight: number
  maxRowHeight: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  rowCount?: number
}

class GridApiService {
  private isHostMode = false

  constructor() {
    // Detect if running in WebView2 with Host Objects
    this.isHostMode = this.detectHostMode()
    console.log(`[GridAPI] Mode: ${this.isHostMode ? 'Host Objects' : 'Not Available'}`)
  }

  /**
   * Detect if running in WebView2 with gridApi bridge
   */
  private detectHostMode(): boolean {
    return !!window.gridApi
  }

  /**
   * Call gridApi method (WebView2 mode with postMessage bridge)
   */
  private async callHostApi<T>(method: string, ...args: string[]): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    console.log(`[GridAPI] → Calling ${method}`, args.length > 0 ? args : '')

    try {
      if (!window.gridApi) {
        throw new Error('Grid API not available')
      }

      const hostApi = window.gridApi
      const resultJson = await (hostApi as any)[method](...args)

      // Parse JSON response from C#
      const result = JSON.parse(resultJson)

      console.log(`[GridAPI] ← ${method} completed in ${Date.now() - startTime}ms`)
      return result as ApiResponse<T>
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[GridAPI] ✘ ${method} FAILED after ${duration}ms:`, error)

      // Log to C# backend for centralized crash analysis
      try {
        await this.logError(method, error)
      } catch { }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Log error to C# backend for centralized crash analysis
   */
  private async logError(method: string, error: any) {
    // Call C# logging endpoint via postMessage
    if (window.chrome?.webview) {
      try {
        window.chrome.webview.postMessage(JSON.stringify({
          type: 'error',
          method,
          error: error.toString(),
          stack: error.stack,
          timestamp: new Date().toISOString()
        }))
      } catch { }
    }
  }

  /**
   * Get grid data from backend
   */
  async getData(): Promise<ApiResponse<GridRow[]>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    return this.callHostApi<GridRow[]>('GetData')
  }

  /**
   * Get current data from backend (same as getData, but explicit name)
   */
  async getCurrentData(): Promise<ApiResponse<GridRow[]>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    return this.callHostApi<GridRow[]>('GetCurrentData')
  }

  /**
   * Get columns definition
   */
  async getColumns(): Promise<ApiResponse<GridColumn[]>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    return this.callHostApi<GridColumn[]>('GetColumns')
  }

  /**
   * Import data to backend (replaces existing data)
   */
  async importData(data: GridRow[]): Promise<ApiResponse<void>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    const jsonData = JSON.stringify({ data })
    return this.callHostApi<void>('ImportData', jsonData)
  }

  /**
   * Export data from backend
   */
  async exportData(options?: {
    onlyFiltered?: boolean
    filteredRowIds?: string[]
    columnNames?: string[]
  }): Promise<ApiResponse<GridRow[]>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    const optionsJson = JSON.stringify({
      OnlyFiltered: options?.onlyFiltered ?? false,
      FilteredRowIds: options?.filteredRowIds ?? null,
      ColumnNames: options?.columnNames ?? null
    })
    return this.callHostApi<GridRow[]>('ExportData', optionsJson)
  }

  /**
   * Get grid configuration
   */
  async getConfig(): Promise<ApiResponse<GridConfig>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    return this.callHostApi<GridConfig>('GetConfig')
  }

  /**
   * Set validation rules
   */
  async setValidationRules(rules: ValidationRule[]): Promise<ApiResponse<void>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    const jsonRules = JSON.stringify({ rules })
    return this.callHostApi<void>('SetValidationRules', jsonRules)
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isHostMode) {
        return false
      }
      const result = await this.callHostApi<any>('HealthCheck')
      return result.success
    } catch {
      return false
    }
  }
}

export const gridApi = new GridApiService()
