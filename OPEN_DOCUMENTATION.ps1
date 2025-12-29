# Open Documentation Files

Write-Host ""
Write-Host "Opening documentation files..." -ForegroundColor Cyan
Write-Host ""

$docPath = "Documentation"

if (-not (Test-Path $docPath)) {
    Write-Host "Documentation folder not found!" -ForegroundColor Red
    exit
}

Write-Host "Available documentation:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Word Documents (HTML):" -ForegroundColor Green
Write-Host "  1. LAYMAN_SETUP_AND_ARCHITECTURE.html" -ForegroundColor White
Write-Host "  2. DEVELOPER_SETUP_AND_ARCHITECTURE.html" -ForegroundColor White
Write-Host ""
Write-Host "PowerPoint Presentations (HTML):" -ForegroundColor Green
Write-Host "  3. LAYMAN_PRESENTATION.html" -ForegroundColor White
Write-Host "  4. DEVELOPER_PRESENTATION.html" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter number to open (1-4) or 'all' for all files"

switch ($choice) {
    "1" { Start-Process "$docPath\LAYMAN_SETUP_AND_ARCHITECTURE.html" }
    "2" { Start-Process "$docPath\DEVELOPER_SETUP_AND_ARCHITECTURE.html" }
    "3" { Start-Process "$docPath\LAYMAN_PRESENTATION.html" }
    "4" { Start-Process "$docPath\DEVELOPER_PRESENTATION.html" }
    "all" {
        Start-Process "$docPath\LAYMAN_SETUP_AND_ARCHITECTURE.html"
        Start-Sleep -Seconds 1
        Start-Process "$docPath\DEVELOPER_SETUP_AND_ARCHITECTURE.html"
        Start-Sleep -Seconds 1
        Start-Process "$docPath\LAYMAN_PRESENTATION.html"
        Start-Sleep -Seconds 1
        Start-Process "$docPath\DEVELOPER_PRESENTATION.html"
        Write-Host ""
        Write-Host "All documentation files opened!" -ForegroundColor Green
    }
    default {
        Write-Host "Invalid choice. Opening all files..." -ForegroundColor Yellow
        Start-Process "$docPath\LAYMAN_SETUP_AND_ARCHITECTURE.html"
        Start-Process "$docPath\DEVELOPER_SETUP_AND_ARCHITECTURE.html"
        Start-Process "$docPath\LAYMAN_PRESENTATION.html"
        Start-Process "$docPath\DEVELOPER_PRESENTATION.html"
    }
}

Write-Host ""
Write-Host "To convert to Word/PowerPoint:" -ForegroundColor Yellow
Write-Host "  - Open HTML in Microsoft Word/PowerPoint" -ForegroundColor Cyan
Write-Host "  - Or see CONVERT_TO_WORD_PPT.md for details" -ForegroundColor Cyan
Write-Host ""

