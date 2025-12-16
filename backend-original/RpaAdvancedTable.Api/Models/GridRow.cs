namespace RpaAdvancedTable.Api.Models;

/// <summary>
/// Represents a single row in the grid
/// </summary>
public class GridRow
{
    /// <summary>
    /// Unique row identifier (GUID)
    /// </summary>
    public string RowId { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Row height in pixels (auto-calculated or fixed)
    /// </summary>
    public double? RowHeight { get; set; }

    /// <summary>
    /// Checkbox column value (if enabled)
    /// </summary>
    public bool? Checkbox { get; set; }

    /// <summary>
    /// Cell data (column name => cell value)
    /// </summary>
    public Dictionary<string, object?> Data { get; set; } = new();
}

/// <summary>
/// Grid configuration DTO
/// </summary>
public class GridConfigDTO
{
    public int PageSize { get; set; } = 100;
    public bool EnableSort { get; set; } = true;
    public bool EnableFilter { get; set; } = true;
    public bool EnableSearch { get; set; } = true;
    public bool EnableValidation { get; set; } = true;
    public bool ShowRowNumber { get; set; } = false;
    public bool ShowCheckbox { get; set; } = false;
    public bool ShowValidationAlerts { get; set; } = true;
    public double MinRowHeight { get; set; } = 25.0;
    public double MaxRowHeight { get; set; } = 200.0;
}

/// <summary>
/// Validation rule DTO for API
/// </summary>
public class ValidationRuleDTO
{
    public string ColumnName { get; set; } = string.Empty;
    public string RuleType { get; set; } = "Required"; // Required, Regex, Range, Custom
    public string ErrorMessage { get; set; } = string.Empty;
    public string? RegexPattern { get; set; }
    public object? MinValue { get; set; }
    public object? MaxValue { get; set; }
    public string Severity { get; set; } = "Error"; // Info, Warning, Error, Critical
}
