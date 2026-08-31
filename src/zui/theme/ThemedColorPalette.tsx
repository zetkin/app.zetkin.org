import { ColorPalette } from '@storybook/addon-docs/blocks';
import { FC, ReactElement } from 'react';

import lightPalette, { darkPalette } from 'zui/theme/palette';
import { useStorybookDarkMode } from 'zui/hooks/useStorybookDarkMode';

export const ThemedColorPalette: FC<{
  children: ReactElement<any> | ((theme: typeof lightPalette) => ReactElement<any>);
}> = ({ children }) => {
  const isDark = useStorybookDarkMode();

  const palette = isDark ? darkPalette : lightPalette;

  const resolvedChildren =
    typeof children === 'function' ? children(palette) : children;

  return <ColorPalette>{resolvedChildren}</ColorPalette>;
};
