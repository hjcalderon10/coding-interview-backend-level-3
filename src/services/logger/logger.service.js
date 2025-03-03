"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_caller_1 = __importDefault(require("pino-caller"));
const logger_context_service_1 = require("./logger-context.service");
const baseLogger = (0, pino_1.default)({
    transport: process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } }
        : undefined,
});
const logger = (0, pino_caller_1.default)(baseLogger, { relativeTo: process.cwd() });
class LoggerService {
    static info(message, obj) {
        logger.info({ requestId: logger_context_service_1.LoggerContextService.requestId, ...obj }, message);
    }
    static error(message, obj) {
        logger.error({ requestId: logger_context_service_1.LoggerContextService.requestId, ...obj }, message);
    }
    static debug(message, obj) {
        if (process.env.DEBUG_MODE === 'true')
            logger.debug({ requestId: logger_context_service_1.LoggerContextService.requestId, ...obj }, message);
    }
}
exports.LoggerService = LoggerService;
