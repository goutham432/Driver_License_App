# PowerShell Script: Create DigitalOcean Container Registry
# This script helps you create the registry via doctl

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Create DigitalOcean Container Registry" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if doctl is installed
Write-Host "Checking doctl installation..." -ForegroundColor Cyan
try {
    $doctlVersion = doctl version
    Write-Host "✅ doctl is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ doctl is not installed!" -ForegroundColor Red
    Write-Host "Please install doctl from: https://docs.digitalocean.com/reference/doctl/how-to/install/" -ForegroundColor Yellow
    exit 1
}

# Authenticate doctl
Write-Host ""
Write-Host "Authenticating with DigitalOcean..." -ForegroundColor Cyan
Write-Host "Enter your DigitalOcean API token when prompted:" -ForegroundColor Yellow
Write-Host "Get token from: https://cloud.digitalocean.com/account/api/tokens" -ForegroundColor White
Write-Host ""

doctl auth init

# Check if registry exists
Write-Host ""
Write-Host "Checking for existing registries..." -ForegroundColor Cyan
try {
    $registries = doctl registry list
    if ($registries -match "driver-license-registry") {
        Write-Host "✅ Registry 'driver-license-registry' already exists!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Registry details:" -ForegroundColor Cyan
        doctl registry get driver-license-registry
    } else {
        Write-Host "⚠️  Registry 'driver-license-registry' not found" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Creating registry..." -ForegroundColor Cyan
        
        # Create registry
        doctl registry create driver-license-registry --subscription-tier basic
        
        Write-Host ""
        Write-Host "✅ Registry created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Registry details:" -ForegroundColor Cyan
        doctl registry get driver-license-registry
    }
} catch {
    Write-Host "❌ Error checking/creating registry" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try creating via Web UI:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://cloud.digitalocean.com/registry" -ForegroundColor White
    Write-Host "  2. Click: 'Create Registry'" -ForegroundColor White
    Write-Host "  3. Name: driver-license-registry" -ForegroundColor White
    Write-Host "  4. Plan: Basic" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Next Steps" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Verify GitHub Secret is set:" -ForegroundColor Yellow
Write-Host "   https://github.com/goutham432/Driver_License_App/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Re-run GitHub Actions workflow:" -ForegroundColor Yellow
Write-Host "   https://github.com/goutham432/Driver_License_App/actions" -ForegroundColor Cyan
Write-Host ""

