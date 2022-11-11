import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

//TO-DO: Replace with theme colors
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
    localeScope: [
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
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

  const stats = model.getStats();

  const data = model.getData();

  const targetingDone = !!data.target.filter_spec?.length;

  const colors = targetingDone ? [ORANGE, GREEN, BLUE] : [GRAY, GRAY, GRAY];
  const statusBarStatsList = targetingDone
    ? [stats.blocked, stats.ready, stats.done]
    : [1, 1, 1];

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h3">
          <Msg id="pages.organizeCallAssignment.statusSectionTitle" />
        </Typography>
      </Box>
      <ZUIStackedStatusBar colors={colors} values={statusBarStatsList} />
      <Box mt={2}>
        <CallAssignmentStatusCards
          stats={stats}
          targetingDone={targetingDone}
        />
      </Box>
    </Box>
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
