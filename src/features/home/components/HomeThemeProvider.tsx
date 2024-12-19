'use client';

import { ThemeProvider, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const HomeThemeProvider: FC<Props> = ({ children }) => {
  const theme = useTheme();
  return (
    <ThemeProvider
      theme={{
        ...theme,
        components: {
          ...theme.components,
          MuiButton: {
            ...theme.components?.MuiButton,
            styleOverrides: {
              ...theme.components?.MuiButton?.styleOverrides,
              root: {
                fontWeight: 'bold',
                textTransform: 'none',
              },
            },
          },
        },
        palette: {
          ...theme.palette,
          primary: {
            contrastText: 'white',
            dark: '#252525',
            light: '#252525',
            main: '#252525',
          },
        },
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export default HomeThemeProvider;
