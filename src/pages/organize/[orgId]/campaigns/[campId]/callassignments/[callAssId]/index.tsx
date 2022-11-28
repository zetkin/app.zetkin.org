import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { Add, Edit } from '@material-ui/icons';
import {
  Box,
  Button,
  Card,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import useModel from 'core/useModel';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: theme.palette.targetingStatusBar.gray,
    borderRadius: '1em',
    color: 'secondary',
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

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
  const classes = useStyles();
  const [onServer, setOnServer] = useState(true);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );

  useEffect(() => setOnServer(false), []);

  if (onServer) {
    return null;
  }

  const stats = model.getStats();

  const colors = model.hasTargets
    ? [
        'targetingStatusBar.orange',
        'targetingStatusBar.green',
        'targetingStatusBar.blue',
      ]
    : [
        'targetingStatusBar.gray',
        'targetingStatusBar.gray',
        'targetingStatusBar.gray',
      ];

  const statusBarStatsList =
    model.hasTargets && stats
      ? [stats.blocked, stats.ready, stats.done]
      : [1, 1, 1];

  const { target } = model.getData();

  return (
    <Box>
      <Box mb={2}>
        <Card>
          <Box display="flex" justifyContent="space-between" p={2}>
            <Typography variant="h4">Targets</Typography>
            {model.isTargeted && (
              <ZUIAnimatedNumber value={stats?.allTargets || 0}>
                {(animatedValue) => (
                  <Box className={classes.chip}>{animatedValue}</Box>
                )}
              </ZUIAnimatedNumber>
            )}
          </Box>
          {model.isTargeted ? (
            <>
              <Divider />
              <Box p={2}>
                <Button
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={<Edit />}
                  variant="outlined"
                >
                  Edit target group
                </Button>
              </Box>
            </>
          ) : (
            <Box pb={2} px={2}>
              <Box bgcolor="gray" p={2}>
                <Typography>
                  Use smart search to define target group for this assignment.
                </Typography>
                <Box pt={1}>
                  <Button
                    onClick={() => setQueryDialogOpen(true)}
                    startIcon={<Add />}
                    variant="outlined"
                  >
                    Define target group
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
        {queryDialogOpen && (
          <SmartSearchDialog
            onDialogClose={() => setQueryDialogOpen(false)}
            onSave={(query) => {
              model.setTargets(query);
              setQueryDialogOpen(false);
            }}
            query={target}
          />
        )}
      </Box>

      <Box mb={2}>
        <Typography variant="h3">
          <Msg id="pages.organizeCallAssignment.statusSectionTitle" />
        </Typography>
      </Box>
      <ZUIStackedStatusBar colors={colors} values={statusBarStatsList} />
      <Box mt={2}>
        <CallAssignmentStatusCards model={model} />
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
