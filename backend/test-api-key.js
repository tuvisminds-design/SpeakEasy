require('dotenv').config();
const OpenAI = require('openai');

console.log('Testing OpenAI API Key...');
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
console.log('Key starts with sk-proj:', process.env.OPENAI_API_KEY?.startsWith('sk-proj'));
console.log('Key length:', process.env.OPENAI_API_KEY?.length);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
  try {
    console.log('\nTesting API connection...');
    const models = await openai.models.list();
    console.log('✅ API Key is valid! Found', models.data.length, 'models');
  } catch (error) {
    console.log('❌ API Error:', error.message);
    if (error.status === 401) {
      console.log('🔑 Authentication failed - check your API key');
    } else if (error.status === 429) {
      console.log('⏰ Rate limit exceeded - try again later');
    } else {
      console.log('🌐 Network or other error:', error.status);
    }
  }
}

testAPI();
