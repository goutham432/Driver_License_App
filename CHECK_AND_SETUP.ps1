# Check Installations and Setup Project

Write-Host ""
Write-Host "Checking installations..." -ForegroundColor Cyan
Write-Host ""

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check Node.js
$nodeOk = $false
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
        $nodeOk = $true
    }
} catch {
    Write-Host "Node.js: NOT FOUND" -ForegroundColor Red
    Write-Host "  Please install from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  Then RESTART PowerShell and run this script again" -ForegroundColor Yellow
}

# Check Git
$gitOk = $false
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git: $gitVersion" -ForegroundColor Green
        $gitOk = $true
    }
} catch {
    Write-Host "Git: NOT FOUND" -ForegroundColor Red
    Write-Host "  Please install from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "  Then RESTART PowerShell and run this script again" -ForegroundColor Yellow
}

if (-not $nodeOk -or -not $gitOk) {
    Write-Host ""
    Write-Host "Please install the missing tools and RESTART PowerShell" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "All tools installed! Setting up project..." -ForegroundColor Green
Write-Host ""

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies (this takes 2-3 minutes)..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "client/node_modules")) {
    Write-Host "Installing frontend dependencies (this takes 2-3 minutes)..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

# Create .env
if (-not (Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "Created .env file" -ForegroundColor Green
}

# Configure Git
$gitName = git config --global user.name 2>$null
if (-not $gitName) {
    Write-Host ""
    Write-Host "Configuring Git (one-time setup)..." -ForegroundColor Yellow
    $name = Read-Host "Your name"
    $email = Read-Host "Your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
}

# Initialize Git repo
if (-not (Test-Path .git)) {
    git init | Out-Null
    git remote add origin https://github.com/goutham432/Driver_License_App.git 2>&1 | Out-Null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open TWO PowerShell windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Window 1 - Backend:" -ForegroundColor White
Write-Host "  cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Window 2 - Frontend:" -ForegroundColor White
Write-Host "  cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project\client'" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open in browser:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Green
Write-Host ""


