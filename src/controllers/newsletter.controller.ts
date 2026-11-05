import type { RequestHandler } from 'express';
import * as customer from '../services/customer.service.js';
import { newsletterSchema } from '../validators/newsletter.validator.js';

export const subscribe: RequestHandler = async (req, res) => {
  await customer.subscribe(newsletterSchema.parse(req.body));
  res.status(201).json({ message: 'Subscription saved.' });
};
