const express = require('express');
const router = express.Router();
const { sendInterviewEmail, sendInterviewReminder } = require('../services/emailService');

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    await sendInterviewEmail(email, {
      candidateName: 'Test Candidate',
      interviewDate: new Date(),
      interviewTime: '10:00 AM',
      interviewType: 'video',
      interviewLink: 'https://meet.google.com/test',
      interviewer: 'HR Team'
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test email', message: error.message });
  }
});

module.exports = router;
