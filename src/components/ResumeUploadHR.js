import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, Mic, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import MicoCharacter from './MicoCharacter';
import ResumeReview from './ResumeReview';

const ResumeUploadHR = ({ setCandidate, setActivePage }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState(null);
  const [candidate, setLocalCandidate] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: ''
  });
  const [extracting, setExtracting] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError(null);
        
        // Auto-extract data from resume (optional feature)
        setExtracting(true);
        try {
          const formData = new FormData();
          formData.append('resume', selectedFile);
          
          const response = await axios.post('http://localhost:5000/api/resumes/parse', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 8000, // 8 second timeout
          });
          
          if (response.data && response.data.extractedData) {
            const extracted = response.data.extractedData;
            const hasExtractedData = extracted.firstName || extracted.lastName || extracted.email || extracted.phone;
            
            if (hasExtractedData) {
              setCandidateInfo(prev => ({
                firstName: prev.firstName || extracted.firstName || '',
                lastName: prev.lastName || extracted.lastName || '',
                email: prev.email || extracted.email || '',
                phone: prev.phone || extracted.phone || ''
              }));
              setAutoFilled(true);
              
              // Show success message briefly
              setTimeout(() => setAutoFilled(false), 3000);
            }
          }
        } catch (extractError) {
          // Silently fail - auto-extraction is optional
          // User can still fill the form manually
          console.log('Auto-extraction unavailable (backend may need restart), user can fill manually');
        } finally {
          setExtracting(false);
        }
      } else {
        setError('Please upload a PDF or Word document');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    // Email is required - check if we have it from extraction or form
    if (!candidateInfo.email) {
      setError('Email is required. Please enter your email address.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('firstName', candidateInfo.firstName || '');
    formData.append('lastName', candidateInfo.lastName || '');
    formData.append('email', candidateInfo.email);
    formData.append('phone', candidateInfo.phone || '');
    formData.append('position', candidateInfo.position || '');

    try {
      const response = await axios.post('http://localhost:5000/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000, // 15 second timeout
      });

      const candidateData = {
        id: response.data.candidate.id,
        name: `${candidateInfo.firstName} ${candidateInfo.lastName}`.trim() || 'Candidate',
        email: candidateInfo.email,
        firstName: candidateInfo.firstName,
        lastName: candidateInfo.lastName,
        phone: candidateInfo.phone,
        position: candidateInfo.position,
        ...response.data.candidate
      };
      setLocalCandidate(candidateData);
      if (setCandidate) {
        setCandidate(candidateData);
      }
      setUploaded(true);
      setShowReviewPrompt(true);
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload resume. Please try again.';
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <MicoCharacter animation="pointing" size="medium" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">HireEasy</span>
              </div>
              <p className="text-gray-600">Get started with your interview journey</p>
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
            <span className="font-medium">MICO says:</span> "Welcome to HireEasy! Upload your resume and I'll help you prepare for your interview with SpeakEasy!"
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {!uploaded ? (
          <>
            {/* Candidate Information Form */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={candidateInfo.firstName}
                  onChange={(e) => setCandidateInfo({...candidateInfo, firstName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={candidateInfo.lastName}
                  onChange={(e) => setCandidateInfo({...candidateInfo, lastName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo({...candidateInfo, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={candidateInfo.phone}
                  onChange={(e) => setCandidateInfo({...candidateInfo, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position You're Applying For
                </label>
                <input
                  type="text"
                  value={candidateInfo.position}
                  onChange={(e) => setCandidateInfo({...candidateInfo, position: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This helps us customize interview training suggestions for your role
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File (PDF or Word)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-400 transition-colors">
                <div className="space-y-1 text-center">
                  {extracting ? (
                    <>
                      <Loader2 className="mx-auto h-12 w-12 text-teal-500 animate-spin" />
                      <p className="text-sm text-teal-600 font-medium">Extracting information from resume...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      <p className="text-xs text-teal-600 mt-2">✨ Information will be auto-filled from your resume</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-teal-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {autoFilled && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg"
                  >
                    <p className="text-sm text-teal-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Information extracted and auto-filled from your resume!</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading || extracting}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                !file || uploading || extracting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {uploading ? 'Uploading...' : extracting ? 'Extracting...' : 'Upload Resume'}
            </button>
          </>
        ) : showReview && candidate ? (
          <ResumeReview
            candidate={candidate}
            onAccept={(suggestions, improvements) => {
              console.log('Accepted suggestions:', suggestions);
              console.log('Improvements:', improvements);
              setShowReview(false);
              setShowReviewPrompt(false);
              setTimeout(() => {
                setActivePage('schedule');
              }, 1000);
            }}
            onSkip={() => {
              setShowReview(false);
              setShowReviewPrompt(false);
              setActivePage('schedule');
            }}
            setActivePage={setActivePage}
          />
        ) : showReviewPrompt ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Resume Uploaded Successfully!</h3>
            <div className="mt-6 mb-8 p-6 bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MicoCharacter animation="talking" size="small" />
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-lg font-medium text-purple-900 mb-2">
                Would you like MICO to review your resume?
              </p>
              <p className="text-sm text-purple-700">
                Get AI-powered suggestions to improve your resume and increase your chances of landing the job!
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  setActivePage('schedule');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Skip Review
              </button>
              <button
                onClick={() => setShowReview(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Yes, Review My Resume
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Uploaded Successfully!</h3>
            <p className="text-gray-600 mt-4">Processing...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadHR;


