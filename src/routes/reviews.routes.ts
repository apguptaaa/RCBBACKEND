import { Router } from 'express';
import { listPublicReviews } from '../controllers/review.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(listPublicReviews));

export default router;
