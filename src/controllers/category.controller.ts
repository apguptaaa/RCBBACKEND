import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';
import { pathParam } from '../validators/common.validator.js';
import { categorySchema } from '../validators/category.validator.js';

export const createCategory: RequestHandler = async (req, res) => {
  res.status(201).json(await catalog.saveCategory(categorySchema.parse(req.body)));
};

export const updateCategory: RequestHandler = async (req, res) => {
  res.json(await catalog.saveCategory(categorySchema.parse(req.body), pathParam(req.params.id)));
};

export const deleteCategory: RequestHandler = async (req, res) => {
  await catalog.deleteCategory(pathParam(req.params.id));
  res.status(204).end();
};
