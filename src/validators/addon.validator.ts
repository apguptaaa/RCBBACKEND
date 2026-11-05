import { z } from 'zod';
import { optionalImage, text } from './common.validator.js';

export const addonSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.coerce.number().int().positive().nullable().default(null),
  name: text(120),
  description: z.string().trim().max(1000).default(''),
  price: z.coerce.number().finite().min(0).max(1_000_000),
  image: optionalImage,
  active: z.boolean().default(true)
});

export type AddonInput = z.infer<typeof addonSchema>;
