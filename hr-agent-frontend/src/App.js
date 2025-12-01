import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import InterviewScheduling from './components/InterviewScheduling';
import InterviewPreparation from './components/InterviewPreparation';
import InterviewPractice from './components/InterviewPractice';
import Sidebar from './components/Sidebar';
import { FileText, Calendar, GraduationCap, Mic, Home } from 'lucide-react';

function App() {
  const [candidate, setCandidate] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard candidate={candidate} setCandidate={setCandidate} />} />
            <Route path="/resume-upload" element={<ResumeUpload setCandidate={setCandidate} />} />
            <Route path="/schedule-interview" element={<InterviewScheduling candidate={candidate} />} />
            <Route path="/interview-preparation" element={<InterviewPreparation candidate={candidate} />} />
            <Route path="/interview-practice" element={<InterviewPractice candidate={candidate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

