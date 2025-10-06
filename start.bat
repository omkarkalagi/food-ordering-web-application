@echo off
cd /d "%~dp0"
echo Starting FoodieHub Food Delivery Application...
echo.
echo Make sure you're in the correct directory: %cd%
echo.

REM Try to run react-scripts directly
if exist "node_modules\.bin\react-scripts.cmd" (
    echo Found react-scripts, starting development server...
    call node_modules\.bin\react-scripts.cmd start
) else (
    echo react-scripts not found locally, trying npx...
    echo.
    echo If this doesn't work, please ensure Node.js is installed and run:
    echo npm install
    echo.
    npx react-scripts start
)

pause
