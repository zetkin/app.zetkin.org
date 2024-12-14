import { FC, ReactNode } from 'react';

import HomeLayout from 'features/home/layouts/HomeLayout';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  return (
    <HomeThemeProvider>
      <HomeLayout>{children}</HomeLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
