import { z } from 'zod';
import { text } from './common.validator.js';

export const productSchema = z.object({
  name: text(120),
  category: text(120),
  subcategory: z.string().trim().max(120).optional().default(''),
  price: z.coerce.number().finite().min(0).max(1_000_000),
  old_price: z.coerce.number().finite().min(0).max(1_000_000).default(0),
  rating: z.coerce.number().finite().min(0).max(5).default(5),
  reviews: z.coerce.number().int().min(0).max(1_000_000).default(0),
  badge: z.string().trim().max(80).default(''),
  veg: z.boolean().default(true),
  image: z.string().trim().min(1).max(7_000_000),
  description: z.string().trim().max(4000).default(''),
  active: z.boolean().default(true)
});

export type ProductInput = z.infer<typeof productSchema>;
