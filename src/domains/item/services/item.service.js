"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
class ItemService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create(item) {
        return this.repository.create(item);
    }
    findAll() {
        return this.repository.findAll();
    }
    findById(id) {
        return this.repository.findById(id);
    }
    update(id, item) {
        return this.repository.update(id, item);
    }
    delete(id) {
        return this.repository.delete(id);
    }
}
exports.ItemService = ItemService;
