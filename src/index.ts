import { startServer } from './server/server'
import dotenv from 'dotenv'

dotenv.config()

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

startServer()
