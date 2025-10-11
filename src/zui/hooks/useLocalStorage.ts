import { useState } from 'react';

interface StoredValue<T> {
  value: T;
  timestamp: number;
}

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void, number] {
  const stored = getLocalStorageValue<T>(key, defaultValue);
  const [value, setValue] = useState<T>(stored.value);
  const [timestamp, setTimestamp] = useState(stored.timestamp);

  const updateValue = (newValue: T) => {
    const newItem: StoredValue<T> = {
      value: newValue,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(newItem));
    setValue(newValue);
    setTimestamp(newItem.timestamp);
  };

  return [value, updateValue, timestamp];
}

function getLocalStorageValue<T>(key: string, defaultValue: T): StoredValue<T> {
  const isBrowser = typeof window !== 'undefined';
  const stringValue = isBrowser ? localStorage.getItem(key) : null;

  if (!isBrowser || !stringValue) {
    const newItem: StoredValue<T> = {
      value: defaultValue,
      timestamp: Date.now(),
    };
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(newItem));
    }
    return newItem;
  }

  try {
    const parsed = JSON.parse(stringValue) as StoredValue<T>;
    // support old-format value stored without timestamp
    if (parsed && parsed.value !== undefined && parsed.timestamp) {
      return parsed;
    } else {
      return { value: parsed as T, timestamp: Date.now() };
    }
  } catch {
    return { value: defaultValue, timestamp: Date.now() };
  }
}
