import { initializeServer, startServer } from './server.ts'

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

await startServer()
