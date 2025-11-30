import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, BookOpen, Clock, Sparkles, Target, Zap, 
  Volume2, MicOff, Play, Pause, ArrowRight, CheckCircle,
  Loader2, LogOut, Eye, Users, Heart, Timer, RefreshCw
} from 'lucide-react';
import deepgramVoiceAgent from './services/deepgramVoiceAgent';
import Login from './components/Login';
import PreEvaluationTest from './components/PreEvaluationTest';
import MicoCharacter from './components/MicoCharacter';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('speakeasy_logged_in') === 'true';
  });
  const [hasCompletedTest, setHasCompletedTest] = useState(() => {
    // Check if user has already completed the test (stored in localStorage)
    return localStorage.getItem('speakeasy_test_completed') === 'true';
  });
  const [activePage, setActivePage] = useState('generator');
  const [topic, setTopic] = useState('');
  const [speechType, setSpeechType] = useState('');
  const [speechStructure, setSpeechStructure] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [playingSectionIndex, setPlayingSectionIndex] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const currentAudioRef = useRef(null);
  const sttInitializedRef = useRef(false);

  // Topic suggestions
  const topicSuggestions = [
    "The importance of work-life balance",
    "How technology shapes our future",
    "Leadership in challenging times",
    "The power of sustainable living",
    "Building resilience in uncertainty"
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sttInitializedRef.current) {
        deepgramVoiceAgent.closeSTT();
      }
      if (currentAudioRef.current) {
        deepgramVoiceAgent.stopSpeaking(currentAudioRef.current);
      }
    };
  }, []);

  // Handle STT transcript - memoized to prevent unnecessary re-renders
  const handleTranscript = useCallback((text, isFinal) => {
    setTranscript(text);
    if (isFinal && text.trim()) {
      setTopic(prev => prev ? `${prev} ${text}` : text);
      setTranscript('');
    }
  }, []);

  // Handle STT errors - memoized
  const handleSTTError = useCallback((error) => {
    console.error('❌ STT Error Handler:', error);
    // Show specific error message to user
    const errorMessage = error.message || 'Failed to initialize voice input. Please check your microphone permissions and API key.';
    setVoiceError(errorMessage);
    setIsListening(false);
    sttInitializedRef.current = false; // Reset so we can try again
  }, []);

  // Start voice input (STT) - memoized
  const startVoiceInput = useCallback(async () => {
    try {
      setVoiceError(null);
      setIsListening(true); // Show loading state
      
      if (!sttInitializedRef.current) {
        console.log('🔄 Step 1: Initializing STT connection...');
        try {
          await deepgramVoiceAgent.initializeSTT(handleTranscript, handleSTTError);
          sttInitializedRef.current = true;
          console.log('✅ Step 2: STT initialized successfully');
        } catch (initError) {
          console.error('❌ Initialization failed:', initError);
          throw initError; // Re-throw to be caught by outer catch
        }
      }
      
      // Wait a moment to ensure connection is ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('🔄 Step 3: Starting to listen...');
      deepgramVoiceAgent.startListening();
      console.log('✅ Step 4: Voice input active - speak now!');
    } catch (error) {
      console.error('❌ Error in startVoiceInput:', error);
      const errorMessage = error.message || 'Failed to start voice input. Please check your API key and microphone permissions.';
      setVoiceError(errorMessage);
      setIsListening(false);
      sttInitializedRef.current = false; // Reset so we can try again
    }
  }, [handleTranscript, handleSTTError]);

  // Stop voice input (STT) - memoized
  const stopVoiceInput = useCallback(() => {
    deepgramVoiceAgent.stopListening();
    setIsListening(false);
  }, []);

  // Read section with TTS - memoized
  const readSection = useCallback(async (section, sectionIndex) => {
    try {
      setVoiceError(null);
      if (currentAudioRef.current) {
        deepgramVoiceAgent.stopSpeaking(currentAudioRef.current);
      }

      const textToRead = `${section.title}. ${section.description}. ${section.content}. Tips: ${section.tips.join('. ')}`;
      
      setIsTTSPlaying(true);
      setPlayingSectionIndex(sectionIndex);
      const audio = await deepgramVoiceAgent.speakText(
        textToRead,
        () => {
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
          currentAudioRef.current = null;
        },
        (error) => {
          console.error('TTS Error:', error);
          setVoiceError('Failed to read text. Please check your API key.');
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
          currentAudioRef.current = null;
        }
      );
      currentAudioRef.current = audio;
    } catch (error) {
      console.error('Error reading section:', error);
      setVoiceError(error.message || 'Failed to read text');
      setIsTTSPlaying(false);
      setPlayingSectionIndex(null);
    }
  }, []);

  // Stop TTS - memoized
  const stopTTS = useCallback(() => {
    if (currentAudioRef.current) {
      deepgramVoiceAgent.stopSpeaking(currentAudioRef.current);
      currentAudioRef.current = null;
      setIsTTSPlaying(false);
      setPlayingSectionIndex(null);
    }
  }, []);

  // Generate speech structure
  const generateSpeechStructure = async () => {
    if (!topic.trim() || !speechType) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const structure = {
        topic: topic,
        type: speechType,
        sections: speechType === 'planned' ? generatePlannedStructure() : generatePREPStructure()
      };
      setSpeechStructure(structure);
      setActivePage('output');
      setIsGenerating(false);
    }, 2000);
  };

  const generatePREPStructure = () => {
    return [
      {
        title: "Point",
        description: "State your main point clearly and concisely",
        content: `Your main point about "${topic}"`,
        tips: ["Be specific and direct", "Use confident language", "Make it memorable"],
        timeAllocation: "30 seconds"
      },
      {
        title: "Reason",
        description: "Explain why your point matters",
        content: `Why "${topic}" is important and relevant to your audience`,
        tips: ["Connect to audience interests", "Use logic and evidence", "Show relevance"],
        timeAllocation: "1-2 minutes"
      },
      {
        title: "Example",
        description: "Provide concrete examples or stories",
        content: `Share a specific example, story, or case study related to "${topic}"`,
        tips: ["Use personal experiences", "Include relevant data", "Make it relatable"],
        timeAllocation: "2-3 minutes"
      },
      {
        title: "Point (Reiteration)",
        description: "Restate your main point with impact",
        content: `Reinforce your main point about "${topic}" and call to action`,
        tips: ["Summarize key takeaways", "End with confidence", "Leave lasting impression"],
        timeAllocation: "30 seconds"
      }
    ];
  };

  const generatePlannedStructure = () => {
    return [
      {
        title: "Introduction",
        description: "Hook your audience and introduce the topic",
        content: `Engaging opening about "${topic}"`,
        tips: ["Start with a question or story", "Establish credibility", "Preview main points"],
        timeAllocation: "1 minute"
      },
      {
        title: "Main Points",
        description: "Develop your key arguments",
        content: `2-3 main points about "${topic}"`,
        tips: ["Use clear transitions", "Support with evidence", "Keep audience engaged"],
        timeAllocation: "3-4 minutes"
      },
      {
        title: "Conclusion",
        description: "Wrap up and leave lasting impact",
        content: `Summarize and conclude "${topic}"`,
        tips: ["Restate main points", "End with call to action", "Leave memorable impression"],
        timeAllocation: "1 minute"
      }
    ];
  };

  // Sidebar Component - memoized to prevent re-renders
  const Sidebar = memo(() => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
        </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SpeakEasy</h1>
            <p className="text-xs text-gray-500">Public Speaking Assistant</p>
      </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          NAVIGATION
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => setActivePage('generator')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activePage === 'generator'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="font-medium">Speech Generator</span>
          </button>
          <button
            onClick={() => setActivePage('tips')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activePage === 'tips'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Speaking Tips</span>
          </button>
          <button
            onClick={() => setActivePage('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activePage === 'history'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Speech History</span>
          </button>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <LogOut className="w-4 h-4 text-teal-500" strokeWidth={2.5} />
            </div>
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  ));

  // Speech Generator Page - memoized with props
  const SpeechGeneratorPage = memo(({ 
    topic, 
    setTopic, 
    speechType, 
    setSpeechType, 
    isGenerating, 
    generateSpeechStructure,
    isListening,
    startVoiceInput,
    stopVoiceInput,
    transcript,
    voiceError,
    topicSuggestions
  }) => (
    <div className="max-w-4xl mx-auto">
      {/* Header with MICO */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <MicoCharacter animation="pointing" size="medium" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-teal-500" />
              <h1 className="text-3xl font-bold text-gray-900">Speech Generator</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Transform any topic into compelling speaking points using proven frameworks and AI-powered insights.
            </p>
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700 flex items-center gap-2">
                <span className="font-medium">MICO says:</span> "Let's create an amazing speech together! Enter your topic and choose a framework."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configure Your Speech */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl font-semibold text-gray-900">Configure Your Speech</h2>
        </div>

        {/* Topic Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to speak about?
          </label>
          <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your speech topic..."
          value={topic}
              onChange={(e) => {
                // Direct state update without extra processing
                setTopic(e.target.value);
              }}
              className="flex-1 px-4 py-3 border-2 border-yellow-400 bg-yellow-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500 font-medium"
        />
        <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
          {isListening && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700 flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                Listening... {transcript && `"${transcript}"`}
              </p>
            </div>
          )}
          {voiceError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium mb-2">{voiceError}</p>
              <p className="text-xs text-red-600">
                💡 Troubleshooting: Check browser console (F12) for detailed error messages. 
                Verify your API key at <a href="https://console.deepgram.com/" target="_blank" rel="noopener noreferrer" className="underline">console.deepgram.com</a>
              </p>
            </div>
          )}
        </div>

        {/* Topic Suggestions */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Need inspiration? Try these topics:
          </p>
          <div className="flex flex-wrap gap-2">
            {topicSuggestions.map((suggestion, index) => (
          <button
                key={index}
                onClick={() => setTopic(suggestion)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                {suggestion}
          </button>
            ))}
          </div>
        </div>

        {/* Speech Type Selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">Speech Type</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impromptu Speech */}
            <motion.button
              onClick={() => setSpeechType('impromptu')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 border-2 rounded-xl text-left transition-all ${
                speechType === 'impromptu'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  speechType === 'impromptu' ? 'bg-teal-500' : 'bg-gray-100'
                }`}>
                  <Zap className={`w-6 h-6 ${
                    speechType === 'impromptu' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Impromptu Speech</h3>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                      PREP Framework
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Perfect for unexpected speaking opportunities. Uses the PREP method: Point, Reason, Example, Point.
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Planned Presentation */}
            <motion.button
              onClick={() => setSpeechType('planned')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 border-2 rounded-xl text-left transition-all ${
                speechType === 'planned'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  speechType === 'planned' ? 'bg-teal-500' : 'bg-gray-100'
                }`}>
                  <BookOpen className={`w-6 h-6 ${
                    speechType === 'planned' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Planned Presentation</h3>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                      Full Outline
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Comprehensive structure for formal presentations with detailed outlines and supporting content.
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Generate Button with MICO encouragement */}
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <MicoCharacter animation={topic.trim() && speechType ? "celebrate" : "idle"} size="small" />
            <div className="flex-1">
              {!topic.trim() && (
                <p className="text-sm text-gray-600">MICO is waiting for you to enter a topic!</p>
              )}
              {topic.trim() && !speechType && (
                <p className="text-sm text-gray-600">MICO says: "Great topic! Now choose a speech framework."</p>
              )}
              {topic.trim() && speechType && (
                <p className="text-sm text-teal-700 font-medium">MICO says: "Perfect! Ready to generate your speech structure!"</p>
              )}
            </div>
          </div>
          <button
            onClick={generateSpeechStructure}
            disabled={!topic.trim() || !speechType || isGenerating}
            className={`w-full py-3 px-6 bg-teal-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              !topic.trim() || !speechType || isGenerating
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-teal-600'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Speech
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ));

  // Memoize topic suggestions to prevent recreation
  const memoizedTopicSuggestions = useMemo(() => topicSuggestions, []);

  // Speech Output Page - memoized with props
  const SpeechOutputPage = memo(({ 
    speechStructure, 
    speechType, 
    currentSection, 
    setCurrentSection,
    setActivePage,
    setSpeechStructure,
    setTopic,
    setSpeechType,
    readSection,
    stopTTS,
    isTTSPlaying,
    playingSectionIndex,
    handleLogout
  }) => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <MicoCharacter animation="talking" size="medium" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => {
                  setActivePage('generator');
                  setSpeechStructure(null);
                  setTopic('');
                  setSpeechType('');
                }}
                className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
              >
                ← Back to Generator
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                title="Logout"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <LogOut className="w-4 h-4 text-teal-500" strokeWidth={2.5} />
                </div>
                <span>Logout</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{speechStructure.topic}</h1>
            <p className="text-gray-600">
              {speechType === 'planned' ? 'Planned Presentation' : 'PREP Framework'}
            </p>
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700 flex items-center gap-2">
                <span className="font-medium">MICO says:</span> "Great work! Review each section and use the audio button to hear it read aloud."
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
          {speechStructure.sections.map((section, index) => (
            <motion.div
              key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border-2 ${
                index === currentSection
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === currentSection
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {section.timeAllocation}
                    </span>
                    <button
                      onClick={() => {
                        if (playingSectionIndex === index && isTTSPlaying) {
                          stopTTS();
                        } else {
                          readSection(section, index);
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        playingSectionIndex === index && isTTSPlaying
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                      }`}
                      title={playingSectionIndex === index && isTTSPlaying ? 'Stop reading' : 'Read aloud'}
                    >
                      {playingSectionIndex === index && isTTSPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Content:</h4>
                    <p className="text-gray-700">{section.content}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tips:</h4>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentSection(Math.min(speechStructure.sections.length - 1, currentSection + 1))}
          disabled={currentSection === speechStructure.sections.length - 1}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  ));

  // Speech History - store in state
  const [speechHistory, setSpeechHistory] = useState([]);

  // Save speech to history when generated
  useEffect(() => {
    if (speechStructure) {
      const historyEntry = {
        id: Date.now(),
        topic: speechStructure.topic,
        type: speechType,
        sections: speechStructure.sections,
        createdAt: new Date().toISOString()
      };
      setSpeechHistory(prev => [historyEntry, ...prev]);
    }
  }, [speechStructure, speechType]);

  // Speaking Tips Page - memoized
  const SpeakingTipsPage = memo(() => {
    const tipsCategories = [
      {
        icon: Eye,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        title: 'Body Language',
        tips: [
          'Maintain eye contact with different sections of your audience',
          'Use open gestures and avoid crossing your arms',
          'Stand tall with shoulders back to project confidence',
          'Move purposefully - avoid pacing or swaying'
        ]
      },
      {
        icon: Volume2,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        title: 'Voice & Delivery',
        tips: [
          'Speak slower than you think you should',
          'Vary your tone to maintain interest',
          'Use strategic pauses for emphasis',
          'Project your voice to the back of the room'
        ]
      },
      {
        icon: Users,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-100',
        title: 'Audience Engagement',
        tips: [
          'Start with a compelling hook or question',
          'Tell stories to make your points memorable',
          'Ask rhetorical questions to involve your audience',
          'Use \'you\' language to create connection'
        ]
      },
      {
        icon: Heart,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100',
        title: 'Managing Nerves',
        tips: [
          'Practice deep breathing before speaking',
          'Visualize success before your presentation',
          'Remember that nerves are normal and can be helpful',
          'Focus on your message, not your anxiety'
        ]
      },
      {
        icon: Timer,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-100',
        title: 'Time Management',
        tips: [
          'Practice with a timer to stay within limits',
          'Plan buffer time for questions and transitions',
          'Prioritize key points if running short on time',
          'Know which sections can be shortened if needed'
        ]
      },
      {
        icon: Target,
        iconColor: 'text-teal-500',
        iconBg: 'bg-teal-100',
        title: 'Content Structure',
        tips: [
          'Follow a clear introduction-body-conclusion format',
          'Use the PREP framework for impromptu speeches',
          'Support each point with evidence or examples',
          'End with a strong call to action or takeaway'
        ]
      }
    ];

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-8 h-8 text-teal-500" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaking Tips</h1>
            <p className="text-gray-600">Master these tips to become a confident speaker</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipsCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${category.iconBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.tips.length} tips</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  });

  // Speech History Page - memoized with props
  const SpeechHistoryPage = memo(({ 
    speechHistory, 
    setSpeechStructure, 
    setActivePage,
    setSpeechType 
  }) => {
    const [selectedSpeech, setSelectedSpeech] = useState(null);

    // Calculate estimated duration based on sections
    const getEstimatedDuration = (sections) => {
      const totalMinutes = sections.reduce((acc, section) => {
        const timeStr = section.timeAllocation || '1 min';
        // Parse time strings like "30 seconds", "1-2 minutes", "2-3 minutes"
        const match = timeStr.match(/(\d+)(?:-(\d+))?\s*(min|minute|sec|second)/i);
        if (match) {
          const unit = match[3].toLowerCase();
          const min = parseInt(match[1]) || 0;
          const max = parseInt(match[2]) || min;
          const avg = (min + max) / 2;
          // Convert seconds to minutes
          if (unit.startsWith('sec')) {
            return acc + (avg / 60);
          }
          return acc + avg;
        }
        // Fallback: try to extract any number
        const numMatch = timeStr.match(/(\d+)/);
        return acc + (numMatch ? parseInt(numMatch[1]) : 1);
      }, 0);
      return Math.round(totalMinutes);
    };

    // Format date as "Oct 27, 2025"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Sample speeches for demonstration (if history is empty, show sample data)
    const displayHistory = speechHistory.length > 0 ? speechHistory : [
      {
        id: 1,
        topic: 'The importance of work-life balance',
        type: 'impromptu',
        sections: [
          { 
            title: 'Point', 
            timeAllocation: '30 seconds',
            description: 'State your main point clearly and concisely',
            content: 'Work-life balance is essential for long-term success and well-being.'
          },
          { 
            title: 'Reason', 
            timeAllocation: '1-2 minutes',
            description: 'Explain why your point matters',
            content: 'Without balance, we risk burnout, decreased productivity, and damaged relationships.'
          },
          { 
            title: 'Example', 
            timeAllocation: '2-3 minutes',
            description: 'Provide concrete examples or stories',
            content: 'Consider a professional who works 80-hour weeks and eventually experiences health issues and family strain.'
          },
          { 
            title: 'Point (Reiteration)', 
            timeAllocation: '30 seconds',
            description: 'Restate your main point with impact',
            content: 'Prioritizing work-life balance leads to sustainable success and personal fulfillment.'
          }
        ],
        createdAt: new Date('2025-10-27').toISOString()
      },
      {
        id: 2,
        topic: 'User based design principles',
        type: 'impromptu',
        sections: [
          { 
            title: 'Point', 
            timeAllocation: '30 seconds',
            description: 'State your main point clearly and concisely',
            content: 'User-centered design puts the user at the heart of every decision.'
          },
          { 
            title: 'Reason', 
            timeAllocation: '1-2 minutes',
            description: 'Explain why your point matters',
            content: 'Designs that prioritize user needs result in more intuitive, successful products.'
          },
          { 
            title: 'Example', 
            timeAllocation: '2-3 minutes',
            description: 'Provide concrete examples or stories',
            content: 'Companies like Apple and Airbnb succeed because they deeply understand their users\' needs and pain points.'
          },
          { 
            title: 'Point (Reiteration)', 
            timeAllocation: '30 seconds',
            description: 'Restate your main point with impact',
            content: 'Always design with the user in mind for products that truly resonate.'
          }
        ],
        createdAt: new Date('2025-10-23').toISOString()
      },
      {
        id: 3,
        topic: 'AI advent good or bad?',
        type: 'impromptu',
        sections: [
          { 
            title: 'Point', 
            timeAllocation: '30 seconds',
            description: 'State your main point clearly and concisely',
            content: 'AI presents both incredible opportunities and significant challenges.'
          },
          { 
            title: 'Reason', 
            timeAllocation: '1-2 minutes',
            description: 'Explain why your point matters',
            content: 'AI can revolutionize industries but also disrupt jobs and raise ethical concerns.'
          },
          { 
            title: 'Example', 
            timeAllocation: '2-3 minutes',
            description: 'Provide concrete examples or stories',
            content: 'AI helps doctors diagnose diseases faster, but automation also displaces workers in manufacturing.'
          },
          { 
            title: 'Point (Reiteration)', 
            timeAllocation: '30 seconds',
            description: 'Restate your main point with impact',
            content: 'The key is responsible AI development that maximizes benefits while minimizing harm.'
          }
        ],
        createdAt: new Date('2025-10-09').toISOString()
      }
    ];

    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Speech History</h1>
            <p className="text-gray-600 mt-1">Review and revisit your previously generated speaking points</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - Speech List */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Speeches ({displayHistory.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayHistory.map((speech) => {
                const duration = getEstimatedDuration(speech.sections);
                const isSelected = selectedSpeech?.id === speech.id;
                
                return (
                  <motion.div
                    key={speech.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSelectedSpeech(speech)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{speech.topic}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{formatDate(speech.createdAt)}</span>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                        {speech.type === 'planned' ? 'Planned' : 'PREP'}
                      </span>
                      <span className="text-gray-500">{duration}min</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Speech Details */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
            {selectedSpeech ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSpeech.topic}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{formatDate(selectedSpeech.createdAt)}</span>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                      {selectedSpeech.type === 'planned' ? 'Planned Presentation' : 'PREP Framework'}
                    </span>
                    <span className="text-gray-500">{getEstimatedDuration(selectedSpeech.sections)}min</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {selectedSpeech.sections.map((section, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {section.timeAllocation}
                          </span>
                        </div>
                        {section.description && (
                          <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                        )}
                        {section.content && (
                          <p className="text-sm text-gray-700">{section.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSpeechStructure({
                          topic: selectedSpeech.topic,
                          type: selectedSpeech.type,
                          sections: selectedSpeech.sections
                        });
                        setSpeechType(selectedSpeech.type);
                        setActivePage('generator');
                      }}
                      className="w-full py-3 px-6 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
                    >
                      View Full Speech
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Speech</h3>
                <p className="text-gray-500 text-center">Choose a speech from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('speakeasy_logged_in');
    localStorage.removeItem('speakeasy_user_email');
    localStorage.removeItem('speakeasy_test_completed');
    setIsLoggedIn(false);
    setHasCompletedTest(false);
    setSpeechStructure(null);
    setTopic('');
    setSpeechType('');
    setActivePage('generator');
  };

  const handleTestComplete = () => {
    localStorage.setItem('speakeasy_test_completed', 'true');
    setHasCompletedTest(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Show pre-evaluation test if logged in but not completed
  if (!hasCompletedTest) {
    return <PreEvaluationTest onComplete={handleTestComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <AnimatePresence mode="wait">
          {activePage === 'generator' && !speechStructure && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SpeechGeneratorPage 
                topic={topic}
                setTopic={setTopic}
                speechType={speechType}
                setSpeechType={setSpeechType}
                isGenerating={isGenerating}
                generateSpeechStructure={generateSpeechStructure}
                isListening={isListening}
                startVoiceInput={startVoiceInput}
                stopVoiceInput={stopVoiceInput}
                transcript={transcript}
                voiceError={voiceError}
                topicSuggestions={memoizedTopicSuggestions}
              />
            </motion.div>
          )}
          {activePage === 'generator' && speechStructure && (
            <motion.div
              key="output"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
                     <SpeechOutputPage 
                       speechStructure={speechStructure}
                       speechType={speechType}
                       currentSection={currentSection}
                       setCurrentSection={setCurrentSection}
                       setActivePage={setActivePage}
                       setSpeechStructure={setSpeechStructure}
                       setTopic={setTopic}
                       setSpeechType={setSpeechType}
                       readSection={readSection}
                       stopTTS={stopTTS}
                       isTTSPlaying={isTTSPlaying}
                       playingSectionIndex={playingSectionIndex}
                       handleLogout={handleLogout}
                     />
            </motion.div>
          )}
          {activePage === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SpeakingTipsPage />
            </motion.div>
          )}
          {activePage === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SpeechHistoryPage 
                speechHistory={speechHistory}
                setSpeechStructure={setSpeechStructure}
                setActivePage={setActivePage}
                setSpeechType={setSpeechType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
