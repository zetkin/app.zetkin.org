import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  initialValue?: T
): [T, (newValue: T) => void, () => void] {
  const [value, setValue] = useState<T>(() =>
    getLocalStorageValue(key, defaultValue, initialValue)
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue, () => clear(key)] as const;
}

function clear(key: string) {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    localStorage.removeItem(key);
  }
}

function getLocalStorageValue<T>(
  key: string,
  defaultValue: T,
  initialValue?: T
): T {
  if (initialValue) {
    return initialValue;
  }

  const isBrowser = typeof window !== 'undefined';
  const stringValue = isBrowser ? localStorage.getItem(key) : null;

  if (stringValue === null || stringValue.length == 0) {
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
    return defaultValue;
  }

  try {
    return JSON.parse(stringValue);
  } catch (err) {
    return defaultValue;
  }
}
