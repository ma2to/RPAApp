using System.Runtime.InteropServices;
using System.Text.Json;
using RB0120Desktop.Models;
using RB0120Desktop.Services;

namespace RB0120Desktop.HostObjects;

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
    /// Generate and load sample data into UserDataManager
    /// Called from frontend button click
    /// </summary>
    public string LoadSampleData(int rowCount = 1000)
    {
        try
        {
            var data = GenerateSampleData(rowCount);
            _userDataManager.SetDataAsync(_userId, data).GetAwaiter().GetResult();

            return JsonSerializer.Serialize(new
            {
                success = true,
                rowCount = data.Count,
                message = $"Successfully loaded {data.Count} sample rows"
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
                RowHeight = 25.0,
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
                data = rules
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
                new { name = "company", header = "Company", width = 200, isVisible = true, isReadOnly = false, isSortable = true },

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
