import { IItemRepository } from '@/domains/item/repositories/item.repository.interface';
import { Item, UpdateItem } from '@/entities/item.entity'

export class ItemService {
  constructor(private repository: IItemRepository) {}

  async create(item: Omit<Item, 'id'>): Promise<Item> {
    const createdItem = await this.repository.create(item)
    return this.removeCreatedDate(createdItem) as Item
  }

  async findAll(): Promise<Item[]> {
    return this.removeCreatedDate(await this.repository.findAll()) as Item[]
  }

  async findById(id: string): Promise<Item | null> {
    const item = await this.repository.findById(id)
    return item ? (this.removeCreatedDate(item) as Item) : null
  }

  async update(id: string, item: UpdateItem): Promise<Item | null> {
    const updatedItem = await this.repository.update(id, item)
    return updatedItem ? (this.removeCreatedDate(updatedItem) as Item) : null
  }

  delete(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }

  removeCreatedDate(item: Item | Item[]): Item | Item[] {
    if (Array.isArray(item)) {
      return item.map(({ created_date, ...rest }) => rest)
    }

    const { created_date, ...rest } = item
    return rest
  }
}