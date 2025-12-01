import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';

const InterviewScheduling = ({ candidate }) => {
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
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !email) {
      alert('Please fill in all fields');
      return;
    }

    setScheduling(true);

    try {
      const response = await axios.post('http://localhost:5000/api/interviews', {
        candidateId: candidate?.id,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        interviewType: 'video',
        interviewLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
        interviewer: { name: 'HR Team', email: 'hr@company.com' }
      });

      setInterviewDetails({
        date: response.data.interview.scheduledDate,
        time: response.data.interview.scheduledTime,
        candidateEmail: email,
        link: response.data.interview.interviewLink
      });
      setScheduled(true);

      // Auto-redirect to preparation after 3 seconds
      setTimeout(() => {
        window.location.href = '/interview-preparation';
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
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(interviewDetails.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{interviewDetails.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-600">Confirmation Email</p>
                    <p className="font-medium text-gray-900">Sent to {interviewDetails.candidateEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="text-gray-600 mt-6">Redirecting to interview preparation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Interview</h1>
        <p className="text-gray-600">Choose a convenient date and time for your interview</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Time */}
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
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
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {scheduling ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduling;

