import Head from 'next/head';
import { FC, Suspense } from 'react';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useSuborgsWithStats from 'features/organizations/hooks/useSuborgsWithStats';
import SuborgOverviewLayout from 'features/organizations/layouts/SuborgOverviewLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId } = ctx.params!;
    return {
      props: {
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

const SuborgsList: FC<{ orgId: number }> = ({ orgId }) => {
  const suborgsWithStats = useSuborgsWithStats(orgId);

  if (suborgsWithStats.length == 0) {
    return <Typography>You have no sub-organizations</Typography>;
  }

  return (
    <>
      {suborgsWithStats.map((orgWithStats) => (
        <Box
          key={orgWithStats.id}
          sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
        >
          <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
          <Typography>{orgWithStats.title}</Typography>
          <Typography>{`${orgWithStats.stats.numPeople} people`}</Typography>
          <Typography>{`${orgWithStats.stats.numCalls} calls`}</Typography>
          <Typography>{`${orgWithStats.stats.numSubmissions} survey submissions`}</Typography>
          <Typography>{`${orgWithStats.stats.numEvents} events`}</Typography>
          <Typography>{`${orgWithStats.stats.numEventParticipants} event participants`}</Typography>
          <Typography>{`${orgWithStats.stats.numEmails} emails`}</Typography>
          <Typography>{`${orgWithStats.stats.numEmailsSent} emails sent`}</Typography>
          <Typography>{`${orgWithStats.stats.numLists} lists`}</Typography>
          <Typography>{`${orgWithStats.stats.numProjects} projects`}</Typography>
        </Box>
      ))}
    </>
  );
};

interface Props {
  orgId: string;
}

const SuborgsPage: PageWithLayout<Props> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          <Msg id={messageIds.overview.suborgs.title} />
        </title>
      </Head>
      <Suspense fallback={<CircularProgress />}>
        <SuborgsList orgId={parsedOrgId} />
      </Suspense>
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <SuborgOverviewLayout>{page}</SuborgOverviewLayout>;
};

export default SuborgsPage;
