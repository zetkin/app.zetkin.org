import { VisitByHouseholdIdMap } from '../hooks/useVisitReporting';

export class IndexedDB {
  private dbName = 'ZetkinDB';
  private dbPromise: Promise<IDBDatabase> | null = null;

  async getItem(key: string): Promise<VisitByHouseholdIdMap | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const req = store.get(key);
      req.onerror = () => {
        reject(req.error);
      };
      req.onsuccess = () => {
        const result = req.result;
        resolve(result ? result.value : null);
      };
    });
  }

  openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });

    return this.dbPromise;
  }

  async setItem(key: string, value: VisitByHouseholdIdMap): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const req = store.put({ key, value });
      req.onerror = () => {
        reject(req.error);
      };
      req.onsuccess = () => {
        resolve();
      };
    });
  }
  private storeName = 'visits';
  private version = 1;
}
