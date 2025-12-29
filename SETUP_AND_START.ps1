# Complete Setup and Start Script
# Installs Node.js, Git, dependencies, and starts the application

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($command)
    try {
        $null = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Step 1: Check Node.js
Write-Host "Step 1: Checking Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js:" -ForegroundColor Yellow
    Write-Host "  1. Download: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "  2. Install with default settings" -ForegroundColor Cyan
    Write-Host "  3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "  4. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Start-Process "https://nodejs.org/"
    exit
}

# Step 2: Check Git
Write-Host ""
Write-Host "Step 2: Checking Git..." -ForegroundColor Yellow
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Git is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git:" -ForegroundColor Yellow
    Write-Host "  1. Download: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "  2. Install with default settings" -ForegroundColor Cyan
    Write-Host "  3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "  4. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Start-Process "https://git-scm.com/download/win"
    exit
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

# Backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Step 4: Set up environment
Write-Host ""
Write-Host "Step 4: Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  Using default MongoDB URI (localhost)" -ForegroundColor Yellow
    Write-Host "   Edit .env if you want to use MongoDB Atlas" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Step 5: Configure Git
Write-Host ""
Write-Host "Step 5: Configuring Git..." -ForegroundColor Yellow
$currentName = git config --global user.name 2>$null
$currentEmail = git config --global user.email 2>$null

if (-not $currentName) {
    Write-Host "Git needs your information" -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
    Write-Host "✓ Git configured" -ForegroundColor Green
} else {
    Write-Host "✓ Git configured: $currentName" -ForegroundColor Green
}

# Step 6: Initialize Git
Write-Host ""
Write-Host "Step 6: Setting up Git repository..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init | Out-Null
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Add remote
$remoteUrl = "https://github.com/goutham432/Driver_License_App.git"
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
    git remote add origin $remoteUrl 2>&1 | Out-Null
    Write-Host "✓ GitHub remote added" -ForegroundColor Green
}

# Step 7: Check MongoDB
Write-Host ""
Write-Host "Step 7: Checking MongoDB..." -ForegroundColor Yellow
Write-Host "Note: You can use MongoDB Atlas (cloud) or local MongoDB" -ForegroundColor Yellow
Write-Host "For now, we'll use the default localhost URI" -ForegroundColor Yellow
Write-Host "You can update .env later if needed" -ForegroundColor Yellow

# Step 8: Initialize sample data (optional)
Write-Host ""
$initData = Read-Host "Initialize sample test data? (y/n)"
if ($initData -eq "y" -or $initData -eq "Y") {
    Write-Host "Initializing sample data..." -ForegroundColor Cyan
    Write-Host "Note: This requires MongoDB to be running" -ForegroundColor Yellow
    node scripts/init-sample-data.js
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "  cd client" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "To push to GitHub later, run the GITHUB_PUSH script" -ForegroundColor Yellow
Write-Host ""

