import { Request, ResponseToolkit } from '@hapi/hapi'
import { loggerMiddleware } from '@/server/middlewares/request-logger.middleware'
import { LoggerContextService } from '@/services/logger/logger-context.service'
import { LoggerService } from '@/services/logger/logger.service'
import { v4 as uuidv4 } from 'uuid'

jest.mock('@/services/logger/logger-context.service')
jest.mock('@/services/logger/logger.service')
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('generated-uuid'),
}))

describe('loggerMiddleware', () => {
    let mockRequest: Partial<Request>
    let mockResponseToolkit: Partial<ResponseToolkit>

    beforeEach(() => {
        jest.clearAllMocks()

        mockRequest = {
            method: 'get',
            path: '/test',
            headers: {},
            info: {
                remoteAddress: '127.0.0.1',
                acceptEncoding: '',
                cors: {
                    isOriginMatch: undefined
                },
                host: '',
                hostname: '',
                id: '',
                received: 0,
                referrer: '',
                remotePort: '',
                responded: 0,
                completed: 0
            },
            payload: { key: 'value' },
            query: { q: 'search' },
            params: { id: '123' },
        }

        mockResponseToolkit = {
            continue: Symbol('continue'),
        }
    })

    it('should generate a request ID if not provided and log the request', async () => {
        await loggerMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(uuidv4).toHaveBeenCalled()
        expect(LoggerContextService.initialize).toHaveBeenCalledWith('generated-uuid')
        expect(LoggerService.info).toHaveBeenCalledWith(
            'Incoming request: GET /test',
            expect.objectContaining({
                ip: '127.0.0.1',
                payload: { key: 'value' },
                query: { q: 'search' },
                headers: {},
                params: { id: '123' },
            })
        )
    })

    it('should use provided request ID from headers and log the request', async () => {
        mockRequest = {
            ...mockRequest,
            headers: { 'x-request-id': 'custom-request-id' }
        }

        await loggerMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(uuidv4).not.toHaveBeenCalled()
        expect(LoggerContextService.initialize).toHaveBeenCalledWith('custom-request-id')
        expect(LoggerService.info).toHaveBeenCalledWith(
            'Incoming request: GET /test',
            expect.objectContaining({
                ip: '127.0.0.1',
                payload: { key: 'value' },
                query: { q: 'search' },
                headers: { 'x-request-id': 'custom-request-id' },
                params: { id: '123' },
            })
        )
    })

    it('should return h.continue', async () => {
        const result = await loggerMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(result).toBe(mockResponseToolkit.continue)
    })
})
