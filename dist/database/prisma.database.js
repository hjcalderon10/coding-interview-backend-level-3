"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDB = void 0;
const logger_service_1 = require("@/services/logger/logger.service");
const client_1 = require("@prisma/client");
class PrismaDB {
    static instance;
    constructor() { }
    static getClient() {
        if (!this.instance) {
            this.instance = new client_1.PrismaClient();
            logger_service_1.LoggerService.info('Prisma connected to database');
        }
        return this.instance;
    }
}
exports.PrismaDB = PrismaDB;
