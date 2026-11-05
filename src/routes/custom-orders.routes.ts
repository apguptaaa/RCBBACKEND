import { Router } from 'express';
import { createCustomOrder } from '../controllers/custom-order.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.post('/', asyncHandler(createCustomOrder));

export default router;
