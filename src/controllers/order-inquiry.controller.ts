import type { RequestHandler } from 'express';
import { AppError } from '../utils/appError.js';
import * as inquiries from '../services/order-inquiry.service.js';
import { pathParam } from '../validators/common.validator.js';
import {
  orderInquiryIdSchema,
  orderInquirySchema,
  orderInquiryStatusSchema
} from '../validators/order-inquiry.validator.js';

export const createOrderInquiry: RequestHandler = async (req, res) => {
  res.status(201).json(await inquiries.createOrderInquiry(orderInquirySchema.parse(req.body)));
};

export const listOrderInquiries: RequestHandler = async (_req, res) => {
  res.json(await inquiries.listOrderInquiries());
};

export const updateOrderInquiryStatus: RequestHandler = async (req, res) => {
  const id = orderInquiryIdSchema.parse(pathParam(req.params.id));
  const status = orderInquiryStatusSchema.parse(req.body?.status);
  const inquiry = await inquiries.updateOrderInquiryStatus(id, status);
  if (!inquiry) throw new AppError('Order inquiry not found.', 404);
  res.json(inquiry);
};
