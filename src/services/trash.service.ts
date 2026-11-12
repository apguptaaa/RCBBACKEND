import { prisma } from '../db/client.js';
import type { TrashEntry, TrashEntityType } from '../models/trash.model.js';
import { AppError } from '../utils/appError.js';

function toTrashEntry(
  type: TrashEntityType,
  entityId: string,
  name: string,
  image: string,
  deletedAt: Date | null
): TrashEntry {
  if (!deletedAt) throw new AppError('Trash item is missing its deletion timestamp.', 500);
  return {
    key: `${type}:${entityId}`,
    type,
    entityId,
    name,
    image,
    deletedAt: deletedAt.toISOString()
  };
}

export async function listTrash(): Promise<TrashEntry[]> {
  const [products, categories, subcategories, addons, banners, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, image: true, deletedAt: true }
    }),
    prisma.category.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, image: true, deletedAt: true }
    }),
    prisma.subcategory.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, image: true, deletedAt: true }
    }),
    prisma.addon.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, image: true, deletedAt: true }
    }),
    prisma.banner.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, title: true, image: true, deletedAt: true }
    }),
    prisma.review.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, avatar: true, deletedAt: true }
    })
  ]);

  return [
    ...products.map(item => toTrashEntry('product', String(item.id), item.name, item.image, item.deletedAt)),
    ...categories.map(item => toTrashEntry('category', item.id, item.name, item.image, item.deletedAt)),
    ...subcategories.map(item => toTrashEntry('subcategory', item.id, item.name, item.image, item.deletedAt)),
    ...addons.map(item => toTrashEntry('addon', item.id, item.name, item.image, item.deletedAt)),
    ...banners.map(item => toTrashEntry('banner', item.id, item.title, item.image, item.deletedAt)),
    ...reviews.map(item => toTrashEntry('review', item.id, item.name, item.avatar, item.deletedAt))
  ].sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
}

export async function restoreTrashItem(type: TrashEntityType, entityId: string): Promise<void> {
  let count: number;
  if (type === 'product') {
    const id = Number(entityId);
    if (!Number.isSafeInteger(id) || id < 1) throw new AppError('Trash item not found.', 404);
    ({ count } = await prisma.product.updateMany({ where: { id, deletedAt: { not: null } }, data: { deletedAt: null } }));
  } else if (type === 'category') {
    ({ count } = await prisma.category.updateMany({ where: { id: entityId, deletedAt: { not: null } }, data: { deletedAt: null } }));
  } else if (type === 'subcategory') {
    ({ count } = await prisma.subcategory.updateMany({ where: { id: entityId, deletedAt: { not: null } }, data: { deletedAt: null } }));
  } else if (type === 'addon') {
    ({ count } = await prisma.addon.updateMany({ where: { id: entityId, deletedAt: { not: null } }, data: { deletedAt: null } }));
  } else if (type === 'banner') {
    ({ count } = await prisma.banner.updateMany({ where: { id: entityId, deletedAt: { not: null } }, data: { deletedAt: null } }));
  } else {
    ({ count } = await prisma.review.updateMany({ where: { id: entityId, deletedAt: { not: null } }, data: { deletedAt: null } }));
  }
  if (!count) throw new AppError('Trash item not found.', 404);
}

export async function permanentlyDeleteTrashItem(type: TrashEntityType, entityId: string): Promise<void> {
  await prisma.$transaction(async transaction => {
    if (type === 'product') {
      const id = Number(entityId);
      if (!Number.isSafeInteger(id) || id < 1) throw new AppError('Trash item not found.', 404);
      const product = await transaction.product.findFirst({ where: { id, deletedAt: { not: null } }, select: { id: true } });
      if (!product) throw new AppError('Trash item not found.', 404);
      await transaction.product.delete({ where: { id } });
      return;
    }

    if (type === 'category') {
      const category = await transaction.category.findFirst({ where: { id: entityId, deletedAt: { not: null } }, select: { id: true } });
      if (!category) throw new AppError('Trash item not found.', 404);
      const [products, subcategories] = await Promise.all([
        transaction.product.count({ where: { categoryId: entityId } }),
        transaction.subcategory.count({ where: { categoryId: entityId } })
      ]);
      if (products || subcategories) {
        throw new AppError("Permanently delete this category's products and subcategories first.", 409);
      }
      await transaction.category.delete({ where: { id: entityId } });
      return;
    }

    if (type === 'subcategory') {
      const subcategory = await transaction.subcategory.findFirst({ where: { id: entityId, deletedAt: { not: null } }, select: { id: true } });
      if (!subcategory) throw new AppError('Trash item not found.', 404);
      const products = await transaction.product.count({ where: { subcategoryId: entityId } });
      if (products) throw new AppError("Permanently delete this subcategory's products first.", 409);
      await transaction.subcategory.delete({ where: { id: entityId } });
      return;
    }

    if (type === 'addon') {
      const addon = await transaction.addon.findFirst({ where: { id: entityId, deletedAt: { not: null } }, select: { id: true } });
      if (!addon) throw new AppError('Trash item not found.', 404);
      await transaction.addon.delete({ where: { id: entityId } });
      return;
    }

    if (type === 'banner') {
      const banner = await transaction.banner.findFirst({ where: { id: entityId, deletedAt: { not: null } }, select: { id: true } });
      if (!banner) throw new AppError('Trash item not found.', 404);
      await transaction.banner.delete({ where: { id: entityId } });
      return;
    }

    const review = await transaction.review.findFirst({ where: { id: entityId, deletedAt: { not: null } }, select: { id: true } });
    if (!review) throw new AppError('Trash item not found.', 404);
    await transaction.review.delete({ where: { id: entityId } });
  });
}
