import { ENV } from '@/server/config/environment'
import Hapi, { Server } from '@hapi/hapi'
import { loggerMiddleware } from '@/server/middlewares/request-logger.middleware'
import { healthCheckRoutes } from '@/server/healthcheck'
import { registerItemRoutes } from '@/domains/item/controllers/item.routes'
import { errorMiddleware } from '@/server/middlewares/error-handler.middleware'
import { PgDatabase } from '@/repositories/storage/pg.database'
import { LoggerService } from '@/services/logger/logger.service'

const registerStop = async (server: Server, db: PgDatabase) => {
  const originalStop = server.stop.bind(server)
  server.stop = async () => {
    LoggerService.info('Stopping server')
    try {
      await db.close()
    } catch (error) {
      LoggerService.error(`Failed to close database connection: ${error}`)
    }
    await originalStop()
  }
}

const getServer = () => {
  const server = Hapi.server({
    host: ENV.HOST.toString(),
    port: ENV.PORT,
  })
  server.ext(loggerMiddleware)
  server.ext(errorMiddleware)

  healthCheckRoutes(server)

  const db = new PgDatabase()

  server.realm.modifiers.route.prefix = '/v1'
  registerItemRoutes(server, db)
  server.realm.modifiers.route.prefix = ''

  registerStop(server, db)

  return server
}

export const initializeServer = async () => {
  const server = getServer()
  await server.initialize()
  return server
}

export const startServer = async () => {
  const server = getServer()
  await server.start()
  LoggerService.info(`Server running on ${server.info.uri}`)
  return server
}
