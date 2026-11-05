import { z } from 'zod';

const cartItem = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  subcategory: z.string().max(120).optional(),
  price: z.number().finite().nonnegative(),
  oldPrice: z.number().finite().nonnegative(),
  rating: z.number().finite().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  badge: z.string().max(80),
  veg: z.boolean(),
  image: z.string().max(7_000_000),
  description: z.string().max(2000),
  quantity: z.number().int().min(1).max(99),
  variant: z.string().max(300).optional(),
  message: z.string().max(40).optional()
});

export const cartSchema = z.object({
  items: z.array(cartItem).max(100)
});

export const favoritesSchema = z.object({
  product_ids: z.array(z.number().int().positive()).max(500)
});

export type CartInput = z.infer<typeof cartSchema>;
