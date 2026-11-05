import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCart, getFavorites, saveCart, saveFavorites } from '../controllers/account.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
router.get('/cart', asyncHandler(getCart));
router.put('/cart', asyncHandler(saveCart));
router.get('/favorites', asyncHandler(getFavorites));
router.put('/favorites', asyncHandler(saveFavorites));

export default router;
