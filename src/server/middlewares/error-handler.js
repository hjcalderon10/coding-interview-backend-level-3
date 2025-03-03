"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_service_1 = require("@/services/logger/logger.service");
const boom_1 = __importDefault(require("@hapi/boom"));
exports.errorMiddleware = {
    type: 'onPreResponse',
    method: (request, h) => {
        const response = request.response;
        if (response instanceof Error) {
            logger_service_1.LoggerService.error(`Unhandled error: ${response.message}`, {
                path: request.path,
                method: request.method,
                stack: response.stack,
            });
            return h.continue;
        }
        if (boom_1.default.isBoom(response)) {
            const { statusCode, message, data } = response.output.payload;
            logger_service_1.LoggerService.error(`Error ${statusCode} - ${message}`, {
                path: request.path,
                method: request.method,
            });
        }
        return h.continue;
    },
};
