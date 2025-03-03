import { PrismaDB } from '@/database/prisma.database'
import { IItemRepository } from './item.repository.interface'
import type { Item as ItemModel } from '@prisma/client'
import { Item } from '@/entities/item.entity'
import { ItemMapper } from '@/database/mapper/item.mapper'

export class ItemRepository implements IItemRepository {
  private prisma = PrismaDB.getClient()

  async create(data: Item): Promise<Item> {
    const item = ItemMapper.toPrisma(data)
    const response = this.prisma.item.create({ data: item })

    return ItemMapper.toEntity(await response)
  }

  async findById(id: string): Promise<Item | null> {
    const response = await this.prisma.item.findUnique({ where: { id } })
    return response ? ItemMapper.toEntity(response) : null
  }

  async findAll(): Promise<Item[]> {
    const response = await this.prisma.item.findMany()
    return response.map(ItemMapper.toEntity)
  }

  async update(id: string, data: Partial<ItemModel>): Promise<Item | null> {
    const response = await this.prisma.item.update({ where: { id }, data })
    return response ? ItemMapper.toEntity(response) : null
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.prisma.item.delete({ where: { id } })
    return !!deleted
  }
}
