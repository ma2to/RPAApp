interface GridApiMethod {
  GetData(): Promise<string>
  ImportData(jsonData: string): Promise<string>
  ExportData(options: string): Promise<string>
  GetConfig(): Promise<string>
  SetValidationRules(jsonRules: string): Promise<string>
  GetValidationRules(): Promise<string>
  HealthCheck(): Promise<string>
}

declare global {
  interface Window {
    gridApi: GridApiMethod
  }
}

export {}
