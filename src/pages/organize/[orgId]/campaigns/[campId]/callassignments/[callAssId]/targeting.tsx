import { GetServerSideProps } from 'next';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallAssignmentStatusBar from 'features/callAssignments/components/CallAssignmentStatusBar';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUISection from 'zui/ZUISection';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.callAssignment'],
  }
);

interface AssignmentPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );

  const onServer = typeof window === 'undefined';
  if (onServer) {
    return null;
  }

  if (model.isLoading) {
    return <h1>LOADING</h1>;
  }

  return (
    <ZUISection title="Status">
      <CallAssignmentStatusBar stats={model.getStats()} />
    </ZUISection>
  );
};

AssignmentPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;
