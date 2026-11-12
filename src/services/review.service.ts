import { prisma } from '../db/client.js';
import type { ReviewInput } from '../validators/review.validator.js';
import { AppError } from '../utils/appError.js';

export async function listPublicReviews() {
  return prisma.review.findMany({
    where: { active: true, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, quote: true, avatar: true, rating: true }
  });
}

export async function listAdminReviews() {
  return prisma.review.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
}

export async function createReview(input: ReviewInput) {
  return prisma.review.create({ data: input });
}

export async function updateReview(id: string, input: ReviewInput) {
  return prisma.review.update({ where: { id }, data: input });
}

export async function deleteReview(id: string) {
  const result = await prisma.review.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() }
  });
  if (!result.count) throw new AppError('Review not found.', 404);
}
