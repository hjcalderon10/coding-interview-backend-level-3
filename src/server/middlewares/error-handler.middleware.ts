import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi'
import { LoggerService as Logger } from '@/services/logger/logger.service'
import Boom from '@hapi/boom'
import { ValidationError } from '@/errors/validation.error'

export const errorMiddleware = {
  type: 'onPreResponse' as const,
  method: (request: Request, h: ResponseToolkit): Lifecycle.ReturnValue => {
    const response = request.response

    if (response instanceof Error) {
      Logger.error(`Unhandled error: ${response.message}`, {
        path: request.path,
        method: request.method,
        stack: response.stack,
      })
    }

    if (Boom.isBoom(response)) {
      const { statusCode, message, data } = response.output.payload
      Logger.error(`Error ${statusCode} - ${message} - ${JSON.stringify(data)}`, {
        path: request.path,
        method: request.method,
      })
    }

    if (response instanceof ValidationError) {
      return h.response({ errors: response.errors }).code(400)
    }

    return h.continue
  },
}
