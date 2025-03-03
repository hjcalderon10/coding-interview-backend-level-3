"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerContextService = void 0;
const async_hooks_1 = require("async_hooks");
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
class LoggerContextService {
    static initialize(requestId) {
        const store = new Map();
        store.set('requestId', requestId);
        asyncLocalStorage.enterWith(store);
    }
    static get requestId() {
        return asyncLocalStorage.getStore()?.get('requestId') || 'N/A';
    }
}
exports.LoggerContextService = LoggerContextService;
