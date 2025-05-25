import { useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const state = useState<T>(getLocalStorageValue(key, defaultValue));
  const setValue = state[1];

  return [
    getLocalStorageValue(key, defaultValue),
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
  ];
}

function getLocalStorageValue<T>(key: string, defaultValue: T): T {
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
