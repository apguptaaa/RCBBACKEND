import type { RequestHandler } from 'express';
import { AppError } from '../utils/appError.js';
import * as customer from '../services/customer.service.js';
import { pathParam } from '../validators/common.validator.js';
import {
  customOrderIdSchema,
  customOrderSchema,
  customOrderStatusSchema
} from '../validators/custom-order.validator.js';

export const createCustomOrder: RequestHandler = async (req, res) => {
  res.status(201).json(await customer.createCustomOrder(customOrderSchema.parse(req.body)));
};

export const listCustomOrders: RequestHandler = async (_req, res) => {
  res.json(await customer.listCustomOrders());
};

export const updateCustomOrderStatus: RequestHandler = async (req, res) => {
  const id = customOrderIdSchema.parse(pathParam(req.params.id));
  const status = customOrderStatusSchema.parse(req.body?.status);
  const order = await customer.updateCustomOrderStatus(id, status);
  if (!order) throw new AppError('Custom order not found.', 404);
  res.json(order);
};
