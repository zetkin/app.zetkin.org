'use client';

import { FC, ReactNode } from 'react';

import { ZUIThemeProvider } from 'zui/theme/ZUIThemeProvider';

type Props = {
  children: ReactNode;
};

const HomeThemeProvider: FC<Props> = ({ children }) => {
  return <ZUIThemeProvider oldTheme={false}>{children}</ZUIThemeProvider>;
};

export default HomeThemeProvider;
