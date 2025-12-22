using System.Runtime.InteropServices;
using System.Text.Json;
using RB0120Desktop.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Web.WebView2.Core;

namespace RB0120Desktop.HostObjects;

/// <summary>
/// ListBox item data structure
/// </summary>
public class ListBoxItemData
{
    public string Value { get; set; } = "";
    public string Label { get; set; } = "";
    public string? Category { get; set; }
    public string? Icon { get; set; }
    public bool? Disabled { get; set; }
}

/// <summary>
/// ListBox configuration data structure
/// Táto štruktúra sa POSIELA do funkcie GetListBoxConfig
/// </summary>
public class ListBoxConfigData
{
    public string Title { get; set; } = "";
    public List<ListBoxItemData> Items { get; set; } = new();
    public bool MultiSelect { get; set; } = false;
    public int Height { get; set; } = 200;
    public int Width { get; set; } = 250;
    public string? Placeholder { get; set; }
    public bool ShowResetButton { get; set; } = true;
}

/// <summary>
/// Theme configuration for DataGrid
/// </summary>
public class DataGridTheme
{
    public string HeaderBackground { get; set; } = "#2c3e50";
    public string HeaderColor { get; set; } = "#ffffff";
    public string HeaderBorderColor { get; set; } = "#34495e";
    public string RowBackground { get; set; } = "#ffffff";
    public string RowAlternateBackground { get; set; } = "#f8f9fa";
    public string RowHoverBackground { get; set; } = "#e3f2fd";
    public string RowSelectedBackground { get; set; } = "#bbdefb";
    public string RowBorderColor { get; set; } = "#dee2e6";
    public string TextColor { get; set; } = "#212529";
    public string TextColorSecondary { get; set; } = "#6c757d";
    public string ErrorBackground { get; set; } = "#ffebee";
    public string ErrorColor { get; set; } = "#c62828";
    public string WarningBackground { get; set; } = "#fff3e0";
    public string WarningColor { get; set; } = "#ef6c00";
}

/// <summary>
/// Theme configuration for ListBox
/// </summary>
public class ListBoxTheme
{
    public string Background { get; set; } = "#ffffff";
    public string BorderColor { get; set; } = "#ced4da";
    public string ItemBackground { get; set; } = "#ffffff";
    public string ItemHoverBackground { get; set; } = "#f8f9fa";
    public string ItemSelectedBackground { get; set; } = "#007bff";
    public string ItemSelectedColor { get; set; } = "#ffffff";
    public string ItemColor { get; set; } = "#212529";
    public string ResetButtonBackground { get; set; } = "#6c757d";
    public string ResetButtonHoverBackground { get; set; } = "#5a6268";
    public string ResetButtonColor { get; set; } = "#ffffff";
}

/// <summary>
/// Complete theme configuration data structure
/// Táto štruktúra sa POSIELA do funkcie GetThemeConfig
/// </summary>
public class ThemeConfigData
{
    public DataGridTheme DataGrid { get; set; } = new();
    public ListBoxTheme ListBox { get; set; } = new();
}

/// <summary>
/// WebView2 Host Object for Grid API
/// Provides JavaScript bridge to C# backend without HTTP server
/// </summary>
[ClassInterface(ClassInterfaceType.AutoDual)]
[ComVisible(true)]
public partial class GridApi
{
    private readonly CoreWebView2 _webView;
    private readonly ILogger<GridApi> _logger;

    public GridApi(CoreWebView2 webView, ILogger<GridApi>? logger = null)
    {
        _webView = webView;
        _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<GridApi>.Instance;
    }

    // ===== REMOVED: Old UserDataManager methods replaced with universal JavaScript API calls =====
    // - GetData() → Use GetDataFromTableAsync(tableId)
    // - LoadSampleData() → Use LoadSampleDataToTableAsync(tableId, rowCount)

