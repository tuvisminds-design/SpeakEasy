/**
 * Utility to test Deepgram API key
 * Can be called from browser console: testDeepgramKey()
 */

export const testDeepgramKey = async (apiKey) => {
  const key = apiKey || process.env.REACT_APP_DEEPGRAM_API_KEY;
  
  if (!key) {
    console.error('❌ No API key provided');
    return false;
  }

  console.log('🧪 Testing Deepgram API key...');
  console.log('Key:', key.substring(0, 10) + '...' + key.substring(key.length - 4));

  try {
    // Test REST API
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${key}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ REST API test PASSED');
      console.log('Projects:', data);
      return true;
    } else if (response.status === 401) {
      console.error('❌ REST API test FAILED: Invalid API key (401 Unauthorized)');
      console.error('Please check your API key at: https://console.deepgram.com/');
      return false;
    } else {
      console.warn('⚠️ REST API test returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ REST API test error:', error);
    return false;
  }
};

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  window.testDeepgramKey = testDeepgramKey;
}


