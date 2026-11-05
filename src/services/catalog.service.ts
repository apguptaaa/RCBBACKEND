import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../db/client.js';
import type {
  AddonRecord,
  BannerRecord,
  CatalogRecord,
  CategoryRecord,
  ProductRecord,
  SubcategoryRecord
} from '../models/catalog.model.js';
import type { AddonInput } from '../validators/addon.validator.js';
import type { BannerInput } from '../validators/banner.validator.js';
import type { CategoryInput } from '../validators/category.validator.js';
import type { ProductInput } from '../validators/product.validator.js';
import type { SubcategoryInput } from '../validators/subcategory.validator.js';
import { AppError } from '../utils/appError.js';

const productRelations = {
  category: { select: { name: true } },
  subcategory: { select: { name: true } }
} satisfies Prisma.ProductInclude;

function mapProduct(
  product: Prisma.ProductGetPayload<{ include: typeof productRelations }>
): ProductRecord {
  return {
    id: product.id,
    name: product.name,
    category: product.category.name,
    ...(product.subcategory ? { subcategory: product.subcategory.name } : {}),
    price: product.price.toNumber(),
    old_price: product.oldPrice.toNumber(),
    rating: product.rating.toNumber(),
    reviews: product.reviews,
    badge: product.badge,
    veg: product.veg,
    image: product.image,
    description: product.description,
    active: product.active
  };
}

const slug = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || crypto.randomUUID();

export async function getCatalog(includeInactive = false): Promise<CatalogRecord> {
  const [products, categories, subcategories, addons, banners] = await Promise.all([
    prisma.product.findMany({
      where: includeInactive ? undefined : {
        active: true,
        category: { active: true },
        OR: [{ subcategoryId: null }, { subcategory: { is: { active: true } } }]
      },
      include: productRelations,
      orderBy: { id: 'asc' }
    }),
    prisma.category.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { name: 'asc' }
    }),
    prisma.subcategory.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { name: 'asc' }
    }),
    prisma.addon.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { name: 'asc' }
    }),
    prisma.banner.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);
  return {
    products: products.map(mapProduct),
    categories: categories.map((item): CategoryRecord => ({
      id: item.id, name: item.name, image: item.image, active: item.active
    })),
    subcategories: subcategories.map((item): SubcategoryRecord => ({
      id: item.id, categoryId: item.categoryId, name: item.name, image: item.image, active: item.active
    })),
    addons: addons.map((item): AddonRecord => ({
      id: item.id,
      product_id: item.productId,
      name: item.name,
      description: item.description,
      price: item.price.toNumber(),
      image: item.image,
      active: item.active
    })),
    banners: banners.map((item): BannerRecord => ({
      id: item.id, title: item.title, subtitle: item.subtitle, image: item.image, link: item.link, active: item.active
    }))
  };
}

async function findCategory(name: string) {
  const category = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
  if (!category) throw new AppError('Choose a valid category.', 400);
  return category;
}

async function findSubcategory(categoryId: string, name: string) {
  if (!name) return null;
  const subcategory = await prisma.subcategory.findFirst({ where: { categoryId, name } });
  if (!subcategory) throw new AppError('Choose a valid subcategory.', 400);
  return subcategory;
}

async function getProduct(id: number): Promise<ProductRecord> {
  const product = await prisma.product.findUnique({ where: { id }, include: productRelations });
  if (!product) throw new AppError('Product not found.', 404);
  return mapProduct(product);
}

export async function saveProduct(input: ProductInput, id?: number): Promise<ProductRecord> {
  const category = await findCategory(input.category);
  const subcategory = await findSubcategory(category.id, input.subcategory);
  const data = {
    name: input.name,
    categoryId: category.id,
    subcategoryId: subcategory?.id ?? null,
    price: input.price,
    oldPrice: input.old_price,
    rating: input.rating,
    reviews: input.reviews,
    badge: input.badge,
    veg: input.veg,
    image: input.image,
    description: input.description,
    active: input.active
  };

  if (id === undefined) {
    const product = await prisma.product.create({ data, select: { id: true } });
    return getProduct(product.id);
  }
  await prisma.product.update({ where: { id }, data, select: { id: true } });
  return getProduct(id);
}

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function saveCategory(input: CategoryInput, id?: string): Promise<CategoryRecord> {
  const data = { name: input.name, image: input.image, active: input.active };
  const category = id === undefined
    ? await prisma.category.create({ data: { id: input.id || slug(input.name), ...data } })
    : await prisma.category.update({ where: { id }, data });
  return { id: category.id, name: category.name, image: category.image, active: category.active };
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}

export async function saveSubcategory(input: SubcategoryInput, id?: string): Promise<SubcategoryRecord> {
  const data = {
    categoryId: input.categoryId,
    name: input.name,
    image: input.image,
    active: input.active
  };

  const subcategory = await prisma.$transaction(async (transaction) => {
    const result = id === undefined
      ? await transaction.subcategory.create({
        data: { id: input.id || slug(`${input.categoryId}-${input.name}`), ...data }
      })
      : await transaction.subcategory.update({ where: { id }, data });

    await transaction.product.updateMany({
      where: { subcategoryId: result.id },
      data: { categoryId: result.categoryId }
    });
    return result;
  });

  return {
    id: subcategory.id,
    categoryId: subcategory.categoryId,
    name: subcategory.name,
    image: subcategory.image,
    active: subcategory.active
  };
}

export async function deleteSubcategory(id: string): Promise<void> {
  await prisma.subcategory.delete({ where: { id } });
}

export async function saveAddon(input: AddonInput, id?: string): Promise<AddonRecord> {
  const data = {
    productId: input.product_id,
    name: input.name,
    description: input.description,
    price: input.price,
    image: input.image,
    active: input.active
  };
  const addon = id === undefined
    ? await prisma.addon.create({ data })
    : await prisma.addon.update({ where: { id }, data });
  return {
    id: addon.id,
    product_id: addon.productId,
    name: addon.name,
    description: addon.description,
    price: addon.price.toNumber(),
    image: addon.image,
    active: addon.active
  };
}

export async function deleteAddon(id: string): Promise<void> {
  await prisma.addon.delete({ where: { id } });
}

export async function saveBanner(input: BannerInput, id?: string): Promise<BannerRecord> {
  const data = {
    title: input.title,
    subtitle: input.subtitle,
    image: input.image,
    link: input.link,
    active: input.active
  };
  const banner = id === undefined
    ? await prisma.banner.create({ data })
    : await prisma.banner.update({ where: { id }, data });
  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    link: banner.link,
    active: banner.active
  };
}

export async function deleteBanner(id: string): Promise<void> {
  await prisma.banner.delete({ where: { id } });
}
