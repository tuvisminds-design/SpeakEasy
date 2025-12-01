import React, { useState } from 'react';
import { BookOpen, CheckCircle, Eye, Users, Heart, Timer, Target, Volume2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const InterviewPreparation = ({ candidate }) => {
  const [completedTips, setCompletedTips] = useState(new Set());

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
        'Use the PREP framework for impromptu responses',
        'Support each point with evidence or examples',
        'End with a strong call to action or takeaway'
      ]
    }
  ];

  const commonQuestions = [
    {
      category: 'About You',
      questions: [
        'Tell me about yourself',
        'What are your strengths?',
        'What are your weaknesses?',
        'Why do you want this job?',
        'Where do you see yourself in 5 years?'
      ]
    },
    {
      category: 'Experience',
      questions: [
        'Tell me about your previous experience',
        'Describe a challenging project you worked on',
        'How do you handle pressure?',
        'Give an example of a time you showed leadership',
        'What is your greatest achievement?'
      ]
    },
    {
      category: 'Technical',
      questions: [
        'What skills make you a good fit for this role?',
        'How do you stay updated with industry trends?',
        'Describe a problem you solved using your technical skills',
        'What tools and technologies are you most comfortable with?',
        'How do you approach learning new technologies?'
      ]
    }
  ];

  const toggleTipCompletion = (categoryTitle, tipIndex) => {
    const key = `${categoryTitle}-${tipIndex}`;
    setCompletedTips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
            <p className="text-gray-600">Master these tips and practice common questions to ace your interview</p>
          </div>
          <Link
            to="/interview-practice"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg hover:from-teal-600 hover:to-purple-600 transition-all font-medium shadow-lg"
          >
            <Volume2 className="w-5 h-5" />
            Practice with SpeakEasy
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Speaking Tips Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-teal-500" />
          <h2 className="text-2xl font-bold text-gray-900">Speaking Tips</h2>
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
                  {category.tips.map((tip, tipIndex) => {
                    const key = `${category.title}-${tipIndex}`;
                    const isCompleted = completedTips.has(key);
                    return (
                      <li
                        key={tipIndex}
                        className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer hover:text-teal-600 transition-colors"
                        onClick={() => toggleTipCompletion(category.title, tipIndex)}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                        )}
                        <span className={isCompleted ? 'line-through text-gray-500' : ''}>{tip}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Common Interview Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Interview Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commonQuestions.map((category, catIndex) => (
            <div key={catIndex} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
              <ul className="space-y-3">
                {category.questions.map((question, qIndex) => (
                  <li key={qIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-700">
            <strong>💡 Tip:</strong> Use SpeakEasy's AI practice tool to prepare answers for these questions. 
            Click "Practice with SpeakEasy" above to get started!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparation;

