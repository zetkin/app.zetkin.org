import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUISection from 'zui/ZUISection';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

const GRAY = 'rgba(0, 0, 0, 0.12)';
const ORANGE = 'rgba(245, 124, 0, 1)';
const GREEN = 'rgba(102, 187, 106, 1)';
const BLUE = 'rgba(25, 118, 210, 1)';

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
  const [onServer, setOnServer] = useState(true);
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );

  useEffect(() => setOnServer(false), []);

  if (onServer) {
    return null;
  }

  const statsSum =
    model.getStats().blocked + model.getStats().done + model.getStats().ready;

  const colors = statsSum > 0 ? [ORANGE, GREEN, BLUE] : [GRAY, GRAY, GRAY];

  const { blocked, ready, done } = model.getStats();

  const values = statsSum > 0 ? [blocked, ready, done] : [1, 1, 1];

  return (
    <ZUISection title="Status">
      <ZUIStackedStatusBar colors={colors} values={values} />
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
