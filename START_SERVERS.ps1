# Start Both Servers Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Driver License Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
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

# Start backend in new window
Write-Host "Starting backend server on port 5000..." -ForegroundColor Green
$backendScript = @"
cd '$PWD'
Write-Host 'Backend Server - Port 5000' -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop' -ForegroundColor Yellow
npm run dev
"@
$backendScript | Out-File -FilePath "$env:TEMP\start-backend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start-backend.ps1"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "Starting frontend server on port 3000..." -ForegroundColor Green
$frontendScript = @"
cd '$PWD\client'
Write-Host 'Frontend Server - Port 3000' -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop' -ForegroundColor Yellow
npm run dev
"@
$frontendScript | Out-File -FilePath "$env:TEMP\start-frontend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start-frontend.ps1"

# Wait for servers to start
Write-Host ""
Write-Host "Waiting for servers to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if servers are running
Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Cyan

$backendRunning = $false
$frontendRunning = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "✓ Backend is running on port 5000" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Backend not responding yet" -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
        Write-Host "✓ Frontend is running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Frontend not responding yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application URLs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

if ($frontendRunning) {
    Write-Host "Opening browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
} else {
    Write-Host "Please wait a few more seconds and open:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Two PowerShell windows are open with the servers." -ForegroundColor Yellow
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""

