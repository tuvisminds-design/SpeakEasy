import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Calendar, GraduationCap, Mic, 
  Upload, ArrowRight, CheckCircle, Sparkles, Target,
  TrendingUp, Users, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import MicoCharacter from '../MicoCharacter';
import axios from 'axios';

const UnifiedDashboard = ({ candidate, setCandidate, setActivePage }) => {
  const [stats, setStats] = useState({
    interviewsScheduled: 0,
    practiceSessions: 0,
    preparationCompleted: false
  });

  useEffect(() => {
    if (candidate) {
      fetchStats();
    }
  }, [candidate]);

  const fetchStats = async () => {
    try {
      // Fetch from backend if available
      if (candidate?.id) {
        const response = await axios.get(`http://localhost:5000/api/candidates/${candidate.id}/stats`);
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Upload Resume',
      description: 'Upload your resume to get started with the interview process',
      icon: FileText,
      path: '/resume-upload',
      completed: !!candidate?.resume,
      color: 'bg-blue-500',
      speakEasyFeature: 'Resume parsing with AI'
    },
    {
      id: 2,
      title: 'Schedule Interview',
      description: 'Choose your preferred interview date and time',
      icon: Calendar,
      path: '/schedule-interview',
      completed: stats.interviewsScheduled > 0,
      color: 'bg-green-500',
      speakEasyFeature: 'Automated scheduling'
    },
    {
      id: 3,
      title: 'Interview Training',
      description: 'Master your interview skills with SpeakEasy AI training',
      icon: Mic,
      path: '/interview-training',
      completed: stats.preparationCompleted,
      color: 'bg-gradient-to-r from-teal-500 to-purple-500',
      speakEasyFeature: 'AI-powered speech training with PREP framework'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with SpeakEasy Showcase */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <MicoCharacter animation="talking" size="medium" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-teal-500" />
              <h1 className="text-3xl font-bold text-gray-900">Interview Training Platform</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Complete interview preparation powered by <strong className="text-teal-600">SpeakEasy AI</strong> - 
              Your intelligent speech training assistant
            </p>
            <div className="mt-3 p-4 bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700 flex items-center gap-2">
                <span className="font-medium">🎯 SpeakEasy Integration:</span> 
                "Practice interview responses with AI-generated speaking points, voice feedback, and real-time coaching!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {candidate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Practice Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.practiceSessions}</p>
              </div>
              <Mic className="w-8 h-8 text-teal-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Training Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.preparationCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
              {stats.preparationCompleted ? (
                <Award className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingUp className="w-8 h-8 text-orange-500" />
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Getting Started Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started with Interview Training</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  step.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      {step.completed && (
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <div className="mb-4 p-2 bg-teal-50 border border-teal-200 rounded">
                      <p className="text-xs text-teal-700">
                        <strong>SpeakEasy:</strong> {step.speakEasyFeature}
                      </p>
                    </div>
                    <Link
                      to={step.path}
                      onClick={() => setActivePage(step.path.split('/')[1])}
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                    >
                      {step.completed ? 'Review' : 'Get Started'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SpeakEasy Showcase Section */}
      <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Powered by SpeakEasy AI</h3>
            <p className="text-teal-50">
              Experience the future of interview preparation with AI-powered speech training
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Target className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">PREP Framework</h4>
            <p className="text-sm text-teal-50">
              Structured responses using Point, Reason, Example, Point methodology
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Volume2 className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">Voice Training</h4>
            <p className="text-sm text-teal-50">
              Real-time speech-to-text and text-to-speech for practice
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Sparkles className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">AI Coaching</h4>
            <p className="text-sm text-teal-50">
              Get personalized speaking points and feedback for any question
            </p>
          </div>
        </div>
        <Link
          to="/interview-training"
          onClick={() => setActivePage('training')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
        >
          Start Training with SpeakEasy
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default UnifiedDashboard;

