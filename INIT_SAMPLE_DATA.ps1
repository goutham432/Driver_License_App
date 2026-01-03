# PowerShell Script: Initialize Sample Data in Kubernetes MongoDB
# This script will port-forward MongoDB and run the initialization script

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Initialize Sample Data" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if kubectl is available
try {
    $kubectlVersion = kubectl version --client --short 2>&1
    Write-Host "✅ kubectl found" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Checking MongoDB pod..." -ForegroundColor Yellow
$mongoPod = kubectl get pods -l app=mongodb -n driver-license-platform -o jsonpath='{.items[0].metadata.name}' 2>&1

if (-not $mongoPod -or $mongoPod -match "error") {
    Write-Host "❌ MongoDB pod not found!" -ForegroundColor Red
    Write-Host "   Make sure the cluster is running and MongoDB is deployed." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MongoDB pod found: $mongoPod" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Starting port-forward (this will run in background)..." -ForegroundColor Yellow
Write-Host "   Port-forwarding MongoDB service to localhost:27017..." -ForegroundColor Gray

# Start port-forward in background
$portForwardJob = Start-Job -ScriptBlock {
    kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform 2>&1
}

# Wait a moment for port-forward to establish
Start-Sleep -Seconds 3

Write-Host "✅ Port-forward started" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Setting MongoDB connection..." -ForegroundColor Yellow
$env:MONGODB_URI = "mongodb://localhost:27017/driver-license-platform"
Write-Host "✅ MongoDB URI set: $env:MONGODB_URI" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Running initialization script..." -ForegroundColor Yellow
Write-Host "   This will create 4 practice tests (CA, TX, FL, NY) with 10-15 questions each" -ForegroundColor Gray
Write-Host ""

# Run the initialization script
node scripts/init-k8s-sample-data.js

$initResult = $LASTEXITCODE

# Stop port-forward job
Stop-Job -Job $portForwardJob -ErrorAction SilentlyContinue
Remove-Job -Job $portForwardJob -ErrorAction SilentlyContinue

if ($initResult -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Sample Data Initialized!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The database now contains:" -ForegroundColor Cyan
    Write-Host "  - 4 Practice Tests (CA, TX, FL, NY)" -ForegroundColor White
    Write-Host "  - 10-15 questions per test" -ForegroundColor White
    Write-Host "  - Scorecards and explanations" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Yellow
    Write-Host "  1. Refresh the application in your browser" -ForegroundColor White
    Write-Host "  2. Go to 'Practice Tests' page" -ForegroundColor White
    Write-Host "  3. Select a test and start practicing!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Initialization failed. Check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure MongoDB pod is running" -ForegroundColor White
    Write-Host "  - Check if port 27017 is already in use" -ForegroundColor White
    Write-Host "  - Verify MongoDB service is accessible" -ForegroundColor White
    Write-Host ""
}

