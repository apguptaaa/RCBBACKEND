import { z } from 'zod';
import { uuid } from './common.validator.js';

export const reviewSchema = z.object({
  name: z.string().trim().min(1).max(80),
  quote: z.string().trim().min(1).max(1000),
  avatar: z.string().trim().max(7_000_000).default(''),
  rating: z.number().int().min(1).max(5),
  active: z.boolean().default(true)
});

export const reviewIdSchema = uuid;
export type ReviewInput = z.infer<typeof reviewSchema>;
