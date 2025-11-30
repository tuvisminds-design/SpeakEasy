# SpeakEasy - Setup & Configuration Guide

## ✅ Current Status

Your SpeakEasy application is fully configured with:
- **Tailwind CSS 3.4.17** (Latest version)
- **Deepgram Integration** (STT & TTS)
- **React 18** with modern hooks
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Deepgram API Key

Create a `.env` file in the root directory:
```env
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Get your API key from: [https://console.deepgram.com/](https://console.deepgram.com/)

### 3. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 🎨 Features Implemented

### ✅ Speech-to-Text (STT)
- Voice input for topic entry
- Real-time transcription
- Microphone button with visual feedback
- Error handling for API issues

### ✅ Text-to-Speech (TTS)
- Read speech sections aloud
- Speaker icon on each section
- Play/pause controls
- Uses Deepgram's Aura Asteria voice model

### ✅ UI Components
- **Sidebar Navigation**: Fixed left sidebar with logo and navigation
- **Speech Generator Page**: Main page with topic input and speech type selection
- **Topic Suggestions**: Quick-select buttons for common topics
- **Speech Type Cards**: Impromptu (PREP) and Planned Presentation options
- **Speech Output Page**: Generated speech structure with TTS support

## 📁 Project Structure

```
Speakeasy/
├── src/
│   ├── App.js                 # Main application component
│   ├── index.js              # React entry point
│   ├── index.css             # Tailwind CSS imports
│   └── services/
│       └── deepgramVoiceAgent.js  # Deepgram STT/TTS service
├── public/
│   └── index.html            # HTML template
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
└── .env                      # Environment variables (create this)
```

## 🎯 Usage

### Voice Input (STT)
1. Click the microphone button next to the topic input
2. Speak your topic clearly
3. Your words will appear in real-time
4. Click the microphone again to stop

### Voice Output (TTS)
1. Generate a speech structure
2. Click the speaker icon on any section
3. The section will be read aloud
4. Click pause to stop playback

## 🔧 Troubleshooting

### Voice Features Not Working?
1. Check that your `.env` file has the correct API key
2. Ensure microphone permissions are granted in your browser
3. Check browser console for error messages
4. Verify your Deepgram API key is valid and has credits

### Build Issues?
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear browser cache if needed

## 📝 Notes

- The app uses Deepgram's WebSocket API for real-time STT
- TTS uses Deepgram's REST API with the Aura Asteria model
- All voice processing happens client-side for privacy
- The UI is fully responsive and works on mobile devices

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme. The app uses teal as the primary color.

### Fonts
The app uses Inter font family. You can change this in `tailwind.config.js` or `public/index.html`.

---

**Ready to build amazing speeches! 🎤✨**

