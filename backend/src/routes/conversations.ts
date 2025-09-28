import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { ConversationService } from '../services/conversationService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { GenerateSpeechRequest } from '../types';

const router = Router();
const conversationService = new ConversationService();

const generateSpeechSchema = Joi.object({
  topic: Joi.string().required().max(255),
  speech_type: Joi.string().valid('impromptu', 'planned').required(),
  duration: Joi.number().integer().min(1).max(30).required(),
});

// Generate speech
router.post('/generate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error, value } = generateSpeechSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const request: GenerateSpeechRequest = value;
    const result = await conversationService.generateSpeech(req.user!.id, request);
    
    return res.json(result);
  } catch (error) {
    console.error('Error generating speech:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate speech' 
    });
  }
});

// Get conversation history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await conversationService.getConversationHistory(req.user!.id, page, limit);
    return res.json(result);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// Get conversation by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await conversationService.getConversationById(conversationId, req.user!.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Delete conversation
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const deleted = await conversationService.deleteConversation(conversationId, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Get conversation statistics
router.get('/stats/overview', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await conversationService.getConversationStats(req.user!.id);
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching conversation stats:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation statistics' });
  }
});

export default router;
