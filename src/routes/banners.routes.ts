import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createBanner, deleteBanner, updateBanner } from '../controllers/banner.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/', asyncHandler(createBanner));
router.put('/:id', asyncHandler(updateBanner));
router.delete('/:id', asyncHandler(deleteBanner));

export default router;
