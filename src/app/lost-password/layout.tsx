import { FC, ReactNode } from 'react';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import AccountLayout from 'features/account/layouts/AccountLayout';

type Props = {
  children: ReactNode;
};

const LostPasswordLayout: FC<Props> = ({ children }) => {
  return (
    <HomeThemeProvider>
      <AccountLayout>{children}</AccountLayout>
    </HomeThemeProvider>
  );
};

export default LostPasswordLayout;
