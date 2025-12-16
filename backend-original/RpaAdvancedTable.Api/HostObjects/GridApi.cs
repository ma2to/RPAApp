using System.Runtime.InteropServices;
using System.Text.Json;
using RpaAdvancedTable.Api.Models;
using RpaAdvancedTable.Api.Services;

namespace RpaAdvancedTable.Api.HostObjects;

/// <summary>
/// WebView2 Host Object for Grid API
/// Provides JavaScript bridge to C# backend without HTTP server
/// </summary>
[ClassInterface(ClassInterfaceType.AutoDual)]
[ComVisible(true)]
public class GridApi
{
    private readonly IUserDataManager _userDataManager;
    private readonly string _userId;

    public GridApi(IUserDataManager userDataManager, string userId = "local-user")
    {
        _userDataManager = userDataManager;
        _userId = userId;
    }

    /// <summary>
    /// Get all grid data for current user
    /// Returns JSON string
    /// </summary>
    public string GetData()
    {
        try
        {
            var data = _userDataManager.GetDataAsync(_userId).GetAwaiter().GetResult();

            var response = new
            {
                success = true,
                data = data,
                rowCount = data.Count
            };

            return JsonSerializer.Serialize(response);
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

    /// <summary>
    /// Import data (replaces existing data)
    /// </summary>
    /// <param name="jsonData">JSON string containing grid rows</param>
    public string ImportData(string jsonData)
    {
        try
        {
            var request = JsonSerializer.Deserialize<ImportRequest>(jsonData);
            if (request == null || request.Data == null)
            {
                throw new ArgumentException("Invalid import data");
            }

            _userDataManager.SetDataAsync(_userId, request.Data).GetAwaiter().GetResult();

            return JsonSerializer.Serialize(new
            {
                success = true,
                rowCount = request.Data.Count,
                message = $"Successfully imported {request.Data.Count} rows"
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

    /// <summary>
    /// Export grid data
    /// </summary>
    /// <param name="options">JSON string with export options (onlyFiltered, filteredRowIds, columnNames)</param>
    public string ExportData(string options = "{}")
    {
        try
        {
            var exportOptions = JsonSerializer.Deserialize<ExportOptions>(options) ?? new ExportOptions();
            var data = _userDataManager.GetDataAsync(_userId).GetAwaiter().GetResult();

            // Apply row filters
            if (exportOptions.OnlyFiltered && exportOptions.FilteredRowIds != null && exportOptions.FilteredRowIds.Count > 0)
            {
                var rowIdSet = new HashSet<string>(exportOptions.FilteredRowIds);
                data = data.Where(r => rowIdSet.Contains(r.RowId)).ToList();
            }

            // Apply column filters
            if (exportOptions.ColumnNames != null && exportOptions.ColumnNames.Count > 0)
            {
                var columnSet = new HashSet<string>(exportOptions.ColumnNames);
                var filteredData = new List<GridRow>();

                foreach (var row in data)
                {
                    var filteredRow = new GridRow
                    {
                        RowId = row.RowId,
                        RowHeight = row.RowHeight,
                        Checkbox = columnSet.Contains("Checkbox") ? row.Checkbox : null,
                        Data = new Dictionary<string, object?>()
                    };

                    // Filter Data dictionary by column names
                    if (row.Data != null)
                    {
                        foreach (var kvp in row.Data)
                        {
                            if (columnSet.Contains(kvp.Key))
                            {
                                filteredRow.Data[kvp.Key] = kvp.Value;
                            }
                        }
                    }

                    filteredData.Add(filteredRow);
                }

                data = filteredData;
            }

            return JsonSerializer.Serialize(new
            {
                success = true,
                data = data,
                rowCount = data.Count
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
                MinRowHeight = 25.0,
                MaxRowHeight = 200.0
            };

            return JsonSerializer.Serialize(config);
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

    /// <summary>
    /// Set validation rules for columns
    /// </summary>
    public string SetValidationRules(string jsonRules)
    {
        try
        {
            var request = JsonSerializer.Deserialize<ValidationRulesRequest>(jsonRules);
            if (request == null || request.Rules == null)
            {
                throw new ArgumentException("Invalid validation rules");
            }

            _userDataManager.SetValidationRulesAsync(_userId, request.Rules).GetAwaiter().GetResult();

            return JsonSerializer.Serialize(new
            {
                success = true,
                ruleCount = request.Rules.Count,
                message = $"Successfully set {request.Rules.Count} validation rules"
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

    /// <summary>
    /// Get validation rules for current user
    /// </summary>
    public string GetValidationRules()
    {
        try
        {
            var rules = _userDataManager.GetValidationRulesAsync(_userId).GetAwaiter().GetResult();

            return JsonSerializer.Serialize(new
            {
                success = true,
                rules = rules
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

    /// <summary>
    /// Get all column names (data columns + checkbox special column)
    /// </summary>
    public string GetColumnNames()
    {
        try
        {
            var data = _userDataManager.GetDataAsync(_userId).GetAwaiter().GetResult();
            var columnNames = new HashSet<string>();

            // Extract all unique column names from Data dictionaries
            foreach (var row in data)
            {
                if (row.Data != null)
                {
                    foreach (var key in row.Data.Keys)
                    {
                        columnNames.Add(key);
                    }
                }
            }

            // Add Checkbox special column if it exists in any row
            if (data.Any(r => r.Checkbox.HasValue))
            {
                columnNames.Add("Checkbox");
            }

            return JsonSerializer.Serialize(new
            {
                success = true,
                columnNames = columnNames.OrderBy(c => c).ToList()
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
}

// Request/Response DTOs
public record ImportRequest(List<GridRow> Data);
public record ValidationRulesRequest(List<ValidationRuleDTO> Rules);
public record ExportOptions
{
    public bool OnlyFiltered { get; set; } = false;
    public List<string>? FilteredRowIds { get; set; } = null;
    public List<string>? ColumnNames { get; set; } = null;
}
