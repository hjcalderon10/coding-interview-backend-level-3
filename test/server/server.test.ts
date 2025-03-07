import Hapi from '@hapi/hapi'
import { ENV } from '@/server/config/environment'
import { initializeServer, startServer } from '@/server/server'
import { PgDatabase } from '@/repositories/storage/pg.database'
import { LoggerService } from '@/services/logger/logger.service'
import { healthCheckRoutes } from '@/server/healthcheck'
import { registerItemRoutes } from '@/domains/item/controllers/item.routes'

jest.mock('@/repositories/storage/pg.database')
jest.mock('@/services/logger/logger.service')
jest.mock('@/server/healthcheck')
jest.mock('@/domains/item/controllers/item.routes')

describe('Hapi Server', () => {
    let server: Hapi.Server

    beforeEach(async () => {
        jest.clearAllMocks()

        LoggerService.info = jest.fn()
        LoggerService.error = jest.fn()

        ;(PgDatabase as jest.Mock).mockImplementation(() => ({
            close: jest.fn(),
        }))
    })

    afterEach(async () => {
        if (server) {
            await server.stop()
        }
        jest.restoreAllMocks()
    })

    it('should initialize the server correctly', async () => {        
        server = await initializeServer()

        expect(server.settings.host).toBe(ENV.HOST.toString())
        expect(server.settings.port).toBe(ENV.PORT)
        expect(healthCheckRoutes).toHaveBeenCalledWith(server)
        expect(registerItemRoutes).toHaveBeenCalled()
    })

    it('should start the server correctly', async () => {
        server = await startServer()

        expect(server.info).toBeDefined()
        expect(LoggerService.info).toHaveBeenCalledWith(expect.stringContaining('Server running on'))
    })

    it('should stop the server and close the database connection', async () => {
        const mockDbClose = jest.fn()
        ;(PgDatabase as jest.Mock).mockImplementation(() => ({
            close: mockDbClose,
        }))

        server = await initializeServer()
        const stopSpy = jest.spyOn(server, 'stop')

        await server.stop()

        expect(LoggerService.info).toHaveBeenCalledWith('Stopping server')
        expect(mockDbClose).toHaveBeenCalled()
        expect(stopSpy).toHaveBeenCalled()
    })

    it('should log an error if database close fails on stop', async () => {
        const mockDbClose = jest.fn().mockRejectedValue(new Error('DB close error'))
        ;(PgDatabase as jest.Mock).mockImplementation(() => ({
            close: mockDbClose,
        }))

        server = await initializeServer()

        await server.stop()

        expect(LoggerService.error).toHaveBeenCalledWith(
            expect.stringContaining('Failed to close database connection: Error: DB close error')
        )
    })
})
