@echo off
echo 🚀 AluVerse GitHub Pages Setup
echo ================================
echo.

REM Ask for repository name
set /p repo_name="Enter your GitHub repository name (e.g., my-alumni-app): "

if "%repo_name%"=="" (
    echo ❌ Repository name cannot be empty!
    pause
    exit /b 1
)

echo.
echo 🔧 Updating Vite configuration...
echo.

REM Update vite.config.ts
powershell -Command "(Get-Content 'vite.config.ts') -replace '/YOUR_REPO_NAME/', '/%repo_name%/' | Set-Content 'vite.config.ts'"
echo ✅ Vite configuration updated with repository name: %repo_name%

echo.
echo 🔨 Rebuilding project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🎉 Your app is ready for GitHub Pages!
    echo.
    echo 📋 Next Steps:
    echo 1. Create a new repository on GitHub with the name: %repo_name%
    echo 2. Upload all files from the 'dist' folder to your repository
    echo 3. Go to Settings ^> Pages
    echo 4. Set Source to "Deploy from a branch"
    echo 5. Select your main branch and click Save
    echo.
    echo 🔗 Your live URL will be:
    echo    https://YOUR_USERNAME.github.io/%repo_name%/
    echo.
    echo 📝 Remember to replace YOUR_USERNAME with your actual GitHub username!
    echo.
) else (
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b 1
)

pause
