import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';
import { positiveIntegerParam } from '../validators/common.validator.js';
import { productSchema } from '../validators/product.validator.js';

export const createProduct: RequestHandler = async (req, res) => {
  res.status(201).json(await catalog.saveProduct(productSchema.parse(req.body)));
};

export const updateProduct: RequestHandler = async (req, res) => {
  const id = positiveIntegerParam(req.params.id);
  res.json(await catalog.saveProduct(productSchema.parse(req.body), id));
};

export const deleteProduct: RequestHandler = async (req, res) => {
  await catalog.deleteProduct(positiveIntegerParam(req.params.id));
  res.status(204).end();
};
