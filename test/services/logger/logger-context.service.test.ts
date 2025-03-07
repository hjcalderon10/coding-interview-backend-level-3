import { LoggerContextService } from '@/services/logger/logger-context.service';
import { AsyncLocalStorage } from 'async_hooks';

describe('LoggerContextService', () => {
  let mockAsyncLocalStorage: jest.Mocked<AsyncLocalStorage<Map<string, string>>>;

  beforeEach(() => {
    mockAsyncLocalStorage = new AsyncLocalStorage<Map<string, string>>() as jest.Mocked<AsyncLocalStorage<Map<string, string>>>;

    jest.spyOn(mockAsyncLocalStorage, 'getStore').mockReturnValue(new Map([['requestId', 'mock-request-id']]));
    jest.spyOn(mockAsyncLocalStorage, 'enterWith').mockImplementation(() => {});

    LoggerContextService.setAsyncLocalStorage(mockAsyncLocalStorage);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize the logger context with a requestId', () => {
    LoggerContextService.initialize('1234');

    expect(mockAsyncLocalStorage.enterWith).toHaveBeenCalledTimes(1);
    expect(mockAsyncLocalStorage.enterWith).toHaveBeenCalledWith(expect.any(Map));
  });

  it('should return the requestId from the store', () => {
    const requestId = LoggerContextService.requestId;
    expect(requestId).toBe('mock-request-id');
  });

  it('should return "N/A" if store is not available', () => {
    jest.spyOn(mockAsyncLocalStorage, 'getStore').mockReturnValue(undefined);

    expect(LoggerContextService.requestId).toBe('N/A');
  });
});
