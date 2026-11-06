import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { claimPromo } from '../controllers/promo.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const claimLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/claim', claimLimiter, asyncHandler(claimPromo));

export default router;
