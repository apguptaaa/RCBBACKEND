import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createAddon, deleteAddon, updateAddon } from '../controllers/addon.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/', asyncHandler(createAddon));
router.put('/:id', asyncHandler(updateAddon));
router.delete('/:id', asyncHandler(deleteAddon));

export default router;
