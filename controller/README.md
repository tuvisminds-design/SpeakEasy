# Speakeasy Controller

A Windows-based UI controller for managing your local Speakeasy React application.

## Features

- 🎛️ **Start/Stop Control**: Easily start and stop your React development server
- 📊 **Status Monitoring**: Real-time status indicator showing if the app is running
- 📝 **Live Logs**: View console output from the React development server
- 🔗 **Quick Access**: Direct link to open the application in your browser

## Installation

1. Install Electron (if not already installed):
   ```bash
   npm install
   ```

## Usage

### Method 1: Using npm script
```bash
npm run controller
```

### Method 2: Using the launcher (Windows)
Double-click `start-controller.bat` in the project root.

### Method 3: Direct Electron command
```bash
npx electron controller/main.js
```

## How It Works

1. **Start App**: Click the "Start App" button to launch the React development server
2. **Stop App**: Click the "Stop App" button to stop the server
3. **Refresh Status**: Click "Refresh Status" to check if the app is running
4. **View Logs**: Logs from the React server will appear in the log container
5. **Open Application**: When running, click the link to open `http://localhost:3000` in your browser

## Status Indicators

- 🟢 **Green (Running)**: React app is running on port 3000
- 🔴 **Red (Stopped)**: React app is not running
- 🟡 **Yellow (Starting)**: React app is starting up

## Notes

- The controller automatically detects if the React app is already running on port 3000
- When you close the controller, it will attempt to stop the React app
- The controller works independently of the React app - you can close it and the app will keep running


