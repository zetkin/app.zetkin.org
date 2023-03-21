import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Typography } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import CallAssignmentTargets from 'features/callAssignments/components/CallAssignmentTargets';
import { Msg } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

import messageIds from 'features/callAssignments/l10n/messageIds';

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
  const model = useModel(
    (env) =>
      new CallAssignmentModel(env, parseInt(orgId), parseInt(assignmentId))
  );

  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  const { data: stats } = model.getStats();

  const statusBarStatsList =
    model.hasTargets && stats
      ? [
          {
            color: 'statusColors.orange',
            value: stats.blocked,
          },
          {
            color: 'statusColors.blue',
            value: stats.ready,
          },
          {
            color: 'statusColors.green',
            value: stats.done,
          },
        ]
      : [
          {
            color: 'statusColors.gray',
            value: 1,
          },
          {
            color: 'statusColors.gray',
            value: 1,
          },
          {
            color: 'statusColors.gray',
            value: 1,
          },
        ];

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <Box>
        <Box mb={2}>
          <CallAssignmentTargets model={model} />
        </Box>
        <Box mb={2}>
          <Typography variant="h3">
            <Msg id={messageIds.statusSectionTitle} />
          </Typography>
        </Box>
        <ZUIStackedStatusBar values={statusBarStatsList} />
        <Box mt={2}>
          <CallAssignmentStatusCards model={model} />
        </Box>
      </Box>
    </>
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
