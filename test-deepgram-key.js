/**
 * Quick test script to verify Deepgram API key
 * Run with: node test-deepgram-key.js
 */

const apiKey = '2502648d9de840b6764cfb4292ff15a884b60ab5';

console.log('🔍 Testing Deepgram API Key...');
console.log('Key:', apiKey.substring(0, 10) + '...');
console.log('Length:', apiKey.length);

// Test WebSocket connection
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
console.log('\n🌐 Connecting to:', wsUrl.replace(apiKey, 'TOKEN_HIDDEN'));

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('✅ Connection opened successfully!');
  console.log('✅ API key is valid!');
  ws.close();
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Connection closed: code ${code}, reason: ${reason}`);
  if (code === 4004) {
    console.error('❌ Invalid API key!');
  } else if (code === 1006) {
    console.error('❌ Connection refused - check API key and network');
  }
  process.exit(code === 1000 ? 0 : 1);
});

setTimeout(() => {
  console.error('❌ Connection timeout');
  ws.close();
  process.exit(1);
}, 10000);


