import { callAssignmentQuery } from 'features/callAssignments/api/callAssignments';
import TabbedLayout from '../../../utils/layout/TabbedLayout';

interface CallAssignmentLayoutProps {
  children: React.ReactNode;
  orgId: string;
  campaignId: string;
  assignmentId: string;
}

const CallAssignmentLayout: React.FC<CallAssignmentLayoutProps> = ({
  children,
  orgId,
  campaignId,
  assignmentId,
}) => {
  const assQuery = callAssignmentQuery(orgId, assignmentId).useQuery();

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/campaigns/${campaignId}/callassignments/${assignmentId}`}
      defaultTab="/"
      tabs={[
        {
          href: '/',
          messageId: 'layout.organize.callAssignment.tabs.insights',
        },
      ]}
      title={assQuery.data?.title}
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
