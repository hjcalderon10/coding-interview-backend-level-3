"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRepository = void 0;
const prisma_database_1 = require("@/database/prisma.database");
const item_mapper_1 = require("@/database/mapper/item.mapper");
class ItemRepository {
    prisma = prisma_database_1.PrismaDB.getClient();
    async create(data) {
        const item = item_mapper_1.ItemMapper.toPrisma(data);
        const response = this.prisma.item.create({ data: item });
        return item_mapper_1.ItemMapper.toEntity(await response);
    }
    async findById(id) {
        const response = await this.prisma.item.findUnique({ where: { id } });
        return response ? item_mapper_1.ItemMapper.toEntity(response) : null;
    }
    async findAll() {
        const response = await this.prisma.item.findMany();
        return response.map(item_mapper_1.ItemMapper.toEntity);
    }
    async update(id, data) {
        const response = await this.prisma.item.update({ where: { id }, data });
        return response ? item_mapper_1.ItemMapper.toEntity(response) : null;
    }
    async delete(id) {
        const deleted = await this.prisma.item.delete({ where: { id } });
        return !!deleted;
    }
}
exports.ItemRepository = ItemRepository;
