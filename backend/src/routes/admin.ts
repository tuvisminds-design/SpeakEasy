import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { AdminService } from '../services/adminService';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const adminService = new AdminService();

// Get AI settings
router.get('/ai-settings', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await adminService.getAISettings();
    return res.json(settings);
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return res.status(500).json({ error: 'Failed to fetch AI settings' });
  }
});

// Update AI provider
router.put('/ai-provider', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schema = Joi.object({
      provider: Joi.string().valid('openai', 'claude', 'gemini').required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await adminService.updateAIProvider(value.provider);
    return res.json({ message: `AI provider updated to ${value.provider}` });
  } catch (error) {
    console.error('Error updating AI provider:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to update AI provider' 
    });
  }
});

// Get system statistics
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await adminService.getSystemStats();
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return res.status(500).json({ error: 'Failed to fetch system statistics' });
  }
});

export default router;
