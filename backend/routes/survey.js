const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

// Store Python API process
let pythonApiProcess = null;

// Function to check if Python API is ready
function checkPythonAPIReady() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/greeting',
      method: 'GET',
      timeout: 2000 // Increased timeout to 2 seconds
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', (err) => {
      console.log(`Health check error: ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Function to launch Python API
function launchPythonAPI() {
  try {
    const projectRoot = path.join(__dirname, '..', '..');
    const apiPath = path.join(projectRoot, 'mico_survey_api.py');
    const isWindows = process.platform === 'win32';
    
    // Check if API is already running
    if (pythonApiProcess && !pythonApiProcess.killed) {
      // Verify it's actually responding
      checkPythonAPIReady().then((ready) => {
        if (ready) {
          console.log('✅ Python survey API is already running and responding');
        } else {
          console.log('⚠️  Python API process exists but not responding, restarting...');
          if (pythonApiProcess) {
            pythonApiProcess.kill();
            pythonApiProcess = null;
          }
          startPythonAPI();
        }
      });
      return;
    }
    
    startPythonAPI();
    
  } catch (error) {
    console.error('❌ Error launching Python API:', error);
  }
}

function startPythonAPI() {
  const projectRoot = path.join(__dirname, '..', '..');
  const apiPath = path.join(projectRoot, 'mico_survey_api.py');
  const isWindows = process.platform === 'win32';
  
  console.log('🚀 Launching Python survey API...');
  console.log(`   Path: ${apiPath}`);
  console.log(`   Command: ${isWindows ? 'python' : 'python3'} ${apiPath}`);
  
  // Launch Python API (headless, no window)
  pythonApiProcess = spawn(
    isWindows ? 'python' : 'python3',
    [apiPath],
    {
      cwd: projectRoot,
      detached: false,
      stdio: 'pipe',
      shell: true // Use shell on Windows for better compatibility
    }
  );
  
  pythonApiProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`Python API: ${output}`);
    // Check if API is ready when we see the Flask startup message
    if (output.includes('Running on') || output.includes('* Running on') || output.includes('WARNING')) {
      console.log('✅ Python survey API is ready!');
    }
  });
  
  pythonApiProcess.stderr.on('data', (data) => {
    const error = data.toString().trim();
    console.error(`Python API stderr: ${error}`);
    // Flask often outputs to stderr, check for actual errors
    if (error.includes('Error') || error.includes('Traceback') || error.includes('ModuleNotFoundError')) {
      console.error(`❌ Python API Error: ${error}`);
      // If Flask not installed, show helpful message
      if (error.includes('flask') || error.includes('ModuleNotFoundError')) {
        console.error('❌ Flask is not installed! Run: pip install flask flask-cors');
      }
    } else if (error.includes('Running on') || error.includes('WARNING')) {
      console.log('✅ Python survey API is ready!');
    }
  });
  
  pythonApiProcess.on('close', (code) => {
    console.log(`⚠️  Python API process exited with code ${code}`);
    pythonApiProcess = null;
    // Auto-restart if it crashes
    setTimeout(() => {
      console.log('🔄 Restarting Python survey API...');
      launchPythonAPI();
    }, 2000);
  });
  
  pythonApiProcess.on('error', (error) => {
    console.error(`❌ Failed to start Python API: ${error.message}`);
    if (error.message.includes('ENOENT')) {
      console.error('❌ Python not found! Make sure Python is installed and in PATH');
    }
    pythonApiProcess = null;
  });
  
  console.log('✅ Python survey API process started (PID: ' + pythonApiProcess.pid + ')');
}

// Auto-start Python API when module loads
let pythonApiStartAttempted = false;
let pythonApiReady = false;

function ensurePythonAPIStarted() {
  if (pythonApiStartAttempted && pythonApiReady) return;
  
  if (!pythonApiStartAttempted) {
    pythonApiStartAttempted = true;
    console.log('🔧 Auto-starting Python survey API...');
    launchPythonAPI();
    
    // Wait 4 seconds for Flask to start, then check
    setTimeout(async () => {
      let checkCount = 0;
      const maxChecks = 10;
      const checkInterval = setInterval(async () => {
        checkCount++;
        const isReady = await checkPythonAPIReady();
        if (isReady) {
          pythonApiReady = true;
          console.log('✅ Python API is ready and responding');
          clearInterval(checkInterval);
        } else if (checkCount >= maxChecks) {
          console.log('⚠️  Python API not ready after checks, but will retry on request');
          clearInterval(checkInterval);
        }
      }, 1000); // Check every 1 second
    }, 4000); // Wait 4 seconds first
  }
}

// Start IMMEDIATELY when module loads
ensurePythonAPIStarted();

// Also ensure it starts when backend confirms it's running
// This is handled by checking in the greeting endpoint

// POST /api/survey/launch-bot - Launch Python survey API (for manual restart if needed)
router.post('/launch-bot', (req, res) => {
  launchPythonAPI();
  res.json({
    success: true,
    message: 'Python survey API launched successfully',
    pid: pythonApiProcess?.pid,
    api_url: 'http://localhost:5001/api/survey'
  });
});

// Helper function to make HTTP requests with retry logic
const makeRequest = (options, data, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attemptRequest = (attempt = 1) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } else if (attempt < retries) {
              // Retry on failure
              setTimeout(() => attemptRequest(attempt + 1), 1000);
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}: ${body}`));
            }
          } catch (e) {
            if (attempt < retries) {
              setTimeout(() => attemptRequest(attempt + 1), 1000);
            } else {
              reject(e);
            }
          }
        });
      });
      req.on('error', (err) => {
        if (attempt < retries) {
          setTimeout(() => attemptRequest(attempt + 1), 1000);
        } else {
          reject(err);
        }
      });
      req.setTimeout(5000, () => {
        req.destroy();
        if (attempt < retries) {
          setTimeout(() => attemptRequest(attempt + 1), 1000);
        } else {
          reject(new Error('Request timeout'));
        }
      });
      if (data) req.write(JSON.stringify(data));
      req.end();
    };
    attemptRequest();
  });
};

