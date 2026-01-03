# PowerShell Script: Create DigitalOcean Kubernetes Cluster
# This script helps you create the DOKS cluster via doctl

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Create DigitalOcean Kubernetes Cluster" -ForegroundColor Green
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

# Check if cluster exists
Write-Host ""
Write-Host "Checking for existing clusters..." -ForegroundColor Cyan
try {
    $clusters = doctl kubernetes cluster list
    if ($clusters -match "driver-license-cluster") {
        Write-Host "✅ Cluster 'driver-license-cluster' already exists!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Cluster details:" -ForegroundColor Cyan
        doctl kubernetes cluster get driver-license-cluster
    } else {
        Write-Host "⚠️  Cluster 'driver-license-cluster' not found" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Creating cluster..." -ForegroundColor Cyan
        Write-Host "This will take 5-10 minutes..." -ForegroundColor Yellow
        Write-Host ""
        
        # Ask for region
        Write-Host "Available regions:" -ForegroundColor Cyan
        Write-Host "  nyc1 - New York 1" -ForegroundColor White
        Write-Host "  nyc3 - New York 3" -ForegroundColor White
        Write-Host "  sfo3 - San Francisco 3" -ForegroundColor White
        Write-Host "  ams3 - Amsterdam 3" -ForegroundColor White
        Write-Host "  sgp1 - Singapore 1" -ForegroundColor White
        Write-Host ""
        $region = Read-Host "Enter region (default: nyc1)"
        if ([string]::IsNullOrWhiteSpace($region)) {
            $region = "nyc1"
        }
        
        # Create cluster
        Write-Host ""
        Write-Host "Creating cluster with:" -ForegroundColor Cyan
        Write-Host "  Name: driver-license-cluster" -ForegroundColor White
        Write-Host "  Region: $region" -ForegroundColor White
        Write-Host "  Node Plan: s-1vcpu-2gb (cost-optimized)" -ForegroundColor White
        Write-Host "  Node Count: 1 (cost-optimized)" -ForegroundColor White
        Write-Host "  Cost: ~$12/month" -ForegroundColor Yellow
        Write-Host ""
        
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            doctl kubernetes cluster create driver-license-cluster `
                --region $region `
                --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=1" `
                --version latest
            
            Write-Host ""
            Write-Host "✅ Cluster creation started!" -ForegroundColor Green
            Write-Host "This will take 5-10 minutes. You can check status at:" -ForegroundColor Yellow
            Write-Host "  https://cloud.digitalocean.com/kubernetes/clusters" -ForegroundColor Cyan
        } else {
            Write-Host "Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
} catch {
    Write-Host "❌ Error checking/creating cluster" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try creating via Web UI:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://cloud.digitalocean.com/kubernetes/clusters" -ForegroundColor White
    Write-Host "  2. Click: 'Create Kubernetes Cluster'" -ForegroundColor White
    Write-Host "  3. Name: driver-license-cluster" -ForegroundColor White
    Write-Host "  4. Nodes: 2x s-2vcpu-4gb" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Next Steps" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Wait for cluster to be 'Running' (5-10 minutes)" -ForegroundColor Yellow
Write-Host "   Check: https://cloud.digitalocean.com/kubernetes/clusters" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Verify GitHub Secret is set:" -ForegroundColor Yellow
Write-Host "   https://github.com/goutham432/Driver_License_App/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Re-run GitHub Actions workflow:" -ForegroundColor Yellow
Write-Host "   https://github.com/goutham432/Driver_License_App/actions" -ForegroundColor Cyan
Write-Host ""

