import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Star, TrendingUp, Users, 
  Sparkles, Trophy, Target, Zap, Heart, Loader2
} from 'lucide-react';
import MicoCharacter from './MicoCharacter';

const PythonBotSurvey = ({ onComplete }) => {
  const [greeting, setGreeting] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [points, setPoints] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGreeting, setShowGreeting] = useState(true);

  // Initialize survey - fetch greeting and questions from Python API
  useEffect(() => {
    const initializeSurvey = async (retries = 5) => {
      try {
        setLoading(true);
        setError(null);
        
        // Python API is auto-started by backend
        // Backend will wait for API to be ready, so we just retry with patience
        let greetingRes;
        let apiReady = false;
        
        // Try fetching greeting - backend handles waiting for Python API
        for (let i = 0; i < 12; i++) { // Up to 12 seconds total
          try {
            greetingRes = await fetch('http://localhost:5000/api/survey/greeting', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(6000) // 6 second timeout per request
            });
            if (greetingRes.ok) {
              apiReady = true;
              break;
            }
          } catch (e) {
            // Continue retrying
            if (i < 11) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between retries
            }
          }
        }
        
        if (!apiReady || !greetingRes || !greetingRes.ok) {
          throw new Error('Python survey API is starting. Please wait a moment and try again.');
        }
        
        const greetingData = await greetingRes.json();
        setGreeting(greetingData);
        
        // Fetch questions (with error handling)
        let questionsRes;
        try {
          questionsRes = await fetch('http://localhost:5000/api/survey/questions');
          if (!questionsRes.ok) throw new Error('Failed to fetch questions');
        } catch (e) {
          // Retry once
          await new Promise(resolve => setTimeout(resolve, 300));
          questionsRes = await fetch('http://localhost:5000/api/survey/questions');
          if (!questionsRes.ok) throw new Error('Failed to fetch questions');
        }
        const questionsData = await questionsRes.json();
        setQuestions(questionsData.questions || []);
        
        // Start survey session (with error handling)
        let sessionRes;
        try {
          sessionRes = await fetch('http://localhost:5000/api/survey/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          if (!sessionRes.ok) throw new Error('Failed to start survey');
        } catch (e) {
          // Retry once
          await new Promise(resolve => setTimeout(resolve, 300));
          sessionRes = await fetch('http://localhost:5000/api/survey/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          if (!sessionRes.ok) throw new Error('Failed to start survey');
        }
        const sessionData = await sessionRes.json();
        setSessionId(sessionData.session_id);
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing survey:', err);
        setError(err.message || 'Failed to connect to Python survey API. Please ensure the backend server is running.');
        setLoading(false);
      }
    };

    initializeSurvey();
  }, []);

  const handleAnswer = async (questionId, option) => {
    if (!sessionId) return;
    
    try {
      // Submit answer to Python API
      const response = await fetch('http://localhost:5000/api/survey/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: questionId,
          option: option
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit answer');
      const data = await response.json();
      
      // Update local state
      const newAnswers = { ...answers, [questionId]: option };
      setAnswers(newAnswers);
      setPoints(data.points || points + option.points);
      
      // Move to next question
      setTimeout(() => {
        if (data.current_question < data.total_questions) {
          setCurrentQuestion(data.current_question);
        } else {
          completeSurvey();
        }
      }, 500);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err.message);
    }
  };

  const completeSurvey = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/survey/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
      
      if (!response.ok) throw new Error('Failed to complete survey');
      const data = await response.json();
      
      // Mark survey as completed in localStorage
      localStorage.setItem('speakeasy_test_completed', 'true');
      
      setShowResults(true);
      // Results are in data.results and data.scores
    } catch (err) {
      console.error('Error completing survey:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <MicoCharacter animation="idle" size="large" />
          <div className="flex items-center justify-center gap-2 text-teal-600 mt-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>MICO is preparing your survey...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <MicoCharacter animation="idle" size="large" />
          <div className="text-red-600 mb-4 mt-4">
            <p className="font-bold text-lg">Error loading survey</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            The Python survey API may still be starting. Please wait a moment and try again.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
              onClick={() => {
              setError(null);
              setLoading(true);
              // Retry initialization (faster)
              const initializeSurvey = async () => {
                try {
                  // Check health first
                  let apiReady = false;
                  for (let i = 0; i < 5; i++) {
                    try {
                      const healthRes = await fetch('http://localhost:5000/api/survey/health');
                      if (healthRes.ok) {
                        const healthData = await healthRes.json();
                        if (healthData.ready) {
                          apiReady = true;
                          break;
                        }
                      }
                    } catch (e) {
                      // Continue
                    }
                    if (i < 4) await new Promise(resolve => setTimeout(resolve, 300));
                  }
                  
                  if (!apiReady) {
                    throw new Error('Python API is still starting. Please wait a moment.');
                  }
                  
                  const greetingRes = await fetch('http://localhost:5000/api/survey/greeting');
                  if (!greetingRes.ok) throw new Error('Failed to fetch greeting');
                  const greetingData = await greetingRes.json();
                  setGreeting(greetingData);
                  
                  const questionsRes = await fetch('http://localhost:5000/api/survey/questions');
                  if (!questionsRes.ok) throw new Error('Failed to fetch questions');
                  const questionsData = await questionsRes.json();
                  setQuestions(questionsData.questions || []);
                  
                  const sessionRes = await fetch('http://localhost:5000/api/survey/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                  });
                  if (!sessionRes.ok) throw new Error('Failed to start survey');
                  const sessionData = await sessionRes.json();
                  setSessionId(sessionData.session_id);
                  
                  setLoading(false);
                } catch (err) {
                  setError(err.message);
                  setLoading(false);
                }
              };
              initializeSurvey();
            }}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!greeting || questions.length === 0) {
    return null;
  }

  // Show greeting screen first
  if (showGreeting && greeting && currentQuestion === 0 && Object.keys(answers).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <MicoCharacter animation="pointing" size="large" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mt-4 mb-2"
          >
            👋 {greeting.greeting}! I'm MICO!
          </motion.h1>
          <p className="text-gray-600 mb-4">{greeting.message}</p>
          <p className="text-gray-500 text-sm mb-6">{greeting.submessage}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowGreeting(false);
              setCurrentQuestion(0); // Start with first question
            }}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Let's Begin! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show results (reuse PreEvaluationTest results UI logic)
  if (showResults) {
    // For now, show completion and call onComplete
    // In a full implementation, we'd fetch and display the results from the API
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <MicoCharacter animation="celebrate" size="large" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mt-4 mb-2"
          >
            Great Job! 🎉
          </motion.h1>
          <p className="text-gray-600 mb-6">MICO has analyzed your responses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Your Speakeasy Journey
            <ArrowRight className="w-5 h-5 inline-block ml-2" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show question in bot interface
  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Bot Chat Interface */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4 flex items-center gap-3">
            <MicoCharacter animation="talking" size="medium" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">MICO Bot</h2>
              <p className="text-teal-100 text-sm">Your speaking coach assistant</p>
            </div>
            <div className="text-white text-sm font-medium">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            {/* Bot Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0">
                  <MicoCharacter animation="pointing" size="small" />
                </div>
                <div className="flex-1">
                  <div className="bg-teal-50 rounded-2xl rounded-tl-none p-4 border border-teal-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{currentQ.emoji}</span>
                      <span className="font-semibold text-gray-900">MICO</span>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Answer Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mt-6"
            >
              <p className="text-sm font-medium text-gray-600 mb-3">Choose your answer:</p>
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    answers[currentQ.id]?.value === option.value
                      ? 'border-teal-500 bg-teal-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    {answers[currentQ.id]?.value === option.value && (
                      <CheckCircle className="w-5 h-5 text-teal-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Footer with encouragement */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MicoCharacter animation="idle" size="small" />
                <span>
                  {currentQuestion < questions.length - 1 
                    ? "MICO is cheering you on! 🎉" 
                    : "Almost done! One more question!"}
                </span>
              </div>
              <div className="text-sm font-medium text-teal-600">
                {points} points earned
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonBotSurvey;
