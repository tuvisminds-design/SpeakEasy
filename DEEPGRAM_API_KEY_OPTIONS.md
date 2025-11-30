# 🔑 Deepgram API Key - Options When Using Mentor's Key

## The Problem

Your mentor's API key works for REST API but **lacks WebSocket/STT permissions**. You need WebSocket access for the voice features to work.

## Your Options

### Option 1: Ask Your Mentor to Enable Permissions (Easiest) ⭐

**What to ask your mentor:**

1. **Go to Deepgram Console**: https://console.deepgram.com/
2. **Find the API key**: `b79025248a9c17f7a15a68ca25f74c693ddc1a1a`
3. **Enable WebSocket permissions**:
   - Edit the API key settings
   - Enable "WebSocket" access
   - Enable "Speech-to-Text (STT)" permissions
   - Enable "Real-time transcription" features
4. **Save the changes**

**OR** ask them to create a new API key with full permissions and share that with you.

**Message template you can send:**
```
Hi! I'm working on a voice feature for my app and need WebSocket/STT 
permissions enabled on the Deepgram API key. Could you either:
1. Enable WebSocket permissions on the current key, or
2. Create a new API key with full permissions?

The current key works for REST API but needs WebSocket access for 
real-time voice transcription. Thanks!
```

---

### Option 2: Create Your Own Deepgram Account (Free Tier Available) 🆓

Deepgram offers a **free tier** that includes:
- ✅ WebSocket/STT access
- ✅ Limited usage (usually enough for development/testing)
- ✅ No credit card required for free tier

**Steps:**

1. **Sign up for Deepgram**:
   - Go to: https://console.deepgram.com/signup
   - Create a free account
   - Verify your email

2. **Create an API Key**:
   - Log into the console
   - Go to API Keys section
   - Click "Create API Key"
   - Make sure to enable:
     - ✅ WebSocket access
     - ✅ Speech-to-Text
     - ✅ Real-time features
   - Copy your new API key

3. **Update Your .env File**:
   ```
   REACT_APP_DEEPGRAM_API_KEY=your_new_api_key_here
   ```

4. **Restart Your React App**:
   - Stop the app (Ctrl+C or use controller)
   - Start it again
   - Hard refresh browser (Ctrl+Shift+R)

**Benefits:**
- ✅ Full control over your API key
- ✅ Can enable all permissions you need
- ✅ Free tier is usually sufficient for learning/development
- ✅ Learn how to manage API keys yourself

---

### Option 3: Use a Different Voice Service (Alternative)

If you can't get WebSocket permissions and don't want to create your own account, you could:

1. **Use browser's built-in Speech Recognition API** (free, no API key needed)
   - Limited browser support (Chrome, Edge)
   - No external API needed
   - Works offline (in supported browsers)

2. **Use other free/open-source alternatives**
   - Web Speech API (browser native)
   - Other free STT services

**Note**: This would require code changes to use a different service.

---

## Recommended Solution

**I recommend Option 2 (Create your own account)** because:
- ✅ Free tier available
- ✅ Full control and learning experience
- ✅ No dependency on mentor's account
- ✅ Can use it for future projects
- ✅ Quick setup (5-10 minutes)

## Quick Setup Guide (Option 2)

1. **Sign up**: https://console.deepgram.com/signup
2. **Create API key** with WebSocket enabled
3. **Update `.env`** file with new key
4. **Restart React app**
5. **Test**: Run `node test-deepgram-connection.js`

Both REST and WebSocket tests should pass! ✅

---

## What to Tell Your Mentor

If you choose to ask your mentor (Option 1), here's what they need to do:

**For existing key:**
- Go to Deepgram Console → API Keys
- Edit the key: `b79025248a...1a1a`
- Enable WebSocket/STT permissions
- Save

**Or create new key:**
- Create new API key
- Select "Full Access" or enable WebSocket + STT
- Share the new key with you

---

## Testing After Fix

Once you have a key with WebSocket permissions:

```bash
node test-deepgram-connection.js
```

Should show:
- ✅ REST API: PASS
- ✅ WebSocket: PASS

Then restart your React app and the voice feature should work! 🎤


