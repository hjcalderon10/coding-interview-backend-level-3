"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
(0, server_1.startServer)();
