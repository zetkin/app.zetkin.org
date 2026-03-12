import { useEffect, useState } from 'react';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { addons } from '@storybook/preview-api';

const channel = addons.getChannel();

export const useStorybookDarkMode = () => {
  const [isDark, setDark] = useState<boolean>(
    () => localStorage.getItem('storybook-dark-mode') === 'true'
  );

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
  }, [channel, setDark]);

  useEffect(() => {
    localStorage.setItem('storybook-dark-mode', isDark.toString());
  }, [isDark]);

  return isDark;
};
