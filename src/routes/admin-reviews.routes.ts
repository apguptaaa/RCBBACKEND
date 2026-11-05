import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  createReview,
  deleteReview,
  listAdminReviews,
  updateReview
} from '../controllers/review.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', asyncHandler(listAdminReviews));
router.post('/', asyncHandler(createReview));
router.put('/:id', asyncHandler(updateReview));
router.delete('/:id', asyncHandler(deleteReview));

export default router;
