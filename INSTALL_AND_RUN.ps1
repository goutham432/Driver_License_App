# Simple Install and Run Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Driver License Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
$nodeInstalled = $false
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    }
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host "Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "  2. Download and install LTS version" -ForegroundColor Cyan
    Write-Host "  3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "  4. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Start-Process "https://nodejs.org/"
    exit
}

# Check Git
$gitInstalled = $false
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git found: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
    }
} catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "Git is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "  2. Download and install" -ForegroundColor Cyan
    Write-Host "  3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "  4. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Start-Process "https://git-scm.com/download/win"
    exit
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

# Install backend
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend installation failed" -ForegroundColor Red
    exit
}

# Install frontend
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend installation failed" -ForegroundColor Red
    exit
}

# Create .env
if (-not (Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host ""
    Write-Host "Created .env file" -ForegroundColor Green
}

# Configure Git
$gitName = git config --global user.name 2>$null
if (-not $gitName) {
    Write-Host ""
    Write-Host "Configuring Git..." -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
}

# Initialize Git
if (-not (Test-Path .git)) {
    git init | Out-Null
    git remote add origin https://github.com/goutham432/Driver_License_App.git 2>&1 | Out-Null
    Write-Host ""
    Write-Host "Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2:" -ForegroundColor Cyan
Write-Host "  cd client" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Green
Write-Host ""


