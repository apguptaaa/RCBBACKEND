import type { RequestHandler } from 'express';
import * as promo from '../services/promo.service.js';
import { promoClaimSchema } from '../validators/promo.validator.js';

export const claimPromo: RequestHandler = async (req, res) => {
  const claim = await promo.claimPromo(promoClaimSchema.parse(req.body));
  res.status(201).json({ message: 'Promo claim saved.', claim });
};
