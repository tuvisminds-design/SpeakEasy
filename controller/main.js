const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let mainWindow;
let reactProcess = null;
let hrBackendProcess = null;
let hrFrontendProcess = null;
let isSpeakeasyRunning = false;
let isHRBackendRunning = false;
let isHRFrontendRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    resizable: true,
    minWidth: 550,
    minHeight: 650,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Speakeasy & HR Agent Controller',
    autoHideMenuBar: true
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    console.log('Controller window opened');
  });

  // Check if services are already running
  checkAllPortStatus();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development (optional - comment out for production)
  // mainWindow.webContents.openDevTools();
}

// Check all port statuses
function checkAllPortStatus() {
  // Check SpeakEasy (port 3000)
  exec('netstat -ano | findstr :3000', (error, stdout) => {
    const isRunning = stdout && stdout.trim();
    isSpeakeasyRunning = !!isRunning;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'speakeasy',
        status: isRunning ? 'running' : 'stopped',
        message: isRunning ? 'SpeakEasy is running on port 3000' : 'SpeakEasy is not running'
      });
    }
  });

  // Check HR Backend (port 5000)
  exec('netstat -ano | findstr :5000', (error, stdout) => {
    const isRunning = stdout && stdout.trim();
    isHRBackendRunning = !!isRunning;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'hr-backend',
        status: isRunning ? 'running' : 'stopped',
        message: isRunning ? 'HR Backend is running on port 5000' : 'HR Backend is not running'
      });
    }
  });

  // Check HR Frontend (port 3001)
  exec('netstat -ano | findstr :3001', (error, stdout) => {
    const isRunning = stdout && stdout.trim();
    isHRFrontendRunning = !!isRunning;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'hr-frontend',
        status: isRunning ? 'running' : 'stopped',
        message: isRunning ? 'HR Frontend is running on port 3001' : 'HR Frontend is not running'
      });
    }
  });
}

// Start SpeakEasy React app
function startSpeakeasyApp() {
  if (isSpeakeasyRunning || reactProcess) {
    return;
  }

  const projectRoot = path.join(__dirname, '..');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';

  console.log('Starting SpeakEasy app...');
  reactProcess = spawn(command, ['start'], {
    cwd: projectRoot,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, PORT: '3000' }
  });

  reactProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    if (output.includes('webpack compiled') || output.includes('Compiled successfully')) {
      isSpeakeasyRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          service: 'speakeasy',
          status: 'running', 
          message: 'SpeakEasy started successfully!' 
        });
      }
    }
    
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'speakeasy', output });
    }
  });

  reactProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.error(output);
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'speakeasy', output });
    }
  });

  reactProcess.on('close', (code) => {
    console.log(`SpeakEasy process exited with code ${code}`);
    reactProcess = null;
    isSpeakeasyRunning = false;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'speakeasy',
        status: 'stopped', 
        message: 'SpeakEasy stopped' 
      });
    }
  });

  setTimeout(() => {
    if (reactProcess && !reactProcess.killed) {
      isSpeakeasyRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          service: 'speakeasy',
          status: 'starting', 
          message: 'Starting SpeakEasy...' 
        });
      }
    }
  }, 2000);
}

// Start HR Backend
function startHRBackend() {
  if (isHRBackendRunning || hrBackendProcess) {
    return;
  }

  const backendRoot = path.join(__dirname, '..', 'backend');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';

  console.log('Starting HR Backend...');
  hrBackendProcess = spawn(command, ['start'], {
    cwd: backendRoot,
    shell: true,
    stdio: 'pipe'
  });

  hrBackendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    if (output.includes('running on port') || output.includes('HR Agent Backend')) {
      isHRBackendRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          service: 'hr-backend',
          status: 'running', 
          message: 'HR Backend started successfully!' 
        });
      }
      
      // Auto-start React app when backend is ready (for seamless survey flow)
      if (!isSpeakeasyRunning && !reactProcess) {
        console.log('Auto-starting SpeakEasy app after backend startup...');
        setTimeout(() => {
          startSpeakeasyApp();
        }, 2000); // Wait 2 seconds for backend to fully initialize
      }
    }
    
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'hr-backend', output });
    }
  });

  hrBackendProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.error(output);
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'hr-backend', output });
    }
  });

  hrBackendProcess.on('close', (code) => {
    console.log(`HR Backend process exited with code ${code}`);
    hrBackendProcess = null;
    isHRBackendRunning = false;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'hr-backend',
        status: 'stopped', 
        message: 'HR Backend stopped' 
      });
    }
  });
}

