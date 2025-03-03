import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi'
import { LoggerService as Logger } from '@/services/logger/logger.service'
import Boom from '@hapi/boom'

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

      return h.continue
    }

    if (Boom.isBoom(response)) {
      const { statusCode, message, data } = response.output.payload
      Logger.error(`Error ${statusCode} - ${message}`, {
        path: request.path,
        method: request.method,
      })
    }

    return h.continue
  },
}
