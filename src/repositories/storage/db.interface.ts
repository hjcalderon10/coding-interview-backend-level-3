export interface Database {
    raw<T = any>(sql: string, values?: any[]): Promise<T[]>;
    doTransaction(fnStmt: (execute: (sql: string, values?: any[]) => Promise<void>) => Promise<void>): Promise<void>;
    exec(sql: string, values?: any[]): Promise<boolean>;
  }
  