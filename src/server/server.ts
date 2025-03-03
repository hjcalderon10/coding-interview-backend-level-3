import Hapi from '@hapi/hapi'
import { loggerMiddleware } from '@/server/middlewares/request-logger.middleware'
import { healthCheckRoutes } from '@/server/healthcheck'
import { registerItemRoutes } from '@/domains/item/controllers/item.routes'
import { errorMiddleware } from './middlewares/error-handler'

const getServer = () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  })
  server.ext(loggerMiddleware)
  server.ext(errorMiddleware)

  healthCheckRoutes(server)

  server.realm.modifiers.route.prefix = '/v1'
  registerItemRoutes(server)
  server.realm.modifiers.route.prefix = ''

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
  console.log(`Server running on ${server.info.uri}`)
  return server
}
