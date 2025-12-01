# 🔧 Deepgram API Key Setup - Fix WebSocket Permissions

## Problem Identified

Your API key is **valid** but **lacks WebSocket/STT permissions**. 

Test Results:
- ✅ REST API: Working
- ❌ WebSocket: Failed (401 - Permission denied)

## Solution: Enable WebSocket Permissions

### Step 1: Go to Deepgram Console
1. Open your browser and go to: **https://console.deepgram.com/**
2. Log in to your Deepgram account

### Step 2: Check API Key Permissions
1. Navigate to **API Keys** section (usually in Settings or API section)
2. Find your API key: `b79025248a...1a1a`
3. Check the permissions/scopes for this key

### Step 3: Enable WebSocket/STT Permissions
You have two options:

#### Option A: Enable Permissions on Existing Key (if available)
1. Click on your API key to edit it
2. Look for permission/scopes settings
3. Enable:
   - ✅ **WebSocket** permissions
   - ✅ **Speech-to-Text (STT)** permissions
   - ✅ **Real-time transcription** permissions
4. Save the changes

#### Option B: Create a New API Key with Full Permissions (Recommended)
1. Go to **API Keys** section
2. Click **"Create API Key"** or **"New Key"**
3. When creating the key, make sure to:
   - ✅ Enable **WebSocket** access
   - ✅ Enable **Speech-to-Text** access
   - ✅ Enable **Real-time** features
   - ✅ Select **Full Access** or **All Permissions** if available
4. Copy the new API key

### Step 4: Update Your .env File

If you created a new key, update your `.env` file:

1. Open `.env` file in your project root
2. Replace the old key with the new one:
   ```
   REACT_APP_DEEPGRAM_API_KEY=your_new_api_key_here
   ```
3. Save the file

### Step 5: Restart Your React App

**Important**: After updating the API key, you MUST restart your React development server:

1. **If using the Controller**:
   - Click "Stop App" in the controller
   - Click "Start App" again

2. **If using command line**:
   - Press `Ctrl+C` to stop the server
   - Run `npm start` again

3. **Hard refresh your browser**:
   - Press `Ctrl+Shift+R` or `Ctrl+F5` to clear cache

## Verify It's Working

After updating and restarting:

1. Open your React app in the browser
2. Open browser console (F12)
3. Click the microphone button to start voice input
4. You should see:
   - ✅ "Deepgram API key loaded successfully"
   - ✅ "Connecting to Deepgram WebSocket..."
   - ✅ "Deepgram STT connection opened successfully"
   - ❌ No more "Connection refused (code 1006)" errors

## Still Having Issues?

### Check 1: Verify Key Format
Your API key should be:
- 40 characters long
- Hexadecimal format (letters a-f and numbers 0-9)
- Example: `b79025248a9c17f7a15a68ca25f74c693ddc1a1a`

### Check 2: Verify .env File
Make sure your `.env` file:
- Is in the project root (same folder as `package.json`)
- Contains exactly: `REACT_APP_DEEPGRAM_API_KEY=your_key_here`
- Has no spaces around the `=` sign
- Has no quotes around the key

### Check 3: Restart Required
React apps only load `.env` files when they start. If you changed the `.env` file:
- ✅ You MUST restart the React server
- ✅ Hard refresh your browser (Ctrl+Shift+R)

### Check 4: Test the Key
Run the test script to verify:
```bash
node test-deepgram-connection.js
```

You should see:
- ✅ REST API: PASS
- ✅ WebSocket: PASS

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for detailed error messages
2. Verify your Deepgram account has active credits/subscription
3. Check Deepgram documentation: https://developers.deepgram.com/
4. Make sure your account tier supports WebSocket/real-time features

---

**Quick Fix Summary:**
1. Go to https://console.deepgram.com/
2. Enable WebSocket permissions on your API key (or create new key)
3. Update `.env` file if you got a new key
4. Restart React server
5. Test again!







