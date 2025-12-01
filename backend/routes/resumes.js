const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const { parseResume } = require('../controllers/resumeController');
const { analyzeResume } = require('../controllers/resumeReviewController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/resumes/');
    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Import shared in-memory storage
const { inMemoryCandidates, inMemoryCandidatesById } = require('../utils/inMemoryStorage');

// Parse resume and extract data (without saving)
router.post('/parse', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Parse resume to extract data
    let parsedData = {};
    try {
      parsedData = await parseResume(req.file.path);
    } catch (parseError) {
      console.error('Resume parsing error:', parseError);
      return res.status(500).json({ error: 'Failed to parse resume', message: parseError.message });
    }

    // Return extracted data
    res.json({
      success: true,
      extractedData: {
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        email: parsedData.email || '',
        phone: parsedData.phone || ''
      },
      parsedData: parsedData
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to parse resume', message: error.message });
  }
});

// Upload resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    let { firstName, lastName, email, phone, position } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Check MongoDB connection first
    const isMongoConnected = mongoose.connection.readyState === 1;
    
    let candidate;
    let candidateId;
    
    if (isMongoConnected) {
      // Use MongoDB if available (with timeout)
      try {
        candidate = await Promise.race([
          Candidate.findOne({ email }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
      } catch (timeoutError) {
        console.log('MongoDB query timeout, using in-memory storage');
        candidate = null;
      }
    } else {
      // Use in-memory storage
      candidate = inMemoryCandidates.get(email) || null;
    }
    
    if (candidate && isMongoConnected && candidate.save) {
      // Update existing MongoDB candidate
      candidate.resume = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      };
      if (firstName) candidate.firstName = firstName;
      if (lastName) candidate.lastName = lastName;
      if (phone) candidate.phone = phone;
      if (position) candidate.position = position;
    } else if (!candidate && isMongoConnected) {
      // Create new MongoDB candidate
      try {
        candidate = new Candidate({
          firstName: firstName || 'Unknown',
          lastName: lastName || 'Candidate',
          email,
          phone,
          position: position || '',
          resume: {
            filename: req.file.filename,
            path: req.file.path,
            uploadedAt: new Date()
          }
        });
      } catch (createError) {
        console.log('MongoDB create failed, using in-memory');
        candidate = null;
      }
    }
    
    // Fallback to in-memory if MongoDB failed
    if (!candidate || !isMongoConnected) {
      candidate = inMemoryCandidates.get(email) || {
        firstName: firstName || 'Unknown',
        lastName: lastName || 'Candidate',
        email,
        phone: phone || '',
        position: position || '',
        resume: null,
        parsedData: {}
      };
      
      // Generate ID if not set (CRITICAL: must be set before storing)
      if (!candidate.id) {
        candidate.id = `mem-${Date.now()}`;
      }
      // Store in ID map immediately
      inMemoryCandidatesById.set(candidate.id, candidate);
      
      // Update in-memory candidate
      candidate.resume = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      };
      if (firstName) candidate.firstName = firstName;
      if (lastName) candidate.lastName = lastName;
      if (phone) candidate.phone = phone;
      if (position) candidate.position = position;
    }

    // Parse resume first to extract data
    let parsedData = {};
    try {
      parsedData = await parseResume(req.file.path);
      
      // Auto-fill from resume if form fields are empty
      if (!firstName && parsedData.firstName) {
        firstName = parsedData.firstName;
      }
      if (!lastName && parsedData.lastName) {
        lastName = parsedData.lastName;
      }
      if (!email && parsedData.email) {
        email = parsedData.email;
      }
      if (!phone && parsedData.phone) {
        phone = parsedData.phone;
      }
      
      if (candidate) {
        candidate.parsedData = parsedData;
        // Update candidate with extracted data if missing
        if (!candidate.firstName && firstName) candidate.firstName = firstName;
        if (!candidate.lastName && lastName) candidate.lastName = lastName;
        if (!candidate.email && email) candidate.email = email;
        if (!candidate.phone && phone) candidate.phone = phone;
      if (!candidate.position && position) candidate.position = position;
      }
    } catch (parseError) {
      console.error('Resume parsing error:', parseError);
      // Continue even if parsing fails
    }
    
    // Ensure email is set (required)
    if (!email) {
      return res.status(400).json({ error: 'Email is required. Could not extract from resume.' });
    }

    // Save candidate
    // Generate ID for in-memory storage (always, in case MongoDB fails)
    if (!candidate.id) {
      candidateId = `mem-${Date.now()}`;
      candidate.id = candidateId;
    } else {
      candidateId = candidate.id;
    }
    
    if (isMongoConnected && candidate && candidate.save) {
      try {
        await Promise.race([
          candidate.save(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Save timeout')), 3000))
        ]);
        // MongoDB saved successfully, use MongoDB ID
        candidateId = candidate._id ? candidate._id.toString() : candidateId;
        candidate.id = candidateId; // Update ID
      } catch (saveError) {
        console.log('MongoDB save failed, using in-memory storage');
        // Fallback to in-memory - ID already set above
      }
    }
    
    // Always store in in-memory (for fast lookup during review)
    candidate.parsedData = parsedData;
    inMemoryCandidates.set(email, candidate);
    inMemoryCandidatesById.set(candidateId, candidate); // Store by ID for lookup

    res.status(201).json({
      message: 'Resume uploaded successfully',
      candidate: {
        id: candidateId,
        name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email || email,
        phone: candidate.phone || phone,
        firstName: candidate.firstName || firstName,
        lastName: candidate.lastName || lastName,
        parsedData: candidate.parsedData || parsedData
      },
      extractedData: {
        firstName: parsedData.firstName || firstName || '',
        lastName: parsedData.lastName || lastName || '',
        email: parsedData.email || email || '',
        phone: parsedData.phone || phone || ''
      }
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', message: error.message });
    }
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error', message: 'Failed to save to database. Please check MongoDB connection.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to upload resume', 
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Review resume
router.post('/:id/review', async (req, res) => {
  try {
    const candidateId = req.params.id;
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required' });
    }
    
    let candidate = null;
    
    // STEP 1: ALWAYS check in-memory storage FIRST (for ALL IDs)
    // This prevents MongoDB errors for in-memory candidates
    // Check by ID first (fastest lookup)
    if (inMemoryCandidatesById.has(candidateId)) {
      candidate = inMemoryCandidatesById.get(candidateId);
    } else {
      // Fallback: search by ID in email map
      for (const [email, candidateData] of inMemoryCandidates.entries()) {
        if (candidateData && candidateData.id === candidateId) {
          candidate = candidateData;
          break;
        }
      }
    }
    
    // STEP 2: Only try MongoDB if:
    // - Candidate not found in memory
    // - ID is valid MongoDB ObjectId format (24 hex chars, NOT starting with "mem-")
    // - MongoDB is connected
    if (!candidate && !candidateId.startsWith('mem-') && candidateId.length === 24 && /^[0-9a-fA-F]{24}$/.test(candidateId)) {
      const isMongoConnected = mongoose.connection.readyState === 1;
      if (isMongoConnected) {
        try {
          candidate = await Promise.race([
            Candidate.findById(candidateId),
            new Promise((_, reject) => setTimeout(() => reject(new Error('MongoDB timeout')), 2000))
          ]);
        } catch (mongoError) {
          // MongoDB failed, candidate remains null
          console.log('MongoDB lookup failed, candidate not found');
        }
      }
    }
    
    // STEP 3: Validate candidate found
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found. Please upload your resume first.' });
    }

    if (!candidate.resume || !candidate.resume.path) {
      return res.status(400).json({ error: 'Resume file not found' });
    }

    // STEP 4: Parse resume to get text
    let resumeText = '';
    try {
      const parsedData = await parseResume(candidate.resume.path);
      // Convert parsed data to text representation
      resumeText = JSON.stringify(parsedData);
      if (parsedData.summary) {
        resumeText += ' ' + parsedData.summary;
      }
      if (parsedData.skills && parsedData.skills.length > 0) {
        resumeText += ' ' + parsedData.skills.join(' ');
      }
    } catch (parseError) {
      console.error('Error parsing resume for review:', parseError);
      // Use existing parsed data if available
      resumeText = JSON.stringify(candidate.parsedData || {});
    }

    // STEP 5: Analyze resume
    const analysis = analyzeResume(candidate.parsedData || {}, resumeText);

    res.json({
      success: true,
      analysis,
      candidateId: candidate._id || candidate.id || candidateId
    });
  } catch (error) {
    console.error('Error reviewing resume:', error);
    res.status(500).json({ 
      error: 'Failed to review resume', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
