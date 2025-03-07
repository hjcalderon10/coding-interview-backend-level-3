import pino from 'pino';
import caller from 'pino-caller';
import { LoggerContextService } from './logger-context.service';
import { ENV } from '@/server/config/environment'

export class LoggerService {
  static baseLogger = pino({
    transport:
      ENV.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
          }
        : undefined,
  })

  static logger = caller(this.baseLogger, { relativeTo: process.cwd() })

  static info(message: string, obj?: Record<string, unknown>) {
    this.logger.info({ requestId: LoggerContextService.requestId, ...obj }, message)
  }

  static error(message: string, obj?: Record<string, unknown>) {
    this.logger.error({ requestId: LoggerContextService.requestId, ...obj }, message)
  }

  static debug(message: string, obj?: Record<string, unknown>) {
    if (ENV.LOG_LEVEL === 'debug')
      this.logger.debug({ requestId: LoggerContextService.requestId, ...obj }, message)
  }
}
