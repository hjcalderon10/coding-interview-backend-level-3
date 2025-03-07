import { PgDatabase } from '@/repositories/storage/pg.database';
import { Pool } from 'pg';
import { ENV } from '@/server/config/environment';

jest.mock('pg', () => {
    const mPool = {
        connect: jest.fn().mockResolvedValue({
            query: jest.fn(),
            release: jest.fn(),
        }),
        end: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

describe('PgDatabase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize the pool with the correct configuration', () => {
        new PgDatabase();

        expect(Pool).toHaveBeenCalledWith({
            host: ENV.DB_HOST,
            port: ENV.DB_PORT,
            user: ENV.DB_USER,
            password: ENV.DB_PASSWORD,
            database: ENV.DB_NAME,
            max: ENV.DB_MAX_CONNECTIONS,
            idleTimeoutMillis: ENV.DB_IDLE_TIMEOUT,
        });
    });
});

describe('doTransaction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should execute a transaction and commit if no errors occur', async () => {
        const pgDatabase = new PgDatabase();
        const mockClient = await (new Pool() as any).connect();
      
        mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
        mockClient.query.mockResolvedValueOnce(undefined); // first query
        mockClient.query.mockResolvedValueOnce(undefined); // COMMIT
      
        await pgDatabase.doTransaction(async (execute) => {
          await execute('INSERT INTO test_table (id) VALUES ($1)', [1]);
        });
      
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO test_table (id) VALUES ($1)', [1]);
        expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.query).not.toHaveBeenCalledWith('ROLLBACK');
        mockClient.release();
      });
      
      it('should rollback the transaction if an error occurs', async () => {
        const pgDatabase = new PgDatabase();
        const mockClient = await (new Pool() as any).connect();
      
        mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
        mockClient.query.mockRejectedValueOnce(new Error('Test error')); // first query
        mockClient.query.mockResolvedValueOnce(undefined); // ROLLBACK
      
        await expect(pgDatabase.doTransaction(async (execute) => {
          await execute('INSERT INTO test_table (id) VALUES ($1)', [1]);
        })).rejects.toThrow('Test error');
      
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO test_table (id) VALUES ($1)', [1]);
        expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        expect(mockClient.query).not.toHaveBeenCalledWith('COMMIT');
        mockClient.release();
      });  
})

describe('exec', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the query and return true if rows are affected', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();

    mockClient.query.mockResolvedValueOnce({ rowCount: 1 });

    const result = await pgDatabase.exec('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1]);

    expect(result).toBe(true);
    expect(mockClient.query).toHaveBeenCalledWith('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1]);
    mockClient.release();
  });

  it('should execute the query and return false if no rows are affected', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();

    mockClient.query.mockResolvedValueOnce({ rowCount: 0 });

    const result = await pgDatabase.exec('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1]);

    expect(result).toBe(false);
    expect(mockClient.query).toHaveBeenCalledWith('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1]);
    mockClient.release();
  });

  it('should release the client if an error occurs', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();

    mockClient.query.mockRejectedValueOnce(new Error('Test error'));

    await expect(pgDatabase.exec('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1])).rejects.toThrow('Test error');

    expect(mockClient.query).toHaveBeenCalledWith('UPDATE test_table SET value = $1 WHERE id = $2', ['newValue', 1]);
    mockClient.release();
  });
});


describe('raw', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the query and return the result rows', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();
    const mockRows = [{ id: 1, value: 'test' }];

    mockClient.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await pgDatabase.raw('SELECT * FROM test_table');

    expect(result).toEqual(mockRows);
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test_table', []);
    mockClient.release();
  });

  it('should execute the query with parameters and return the result rows', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();
    const mockRows = [{ id: 1, value: 'test' }];

    mockClient.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await pgDatabase.raw('SELECT * FROM test_table WHERE id = $1', [1]);

    expect(result).toEqual(mockRows);
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test_table WHERE id = $1', [1]);
    mockClient.release();
  });

  it('should release the client if an error occurs', async () => {
    const pgDatabase = new PgDatabase();
    const mockClient = await (new Pool() as any).connect();

    mockClient.query.mockRejectedValueOnce(new Error('Test error'));

    await expect(pgDatabase.raw('SELECT * FROM test_table')).rejects.toThrow('Test error');

    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test_table', []);
    mockClient.release();
  });
});

describe('close', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should close the pool', async () => {
    const pgDatabase = new PgDatabase();
    const spyEnd = jest.spyOn(pgDatabase['pool'], 'end').mockImplementation(() => Promise.resolve());
    await pgDatabase.close();
    expect(spyEnd).toHaveBeenCalled();
    spyEnd.mockRestore();
  });

  it('should handle errors when closing the pool', async () => {
    const pgDatabase = new PgDatabase();
    const mockError = new Error('Test error');
    jest.spyOn(pgDatabase['pool'], 'end').mockRejectedValueOnce(mockError as never);

    await expect(pgDatabase.close()).rejects.toThrow('Test error');
  });
});