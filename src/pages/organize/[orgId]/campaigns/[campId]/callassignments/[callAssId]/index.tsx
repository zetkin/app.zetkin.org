import { GetServerSideProps } from 'next';
import { Box, Card, List, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import StatusSectionHeader from 'features/callAssignments/components/StatusSectionHeader';
import StatusSectionItem from 'features/callAssignments/components/StatusSectionItem';
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

const useStyles = makeStyles({
  card: {
    flexGrow: 1,
  },
});

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const classes = useStyles();
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
  const values = targetingDone
    ? [stats.blocked, stats.ready, stats.done]
    : [1, 1, 1];

  return (
    <ZUISection title="Status">
      <ZUIStackedStatusBar colors={colors} values={values} />
      <Box
        alignItems="flex-start"
        display="flex"
        gridGap="1em"
        justifyContent="space-between"
        mt={2}
      >
        <Card className={classes.card}>
          <StatusSectionHeader
            chipColor={ORANGE}
            subtitle="Targets not ready to be called"
            targetingDone={targetingDone}
            title="Blocked"
            value={stats.blocked}
          />
          <List>
            <StatusSectionItem
              title="Called too recently"
              value={stats.calledTooRecently}
            />
            <StatusSectionItem
              title="Asked us to call back later"
              value={stats.callBackLater}
            />
            <StatusSectionItem
              title="Missing phone number"
              value={stats.missingPhoneNumber}
            />
            <StatusSectionItem
              title="Organizer action needed"
              value={stats.organizerActionNeeded}
            />
          </List>
        </Card>
        <Card className={classes.card}>
          <StatusSectionHeader
            chipColor={GREEN}
            subtitle="Targets to be called"
            targetingDone={targetingDone}
            title="Ready"
            value={stats.ready}
          />
          <List>
            <StatusSectionItem title="Targets in queue" value={stats.queue} />
            <StatusSectionItem
              title="Targets allocated to caller"
              value={stats.allocated}
            />
          </List>
        </Card>
        <Card className={classes.card}>
          <StatusSectionHeader
            chipColor={BLUE}
            subtitle="Targets that meet the done criteria"
            targetingDone={targetingDone}
            title="Done"
            value={stats.done}
          />
        </Card>
      </Box>
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
