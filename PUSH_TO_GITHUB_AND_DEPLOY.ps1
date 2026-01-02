# PowerShell Script: Push to GitHub and Deploy to DigitalOcean App Platform
# This script helps you push your code to GitHub

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  GitHub Push & App Platform Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a git repository
Write-Host ""
Write-Host "Checking Git repository status..." -ForegroundColor Cyan
if (Test-Path ".git") {
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git repository not initialized" -ForegroundColor Yellow
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Check Git configuration
Write-Host ""
Write-Host "Checking Git configuration..." -ForegroundColor Cyan
$gitUser = git config user.name
$gitEmail = git config user.email

if (-not $gitUser -or -not $gitEmail) {
    Write-Host "⚠️  Git user not configured" -ForegroundColor Yellow
    Write-Host "Configuring Git user..." -ForegroundColor Cyan
    git config --global user.name "Goutham"
    git config --global user.email "gouthamsidd24@gmail.com"
    Write-Host "✅ Git user configured" -ForegroundColor Green
} else {
    Write-Host "✅ Git user: $gitUser <$gitEmail>" -ForegroundColor Green
}

# Check remote
Write-Host ""
Write-Host "Checking GitHub remote..." -ForegroundColor Cyan
$remoteUrl = git remote get-url origin 2>$null

if ($remoteUrl) {
    Write-Host "✅ Remote configured: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "⚠️  No remote configured" -ForegroundColor Yellow
    Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
    git remote add origin https://github.com/goutham432/Driver_License_App.git
    Write-Host "✅ Remote added" -ForegroundColor Green
}

# Check for changes
Write-Host ""
Write-Host "Checking for changes..." -ForegroundColor Cyan
git add .
$status = git status --porcelain

if ($status) {
    Write-Host "📝 Changes detected. Files to commit:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    $commitMessage = "Update: Preparing for DigitalOcean App Platform deployment"
    Write-Host "Creating commit..." -ForegroundColor Cyan
    git commit -m $commitMessage
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Check current branch
Write-Host ""
Write-Host "Checking current branch..." -ForegroundColor Cyan
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor White

if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "⚠️  Not on main branch. Switching to main..." -ForegroundColor Yellow
    git checkout -b main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git branch -M main
    }
    Write-Host "✅ Switched to main branch" -ForegroundColor Green
}

# Push to GitHub
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Ready to Push to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: You'll need a GitHub Personal Access Token!" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you don't have a token:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "  2. Click: 'Generate new token (classic)'" -ForegroundColor White
Write-Host "  3. Name: 'DigitalOcean-App-Platform'" -ForegroundColor White
Write-Host "  4. Scopes: Check 'repo' (Full control)" -ForegroundColor White
Write-Host "  5. Click: 'Generate token'" -ForegroundColor White
Write-Host "  6. COPY THE TOKEN (you won't see it again!)" -ForegroundColor White
Write-Host ""
Write-Host "When prompted:" -ForegroundColor Cyan
Write-Host "  Username: goutham432" -ForegroundColor White
Write-Host "  Password: Paste your Personal Access Token" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Ready to push? (Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Successfully Pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Go to: https://cloud.digitalocean.com/apps" -ForegroundColor White
        Write-Host "  2. Click: 'Create App'" -ForegroundColor White
        Write-Host "  3. Connect GitHub repository: goutham432/Driver_License_App" -ForegroundColor White
        Write-Host "  4. Follow: Documentation\APP_PLATFORM_DEPLOYMENT.md" -ForegroundColor White
        Write-Host ""
        Write-Host "Your code is now on GitHub and ready for App Platform!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Please check:" -ForegroundColor Red
        Write-Host "  - GitHub credentials are correct" -ForegroundColor Yellow
        Write-Host "  - Personal Access Token has 'repo' scope" -ForegroundColor Yellow
        Write-Host "  - Repository exists on GitHub" -Foreground Yellow
    }
} else {
    Write-Host ""
    Write-Host "Push cancelled. Run this script again when ready." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To push manually, run:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""

