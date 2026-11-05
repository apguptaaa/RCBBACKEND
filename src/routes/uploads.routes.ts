import { Router } from 'express';
import multer from 'multer';
import { uploadImageController } from '../controllers/upload.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      callback(new AppError('Upload a JPEG, PNG, GIF, or WebP image.', 400));
      return;
    }
    callback(null, true);
  }
});

router.post(
  '/image',
  authenticate,
  requireAdmin,
  upload.single('image'),
  asyncHandler(uploadImageController)
);

export default router;
