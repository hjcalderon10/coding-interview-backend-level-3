"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.initializeServer = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const request_logger_middleware_1 = require("@/server/middlewares/request-logger.middleware");
const healthcheck_1 = require("@/server/healthcheck");
const item_routes_1 = require("@/domains/item/controllers/item.routes");
const error_handler_1 = require("./middlewares/error-handler");
const getServer = () => {
    const server = hapi_1.default.server({
        host: 'localhost',
        port: 3000,
    });
    server.ext(request_logger_middleware_1.loggerMiddleware);
    server.ext(error_handler_1.errorMiddleware);
    (0, healthcheck_1.healthCheckRoutes)(server);
    server.realm.modifiers.route.prefix = '/v1';
    (0, item_routes_1.registerItemRoutes)(server);
    server.realm.modifiers.route.prefix = '';
    return server;
};
const initializeServer = async () => {
    const server = getServer();
    await server.initialize();
    return server;
};
exports.initializeServer = initializeServer;
const startServer = async () => {
    const server = getServer();
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    return server;
};
exports.startServer = startServer;
