# Initialize Sample Data Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Initialize Sample Data" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is connected
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running. Please start it first with: npm run dev" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "This will create sample data:" -ForegroundColor Yellow
Write-Host "  • Sample users (test accounts)" -ForegroundColor White
Write-Host "  • Practice tests for CA, TX, FL, NY" -ForegroundColor White
Write-Host "  • Sample appointments" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Running initialization script..." -ForegroundColor Cyan
node scripts/init-sample-data.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Sample Data Initialized!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Yellow
    Write-Host "  • Register new users" -ForegroundColor White
    Write-Host "  • Or use sample accounts (if created)" -ForegroundColor White
    Write-Host "  • Take practice tests" -ForegroundColor White
    Write-Host "  • Book appointments" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Initialization failed. Check MongoDB connection." -ForegroundColor Red
    Write-Host ""
}


