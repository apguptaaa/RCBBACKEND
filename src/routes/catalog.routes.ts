import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getAdminCatalog, getPublicCatalog } from '../controllers/catalog.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/catalog', asyncHandler(getPublicCatalog));
router.get('/admin/catalog', authenticate, requireAdmin, asyncHandler(getAdminCatalog));

export default router;
