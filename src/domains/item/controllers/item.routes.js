"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerItemRoutes = void 0;
const item_controller_1 = require("./item.controller");
const item_dto_1 = require("@/domains/item/dto/item.dto");
const item_service_1 = require("@/domains/item/services/item.service");
const item_repository_1 = require("@/domains/item/repositories/item.repository");
const registerItemRoutes = (server) => {
    const repository = new item_repository_1.ItemRepository();
    const controller = new item_controller_1.ItemController(new item_service_1.ItemService(repository));
    const routePrefix = "/items";
    server.route([
        {
            method: 'POST',
            path: routePrefix,
            handler: controller.createItemHandler,
            options: { validate: { payload: item_dto_1.itemSchema } },
        },
        {
            method: 'GET',
            path: routePrefix,
            handler: controller.getAllItemsHandler,
        },
        {
            method: 'GET',
            path: `${routePrefix}/{id}`,
            handler: controller.getItemByIdHandler,
        },
        {
            method: 'PUT',
            path: `${routePrefix}/{id}`,
            handler: controller.updateItemHandler,
            options: { validate: { payload: item_dto_1.itemSchema } },
        },
        {
            method: 'DELETE',
            path: `${routePrefix}/{id}`,
            handler: controller.deleteItemHandler,
        },
    ]);
};
exports.registerItemRoutes = registerItemRoutes;
