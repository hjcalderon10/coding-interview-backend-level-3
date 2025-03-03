"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    id;
    name;
    price;
    createdAt;
    constructor(id, name, price, createdAt) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.createdAt = createdAt;
    }
}
exports.Item = Item;
