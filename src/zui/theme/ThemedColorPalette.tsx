import { ColorPalette } from '@storybook/blocks';
import { FC, ReactElement, useEffect, useState } from 'react';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { darkPalette, palette as lightPalette } from 'zui/theme/palette';

const channel = addons.getChannel();

export const ThemedColorPalette: FC<{
  children: ReactElement | ((theme: typeof lightPalette) => ReactElement);
}> = ({ children }) => {
  const [isDark, setDark] = useState(() => {
    const existing = localStorage.getItem('storybook-dark-mode');
    if (!existing) {
      return null;
    }
    return existing === 'true';
  });

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
  }, [channel, setDark]);

  const palette = isDark ? darkPalette : lightPalette;

  const resolvedChildren =
    typeof children === 'function' ? children(palette) : children;

  return <ColorPalette>{resolvedChildren}</ColorPalette>;
};
