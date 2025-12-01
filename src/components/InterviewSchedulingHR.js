import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, CheckCircle, ArrowRight, Sparkles, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';
import MicoCharacter from './MicoCharacter';

const InterviewSchedulingHR = ({ candidate, setActivePage }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [email, setEmail] = useState(candidate?.email || '');
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (!candidate || !candidate.id) {
      alert('Candidate information is missing. Please upload your resume first.');
      return;
    }

    setScheduling(true);

    try {
      const response = await axios.post('http://localhost:5000/api/interviews', {
        candidateId: candidate.id,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        interviewType: 'video',
        interviewLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
        interviewer: { name: 'HR Team', email: 'hr@company.com' }
      });

      setInterviewDetails({
        date: response.data.interview.scheduledDate || scheduledDate,
        time: response.data.interview.scheduledTime || selectedTime,
        candidateEmail: email,
        link: response.data.interview.interviewLink
      });
      setScheduled(true);

      // Redirect to training after 3 seconds
      setTimeout(() => {
        setActivePage('training');
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to schedule interview. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  if (scheduled) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Scheduled!</h2>
          {interviewDetails && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(interviewDetails.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{interviewDetails.time}</p>
                  </div>
                </div>
                {interviewDetails.link && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-600">Meeting Link</p>
                      <a 
                        href={interviewDetails.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:text-teal-700 underline"
                      >
                        {interviewDetails.link}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 rounded-lg">
            <div className="flex items-center gap-3 justify-center mb-3">
              <MicoCharacter animation="celebrate" size="small" />
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm text-teal-700 font-medium mb-2">
              MICO says: "Perfect! Now let's practice with SpeakEasy to ace your interview!"
            </p>
            <button
              onClick={() => setActivePage('training')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-purple-600 transition-all"
            >
              Start Practice with SpeakEasy
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-4">Redirecting to training...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <MicoCharacter animation="talking" size="medium" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Schedule Your Interview</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">HireEasy</span>
              </div>
              <p className="text-gray-600">Choose a convenient date and time</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('generator')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Switch to SpeakEasy
          </button>
        </div>
        <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700 flex items-center gap-2">
            <span className="font-medium">MICO says:</span> "After scheduling, I'll help you practice with SpeakEasy!"
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSchedule}
            disabled={scheduling || !selectedDate || !selectedTime || !email}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              scheduling || !selectedDate || !selectedTime || !email
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {scheduling ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedulingHR;

