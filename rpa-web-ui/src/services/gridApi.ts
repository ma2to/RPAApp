/**
 * Grid API Service
 *
 * Supports both HTTP mode (development) and WebView2 Host Objects mode (production)
 */

// ✅ RIEŠENIE #6C: ListBox ref type for API integration
export interface ListBoxRef {
  clearSelection: () => void
  getSelectedValues: () => string[]
  selectValue: (value: string) => void
}

// Extend Window interface for WebView2 gridApi
declare global {
  interface Window {
    gridApi?: {
      GetData(): Promise<string>
      ImportData(jsonData: string): Promise<string>
      ExportData(options: string): Promise<string>
      GetConfig(): Promise<string>
      SetValidationRules(jsonRules: string): Promise<string>
      GetValidationRules(): Promise<string>
      GetColumnNames(): Promise<string>
      HealthCheck(): Promise<string>
      // ✅ RIEŠENIE #6C: ListBox API methods
      ClearListBoxSelection(listBoxId: string): Promise<string>
      GetListBoxSelection(listBoxId: string): Promise<string>
      // ✅ RIEŠENIE #7: New API methods
      GetListBoxConfig(listBoxId: string): Promise<string>
      GetThemeConfig(): Promise<string>
    }
  }
}

const BASE_URL = 'http://localhost:5000/api/grid'

export interface GridRow {
  [key: string]: any
  Checkbox?: boolean
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
  // ✅ RIEŠENIE #6C: Registry for listbox references
  private listBoxRegistry = new Map<string, ListBoxRef>()

