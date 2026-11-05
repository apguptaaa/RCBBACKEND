import { z } from 'zod';
import { email, text, uuid } from './common.validator.js';

export const customOrderSchema = z.object({
  customer_name: text(80),
  email,
  phone: z.string().trim().min(7).max(32),
  occasion: text(80),
  flavour: text(80),
  serving_size: text(40),
  celebration_date: z.string().date(),
  design_idea: text(2000)
}).refine((value) => value.celebration_date >= new Date().toISOString().slice(0, 10), {
  path: ['celebration_date'],
  message: 'Celebration date cannot be in the past.'
});

export const customOrderStatusSchema = z.enum(['pending', 'contacted', 'completed', 'cancelled']);
export const customOrderIdSchema = uuid;
export type CustomOrderInput = z.infer<typeof customOrderSchema>;
