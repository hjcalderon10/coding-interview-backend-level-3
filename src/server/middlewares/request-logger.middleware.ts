import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi';
import { LoggerContextService } from '@/services/logger/logger-context.service';
import { LoggerService } from '@/services/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

export const loggerMiddleware = {
  type: 'onRequest' as const,
  method: async (request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> => {
    const requestId = (request.headers['x-request-id'] as string) || uuidv4();

    LoggerContextService.initialize(requestId)
    LoggerService.info(`Incoming request: ${request.method.toUpperCase()} ${request.path}`, {
      ip: request.info.remoteAddress,
      payload: request.payload,
      query: request.query,
      headers: request.headers,
      params: request.params,
    })
    return h.continue;
  },
};
