import { Router } from 'express';
import { subscribe } from '../controllers/newsletter.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.post('/', asyncHandler(subscribe));

export default router;
