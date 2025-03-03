"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_context_service_1 = require("@/services/logger/logger-context.service");
const logger_service_1 = require("@/services/logger/logger.service");
const uuid_1 = require("uuid");
exports.loggerMiddleware = {
    type: 'onRequest',
    method: async (request, h) => {
        const requestId = request.headers['x-request-id'] || (0, uuid_1.v4)();
        logger_context_service_1.LoggerContextService.initialize(requestId);
        logger_service_1.LoggerService.info(`Incoming request: ${request.method.toUpperCase()} ${request.path}`, {
            ip: request.info.remoteAddress,
            payload: request.payload,
            query: request.query,
            headers: request.headers,
            params: request.params,
        });
        return h.continue;
    },
};
