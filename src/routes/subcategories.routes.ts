import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createSubcategory, deleteSubcategory, updateSubcategory } from '../controllers/subcategory.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/', asyncHandler(createSubcategory));
router.put('/:id', asyncHandler(updateSubcategory));
router.delete('/:id', asyncHandler(deleteSubcategory));

export default router;
