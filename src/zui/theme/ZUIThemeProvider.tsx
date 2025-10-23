import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { Box } from '@mui/system';
import { SxProps } from '@mui/system/styleFunctionSx';

import { oldDarkThemeWithLocale, oldThemeWithLocale } from 'theme';
import { getDarkModeFromLocalStorage } from 'zui/theme/dark-mode';
import { darkThemeWithLocale, themeWithLocale } from './index';

export const ZUIThemeProvider = ({
  children,
  lang,
  oldTheme,
}: PropsWithChildren<{
  lang?: string;
  oldTheme?: boolean;
}>) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showRoot, setShowRoot] = useState(false);

  const theme = useMemo(() => {
    if (oldTheme) {
      return darkMode ? oldDarkThemeWithLocale(lang) : oldThemeWithLocale(lang);
    }
    return darkMode ? darkThemeWithLocale(lang) : themeWithLocale(lang);
  }, [lang, darkMode, oldTheme]);

  useEffect(() => {
    setDarkMode(getDarkModeFromLocalStorage());
    setShowRoot(true);
  }, []);

  const rootStyle: SxProps = useMemo(
    () => ({
      display: showRoot ? 'unset' : 'none',
    }),
    [showRoot]
  );

  return (
    <StylesThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Box sx={rootStyle}>{children}</Box>
      </ThemeProvider>
    </StylesThemeProvider>
  );
};
