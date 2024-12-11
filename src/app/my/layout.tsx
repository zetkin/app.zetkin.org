import { FC, ReactNode } from 'react';

import HomeLayout from 'features/home/layouts/HomeLayout';

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default MyHomeLayout;
