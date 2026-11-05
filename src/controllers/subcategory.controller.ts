import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';
import { pathParam } from '../validators/common.validator.js';
import { subcategorySchema } from '../validators/subcategory.validator.js';

export const createSubcategory: RequestHandler = async (req, res) => {
  res.status(201).json(await catalog.saveSubcategory(subcategorySchema.parse(req.body)));
};

export const updateSubcategory: RequestHandler = async (req, res) => {
  res.json(await catalog.saveSubcategory(subcategorySchema.parse(req.body), pathParam(req.params.id)));
};

export const deleteSubcategory: RequestHandler = async (req, res) => {
  await catalog.deleteSubcategory(pathParam(req.params.id));
  res.status(204).end();
};
