import { z } from 'zod';
import { optionalImage, text } from './common.validator.js';

export const subcategorySchema = z.object({
  id: z.string().trim().min(1).max(200).optional(),
  categoryId: text(160),
  name: text(120),
  image: optionalImage,
  active: z.boolean().default(true)
});

export type SubcategoryInput = z.infer<typeof subcategorySchema>;
