import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { getCurrentUser, login, register } from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', asyncHandler(register));
router.post('/login', loginLimiter, asyncHandler(login));
router.get('/me', authenticate, asyncHandler(getCurrentUser));

export default router;
