import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { AuthService } from '../services/authService';
import { LoginRequest } from '../types';

const router = Router();
const authService = new AuthService();

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const credentials: LoginRequest = value;
    const result = await authService.login(credentials);
    
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
  }
});

export default router;
