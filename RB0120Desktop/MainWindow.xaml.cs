using Microsoft.Extensions.DependencyInjection;
using Microsoft.UI.Xaml;
using Microsoft.Web.WebView2.Core;
using RB0120Desktop.HostObjects;
using RB0120Desktop.Services;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Serilog;
using Serilog.Core;

namespace RB0120Desktop;

public sealed partial class MainWindow : Window
{
    private GridApi? _gridApi;
    private readonly IServiceProvider _serviceProvider;
    private static readonly Logger _fileLogger;

    // Console log throttling to prevent memory pressure
    private int _consoleMessageCount = 0;
    private DateTime _lastConsoleLogTime = DateTime.MinValue;
    private const int MAX_CONSOLE_LOGS_PER_SECOND = 50;

    // Configure Serilog file logging
    static MainWindow()
    {
        var logDirectory = Path.Combine(AppContext.BaseDirectory, "logs");
        var logFilePath = Path.Combine(logDirectory, "rpa-advanced-table.log");

        // Ensure directory exists
        if (!Directory.Exists(logDirectory))
        {
            Directory.CreateDirectory(logDirectory);
        }

        // Configure Serilog
        _fileLogger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.File(
                path: logFilePath,
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 30,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
                shared: true  // Allow multiple loggers to write to same file
            )
            .CreateLogger();

        _fileLogger.Information("=================================================================");
        _fileLogger.Information("RPA Advanced Table Desktop - Starting");
        _fileLogger.Information("Log file: {LogFilePath}", logFilePath);
        _fileLogger.Information("=================================================================");
    }

    // Helper to write to Debug, Console, and File
    private void Log(string message)
    {
        Debug.WriteLine(message);
        Console.WriteLine(message);
        _fileLogger.Information(message);
    }

    /// <summary>
    /// Truncate JSON string to prevent console log overflow
    /// </summary>
    private static string TruncateJson(string json, int maxLength = 200)
    {
        if (string.IsNullOrEmpty(json)) return "";
        if (json.Length <= maxLength) return json;
        return json.Substring(0, maxLength) + "... (truncated)";
    }

    public MainWindow()
    {
        this.InitializeComponent();

        // Set window size
        var appWindow = this.AppWindow;
        appWindow.Resize(new Windows.Graphics.SizeInt32 { Width = 1600, Height = 900 });

        // Center window on screen
        var displayArea = Microsoft.UI.Windowing.DisplayArea.Primary;
        var workArea = displayArea.WorkArea;
        var x = (workArea.Width - 1600) / 2;
        var y = (workArea.Height - 900) / 2;
        appWindow.Move(new Windows.Graphics.PointInt32 { X = x, Y = y });

        // Setup Dependency Injection
        _serviceProvider = ConfigureServices();

        // Register cleanup on window close
        this.Closed += OnWindowClosed;

        // Configure WebView2
        InitializeWebView();
    }

    /// <summary>
    /// Configure services (same as API project)
    /// </summary>
    private IServiceProvider ConfigureServices()
    {
        var services = new ServiceCollection();

        // Register services
        services.AddSingleton<IUserDataManager, UserDataManager>();

        // Register logging with Serilog
        services.AddLogging(builder =>
        {
            builder.AddSerilog(_fileLogger, dispose: false);
        });

        return services.BuildServiceProvider();
    }

