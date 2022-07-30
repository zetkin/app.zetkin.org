import TabbedLayout from './TabbedLayout';

interface CallAssignmentLayoutProps {
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
      title="Placeholder"
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
