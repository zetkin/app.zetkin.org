import { ColorPalette } from '@storybook/blocks';
import { FC, ReactElement } from 'react';

import lightPalette, { darkPalette } from 'zui/theme/palette';
import { useStorybookDarkMode } from 'zui/hooks/useStorybookDarkMode';

export const ThemedColorPalette: FC<{
  children: ReactElement | ((theme: typeof lightPalette) => ReactElement);
}> = ({ children }) => {
  const isDark = useStorybookDarkMode();

  const palette = isDark ? darkPalette : lightPalette;

  const resolvedChildren =
    typeof children === 'function' ? children(palette) : children;

  return <ColorPalette>{resolvedChildren}</ColorPalette>;
};
