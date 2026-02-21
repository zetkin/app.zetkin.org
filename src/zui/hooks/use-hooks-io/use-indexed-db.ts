"use client";

import { useState, useEffect, useCallback } from "react";

interface UseIndexedDBOptions {
  version?: number;
  onUpgradeNeeded?: (
    db: IDBDatabase,
    oldVersion: number,
    newVersion: number
  ) => void;
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

export function useIndexedDB<T = any>(
  databaseName: string,
  storeName: string,
  options: UseIndexedDBOptions = {}
): UseIndexedDBReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  const { version = 1, onUpgradeNeeded } = options;

  // Initialize IndexedDB connection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initDB = async () => {
      try {
        setLoading(true);
        setError(null);

        const request = indexedDB.open(databaseName, version);

        request.onerror = () => {
          setError(`Failed to open database: ${request.error?.message}`);
          setLoading(false);
        };

        request.onsuccess = () => {
          setDb(request.result);
          setLoading(false);
        };

        request.onupgradeneeded = (event) => {
          const database = request.result;
          const oldVersion = event.oldVersion;
          const newVersion = event.newVersion || version;

          // Create object store if it doesn't exist
          if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName);
          }

          // Call custom upgrade handler if provided
          if (onUpgradeNeeded) {
            onUpgradeNeeded(database, oldVersion, newVersion);
          }
        };
      } catch (err) {
        setError(`IndexedDB initialization error: ${err}`);
        setLoading(false);
      }
    };

    initDB();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, [databaseName, storeName, version, onUpgradeNeeded]);

  // Set item in IndexedDB
  const setItem = useCallback(
    async (key: string, value: T): Promise<void> => {
      if (!db) {
        throw new Error("Database not initialized");
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);

        request.onsuccess = () => {
          setData(value);
          resolve();
        };

        request.onerror = () => {
          const errorMsg = `Failed to set item: ${request.error?.message}`;
          setError(errorMsg);
          reject(new Error(errorMsg));
        };
      });
    },
    [db, storeName]
  );

  // Get item from IndexedDB
  const getItem = useCallback(
    async (key: string): Promise<T | null> => {
      if (!db) {
        throw new Error("Database not initialized");
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result || null;
          setData(result);
          resolve(result);
        };

        request.onerror = () => {
          const errorMsg = `Failed to get item: ${request.error?.message}`;
          setError(errorMsg);
          reject(new Error(errorMsg));
        };
      });
    },
    [db, storeName]
  );

  // Remove item from IndexedDB
  const removeItem = useCallback(
    async (key: string): Promise<void> => {
      if (!db) {
        throw new Error("Database not initialized");
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          setData(null);
          resolve();
        };

        request.onerror = () => {
          const errorMsg = `Failed to remove item: ${request.error?.message}`;
          setError(errorMsg);
          reject(new Error(errorMsg));
        };
      });
    },
    [db, storeName]
  );

  // Clear all items from the store
  const clear = useCallback(async (): Promise<void> => {
    if (!db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        setData(null);
        resolve();
      };

      request.onerror = () => {
        const errorMsg = `Failed to clear store: ${request.error?.message}`;
        setError(errorMsg);
        reject(new Error(errorMsg));
      };
    });
  }, [db, storeName]);

  // Get all keys from the store
  const getAllKeys = useCallback(async (): Promise<string[]> => {
    if (!db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve(request.result as string[]);
      };

      request.onerror = () => {
        const errorMsg = `Failed to get keys: ${request.error?.message}`;
        setError(errorMsg);
        reject(new Error(errorMsg));
      };
    });
  }, [db, storeName]);

  return {
    data,
    error,
    loading,
    setItem,
    getItem,
    removeItem,
    clear,
    getAllKeys,
  };
}
