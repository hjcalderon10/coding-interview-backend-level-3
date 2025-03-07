import { Database } from '@/repositories/storage/db.interface'
import { ItemModel } from '@/repositories/models/item.model'
import { IItemRepository } from './item.repository.interface'
import { Item, UpdateItem } from '@/entities/item.entity'
import { LoggerService } from '@/services/logger/logger.service'

export class ItemRepository implements IItemRepository {
  constructor(private storage: Database) {}

  async create(item: Omit<Item, 'id' | 'created_date' | 'deleted_date'>): Promise<Item> {
    const sql = `INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *`
    const values = [item.name, item.price]
    const [newItem] = await this.storage.raw<ItemModel>(sql, values)
    return this.omitDeleteDate(newItem) as Item
  }

  async findById(id: string): Promise<Item | null> {
    const sql = `SELECT * FROM items WHERE id = $1 AND deleted_date IS NULL`
    const values = [id]
    const [item] = await this.storage.raw<ItemModel>(sql, values)
    return (this.omitDeleteDate(item) as Item) || null
  }

  async findAll(): Promise<Item[]> {
    const sql = `SELECT * FROM items WHERE deleted_date IS NULL`
    const rawResponse = await this.storage.raw<ItemModel>(sql)
    const res = this.omitDeleteDate(rawResponse) as Item[]

    LoggerService.debug(`Items found: ${JSON.stringify(res)}`)

    return res
  }

  async update(id: string, updates: UpdateItem): Promise<Item | null> {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ')
    if (!fields) return null
    const values = Object.values(updates)
    values.push(id)

    const sql = `UPDATE items SET ${fields} WHERE id = $${values.length} AND deleted_date IS NULL RETURNING *`
    const [updatedItem] = await this.storage.raw<ItemModel>(sql, values)
    return (this.omitDeleteDate(updatedItem) as Item) || null
  }

  async delete(id: string): Promise<boolean> {
    const sql = `UPDATE items SET deleted_date = NOW() WHERE id = $1 AND deleted_date IS NULL RETURNING id`
    const values = [id]
    const [deleted] = await this.storage.raw<{ id: number }>(sql, values)
    return !!deleted
  }

  // If needed, normally this process is being handled by third services like Snowflake + scripts directly to the database
  async deletePermanently(id: number): Promise<boolean> {
    const sql = `DELETE FROM items WHERE id = $1 RETURNING id`
    const values = [id]
    const [deleted] = await this.storage.raw<{ id: number }>(sql, values)
    return !!deleted
  }

  omitDeleteDate = (rows: ItemModel | ItemModel[]): Item | Item[] => {
    if (Array.isArray(rows)) {
      return rows.map(({ deleted_date, ...rest }) => rest)
    }

    if (rows && typeof rows === 'object') {
      const { deleted_date, ...rest } = rows
      return rest
    }
    return rows
  }
}
