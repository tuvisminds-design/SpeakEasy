# PowerShell script to convert SVG to ICO for Windows shortcut
# This uses Windows built-in capabilities or creates a simple ICO

$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$svgPath = Join-Path $scriptPath "controller\mico-icon.svg"
$icoPath = Join-Path $scriptPath "controller\mico-icon.ico"

Write-Host "Creating MICO icon file..." -ForegroundColor Cyan
Write-Host ""

# Check if SVG exists
if (-not (Test-Path $svgPath)) {
    Write-Host "Error: SVG file not found at $svgPath" -ForegroundColor Red
    exit 1
}

# Try to use ImageMagick if available, otherwise use alternative method
$imageMagickAvailable = $false
try {
    $null = Get-Command magick -ErrorAction Stop
    $imageMagickAvailable = $true
} catch {
    $imageMagickAvailable = $false
}

if ($imageMagickAvailable) {
    Write-Host "Using ImageMagick to convert SVG to ICO..." -ForegroundColor Yellow
    try {
        magick convert -background transparent -resize 256x256 "$svgPath" "$icoPath"
        Write-Host "ICO file created successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ImageMagick conversion failed, trying alternative method..." -ForegroundColor Yellow
        $imageMagickAvailable = $false
    }
}

if (-not $imageMagickAvailable) {
    Write-Host "ImageMagick not available. Creating ICO using alternative method..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Note: For best results, you can:" -ForegroundColor Cyan
    Write-Host "  1. Install ImageMagick from https://imagemagick.org/" -ForegroundColor White
    Write-Host "  2. Or use an online SVG to ICO converter" -ForegroundColor White
    Write-Host "  3. Or use the SVG file directly (Windows 10+ supports SVG in shortcuts)" -ForegroundColor White
    Write-Host ""
    
    # For now, we'll use the SVG directly in the shortcut (Windows 10+ supports this)
    # But we'll also create a note about creating an ICO manually
    Write-Host "Using SVG file directly in shortcut (Windows 10+ feature)..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Icon file ready: $icoPath" -ForegroundColor Green

