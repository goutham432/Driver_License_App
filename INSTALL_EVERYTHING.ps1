# Complete Installation Script
# Installs Node.js, Git, and sets up the project

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Some installations may require administrator privileges" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Install Node.js
Write-Host "Step 1: Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    } else {
        $nodeInstalled = $false
    }
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host "✗ Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
    
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $nodeInstaller = "$env:TEMP\nodejs-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Write-Host "✓ Download complete" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting Node.js installer..." -ForegroundColor Yellow
        Write-Host "Please complete the installation, then restart PowerShell and run this script again." -ForegroundColor Yellow
        Write-Host ""
        Start-Process msiexec.exe -ArgumentList "/i `"$nodeInstaller`" /quiet /norestart" -Wait
        Write-Host "Node.js installation started. Please restart PowerShell after installation completes." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "After restarting PowerShell, run this script again to continue." -ForegroundColor Yellow
        exit
    } catch {
        Write-Host "✗ Download failed. Please install manually:" -ForegroundColor Red
        Write-Host "  https://nodejs.org/" -ForegroundColor Cyan
        Start-Process "https://nodejs.org/"
        exit
    }
}

# Step 2: Install Git
Write-Host ""
Write-Host "Step 2: Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
    } else {
        $gitInstalled = $false
    }
} catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "✗ Git is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Downloading Git installer..." -ForegroundColor Yellow
    
    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $gitInstaller = "$env:TEMP\git-installer.exe"
    
    try {
        Invoke-WebRequest -Uri $gitUrl -OutFile $gitInstaller -UseBasicParsing
        Write-Host "✓ Download complete" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting Git installer..." -ForegroundColor Yellow
        Write-Host "Please complete the installation with default settings, then restart PowerShell." -ForegroundColor Yellow
        Write-Host ""
        Start-Process $gitInstaller -ArgumentList "/VERYSILENT", "/NORESTART" -Wait
        Write-Host "Git installation started. Please restart PowerShell after installation completes." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "After restarting PowerShell, run this script again to continue." -ForegroundColor Yellow
        exit
    } catch {
        Write-Host "✗ Download failed. Please install manually:" -ForegroundColor Red
        Write-Host "  https://git-scm.com/download/win" -ForegroundColor Cyan
        Start-Process "https://git-scm.com/download/win"
        exit
    }
}

# Step 3: Refresh PATH
Write-Host ""
Write-Host "Step 3: Refreshing environment..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installations
Write-Host ""
Write-Host "Verifying installations..." -ForegroundColor Yellow
$nodeCheck = node --version 2>&1
$npmCheck = npm --version 2>&1
$gitCheck = git --version 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js: $nodeCheck" -ForegroundColor Green
    Write-Host "✓ npm: $npmCheck" -ForegroundColor Green
    Write-Host "✓ Git: $gitCheck" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tools may need a PowerShell restart to be recognized" -ForegroundColor Yellow
}

# Step 4: Install project dependencies
Write-Host ""
Write-Host "Step 4: Installing project dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend dependencies installation failed" -ForegroundColor Red
    exit
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend dependencies installation failed" -ForegroundColor Red
    exit
}

# Step 5: Set up environment
Write-Host ""
Write-Host "Step 5: Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "✓ Created .env file from env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env file with your MongoDB URI" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Step 6: Configure Git
Write-Host ""
Write-Host "Step 6: Configuring Git..." -ForegroundColor Yellow
$currentName = git config --global user.name 2>$null
$currentEmail = git config --global user.email 2>$null

if (-not $currentName) {
    Write-Host "Git needs your information for commits" -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
    Write-Host "✓ Git configured" -ForegroundColor Green
} else {
    Write-Host "✓ Git already configured: $currentName <$currentEmail>" -ForegroundColor Green
}

# Step 7: Initialize Git repository
Write-Host ""
Write-Host "Step 7: Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init | Out-Null
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Add remote
$remoteUrl = "https://github.com/goutham432/Driver_License_App.git"
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
    git remote add origin $remoteUrl 2>&1 | Out-Null
    Write-Host "✓ GitHub remote added" -ForegroundColor Green
} else {
    Write-Host "✓ GitHub remote already configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your MongoDB URI" -ForegroundColor Cyan
Write-Host "2. Initialize sample data: node scripts/init-sample-data.js" -ForegroundColor Cyan
Write-Host "3. Start backend: npm run dev" -ForegroundColor Cyan
Write-Host "4. Start frontend: cd client && npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application will be available at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""


