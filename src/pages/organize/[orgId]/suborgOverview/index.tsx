import Head from 'next/head';
import { FC, Suspense } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SuborgOverviewLayout from 'features/organizations/layouts/SuborgOverviewLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';
import SuborgsList from 'features/organizations/components/SuborgsList';
import useOrganization from 'features/organizations/hooks/useOrganization';

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

const SuborgCard: FC<{ orgId: number }> = ({ orgId }) => {
  const organization = useOrganization(orgId).data;
  if (!organization) {
    return null;
  }

  return (
    <Paper>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5">{organization.title}</Typography>
        <Typography>{organization.email}</Typography>
      </Box>
    </Paper>
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <SuborgCard orgId={parsedOrgId} />
          </Suspense>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <SuborgsList orgId={parsedOrgId} />
          </Suspense>
        </Box>
      </Box>
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <SuborgOverviewLayout>{page}</SuborgOverviewLayout>;
};

export default SuborgsPage;
