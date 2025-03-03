import { startServer } from './server/server.ts'

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

startServer()
