import { z } from 'zod';

export const text = (max: number, min = 1) => z.string().trim().min(min).max(max);
export const optionalImage = z.string().trim().max(7_000_000).default('');
export const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
export const uuid = z.string().uuid();

export function pathParam(raw: string | string[] | undefined): string {
  if (typeof raw !== 'string') {
    throw new z.ZodError([{ code: 'custom', path: ['id'], message: 'Invalid route parameter.' }]);
  }
  return raw;
}

export function positiveIntegerParam(raw: string | string[] | undefined): number {
  const parsed = z.coerce.number().int().positive().safeParse(pathParam(raw));
  if (!parsed.success) throw parsed.error;
  return parsed.data;
}
