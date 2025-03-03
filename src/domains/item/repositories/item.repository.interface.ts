import { Item } from '@/entities/item.entity';

export interface IItemRepository {
  create(item: Omit<Item, 'id'>): Promise<Item>;
  findAll(): Promise<Item[]>;
  findById(id: string): Promise<Item | null>;
  update(id: string, item: Omit<Item, 'id'>): Promise<Item | null>;
  delete(id: string): Promise<boolean>;
}