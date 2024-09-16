import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import TabbedLayout from 'utils/layout/TabbedLayout';
import messageIds from '../l10n/messageIds';
import useCanvassAssignment from '../hooks/useCanvassAssignment';

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
  const canvassAssignment = useCanvassAssignment(orgId, canvassAssId).data;

  if (!canvassAssignment) {
    return null;
  }

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`}
      defaultTab="/"
      tabs={[{ href: '/', label: messages.canvassAssignment.tabs.overview() }]}
      title={
        canvassAssignment.title || messages.canvassAssignment.empty.title()
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CanvassAssignmentLayout;
