"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheckRoutes = void 0;
const healthCheckRoutes = (server) => {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return {
                ok: true
            };
        }
    });
};
exports.healthCheckRoutes = healthCheckRoutes;
