import { z } from 'zod';
import { email, text, uuid } from './common.validator.js';

const cartDetails = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    name: text(120),
    quantity: z.number().int().min(1).max(99),
    variant: z.string().trim().max(300).optional(),
    message: z.string().trim().max(40).optional(),
    unit_price: z.number().finite().nonnegative()
  })).min(1).max(100),
  subtotal: z.number().finite().nonnegative(),
  delivery: z.number().finite().nonnegative(),
  total: z.number().finite().nonnegative()
});

const enquiryDetails = z.object({
  product_id: z.number().int().positive().nullable(),
  weight: text(20),
  design: text(80),
  design_details: z.string().trim().max(300).optional(),
  cake_message: z.string().trim().max(40).optional(),
  pincode: z.string().trim().regex(/^\d{6}$/).optional().or(z.literal('')),
  needed_on: z.string().date().optional().or(z.literal('')),
  query: z.string().trim().max(500).optional()
});

export const orderInquirySchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('cart'),
    customer_name: z.string().trim().max(80).optional(),
    details: cartDetails
  }),
  z.object({
    kind: z.literal('enquiry'),
    customer_name: text(80),
    details: enquiryDetails
  })
]);

export const orderInquiryStatusSchema = z.enum(['pending', 'contacted', 'confirmed', 'cancelled']);
export const orderInquiryIdSchema = uuid;
export type OrderInquiryInput = z.infer<typeof orderInquirySchema>;
