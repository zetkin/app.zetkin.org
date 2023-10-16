import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Typography } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import CallAssignmentTargets from 'features/callAssignments/components/CallAssignmentTargets';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;
    try {
      const client = new BackendApiClient(ctx.req.headers);
      const data = await client.get<ZetkinCallAssignment>(
        `/api/orgs/${orgId}/call_assignments/${callAssId}`
      );
      const actualCampaign = data.campaign?.id.toString() ?? 'standalone';
      if (actualCampaign !== campId) {
        return { notFound: true };
      }
    } catch (error) {
      return { notFound: true };
    }
    return {
      props: {},
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

const AssignmentPage: PageWithLayout = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const { data: callAssignment } = useCallAssignment(orgId, callAssId);
  const { statusBarStatsList } = useCallAssignmentStats(orgId, callAssId);

  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{callAssignment?.title}</title>
      </Head>
      <Box>
        <Box mb={2}>
          <CallAssignmentTargets />
        </Box>
        <Box mb={2}>
          <Typography variant="h3">
            <Msg id={messageIds.statusSectionTitle} />
          </Typography>
        </Box>
        <ZUIStackedStatusBar values={statusBarStatsList} />
        <Box mt={2}>
          <CallAssignmentStatusCards />
        </Box>
      </Box>
    </>
  );
};

AssignmentPage.getLayout = function getLayout(page) {
  return <CallAssignmentLayout>{page}</CallAssignmentLayout>;
};

export default AssignmentPage;
