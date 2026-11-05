import { z } from 'zod';
import { text } from './common.validator.js';

export const bannerSchema = z.object({
  id: z.string().uuid().optional(),
  title: text(160),
  subtitle: z.string().trim().max(240).default(''),
  image: z.string().trim().min(1).max(7_000_000),
  link: z.string().trim().min(1).max(500).default('/'),
  active: z.boolean().default(true)
});

export type BannerInput = z.infer<typeof bannerSchema>;
