import { IItemRepository } from './item.repository.interface'
import { Item } from '@/entities/item.entity'

export class ItemRepository implements IItemRepository {
  async create(item: Omit<Item, 'id'>): Promise<Item> {
    return {
      id: '1',
      name: 'Item 1',
      price: 1000,
    }
  }

  async findAll(): Promise<Item[]> {
    return [
      {
        id: '1',
        name: 'Item 1',
        price: 1000,
      },
    ]
  }

  async findById(id: string): Promise<Item | null> {
    return null
  }

  async update(id: string, item: Omit<Item, 'id'>): Promise<Item | null> {
    return null
  }

  async delete(id: string): Promise<boolean> {
    return true
  }
}
