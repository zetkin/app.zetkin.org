import { FC, ReactNode } from 'react';
import { NoSsr } from '@mui/material';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';

type Props = {
  children: ReactNode;
};

const CallLayout: FC<Props> = ({ children }) => {
  return (
    <HomeThemeProvider>
      <NoSsr>{children}</NoSsr>
    </HomeThemeProvider>
  );
};

export default CallLayout;
