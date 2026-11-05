import type { RequestHandler } from 'express';
import { pathParam } from '../validators/common.validator.js';
import { reviewIdSchema, reviewSchema } from '../validators/review.validator.js';
import * as reviews from '../services/review.service.js';

export const listPublicReviews: RequestHandler = async (_req, res) => {
  res.json(await reviews.listPublicReviews());
};

export const listAdminReviews: RequestHandler = async (_req, res) => {
  res.json(await reviews.listAdminReviews());
};

export const createReview: RequestHandler = async (req, res) => {
  res.status(201).json(await reviews.createReview(reviewSchema.parse(req.body)));
};

export const updateReview: RequestHandler = async (req, res) => {
  const id = reviewIdSchema.parse(pathParam(req.params.id));
  res.json(await reviews.updateReview(id, reviewSchema.parse(req.body)));
};

export const deleteReview: RequestHandler = async (req, res) => {
  const id = reviewIdSchema.parse(pathParam(req.params.id));
  await reviews.deleteReview(id);
  res.status(204).end();
};
