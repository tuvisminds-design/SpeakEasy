import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Star, ArrowRight, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import MicoCharacter from './MicoCharacter';

const ResumeReview = ({ candidate, onAccept, onSkip, setActivePage }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState(new Set());

  useEffect(() => {
    if (candidate?.id) {
      fetchReview();
    }
  }, [candidate]);

  const fetchReview = async () => {
    if (!candidate || !candidate.id) {
      setError('Candidate information not available. Please upload your resume first.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5000/api/resumes/${candidate.id}/review`);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to review resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (index) => {
    const newAccepted = new Set(acceptedSuggestions);
    if (newAccepted.has(index)) {
      newAccepted.delete(index);
    } else {
      newAccepted.add(index);
    }
    setAcceptedSuggestions(newAccepted);
  };

  const handleAccept = () => {
    // If suggestions are selected, pass only those; otherwise pass all suggestions
    const accepted = acceptedSuggestions.size > 0
      ? analysis.suggestions.filter((_, index) => acceptedSuggestions.has(index))
      : analysis.suggestions; // Accept all if none selected
    onAccept(accepted, analysis.improvements);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-700 border-red-300';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <MicoCharacter animation="talking" size="medium" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Resume</h2>
              <p className="text-gray-600">MICO is reviewing your resume and preparing suggestions...</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Continue Without Review
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <MicoCharacter animation="celebrate" size="medium" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Resume Review</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">HireEasy</span>
              </div>
              <p className="text-gray-600">AI-powered suggestions to improve your resume</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('generator')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Switch to SpeakEasy
          </button>
        </div>
        <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700 flex items-center gap-2">
            <span className="font-medium">MICO says:</span> 
            "I've analyzed your resume! Here are personalized suggestions to make it stand out. You can accept the changes you like!"
          </p>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Resume Quality Score</h2>
            <p className="text-sm text-gray-600">Based on content, formatting, and best practices</p>
          </div>
          <div className={`px-6 py-4 rounded-lg ${getScoreColor(analysis.score)}`}>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-3xl font-bold">{analysis.score}</span>
              <span className="text-lg">/100</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Following our suggestions can improve your score significantly!</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-500" />
          Improvement Suggestions
        </h2>
        <p className="text-gray-600 mb-6">
          Review the suggestions below and select the ones you'd like to apply to your resume.
        </p>

        <div className="space-y-4">
          {analysis.suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
                acceptedSuggestions.has(index)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => toggleSuggestion(index)}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${acceptedSuggestions.has(index) ? 'text-purple-600' : 'text-gray-400'}`}>
                  {acceptedSuggestions.has(index) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{suggestion.category}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Issue:</strong> {suggestion.issue}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Suggestion:</strong> {suggestion.suggestion}
                    </p>
                  </div>
                  {suggestion.example && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
                      <p className="text-xs text-gray-600 whitespace-pre-line">{suggestion.example}</p>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {suggestion.priority === 'high' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {analysis.suggestions.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellent Resume!</h3>
            <p className="text-gray-600">Your resume looks great! No major improvements needed.</p>
          </div>
        )}
      </div>

      {/* Improvements Summary */}
      {analysis.improvements && Object.keys(analysis.improvements).some(key => analysis.improvements[key]) && (
        <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl border border-purple-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Improvements</h3>
          <div className="space-y-3">
            {analysis.improvements.summary && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Professional Summary:</h4>
                <p className="text-sm text-gray-700">{analysis.improvements.summary}</p>
              </div>
            )}
            {analysis.improvements.skills && analysis.improvements.skills.length > 0 && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Additional Skills to Consider:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.improvements.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onSkip}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Skip Review
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:from-purple-600 hover:to-teal-600 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="w-5 h-5" />
          Accept {acceptedSuggestions.size > 0 ? `${acceptedSuggestions.size} Selected ` : 'All '}Suggestions
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResumeReview;

