const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let mainWindow;
let reactProcess = null;
let isRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Speakeasy Controller',
    autoHideMenuBar: true
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    console.log('Controller window opened');
  });

  // Check if React app is already running on port 3000
  checkPortStatus();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development (optional - comment out for production)
  // mainWindow.webContents.openDevTools();
}

// Check if port 3000 is in use (React app running)
function checkPortStatus() {
  exec('netstat -ano | findstr :3000', (error, stdout) => {
    if (stdout && stdout.trim()) {
      isRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          status: 'running', 
          message: 'React app is running on port 3000' 
        });
      }
    } else {
      isRunning = false;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          status: 'stopped', 
          message: 'React app is not running' 
        });
      }
    }
  });
}

// Start React development server
function startReactApp() {
  if (isRunning || reactProcess) {
    return;
  }

  const projectRoot = path.join(__dirname, '..');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';

  console.log('Starting React app...');
  reactProcess = spawn(command, ['start'], {
    cwd: projectRoot,
    shell: true,
    stdio: 'pipe'
  });

  reactProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Check if server started successfully
    if (output.includes('webpack compiled') || output.includes('Compiled successfully')) {
      isRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          status: 'running', 
          message: 'React app started successfully!' 
        });
      }
    }
    
    // Send logs to renderer
    if (mainWindow) {
      mainWindow.webContents.send('log-output', output);
    }
  });

  reactProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.error(output);
    if (mainWindow) {
      mainWindow.webContents.send('log-output', output);
    }
  });

  reactProcess.on('close', (code) => {
    console.log(`React process exited with code ${code}`);
    reactProcess = null;
    isRunning = false;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        status: 'stopped', 
        message: 'React app stopped' 
      });
    }
  });

  // Update status after a short delay
  setTimeout(() => {
    if (reactProcess && !reactProcess.killed) {
      isRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          status: 'starting', 
          message: 'Starting React app...' 
        });
      }
    }
  }, 2000);
}

// Stop React development server
function stopReactApp() {
  if (!reactProcess && !isRunning) {
    return;
  }

  return new Promise((resolve) => {
    // If we have the process, kill it
    if (reactProcess) {
      const isWindows = process.platform === 'win32';
      
      if (isWindows) {
        // On Windows, we need to kill the process tree
        exec(`taskkill /F /T /PID ${reactProcess.pid}`, (error) => {
          if (error) {
            console.log('Error killing process:', error.message);
          }
          reactProcess = null;
          isRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              status: 'stopped', 
              message: 'React app stopped' 
            });
          }
          resolve();
        });
      } else {
        reactProcess.kill('SIGTERM');
        reactProcess = null;
        isRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            status: 'stopped', 
            message: 'React app stopped' 
          });
        }
        resolve();
      }
    } else {
      // Try to find and kill any process using port 3000
      const isWindows = process.platform === 'win32';
      
      if (isWindows) {
        exec('netstat -ano | findstr :3000', (error, stdout) => {
          if (stdout) {
            const lines = stdout.trim().split('\n');
            const pids = new Set();
            
            lines.forEach(line => {
              const parts = line.trim().split(/\s+/);
              if (parts.length > 0) {
                const pid = parts[parts.length - 1];
                if (pid && !isNaN(pid)) {
                  pids.add(pid);
                }
              }
            });
            
            pids.forEach(pid => {
              exec(`taskkill /F /T /PID ${pid}`, (killError) => {
                if (killError) {
                  console.log(`Error killing process ${pid}:`, killError.message);
                }
              });
            });
          }
          
          isRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              status: 'stopped', 
              message: 'React app stopped' 
            });
          }
          resolve();
        });
      } else {
        exec('lsof -ti:3000 | xargs kill -9', (error) => {
          if (error) {
            console.log('Error killing process on port 3000:', error.message);
          }
          isRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              status: 'stopped', 
              message: 'React app stopped' 
            });
          }
          resolve();
        });
      }
    }
  });
}

// IPC handlers
ipcMain.on('start-app', () => {
  startReactApp();
});

ipcMain.on('stop-app', () => {
  stopReactApp();
});

ipcMain.on('check-status', () => {
  checkPortStatus();
});

// App lifecycle
app.whenReady().then(() => {
  console.log('Electron app ready, creating window...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Log any errors
app.on('error', (error) => {
  console.error('Electron app error:', error);
});

app.on('window-all-closed', () => {
  // On Windows, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') {
    // Stop React app before quitting
    stopReactApp().then(() => {
      app.quit();
    });
  }
});

app.on('before-quit', () => {
  // Ensure React app is stopped before quitting
  stopReactApp();
});