// Start HR Frontend
function startHRFrontend() {
  if (isHRFrontendRunning || hrFrontendProcess) {
    return;
  }

  const frontendRoot = path.join(__dirname, '..', 'hr-agent-frontend');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';

  console.log('Starting HR Frontend...');
  hrFrontendProcess = spawn(command, ['start'], {
    cwd: frontendRoot,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, PORT: '3001', BROWSER: 'none' }
  });

  hrFrontendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    if (output.includes('webpack compiled') || output.includes('Compiled successfully')) {
      isHRFrontendRunning = true;
      if (mainWindow) {
        mainWindow.webContents.send('status-update', { 
          service: 'hr-frontend',
          status: 'running', 
          message: 'HR Frontend started successfully!' 
        });
      }
    }
    
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'hr-frontend', output });
    }
  });

  hrFrontendProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.error(output);
    if (mainWindow) {
      mainWindow.webContents.send('log-output', { service: 'hr-frontend', output });
    }
  });

  hrFrontendProcess.on('close', (code) => {
    console.log(`HR Frontend process exited with code ${code}`);
    hrFrontendProcess = null;
    isHRFrontendRunning = false;
    if (mainWindow) {
      mainWindow.webContents.send('status-update', { 
        service: 'hr-frontend',
        status: 'stopped', 
        message: 'HR Frontend stopped' 
      });
    }
  });
}

// Stop service by port
function stopServiceByPort(port, serviceName) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
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
        resolve();
      });
    } else {
      exec(`lsof -ti:${port} | xargs kill -9`, (error) => {
        if (error) {
          console.log(`Error killing process on port ${port}:`, error.message);
        }
        resolve();
      });
    }
  });
}

// Stop SpeakEasy
function stopSpeakeasyApp() {
  return new Promise((resolve) => {
    if (reactProcess) {
      const isWindows = process.platform === 'win32';
      if (isWindows) {
        exec(`taskkill /F /T /PID ${reactProcess.pid}`, (error) => {
          reactProcess = null;
          isSpeakeasyRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              service: 'speakeasy',
              status: 'stopped', 
              message: 'SpeakEasy stopped' 
            });
          }
          resolve();
        });
      } else {
        reactProcess.kill('SIGTERM');
        reactProcess = null;
        isSpeakeasyRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'speakeasy',
            status: 'stopped', 
            message: 'SpeakEasy stopped' 
          });
        }
        resolve();
      }
    } else {
      stopServiceByPort(3000, 'speakeasy').then(() => {
        isSpeakeasyRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'speakeasy',
            status: 'stopped', 
            message: 'SpeakEasy stopped' 
          });
        }
        resolve();
      });
    }
  });
}

// Stop HR Backend
function stopHRBackend() {
  return new Promise((resolve) => {
    if (hrBackendProcess) {
      const isWindows = process.platform === 'win32';
      if (isWindows) {
        exec(`taskkill /F /T /PID ${hrBackendProcess.pid}`, (error) => {
          hrBackendProcess = null;
          isHRBackendRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              service: 'hr-backend',
              status: 'stopped', 
              message: 'HR Backend stopped' 
            });
          }
          resolve();
        });
      } else {
        hrBackendProcess.kill('SIGTERM');
        hrBackendProcess = null;
        isHRBackendRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'hr-backend',
            status: 'stopped', 
            message: 'HR Backend stopped' 
          });
        }
        resolve();
      }
    } else {
      stopServiceByPort(5000, 'hr-backend').then(() => {
        isHRBackendRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'hr-backend',
            status: 'stopped', 
            message: 'HR Backend stopped' 
          });
        }
        resolve();
      });
    }
  });
}

// Stop HR Frontend
function stopHRFrontend() {
  return new Promise((resolve) => {
    if (hrFrontendProcess) {
      const isWindows = process.platform === 'win32';
      if (isWindows) {
        exec(`taskkill /F /T /PID ${hrFrontendProcess.pid}`, (error) => {
          hrFrontendProcess = null;
          isHRFrontendRunning = false;
          if (mainWindow) {
            mainWindow.webContents.send('status-update', { 
              service: 'hr-frontend',
              status: 'stopped', 
              message: 'HR Frontend stopped' 
            });
          }
          resolve();
        });
      } else {
        hrFrontendProcess.kill('SIGTERM');
        hrFrontendProcess = null;
        isHRFrontendRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'hr-frontend',
            status: 'stopped', 
            message: 'HR Frontend stopped' 
          });
        }
        resolve();
      }
    } else {
      stopServiceByPort(3001, 'hr-frontend').then(() => {
        isHRFrontendRunning = false;
        if (mainWindow) {
          mainWindow.webContents.send('status-update', { 
            service: 'hr-frontend',
            status: 'stopped', 
            message: 'HR Frontend stopped' 
          });
        }
        resolve();
      });
    }
  });
}

// IPC handlers
ipcMain.on('start-app', (event, service) => {
  if (service === 'speakeasy') {
    startSpeakeasyApp();
  } else if (service === 'hr-backend') {
    startHRBackend();
  } else if (service === 'hr-frontend') {
    startHRFrontend();
  }
});

ipcMain.on('stop-app', (event, service) => {
  if (service === 'speakeasy') {
    stopSpeakeasyApp();
  } else if (service === 'hr-backend') {
    stopHRBackend();
  } else if (service === 'hr-frontend') {
    stopHRFrontend();
  }
});

ipcMain.on('check-status', () => {
  checkAllPortStatus();
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
  if (process.platform !== 'darwin') {
    Promise.all([
      stopSpeakeasyApp(),
      stopHRBackend(),
      stopHRFrontend()
    ]).then(() => {
      app.quit();
    });
  }
});

app.on('before-quit', () => {
  stopSpeakeasyApp();
  stopHRBackend();
  stopHRFrontend();
});

