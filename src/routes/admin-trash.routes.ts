import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  listTrash,
  permanentlyDeleteTrashItem,
  restoreTrashItem
} from '../controllers/trash.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', asyncHandler(listTrash));
router.post('/:type/:id/restore', asyncHandler(restoreTrashItem));
router.delete('/:type/:id', asyncHandler(permanentlyDeleteTrashItem));

export default router;
