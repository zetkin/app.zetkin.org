import { ColorPalette } from '@storybook/addon-docs/blocks';
import { FC, ReactElement } from 'react';

import lightPalette, { darkPalette } from 'zui/theme/palette';
import { useStorybookDarkMode } from 'zui/hooks/useStorybookDarkMode';

export const ThemedColorPalette: FC<{
  children:
    | ReactElement<unknown>
    | ((theme: typeof lightPalette) => ReactElement<unknown>);
}> = ({ children }) => {
  const isDark = useStorybookDarkMode();

  const palette = isDark ? darkPalette : lightPalette;

  const resolvedChildren =
    typeof children === 'function' ? children(palette) : children;

  return <ColorPalette>{resolvedChildren}</ColorPalette>;
};
