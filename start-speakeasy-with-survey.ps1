Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Speakeasy Pre-Assessment Survey" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting pre-assessment survey..." -ForegroundColor Yellow
Write-Host ""

python mico_survey_bot.py

Write-Host ""
Write-Host "Survey completed. Starting Speakeasy application..." -ForegroundColor Green
Write-Host ""

# Wait a moment
Start-Sleep -Seconds 2

# Start npm in background
Start-Process npm -ArgumentList "start" -WindowStyle Normal

Write-Host ""
Write-Host "Speakeasy is starting. It will open in your browser shortly." -ForegroundColor Green
Write-Host ""

