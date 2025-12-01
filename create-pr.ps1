# Script to create Pull Request on GitHub
# Opens the PR creation page with pre-filled information

$repo = "tuvisminds-design/SpeakEasy"
$baseBranch = "main"
$headBranch = "speakeasyv2"
$title = "SpeakEasy v2: MICO Survey Bot, Features Documentation, and Taskbar Integration"
$body = @"
## 🎯 SpeakEasy v2 Features

This PR introduces the following new features and improvements:

### ✨ New Features

1. **MICO Survey Bot** (`mico_survey_bot.py`)
   - Python GUI application for pre-app survey
   - MICO character greeting and guidance
   - Interactive question flow with 9 survey questions
   - Score calculation and results display
   - JSON export of survey results

2. **Taskbar Integration**
   - Windows taskbar shortcut with MICO icon
   - Custom icon generation (SVG → ICO/PNG)
   - Easy desktop and taskbar pinning support
   - Controller app launcher shortcut

3. **Comprehensive Features Documentation** (`FEATURES_LIST.md`)
   - Complete list of all implemented features
   - Organized by category
   - Technical stack documentation
   - Version 2.0 feature highlights

### 🎨 Enhancements

- MICO icon files (SVG, PNG, ICO formats)
- Icon generation scripts
- Taskbar shortcut creation scripts
- Survey results storage system

### 📋 Files Added

- `mico_survey_bot.py` - Python survey bot
- `FEATURES_LIST.md` - Features documentation
- `controller/mico-icon.*` - MICO icon files
- `create-icon.js` - Icon generation script
- `create-taskbar-shortcut.ps1` - Shortcut creator
- `create-mico-icon.ps1` - Icon helper script

### 🚀 Ready for Review

All features are tested and ready for integration into main branch.
"@

# Create PR URL (simple version - GitHub will auto-fill from branch)
$prUrl = "https://github.com/$repo/compare/$baseBranch...$headBranch?expand=1"

Write-Host "Opening Pull Request creation page..." -ForegroundColor Cyan
Write-Host ""
Write-Host "PR Details:" -ForegroundColor Yellow
Write-Host "Title: $title" -ForegroundColor White
Write-Host ""
Write-Host "Description will be:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Cyan
Write-Host "Please copy the description above and paste it into the PR body." -ForegroundColor Yellow
Write-Host ""

# Open in default browser
Start-Process $prUrl
