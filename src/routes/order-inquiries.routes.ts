import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  createOrderInquiry,
  listOrderInquiries,
  updateOrderInquiryStatus
} from '../controllers/order-inquiry.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});
router.post('/', createLimiter, asyncHandler(createOrderInquiry));
router.get('/', authenticate, requireAdmin, asyncHandler(listOrderInquiries));
router.patch('/:id/status', authenticate, requireAdmin, asyncHandler(updateOrderInquiryStatus));

export default router;
