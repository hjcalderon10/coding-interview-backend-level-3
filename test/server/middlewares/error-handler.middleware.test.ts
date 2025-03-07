import { Request, ResponseToolkit } from '@hapi/hapi'
import { errorMiddleware } from '@/server/middlewares/error-handler.middleware'
import { LoggerService as Logger } from '@/services/logger/logger.service'
import Boom from '@hapi/boom'
import { ValidationError } from '@/errors/validation.error'

jest.mock('@/services/logger/logger.service')

describe('errorMiddleware', () => {
    let mockRequest: Partial<Request>
    let mockResponseToolkit: Partial<ResponseToolkit>

    beforeEach(() => {
        jest.clearAllMocks()

        mockRequest = {
            method: 'get',
            path: '/test',
            response: undefined, // Will be set in each test
        }

        mockResponseToolkit = {
            response: jest.fn().mockImplementation(() => ({
                code: jest.fn().mockReturnValue(mockResponseToolkit),
            })),
            continue: Symbol('continue'),
        }
    })

    it('should log unhandled errors and continue', () => {
        const error = new Error('Unexpected error')
        mockRequest.response = Boom.boomify(error)

        const result = errorMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(Logger.error).toHaveBeenCalledWith('Unhandled error: Unexpected error', {
            path: '/test',
            method: 'get',
            stack: error.stack,
        })
        expect(result).toBe(mockResponseToolkit.continue)
    })

    it('should log Boom errors with status and continue', () => {
        const boomError = Boom.badRequest('Invalid request')
        mockRequest.response = boomError

        const result = errorMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(Logger.error).toHaveBeenCalledWith('Error 400 - Invalid request - undefined', {
            path: '/test',
            method: 'get',
        })
        expect(result).toBe(mockResponseToolkit.continue)
    })

    it('should return 400 with errors for ValidationError', () => {
        const validationError = new ValidationError('Validation error', [{ field: 'email', message: 'Invalid email' }])
        mockRequest.response = Boom.boomify(validationError)

        const result = errorMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(mockResponseToolkit.response).toHaveBeenCalledWith({ errors: [{ field: 'email', message: 'Invalid email' }] })
        expect(result).toBe(mockResponseToolkit)
    })

    it('should return h.continue if no error is present', () => {
        mockRequest.response = undefined // Normal response

        const result = errorMiddleware.method(mockRequest as Request, mockResponseToolkit as ResponseToolkit)

        expect(Logger.error).not.toHaveBeenCalled()
        expect(result).toBe(mockResponseToolkit.continue)
    })
})
