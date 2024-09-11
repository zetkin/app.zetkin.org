import { FC, ReactNode } from 'react';

import DefaultLayout from 'utils/layout/DefaultLayout';

const CanvassAssignmentLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default CanvassAssignmentLayout;
