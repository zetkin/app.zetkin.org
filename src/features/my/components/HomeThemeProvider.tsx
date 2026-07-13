'use client';

import { ThemeProvider } from '@mui/material';
import { FC, ReactNode } from 'react';

import newTheme from 'zui/theme';

type Props = {
  children: ReactNode;
};

const HomeThemeProvider: FC<Props> = ({ children }) => {
  return <ThemeProvider theme={newTheme}>{children}</ThemeProvider>;
};

export default HomeThemeProvider;
