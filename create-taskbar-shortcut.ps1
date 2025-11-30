# PowerShell script to create a Windows shortcut for the Speakeasy Controller
# This shortcut can be pinned to the taskbar

$ErrorActionPreference = "Stop"

# Get the current directory (where this script is located)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = $scriptPath

# Paths - Use proper Desktop path (handles OneDrive)
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "Speakeasy Controller.lnk"
$targetPath = Join-Path $projectRoot "start-controller.bat"
$workingDirectory = $projectRoot

# Try to use MICO icon, fallback to default
$micoIconPng = Join-Path $projectRoot "controller\mico-icon.png"
$micoIconIco = Join-Path $projectRoot "controller\mico-icon.ico"
$micoIconSvg = Join-Path $projectRoot "controller\mico-icon.svg"

# Determine which icon file to use
$iconPath = $null
if (Test-Path $micoIconIco) {
    $iconPath = $micoIconIco
    Write-Host "Using MICO ICO icon" -ForegroundColor Green
} elseif (Test-Path $micoIconPng) {
    $iconPath = $micoIconPng
    Write-Host "Using MICO PNG icon" -ForegroundColor Green
} elseif (Test-Path $micoIconSvg) {
    # Windows 10+ can sometimes use SVG, but ICO/PNG is more reliable
    # Try to create PNG from SVG using a simple method
    Write-Host "MICO SVG found, but ICO/PNG preferred for shortcuts" -ForegroundColor Yellow
    Write-Host "Creating icon file..." -ForegroundColor Yellow
    # Try to run the icon creation script
    $iconScript = Join-Path $projectRoot "create-icon.js"
    if (Test-Path $iconScript) {
        node $iconScript
        if (Test-Path $micoIconPng) {
            $iconPath = $micoIconPng
        }
    }
}

# Fallback to default icon if MICO icon not available
if (-not $iconPath) {
    $iconPath = "C:\Windows\System32\shell32.dll,137"
    Write-Host "Using default Windows icon (MICO icon not found)" -ForegroundColor Yellow
    Write-Host "Run 'node create-icon.js' to create MICO icon" -ForegroundColor Cyan
}

Write-Host "Creating Speakeasy Controller shortcut..." -ForegroundColor Cyan
Write-Host ""

# Check if target exists
if (-not (Test-Path $targetPath)) {
    Write-Host "Error: start-controller.bat not found" -ForegroundColor Red
    exit 1
}

# Remove existing shortcut if it exists
if (Test-Path $shortcutPath) {
    Write-Host "Removing existing shortcut..." -ForegroundColor Yellow
    Remove-Item $shortcutPath -Force
}

# Create the shortcut
try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = $targetPath
    $Shortcut.WorkingDirectory = $workingDirectory
    $Shortcut.Description = "Speakeasy & HR Agent Controller"
    $Shortcut.IconLocation = "$iconPath,137"
    $Shortcut.Save()
    
    # Verify it was created
    if (-not (Test-Path $shortcutPath)) {
        throw "Shortcut file was not created"
    }
    
    Write-Host "Shortcut created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Shortcut location: $shortcutPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To pin to taskbar:" -ForegroundColor Cyan
    Write-Host "  1. Right-click the shortcut on your Desktop" -ForegroundColor White
    Write-Host "  2. Select Pin to taskbar" -ForegroundColor White
    Write-Host ""
    Write-Host "Or drag the shortcut from Desktop to your taskbar!" -ForegroundColor Cyan
    Write-Host ""
    
    # Open the Desktop folder to show the shortcut
    Start-Sleep -Seconds 1
    explorer.exe (Split-Path -Parent $shortcutPath)
    
} catch {
    Write-Host "Error creating shortcut" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
