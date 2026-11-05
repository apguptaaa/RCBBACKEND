import type { RequestHandler } from 'express';
import { uploadImage } from '../services/cloudinary.service.js';
import { AppError } from '../utils/appError.js';

export const uploadImageController: RequestHandler = async (req, res) => {
  if (!req.file) {
    throw new AppError('An image file is required in the "image" field.', 400);
  }

  res.status(201).json(await uploadImage(req.file));
};