    /// <summary>
    /// Generate sample data for testing
    /// </summary>
    private List<GridRow> GenerateSampleData(int rowCount)
    {
        var random = new Random(42); // Fixed seed for reproducibility
        var rows = new List<GridRow>();

        var firstNames = new[] { "John", "Jane", "Michael", "Sarah", "Robert", "Emily", "David", "Lisa", "James", "Mary" };
        var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez" };
        var cities = new[] { "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose" };
        var countries = new[] { "USA", "Canada", "UK", "Germany", "France", "Spain", "Italy", "Australia", "Japan", "Brazil" };
        var companies = new[] { "TechCorp", "DataSystems", "CloudWorks", "InnoSoft", "NextGen", "CyberTech", "InfoSolutions", "SmartData", "CodeFactory", "DevHub" };
        var positions = new[] { "Developer", "Manager", "Analyst", "Designer", "Engineer", "Consultant", "Architect", "Specialist", "Lead", "Director" };
        var departments = new[] { "IT", "Sales", "Marketing", "Finance", "HR", "Operations", "R&D", "Support", "Legal", "Admin" };
        var statuses = new[] { "Active", "Inactive", "Pending", "On Leave", "Remote" };

        for (int i = 0; i < rowCount; i++)
        {
            var firstName = firstNames[random.Next(firstNames.Length)];
            var lastName = lastNames[random.Next(lastNames.Length)];
            var name = $"{firstName} {lastName}";
            // For first row, create invalid email (no @ sign) to test validation
            var email = i == 0
                ? $"{firstName.ToLower()}.{lastName.ToLower()}example.com"  // Invalid - missing @
                : $"{firstName.ToLower()}.{lastName.ToLower()}@example.com";  // Valid

            var row = new GridRow
            {
                RowId = Guid.NewGuid().ToString(),
                RowHeight = 35.0,
                Checkbox = random.Next(10) > 7, // 30% checked
                Data = new Dictionary<string, object?>
                {
                    ["name"] = name,
                    ["email"] = email,
                    ["age"] = random.Next(22, 65),
                    ["city"] = cities[random.Next(cities.Length)],
                    ["country"] = countries[random.Next(countries.Length)],
                    ["phone"] = $"+1-{random.Next(200, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}",
                    ["company"] = companies[random.Next(companies.Length)],
                    ["position"] = positions[random.Next(positions.Length)],
                    ["salary"] = random.Next(40000, 150000),
                    ["startDate"] = DateTime.Now.AddDays(-random.Next(1, 3650)).ToString("yyyy-MM-dd"),
                    ["department"] = departments[random.Next(departments.Length)],
                    ["manager"] = $"{firstNames[random.Next(firstNames.Length)]} {lastNames[random.Next(lastNames.Length)]}",
                    ["status"] = statuses[random.Next(statuses.Length)],
                    ["notes"] = random.Next(10) > 7 ? $"Note {i + 1}: Sample comment" : ""
                }
            };

            rows.Add(row);
        }

        return rows;
    }

    // ===== REMOVED: Import/Export methods (replaced with direct table API) =====
    // - ImportData() → Use LoadDataToTableAsync(tableId, data)
    // - ExportData() → Use GetDataFromTableAsync(tableId)