  constructor() {
    // Detect if running in WebView2 with Host Objects
    this.isHostMode = this.detectHostMode()
    console.log(`Grid API Mode: ${this.isHostMode ? 'Host Objects' : 'HTTP'}`)
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
    try {
      if (!window.gridApi) {
        throw new Error('Grid API not available')
      }

      const hostApi = window.gridApi
      const resultJson = await (hostApi as any)[method](...args)

      // ✅ FIX: Support both string and object responses (after double JSON encoding fix in MainWindow.xaml.cs)
      // Parse JSON response from C# - handle both string (old behavior) and object (new behavior after fix)
      const result = typeof resultJson === 'string'
        ? JSON.parse(resultJson)
        : resultJson
      return result as ApiResponse<T>
    } catch (error) {
      console.error('Grid API call failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * HTTP request (development mode)
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get grid data from backend
   */
  async getData(): Promise<ApiResponse<GridRow[]>> {
    if (this.isHostMode) {
      return this.callHostApi<GridRow[]>('GetData')
    } else {
      return this.request<GridRow[]>('/data')
    }
  }

  /**
   * Import data to backend (replaces existing data)
   */
  async importData(data: GridRow[]): Promise<ApiResponse<void>> {
    if (this.isHostMode) {
      const jsonData = JSON.stringify({ data })
      return this.callHostApi<void>('ImportData', jsonData)
    } else {
      return this.request<void>('/import', {
        method: 'POST',
        body: JSON.stringify({ data })
      })
    }
  }

  /**
   * Export data from backend
   */
  async exportData(options?: {
    onlyFiltered?: boolean
    filteredRowIds?: string[]
    columnNames?: string[]
  }): Promise<ApiResponse<GridRow[]>> {
    if (this.isHostMode) {
      const optionsJson = JSON.stringify({
        OnlyFiltered: options?.onlyFiltered ?? false,
        FilteredRowIds: options?.filteredRowIds ?? null,
        ColumnNames: options?.columnNames ?? null
      })
      return this.callHostApi<GridRow[]>('ExportData', optionsJson)
    } else {
      const params = new URLSearchParams()
      if (options?.onlyFiltered) params.append('onlyFiltered', 'true')
      if (options?.filteredRowIds) params.append('filteredRowIds', JSON.stringify(options.filteredRowIds))
      if (options?.columnNames) params.append('columnNames', JSON.stringify(options.columnNames))

      const query = params.toString() ? `?${params.toString()}` : ''
      return this.request<GridRow[]>(`/export${query}`)
    }
  }

  /**
   * Get grid configuration
   */
  async getConfig(): Promise<ApiResponse<GridConfig>> {
    if (this.isHostMode) {
      return this.callHostApi<GridConfig>('GetConfig')
    } else {
      return this.request<GridConfig>('/config')
    }
  }

  /**
   * Set validation rules
   */
  async setValidationRules(rules: ValidationRule[]): Promise<ApiResponse<void>> {
    if (this.isHostMode) {
      const jsonRules = JSON.stringify({ rules })
      return this.callHostApi<void>('SetValidationRules', jsonRules)
    } else {
      return this.request<void>('/validation-rules', {
        method: 'POST',
        body: JSON.stringify({ rules })
      })
    }
  }

  /**
   * Get validation rules
   */
  async getValidationRules(): Promise<ApiResponse<ValidationRule[]>> {
    if (this.isHostMode) {
      return this.callHostApi<ValidationRule[]>('GetValidationRules')
    } else {
      return this.request<ValidationRule[]>('/validation-rules')
    }
  }

  /**
   * Get all column names (data columns + checkbox special column)
   */
  async getColumnNames(): Promise<ApiResponse<string[]>> {
    if (this.isHostMode) {
      const result = await this.callHostApi<{ columnNames: string[] }>('GetColumnNames')
      return {
        success: result.success,
        data: result.data?.columnNames,
        error: result.error
      }
    } else {
      return this.request<string[]>('/columns')
    }
  }

  /**
   * Get column definitions
   */
  async getColumns(): Promise<ApiResponse<any[]>> {
    if (this.isHostMode) {
      return this.callHostApi<any[]>('GetColumns')
    } else {
      return this.request<any[]>('/columns/definitions')
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (this.isHostMode) {
        const result = await this.callHostApi<any>('HealthCheck')
        return result.success
      } else {
        const response = await fetch('http://localhost:5000/health')
        return response.ok
      }
    } catch {
      return false
    }
  }

  // ✅ RIEŠENIE #6C: ListBox API methods

  /**
   * Register a listbox component for API access
   * @param listBoxId Unique identifier for the listbox
   * @param listBoxRef Reference to the listbox component instance
   */
  registerListBox(listBoxId: string, listBoxRef: ListBoxRef): void {
    this.listBoxRegistry.set(listBoxId, listBoxRef)
    console.log(`[GridAPI] ListBox registered: ${listBoxId}`)
  }

  /**
   * Unregister a listbox component
   * @param listBoxId Unique identifier for the listbox
   */
  unregisterListBox(listBoxId: string): void {
    this.listBoxRegistry.delete(listBoxId)
    console.log(`[GridAPI] ListBox unregistered: ${listBoxId}`)
  }

  /**
   * Clear listbox selection (can be called from desktop app)
   * @param listBoxId Unique identifier for the listbox
   */
  clearListBoxSelection(listBoxId: string): ApiResponse<void> {
    const listBoxRef = this.listBoxRegistry.get(listBoxId)
    if (listBoxRef) {
      listBoxRef.clearSelection()
      console.log(`[GridAPI] ListBox selection cleared: ${listBoxId}`)
      return {
        success: true,
        message: `ListBox '${listBoxId}' selection cleared`
      }
    } else {
      console.warn(`[GridAPI] ListBox not found: ${listBoxId}`)
      return {
        success: false,
        error: `ListBox not found: ${listBoxId}`
      }
    }
  }

  /**
   * Get listbox current selection (can be called from desktop app)
   * @param listBoxId Unique identifier for the listbox
   */
  getListBoxSelection(listBoxId: string): ApiResponse<string[]> {
    const listBoxRef = this.listBoxRegistry.get(listBoxId)
    if (listBoxRef) {
      const selectedValues = listBoxRef.getSelectedValues()
      console.log(`[GridAPI] ListBox selection retrieved: ${listBoxId}`, selectedValues)
      return {
        success: true,
        data: selectedValues
      }
    } else {
      console.warn(`[GridAPI] ListBox not found: ${listBoxId}`)
      return {
        success: false,
        error: `ListBox not found: ${listBoxId}`
      }
    }
  }

  // ✅ RIEŠENIE #7: New API methods

  /**
   * Get listbox configuration from backend (items, settings)
   * @param listBoxId Unique identifier for the listbox
   */
  async getListBoxConfig(listBoxId: string): Promise<ApiResponse<any>> {
    if (this.isHostMode) {
      return this.callHostApi<any>('GetListBoxConfig', listBoxId)
    } else {
      return this.request<any>(`/listbox/${listBoxId}/config`)
    }
  }

  /**
   * Get theme configuration from backend (colors, styles)
   */
  async getThemeConfig(): Promise<ApiResponse<any>> {
    if (this.isHostMode) {
      return this.callHostApi<any>('GetThemeConfig')
    } else {
      return this.request<any>('/theme/config')
    }
  }
}

export const gridApi = new GridApiService()
