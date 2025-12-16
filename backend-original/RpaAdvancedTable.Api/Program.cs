// HUBS REMOVED - SignalR not used in desktop mode
// using RpaAdvancedTable.Api.Hubs;
using RpaAdvancedTable.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog with file logging and path validation
var logFilePath = builder.Configuration["Serilog:LogFilePath"] ?? "logs/rpa-advanced-table.log";

// Path validation: ensure .log extension
if (!logFilePath.EndsWith(".log", StringComparison.OrdinalIgnoreCase))
{
    logFilePath += ".log";
}

// Path validation: ensure directory exists
var logDirectory = Path.GetDirectoryName(logFilePath);
if (!string.IsNullOrEmpty(logDirectory) && !Directory.Exists(logDirectory))
{
    Directory.CreateDirectory(logDirectory);
    Console.WriteLine($"[Serilog] Created log directory: {Path.GetFullPath(logDirectory)}");
}

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.SignalR", LogEventLevel.Debug)
    .Enrich.FromLogContext()
    .WriteTo.Console(
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}"
    )
    .WriteTo.File(
        path: logFilePath,
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: builder.Configuration["Serilog:OutputTemplate"] ??
            "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

Log.Information("=================================================================");
Log.Information("RPA Advanced Table API - Starting");
Log.Information("Log file: {LogFilePath}", Path.GetFullPath(logFilePath));
Log.Information("=================================================================");

// Use Serilog for logging
builder.Host.UseSerilog();

// Add CORS for Vue3 frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR
    });
});

// Add Controllers
builder.Services.AddControllers();

// HUBS REMOVED - SignalR not used in desktop mode
// Add SignalR
/*
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true; // For development
    options.MaximumReceiveMessageSize = 1024 * 1024; // 1MB
});
*/

// Add Keycloak Authentication (Optional - for production)
// Uncomment this section when Keycloak is configured
// Instructions:
// 1. Update appsettings.json with your Keycloak realm details
// 2. Uncomment this authentication block
// 3. Uncomment app.UseAuthentication() and app.UseAuthorization() below
// 4. Add [Authorize] attributes to controllers/hubs as needed
/*
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Keycloak:Authority"]; // e.g., "http://localhost:8080/realms/myrealm"
        options.Audience = builder.Configuration["Keycloak:Audience"]; // e.g., "account"
        options.RequireHttpsMetadata = builder.Configuration.GetValue<bool>("Keycloak:RequireHttpsMetadata", false);
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = builder.Configuration.GetValue<bool>("Keycloak:ValidateIssuer", true),
            ValidateAudience = builder.Configuration.GetValue<bool>("Keycloak:ValidateAudience", true),
            ValidateLifetime = builder.Configuration.GetValue<bool>("Keycloak:ValidateLifetime", true),
            ClockSkew = TimeSpan.FromMinutes(5) // Allow 5 minutes clock skew
        };

        // SignalR token handling - accept token from query string
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // If the request is for our SignalR hub
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/gridhub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
*/

// Register custom services
builder.Services.AddSingleton<IUserDataManager, UserDataManager>();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "RPA Advanced Table API",
        Version = "v1",
        Description = "API for Vue3 Advanced DataGrid Component with Keycloak Authentication (optional)"
    });

    // JWT Bearer Authentication for Swagger (Uncomment when Keycloak is enabled)
    /*
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token from Keycloak in the format: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    */
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "RPA Advanced Table API v1");
    });
}

// Use CORS (must be before UseAuthentication/UseAuthorization)
app.UseCors("AllowVueFrontend");

// Use HTTPS Redirection (optional for development)
// app.UseHttpsRedirection();

// Use Authentication & Authorization
// Uncomment when Keycloak is configured
// app.UseAuthentication();
// app.UseAuthorization();

// Map Controllers
app.MapControllers();

// HUBS REMOVED - SignalR not used in desktop mode
// Map SignalR Hub
// app.MapHub<GridHub>("/gridhub");

// Health check endpoint
app.MapGet("/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "RPA Advanced Table API"
});

Log.Information("Frontend URL: http://localhost:5173");
Log.Information("Backend URL: http://localhost:5000");
Log.Information("SignalR Hub URL: http://localhost:5000/gridhub");
Log.Information("Swagger UI: http://localhost:5000/swagger");
Log.Information("=================================================================");

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
    throw;
}
finally
{
    Log.Information("RPA Advanced Table API - Shutting down");
    Log.CloseAndFlush();
}
