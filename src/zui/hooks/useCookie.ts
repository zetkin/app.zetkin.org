'use client';

import { useCallback, useEffect, useState } from 'react';

const maxAge = 60 * 60 * 24 * 365;

function readCookie(key: string): string | null {
  const prefix = `${encodeURIComponent(key)}=`;
  const cookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));

  return cookie ? cookie.slice(prefix.length) : null;
}

function writeCookie(key: string, value: string, lifetime: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(key)}=${value}; Path=/; Max-Age=${lifetime}; SameSite=Lax${secure}`;
}

export default function useCookie<T>(
  key: string,
  defaultValue: T,
  initialValue?: T
): [T, (newValue: T) => void, () => void] {
  const [value, setLocalValue] = useState<T>(() =>
    initialValue === undefined ? defaultValue : initialValue
  );

  useEffect(() => {
    if (initialValue !== undefined) {
      return;
    }

    const cookie = readCookie(key);

    try {
      setLocalValue(
        cookie === null ? defaultValue : JSON.parse(decodeURIComponent(cookie))
      );
    } catch {
      setLocalValue(() => defaultValue);
    }
  }, [defaultValue, initialValue, key]);

  const setValue = useCallback(
    (newValue: T) => {
      writeCookie(key, encodeURIComponent(JSON.stringify(newValue)), maxAge);
      setLocalValue(() => newValue);
    },
    [key]
  );
  const clear = useCallback(() => {
    writeCookie(key, '', 0);
    setLocalValue(() => defaultValue);
  }, [defaultValue, key]);

  return [value, setValue, clear];
}
