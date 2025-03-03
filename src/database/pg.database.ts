import { LoggerService } from "@/services/logger/logger.service";
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "mydatabase",
  max: 10, // Connection pool size
  idleTimeoutMillis: 30000, // Close idle connections after 30s
});

pool.on("connect", () => LoggerService.info("Connected to PostgreSQL!"));
pool.on("error", (err) => LoggerService.error(`PostgreSQL Error: ${err}`));

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
};
