using Microsoft.UI.Xaml;
using System;
using System.Diagnostics;
using System.IO;
using Serilog;
using Serilog.Core;

namespace RB0120Desktop;

public partial class App : Application
{
    private Window? m_window;
    private Process? backendProcess;
    private Process? frontendProcess;
    private static readonly Logger _appLogger;

    // Configure Serilog for App-level logging
    static App()
    {
        var logDirectory = Path.Combine(AppContext.BaseDirectory, "logs");
        var logFilePath = Path.Combine(logDirectory, "rpa-advanced-table.log");

        // Ensure directory exists
        if (!Directory.Exists(logDirectory))
        {
            Directory.CreateDirectory(logDirectory);
        }

        // Configure Serilog
        _appLogger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.File(
                path: logFilePath,
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 30,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
                shared: true,  // Allow multiple loggers to write to same file
                flushToDiskInterval: TimeSpan.FromSeconds(1)  // Flush every 1 second for crash safety
            )
            .CreateLogger();

        _appLogger.Information("=================================================================");
        _appLogger.Information("App.xaml.cs - Static constructor initialized");
        _appLogger.Information("=================================================================");
    }

    public App()
    {
        this.InitializeComponent();
        _appLogger.Information("[App] Constructor called");

        // Register UnhandledException handler EARLY
        this.UnhandledException += App_UnhandledException;
        _appLogger.Information("[App] UnhandledException handler registered");
    }

    protected override void OnLaunched(LaunchActivatedEventArgs args)
    {
        try
        {
            _appLogger.Information("[App] OnLaunched called");

            // NOTE: Backend and frontend dev servers are NOT needed in Production mode
            // Production mode uses built wwwroot files and WebMessage API (not HTTP)
            // Servers are only needed when running from VS in Development mode
            // Commenting out to prevent crashes in Production:

            // Start backend API server
            // StartBackendServer();

            // Start frontend dev server
            // StartFrontendServer();

            // Wait a bit for servers to start
            // _appLogger.Information("[App] Waiting 3 seconds for servers to start...");
            // System.Threading.Thread.Sleep(3000);

            _appLogger.Information("[App] Creating MainWindow...");
            m_window = new MainWindow();
            m_window.Activate();
            _appLogger.Information("[App] MainWindow activated");
        }
        catch (Exception ex)
        {
            _appLogger.Error($"[App] CRITICAL ERROR in OnLaunched: {ex.Message}");
            _appLogger.Error($"[App] Stack trace: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                _appLogger.Error($"[App] Inner exception: {ex.InnerException.Message}");
            }
            throw;
        }
    }

    private void StartBackendServer()
    {
        try
        {
            var backendPath = System.IO.Path.GetFullPath(@"..\backend\RpaAdvancedTable.Api");
            backendProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = $"run --project \"{backendPath}\" --urls http://localhost:5000",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    WorkingDirectory = backendPath
                }
            };

            backendProcess.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    Debug.WriteLine($"[Backend] {e.Data}");
            };

            backendProcess.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    Debug.WriteLine($"[Backend Error] {e.Data}");
            };

            backendProcess.Start();
            backendProcess.BeginOutputReadLine();
            backendProcess.BeginErrorReadLine();

            Debug.WriteLine("Backend server started on http://localhost:5000");
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Failed to start backend server: {ex.Message}");
        }
    }

    private void StartFrontendServer()
    {
        try
        {
            var frontendPath = System.IO.Path.GetFullPath(@"..\frontend");
            frontendProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "npm",
                    Arguments = "run dev",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    WorkingDirectory = frontendPath
                }
            };

            frontendProcess.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    Debug.WriteLine($"[Frontend] {e.Data}");
            };

            frontendProcess.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    Debug.WriteLine($"[Frontend Error] {e.Data}");
            };

            frontendProcess.Start();
            frontendProcess.BeginOutputReadLine();
            frontendProcess.BeginErrorReadLine();

            Debug.WriteLine("Frontend server started on http://localhost:5173");
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Failed to start frontend server: {ex.Message}");
        }
    }

    private void App_UnhandledException(object sender, Microsoft.UI.Xaml.UnhandledExceptionEventArgs e)
    {
        _appLogger.Error("=================================================================");
        _appLogger.Error("[App] !!! UNHANDLED EXCEPTION CAUGHT !!!");
        _appLogger.Error($"[App] Exception Type: {e.Exception?.GetType().FullName}");
        _appLogger.Error($"[App] Exception Message: {e.Exception?.Message}");
        _appLogger.Error($"[App] Stack Trace: {e.Exception?.StackTrace}");
        if (e.Exception?.InnerException != null)
        {
            _appLogger.Error($"[App] Inner Exception: {e.Exception.InnerException.Message}");
            _appLogger.Error($"[App] Inner Stack Trace: {e.Exception.InnerException.StackTrace}");
        }
        _appLogger.Error("=================================================================");

        Debug.WriteLine($"[App] UNHANDLED EXCEPTION: {e.Exception?.Message}");
        Debug.WriteLine($"[App] Stack: {e.Exception?.StackTrace}");

        // CRITICAL: Flush logs IMMEDIATELY before app crashes
        try
        {
            Serilog.Log.CloseAndFlush();
            System.Threading.Thread.Sleep(500);  // Give time for flush
        }
        catch { }

        // Mark as handled to prevent immediate crash (give time to log)
        e.Handled = true;

        // Cleanup processes
        CleanupProcesses();

        _appLogger.Error("[App] Exception handled, application will now exit");
        _appLogger.Dispose();
    }

    private void CleanupProcesses()
    {
        try
        {
            if (backendProcess != null && !backendProcess.HasExited)
            {
                backendProcess.Kill(true);
                backendProcess.Dispose();
            }

            if (frontendProcess != null && !frontendProcess.HasExited)
            {
                frontendProcess.Kill(true);
                frontendProcess.Dispose();
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error cleaning up processes: {ex.Message}");
        }
    }
}
