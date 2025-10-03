import { FC, ReactNode } from 'react';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import AccountLayout from 'features/account/layouts/AccountLayout';

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  return (
    <HomeThemeProvider>
      <AccountLayout>{children}</AccountLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
