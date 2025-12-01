import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, FileText, Calendar, GraduationCap, Mic, 
  Briefcase, LogOut, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const UnifiedSidebar = ({ activePage, setActivePage, handleLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', page: 'dashboard' },
    { path: '/resume-upload', icon: FileText, label: 'Upload Resume', page: 'resume' },
    { path: '/schedule-interview', icon: Calendar, label: 'Schedule Interview', page: 'schedule' },
    { path: '/interview-training', icon: Mic, label: 'Interview Training', page: 'training' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SpeakEasy</h1>
            <p className="text-xs text-gray-500">Interview Training</p>
          </div>
        </div>
        <div className="mt-3 px-3 py-2 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border border-teal-200">
          <p className="text-xs text-teal-700 font-medium">
            Powered by AI Speech Training
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          NAVIGATION
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setActivePage(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-50 to-purple-50 text-teal-600 border border-teal-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* SpeakEasy Showcase */}
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-semibold text-teal-900">SpeakEasy Features</h3>
          </div>
          <ul className="space-y-1 text-xs text-teal-700">
            <li className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              AI Voice Training
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              PREP Framework
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Real-time Feedback
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UnifiedSidebar;

