# 🎤 Speakeasy - Your AI-Powered Public Speaking Coach

Transform any topic into a compelling speech with the power of the PREP framework. Whether you're preparing for a planned presentation or need to deliver an impromptu talk, Speakeasy guides you through the process step by step.

## ✨ Features

### 🎯 Two Speech Types
- **Planned Speech**: Perfect for presentations, keynotes, and prepared talks
- **Impromptu Talk**: Ideal for unexpected speaking opportunities using the PREP framework

### 📚 PREP Framework (Point, Reason, Example, Point)
- **Point**: State your main point clearly and concisely
- **Reason**: Explain why your point matters
- **Example**: Provide concrete examples or stories
- **Point (Reiteration)**: Restate your main point with impact

### ⏱️ Time Management
- Choose from preset durations: 2-3, 5-7, or 10-15 minutes
- "I'm not sure" option for flexible timing
- Built-in timer to keep you on track during practice

### 🎨 Sleek, Modern UI
- Clean, professional design with Tailwind CSS
- Fixed sidebar navigation for easy access
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive page-based navigation

### 🚀 Interactive Features
- Real-time speech structure generation
- Section-by-section navigation with visual indicators
- Voice input for topic entry (STT)
- Text-to-speech for reading speech content
- Topic suggestions for quick inspiration
- Practical tips for each section
- Easy navigation between pages

### 🎙️ Voice Features (Powered by Deepgram)
- **Speech-to-Text (STT)**: Speak your topic instead of typing
- **Text-to-Speech (TTS)**: Listen to speech sections read aloud
- Real-time voice transcription
- High-quality voice synthesis

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS for modern, utility-first styling
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for beautiful, consistent icons
- **Design**: Sleek, user-friendly interface with sidebar navigation
- **Voice AI**: Deepgram SDK for Speech-to-Text and Text-to-Speech

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Deepgram API key (for voice features) - Get one at [https://console.deepgram.com/](https://console.deepgram.com/)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Speakeasy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```
   Get your API key from [Deepgram Console](https://console.deepgram.com/)

4. **Start the development server**

   **Option A: Using the Controller (Recommended for Windows)**
   ```bash
   npm run controller
   ```
   This opens a Windows UI controller where you can start/stop the app with buttons.
   
   **Option B: Using npm directly**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see Speakeasy in action!

### 🎛️ Using the Controller

The Speakeasy Controller is a Windows-based UI application that lets you:
- Start and stop the React development server with a single click
- Monitor the application status in real-time
- View live logs from the development server
- Quickly open the application in your browser

To launch the controller:
- **Windows**: Double-click `start-controller.bat` or run `npm run controller`
- The controller window will open, showing the current status
- Click "Start App" to launch the React server
- Click "Stop App" to stop the server anytime

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 How to Use

### 1. Speech Generator Page
- Enter your speech topic (type or use the microphone button for voice input)
  - Click the microphone icon to start voice input
  - Speak your topic clearly
  - Click again to stop listening
- Choose your speech type:
  - **Impromptu Speech**: Uses PREP framework for quick, structured responses
  - **Planned Presentation**: Full outline for formal presentations
- Click "Generate Speech" to create your structure

### 2. Speech Output
- Review your generated speech structure
- Navigate between sections using Previous/Next buttons
- Each section includes:
  - Clear description
  - Content suggestions
  - Practical tips
  - Time allocation
- Click the speaker icon next to any section to hear it read aloud (TTS)
- Use the sidebar to navigate to Speaking Tips or Speech History

### 3. Practice Mode
- Use the timer to practice your speech
- Pause and resume as needed
- Reset to start over

## 🎯 Use Cases

### Perfect For:
- **Students**: Class presentations and speeches
- **Professionals**: Business meetings and conferences
- **Public Speakers**: Keynotes and workshops
- **Anyone**: Unexpected speaking opportunities

### Speech Types:
- **Business Presentations**: Sales pitches, team updates
- **Academic Talks**: Research presentations, thesis defenses
- **Social Speeches**: Weddings, celebrations, toasts
- **Impromptu Situations**: Q&A sessions, interviews

## 🎨 Design Philosophy

- **Accessibility First**: High contrast, keyboard navigation, screen reader friendly
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Modern Aesthetics**: Clean, professional appearance
- **User Experience**: Intuitive flow with clear visual feedback

## 🔧 Customization

The application uses CSS variables for easy theming. Modify the `:root` section in `src/index.css` to change colors, shadows, and other visual properties.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Inspired by public speaking best practices
- Designed for accessibility and user experience

---

**Ready to become a confident public speaker? Let Speakeasy guide you to success! 🎤✨**





