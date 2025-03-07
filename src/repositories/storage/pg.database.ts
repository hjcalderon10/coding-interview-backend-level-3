import { ENV } from '@/server/config/environment'
import { Pool } from "pg";
import { Database } from "./db.interface";

export class PgDatabase implements Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      user: ENV.DB_USER,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_NAME,
      max: ENV.DB_MAX_CONNECTIONS,
      idleTimeoutMillis: ENV.DB_IDLE_TIMEOUT,
    });
  }

  async raw<T = any>(sql: string, values: any[] = []): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, values);
      return result.rows as T[];
    } finally {
      client.release();
    }
  }

  async exec(sql: string, values: any[] = []): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, values);
      return !!result.rowCount;
    } finally {
      client.release();
    }
  }

  async doTransaction(fnStmt: (execute: (sql: string, values?: any[]) => Promise<void>) => Promise<void>): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      await fnStmt(async (sql, values) => {
        await client.query(sql, values);
      });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
