import { FC, ReactNode } from 'react';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';

type Props = {
  children: ReactNode;
  params: {
    orgId: string;
  };
};

const SubscriptionsManagementLayout: FC<Props> = ({ children, params }) => {
  return <HomeThemeProvider>{children}</HomeThemeProvider>;
};

export default SubscriptionsManagementLayout;
