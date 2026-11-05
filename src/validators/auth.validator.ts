import { z } from 'zod';
import { email, text } from './common.validator.js';

const password = z.string().min(8).max(128);

export const loginSchema = z.object({ email, password });
export const registerSchema = z.object({ name: text(80), email, password });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
