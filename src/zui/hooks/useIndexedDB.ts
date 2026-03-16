'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIndexedDBOptions {
  version?: number;
  onUpgradeNeeded?: (
    db: IDBDatabase,
    oldVersion: number,
    newVersion: number
  ) => void;
  onStaleVersionDetected?: () => void;
}

interface UseIndexedDBReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  setItem: (key: string, value: T) => Promise<void>;
  getItem: (key: string) => Promise<T | null>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
}

export function useIndexedDB<T>(
  databaseName: string,
  storeName: string,
  options: UseIndexedDBOptions = {}
): UseIndexedDBReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  const dbRef = useRef<IDBDatabase | null>(null);

  const { version = 1, onUpgradeNeeded, onStaleVersionDetected } = options;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let cancelled = false;

    const closeCurrentDb = () => {
      if (dbRef.current) {
        try {
          dbRef.current.close();
        } catch {
          // ignore
        } finally {
          dbRef.current = null;
        }
      }
    };

    const attachVersionChangeHandler = (database: IDBDatabase) => {
      database.onversionchange = () => {
        closeCurrentDb();
        if (!cancelled) {
          setDb(null);
          setLoading(false);
          setError(
            'A new version of the app data is available. Please reload this tab to continue.'
          );

          onStaleVersionDetected?.();
        }
      };
    };

    const initDB = async () => {
      try {
        setLoading(true);
        setError(null);

        closeCurrentDb();

        const request = indexedDB.open(databaseName, version);

        request.onblocked = () => {
          if (!cancelled) {
            setError(
              'Database open/upgrade is blocked by another tab that still has the database open. Close other tabs or reload them to continue.'
            );
            setLoading(false);
          }
        };

        request.onerror = () => {
          if (!cancelled) {
            setError(`Failed to open database: ${request.error?.message}`);
            setLoading(false);
          }
        };

        request.onsuccess = () => {
          const database = request.result;
          dbRef.current = database;
          attachVersionChangeHandler(database);

          if (!cancelled) {
            setDb(database);
            setLoading(false);
          }
        };

        request.onupgradeneeded = (event) => {
          const database = request.result;
          dbRef.current = database;
          attachVersionChangeHandler(database);

          const oldVersion = event.oldVersion;
          const newVersion = event.newVersion || version;

          if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName);
          }

          if (onUpgradeNeeded) {
            onUpgradeNeeded(database, oldVersion, newVersion);
          }
        };
      } catch (err) {
        if (!cancelled) {
          setError(`IndexedDB initialization error: ${err}`);
          setLoading(false);
        }
      }
    };

    void initDB();

    return () => {
      cancelled = true;
      closeCurrentDb();
    };
  }, [
    databaseName,
    storeName,
    version,
    onUpgradeNeeded,
    onStaleVersionDetected,
  ]);

  const runStoreRequest = useCallback(
    <R = undefined>(
      mode: IDBTransactionMode,
      makeRequest: (store: IDBObjectStore) => IDBRequest<R>,
      onSuccess?: (result: R) => void
    ): Promise<R> => {
      if (!db) {
        throw new Error('Database not initialized');
      }

      return new Promise<R>((resolve, reject) => {
        const transaction = db.transaction([storeName], mode);
        const store = transaction.objectStore(storeName);
        const request = makeRequest(store);

        request.onsuccess = () => {
          const result = request.result as R;
          onSuccess?.(result);
          resolve(result);
        };

        request.onerror = () => {
          const op = mode === 'readonly' ? 'read from' : 'write to';
          const errorMsg = `Failed to ${op} store: ${request.error?.message}`;
          setError(errorMsg);
          reject(new Error(errorMsg));
        };
      });
    },
    [db, storeName]
  );

  const setItem = useCallback(
    async (key: string, value: T): Promise<void> => {
      await runStoreRequest<IDBValidKey>(
        'readwrite',
        (store) => store.put(value, key),
        () => setData(value)
      );
    },
    [runStoreRequest]
  );

  const getItem = useCallback(
    async (key: string): Promise<T | null> => {
      const result = await runStoreRequest<T | undefined>(
        'readonly',
        (store) => store.get(key),
        (value) => setData((value as T | undefined) ?? null)
      );

      return (result as T | undefined) ?? null;
    },
    [runStoreRequest]
  );

  const removeItem = useCallback(
    async (key: string): Promise<void> => {
      await runStoreRequest(
        'readwrite',
        (store) => store.delete(key),
        () => setData(null)
      );
    },
    [runStoreRequest]
  );

  const clear = useCallback(async (): Promise<void> => {
    await runStoreRequest(
      'readwrite',
      (store) => store.clear(),
      () => setData(null)
    );
  }, [runStoreRequest]);

  const getAllKeys = useCallback(async (): Promise<string[]> => {
    const keys = await runStoreRequest<IDBValidKey[]>('readonly', (store) =>
      store.getAllKeys()
    );

    return keys.map(String);
  }, [runStoreRequest]);

  return {
    clear,
    data,
    error,
    getAllKeys,
    getItem,
    loading,
    removeItem,
    setItem,
  };
}
