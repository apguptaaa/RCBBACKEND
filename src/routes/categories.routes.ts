import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/', asyncHandler(createCategory));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
