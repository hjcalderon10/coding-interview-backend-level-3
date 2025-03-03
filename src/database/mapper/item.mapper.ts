import { Item } from '@/entities/item.entity'
import type { Item as PrismaItem } from '@prisma/client'

export class ItemMapper {
  static toEntity(prismaItem: PrismaItem): Item {
    return new Item(prismaItem.id, prismaItem.name, prismaItem.price, prismaItem.createdAt)
  }

  static toPrisma(item: Item): Omit<PrismaItem, 'createdAt' | 'id'> {
    return {
      name: item.name,
      price: item.price,
    }
  }
}
