# Update MongoDB Configuration Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Updating MongoDB Atlas Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$connectionString = "mongodb+srv://gouthamsidd24:Pokemon007!@cluster0.zouxeya.mongodb.net/driver-license-platform?retryWrites=true&w=majority"

# Read current .env file
if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    
    # Update MONGODB_URI
    if ($envContent -match "MONGODB_URI=.*") {
        $envContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=$connectionString"
        Write-Host "Updated MONGODB_URI in .env file" -ForegroundColor Green
    } else {
        $envContent += "`nMONGODB_URI=$connectionString`n"
        Write-Host "Added MONGODB_URI to .env file" -ForegroundColor Green
    }
    
    # Ensure other required variables exist
    if (-not ($envContent -match "JWT_SECRET=")) {
        $envContent += "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`n"
    }
    if (-not ($envContent -match "PORT=")) {
        $envContent += "PORT=5000`n"
    }
    if (-not ($envContent -match "NODE_ENV=")) {
        $envContent += "NODE_ENV=development`n"
    }
    if (-not ($envContent -match "CLIENT_URL=")) {
        $envContent += "CLIENT_URL=http://localhost:3000`n"
    }
    
    # Write back to file
    Set-Content -Path .env -Value $envContent -NoNewline
    Write-Host ".env file updated successfully" -ForegroundColor Green
} else {
    # Create new .env file
    $envContent = @"
MONGODB_URI=$connectionString
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
"@
    Set-Content -Path .env -Value $envContent
    Write-Host "Created new .env file with MongoDB Atlas connection" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configuration updated!" -ForegroundColor Green
Write-Host ""
Write-Host "MongoDB Atlas Connection:" -ForegroundColor Cyan
Write-Host "  Database: driver-license-platform" -ForegroundColor White
Write-Host "  Cluster: cluster0.zouxeya.mongodb.net" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart the backend server" -ForegroundColor White
Write-Host "  2. Check for 'MongoDB Connected' message" -ForegroundColor White
Write-Host "  3. Initialize sample data (optional)" -ForegroundColor White
Write-Host ""