    /// <summary>
    /// Get grid configuration
    /// </summary>
    public string GetConfig()
    {
        try
        {
            var config = new GridConfigDTO
            {
                PageSize = 100,
                EnableSort = true,
                EnableFilter = true,
                EnableSearch = true,
                EnableValidation = true,
                ShowRowNumber = true,
                ShowCheckbox = true,
                ShowValidationAlerts = true,
                MinRowHeight = 35.0,
                MaxRowHeight = 200.0
            };

            return JsonSerializer.Serialize(new
            {
                success = true,
                data = config
            });
        }
        catch (Exception ex)
        {
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    // ===== REMOVED: Validation and column methods (replaced with direct table API) =====
    // - SetValidationRules() → Use AddValidationRuleAsync(tableId, rule)
    // - GetValidationRules() → Managed in frontend store
    // - GetColumnNames() → Use GetColumns() for column definitions

    /// <summary>
    /// Get column definitions for grid
    /// </summary>
    public string GetColumns()
    {
        try
        {
            var columns = new List<object>
            {
                // Full properties - all defined
                new { name = "name", header = "Name", width = 150, minWidth = 100, maxWidth = 300, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },
                new { name = "email", header = "Email", width = 200, minWidth = 120, maxWidth = 400, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },

                // Missing minWidth, maxWidth - will use defaults (50, 200)
                new { name = "age", header = "Age", width = 100, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = false },

                // Missing isSortable, isFilterable - will use defaults (false, false)
                new { name = "city", header = "City", width = 150, minWidth = 100, maxWidth = 250, isVisible = true, isReadOnly = false },

                // Missing all optional properties - will use all defaults
                new { name = "country", header = "Country", width = 150, isVisible = true, isReadOnly = false },

                // Full properties
                new { name = "phone", header = "Phone", width = 150, minWidth = 120, maxWidth = 200, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },

                // Only sort enabled, rest defaults
                new { name = "company", header = "Company", width = 200, isVisible = true, isReadOnly = false, isSortable = true ,visibleForGrid=false},

                // Only filter enabled, rest defaults
                new { name = "position", header = "Position", width = 150, isVisible = true, isReadOnly = false, isFilterable = true },

                // Full properties
                new { name = "salary", header = "Salary", width = 120, minWidth = 100, maxWidth = 180, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },

                // All defaults
                new { name = "startDate", header = "Start Date", width = 120, isVisible = true, isReadOnly = false },

                // Full properties
                new { name = "department", header = "Department", width = 150, minWidth = 120, maxWidth = 250, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },
                new { name = "manager", header = "Manager", width = 150, minWidth = 120, maxWidth = 250, isVisible = true, isReadOnly = false, isSortable = true, isFilterable = true },

                // Only minWidth explicit, rest defaults
                new { name = "status", header = "Status", width = 100, minWidth = 80, isVisible = true, isReadOnly = false },

                // Explicitly disabled
                new { name = "notes", header = "Notes", width = 250, minWidth = 150, maxWidth = 500, isVisible = true, isReadOnly = false, isSortable = false, isFilterable = false }
            };

            return JsonSerializer.Serialize(new
            {
                success = true,
                data = columns
            });
        }
        catch (Exception ex)
        {
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    // ===== NEW UNIVERSAL METHODS - Call JavaScript API directly via ExecuteScriptAsync =====

    /// <summary>
    /// ✅ WRAPPER METHOD: Generate sample data and load into ANY table
    /// This is temporary for testing - later will be removed
    ///
    /// USAGE:
    ///   await LoadSampleDataToTableAsync("table1", 1000);
    /// </summary>
    public async Task<string> LoadSampleDataToTableAsync(string tableId, int rowCount)
    {
        try
        {
            _logger.LogInformation($"[GridApi] LoadSampleDataToTableAsync: {tableId}, rowCount: {rowCount}");

            // 1. Generate sample data (temporary - for testing)
            var data = GenerateSampleData(rowCount);

            // 2. Load into table using universal method
            return await LoadDataToTableAsync(tableId, data);
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] LoadSampleDataToTableAsync exception: {ex.Message}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ UNIVERSAL METHOD: Load data into ANY table via JavaScript API
    ///
    /// USAGE:
    ///   var data = GetDataFromSomewhere();
    ///   await LoadDataToTableAsync("table1", data);
    ///   await LoadDataToTableAsync("table2", data);
    /// </summary>
    public async Task<string> LoadDataToTableAsync(string tableId, List<GridRow> data)
    {
        try
        {
            _logger.LogInformation($"[GridApi] LoadDataToTableAsync: {tableId}, rowCount: {data.Count}");

            // ✅ RIEŠENIE: Transform GridRow objects to flat structure expected by frontend
            var flattenedData = data.Select(row => {
                // Create flat object with all properties at root level
                var flatObj = new Dictionary<string, object?>();

                // Add special properties with __ prefix (frontend expects this)
                flatObj["__rowId"] = row.RowId;
                flatObj["__rowHeight"] = row.RowHeight ?? 40.0;

                // Flatten Data dictionary to root level
                foreach (var kvp in row.Data)
                {
                    flatObj[kvp.Key] = kvp.Value;
                }

                return flatObj;
            }).ToList();

            // Serialize flattened data to JSON
            var jsonData = JsonSerializer.Serialize(flattenedData, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            // ✅ FIX: Escape JSON string for safe embedding in JavaScript
            var escapedJsonData = jsonData
                .Replace("\\", "\\\\")   // Escape backslashes first
                .Replace("\"", "\\\"")   // Escape quotes
                .Replace("\n", "\\n")    // Escape newlines
                .Replace("\r", "\\r");   // Escape carriage returns

            // Call JavaScript API to load data into table
            var script = $@"
                (function() {{
                    try {{
                        // ✅ CRITICAL: Check if window.__tableAPI exists
                        if (typeof window.__tableAPI === 'undefined') {{
                            return JSON.stringify({{
                                success: false,
                                error: 'window.__tableAPI is undefined - frontend not initialized yet',
                                debug: {{
                                    hasTableAPI: false,
                                    hasTableRefs: typeof window.__tableRefs !== 'undefined',
                                    timestamp: new Date().toISOString()
                                }}
                            }});
                        }}

                        // ✅ CRITICAL: Check if window.__tableRefs exists
                        if (typeof window.__tableRefs === 'undefined') {{
                            return JSON.stringify({{
                                success: false,
                                error: 'window.__tableRefs is undefined',
                                debug: {{
                                    hasTableAPI: true,
                                    hasTableRefs: false,
                                    timestamp: new Date().toISOString()
                                }}
                            }});
                        }}

                        // ✅ CRITICAL: Check if specific table ref exists
                        if (!window.__tableRefs['{tableId}']) {{
                            const availableTables = Object.keys(window.__tableRefs);
                            return JSON.stringify({{
                                success: false,
                                error: 'Table ref not found: {tableId}',
                                debug: {{
                                    requestedTable: '{tableId}',
                                    availableTables: availableTables,
                                    tableCount: availableTables.length,
                                    timestamp: new Date().toISOString()
                                }}
                            }});
                        }}

                        // ✅ Parse JSON data safely
                        const jsonString = ""{escapedJsonData}"";
                        const data = JSON.parse(jsonString);

                        // ✅ Call loadData and capture result
                        const result = window.__tableAPI.loadData('{tableId}', data);

                        return JSON.stringify({{
                            success: result,
                            rowCount: {data.Count},
                            tableId: '{tableId}',
                            debug: {{
                                dataLength: data.length,
                                loadDataResult: result,
                                timestamp: new Date().toISOString()
                            }}
                        }});
                    }} catch (err) {{
                        return JSON.stringify({{
                            success: false,
                            error: 'Exception: ' + err.message,
                            debug: {{
                                errorName: err.name,
                                errorMessage: err.message,
                                errorStack: err.stack || 'no stack',
                                timestamp: new Date().toISOString()
                            }}
                        }});
                    }}
                }})()
            ";

            var resultJson = await _webView.ExecuteScriptAsync(script);

            _logger.LogInformation($"[GridApi] ✅ LoadDataToTableAsync result: {resultJson}");
            return resultJson;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] LoadDataToTableAsync exception: {ex.Message}");
            _logger.LogError($"[GridApi] Stack trace: {ex.StackTrace}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ UNIVERSAL METHOD: Get data from ANY table via JavaScript API
    ///
    /// USAGE:
    ///   var dataFromTable1 = await GetDataFromTableAsync("table1");
    ///   // Process data in C#
    ///   foreach (var row in dataFromTable1) { ... }
    ///   // Send to another table
    ///   await LoadDataToTableAsync("table3", dataFromTable1);
    /// </summary>
    public async Task<List<GridRow>> GetDataFromTableAsync(string tableId)
    {
        try
        {
            _logger.LogInformation($"[GridApi] GetDataFromTableAsync: {tableId}");

            // Call JavaScript API to get data from table
            var script = $@"
                (function() {{
                    try {{
                        if (!window.__tableAPI) {{
                            return JSON.stringify([]);
                        }}

                        const data = window.__tableAPI.getData('{tableId}');
                        return JSON.stringify(data);
                    }} catch (err) {{
                        console.error('[GridApi] GetDataFromTableAsync error:', err);
                        return JSON.stringify([]);
                    }}
                }})()
            ";

            var resultJson = await _webView.ExecuteScriptAsync(script);

            // Remove extra quotes that ExecuteScriptAsync adds
            if (resultJson.StartsWith("\"") && resultJson.EndsWith("\""))
            {
                resultJson = resultJson.Substring(1, resultJson.Length - 2);
                resultJson = resultJson.Replace("\\\"", "\"");
            }

            var data = JsonSerializer.Deserialize<List<GridRow>>(resultJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new List<GridRow>();

            _logger.LogInformation($"[GridApi] ✅ GetDataFromTableAsync received {data.Count} rows from {tableId}");
            return data;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetDataFromTableAsync exception: {ex.Message}");
            return new List<GridRow>();
        }
    }

    /// <summary>
    /// ✅ UNIVERSAL METHOD: Update cell in ANY table via JavaScript API
    ///
    /// USAGE:
    ///   await UpdateCellAsync("table1", rowId, "name", "New Name");
    /// </summary>
    public async Task<string> UpdateCellAsync(string tableId, string rowId, string columnName, object value)
    {
        try
        {
            _logger.LogInformation($"[GridApi] UpdateCellAsync: {tableId}.{rowId}.{columnName}");

            var jsonValue = JsonSerializer.Serialize(value);

            var script = $@"
                (function() {{
                    try {{
                        if (!window.__tableAPI) {{
                            return JSON.stringify({{ success: false, error: 'TableAPI not initialized' }});
                        }}

                        const result = window.__tableAPI.updateCell('{tableId}', '{rowId}', '{columnName}', {jsonValue});
                        return JSON.stringify({{ success: result, tableId: '{tableId}' }});
                    }} catch (err) {{
                        return JSON.stringify({{ success: false, error: err.message }});
                    }}
                }})()
            ";

            var resultJson = await _webView.ExecuteScriptAsync(script);
            _logger.LogInformation($"[GridApi] ✅ UpdateCellAsync result: {resultJson}");
            return resultJson;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] UpdateCellAsync exception: {ex.Message}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ UNIVERSAL METHOD: Delete row from ANY table via JavaScript API
    ///
    /// USAGE:
    ///   await DeleteRowAsync("table1", rowId);
    /// </summary>
    public async Task<string> DeleteRowAsync(string tableId, string rowId)
    {
        try
        {
            _logger.LogInformation($"[GridApi] DeleteRowAsync: {tableId}.{rowId}");

            var script = $@"
                (function() {{
                    try {{
                        if (!window.__tableAPI) {{
                            return JSON.stringify({{ success: false, error: 'TableAPI not initialized' }});
                        }}

                        const result = window.__tableAPI.deleteRow('{tableId}', '{rowId}');
                        return JSON.stringify({{ success: result, tableId: '{tableId}' }});
                    }} catch (err) {{
                        return JSON.stringify({{ success: false, error: err.message }});
                    }}
                }})()
            ";

            var resultJson = await _webView.ExecuteScriptAsync(script);
            _logger.LogInformation($"[GridApi] ✅ DeleteRowAsync result: {resultJson}");
            return resultJson;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] DeleteRowAsync exception: {ex.Message}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// Health check
    /// </summary>
    public string HealthCheck()
    {
        return JsonSerializer.Serialize(new
        {
            success = true,
            status = "healthy",
            timestamp = DateTime.UtcNow
        });
    }

    // ===== RIEŠENIE #4: HLAVNÉ FUNKCIE - PRIJÍMAJÚ DÁTA, NEPOZNAJÚ ZDROJ =====

    /// <summary>
    /// Získa konfiguráciu ListBoxu - HLAVNÁ FUNKCIA
    ///
    /// DÔLEŽITÉ: Táto funkcia PRIJÍMA dáta ako parameter!
    /// - NEPOZNÁ odkiaľ dáta prišli (JSON, DB, IO, ...)
    /// - Len ich VALIDUJE a SFORMÁTUJE do API response
    /// - NIKDY SA NEMENÍ pri zmene zdroja dát
    ///
    /// Volajúci kód je zodpovedný za:
    /// - Načítanie dát zo zdroja (JSON/DB/IO)
    /// - Prípravu dát do ListBoxConfigData štruktúry
    /// - Zavolanie tejto funkcie s pripraveými dátami
    /// </summary>
    /// <param name="listBoxId">ID listboxu (pre logovanie)</param>
    /// <param name="configData">Pripravené konfiguračné dáta</param>
    /// <returns>JSON string s API response</returns>
    public string GetListBoxConfig(string listBoxId, ListBoxConfigData configData)
    {
        try
        {
            _logger.LogInformation($"[GridApi] GetListBoxConfig called for: {listBoxId}");

            // ===== VALIDÁCIA VSTUPNÝCH DÁT =====
            if (configData == null)
            {
                _logger.LogError($"[GridApi] configData is null for: {listBoxId}");
                return JsonSerializer.Serialize(new
                {
                    success = false,
                    error = "Configuration data is null"
                });
            }

            if (string.IsNullOrEmpty(configData.Title))
            {
                _logger.LogWarning($"[GridApi] Title is empty for: {listBoxId}, using default");
                configData.Title = $"ListBox {listBoxId}";
            }

            if (configData.Items == null)
            {
                _logger.LogWarning($"[GridApi] Items is null for: {listBoxId}, using empty list");
                configData.Items = new List<ListBoxItemData>();
            }

            // Validuj rozmery
            if (configData.Height < 50) configData.Height = 50;
            if (configData.Height > 1000) configData.Height = 1000;
            if (configData.Width < 100) configData.Width = 100;
            if (configData.Width > 800) configData.Width = 800;

            // ===== FORMÁTOVANIE DO API RESPONSE =====
            var response = new
            {
                success = true,
                data = new
                {
                    title = configData.Title,
                    items = configData.Items,
                    multiSelect = configData.MultiSelect,
                    height = configData.Height,
                    width = configData.Width,
                    placeholder = configData.Placeholder ?? "Vyberte možnosť...",
                    showResetButton = configData.ShowResetButton
                }
            };

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _logger.LogInformation($"[GridApi] GetListBoxConfig response prepared for '{listBoxId}': {configData.Items.Count} items");
            return jsonResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetListBoxConfig error: {ex.Message}");
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Získa konfiguráciu themes - HLAVNÁ FUNKCIA
    ///
    /// DÔLEŽITÉ: Táto funkcia PRIJÍMA dáta ako parameter!
    /// - NEPOZNÁ odkiaľ dáta prišli (JSON, DB, IO, ...)
    /// - Len ich VALIDUJE a SFORMÁTUJE do API response
    /// - NIKDY SA NEMENÍ pri zmene zdroja dát
    ///
    /// Volajúci kód je zodpovedný za:
    /// - Načítanie dát zo zdroja (JSON/DB/IO)
    /// - Prípravu dát do ThemeConfigData štruktúry
    /// - Zavolanie tejto funkcie s pripraveými dátami
    /// </summary>
    /// <param name="themeData">Pripravené theme dáta</param>
    /// <returns>JSON string s API response</returns>
    public string GetThemeConfig(ThemeConfigData themeData)
    {
        try
        {
            _logger.LogInformation("[GridApi] GetThemeConfig called with provided data");

            // ===== VALIDÁCIA VSTUPNÝCH DÁT =====
            if (themeData == null)
            {
                _logger.LogError("[GridApi] themeData is null");
                return JsonSerializer.Serialize(new
                {
                    success = false,
                    error = "Theme configuration data is null"
                });
            }

            if (themeData.DataGrid == null)
            {
                _logger.LogWarning("[GridApi] DataGrid theme is null, using default");
                themeData.DataGrid = new DataGridTheme();
            }

            if (themeData.ListBox == null)
            {
                _logger.LogWarning("[GridApi] ListBox theme is null, using default");
                themeData.ListBox = new ListBoxTheme();
            }

            // ===== FORMÁTOVANIE DO API RESPONSE =====
            var response = new
            {
                success = true,
                data = new
                {
                    dataGrid = themeData.DataGrid,
                    listBox = themeData.ListBox
                }
            };

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _logger.LogInformation("[GridApi] GetThemeConfig response prepared");
            return jsonResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetThemeConfig error: {ex.Message}");
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    // ===== OVERLOAD METÓDY - volajú hlavné funkcie s dátami načítanými z JSON =====

    /// <summary>
    /// OVERLOAD: GetListBoxConfig bez explicit data parameter
    /// Načíta dáta z JSON a zavolá hlavnú funkciu
    ///
    /// KEĎ PREJDEŠ NA DATABÁZU:
    /// - Zmeň len túto metódu (načítaj z DB namiesto JSON)
    /// - Hlavná funkcia GetListBoxConfig(listBoxId, configData) ZOSTÁVA ROVNAKÁ!
    /// </summary>
    public string GetListBoxConfig(string listBoxId)
    {
        try
        {
            _logger.LogInformation($"[GridApi] GetListBoxConfig (auto-load from JSON) called for: {listBoxId}");

            // ===== NAČÍTANIE DÁT Z JSON =====
            var configData = LoadListBoxConfigFromJson(listBoxId);

            // Ak sa nepodarilo načítať, použi default
            if (configData == null)
            {
                _logger.LogWarning($"[GridApi] Failed to load config for '{listBoxId}', using default");
                configData = CreateDefaultListBoxConfig(listBoxId);
            }

            // ===== ZAVOLAJ HLAVNÚ FUNKCIU S DÁTAMI =====
            return GetListBoxConfig(listBoxId, configData);
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetListBoxConfig (auto-load) error: {ex.Message}");
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// OVERLOAD: GetThemeConfig bez explicit data parameter
    /// Načíta dáta z JSON a zavolá hlavnú funkciu
    ///
    /// KEĎ PREJDEŠ NA DATABÁZU:
    /// - Zmeň len túto metódu (načítaj z DB namiesto JSON)
    /// - Hlavná funkcia GetThemeConfig(themeData) ZOSTÁVA ROVNAKÁ!
    /// </summary>
    public string GetThemeConfig()
    {
        try
        {
            _logger.LogInformation("[GridApi] GetThemeConfig (auto-load from JSON) called");

            // ===== NAČÍTANIE DÁT Z JSON =====
            var themeData = LoadThemeConfigFromJson();

            // Ak sa nepodarilo načítať, použi default
            if (themeData == null)
            {
                _logger.LogWarning("[GridApi] Failed to load theme config, using default");
                themeData = CreateDefaultThemeConfig();
            }

            // ===== ZAVOLAJ HLAVNÚ FUNKCIU S DÁTAMI =====
            return GetThemeConfig(themeData);
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetThemeConfig (auto-load) error: {ex.Message}");
            return JsonSerializer.Serialize(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    // ===== HELPER FUNKCIE - načítanie dát zo zdrojov =====
    // TIETO funkcie SA MENIA keď zmeníš zdroj (JSON → DB → IO)
    // Hlavné funkcie vyššie SA NEMENIA!

    /// <summary>
    /// Helper: Načíta ListBox config z JSON súboru
    ///
    /// KEĎ PREJDEŠ NA DATABÁZU:
    /// - Nahraď túto metódu s LoadListBoxConfigFromDatabase()
    /// - Alebo vytvor LoadListBoxConfigFromDatabase() a volaj tú namiesto tejto
    /// </summary>
    private ListBoxConfigData? LoadListBoxConfigFromJson(string listBoxId)
    {
        try
        {
            var configPath = Path.Combine(AppContext.BaseDirectory, "config");
            var filePath = Path.Combine(configPath, $"{listBoxId}.json");

            if (!File.Exists(filePath))
            {
                _logger.LogWarning($"[GridApi] Config file not found: {filePath}");
                return null;
            }

            _logger.LogInformation($"[GridApi] Loading config from: {filePath}");

            var jsonContent = File.ReadAllText(filePath);
            var config = JsonSerializer.Deserialize<ListBoxConfigData>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (config == null)
            {
                _logger.LogError($"[GridApi] Failed to deserialize: {filePath}");
                return null;
            }

            _logger.LogInformation($"[GridApi] Loaded config for '{listBoxId}': {config.Items.Count} items");
            return config;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] Error loading from JSON: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Helper: Načíta Theme config z JSON súboru
    /// </summary>
    private ThemeConfigData? LoadThemeConfigFromJson()
    {
        try
        {
            var configPath = Path.Combine(AppContext.BaseDirectory, "config");
            var filePath = Path.Combine(configPath, "theme.json");

            if (!File.Exists(filePath))
            {
                _logger.LogWarning($"[GridApi] Theme config file not found: {filePath}");
                return null;
            }

            _logger.LogInformation($"[GridApi] Loading theme from: {filePath}");

            var jsonContent = File.ReadAllText(filePath);
            var config = JsonSerializer.Deserialize<ThemeConfigData>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (config == null)
            {
                _logger.LogError($"[GridApi] Failed to deserialize theme config");
                return null;
            }

            _logger.LogInformation("[GridApi] Theme config loaded successfully");
            return config;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] Error loading theme from JSON: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Helper: Vytvorí default ListBox config
    /// </summary>
    private ListBoxConfigData CreateDefaultListBoxConfig(string listBoxId)
    {
        return new ListBoxConfigData
        {
            Title = $"ListBox {listBoxId}",
            MultiSelect = false,
            Height = 200,
            Width = 250,
            Placeholder = "Vyberte možnosť...",
            ShowResetButton = true,
            Items = new List<ListBoxItemData>
            {
                new() { Value = "default1", Label = "Default možnosť 1" },
                new() { Value = "default2", Label = "Default možnosť 2" }
            }
        };
    }

    /// <summary>
    /// Helper: Vytvorí default Theme config
    /// </summary>
    private ThemeConfigData CreateDefaultThemeConfig()
    {
        return new ThemeConfigData
        {
            DataGrid = new DataGridTheme(),
            ListBox = new ListBoxTheme()
        };
    }

    // ===== CLIENT-SIDE METHODS =====

    /// <summary>
    /// Vyčistí výber v ListBoxe (frontend managed)
    /// </summary>
    public string ClearListBoxSelection(string listBoxId)
    {
        try
        {
            _logger.LogInformation($"[GridApi] ClearListBoxSelection called for: {listBoxId}");
            return JsonSerializer.Serialize(new
            {
                success = true,
                message = $"Selection cleared for {listBoxId}"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] ClearListBoxSelection error: {ex.Message}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// Získa výber v ListBoxe (frontend managed)
    /// </summary>
    public string GetListBoxSelection(string listBoxId)
    {
        try
        {
            _logger.LogInformation($"[GridApi] GetListBoxSelection called for: {listBoxId}");
            return JsonSerializer.Serialize(new
            {
                success = true,
                data = Array.Empty<string>(),
                message = "Selection managed on frontend"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"[GridApi] GetListBoxSelection error: {ex.Message}");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    // ===== VALIDATION RULES METHODS =====

    /// <summary>
    /// ✅ Zasiela všetky validation rules do tabuľky
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    /// </summary>
    /// <param name="tableId">ID tabuľky (napr. "table1", "table2")</param>
    /// <param name="rulesJson">JSON array s validation rules</param>
    public async Task<string> AddValidationRulesAsync(string tableId, string rulesJson)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] AddValidationRulesAsync called for table: {tableId}");
            _logger?.LogDebug($"[GridApi] Rules JSON: {rulesJson}");

            // Parse rules
            var rules = JsonSerializer.Deserialize<List<ValidationRule>>(rulesJson);

            if (rules == null || rules.Count == 0)
            {
                return JsonSerializer.Serialize(new { success = false, error = "No rules provided" });
            }

            // Zaslať pravidlá do frontendu
            var jsCode = $@"
                (function() {{
                    try {{
                        const tableId = {JsonSerializer.Serialize(tableId)};
                        const rules = {rulesJson};

                        // Nájsť tabuľku podľa ID
                        const gridComponent = window.__grids?.[tableId];
                        if (!gridComponent || !gridComponent.validation) {{
                            console.error('[AddValidationRules] Grid not found:', tableId);
                            return false;
                        }}

                        // Pridať všetky pravidlá
                        rules.forEach(rule => {{
                            gridComponent.validation.addValidationRule(rule);
                        }});

                        console.log('[AddValidationRules] Added', rules.length, 'rules to', tableId);
                        return true;
                    }} catch (err) {{
                        console.error('[AddValidationRules] Error:', err);
                        return false;
                    }}
                }})()
            ";

            var result = await _webView.ExecuteScriptAsync(jsCode);

            return JsonSerializer.Serialize(new {
                success = true,
                message = $"Added {rules.Count} validation rules to table {tableId}"
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "[GridApi] AddValidationRulesAsync failed");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ Zasiela jedno validation rule do tabuľky
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    /// </summary>
    /// <param name="tableId">ID tabuľky</param>
    /// <param name="ruleJson">JSON s validation rule</param>
    public async Task<string> AddValidationRuleAsync(string tableId, string ruleJson)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] AddValidationRuleAsync called for table: {tableId}");

            // Zaslať pravidlo do frontendu
            var jsCode = $@"
                (function() {{
                    try {{
                        const tableId = {JsonSerializer.Serialize(tableId)};
                        const rule = {ruleJson};

                        const gridComponent = window.__grids?.[tableId];
                        if (!gridComponent || !gridComponent.validation) {{
                            console.error('[AddValidationRule] Grid not found:', tableId);
                            return false;
                        }}

                        gridComponent.validation.addValidationRule(rule);
                        console.log('[AddValidationRule] Added rule to', tableId, rule);
                        return true;
                    }} catch (err) {{
                        console.error('[AddValidationRule] Error:', err);
                        return false;
                    }}
                }})()
            ";

            var result = await _webView.ExecuteScriptAsync(jsCode);

            return JsonSerializer.Serialize(new {
                success = true,
                message = $"Added validation rule to table {tableId}"
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "[GridApi] AddValidationRuleAsync failed");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ Zruší všetky validation rules na tabuľke
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    /// </summary>
    /// <param name="tableId">ID tabuľky</param>
    public async Task<string> DeleteValidationRulesAsync(string tableId)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] DeleteValidationRulesAsync called for table: {tableId}");

            var jsCode = $@"
                (function() {{
                    try {{
                        const tableId = {JsonSerializer.Serialize(tableId)};

                        const gridComponent = window.__grids?.[tableId];
                        if (!gridComponent || !gridComponent.validation) {{
                            console.error('[DeleteValidationRules] Grid not found:', tableId);
                            return false;
                        }}

                        gridComponent.validation.validationRules.value.clear();
                        gridComponent.validation.ruleCount.value++;
                        console.log('[DeleteValidationRules] Cleared all rules from', tableId);
                        return true;
                    }} catch (err) {{
                        console.error('[DeleteValidationRules] Error:', err);
                        return false;
                    }}
                }})()
            ";

            var result = await _webView.ExecuteScriptAsync(jsCode);

            return JsonSerializer.Serialize(new {
                success = true,
                message = $"Deleted all validation rules from table {tableId}"
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "[GridApi] DeleteValidationRulesAsync failed");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// ✅ Zruší konkrétne validation rule z tabuľky podľa názvu stĺpca
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    /// </summary>
    /// <param name="tableId">ID tabuľky</param>
    /// <param name="ruleName">Názov pravidla (column name)</param>
    public async Task<string> DeleteValidationRuleAsync(string tableId, string ruleName)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] DeleteValidationRuleAsync called for table: {tableId}, rule: {ruleName}");

            var jsCode = $@"
                (function() {{
                    try {{
                        const tableId = {JsonSerializer.Serialize(tableId)};
                        const ruleName = {JsonSerializer.Serialize(ruleName)};

                        const gridComponent = window.__grids?.[tableId];
                        if (!gridComponent || !gridComponent.validation) {{
                            console.error('[DeleteValidationRule] Grid not found:', tableId);
                            return false;
                        }}

                        gridComponent.validation.validationRules.value.delete(ruleName);
                        gridComponent.validation.ruleCount.value++;
                        console.log('[DeleteValidationRule] Deleted rule', ruleName, 'from', tableId);
                        return true;
                    }} catch (err) {{
                        console.error('[DeleteValidationRule] Error:', err);
                        return false;
                    }}
                }})()
            ";

            var result = await _webView.ExecuteScriptAsync(jsCode);

            return JsonSerializer.Serialize(new {
                success = true,
                message = $"Deleted validation rule '{ruleName}' from table {tableId}"
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "[GridApi] DeleteValidationRuleAsync failed");
            return JsonSerializer.Serialize(new { success = false, error = ex.Message });
        }
    }
}

// Request/Response DTOs
public record ImportRequest(List<GridRow> Data);
public record ValidationRulesRequest(List<ValidationRuleDTO> Rules);

/// <summary>
/// Validation Rule model
/// </summary>
public class ValidationRule
{
    public string ColumnName { get; set; } = "";
    public string RuleType { get; set; } = "";  // "Required", "Regex", "Range", "Custom"
    public string ErrorMessage { get; set; } = "";
    public string? RegexPattern { get; set; }
    public object? MinValue { get; set; }
    public object? MaxValue { get; set; }
    public string Severity { get; set; } = "Error";  // "Info", "Warning", "Error", "Critical"
}
public record ExportOptions
{
    public bool OnlyFiltered { get; set; } = false;
    public List<string>? FilteredRowIds { get; set; } = null;
    public List<string>? ColumnNames { get; set; } = null;
}
