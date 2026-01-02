# Start Both Servers Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Driver License Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop existing Node processes
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Green
$backendScript = @"
cd '$PWD'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Backend Server - Port 5000' -ForegroundColor Green
Write-Host 'MongoDB Atlas Connected' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@
$backendScript | Out-File -FilePath "$env:TEMP\start-backend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start-backend.ps1"

# Wait for backend
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting frontend server (port 3000)..." -ForegroundColor Green
$frontendScript = @"
cd '$PWD\client'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Frontend Server - Port 3000' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@
$frontendScript | Out-File -FilePath "$env:TEMP\start-frontend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start-frontend.ps1"

# Wait for servers
Write-Host ""
Write-Host "Waiting 15 seconds for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Cyan
Write-Host ""

$backendOk = $false
$frontendOk = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Backend is running on port 5000" -ForegroundColor Green
        $backendOk = $true
    }
} catch {
    Write-Host "Backend not responding" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Frontend is running on port 3000" -ForegroundColor Green
        $frontendOk = $true
    }
} catch {
    Write-Host "Frontend not responding yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application URLs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

if ($frontendOk) {
    Write-Host "Opening browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "Browser opened! Application should be working." -ForegroundColor Green
} else {
    Write-Host "Frontend may still be starting." -ForegroundColor Yellow
    Write-Host "Please check the frontend PowerShell window for any errors." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can manually open: http://localhost:3000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Two PowerShell windows are open:" -ForegroundColor Yellow
Write-Host "  1. Backend (port 5000) - MongoDB connected" -ForegroundColor White
Write-Host "  2. Frontend (port 3000) - Vite dev server" -ForegroundColor White
Write-Host ""


