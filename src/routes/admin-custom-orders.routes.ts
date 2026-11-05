import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  listCustomOrders,
  updateCustomOrderStatus
} from '../controllers/custom-order.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', asyncHandler(listCustomOrders));
router.patch('/:id/status', asyncHandler(updateCustomOrderStatus));

export default router;
