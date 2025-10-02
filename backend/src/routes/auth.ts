import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { AuthService } from '../services/authService';
import { SendOTPRequest, VerifyOTPRequest, UpdateProfileRequest } from '../types';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const authService = new AuthService();

const sendOTPSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(4).pattern(/^\d+$/).required(),
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().max(100).optional(),
  last_name: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  bio: Joi.string().max(1000).optional(),
  avatar_url: Joi.string().uri().max(500).optional(),
  company: Joi.string().max(100).optional(),
  job_title: Joi.string().max(100).optional(),
  location: Joi.string().max(100).optional(),
  website: Joi.string().uri().max(255).optional(),
});

router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { error, value } = sendOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const request: SendOTPRequest = value;
    const result = await authService.sendOTP(request);
    
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { error, value } = verifyOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const request: VerifyOTPRequest = value;
    const result = await authService.verifyOTP(request);
    
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'OTP verification failed' });
  }
});

router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await authService.getUserProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const profileData: UpdateProfileRequest = value;
    const updatedProfile = await authService.updateUserProfile(req.user!.id, profileData);
    
    return res.json(updatedProfile);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