// Health check endpoint
router.get('/health', async (req, res) => {
  const isReady = await checkPythonAPIReady();
  const processRunning = pythonApiProcess && !pythonApiProcess.killed;
  
  // If process is running but not responding, try to restart
  if (processRunning && !isReady) {
    console.log('⚠️  Python API process exists but not responding, restarting...');
    if (pythonApiProcess) {
      pythonApiProcess.kill();
      pythonApiProcess = null;
    }
    pythonApiStartAttempted = false;
    ensurePythonAPIStarted();
  }
  
  // If no process and not ready, start it
  if (!processRunning && !isReady) {
    console.log('⚠️  Python API not running, starting...');
    pythonApiStartAttempted = false;
    ensurePythonAPIStarted();
  }
  
  res.json({ 
    ready: isReady, 
    pythonApiRunning: processRunning,
    message: isReady ? 'Python API is ready' : 'Python API is starting, please wait...'
  });
});

// Proxy endpoints to Python API
router.get('/greeting', async (req, res) => {
  try {
    // Ensure Python API is running
    if (!pythonApiProcess || pythonApiProcess.killed) {
      console.log('⚠️  Python API not running, starting now...');
      pythonApiStartAttempted = false;
      ensurePythonAPIStarted();
      // Wait for it to start - Flask needs 3-4 seconds
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    
    // Check if ready - wait up to 8 seconds total
    let isReady = await checkPythonAPIReady();
    if (!isReady) {
      console.log('⚠️  Python API not ready, waiting...');
      for (let i = 0; i < 8; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        isReady = await checkPythonAPIReady();
        if (isReady) {
          console.log('✅ Python API is now ready!');
          break;
        }
      }
    }
    
    if (!isReady) {
      throw new Error('Python API did not become ready in time');
    }
    
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/greeting',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, null, 3);
    
    res.json(result.data);
  } catch (error) {
    console.error('Error fetching greeting:', error);
    res.status(500).json({ error: 'Failed to fetch greeting', message: error.message });
  }
});

router.get('/questions', async (req, res) => {
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/questions',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions', message: error.message });
  }
});

router.post('/start', async (req, res) => {
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, req.body);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start survey', message: error.message });
  }
});

router.post('/answer', async (req, res) => {
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, req.body);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer', message: error.message });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/survey/complete',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, req.body);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete survey', message: error.message });
  }
});

module.exports = router;

