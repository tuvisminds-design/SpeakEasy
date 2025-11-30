import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Mic } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Check credentials (admin/admin@123)
    if (email.trim().toLowerCase() === 'admin' && password === 'admin@123') {
      // Store login state and proceed
      localStorage.setItem('speakeasy_logged_in', 'true');
      localStorage.setItem('speakeasy_user_email', email);
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SpeakEasy</h1>
          <p className="text-gray-600">Your Personal Speaking Coach</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

