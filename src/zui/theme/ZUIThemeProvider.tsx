import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { Box } from '@mui/system';
import { SxProps } from '@mui/system/styleFunctionSx';

import { oldDarkThemeWithLocale, oldThemeWithLocale } from 'theme';
import {
  getDarkModeFromLocalStorage,
  getDarkModeSettingFromLocalStorage,
  setDarkModeToLocalStorage,
} from 'zui/theme/dark-mode';
import { darkThemeWithLocale, themeWithLocale } from './index';

export const DarkModeSettingContext = createContext<{
  set: (darkMode: boolean | 'auto') => void;
  value: boolean | 'auto';
}>({
  set: () => {},
  value: 'auto',
});

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

  const [darkModeSetting, setDarkModeSetting] = useState(
    getDarkModeSettingFromLocalStorage()
  );

  const darkModeSettings = useMemo(() => {
    return {
      set: (darkMode: boolean | 'auto') => {
        setDarkModeToLocalStorage(darkMode);
        setDarkModeSetting(darkMode);

        const newDarkModeVal = getDarkModeFromLocalStorage();
        document.cookie = `theme=${
          newDarkModeVal ? 'dark' : 'light'
        }; path=/; max-age=31536000`;
        setDarkMode(newDarkModeVal);
      },
      value: darkModeSetting,
    };
  }, [setDarkMode, darkModeSetting]);

  useEffect(() => {
    document.cookie = `theme=${
      darkMode ? 'dark' : 'light'
    }; path=/; max-age=31536000`;
  }, [darkMode]);

  return (
    <StylesThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <DarkModeSettingContext.Provider value={darkModeSettings}>
          <Box sx={rootStyle}>{children}</Box>
        </DarkModeSettingContext.Provider>
      </ThemeProvider>
    </StylesThemeProvider>
  );
};
