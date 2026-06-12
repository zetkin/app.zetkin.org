import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export default function useIndexedDB<T>(
  key: IDBValidKey,
  initialValue: T
): [T, (prevState: T) => void] {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const loadValue = async () => {
      const stored = await get(key);
      if (stored !== undefined) {
        setValue(stored);
      }
      return stored;
    };
    loadValue();
  }, [key]);

  useEffect(() => {
    const isWorthStoring = Object.getOwnPropertyNames(value).length > 0;
    if (isWorthStoring) {
      set(key, value);
    }
  }, [key, value]);

  return [value, setValue];
}
