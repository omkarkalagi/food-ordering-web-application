# PowerShell script to start the FoodieHub application
Write-Host "Starting FoodieHub Food Delivery Application..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

# Try to run react-scripts
if (Test-Path "node_modules\.bin\react-scripts.cmd") {
    Write-Host "Found react-scripts, starting development server..." -ForegroundColor Green
    & "node_modules\.bin\react-scripts.cmd" start
} else {
    Write-Host "react-scripts not found locally, trying npx..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If this doesn't work, please run: npm install" -ForegroundColor Yellow
    Write-Host ""
    npx react-scripts start
}

Read-Host "Press Enter to exit"
