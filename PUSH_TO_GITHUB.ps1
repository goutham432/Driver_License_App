# Complete GitHub Push Script
# Pushes all code to GitHub repository

$githubUsername = "goutham432"
$repoName = "Driver_License_App"
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub Push - Driver License App" -ForegroundColor Cyan
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
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git first: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Configure Git user (if needed)
$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (-not $gitName -or -not $gitEmail) {
    Write-Host "Configuring Git user..." -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
    Write-Host "✓ Git configured" -ForegroundColor Green
}

# Initialize Git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init | Out-Null
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Add remote
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

# Add all files
Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add . 2>&1 | Out-Null
Write-Host "✓ Files added" -ForegroundColor Green

# Check if there are changes
$status = git status --porcelain 2>&1
if (-not $status) {
    Write-Host ""
    Write-Host "No changes to commit. Repository is up-to-date." -ForegroundColor Yellow
    Write-Host "Checking if we need to push..." -ForegroundColor Yellow
    
    # Check if branch exists remotely
    git fetch origin 2>&1 | Out-Null
    $branchExists = git ls-remote --heads origin main 2>&1
    if ($branchExists) {
        Write-Host "Branch exists on remote. Checking for differences..." -ForegroundColor Yellow
        $diff = git diff main origin/main 2>&1
        if (-not $diff) {
            Write-Host "✓ Everything is up-to-date with remote!" -ForegroundColor Green
            exit
        }
    }
}

# Create commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Complete Driver License Platform application

- React 18 frontend with 8 pages
- Node.js/Express backend with MongoDB
- JWT authentication and security
- Practice tests and appointment booking
- Docker and Kubernetes deployment
- Complete documentation"

git commit -m "$commitMessage" 2>&1 | Out-Null
Write-Host "✓ Commit created" -ForegroundColor Green

# Set branch to main
git branch -M main 2>&1 | Out-Null

# Push to GitHub
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Ready to Push to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository: $remoteUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: You need a Personal Access Token (PAT)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Create repository on GitHub (if not exists):" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host "   Name: $repoName" -ForegroundColor White
Write-Host "   (DO NOT initialize with README)" -ForegroundColor White
Write-Host ""
Write-Host "2. Generate Personal Access Token:" -ForegroundColor White
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "   - Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   - Name: DriverLicenseApp-PAT" -ForegroundColor White
Write-Host "   - Check 'repo' scope" -ForegroundColor White
Write-Host "   - Generate and COPY the token" -ForegroundColor White
Write-Host ""

$repoCreated = Read-Host "Have you created the repository '$repoName'? (y/n)"
if ($repoCreated -ne "y" -and $repoCreated -ne "Y") {
    Write-Host "Please create the repository first." -ForegroundColor Red
    Start-Process "https://github.com/new"
    exit
}

$patReady = Read-Host "Do you have your Personal Access Token ready? (y/n)"
if ($patReady -ne "y" -and $patReady -ne "Y") {
    Write-Host "Please generate your PAT first." -ForegroundColor Red
    Start-Process "https://github.com/settings/tokens"
    exit
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "When prompted:" -ForegroundColor Yellow
Write-Host "  Username: $githubUsername" -ForegroundColor White
Write-Host "  Password: [Paste your Personal Access Token]" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Ready to push? (y/n)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  🎉 SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository URL:" -ForegroundColor Cyan
        Write-Host "  $remoteUrl" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now view your code on GitHub!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Push failed. Common issues:" -ForegroundColor Red
        Write-Host "  - Repository doesn't exist on GitHub" -ForegroundColor Yellow
        Write-Host "  - Personal Access Token is incorrect" -ForegroundColor Yellow
        Write-Host "  - Network issues" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Try again or push manually:" -ForegroundColor Cyan
        Write-Host "  git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Push cancelled. You can push later with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""

