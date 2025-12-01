# 🔄 Restart Backend to Enable Auto-Extraction

## Issue
The new `/api/resumes/parse` endpoint needs the backend to be restarted to work.

## Quick Fix

**Option 1: Use Controller**
1. Open the Controller window
2. Click "Stop" on HR Backend
3. Click "Start" on HR Backend
4. Wait for "HR Backend started successfully!" message

**Option 2: Manual Restart**
```powershell
# Stop current backend (Ctrl+C in its terminal)
# Then start again:
cd C:\Users\shrin\Speakeasy\backend
npm start
```

## After Restart
- Auto-extraction will work when you select a resume file
- Form fields will auto-fill with extracted data
- No error messages will appear

## Note
Auto-extraction is **optional** - if the backend isn't running, you can still fill the form manually. The feature just makes it faster!






