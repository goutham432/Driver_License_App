# PowerShell Script: Get Load Balancer IP Address
# This script connects to your Kubernetes cluster and gets the Load Balancer IP

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Get Load Balancer IP Address" -ForegroundColor Green
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

# Check if kubectl is installed
Write-Host ""
Write-Host "Checking kubectl installation..." -ForegroundColor Cyan
try {
    $kubectlVersion = kubectl version --client
    Write-Host "✅ kubectl is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl is not installed!" -ForegroundColor Red
    Write-Host "Please install kubectl from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/" -ForegroundColor Yellow
    exit 1
}

# Connect to cluster
Write-Host ""
Write-Host "Connecting to Kubernetes cluster..." -ForegroundColor Cyan
Write-Host "Cluster name: driver-license-cluster" -ForegroundColor White
Write-Host ""

try {
    doctl kubernetes cluster kubeconfig save driver-license-cluster
    Write-Host "✅ Connected to cluster!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error connecting to cluster" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Cluster 'driver-license-cluster' exists" -ForegroundColor White
    Write-Host "  2. You're authenticated with doctl (run: doctl auth init)" -ForegroundColor White
    exit 1
}

# Get Load Balancer IP
Write-Host ""
Write-Host "Getting Load Balancer IP..." -ForegroundColor Cyan
Write-Host ""

try {
    $externalIP = kubectl get svc driver-license-app-service -n driver-license-platform -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    
    if ($externalIP -and $externalIP -ne "") {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Load Balancer IP Found!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Application URL:" -ForegroundColor Yellow
        Write-Host "  http://$externalIP" -ForegroundColor Cyan -BackgroundColor Black
        Write-Host ""
        Write-Host "Copy this URL and open it in your browser!" -ForegroundColor White
        Write-Host ""
        
        # Also show full service details
        Write-Host "Full Service Details:" -ForegroundColor Cyan
        kubectl get svc driver-license-app-service -n driver-license-platform
        Write-Host ""
        
        # Check pod status
        Write-Host "Pod Status:" -ForegroundColor Cyan
        kubectl get pods -n driver-license-platform
        Write-Host ""
        
    } else {
        Write-Host "⚠️  Load Balancer IP not ready yet (might be <pending>)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Checking service status..." -ForegroundColor Cyan
        kubectl get svc driver-license-app-service -n driver-license-platform
        Write-Host ""
        Write-Host "If EXTERNAL-IP shows <pending>, wait 2-3 minutes and run this script again." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error getting Load Balancer IP" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Checking if service exists..." -ForegroundColor Cyan
    kubectl get svc -n driver-license-platform
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

