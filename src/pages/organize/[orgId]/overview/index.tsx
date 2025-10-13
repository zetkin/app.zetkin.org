import Head from 'next/head';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { scaffold } from 'utils/next';
import { ZetkinSubOrganization } from 'utils/types/zetkin';
import useSuborgStats from 'features/organizations/hooks/useSuborgStats';
import OverviewLayout from 'features/organizations/layouts/OverviewLayout';

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
  org: ZetkinSubOrganization;
};
const Suborg: FC<SuborgProps> = ({ org }) => {
  const stats = useSuborgStats(org.id);
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
      <Typography color={org.is_active ? 'primary' : 'secondary'}>
        {org.title}
      </Typography>
      {stats && stats.length > 0 && (
        <Typography color={org.is_active ? 'primary' : 'secondary'}>
          {`${stats[0].result} people`}
        </Typography>
      )}
    </Box>
  );
};

interface Props {
  orgId: string;
}

const SuborgsPage: PageWithLayout<Props> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();
  const suborgs = useSubOrganizations(parsedOrgId).data || [];

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Suborgs</title>
      </Head>
      {suborgs
        .filter((org) => org.id != parsedOrgId)
        .map((org) => {
          return <Suborg key={org.id} org={org} />;
        })}
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <OverviewLayout>{page}</OverviewLayout>;
};

export default SuborgsPage;
