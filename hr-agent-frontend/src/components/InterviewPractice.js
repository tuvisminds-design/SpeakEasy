import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Pause, Play, ArrowRight, Sparkles, Target, Zap, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Import SpeakEasy voice agent (copy from main SpeakEasy app)
// For now, we'll create a simplified version that uses the same API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const InterviewPractice = ({ candidate }) => {
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

  // Common interview topics
  const interviewTopics = [
    "Tell me about yourself",
    "Why do you want this job?",
    "What are your strengths?",
    "Describe a challenging project",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "How do you handle pressure?",
    "What is your greatest achievement?"
  ];

  // Generate speech structure using PREP framework
  const generateSpeechStructure = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setVoiceError(null);
    
    // Simulate AI processing (in production, call actual API)
    setTimeout(() => {
      const structure = {
        topic: topic,
        type: 'impromptu',
        sections: [
          {
            title: "Point",
            description: "State your main point clearly and concisely",
            content: `Your main point about "${topic}" - be direct and confident.`,
            tips: ["Be specific and direct", "Use confident language", "Make it memorable"],
            timeAllocation: "30 seconds"
          },
          {
            title: "Reason",
            description: "Explain why your point matters",
            content: `Why "${topic}" is important and relevant - connect to the interviewer's interests.`,
            tips: ["Connect to interviewer interests", "Use logic and evidence", "Show relevance"],
            timeAllocation: "1-2 minutes"
          },
          {
            title: "Example",
            description: "Provide concrete examples or stories",
            content: `Share a specific example, story, or case study related to "${topic}" - make it personal and memorable.`,
            tips: ["Use personal experiences", "Include relevant data", "Make it relatable"],
            timeAllocation: "2-3 minutes"
          },
          {
            title: "Point (Reiteration)",
            description: "Restate your main point with impact",
            content: `Reinforce your main point about "${topic}" and end with confidence.`,
            tips: ["Summarize key takeaways", "End with confidence", "Leave lasting impression"],
            timeAllocation: "30 seconds"
          }
        ]
      };
      setSpeechStructure(structure);
      setIsGenerating(false);
    }, 2000);
  };

  // Simplified TTS (would integrate with Deepgram in production)
  const readSection = useCallback(async (section, sectionIndex) => {
    try {
      setVoiceError(null);
      setIsTTSPlaying(true);
      setPlayingSectionIndex(sectionIndex);
      
      // In production, this would call Deepgram TTS API
      const textToRead = `${section.title}. ${section.description}. ${section.content}. Tips: ${section.tips.join('. ')}`;
      
      // Use browser's built-in speech synthesis as fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.onend = () => {
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
        };
        utterance.onerror = (error) => {
          console.error('TTS Error:', error);
          setVoiceError('Failed to read text. Please check your browser settings.');
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setVoiceError('Text-to-speech not supported in this browser');
        setIsTTSPlaying(false);
        setPlayingSectionIndex(null);
      }
    } catch (error) {
      console.error('Error reading section:', error);
      setVoiceError(error.message || 'Failed to read text');
      setIsTTSPlaying(false);
      setPlayingSectionIndex(null);
    }
  }, []);

  const stopTTS = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTTSPlaying(false);
    setPlayingSectionIndex(null);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Practice with SpeakEasy</h1>
            <p className="text-gray-600">Practice your interview responses using AI-powered speech generation</p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span><strong>Powered by SpeakEasy:</strong> Get structured speaking points for any interview question using the PREP framework</span>
          </p>
        </div>
      </div>

      {!speechStructure ? (
        /* Topic Selection */
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a Topic to Practice</h2>
          
          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter an interview question or topic
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Tell me about yourself"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-teal-400 bg-teal-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-gray-900 placeholder-gray-500 font-medium"
              />
              <button
                onClick={() => setIsListening(!isListening)}
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
          </div>

          {/* Quick Topic Suggestions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Or choose from common interview questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {interviewTopics.map((suggestion, index) => (
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

          {/* Generate Button */}
          <button
            onClick={generateSpeechStructure}
            disabled={!topic.trim() || isGenerating}
            className={`w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              !topic.trim() || isGenerating
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-teal-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating speaking points...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Speaking Points
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Speech Output */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{speechStructure.topic}</h2>
              <p className="text-gray-600">PREP Framework - Practice your response</p>
            </div>
            <button
              onClick={() => {
                setSpeechStructure(null);
                setTopic('');
                setCurrentSection(0);
              }}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← New Practice
            </button>
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
                      <h4 className="font-medium text-gray-900 mb-2">Your Response:</h4>
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
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPractice;

