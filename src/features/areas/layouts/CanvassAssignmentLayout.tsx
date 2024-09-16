import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import TabbedLayout from 'utils/layout/TabbedLayout';
import messageIds from '../l10n/messageIds';

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
  const messages = useMessages(messageIds);
  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`}
      defaultTab="/"
      tabs={[{ href: '/', label: messages.canvassAssignment.tabs.overview() }]}
    >
      {children}
    </TabbedLayout>
  );
};

export default CanvassAssignmentLayout;
