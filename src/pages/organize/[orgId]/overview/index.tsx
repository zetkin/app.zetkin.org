import Head from 'next/head';
import { FC, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useSuborgsWithStats from 'features/organizations/hooks/useSuborgsWithStats';
import OverviewLayout from 'features/organizations/layouts/OverviewLayout';
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

  return (
    <>
      {suborgsWithStats.map((orgWithStats) => (
        <Box
          key={orgWithStats.id}
          sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
        >
          <Typography>{orgWithStats.title}</Typography>
          <Typography>{`${orgWithStats.stats.numPeople} people`}</Typography>
          <Typography>{`${orgWithStats.stats.numCallAssignments} callAssignments`}</Typography>
          <Typography>{`${orgWithStats.stats.numCalls} calls`}</Typography>
          <Typography>{`${orgWithStats.stats.numSurveys} surveys`}</Typography>
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
  return <OverviewLayout>{page}</OverviewLayout>;
};

export default SuborgsPage;
