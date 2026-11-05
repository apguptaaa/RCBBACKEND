import { prisma } from '../db/client.js';
import type { ReviewInput } from '../validators/review.validator.js';

export async function listPublicReviews() {
  return prisma.review.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, quote: true, avatar: true, rating: true }
  });
}

export async function listAdminReviews() {
  return prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createReview(input: ReviewInput) {
  return prisma.review.create({ data: input });
}

export async function updateReview(id: string, input: ReviewInput) {
  return prisma.review.update({ where: { id }, data: input });
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
}
