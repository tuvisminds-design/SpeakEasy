const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const { sendInterviewEmail } = require('../services/emailService');
const { inMemoryCandidatesById } = require('../utils/inMemoryStorage');

// Schedule interview
router.post('/', async (req, res) => {
  try {
    const {
      candidateId,
      scheduledDate,
      scheduledTime,
      duration,
      interviewType,
      interviewLink,
      location,
      interviewer
    } = req.body;

    // Validate required fields
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required' });
    }
    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    // Get candidate details
    // STEP 1: ALWAYS check in-memory storage FIRST (for ALL IDs)
    // This prevents MongoDB errors for in-memory candidates
    let candidate = null;
    
    // Check by ID first (fastest lookup)
    if (inMemoryCandidatesById.has(candidateId)) {
      candidate = inMemoryCandidatesById.get(candidateId);
    } else {
      // Fallback: search by ID in email map
      for (const [email, candidateData] of require('../utils/inMemoryStorage').inMemoryCandidates.entries()) {
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
    if (!candidate && candidateId && typeof candidateId === 'string' && !candidateId.startsWith('mem-') && candidateId.length === 24 && /^[0-9a-fA-F]{24}$/.test(candidateId)) {
      const isMongoConnected = mongoose.connection.readyState === 1;
      if (isMongoConnected) {
        try {
          candidate = await Promise.race([
            Candidate.findById(candidateId),
            new Promise((_, reject) => setTimeout(() => reject(new Error('MongoDB timeout')), 2000))
          ]);
        } catch (mongoError) {
          console.log('MongoDB lookup failed or timed out, candidate not found');
        }
      }
    }
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Create interview (only if MongoDB is connected)
    let interview = null;
    const isMongoConnected = mongoose.connection.readyState === 1;
    
    if (isMongoConnected && candidateId && typeof candidateId === 'string' && !candidateId.startsWith('mem-')) {
      try {
        interview = new Interview({
          candidateId,
          candidateEmail: candidate.email,
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          duration: duration || 30,
          interviewType: interviewType || 'video',
          interviewLink,
          location,
          interviewer
        });
        await interview.save();
      } catch (interviewError) {
        console.log('Failed to save interview to MongoDB, using in-memory only');
      }
    }
    
    // Update candidate (in-memory or MongoDB)
    candidate.interviewScheduled = true;
    candidate.interviewDate = new Date(scheduledDate);
    candidate.interviewTime = scheduledTime;
    candidate.interviewLink = interviewLink;
    candidate.status = 'interview-scheduled';
    
    // Save to MongoDB if it's a MongoDB candidate
    if (candidate.save && !candidateId.startsWith('mem-') && isMongoConnected) {
      try {
        await candidate.save();
      } catch (saveError) {
        console.log('Failed to update candidate in MongoDB');
      }
    }
    
    // Store updated candidate in memory (for in-memory candidates)
    if (candidateId.startsWith('mem-')) {
      inMemoryCandidatesById.set(candidateId, candidate);
    }

    // Email service is currently disabled
    // To enable: Set ENABLE_EMAIL=true and configure SMTP credentials in backend/.env
    const emailSent = false; // Email service disabled

    // Email service is currently disabled
    const emailStatus = 'Email notifications are currently disabled';

    res.status(201).json({
      message: 'Interview scheduled successfully',
      emailStatus: emailStatus,
      interview: interview || {
        candidateId,
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        duration: duration || 30,
        interviewType: interviewType || 'video',
        interviewLink,
        location,
        interviewer,
        emailSent,
        _id: `mem-interview-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ error: 'Failed to schedule interview', message: error.message });
  }
});

// Get all interviews
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('candidateId')
      .sort({ scheduledDate: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interviews', message: error.message });
  }
});

// Get interview by ID
router.get('/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId');
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview', message: error.message });
  }
});

// Update interview
router.put('/:id', async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interview', message: error.message });
  }
});

// Cancel interview
router.patch('/:id/cancel', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    interview.status = 'cancelled';
    await interview.save();

    // Update candidate
    const candidate = await Candidate.findById(interview.candidateId);
    if (candidate) {
      candidate.interviewScheduled = false;
      await candidate.save();
    }

    res.json({ message: 'Interview cancelled successfully', interview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel interview', message: error.message });
  }
});

module.exports = router;

