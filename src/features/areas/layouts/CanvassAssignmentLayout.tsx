import { FC, ReactNode } from 'react';

import TabbedLayout from 'utils/layout/TabbedLayout';

type CanvassAssignmentLayoutProps = {
  campId: number;
  canvassAssId: string;
  children: ReactNode;
  orgId: number;
};

const CanvassAssignmentLayout: FC<CanvassAssignmentLayoutProps> = ({
  children,
  orgId,
  campId,
  canvassAssId,
}) => {
  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`}
      defaultTab="/"
      tabs={[{ href: '/', label: 'Overview' }]}
    >
      {children}
    </TabbedLayout>
  );
};

export default CanvassAssignmentLayout;
