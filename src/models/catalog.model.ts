export interface ProductRecord {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  old_price: number;
  rating: number;
  reviews: number;
  badge: string;
  veg: boolean;
  image: string;
  description: string;
  active: boolean;
}

export interface CategoryRecord {
  id: string;
  name: string;
  image: string;
  active: boolean;
}

export interface SubcategoryRecord {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  active: boolean;
}

export interface AddonRecord {
  id: string;
  product_id: number | null;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
}

export interface BannerRecord {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}

export interface CatalogRecord {
  products: ProductRecord[];
  categories: CategoryRecord[];
  subcategories: SubcategoryRecord[];
  addons: AddonRecord[];
  banners: BannerRecord[];
}
