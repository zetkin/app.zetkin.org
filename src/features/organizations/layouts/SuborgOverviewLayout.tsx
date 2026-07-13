import { FC, ReactNode } from 'react';

import SimpleLayout from 'utils/layout/SimpleLayout';

interface Props {
  children: ReactNode;
}

const SuborgOverviewLayout: FC<Props> = ({ children }) => {
  return <SimpleLayout title="Suborg overview">{children}</SimpleLayout>;
};

export default SuborgOverviewLayout;
