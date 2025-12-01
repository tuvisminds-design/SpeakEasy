# 🎛️ Speakeasy Controller - Quick Start Guide

## What is the Controller?

The Speakeasy Controller is a beautiful Windows desktop application that gives you a simple UI to start and stop your local React application without using the command line.

## 🚀 Quick Start

### First Time Setup

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Launch the controller**:
   - **Option 1**: Double-click `start-controller.bat`
   - **Option 2**: Run `npm run controller` in terminal
   - **Option 3**: Run `npx electron controller/main.js`

### Using the Controller

1. **Start the App**:
   - Click the green "Start App" button
   - Wait a few seconds for the React server to start
   - Status will change to "Running" (green indicator)

2. **Stop the App**:
   - Click the red "Stop App" button
   - The React server will stop
   - Status will change to "Stopped" (red indicator)

3. **Open in Browser**:
   - When running, click the "Open Application →" link
   - Or manually go to `http://localhost:3000`

4. **View Logs**:
   - Logs from the React server appear automatically
   - Scroll to see all output

5. **Refresh Status**:
   - Click "Refresh Status" to check if the app is running
   - Useful if you started/stopped the app manually

## 🎨 Features

- ✅ **Visual Status Indicator**: See at a glance if your app is running
- ✅ **One-Click Control**: Start and stop with a single button click
- ✅ **Live Logs**: Watch the React server output in real-time
- ✅ **Auto-Detection**: Automatically detects if the app is already running
- ✅ **Clean UI**: Modern, gradient-based design

## 🔧 Troubleshooting

### Controller won't start
- Make sure you've run `npm install` to install Electron
- Check that Node.js is installed and in your PATH

### Can't start the React app
- Make sure port 3000 is not already in use
- Check that all dependencies are installed (`npm install`)
- Verify your `.env` file exists with the Deepgram API key

### App won't stop
- Click "Refresh Status" first
- Try stopping manually: Find the process using port 3000 and kill it
- On Windows: `netstat -ano | findstr :3000` then `taskkill /F /PID <pid>`

## 💡 Tips

- The controller can stay open while you work - it won't interfere with your app
- You can close the controller window and the React app will keep running
- The controller automatically stops the app when you close it (if it started it)
- Use "Refresh Status" if you're unsure whether the app is running

## 📝 Notes

- The controller is a separate application from your React app
- It communicates with the React server to start/stop it
- All your React app code and features work exactly the same
- The controller is just a convenient way to manage the server

---

**Ready to use?** Double-click `start-controller.bat` and click "Start App"! 🚀








