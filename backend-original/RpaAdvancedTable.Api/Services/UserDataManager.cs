using RpaAdvancedTable.Api.Models;
using System.Collections.Concurrent;

namespace RpaAdvancedTable.Api.Services;

public interface IUserDataManager
{
    Task SetDataAsync(string userId, List<GridRow> data);
    Task<List<GridRow>> GetDataAsync(string userId);
    Task UpdateCellAsync(string userId, string rowId, string columnName, object value);
    Task DeleteRowAsync(string userId, string rowId);
    Task<string> AddRowAsync(string userId, Dictionary<string, object?> rowData);
    Task<string> InsertRowAsync(string userId, string afterRowId, Dictionary<string, object?> rowData);
    Task SetValidationRulesAsync(string userId, List<ValidationRuleDTO> rules);
    Task<List<ValidationRuleDTO>> GetValidationRulesAsync(string userId);
}

/// <summary>
/// Manages data and validation rules per user
/// Uses in-memory storage (ConcurrentDictionary)
/// For production, consider using Redis, SQLite, or database backend
/// </summary>
public class UserDataManager : IUserDataManager
{
    private readonly ConcurrentDictionary<string, List<GridRow>> _userData = new();
    private readonly ConcurrentDictionary<string, List<ValidationRuleDTO>> _validationRules = new();
    private readonly ILogger<UserDataManager> _logger;

    public UserDataManager(ILogger<UserDataManager> logger)
    {
        _logger = logger;
    }

    public Task SetDataAsync(string userId, List<GridRow> data)
    {
        _userData[userId] = data ?? new List<GridRow>();
        _logger.LogInformation("Set data for user {UserId}: {Count} rows", userId, data?.Count ?? 0);
        return Task.CompletedTask;
    }

    public Task<List<GridRow>> GetDataAsync(string userId)
    {
        var data = _userData.GetValueOrDefault(userId, new List<GridRow>());
        return Task.FromResult(data);
    }

    public Task UpdateCellAsync(string userId, string rowId, string columnName, object value)
    {
        if (_userData.TryGetValue(userId, out var rows))
        {
            var row = rows.FirstOrDefault(r => r.RowId == rowId);
            if (row != null)
            {
                // Update cell value in Data dictionary
                if (row.Data.ContainsKey(columnName))
                {
                    row.Data[columnName] = value;
                }
                else
                {
                    row.Data.Add(columnName, value);
                }

                _logger.LogDebug("Updated cell for user {UserId}: Row={RowId}, Column={ColumnName}",
                    userId, rowId, columnName);
            }
            else
            {
                _logger.LogWarning("Row not found for user {UserId}: {RowId}", userId, rowId);
            }
        }
        else
        {
            _logger.LogWarning("No data found for user {UserId}", userId);
        }

        return Task.CompletedTask;
    }

    public Task DeleteRowAsync(string userId, string rowId)
    {
        if (_userData.TryGetValue(userId, out var rows))
        {
            var row = rows.FirstOrDefault(r => r.RowId == rowId);
            if (row != null)
            {
                rows.Remove(row);
                _logger.LogInformation("Deleted row for user {UserId}: {RowId}", userId, rowId);
            }
            else
            {
                _logger.LogWarning("Row not found for deletion, user {UserId}: {RowId}", userId, rowId);
            }
        }

        return Task.CompletedTask;
    }

    public Task<string> AddRowAsync(string userId, Dictionary<string, object?> rowData)
    {
        // Generate new GUID for row
        var rowId = Guid.NewGuid().ToString();

        var newRow = new GridRow
        {
            RowId = rowId,
            RowHeight = 25.0,
            Checkbox = false,
            Data = rowData ?? new Dictionary<string, object?>()
        };

        if (_userData.TryGetValue(userId, out var rows))
        {
            rows.Add(newRow);
        }
        else
        {
            _userData[userId] = new List<GridRow> { newRow };
        }

        _logger.LogInformation("Added new row for user {UserId}: {RowId}", userId, rowId);

        return Task.FromResult(rowId);
    }

    public Task<string> InsertRowAsync(string userId, string afterRowId, Dictionary<string, object?> rowData)
    {
        // Generate new GUID for row
        var rowId = Guid.NewGuid().ToString();

        var newRow = new GridRow
        {
            RowId = rowId,
            RowHeight = 25.0,
            Checkbox = false,
            Data = rowData ?? new Dictionary<string, object?>()
        };

        if (_userData.TryGetValue(userId, out var rows))
        {
            var index = rows.FindIndex(r => r.RowId == afterRowId);
            if (index >= 0)
            {
                // Insert after the specified row
                rows.Insert(index + 1, newRow);
                _logger.LogInformation("Inserted new row after {AfterRowId} for user {UserId}: {RowId}",
                    afterRowId, userId, rowId);
            }
            else
            {
                // If row not found, append to end
                rows.Add(newRow);
                _logger.LogWarning("Row {AfterRowId} not found, appending new row for user {UserId}: {RowId}",
                    afterRowId, userId, rowId);
            }
        }
        else
        {
            _userData[userId] = new List<GridRow> { newRow };
            _logger.LogInformation("Created new data list and added row for user {UserId}: {RowId}", userId, rowId);
        }

        return Task.FromResult(rowId);
    }

    public Task SetValidationRulesAsync(string userId, List<ValidationRuleDTO> rules)
    {
        _validationRules[userId] = rules ?? new List<ValidationRuleDTO>();
        _logger.LogInformation("Set validation rules for user {UserId}: {Count} rules",
            userId, rules?.Count ?? 0);
        return Task.CompletedTask;
    }

    public Task<List<ValidationRuleDTO>> GetValidationRulesAsync(string userId)
    {
        var rules = _validationRules.GetValueOrDefault(userId, new List<ValidationRuleDTO>());
        return Task.FromResult(rules);
    }
}
