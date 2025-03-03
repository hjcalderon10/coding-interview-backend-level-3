import pino from 'pino';
import caller from 'pino-caller';
import { LoggerContextService } from './logger-context.service';

const baseLogger = pino({
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } }
    : undefined,
});

const logger = caller(baseLogger, { relativeTo: process.cwd() });

export class LoggerService {
  static info(message: string, obj?: Record<string, unknown>) {
    logger.info({ requestId: LoggerContextService.requestId, ...obj }, message);
  }

  static error(message: string, obj?: Record<string, unknown>) {
    logger.error({ requestId: LoggerContextService.requestId, ...obj }, message);
  }

  static debug(message: string, obj?: Record<string, unknown>) {
    if (process.env.DEBUG_MODE === 'true')
      logger.debug({ requestId: LoggerContextService.requestId, ...obj }, message);
  }
}
