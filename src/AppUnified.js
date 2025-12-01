import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, BookOpen, Clock, Sparkles, Target, Zap, 
  Volume2, MicOff, Play, Pause, ArrowRight, CheckCircle,
  Loader2, LogOut, Eye, Users, Heart, Timer, RefreshCw,
  FileText, Calendar, GraduationCap, Home, Briefcase, Upload
} from 'lucide-react';
import deepgramVoiceAgent from './services/deepgramVoiceAgent';
import Login from './components/Login';
import PreEvaluationTest from './components/PreEvaluationTest';
import MicoCharacter from './components/MicoCharacter';
import axios from 'axios';

// Import HR Agent components (we'll create unified versions)
import UnifiedDashboard from './components/unified/UnifiedDashboard';
import ResumeUpload from './components/unified/ResumeUpload';
import InterviewScheduling from './components/unified/InterviewScheduling';
import InterviewTraining from './components/unified/InterviewTraining';
import UnifiedSidebar from './components/unified/UnifiedSidebar';

const AppUnified = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('speakeasy_logged_in') === 'true';
  });
  const [hasCompletedTest, setHasCompletedTest] = useState(() => {
    return localStorage.getItem('speakeasy_test_completed') === 'true';
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [candidate, setCandidate] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('speakeasy_logged_in');
    localStorage.removeItem('speakeasy_user_email');
    localStorage.removeItem('speakeasy_test_completed');
    setIsLoggedIn(false);
    setHasCompletedTest(false);
    setCandidate(null);
    setActivePage('dashboard');
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
    <Router>
      <div className="min-h-screen bg-gray-50">
        <UnifiedSidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          handleLogout={handleLogout}
        />
        <main className="ml-64 p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <UnifiedDashboard 
                    candidate={candidate} 
                    setCandidate={setCandidate}
                    setActivePage={setActivePage}
                  />
                } 
              />
              <Route 
                path="/resume-upload" 
                element={
                  <ResumeUpload 
                    setCandidate={setCandidate}
                    setActivePage={setActivePage}
                  />
                } 
              />
              <Route 
                path="/schedule-interview" 
                element={
                  <InterviewScheduling 
                    candidate={candidate}
                    setActivePage={setActivePage}
                  />
                } 
              />
              <Route 
                path="/interview-training" 
                element={
                  <InterviewTraining 
                    candidate={candidate}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

export default AppUnified;

