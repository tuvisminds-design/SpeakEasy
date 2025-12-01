import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, GraduationCap, Mic, Upload, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = ({ candidate, setCandidate }) => {
  const [stats, setStats] = useState({
    interviewsScheduled: 0,
    practiceSessions: 0,
    preparationCompleted: false
  });

  useEffect(() => {
    // Fetch candidate stats
    if (candidate) {
      fetchStats();
    }
  }, [candidate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidates/${candidate.id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Upload Resume',
      description: 'Upload your resume to get started',
      icon: FileText,
      path: '/resume-upload',
      completed: !!candidate?.resume,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Schedule Interview',
      description: 'Choose your preferred interview time',
      icon: Calendar,
      path: '/schedule-interview',
      completed: stats.interviewsScheduled > 0,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Interview Preparation',
      description: 'Learn tips and prepare for your interview',
      icon: GraduationCap,
      path: '/interview-preparation',
      completed: stats.preparationCompleted,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Practice Session',
      description: 'Practice with SpeakEasy AI training',
      icon: Mic,
      path: '/interview-practice',
      completed: stats.practiceSessions > 0,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HR Agent</h1>
        <p className="text-gray-600">Your intelligent recruitment assistant with AI-powered interview training</p>
      </div>

      {/* Quick Stats */}
      {candidate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Practice Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.practiceSessions}</p>
              </div>
              <Mic className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Preparation Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.preparationCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
              {stats.preparationCompleted ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <GraduationCap className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Getting Started */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 ${
                  step.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-primary-300'
                } transition-all`}
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
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    <Link
                      to={step.path}
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
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

      {/* SpeakEasy Integration Info */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Interview Training</h3>
            <p className="text-sm text-gray-600">
              Practice your interview responses with SpeakEasy's AI speech generator. Get personalized speaking points,
              tips, and real-time feedback to boost your confidence before the interview.
            </p>
          </div>
          <Link
            to="/interview-practice"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Start Practice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

