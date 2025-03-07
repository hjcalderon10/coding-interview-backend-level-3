import { AsyncLocalStorage } from 'async_hooks';

export class LoggerContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>()

  static initialize(requestId: string) {
    const store = new Map<string, string>()
    store.set('requestId', requestId)
    this.asyncLocalStorage.enterWith(store)
  }

  static get requestId(): string {
    return this.asyncLocalStorage.getStore()?.get('requestId') || 'N/A'
  }

  static setAsyncLocalStorage(storage: AsyncLocalStorage<Map<string, string>>) {
    this.asyncLocalStorage = storage
  }
}
