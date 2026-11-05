import { prisma } from '../db/client.js';
import { AppError } from '../utils/appError.js';
import type { CartInput } from '../validators/account.validator.js';

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId }, select: { items: true } });
  return { items: cart?.items ?? [] };
}

export async function saveCart(userId: string, input: CartInput) {
  const items = input.items;
  const productIds = [...new Set(items.map((item) => item.id))];
  if (productIds.length) {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      select: { id: true }
    });
    if (products.length !== productIds.length) {
      throw new AppError('One or more cart products are unavailable.', 400);
    }
  }
  await prisma.cart.upsert({
    where: { userId },
    create: { userId, items },
    update: { items, updatedAt: new Date() }
  });
  return { items };
}

export async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId, product: { active: true } },
    select: { productId: true },
    orderBy: { createdAt: 'asc' }
  });
  return { product_ids: favorites.map((favorite) => favorite.productId) };
}

export async function saveFavorites(userId: string, productIds: number[]) {
  const uniqueIds = [...new Set(productIds)];
  if (uniqueIds.length) {
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueIds }, active: true },
      select: { id: true }
    });
    if (products.length !== uniqueIds.length) {
      throw new AppError('One or more favorite products are unavailable.', 400);
    }
  }
  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { userId } }),
    ...(uniqueIds.length
      ? [prisma.favorite.createMany({ data: uniqueIds.map((productId) => ({ userId, productId })) })]
      : [])
  ]);
  return { product_ids: uniqueIds };
}
