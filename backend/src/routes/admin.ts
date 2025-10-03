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

// Get user usage report
router.get('/user-usage-report', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const report = await adminService.getUserUsageReport();
    return res.json(report);
  } catch (error) {
    console.error('Error fetching user usage report:', error);
    return res.status(500).json({ error: 'Failed to fetch user usage report' });
  }
});

// Get top users
router.get('/top-users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topUsers = await adminService.getTopUsers(limit);
    return res.json(topUsers);
  } catch (error) {
    console.error('Error fetching top users:', error);
    return res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

// Get detailed analytics
router.get('/analytics', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const analytics = await adminService.getDetailedAnalytics();
    return res.json(analytics);
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch detailed analytics' });
  }
});

// Get feedback statistics
router.get('/feedback-stats', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await adminService.getFeedbackStats();
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});

export default router;
