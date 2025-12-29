# Start Application Script
# Starts both backend and frontend servers

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Driver License Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "client/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application URLs:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Set-Location client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized

# Wait and open browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "✓ Servers started in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "Application is running!" -ForegroundColor Green
Write-Host "Close the PowerShell windows to stop the servers" -ForegroundColor Yellow
Write-Host ""

Set-Location ..

