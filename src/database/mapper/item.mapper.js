"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemMapper = void 0;
const item_entity_1 = require("@/entities/item.entity");
class ItemMapper {
    static toEntity(prismaItem) {
        return new item_entity_1.Item(prismaItem.id, prismaItem.name, prismaItem.price, prismaItem.createdAt);
    }
    static toPrisma(item) {
        return {
            name: item.name,
            price: item.price,
        };
    }
}
exports.ItemMapper = ItemMapper;
