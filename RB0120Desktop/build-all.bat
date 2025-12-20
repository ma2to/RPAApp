@echo off
echo.
echo ========================================
echo   RPA Web UI - Complete Build Script
echo ========================================
echo.

echo [1/3] Building RPA Web UI Library...
echo ----------------------------------------
cd ..\rpa-web-ui
call npm run build:lib:fast
if errorlevel 1 (
    echo.
    echo [ERROR] Library build FAILED!
    goto error
)
echo [OK] Library built successfully
echo.

echo [2/3] Building Desktop Frontend...
echo ----------------------------------------
cd ..\RB0120Desktop\frontend
call npm run build
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend build FAILED!
    goto error
)
echo [OK] Frontend built successfully
echo.

echo [3/3] Building Desktop C# Application...
echo ----------------------------------------
cd ..
dotnet build -c Debug -p:Platform=x64
if errorlevel 1 (
    echo.
    echo [ERROR] C# build FAILED!
    goto error
)
echo [OK] C# application built successfully
echo.

echo ========================================
echo   BUILD COMPLETED SUCCESSFULLY
echo ========================================
echo.
echo Output: bin\x64\Debug\net8.0-windows10.0.19041.0\win-x64\
echo.
goto end

:error
echo.
echo ========================================
echo   BUILD FAILED - SEE ERRORS ABOVE
echo ========================================
echo.
exit /b 1

:end
