# GitHub Push Script for Driver License Platform
# Repository: https://github.com/goutham432/Driver_License_App

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub Push Script" -ForegroundColor Cyan
Write-Host "  Repository: goutham432/Driver_License_App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Git
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "✗ Git is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "  https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Git, restart PowerShell and run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""

# Initialize Git
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init | Out-Null
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Configure Git (if needed)
$currentName = git config --global user.name 2>$null
$currentEmail = git config --global user.email 2>$null

if (-not $currentName) {
    Write-Host ""
    Write-Host "Git needs your information for commits" -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
    Write-Host "✓ Git configured" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add . 2>&1 | Out-Null
Write-Host "✓ Files added" -ForegroundColor Green

# Create commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Complete Driver License Platform application"
git commit -m "$commitMessage" 2>&1 | Out-Null
Write-Host "✓ Commit created" -ForegroundColor Green

# Set up remote
Write-Host ""
Write-Host "Setting up GitHub remote..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/goutham432/Driver_License_App.git"

$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    if ($existingRemote -ne $remoteUrl) {
        git remote set-url origin $remoteUrl 2>&1 | Out-Null
        Write-Host "✓ Remote updated" -ForegroundColor Green
    } else {
        Write-Host "✓ Remote already configured" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl 2>&1 | Out-Null
    Write-Host "✓ Remote added" -ForegroundColor Green
}

# Set branch
git branch -M main 2>&1 | Out-Null

# Final instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Ready to push!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Before pushing:" -ForegroundColor Yellow
Write-Host "1. Make sure repository exists: https://github.com/goutham432/Driver_License_App" -ForegroundColor Cyan
Write-Host "2. Create Personal Access Token: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""
Write-Host "When prompted:" -ForegroundColor Yellow
Write-Host "  Username: goutham432" -ForegroundColor Cyan
Write-Host "  Password: [Paste your Personal Access Token]" -ForegroundColor Cyan
Write-Host ""
$ready = Read-Host "Push to GitHub now? (y/n)"

if ($ready -eq "y" -or $ready -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  🎉 SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository: https://github.com/goutham432/Driver_License_App" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Push failed. Make sure:" -ForegroundColor Red
        Write-Host "  - Repository exists on GitHub" -ForegroundColor Yellow
        Write-Host "  - You're using Personal Access Token (not password)" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "All files are committed and ready!" -ForegroundColor Green
    Write-Host "To push later, run: git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""

