import Head from 'next/head';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useSuborgsWithStats from 'features/organizations/hooks/useSuborgsWithStats';
import OverviewLayout from 'features/organizations/layouts/OverviewLayout';
import { SuborgWithStats } from 'features/organizations/types';
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

type SuborgProps = {
  orgWithStats: SuborgWithStats;
};
const Suborg: FC<SuborgProps> = ({ orgWithStats }) => {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
      <Typography>{orgWithStats.title}</Typography>
      <Typography>{`${orgWithStats.stats.numPeople} people`}</Typography>
    </Box>
  );
};

interface Props {
  orgId: string;
}

const SuborgsPage: PageWithLayout<Props> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();
  const suborgsWithStats = useSuborgsWithStats(parsedOrgId);

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
      {suborgsWithStats.map((orgWithStats) => (
        <Suborg key={orgWithStats.id} orgWithStats={orgWithStats} />
      ))}
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <OverviewLayout>{page}</OverviewLayout>;
};

export default SuborgsPage;
