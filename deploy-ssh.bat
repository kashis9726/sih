@echo off
echo 🚀 AluVerse SSH Deployment Script
echo ================================
echo.

REM Configuration - UPDATE THESE VALUES
set SERVER_USER=deployer
set SERVER_HOST=YOUR_SERVER_IP
set SERVER_PATH=/var/www/aliverse

echo 🔍 Checking build...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Please fix errors and try again.
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 📤 Deploying to server...
echo Server: %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%
echo.

REM Create deployment directory if it doesn't exist
ssh %SERVER_USER%@%SERVER_HOST% "mkdir -p %SERVER_PATH%"

REM Upload files to server
echo 📋 Uploading files...
rsync -avz --delete dist/ %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌐 Your site should be available at:
    echo http://YOUR_SERVER_IP
    echo.
    echo 💡 Make sure your web server (nginx/apache) is configured to serve from:
    echo %SERVER_PATH%
) else (
    echo.
    echo ❌ Deployment failed!
    exit /b 1
)

pause
