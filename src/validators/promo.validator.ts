import { z } from 'zod';

export const promoClaimSchema = z.object({
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone must be a 10-digit mobile number.'),
  offer: z.literal('FLAT50')
});

export type PromoClaimInput = z.infer<typeof promoClaimSchema>;
