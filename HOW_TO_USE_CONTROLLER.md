# 🎛️ How to See and Use the Controller

## Quick Start - 3 Ways to Launch

### Method 1: Double-Click the Batch File (Easiest)
1. Open File Explorer
2. Navigate to your `Speakeasy` folder
3. **Look for `start-controller.bat`** in the main folder
4. Double-click it
5. A window should appear with the controller UI

### Method 2: From Command Line
1. Open PowerShell or Command Prompt
2. Navigate to your Speakeasy folder:
   ```bash
   cd C:\Users\shrin\Speakeasy
   ```
3. Run:
   ```bash
   npm run controller
   ```
4. A window should appear

### Method 3: Direct Electron Command
```bash
npx electron controller/main.js
```

## What You Should See

When the controller opens, you should see:
- A window with a purple gradient background
- "🎤 Speakeasy Controller" title at the top
- A status card showing "Stopped" (red dot) or "Running" (green dot)
- Three buttons: "Start App", "Stop App", "Refresh Status"

## If You Don't See the Window

### Check 1: Is it running in the background?
- Look at your taskbar - there might be an Electron icon
- Press `Alt+Tab` to see all open windows
- Check if the window is minimized

### Check 2: Check the console/terminal
- If you ran it from command line, look for error messages
- Common errors:
  - "electron not found" → Run `npm install`
  - "Cannot find module" → Make sure you're in the right folder

### Check 3: Verify Electron is installed
```bash
npm list electron
```
Should show: `electron@28.3.3`

### Check 4: Test Electron directly
```bash
node test-controller.js
```
This should open a small test window. If this doesn't work, Electron isn't installed correctly.

## Troubleshooting Steps

1. **Close any existing controller windows**
   - Check taskbar for Electron/Node processes
   - Close them if found

2. **Verify files exist**:
   - `controller/main.js` should exist
   - `controller/index.html` should exist
   - `start-controller.bat` should exist in root folder

3. **Reinstall Electron** (if needed):
   ```bash
   npm uninstall electron
   npm install electron --save-dev
   ```

4. **Check Windows Firewall/Antivirus**
   - Some antivirus software blocks Electron apps
   - Try temporarily disabling to test

5. **Run as Administrator** (if needed):
   - Right-click `start-controller.bat`
   - Select "Run as administrator"

## Still Not Working?

If you still don't see the window, try this diagnostic:

1. Open PowerShell in the Speakeasy folder
2. Run:
   ```powershell
   npm run controller
   ```
3. Look for any error messages in the console
4. Share the error messages if you see any

## Expected Behavior

✅ **Success**: A window opens with the controller UI
❌ **Failure**: No window appears, or you see error messages

---

**Need help?** Check the console output for error messages and share them!







