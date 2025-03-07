import Hapi from '@hapi/hapi'
import { healthCheckRoutes } from '@/server/healthcheck'

describe('healthCheckRoutes', () => {
    let server: Hapi.Server

    beforeEach(async () => {
        server = Hapi.server()
        healthCheckRoutes(server)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('should register the /ping route', async () => {
        const routes = server.table()
        const pingRoute = routes.find(route => route.path === '/ping' && route.method === 'get')

        expect(pingRoute).toBeDefined()
    })

    it('should return { ok: true } on GET /ping', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping'
        })

        expect(response.statusCode).toBe(200)
        expect(response.result).toEqual({ ok: true })
    })
})
