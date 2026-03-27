import 'fake-indexeddb/auto';

import { act, renderHook, waitFor } from '@testing-library/react';

import { useIndexedDB } from './useIndexedDB';

describe('useIndexedDB', () => {
  const deleteDatabase = async (name: string) => {
    await act(async () => {
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(name);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        request.onblocked = () =>
          reject(new Error(`Failed to delete blocked database: ${name}`));
      });
    });
  };

  const openDatabase = async (
    name: string,
    version: number,
    storeName: string
  ): Promise<IDBDatabase> => {
    return await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () =>
        reject(new Error(`Open blocked for database: ${name}`));
    });
  };

  const waitForReady = async <
    T extends {
      error: string | null;
      loading: boolean;
    }
  >(result: {
    current: T;
  }) => {
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  };

  afterEach(async () => {
    await deleteDatabase('test-db-1');
    await deleteDatabase('test-db-2');
    await deleteDatabase('test-db-3');
    await deleteDatabase('test-db-4');
  });

  test('setItem/getItem/removeItem roundtrip', async () => {
    const { result, unmount } = renderHook(() =>
      useIndexedDB<{ a: number }>('test-db-1', 'store-1', { version: 1 })
    );

    await waitForReady(result);

    await act(async () => {
      await result.current.setItem('k1', { a: 1 });
    });

    expect(result.current.data).toEqual({ a: 1 });
    expect(result.current.error).toBeNull();

    let value: { a: number } | null = null;

    await act(async () => {
      value = await result.current.getItem('k1');
    });

    expect(value).toEqual({ a: 1 });
    expect(result.current.data).toEqual({ a: 1 });
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.removeItem('k1');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      value = await result.current.getItem('k1');
    });

    expect(value).toBeNull();
    expect(result.current.data).toBeNull();

    await act(async () => {
      unmount();
    });
  });

  test('getAllKeys and clear', async () => {
    const { result, unmount } = renderHook(() =>
      useIndexedDB<string>('test-db-2', 'store-1', { version: 1 })
    );

    await waitForReady(result);

    await act(async () => {
      await result.current.setItem('a', 'A');
      await result.current.setItem('b', 'B');
    });

    let keys: string[] = [];

    await act(async () => {
      keys = await result.current.getAllKeys();
    });

    expect(new Set(keys)).toEqual(new Set(['a', 'b']));

    await act(async () => {
      await result.current.clear();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      keys = await result.current.getAllKeys();
    });

    expect(keys).toEqual([]);

    await act(async () => {
      unmount();
    });
  });

  test('calls onStaleVersionDetected and sets error on versionchange', async () => {
    const onStaleVersionDetected = jest.fn();

    const { result, unmount } = renderHook(() =>
      useIndexedDB('test-db-3', 'store-1', {
        onStaleVersionDetected,
        version: 1,
      })
    );

    await waitForReady(result);

    let upgradedDb: IDBDatabase;

    await act(async () => {
      upgradedDb = await openDatabase('test-db-3', 2, 'store-1');
    });

    await waitFor(() => {
      expect(onStaleVersionDetected).toHaveBeenCalledTimes(1);
      expect(result.current.error).toMatch(/new version/i);
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      upgradedDb.close();
      unmount();
    });
  });

  test('calls onUpgradeNeeded with correct old and new versions', async () => {
    const onUpgradeNeeded = jest.fn();

    const { result, unmount } = renderHook(() =>
      useIndexedDB('test-db-4', 'store-1', {
        onUpgradeNeeded,
        version: 3,
      })
    );

    await waitForReady(result);

    expect(onUpgradeNeeded).toHaveBeenCalledTimes(1);

    const [db, oldVersion, newVersion] = onUpgradeNeeded.mock.calls[0];

    expect(db).toBeInstanceOf(IDBDatabase);
    expect(oldVersion).toBe(0);
    expect(newVersion).toBe(3);

    await act(async () => {
      unmount();
    });
  });
});