    private async void InitializeWebView()
    {
        try
        {
            Log("=== WebView2 Initialization Started ===");
            Log($"AppContext.BaseDirectory: {AppContext.BaseDirectory}");

            await webView.EnsureCoreWebView2Async();
            Log("WebView2 CoreWebView2 initialized");

            // Register ProcessFailed event handler to catch WebView2 crashes
            webView.CoreWebView2.ProcessFailed += CoreWebView2_ProcessFailed;
            Log("ProcessFailed event handler registered");

            // Create GridApi instance with DI
            var userDataManager = _serviceProvider.GetRequiredService<IUserDataManager>();
            _gridApi = new GridApi(userDataManager, userId: "local-user");
            Log("GridApi instance created");

            // Setup WebMessage communication (WinUI3 approach)
            webView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;
            Log("WebMessage handler registered successfully");

            // Enable dev tools for debugging
            webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
            Log("WebView2 settings configured");

            // Capture JavaScript console messages using DevToolsProtocol
            try
            {
                await webView.CoreWebView2.CallDevToolsProtocolMethodAsync("Runtime.enable", "{}");

                webView.CoreWebView2.GetDevToolsProtocolEventReceiver("Runtime.consoleAPICalled")
                    .DevToolsProtocolEventReceived += (sender, args) =>
                    {
                        try
                        {
                            // Throttling: Prevent memory pressure from excessive logging
                            _consoleMessageCount++;
                            var now = DateTime.UtcNow;

                            if ((now - _lastConsoleLogTime).TotalSeconds < 1)
                            {
                                if (_consoleMessageCount > MAX_CONSOLE_LOGS_PER_SECOND)
                                {
                                    // Skip logging if too many messages per second
                                    return;
                                }
                            }
                            else
                            {
                                // Reset counter every second
                                _consoleMessageCount = 0;
                                _lastConsoleLogTime = now;
                            }

                            var json = System.Text.Json.JsonDocument.Parse(args.ParameterObjectAsJson);
                            var type = json.RootElement.GetProperty("type").GetString() ?? "log";
                            var argsArray = json.RootElement.GetProperty("args");

                            var messages = new System.Collections.Generic.List<string>();
                            foreach (var arg in argsArray.EnumerateArray())
                            {
                                if (arg.TryGetProperty("value", out var value))
                                {
                                    // Handle different JSON value types (String, Number, Boolean, Object, Array, Null)
                                    // IMPROVED: Truncate large objects/arrays to prevent console overflow
                                    string stringValue = value.ValueKind switch
                                    {
                                        System.Text.Json.JsonValueKind.String => value.GetString() ?? "",
                                        System.Text.Json.JsonValueKind.Number => value.GetRawText(),
                                        System.Text.Json.JsonValueKind.True => "true",
                                        System.Text.Json.JsonValueKind.False => "false",
                                        System.Text.Json.JsonValueKind.Null => "null",
                                        System.Text.Json.JsonValueKind.Object => TruncateJson(value.GetRawText(), 200),
                                        System.Text.Json.JsonValueKind.Array => TruncateJson(value.GetRawText(), 200),
                                        _ => value.ToString()
                                    };
                                    messages.Add(stringValue);
                                }
                            }

                            var message = string.Join(" ", messages);
                            var level = type.ToUpper();
                            var logMessage = $"[Frontend {level}] {message}";

                            // Write to Debug, Console, and File
                            Debug.WriteLine(logMessage);
                            Console.WriteLine(logMessage);

                            // Use appropriate Serilog level
                            switch (type.ToLower())
                            {
                                case "error":
                                    _fileLogger.Error(logMessage);
                                    break;
                                case "warning":
                                    _fileLogger.Warning(logMessage);
                                    break;
                                default:
                                    _fileLogger.Information(logMessage);
                                    break;
                            }
                        }
                        catch (Exception ex)
                        {
                            _fileLogger.Warning($"[Console Capture] Failed to parse console message: {ex.Message}");
                        }
                    };

                Log("Console message handler registered via DevToolsProtocol - frontend logs will be captured");

                // Also capture JavaScript exceptions
                webView.CoreWebView2.GetDevToolsProtocolEventReceiver("Runtime.exceptionThrown")
                    .DevToolsProtocolEventReceived += (sender, args) =>
                    {
                        try
                        {
                            var json = System.Text.Json.JsonDocument.Parse(args.ParameterObjectAsJson);
                            var exceptionDetails = json.RootElement.GetProperty("exceptionDetails");
                            var text = exceptionDetails.GetProperty("text").GetString() ?? "Unknown error";
                            var url = exceptionDetails.TryGetProperty("url", out var urlProp) ? urlProp.GetString() : "Unknown";
                            var lineNumber = exceptionDetails.TryGetProperty("lineNumber", out var lineProp) ? lineProp.GetInt32() : 0;
                            var columnNumber = exceptionDetails.TryGetProperty("columnNumber", out var colProp) ? colProp.GetInt32() : 0;

                            var errorMessage = $"[Frontend EXCEPTION] {text} at {url}:{lineNumber}:{columnNumber}";
                            _fileLogger.Error(errorMessage);
                            _fileLogger.Error($"[Frontend EXCEPTION] Full details: {args.ParameterObjectAsJson}");
                            Debug.WriteLine(errorMessage);
                            Console.WriteLine(errorMessage);
                        }
                        catch (Exception ex)
                        {
                            _fileLogger.Warning($"[Exception Capture] Failed to parse exception: {ex.Message}");
                        }
                    };

                Log("JavaScript exception handler registered via DevToolsProtocol");
            }
            catch (Exception ex)
            {
                Log($"Warning: Failed to setup console message capture: {ex.Message}");
                _fileLogger.Warning($"Failed to setup console message capture: {ex.Message}");
            }

            // Inject gridApi BEFORE page loads (ensures it's available when Vue initializes)
            await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(@"
                (function() {
                    console.log('[GridAPI] Pre-initializing...');

                    // Create gridApi object that mimics Host Objects API
                    window.gridApi = {
                        _requestId: 0,
                        _pendingRequests: {},

                        _callMethod: function(method, params) {
                            return new Promise((resolve, reject) => {
                                const requestId = 'req_' + (++this._requestId);
                                this._pendingRequests[requestId] = { resolve, reject };
                                console.log('[GridAPI] Stored promise for', requestId, method);

                                const request = {
                                    requestId: requestId,
                                    method: method,
                                    params: params || '{}'
                                };

                                window.chrome.webview.postMessage(JSON.stringify(request));
                                console.log('[GridAPI] Sent request:', method, requestId);
                            });
                        },

                        GetData: function() {
                            return this._callMethod('GetData');
                        },

                        GetConfig: function() {
                            return this._callMethod('GetConfig');
                        },

                        GetValidationRules: function() {
                            return this._callMethod('GetValidationRules');
                        },

                        GetColumns: function() {
                            return this._callMethod('GetColumns');
                        },

                        GetCurrentData: function() {
                            return this._callMethod('GetCurrentData');
                        },

                        HealthCheck: function() {
                            return this._callMethod('HealthCheck');
                        },

                        LoadSampleData: function(rowCount) {
                            return this._callMethod('LoadSampleData', JSON.stringify({ rowCount: rowCount || 1000 }));
                        }

                        // ===== COMMENTED OUT METHODS - Not needed for simplified Desktop→Frontend flow =====
                        // ImportData: function(jsonData) {
                        //     return this._callMethod('ImportData', jsonData);
                        // },
                        // ExportData: function(options) {
                        //     return this._callMethod('ExportData', options);
                        // },
                        // SetValidationRules: function(jsonRules) {
                        //     return this._callMethod('SetValidationRules', jsonRules);
                        // }
                    };

                    // Handle responses from C#
                    window.chrome.webview.addEventListener('message', function(event) {
                        try {
                            const response = JSON.parse(event.data);
                            if (response.requestId && window.gridApi._pendingRequests[response.requestId]) {
                                const { resolve } = window.gridApi._pendingRequests[response.requestId];
                                delete window.gridApi._pendingRequests[response.requestId];
                                resolve(response.result);
                            }
                        } catch (err) {
                            console.error('[GridAPI] Failed to parse response:', err);
                        }
                    });

                    console.log('[GridAPI] Pre-initialized successfully - ready before page load');
                })();
            ");
            Log("GridAPI script injected (before document load)");

            // Capture JavaScript console.log/error
            webView.CoreWebView2.NavigationStarting += (sender, args) =>
            {
                try
                {
                    Log($"[Navigation Starting] URI: {args.Uri}");
                }
                catch (Exception ex)
                {
                    _fileLogger.Error($"[NavigationStarting] Exception: {ex.Message}");
                    _fileLogger.Error($"[NavigationStarting] Stack: {ex.StackTrace}");
                }
            };

            // Disable F5 refresh using JavaScript
            webView.CoreWebView2.NavigationCompleted += async (sender, args) =>
            {
                try
                {
                    Log($"[Navigation Completed] IsSuccess: {args.IsSuccess}, WebErrorStatus: {args.WebErrorStatus}");

                    if (args.IsSuccess)
                    {
                        Log($"Navigation successful to: {sender.Source}");

                        // Test JavaScript execution
                        try
                        {
                            var testResult = await webView.CoreWebView2.ExecuteScriptAsync("document.title");
                            Log($"Document title: {testResult}");
                        }
                        catch (Exception jsEx)
                        {
                            Log($"JavaScript execution failed: {jsEx.Message}");
                        }

                    // COMMENTED OUT: F5 block - This was causing crashes in NavigationCompleted handler
                    // ExecuteScriptAsync from NavigationCompleted can cause reentrancy issues and crashes
                    // Ref: https://github.com/MicrosoftEdge/WebView2Feedback/issues/2668
                    /*
                    await webView.CoreWebView2.ExecuteScriptAsync(@"
                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                        }, true);
                        console.log('[GridAPI] F5 block enabled');
                    ");
                    */
                    Log("[F5 Blocking] Skipped to prevent crashes - can be re-enabled if needed");

                    // Add global JavaScript error handlers - IMPROVED: Log primitive values only
                    await webView.CoreWebView2.ExecuteScriptAsync(@"
                        // Capture unhandled errors
                        window.addEventListener('error', function(event) {
                            const msg = event.message || 'Unknown error';
                            const file = event.filename || 'Unknown file';
                            const line = event.lineno || 0;
                            const col = event.colno || 0;
                            const stack = event.error && event.error.stack ? event.error.stack : 'No stack';
                            console.error('[GLOBAL ERROR] ' + msg + ' at ' + file + ':' + line + ':' + col);
                            console.error('[STACK] ' + stack);
                        });

                        // Capture unhandled promise rejections
                        window.addEventListener('unhandledrejection', function(event) {
                            const reason = event.reason ? String(event.reason) : 'Unknown reason';
                            console.error('[UNHANDLED PROMISE REJECTION] ' + reason);
                            if (event.reason && event.reason.stack) {
                                console.error('[STACK] ' + event.reason.stack);
                            }
                        });

                        console.log('[Error Handlers] Global JavaScript error handlers registered');
                    ");

                    Log("[Global Error Handlers] JavaScript error handlers registered");

                    // Add diagnostic ping after 2 seconds - FIXED: Use DispatcherQueue to avoid threading issues
                    _ = Task.Run(async () =>
                    {
                        await Task.Delay(2000);

                        // Marshal back to UI thread before accessing WebView2
                        DispatcherQueue.TryEnqueue(async () =>
                        {
                            try
                            {
                                await webView.CoreWebView2.ExecuteScriptAsync("console.log('[DIAGNOSTIC] 2 seconds after navigation completed - app still running')");
                            }
                            catch (Exception diagEx)
                            {
                                _fileLogger.Error($"[Diagnostic Ping] Failed: {diagEx.Message}");
                            }
                        });
                    });

                    Log("[Navigation Completed] All initialization complete - waiting for user interaction");
                }
                else
                {
                    Log($"!!! Navigation FAILED: {args.WebErrorStatus}");
                }
                }
                catch (Exception navEx)
                {
                    _fileLogger.Error($"[NavigationCompleted] EXCEPTION: {navEx.Message}");
                    _fileLogger.Error($"[NavigationCompleted] Stack: {navEx.StackTrace}");
                    if (navEx.InnerException != null)
                    {
                        _fileLogger.Error($"[NavigationCompleted] Inner: {navEx.InnerException.Message}");
                    }
                }
            };

            // Determine which mode to use: Production (file://) or Development (http://)
            var appDir = AppContext.BaseDirectory;
            var frontendPath = Path.Combine(appDir, "wwwroot", "index.html");

            Log($"Checking frontend path: {frontendPath}");
            Log($"File exists: {File.Exists(frontendPath)}");

            if (File.Exists(frontendPath))
            {
                // Production mode - use virtual host mapping to avoid CORS issues
                Log("=== PRODUCTION MODE ===");
                Log("API Mode: WebMessage (No HTTP)");

                // Check wwwroot contents
                var wwwrootDir = Path.Combine(appDir, "wwwroot");
                if (Directory.Exists(wwwrootDir))
                {
                    var files = Directory.GetFiles(wwwrootDir, "*.*", SearchOption.AllDirectories);
                    Log($"Files in wwwroot ({files.Length} total):");
                    foreach (var file in files.Take(10))
                    {
                        Log($"  - {Path.GetRelativePath(wwwrootDir, file)}");
                    }
                }

                // Map virtual host to wwwroot folder (avoids CORS issues with file://)
                var virtualHost = "app.local";
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    virtualHost,
                    wwwrootDir,
                    CoreWebView2HostResourceAccessKind.Allow
                );
                Log($"Virtual host mapped: {virtualHost} -> {wwwrootDir}");

                // Navigate to virtual host
                var virtualUrl = $"https://{virtualHost}/index.html";
                Log($"Loading from: {virtualUrl}");
                webView.CoreWebView2.Navigate(virtualUrl);
            }
            else
            {
                // Development mode - load from HTTP dev server
                Log("=== DEVELOPMENT MODE ===");
                Log("Loading from: http://localhost:5173");
                Log("API Mode: HTTP (localhost:5000)");
                Log($"Frontend path not found: {frontendPath}");
                Log("Run 'npm run build' in frontend folder to create production build");

                webView.CoreWebView2.Navigate("http://localhost:5173");
            }

            Log("=== WebView2 Initialization Complete ===");
        }
        catch (Exception ex)
        {
            Log($"!!! FAILED to initialize WebView2 !!!");
            Log($"Exception: {ex.Message}");
            Log($"Stack trace: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                Log($"Inner exception: {ex.InnerException.Message}");
            }
        }
    }

    private void OnWebMessageReceived(CoreWebView2 sender, CoreWebView2WebMessageReceivedEventArgs args)
    {
        try
        {
            var message = args.TryGetWebMessageAsString();
            Log($"[WebMessage Received] {message}");

            // Parse request with case-insensitive property matching
            var jsonOptions = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            var request = System.Text.Json.JsonSerializer.Deserialize<ApiRequest>(message, jsonOptions);

            if (request == null)
            {
                Log("[WebMessage] ERROR: Deserialization returned null");
                Log($"[WebMessage] Raw message: {message}");
                return;
            }

            if (string.IsNullOrEmpty(request.Method))
            {
                Log($"[WebMessage] ERROR: Method is null or empty. RequestId: {request.RequestId}");
                return;
            }

            Log($"[WebMessage] Processing method: {request.Method}, RequestId: {request.RequestId}");

            string result;
            switch (request.Method)
            {
                case "GetData":
                    result = _gridApi!.GetData();
                    break;
                case "GetConfig":
                    result = _gridApi!.GetConfig();
                    break;
                case "GetValidationRules":
                    result = _gridApi!.GetValidationRules();
                    break;
                case "GetColumns":
                    result = _gridApi!.GetColumns();
                    break;
                // case "GetCurrentData":
                //     result = _gridApi!.GetCurrentData();
                //     break;
                case "LoadSampleData":
                    var loadParams = System.Text.Json.JsonSerializer.Deserialize<LoadSampleDataParams>(request.Params ?? "{}");
                    result = _gridApi!.LoadSampleData(loadParams?.RowCount ?? 1000);
                    break;
                case "HealthCheck":
                    result = _gridApi!.HealthCheck();
                    break;

                // ===== COMMENTED OUT METHODS - Not needed for simplified Desktop→Frontend flow =====
                // case "ImportData":
                //     result = _gridApi!.ImportData(request.Params ?? "{}");
                //     break;
                // case "ExportData":
                //     result = _gridApi!.ExportData(request.Params ?? "{}");
                //     break;
                // case "SetValidationRules":
                //     result = _gridApi!.SetValidationRules(request.Params ?? "{}");
                //     break;

                default:
                    result = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        success = false,
                        error = $"Unknown method: {request.Method}"
                    });
                    break;
            }

            // Send response back to JavaScript
            var response = new ApiResponse
            {
                RequestId = request.RequestId,
                Result = result
            };

            // Serialize response with camelCase (to match JavaScript expectations)
            var responseJson = System.Text.Json.JsonSerializer.Serialize(response, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            });

