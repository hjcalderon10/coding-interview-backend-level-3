import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export class LoggerContextService {

  static initialize(requestId: string) {
    const store = new Map<string, string>();
    store.set('requestId', requestId);
    asyncLocalStorage.enterWith(store);
  }

  static get requestId(): string {
    return asyncLocalStorage.getStore()?.get('requestId') || 'N/A';
  }
}
