import { IItemRepository } from '@/domains/item/repositories/item.repository.interface';
import { Item } from '@/entities/item.entity';

export class ItemService {
  constructor(private repository: IItemRepository) {}

  create(item: Omit<Item, 'id'>) {
    return this.repository.create(item);
  }
  
  findAll() {
    return this.repository.findAll();
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  update(id: string, item: Omit<Item, 'id'>) {
    return this.repository.update(id, item);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}