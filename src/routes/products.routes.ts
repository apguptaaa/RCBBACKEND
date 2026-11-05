import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createProduct, deleteProduct, updateProduct } from '../controllers/product.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/', asyncHandler(createProduct));
router.put('/:id', asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(deleteProduct));

export default router;
