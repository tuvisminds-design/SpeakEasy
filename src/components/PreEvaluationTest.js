import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Star, TrendingUp, Users, 
  Sparkles, Trophy, Target, Zap, Heart
} from 'lucide-react';
import MicoCharacter from './MicoCharacter';

const PreEvaluationTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [points, setPoints] = useState(0);

  const questions = [
    {
      id: 'need_1',
      category: 'need',
      question: "You're asked to deliver a presentation to a large audience with minimal preparation time. How do you feel?",
      options: [
        { text: "Confident and ready", value: 1, points: 5 },
        { text: "Slightly nervous but manageable", value: 2, points: 15 },
        { text: "Very anxious and unprepared", value: 3, points: 25 },
        { text: "I would avoid the situation if possible", value: 4, points: 30 }
      ],
      emoji: "🎤"
    },
    {
      id: 'need_2',
      category: 'need',
      question: "How often do you find yourself in situations requiring public speaking?",
      options: [
        { text: "Regularly (weekly)", value: 1, points: 25 },
        { text: "Occasionally (monthly)", value: 2, points: 20 },
        { text: "Rarely (a few times a year)", value: 3, points: 15 },
        { text: "Never", value: 4, points: 10 }
      ],
      emoji: "📅"
    },
    {
      id: 'need_3',
      category: 'need',
      question: "When you think about public speaking, what's your biggest concern?",
      options: [
        { text: "Forgetting what to say", value: 1, points: 20 },
        { text: "Not being clear or articulate", value: 2, points: 25 },
        { text: "Lack of structure in my speech", value: 3, points: 25 },
        { text: "I don't have concerns", value: 4, points: 5 }
      ],
      emoji: "🤔"
    },
    {
      id: 'frequency_1',
      category: 'frequency',
      question: "Imagine Speakeasy offers daily 10-minute exercises to improve your public speaking. How likely are you to incorporate these?",
      options: [
        { text: "Very likely - I'd do it daily", value: 1, points: 30 },
        { text: "Somewhat likely - 3-4 times a week", value: 2, points: 20 },
        { text: "Maybe - 1-2 times a week", value: 3, points: 10 },
        { text: "Unlikely - I'd rarely use it", value: 4, points: 5 }
      ],
      emoji: "⏰"
    },
    {
      id: 'frequency_2',
      category: 'frequency',
      question: "Would you prefer structured lessons or flexible, on-demand exercises?",
      options: [
        { text: "Structured lessons with a plan", value: 1, points: 20 },
        { text: "On-demand exercises when needed", value: 2, points: 15 },
        { text: "A mix of both", value: 3, points: 25 },
        { text: "Neither - I'm not sure", value: 4, points: 5 }
      ],
      emoji: "📚"
    },
    {
      id: 'frequency_3',
      category: 'frequency',
      question: "How important is it for you to practice before an important speaking opportunity?",
      options: [
        { text: "Extremely important - I always practice", value: 1, points: 25 },
        { text: "Very important - I usually practice", value: 2, points: 20 },
        { text: "Somewhat important - I practice sometimes", value: 3, points: 10 },
        { text: "Not important - I wing it", value: 4, points: 5 }
      ],
      emoji: "🎯"
    },
    {
      id: 'recommend_1',
      category: 'recommend',
      question: "After using Speakeasy for a month and noticing improvement, how likely are you to recommend it?",
      options: [
        { text: "Extremely likely - I'd tell everyone", value: 1, points: 30 },
        { text: "Very likely - I'd recommend to friends", value: 2, points: 20 },
        { text: "Somewhat likely - Maybe if asked", value: 3, points: 10 },
        { text: "Not likely - I'd keep it to myself", value: 4, points: 5 }
      ],
      emoji: "💬"
    },
    {
      id: 'recommend_2',
      category: 'recommend',
      question: "What would most influence your decision to recommend Speakeasy?",
      options: [
        { text: "Personalized feedback and improvement", value: 1, points: 25 },
        { text: "Easy-to-use interactive exercises", value: 2, points: 20 },
        { text: "Visible progress tracking", value: 3, points: 15 },
        { text: "Nothing specific", value: 4, points: 5 }
      ],
      emoji: "⭐"
    },
    {
      id: 'recommend_3',
      category: 'recommend',
      question: "How do you typically discover and share apps with others?",
      options: [
        { text: "I actively recommend apps I love", value: 1, points: 25 },
        { text: "I share when someone asks for recommendations", value: 2, points: 20 },
        { text: "I rarely share apps", value: 3, points: 10 },
        { text: "I never share apps", value: 4, points: 5 }
      ],
      emoji: "📱"
    }
  ];

  const handleAnswer = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setPoints(points + option.points);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const calculateScores = () => {
    const needQuestions = questions.filter(q => q.category === 'need');
    const frequencyQuestions = questions.filter(q => q.category === 'frequency');
    const recommendQuestions = questions.filter(q => q.category === 'recommend');

    const needScore = needQuestions.reduce((sum, q) => {
      const answer = answers[q.id];
      return sum + (answer ? answer.points : 0);
    }, 0);
    
    const frequencyScore = frequencyQuestions.reduce((sum, q) => {
      const answer = answers[q.id];
      return sum + (answer ? answer.points : 0);
    }, 0);
    
    const recommendScore = recommendQuestions.reduce((sum, q) => {
      const answer = answers[q.id];
      return sum + (answer ? answer.points : 0);
    }, 0);

    const maxNeedScore = needQuestions.length * 30;
    const maxFrequencyScore = frequencyQuestions.length * 30;
    const maxRecommendScore = recommendQuestions.length * 30;

    return {
      need: {
        score: needScore,
        max: maxNeedScore,
        percentage: Math.round((needScore / maxNeedScore) * 100),
        level: needScore >= maxNeedScore * 0.7 ? 'high' : needScore >= maxNeedScore * 0.4 ? 'medium' : 'low'
      },
      frequency: {
        score: frequencyScore,
        max: maxFrequencyScore,
        percentage: Math.round((frequencyScore / maxFrequencyScore) * 100),
        level: frequencyScore >= maxFrequencyScore * 0.7 ? 'high' : frequencyScore >= maxFrequencyScore * 0.4 ? 'medium' : 'low'
      },
      recommend: {
        score: recommendScore,
        max: maxRecommendScore,
        percentage: Math.round((recommendScore / maxRecommendScore) * 100),
        level: recommendScore >= maxRecommendScore * 0.7 ? 'high' : recommendScore >= maxRecommendScore * 0.4 ? 'medium' : 'low'
      }
    };
  };

  const scores = showResults ? calculateScores() : null;
  const progress = ((currentQuestion + 1) / questions.length) * 100;


  if (showResults && scores) {
    const overallScore = (scores.need.percentage + scores.frequency.percentage + scores.recommend.percentage) / 3;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* MICO Celebration */}
          <div className="text-center mb-8">
            <MicoCharacter animation="celebrate" size="large" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mt-4 mb-2"
            >
              Great Job! 🎉
            </motion.h1>
            <p className="text-gray-600 text-lg">MICO has analyzed your responses</p>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl p-6 mb-8 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Your Engagement Score</h2>
            </div>
            <div className="text-6xl font-bold mb-2">{Math.round(overallScore)}%</div>
            <p className="text-teal-50">
              {overallScore >= 70 ? "You're a perfect match for Speakeasy!" : 
               overallScore >= 40 ? "Speakeasy could be very helpful for you!" : 
               "Speakeasy might help you improve your speaking skills!"}
            </p>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Need Score */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">Need for App</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{scores.need.percentage}%</div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scores.need.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-blue-600 h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600">
                {scores.need.level === 'high' ? "You have a strong need for public speaking support" :
                 scores.need.level === 'medium' ? "You could benefit from speaking practice" :
                 "You have occasional speaking needs"}
              </p>
            </motion.div>

            {/* Frequency Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-gray-900">Usage Frequency</h3>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{scores.frequency.percentage}%</div>
              <div className="w-full bg-purple-200 rounded-full h-3 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scores.frequency.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-purple-600 h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600">
                {scores.frequency.level === 'high' ? "You're likely to use Speakeasy regularly" :
                 scores.frequency.level === 'medium' ? "You'd use it occasionally" :
                 "You might use it when needed"}
              </p>
            </motion.div>

            {/* Recommendation Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-pink-600" />
                <h3 className="font-bold text-gray-900">Likely to Recommend</h3>
              </div>
              <div className="text-4xl font-bold text-pink-600 mb-2">{scores.recommend.percentage}%</div>
              <div className="w-full bg-pink-200 rounded-full h-3 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scores.recommend.percentage}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-pink-600 h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600">
                {scores.recommend.level === 'high' ? "You're very likely to share Speakeasy" :
                 scores.recommend.level === 'medium' ? "You might recommend it" :
                 "You may keep it to yourself"}
              </p>
            </motion.div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              MICO's Insights
            </h3>
            <ul className="space-y-2 text-gray-700">
              {scores.need.percentage >= 70 && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>You have a strong need for public speaking support - Speakeasy is perfect for you!</span>
                </li>
              )}
              {scores.frequency.percentage >= 70 && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>You're likely to use Speakeasy regularly, which will maximize your improvement.</span>
                </li>
              )}
              {scores.recommend.percentage >= 70 && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>You're likely to become a Speakeasy advocate - your friends will thank you!</span>
                </li>
              )}
              {overallScore < 70 && (
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Even with lower scores, Speakeasy can help you build confidence and improve your skills.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Your Speakeasy Journey
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Header with MICO */}
        <div className="text-center mb-8">
          <MicoCharacter animation="pointing" size="large" />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-gray-900 mt-4 mb-2"
          >
            Meet MICO! 🎤
          </motion.h1>
          <p className="text-gray-600">Your friendly speaking coach wants to know you better</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-teal-600">
              {points} points earned
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">{currentQ.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900 flex-1">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    answers[currentQ.id]?.value === option.value
                      ? 'border-teal-500 bg-teal-50 shadow-md'
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
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MICO Encouragement */}
        <div className="text-center">
          <MicoCharacter animation="idle" size="small" />
          <p className="text-sm text-gray-500 mt-2">
            {currentQuestion < questions.length - 1 
              ? "MICO is cheering you on! 🎉" 
              : "Almost done! One more question!"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PreEvaluationTest;

