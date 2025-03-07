export const requiredEnv = (key: string): string => {
  const value = process.env[key]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const requiredNumberEnv = (key: string): number => {
  const value = requiredEnv(key)
  if (isNaN(Number(value))) {
    throw new Error(`Env is not a number value: ${key}`)
  }
  return Number(value)
}

export const ENV = {
  NODE_ENV: requiredEnv('NODE_ENV'),
  HOST: requiredEnv('HOST'),
  PORT: requiredNumberEnv('PORT'),

  // Database Configuration
  DB_HOST: requiredEnv('DB_HOST'),
  DB_PORT: requiredNumberEnv('DB_PORT'),
  DB_USER: requiredEnv('DB_USER'),
  DB_PASSWORD: requiredEnv('DB_PASSWORD'),
  DB_NAME: requiredEnv('DB_NAME'),
  DB_IDLE_TIMEOUT: requiredNumberEnv('DB_IDLE_TIMEOUT'),
  DB_MAX_CONNECTIONS: requiredNumberEnv('DB_MAX_CONNECTIONS'),

  // Logging Configuration
  LOG_LEVEL: requiredEnv('LOG_LEVEL'),
}
