@echo off
echo ========================================
echo   ROI Simulator - Quick Deploy Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo [2/4] Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [3/4] Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

cd ..

echo [4/4] Testing server startup...
echo Starting server on http://localhost:3001
echo Press Ctrl+C to stop the server when ready to deploy

call npm start