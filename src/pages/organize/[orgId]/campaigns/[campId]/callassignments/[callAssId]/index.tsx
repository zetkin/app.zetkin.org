import { GetServerSideProps } from 'next';
import { useIntl } from 'react-intl';
import { Box, Card, Grid, List } from '@material-ui/core';
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
  const intl = useIntl();
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
    <ZUISection
      title={intl.formatMessage({
        id: 'pages.organizeCallAssignment.statusSectionTitle',
      })}
    >
      <ZUIStackedStatusBar colors={colors} values={values} />
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Card>
              <StatusSectionHeader
                chipColor={ORANGE}
                subtitle={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.blocked.subtitle',
                })}
                targetingDone={targetingDone}
                title={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.blocked.title',
                })}
                value={stats.blocked}
              />
              <List>
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.blocked.calledTooRecently',
                  })}
                  value={stats.calledTooRecently}
                />
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.blocked.callBackLater',
                  })}
                  value={stats.callBackLater}
                />
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.blocked.missingPhoneNumber',
                  })}
                  value={stats.missingPhoneNumber}
                />
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.blocked.organizerActionNeeded',
                  })}
                  value={stats.organizerActionNeeded}
                />
              </List>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <Card>
              <StatusSectionHeader
                chipColor={GREEN}
                subtitle={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.ready.subtitle',
                })}
                targetingDone={targetingDone}
                title={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.ready.title',
                })}
                value={stats.ready}
              />
              <List>
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.ready.queue',
                  })}
                  value={stats.queue}
                />
                <StatusSectionItem
                  title={intl.formatMessage({
                    id: 'pages.organizeCallAssignment.ready.allocated',
                  })}
                  value={stats.allocated}
                />
              </List>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <Card>
              <StatusSectionHeader
                chipColor={BLUE}
                subtitle={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.done.subtitle',
                })}
                targetingDone={targetingDone}
                title={intl.formatMessage({
                  id: 'pages.organizeCallAssignment.done.title',
                })}
                value={stats.done}
              />
            </Card>
          </Grid>
        </Grid>
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
