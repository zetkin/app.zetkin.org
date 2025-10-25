import { FC, ReactNode } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';
import useOrganization from '../hooks/useOrganization';

interface Props {
  children: ReactNode;
}

const SuborgOverviewLayout: FC<Props> = ({ children }) => {
  const { orgId } = useNumericRouteParams();
  const organization = useOrganization(orgId).data;
  return (
    <SimpleLayout title={organization?.title || ''}>{children}</SimpleLayout>
  );
};

export default SuborgOverviewLayout;
