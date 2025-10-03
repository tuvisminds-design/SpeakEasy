import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { FeedbackService } from '../services/feedbackService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const feedbackService = new FeedbackService();

// Submit app feedback
router.post('/app', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schema = Joi.object({
      feedback_text: Joi.string().min(10).max(1000).required(),
      rating: Joi.number().integer().min(1).max(5).required(),
      feedback_type: Joi.string().valid('general', 'bug', 'feature', 'improvement').optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const feedback = await feedbackService.submitAppFeedback(req.user!.email, value);
    return res.json(feedback);
  } catch (error) {
    console.error('Error submitting app feedback:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Submit response feedback
router.post('/response', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schema = Joi.object({
      conversation_id: Joi.number().integer().positive().required(),
      rating: Joi.number().integer().min(1).max(5).required(),
      correction_text: Joi.string().max(500).optional().allow(''),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const feedback = await feedbackService.submitResponseFeedback(req.user!.email, value);
    return res.json(feedback);
  } catch (error) {
    console.error('Error submitting response feedback:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get user's app feedback
router.get('/app', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const feedback = await feedbackService.getAppFeedback(req.user!.email);
    return res.json(feedback);
  } catch (error) {
    console.error('Error fetching app feedback:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get user's response feedback
router.get('/response', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const feedback = await feedbackService.getResponseFeedback(req.user!.email);
    return res.json(feedback);
  } catch (error) {
    console.error('Error fetching response feedback:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback for specific conversation
router.get('/response/:conversationId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversationId = parseInt(req.params.conversationId);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const feedback = await feedbackService.getResponseFeedbackForConversation(
      conversationId,
      req.user!.email
    );
    return res.json(feedback);
  } catch (error) {
    console.error('Error fetching conversation feedback:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
