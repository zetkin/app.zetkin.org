import { useEffect, useState } from 'react';

const usePressedKeys = () => {
  const [currentKeysDown, setCurrentKeyDown] = useState<string[]>([]);

  useEffect(() => {
    const addKey = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      setCurrentKeyDown((oldCurrentKeys) => [...oldCurrentKeys, event.key]);
    };

    const removeKey = (event: KeyboardEvent) => {
      setCurrentKeyDown((oldCurrentKeys) =>
        oldCurrentKeys.filter((key) => key !== event.key)
      );
    };

    document.addEventListener('keydown', addKey);
    document.addEventListener('keyup', removeKey);

    return () => {
      document.removeEventListener('keydown', addKey);
      document.removeEventListener('keyup', removeKey);
    };
  }, []);

  const isPressed = (keys: string | string[]) => {
    if (typeof keys === 'object') {
      return keys.every((key) => {
        currentKeysDown.includes(key);
      });
    }
    return currentKeysDown.includes(keys);
  };

  return { isPressed, pressedKeys: currentKeysDown };
};

export default usePressedKeys;
