import { useState, useEffect, useCallback, useRef } from 'react';

import { IndexedDB } from '../utils/indexedDB';
import { VisitByHouseholdIdMap } from './useVisitReporting';

export function useIndexedDB(key: string, defaultValue: VisitByHouseholdIdMap) {
  const [value, setValue] = useState<VisitByHouseholdIdMap>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const dbRef = useRef<IndexedDB | null>(null);

  if (!dbRef.current) {
    dbRef.current = new IndexedDB();
  }
  const db = dbRef.current;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await db.getItem(key);
        if (cancelled) {
          return;
        }
        if (stored !== null && stored !== undefined) {
          setValue(stored);
        } else {
          await db.setItem(key, defaultValue);
          setValue(defaultValue);
        }
      } catch (err) {
        if (!cancelled) {
          setValue(defaultValue);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const setStoredValue = useCallback(
    async (next: VisitByHouseholdIdMap) => {
      await db.setItem(key, next);
      setValue(next);
    },
    [db, key]
  );

  return [value, setStoredValue, isLoading] as const;
}