            // Debug: Log response length for troubleshooting
            Log($"[WebMessage] Sending response for {request.RequestId}, length: {responseJson.Length} bytes");

            webView.CoreWebView2.PostWebMessageAsString(responseJson);
            Log($"[WebMessage Response Sent] RequestId: {request.RequestId}");
        }
        catch (Exception ex)
        {
            _fileLogger.Error($"[WebMessage Error] Exception: {ex.Message}");
            _fileLogger.Error($"[WebMessage Error] Stack: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                _fileLogger.Error($"[WebMessage Error] Inner: {ex.InnerException.Message}");
            }
            Log($"[WebMessage Error] {ex.Message}");
        }
    }

    private class ApiRequest
    {
        public string? RequestId { get; set; }
        public string? Method { get; set; }
        public string? Params { get; set; }
    }

    private class ApiResponse
    {
        public string? RequestId { get; set; }
        public string? Result { get; set; }
    }

    private class LoadSampleDataParams
    {
        public int RowCount { get; set; } = 1000;
    }

    private void CoreWebView2_ProcessFailed(object sender, CoreWebView2ProcessFailedEventArgs e)
    {
        _fileLogger.Error("=================================================================");
        _fileLogger.Error("[WebView2 PROCESS FAILED]");
        _fileLogger.Error($"Process Kind: {e.ProcessFailedKind}");
        _fileLogger.Error($"Reason: {e.Reason}");
        _fileLogger.Error($"Exit Code: {e.ExitCode}");
        _fileLogger.Error($"Process Description: {e.ProcessDescription}");
        _fileLogger.Error("=================================================================");

        Debug.WriteLine($"[ProcessFailed] Kind: {e.ProcessFailedKind}, Reason: {e.Reason}, Exit: {e.ExitCode}");
        Console.WriteLine($"[ProcessFailed] Kind: {e.ProcessFailedKind}, Reason: {e.Reason}, Exit: {e.ExitCode}");

        // Try to show error to user if possible
        try
        {
            this.DispatcherQueue?.TryEnqueue(() =>
            {
                Log($"[ProcessFailed] WebView2 process crashed - attempting recovery");
                // Optionally: Show error dialog or attempt reload
            });
        }
        catch (Exception ex)
        {
            _fileLogger.Error($"[ProcessFailed] Failed to enqueue UI update: {ex.Message}");
        }
    }

    private void OnWindowClosed(object sender, WindowEventArgs args)
    {
        Log("Application closing - starting cleanup...");

        try
        {
            // Cleanup GridApi
            _gridApi = null;

            // Dispose WebView2
            if (webView?.CoreWebView2 != null)
            {
                webView.CoreWebView2.NavigationCompleted -= null;
                webView.Close();
            }

            // Dispose ServiceProvider
            if (_serviceProvider is IDisposable disposable)
            {
                disposable.Dispose();
            }

            Log("Cleanup completed successfully");
        }
        catch (Exception ex)
        {
            Log($"Error during cleanup: {ex.Message}");
        }

        // Close Serilog logger
        _fileLogger.Information("=================================================================");
        _fileLogger.Information("RPA Advanced Table Desktop - Shutting down");
        _fileLogger.Information("=================================================================");
        _fileLogger.Dispose();

        // Force application exit
        Application.Current.Exit();
    }
}
