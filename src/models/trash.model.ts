export const trashEntityTypes = [
  'product',
  'category',
  'subcategory',
  'addon',
  'banner',
  'review'
] as const;

export type TrashEntityType = typeof trashEntityTypes[number];

export interface TrashEntry {
  key: string;
  type: TrashEntityType;
  entityId: string;
  name: string;
  image: string;
  deletedAt: string;
}
