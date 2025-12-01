const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Candidate = require('../models/Candidate');
const { uploadResume, parseResume } = require('../controllers/resumeController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Upload resume and create candidate
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ email });
    
    if (candidate) {
      // Update existing candidate
      candidate.resume = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      };
      candidate.firstName = firstName || candidate.firstName;
      candidate.lastName = lastName || candidate.lastName;
      candidate.phone = phone || candidate.phone;
    } else {
      // Create new candidate
      candidate = new Candidate({
        firstName,
        lastName,
        email,
        phone,
        resume: {
          filename: req.file.filename,
          path: req.file.path,
          uploadedAt: new Date()
        }
      });
    }

    // Parse resume
    try {
      const parsedData = await parseResume(req.file.path);
      candidate.parsedData = parsedData;
    } catch (parseError) {
      console.error('Resume parsing error:', parseError);
      // Continue even if parsing fails
    }

    await candidate.save();

    res.status(201).json({
      message: 'Resume uploaded successfully',
      candidate: candidate
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume', message: error.message });
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates', message: error.message });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidate', message: error.message });
  }
});

// Update candidate status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
});

module.exports = router;

