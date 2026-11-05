import { z } from 'zod';
import { optionalImage, text } from './common.validator.js';

export const categorySchema = z.object({
  id: z.string().trim().min(1).max(160).optional(),
  name: text(120),
  image: optionalImage,
  active: z.boolean().default(true)
});

export type CategoryInput = z.infer<typeof categorySchema>;
