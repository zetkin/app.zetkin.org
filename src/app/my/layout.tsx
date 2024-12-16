import { FC, ReactNode } from 'react';

import HomeLayout from 'features/home/layouts/HomeLayout';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  const homeTitle = process.env.HOME_TITLE;

  return (
    <HomeThemeProvider>
      <HomeLayout title={homeTitle}>{children}</HomeLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
