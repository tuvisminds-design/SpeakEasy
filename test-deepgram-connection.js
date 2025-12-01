/**
 * Test Deepgram API Key
 * Run with: node test-deepgram-connection.js
 */

const apiKey = 'b79025248a9c17f7a15a68ca25f74c693ddc1a1a';

console.log('🔍 Testing Deepgram API Key...');
console.log('Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
console.log('Length:', apiKey.length);
console.log('Format check:', /^[a-f0-9]{40}$/i.test(apiKey) ? '✅ Valid format' : '❌ Invalid format');
console.log('');

// Test 1: REST API
async function testRESTAPI() {
  console.log('🧪 Test 1: REST API Authentication...');
  try {
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ REST API: SUCCESS');
      console.log('   Projects found:', data.projects?.length || 0);
      return true;
    } else if (response.status === 401) {
      console.log('❌ REST API: FAILED - Invalid API key (401 Unauthorized)');
      console.log('   The API key is not valid or has expired.');
      return false;
    } else {
      console.log(`⚠️ REST API: Unexpected status ${response.status}`);
      const text = await response.text();
      console.log('   Response:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ REST API: ERROR -', error.message);
    return false;
  }
}

// Test 2: WebSocket Connection
async function testWebSocket() {
  console.log('');
  console.log('🧪 Test 2: WebSocket Connection...');
  
  return new Promise((resolve) => {
    const WebSocket = require('ws');
    
    const params = new URLSearchParams({
      model: 'nova-2',
      language: 'en-US',
      punctuate: 'true',
      interim_results: 'true',
      encoding: 'linear16',
      sample_rate: '16000',
      channels: '1',
      token: apiKey
    });

    const wsUrl = `wss://api.deepgram.com/v1/listen?${params.toString()}`;
    console.log('   Connecting to:', wsUrl.replace(apiKey, 'TOKEN_HIDDEN'));

    const ws = new WebSocket(wsUrl);

    const timeout = setTimeout(() => {
      console.log('❌ WebSocket: TIMEOUT - Connection took too long');
      ws.close();
      resolve(false);
    }, 10000);

    ws.on('open', () => {
      clearTimeout(timeout);
      console.log('✅ WebSocket: SUCCESS - Connection opened');
      ws.close();
      resolve(true);
    });

    ws.on('error', (error) => {
      clearTimeout(timeout);
      console.log('❌ WebSocket: ERROR -', error.message);
      resolve(false);
    });

    ws.on('close', (code, reason) => {
      clearTimeout(timeout);
      if (code === 1000) {
        // Normal closure
        return;
      }
      
      const closeCodes = {
        4004: 'Invalid API key',
        4005: 'Invalid model',
        4006: 'Invalid encoding',
        4007: 'Invalid sample rate',
        4008: 'Invalid language',
        4009: 'Invalid channels',
        1006: 'Connection refused - Check API key permissions'
      };

      const reasonText = closeCodes[code] || `Unknown (code: ${code})`;
      
      if (code !== 1000) {
        console.log(`❌ WebSocket: CLOSED - ${reasonText}`);
        if (code === 4004) {
          console.log('   The API key is invalid or expired.');
        } else if (code === 1006) {
          console.log('   Possible causes:');
          console.log('   1. API key lacks WebSocket/STT permissions');
          console.log('   2. Network/firewall blocking the connection');
          console.log('   3. API key is invalid or expired');
        }
      }
      
      if (code !== 1000) {
        resolve(false);
      }
    });
  });
}

// Run tests
async function runTests() {
  console.log('='.repeat(50));
  console.log('Deepgram API Key Test');
  console.log('='.repeat(50));
  console.log('');

  const restTest = await testRESTAPI();
  const wsTest = await testWebSocket();

  console.log('');
  console.log('='.repeat(50));
  console.log('Test Results Summary');
  console.log('='.repeat(50));
  console.log(`REST API:     ${restTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`WebSocket:    ${wsTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  if (!restTest) {
    console.log('💡 Troubleshooting:');
    console.log('   1. Go to https://console.deepgram.com/');
    console.log('   2. Check if your API key is active');
    console.log('   3. Verify the key has the correct permissions');
    console.log('   4. Try creating a new API key if this one is expired');
  } else if (!wsTest) {
    console.log('💡 Troubleshooting:');
    console.log('   1. Go to https://console.deepgram.com/');
    console.log('   2. Check API key permissions - ensure WebSocket/STT is enabled');
    console.log('   3. Verify your account has access to WebSocket features');
    console.log('   4. Check if your firewall is blocking WebSocket connections');
  } else {
    console.log('✅ All tests passed! Your API key is working correctly.');
    console.log('   If you still see errors in the app, try restarting the React server.');
  }
  
  process.exit(restTest && wsTest ? 0 : 1);
}

runTests().catch(console.error);







