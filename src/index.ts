import { ENV } from '@/server/config/environment'
import { startServer } from './server/server'

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

startServer()
