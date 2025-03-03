"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const logger_service_1 = require("@/services/logger/logger.service");
const http_status_codes_1 = require("http-status-codes");
class ItemController {
    service;
    constructor(service) {
        this.service = service;
    }
    createItemHandler = async (req, h) => {
        const payload = req.payload;
        const item = await this.service.create(payload);
        logger_service_1.LoggerService.debug(`Item created: ${JSON.stringify(item)}`);
        return h.response(item).code(http_status_codes_1.StatusCodes.CREATED);
    };
    getAllItemsHandler = async (_, h) => {
        return h.response(await this.service.findAll()).code(http_status_codes_1.StatusCodes.OK);
    };
    getItemByIdHandler = async (req, h) => {
        const item = await this.service.findById(req.params.id);
        logger_service_1.LoggerService.debug(`Item found: ${JSON.stringify(item)}`);
        return item ? h.response(item) : h.response({ error: 'Not Found' }).code(http_status_codes_1.StatusCodes.NOT_FOUND);
    };
    updateItemHandler = async (req, h) => {
        const updatedItem = await this.service.update(req.params.id, req.payload);
        logger_service_1.LoggerService.debug(`Item updated: ${JSON.stringify(updatedItem)}`);
        return updatedItem
            ? h.response(updatedItem)
            : h.response({ error: 'Not Found' }).code(http_status_codes_1.StatusCodes.NOT_FOUND);
    };
    deleteItemHandler = async (req, h) => {
        const success = await this.service.delete(req.params.id);
        logger_service_1.LoggerService.debug(`Item deleted: ${success} with id: ${req.params.id}`);
        return success
            ? h.response().code(http_status_codes_1.StatusCodes.NO_CONTENT)
            : h.response({ error: 'Not Found' }).code(http_status_codes_1.StatusCodes.NOT_FOUND);
    };
}
exports.ItemController = ItemController;
