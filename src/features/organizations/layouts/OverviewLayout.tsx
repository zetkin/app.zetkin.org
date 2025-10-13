import { FC, ReactNode } from 'react';

import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useNumericRouteParams } from 'core/hooks';

interface Props {
  children: ReactNode;
}

const OverviewLayout: FC<Props> = ({ children }) => {
  const { orgId } = useNumericRouteParams();
  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/overview`}
      defaultTab="/suborgs"
      tabs={[{ href: `/suborgs`, label: 'Suborgs' }]}
      title="Overview"
    >
      {children}
    </TabbedLayout>
  );
};

export default OverviewLayout;
